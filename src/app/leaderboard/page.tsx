'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import apiClient from '@/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Search, Medal, Clock, Calendar, MapPin,
    ArrowRight, Loader2, Sparkles, Share2, Check, ChevronDown, Activity, Flame
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface LeaderboardEntry {
    rank: number;
    username: string;
    timing: string;
    timeInSeconds: number;
    gapFromLeader: string;
}

interface Leaderboard {
    _id: string;
    title: string;
    category: string;
    totalAthletes: number;
    publishedAt: string;
    createdAt: string;
    event?: {
        _id: string;
        name: string;
        date: string;
        venue?: {
            address: string;
        };
    };
    entries: LeaderboardEntry[];
}

function PublicLeaderboardContent() {
    const searchParams = useSearchParams();
    const queryId = searchParams.get('id');

    const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
    const [selectedLeaderboard, setSelectedLeaderboard] = useState<Leaderboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchLeaderboards = async () => {
            setLoading(true);
            try {
                const res = await apiClient.get('leaderboard');
                const list: Leaderboard[] = res.data?.data || [];
                setLeaderboards(list);

                if (list.length > 0) {
                    if (queryId) {
                        const target = list.find((item) => item._id === queryId);
                        setSelectedLeaderboard(target || list[0]);
                    } else {
                        setSelectedLeaderboard(list[0]);
                    }
                }
            } catch (err) {
                console.error('Failed to load leaderboards', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboards();
    }, [queryId]);

    const handleSelectLeaderboard = (id: string) => {
        const target = leaderboards.find((item) => item._id === id);
        if (target) {
            setSelectedLeaderboard(target);
            setSearchTerm('');
            const url = new URL(window.location.href);
            url.searchParams.set('id', id);
            window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
        }
    };

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Filter entries by search
    const filteredEntries = useMemo(() => {
        if (!selectedLeaderboard) return [];
        const term = searchTerm.toLowerCase().trim();
        if (!term) return selectedLeaderboard.entries || [];

        return (selectedLeaderboard.entries || []).filter(
            (entry) =>
                entry.username.toLowerCase().includes(term) ||
                entry.rank.toString() === term ||
                entry.timing.includes(term)
        );
    }, [selectedLeaderboard, searchTerm]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-[#f82506]" size={40} />
            </div>
        );
    }

    if (leaderboards.length === 0 || !selectedLeaderboard) {
        return (
            <div className="min-h-screen pt-32 pb-24 px-4 bg-black flex items-center justify-center">
                <div className="max-w-md mx-auto text-center glass-card p-10 border-white/5 rounded-3xl">
                    <Trophy size={48} className="mx-auto text-zinc-800 mb-4" />
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">
                        NO RESULTS PUBLISHED YET
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed mb-6">
                        Official race rankings will be published here immediately following event verification.
                    </p>
                    <Link
                        href="/events"
                        className="inline-flex items-center gap-2 bg-[#f82506] text-white px-6 py-3 rounded-xl font-black italic uppercase text-xs tracking-wider hover:bg-[#d61e04] transition-all"
                    >
                        Explore Upcoming Races <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        );
    }

    const podium = selectedLeaderboard.entries ? selectedLeaderboard.entries.slice(0, 3) : [];
    const firstPlace = podium[0];
    const secondPlace = podium[1];
    const thirdPlace = podium[2];

    return (
        <div className="min-h-screen pt-28 md:pt-36 pb-28 md:pb-24 px-4 bg-black">
            <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
                {/* Hero Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f82506]/10 border border-[#f82506]/30 text-[#f82506] text-[10px] md:text-xs font-black uppercase tracking-[0.25em]"
                    >
                        <Flame size={14} /> OFFICIAL ATHLiON STANDINGS
                    </motion.div>

                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                        RACE <span className="text-[#f82506] drop-shadow-[0_0_30px_rgba(248,37,6,0.3)]">LEADERBOARD</span>
                    </h1>

                    <p className="text-gray-400 text-xs md:text-base font-bold uppercase tracking-wider max-w-xl mx-auto">
                        Official verified completion times and podium standings across India.
                    </p>
                </div>

                {/* Event Selector & Actions Bar */}
                <div className="glass-card p-4 md:p-6 border-white/5 bg-zinc-950/60 rounded-3xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Leaderboard Switcher */}
                    <div className="relative flex-1 max-w-xl">
                        <select
                            value={selectedLeaderboard._id}
                            onChange={(e) => handleSelectLeaderboard(e.target.value)}
                            className="w-full appearance-none bg-black/80 border border-white/10 rounded-2xl py-3.5 pl-5 pr-10 text-sm font-bold uppercase tracking-wider text-white outline-none focus:border-[#f82506]/50 transition-all cursor-pointer"
                        >
                            {leaderboards.map((lb) => (
                                <option key={lb._id} value={lb._id} className="bg-zinc-900 text-white">
                                    {lb.title} {lb.event?.name ? `(${lb.event.name})` : ''} — {lb.category}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                    </div>

                    {/* Metadata & Share */}
                    <div className="flex items-center justify-between md:justify-end gap-4 text-xs">
                        <div className="text-gray-500 font-bold uppercase tracking-wider">
                            <span className="text-white font-mono font-black">{selectedLeaderboard.entries?.length || 0}</span> Athletes Finished
                        </div>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#f82506]/40 text-gray-300 hover:text-white font-black italic uppercase tracking-wider text-[11px] transition-all"
                        >
                            {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                            {copied ? 'Link Copied!' : 'Share'}
                        </button>
                    </div>
                </div>

                {/* TOP 3 PODIUM SHOWCASE */}
                {podium.length > 0 && (
                    <div className="pt-8 md:pt-12">
                        <div className="text-center mb-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 block mb-1">
                                Podiums
                            </span>
                            <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tight text-white">
                                TOP 3 FINISHERS
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-end max-w-5xl mx-auto">
                            {/* 🥈 2ND PLACE (SILVER) */}
                            {secondPlace && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="order-2 md:order-1 glass-card p-6 border-gray-400/20 bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 rounded-3xl text-center space-y-4 shadow-xl flex flex-col justify-between h-[280px]"
                                >
                                    <div className="space-y-2">
                                        <div className="w-16 h-16 rounded-2xl bg-zinc-800 border-2 border-gray-300/40 flex items-center justify-center text-3xl font-black text-gray-200 mx-auto shadow-md">
                                            🥈
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                                            2nd Place • Silver
                                        </span>
                                        <h3 className="text-xl font-black italic uppercase text-white truncate px-2">
                                            {secondPlace.username}
                                        </h3>
                                    </div>

                                    <div className="bg-black/60 rounded-2xl p-3 border border-white/5 space-y-1">
                                        <div className="font-mono text-2xl font-black italic text-gray-200">
                                            {secondPlace.timing}
                                        </div>
                                        <div className="text-[11px] font-mono text-gray-500">
                                            Gap: {secondPlace.gapFromLeader}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* 🥇 1ST PLACE (GOLD CHAMPION) */}
                            {firstPlace && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="order-1 md:order-2 glass-card p-8 border-amber-500/50 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black rounded-3xl text-center space-y-4 shadow-2xl shadow-amber-500/10 flex flex-col justify-between h-[330px] relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

                                    <div className="space-y-2">
                                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center text-4xl font-black text-black mx-auto shadow-xl shadow-amber-500/30">
                                            👑
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-[0.25em] text-amber-400 flex items-center justify-center gap-1.5">
                                            <Sparkles size={14} /> 1ST PLACE CHAMPION
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-black italic uppercase text-white truncate px-2">
                                            {firstPlace.username}
                                        </h3>
                                    </div>

                                    <div className="bg-black/80 rounded-2xl p-4 border border-amber-500/30 space-y-1 shadow-inner">
                                        <div className="font-mono text-3xl font-black italic text-amber-300">
                                            {firstPlace.timing}
                                        </div>
                                        <div className="text-xs font-bold uppercase tracking-widest text-amber-500/80">
                                            Winning Finish Split
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* 🥉 3RD PLACE (BRONZE) */}
                            {thirdPlace && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="order-3 glass-card p-6 border-amber-800/20 bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 rounded-3xl text-center space-y-4 shadow-xl flex flex-col justify-between h-[280px]"
                                >
                                    <div className="space-y-2">
                                        <div className="w-16 h-16 rounded-2xl bg-zinc-800 border-2 border-amber-700/40 flex items-center justify-center text-3xl font-black text-amber-600 mx-auto shadow-md">
                                            🥉
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">
                                            3rd Place • Bronze
                                        </span>
                                        <h3 className="text-xl font-black italic uppercase text-white truncate px-2">
                                            {thirdPlace.username}
                                        </h3>
                                    </div>

                                    <div className="bg-black/60 rounded-2xl p-3 border border-white/5 space-y-1">
                                        <div className="font-mono text-2xl font-black italic text-gray-200">
                                            {thirdPlace.timing}
                                        </div>
                                        <div className="text-[11px] font-mono text-gray-500">
                                            Gap: {thirdPlace.gapFromLeader}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}

                {/* FULL RANKINGS SECTION */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                        <div>
                            <h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tight text-white">
                                ALL ATHLETE RANKINGS
                            </h3>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                                Ordered from fastest to slowest finish time
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search your username or rank..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-[#f82506]/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Rankings Table */}
                    <div className="glass-card overflow-hidden border-white/5 bg-zinc-950/60 rounded-3xl">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] bg-white/[0.02]">
                                    <th className="py-5 pl-6 md:pl-8">Rank</th>
                                    <th className="py-5">Athlete</th>
                                    <th className="py-5">Finish Timing</th>
                                    <th className="py-5 hidden sm:table-cell">Behind Leader</th>
                                    <th className="py-5 pr-6 md:pr-8 text-right">Standing</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredEntries.map((entry) => {
                                    const isTop3 = entry.rank <= 3;
                                    const isHighlighted =
                                        searchTerm &&
                                        entry.username.toLowerCase().includes(searchTerm.toLowerCase());

                                    return (
                                        <tr
                                            key={entry.rank}
                                            className={`transition-colors ${
                                                isHighlighted
                                                    ? 'bg-[#f82506]/10'
                                                    : 'hover:bg-white/[0.015]'
                                            }`}
                                        >
                                            {/* Rank */}
                                            <td className="py-5 pl-6 md:pl-8">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs md:text-sm ${
                                                            entry.rank === 1
                                                                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/30'
                                                                : entry.rank === 2
                                                                ? 'bg-zinc-700 text-white'
                                                                : entry.rank === 3
                                                                ? 'bg-amber-900 text-amber-200'
                                                                : 'bg-zinc-900 border border-white/5 text-gray-400 font-mono'
                                                        }`}
                                                    >
                                                        {entry.rank}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Username */}
                                            <td className="py-5">
                                                <div className="font-black italic uppercase text-sm md:text-base text-white">
                                                    {entry.username}
                                                </div>
                                            </td>

                                            {/* Timing */}
                                            <td className="py-5">
                                                <span className="font-mono font-black text-sm md:text-base text-white">
                                                    {entry.timing}
                                                </span>
                                            </td>

                                            {/* Gap */}
                                            <td className="py-5 hidden sm:table-cell">
                                                <span className="font-mono text-xs text-gray-400">
                                                    {entry.gapFromLeader}
                                                </span>
                                            </td>

                                            {/* Standing Badge */}
                                            <td className="py-5 pr-6 md:pr-8 text-right">
                                                <span
                                                    className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                                                        entry.rank === 1
                                                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                                            : isTop3
                                                            ? 'bg-white/10 text-white border border-white/20'
                                                            : entry.rank <= 10
                                                            ? 'bg-[#f82506]/10 text-[#f82506] border border-[#f82506]/20'
                                                            : 'bg-zinc-900 text-gray-500'
                                                    }`}
                                                >
                                                    {entry.rank === 1
                                                        ? 'Winner'
                                                        : isTop3
                                                        ? 'Podium'
                                                        : entry.rank <= 10
                                                        ? 'Top 10'
                                                        : 'Finisher'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredEntries.length === 0 && (
                            <div className="py-16 text-center">
                                <Activity size={32} className="mx-auto text-zinc-800 mb-3" />
                                <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">
                                    No athletes found matching &ldquo;{searchTerm}&rdquo;
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PublicLeaderboardPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-black">
                    <Loader2 className="animate-spin text-[#f82506]" size={40} />
                </div>
            }
        >
            <PublicLeaderboardContent />
        </Suspense>
    );
}
