'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Upload, FileText, CheckCircle2, AlertTriangle,
    Loader2, Trash2, Eye, Globe, Lock, ArrowRight,
    RefreshCw, Download, Sparkles, Medal, Clock, Users, X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ParsedEntry {
    rank: number;
    username: string;
    timing: string;
    timeInSeconds: number;
    gapFromLeader: string;
}

interface EventItem {
    _id: string;
    name: string;
    date: string;
    status: string;
}

interface LeaderboardItem {
    _id: string;
    title: string;
    category: string;
    isPublished: boolean;
    publishedAt?: string;
    totalAthletes: number;
    sourceFileName?: string;
    createdAt: string;
    event?: {
        _id: string;
        name: string;
        date: string;
    };
    entries: ParsedEntry[];
}

export default function AdminLeaderboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [events, setEvents] = useState<EventItem[]>([]);
    const [leaderboards, setLeaderboards] = useState<LeaderboardItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [title, setTitle] = useState('');
    const [selectedEventId, setSelectedEventId] = useState('');
    const [category, setCategory] = useState('Overall');
    const [sourceFileName, setSourceFileName] = useState('');

    // Parser states
    const [isParsing, setIsParsing] = useState(false);
    const [parseError, setParseError] = useState('');
    const [parsedEntries, setParsedEntries] = useState<ParsedEntry[]>([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Tabs
    const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [eventsRes, leaderboardsRes] = await Promise.all([
                apiClient.get('events'),
                apiClient.get('leaderboard/admin/all').catch(() => ({ data: { data: [] } }))
            ]);

            setEvents(eventsRes.data?.data || []);
            setLeaderboards(leaderboardsRes.data?.data || []);
        } catch (err) {
            console.error('Failed to load initial leaderboard data', err);
        } finally {
            setLoading(false);
        }
    };

    // Helper: Parse human or Excel time string into float seconds
    const parseTimeToSeconds = (rawTime: any): number => {
        if (rawTime === null || rawTime === undefined) return 999999;

        // If number
        if (typeof rawTime === 'number') {
            // Excel serial time fraction of a day (e.g., 0.0294)
            if (rawTime > 0 && rawTime < 1) {
                return Math.round(rawTime * 86400 * 100) / 100;
            }
            return rawTime;
        }

        const str = String(rawTime).trim().toLowerCase();

        // Keyword formats like "42m 15s" or "1h 10m 20s"
        const hourMatch = str.match(/(\d+)\s*(?:h|hr|hours?)/);
        const minMatch = str.match(/(\d+)\s*(?:m|min|mins?|minutes?)/);
        const secMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:s|sec|secs?|seconds?)/);

        if (hourMatch || minMatch || secMatch) {
            const h = hourMatch ? parseFloat(hourMatch[1]) : 0;
            const m = minMatch ? parseFloat(minMatch[1]) : 0;
            const s = secMatch ? parseFloat(secMatch[1]) : 0;
            return h * 3600 + m * 60 + s;
        }

        // Standard colon formats: "HH:MM:SS.ms" or "MM:SS.ms"
        if (str.includes(':')) {
            const parts = str.split(':').map((p) => parseFloat(p.trim()));
            if (parts.some(isNaN)) return 999999;

            if (parts.length === 3) {
                // HH:MM:SS
                return parts[0] * 3600 + parts[1] * 60 + parts[2];
            } else if (parts.length === 2) {
                // MM:SS
                return parts[0] * 60 + parts[1];
            }
        }

        // Fallback: raw numeric string
        const num = parseFloat(str);
        if (!isNaN(num)) return num;

        return 999999;
    };

    // Helper: Format seconds back to clean display string
    const formatSecondsToDisplay = (secs: number): string => {
        if (secs >= 999999) return 'DNF';
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);
        const seconds = Math.floor(secs % 60);
        const ms = Math.round((secs % 1) * 10);

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${ms > 0 ? `.${ms}` : ''}`;
    };

    // Parse CSV locally without external library
    const parseCSVText = (text: string): { username: string; rawTime: string }[] => {
        const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
        if (lines.length < 2) return [];

        const delimiter = lines[0].includes(';') ? ';' : lines[0].includes('\t') ? '\t' : ',';
        const header = lines[0].split(delimiter).map((h) => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));

        let userIdx = header.findIndex((h) => h.includes('user') || h.includes('name') || h.includes('athlete'));
        let timeIdx = header.findIndex((h) => h.includes('time') || h.includes('timing') || h.includes('duration') || h.includes('finish'));

        if (userIdx === -1) userIdx = 0;
        if (timeIdx === -1) timeIdx = 1;

        const results: { username: string; rawTime: string }[] = [];

        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ''));
            const username = cols[userIdx] || '';
            const rawTime = cols[timeIdx] || '';

            if (username && rawTime) {
                results.push({ username, rawTime });
            }
        }

        return results;
    };

    // Dynamically load SheetJS for .xlsx / .xls files
    const loadXLSXLibrary = async (): Promise<any> => {
        if ((window as any).XLSX) return (window as any).XLSX;
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
            script.onload = () => resolve((window as any).XLSX);
            script.onerror = () => reject(new Error('Failed to load SheetJS Excel library'));
            document.head.appendChild(script);
        });
    };

    const handleFileUpload = async (file: File) => {
        setParseError('');
        setSuccessMessage('');
        setIsParsing(true);
        setSourceFileName(file.name);

        // Auto-generate title if empty
        if (!title.trim()) {
            const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            setTitle(`ATHLiON Leaderboard - ${cleanName}`);
        }

        try {
            let rawRows: { username: string; rawTime: any }[] = [];
            const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

            if (isExcel) {
                const XLSX = await loadXLSXLibrary();
                const arrayBuffer = await file.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (jsonData.length < 2) {
                    throw new Error('Excel sheet does not contain enough data rows.');
                }

                const headers: string[] = (jsonData[0] as any[]).map((h) => String(h || '').trim().toLowerCase());
                let userIdx = headers.findIndex((h) => h.includes('user') || h.includes('name') || h.includes('athlete'));
                let timeIdx = headers.findIndex((h) => h.includes('time') || h.includes('timing') || h.includes('duration') || h.includes('finish'));

                if (userIdx === -1) userIdx = 0;
                if (timeIdx === -1) timeIdx = 1;

                for (let i = 1; i < jsonData.length; i++) {
                    const row: any[] = jsonData[i] as any[];
                    if (!row || row.length === 0) continue;
                    const username = row[userIdx] !== undefined ? String(row[userIdx]).trim() : '';
                    const rawTime = row[timeIdx] !== undefined ? row[timeIdx] : '';
                    if (username && rawTime !== '') {
                        rawRows.push({ username, rawTime });
                    }
                }
            } else {
                // CSV or plain text
                const text = await file.text();
                rawRows = parseCSVText(text);
            }

            if (rawRows.length === 0) {
                throw new Error('No valid athlete rows detected. Please ensure your file has two columns: "username" and "timing".');
            }

            // Convert and sort: fastest/least time = Rank 1
            const parsed = rawRows.map((row) => {
                const timeInSeconds = parseTimeToSeconds(row.rawTime);
                const displayTiming = formatSecondsToDisplay(timeInSeconds);
                return {
                    username: row.username,
                    timing: displayTiming,
                    timeInSeconds,
                };
            });

            // Ascending sort by time
            parsed.sort((a, b) => a.timeInSeconds - b.timeInSeconds);

            // Compute sequential ranks and time split gaps
            const fastestSeconds = parsed[0]?.timeInSeconds || 0;
            const finalized: ParsedEntry[] = parsed.map((item, idx) => {
                const rank = idx + 1;
                const gapDiff = Math.max(0, item.timeInSeconds - fastestSeconds);
                const gapMins = Math.floor(gapDiff / 60);
                const gapSecs = Math.floor(gapDiff % 60);
                const gapFromLeader = gapDiff === 0
                    ? '+00:00'
                    : `+${gapMins.toString().padStart(2, '0')}:${gapSecs.toString().padStart(2, '0')}`;

                return {
                    rank,
                    username: item.username,
                    timing: item.timing,
                    timeInSeconds: item.timeInSeconds,
                    gapFromLeader,
                };
            });

            setParsedEntries(finalized);
        } catch (err: any) {
            console.error('File parsing error:', err);
            setParseError(err.message || 'Failed to parse Excel file. Please verify column formatting.');
            setParsedEntries([]);
        } finally {
            setIsParsing(false);
        }
    };

    const handleSaveLeaderboard = async (isPublished: boolean) => {
        if (!title.trim()) {
            alert('Please provide a title for this leaderboard.');
            return;
        }

        if (parsedEntries.length === 0) {
            alert('No athlete entries to save. Please upload a valid file first.');
            return;
        }

        setIsPublishing(true);
        try {
            const payload = {
                title: title.trim(),
                eventId: selectedEventId || undefined,
                category,
                entries: parsedEntries,
                sourceFileName,
                isPublished,
            };

            const res = await apiClient.post('leaderboard', payload);
            if (res.data?.success) {
                setSuccessMessage(
                    isPublished
                        ? '🎉 Leaderboard successfully published to the website!'
                        : '💾 Leaderboard saved as draft.'
                );
                // Reset form
                setParsedEntries([]);
                setTitle('');
                setSourceFileName('');
                fetchInitialData();
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to save leaderboard');
        } finally {
            setIsPublishing(false);
        }
    };

    const handleTogglePublish = async (id: string) => {
        try {
            await apiClient.patch(`leaderboard/${id}/publish`);
            fetchInitialData();
        } catch (err) {
            alert('Failed to toggle publish status');
        }
    };

    const handleDeleteLeaderboard = async (id: string) => {
        if (!confirm('Are you sure you want to delete this leaderboard?')) return;
        try {
            await apiClient.delete(`leaderboard/${id}`);
            fetchInitialData();
        } catch (err) {
            alert('Failed to delete leaderboard');
        }
    };

    const downloadSampleTemplate = () => {
        const sampleContent = 'username,timing\narjun_patel,00:38:15\nrohit_deshmukh,00:39:42\npriya_sharma,00:41:05\nvikram_singh,00:42:18\nneha_kulkarni,00:45:30\n';
        const blob = new Blob([sampleContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'athlion_leaderboard_template.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-[#f82506]" size={40} />
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 gap-6">
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`pb-4 font-black uppercase text-xs tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === 'upload'
                            ? 'border-[#f82506] text-white'
                            : 'border-transparent text-gray-500 hover:text-white'
                    }`}
                >
                    <Upload size={16} className={activeTab === 'upload' ? 'text-[#f82506]' : ''} />
                    Upload & Rank Excel
                </button>
                <button
                    onClick={() => setActiveTab('manage')}
                    className={`pb-4 font-black uppercase text-xs tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === 'manage'
                            ? 'border-[#f82506] text-white'
                            : 'border-transparent text-gray-500 hover:text-white'
                    }`}
                >
                    <Trophy size={16} className={activeTab === 'manage' ? 'text-[#f82506]' : ''} />
                    All Leaderboards ({leaderboards.length})
                </button>
            </div>

            {/* TAB 1: UPLOAD & PROCESS */}
            {activeTab === 'upload' && (
                <div className="space-y-6">
                    {/* Top Alert / Success banner */}
                    <AnimatePresence>
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between text-emerald-400 font-bold text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} />
                                    <span>{successMessage}</span>
                                </div>
                                <Link
                                    href="/leaderboard"
                                    target="_blank"
                                    className="bg-emerald-500 text-black px-3 py-1 rounded-xl text-xs font-black uppercase hover:bg-emerald-400 transition-all flex items-center gap-1"
                                >
                                    View Live <ArrowRight size={12} />
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Step 1: Upload Form Card */}
                    <div className="glass-card p-6 md:p-8 border-white/5 bg-zinc-950/60 rounded-3xl space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-black italic uppercase tracking-tight text-white flex items-center gap-2.5">
                                    <Trophy size={20} className="text-[#f82506]" />
                                    Upload Race Excel Sheet
                                </h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                                    Upload an Excel (.xlsx / .xls) or CSV sheet containing <span className="text-[#f82506]">username</span> and <span className="text-[#f82506]">timing</span>.
                                </p>
                            </div>

                            <button
                                onClick={downloadSampleTemplate}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#f82506]/40 text-gray-300 hover:text-white text-xs font-black uppercase tracking-wider transition-all"
                            >
                                <Download size={14} className="text-[#f82506]" />
                                Download Sample Template
                            </button>
                        </div>

                        {/* Configuration Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                                    Leaderboard Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Pune Wave 1 - Men Elite"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#f82506]/50 transition-all font-medium"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                                    Associated Event (Optional)
                                </label>
                                <select
                                    value={selectedEventId}
                                    onChange={(e) => setSelectedEventId(e.target.value)}
                                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#f82506]/50 transition-all font-medium"
                                >
                                    <option value="">General / No Specific Event</option>
                                    {events.map((evt) => (
                                        <option key={evt._id} value={evt._id}>
                                            {evt.name} ({new Date(evt.date).toLocaleDateString()})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#f82506]/50 transition-all font-medium"
                                >
                                    <option value="Overall">Overall</option>
                                    <option value="Elite">Elite Division</option>
                                    <option value="Classical">Classical Division</option>
                                    <option value="Men">Men Division</option>
                                    <option value="Women">Women Division</option>
                                    <option value="Open">Open Community</option>
                                </select>
                            </div>
                        </div>

                        {/* Drag and Drop Zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file) handleFileUpload(file);
                            }}
                            className="border-2 border-dashed border-white/10 hover:border-[#f82506]/50 rounded-2xl p-8 md:p-12 text-center bg-black/40 hover:bg-[#f82506]/[0.02] transition-all cursor-pointer group"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file);
                                }}
                                className="hidden"
                            />

                            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-[#f82506]/40 transition-all">
                                {isParsing ? (
                                    <Loader2 size={28} className="animate-spin text-[#f82506]" />
                                ) : (
                                    <Upload size={28} className="text-[#f82506]" />
                                )}
                            </div>

                            <p className="text-sm font-black uppercase tracking-wider text-white">
                                {isParsing ? 'Processing Excel Data...' : 'Drop your Excel or CSV file here, or browse'}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-2">
                                Supports .xlsx, .xls, and .csv with columns: <span className="text-gray-300">username, timing</span>
                            </p>
                            {sourceFileName && (
                                <div className="mt-4 inline-flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-gray-300">
                                    <FileText size={14} className="text-[#f82506]" />
                                    <span>{sourceFileName}</span>
                                </div>
                            )}
                        </div>

                        {parseError && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-xs font-bold text-red-400 flex items-center gap-2">
                                <AlertTriangle size={16} />
                                <span>{parseError}</span>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Interactive Preview Leaderboard */}
                    {parsedEntries.length > 0 && (
                        <div className="space-y-6">
                            {/* Sticky Approval Banner */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card p-5 md:p-6 border-[#f82506]/40 bg-zinc-950/90 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 sticky top-24 z-30 backdrop-blur-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#f82506]/10 border border-[#f82506]/30 flex items-center justify-center text-[#f82506]">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-black italic uppercase tracking-tight text-white text-base">
                                            Preview Ready: {parsedEntries.length} Athletes Ranked
                                        </h3>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                                            Review the podium and timings below. Ready to publish to website?
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => handleSaveLeaderboard(false)}
                                        disabled={isPublishing}
                                        className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-gray-300 font-black italic uppercase text-xs tracking-wider transition-all disabled:opacity-50"
                                    >
                                        Save Draft
                                    </button>

                                    <button
                                        onClick={() => handleSaveLeaderboard(true)}
                                        disabled={isPublishing}
                                        className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-[#f82506] hover:bg-[#d61e04] text-white font-black italic uppercase text-xs tracking-wider transition-all shadow-lg shadow-[#f82506]/30 flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-105 active:scale-95"
                                    >
                                        {isPublishing ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Globe size={16} />
                                        )}
                                        Publish This Leaderboard
                                    </button>

                                    <button
                                        onClick={() => {
                                            setParsedEntries([]);
                                            setSourceFileName('');
                                        }}
                                        className="p-3 text-gray-500 hover:text-white"
                                        title="Discard preview"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </motion.div>

                            {/* Preview Top 3 Podium Highlights */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* 2nd Place */}
                                <div className="glass-card p-5 border-white/10 bg-zinc-950/40 rounded-2xl flex items-center gap-4 order-2 md:order-1">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-gray-400/30 flex items-center justify-center text-xl font-black text-gray-300">
                                        🥈 2
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">2nd Place (Silver)</p>
                                        <p className="text-base font-black italic text-white truncate">
                                            {parsedEntries[1]?.username || 'N/A'}
                                        </p>
                                        <p className="text-xs font-mono font-bold text-gray-300 mt-0.5">
                                            {parsedEntries[1]?.timing || '--:--'} <span className="text-gray-500 font-normal">({parsedEntries[1]?.gapFromLeader})</span>
                                        </p>
                                    </div>
                                </div>

                                {/* 1st Place Champion */}
                                <div className="glass-card p-6 border-amber-500/40 bg-zinc-950/60 rounded-2xl flex items-center gap-4 order-1 md:order-2 shadow-xl shadow-amber-500/10">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl font-black text-black shadow-lg shadow-amber-500/20">
                                        👑 1
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                                            <Sparkles size={12} /> Champion (Gold)
                                        </span>
                                        <p className="text-lg font-black italic text-white truncate">
                                            {parsedEntries[0]?.username || 'N/A'}
                                        </p>
                                        <p className="text-sm font-mono font-black text-amber-300 mt-0.5">
                                            {parsedEntries[0]?.timing || '--:--'}
                                        </p>
                                    </div>
                                </div>

                                {/* 3rd Place */}
                                <div className="glass-card p-5 border-white/10 bg-zinc-950/40 rounded-2xl flex items-center gap-4 order-3">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-amber-800/40 flex items-center justify-center text-xl font-black text-amber-600">
                                        🥉 3
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">3rd Place (Bronze)</p>
                                        <p className="text-base font-black italic text-white truncate">
                                            {parsedEntries[2]?.username || 'N/A'}
                                        </p>
                                        <p className="text-xs font-mono font-bold text-gray-300 mt-0.5">
                                            {parsedEntries[2]?.timing || '--:--'} <span className="text-gray-500 font-normal">({parsedEntries[2]?.gapFromLeader})</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Full Rankings Preview Table */}
                            <div className="glass-card overflow-hidden border-white/5 bg-zinc-950/40 rounded-3xl">
                                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-300">
                                        Full Rankings Preview ({parsedEntries.length} Athletes)
                                    </h4>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                        Sorted Ascending (Least Time = Higher Rank)
                                    </span>
                                </div>

                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] bg-white/[0.01]">
                                            <th className="py-4 pl-8">Rank</th>
                                            <th className="py-4">Athlete Username</th>
                                            <th className="py-4">Finish Time</th>
                                            <th className="py-4">Split Behind Leader</th>
                                            <th className="py-4 pr-8 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {parsedEntries.map((entry) => (
                                            <tr key={entry.rank} className="hover:bg-white/[0.015] transition-colors">
                                                <td className="py-4 pl-8">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                                                                entry.rank === 1
                                                                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                                                                    : entry.rank === 2
                                                                    ? 'bg-zinc-700 text-white'
                                                                    : entry.rank === 3
                                                                    ? 'bg-amber-900/60 text-amber-300 border border-amber-800'
                                                                    : 'bg-zinc-900 text-gray-400 font-mono'
                                                            }`}
                                                        >
                                                            {entry.rank}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className="font-bold text-sm text-white">
                                                        {entry.username}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <span className="font-mono font-black text-sm text-white">
                                                        {entry.timing}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <span className="font-mono text-xs text-gray-500">
                                                        {entry.gapFromLeader}
                                                    </span>
                                                </td>
                                                <td className="py-4 pr-8 text-right">
                                                    <span
                                                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                            entry.rank <= 3
                                                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                                                : 'bg-zinc-900 text-gray-500'
                                                        }`}
                                                    >
                                                        {entry.rank <= 3 ? 'Podium' : 'Finisher'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: MANAGE ALL LEADERBOARDS */}
            {activeTab === 'manage' && (
                <div className="space-y-4">
                    {leaderboards.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {leaderboards.map((lb) => (
                                <motion.div
                                    key={lb._id}
                                    layout
                                    className={`glass-card p-6 border-white/5 rounded-3xl bg-zinc-950/40 transition-all flex flex-col justify-between ${
                                        lb.isPublished ? 'border-emerald-500/20' : 'border-amber-500/20'
                                    }`}
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <span
                                                className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                                                    lb.isPublished
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                                }`}
                                            >
                                                {lb.isPublished ? 'Live Published' : 'Draft'}
                                            </span>
                                            <span className="text-[10px] font-mono text-gray-500">
                                                {new Date(lb.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h3 className="font-black italic uppercase text-lg text-white mb-1">
                                            {lb.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">
                                            {lb.event?.name || 'General Event'} • {lb.category}
                                        </p>

                                        <div className="bg-black/60 rounded-xl p-3 border border-white/5 flex items-center justify-between text-xs mb-4">
                                            <span className="text-gray-500 font-bold uppercase tracking-wider">Total Athletes</span>
                                            <span className="font-mono font-black text-white">{lb.totalAthletes || lb.entries?.length || 0}</span>
                                        </div>

                                        {/* Top Finisher snippet */}
                                        {lb.entries?.[0] && (
                                            <div className="text-[11px] text-gray-400 mb-4 bg-zinc-900/60 p-2.5 rounded-xl border border-white/5">
                                                <span className="text-amber-400 font-black">👑 #1 Winner: </span>
                                                <span className="text-white font-bold">{lb.entries[0].username}</span>
                                                <span className="font-mono text-gray-500 ml-1.5">({lb.entries[0].timing})</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                                        <button
                                            onClick={() => handleTogglePublish(lb._id)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                                lb.isPublished
                                                    ? 'bg-zinc-900 hover:bg-zinc-800 text-gray-400'
                                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                            }`}
                                        >
                                            {lb.isPublished ? <Lock size={12} /> : <Globe size={12} />}
                                            {lb.isPublished ? 'Unpublish' : 'Publish'}
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {lb.isPublished && (
                                                <Link
                                                    href={`/leaderboard?id=${lb._id}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                                    title="View Public Page"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                            )}

                                            <button
                                                onClick={() => handleDeleteLeaderboard(lb._id)}
                                                className="p-2 text-gray-600 hover:text-red-500 rounded-lg hover:bg-white/5 transition-colors"
                                                title="Delete Leaderboard"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 glass-card border-white/5 rounded-3xl bg-zinc-950/40">
                            <Trophy size={36} className="mx-auto text-zinc-800 mb-4" />
                            <p className="text-gray-400 font-bold uppercase tracking-wider text-sm mb-2">
                                No leaderboards created yet.
                            </p>
                            <p className="text-gray-600 text-xs mb-6">
                                Upload your first Excel race sheet to rank athletes and publish results.
                            </p>
                            <button
                                onClick={() => setActiveTab('upload')}
                                className="bg-[#f82506] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#d61e04] transition-all"
                            >
                                Upload Excel Sheet →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
