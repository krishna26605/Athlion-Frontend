'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Upload, FileSpreadsheet, Users, Loader2, CheckCircle, XCircle,
    Search, ChevronDown, Phone, MapPin, Clock, AlertCircle
} from 'lucide-react';

interface Lead {
    _id: string;
    gymName: string;
    ownerName: string;
    phone: string;
    city: string;
    status: string;
    preferredLanguage: string;
    meetingDate?: string;
    meetingTime?: string;
    callbackDate?: string;
    callbackTime?: string;
    campaign: { _id: string; name: string; status: string };
    createdAt: string;
}

interface Campaign {
    _id: string;
    name: string;
    status: string;
    leadsCount: number;
}

export default function LeadsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [leads, setLeads] = useState<Lead[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [uploadResult, setUploadResult] = useState<{ created: number; duplicates: number; errors: string[] } | null>(null);
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [selectedCampaign, statusFilter, pagination.page]);

    const fetchCampaigns = async () => {
        try {
            const res = await apiClient.get('admin/campaigns');
            setCampaigns(res.data.data);
        } catch (err) {
            console.error('Failed to fetch campaigns', err);
        }
    };

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { page: pagination.page.toString(), limit: '50' };
            if (selectedCampaign) params.campaignId = selectedCampaign;
            if (statusFilter) params.status = statusFilter;

            const res = await apiClient.get('admin/campaigns/leads', { params });
            setLeads(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error('Failed to fetch leads', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedCampaign) return;

        setUploading(true);
        setUploadResult(null);

        try {
            const text = await file.text();
            // Split lines and remove carriage returns and empty lines
            const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            
            if (rawLines.length < 2) {
                alert('CSV file must have at least a header row and one data row');
                setUploading(false);
                return;
            }

            // Detect delimiter (comma, semicolon, or tab)
            const firstLine = rawLines[0];
            let delimiter = ',';
            if (firstLine.includes(';')) delimiter = ';';
            else if (firstLine.includes('\t')) delimiter = '\t';

            // Split line respecting double quotes
            const splitCSVLine = (line: string) => {
                const result = [];
                let current = '';
                let inQuotes = false;
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === delimiter && !inQuotes) {
                        result.push(current.trim().replace(/^"|"$/g, ''));
                        current = '';
                    } else {
                        current += char;
                    }
                }
                result.push(current.trim().replace(/^"|"$/g, ''));
                return result;
            };

            // Parse headers
            const headerCols = splitCSVLine(firstLine);
            const cleanHeaders = headerCols.map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));

            // 1. Phone number mapping (most critical)
            let phoneIdx = cleanHeaders.findIndex(h => ['phone', 'phonenumber', 'mobile', 'mobilenumber', 'contactnumber', 'tel', 'telephone', 'ph'].includes(h));
            if (phoneIdx === -1) {
                phoneIdx = cleanHeaders.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('num') || h.includes('tel'));
            }

            // 2. Gym / Business Name mapping
            let gymIdx = cleanHeaders.findIndex(h => ['gym', 'gymname', 'business', 'businessname', 'company', 'companyname', 'studio', 'studioname', 'center'].includes(h));
            if (gymIdx === -1) {
                gymIdx = cleanHeaders.findIndex(h => h.includes('gym') || h.includes('business') || h.includes('company') || h.includes('studio'));
            }
            if (gymIdx === -1) {
                // Look for 'name' but make sure it doesn't refer to owner/manager
                gymIdx = cleanHeaders.findIndex(h => h.includes('name') && !h.includes('owner') && !h.includes('contact') && !h.includes('person') && !h.includes('client'));
            }

            // 3. Owner Name mapping
            let ownerIdx = cleanHeaders.findIndex(h => ['owner', 'ownername', 'ownerperson', 'contactperson', 'contactname', 'proprietor', 'manager'].includes(h));
            if (ownerIdx === -1) {
                ownerIdx = cleanHeaders.findIndex(h => h.includes('owner') || h.includes('contact') || h.includes('person') || h.includes('proprietor') || h.includes('manager'));
            }
            if (ownerIdx === -1) {
                // If there's a column named exactly "name", it's likely the owner/manager name
                ownerIdx = cleanHeaders.findIndex(h => h === 'name' || h === 'ownername');
            }
            if (ownerIdx === -1 && gymIdx !== -1) {
                // If gym name was found, look for any other column containing "name"
                ownerIdx = cleanHeaders.findIndex((h, idx) => idx !== gymIdx && h.includes('name'));
            }

            // 4. City mapping
            let cityIdx = cleanHeaders.findIndex(h => ['city', 'location', 'town', 'address'].includes(h));
            if (cityIdx === -1) {
                cityIdx = cleanHeaders.findIndex(h => h.includes('city') || h.includes('loc') || h.includes('addr'));
            }

            // 5. Email mapping
            let emailIdx = cleanHeaders.findIndex(h => ['email', 'emailaddress', 'mail', 'mailaddress'].includes(h));
            if (emailIdx === -1) {
                emailIdx = cleanHeaders.findIndex(h => h.includes('email') || h.includes('mail'));
            }

            // 6. State mapping
            let stateIdx = cleanHeaders.findIndex(h => ['state', 'province', 'region'].includes(h));
            if (stateIdx === -1) {
                stateIdx = cleanHeaders.findIndex(h => h.includes('state') || h.includes('prov'));
            }

            // 7. Language mapping
            let langIdx = cleanHeaders.findIndex(h => ['language', 'lang', 'preferredlanguage'].includes(h));
            if (langIdx === -1) {
                langIdx = cleanHeaders.findIndex(h => h.includes('lang'));
            }

            let hasHeaders = true;

            if (phoneIdx === -1) {
                const detectedPhoneIdx = headerCols.findIndex(val => {
                    const cleanVal = val.replace(/[^\d]/g, '');
                    return cleanVal.length >= 10 && cleanVal.length <= 13;
                });
                
                if (detectedPhoneIdx !== -1) {
                    // First line is actually a data row, treat the file as headerless
                    hasHeaders = false;
                    gymIdx = 0;
                    ownerIdx = 1;
                    phoneIdx = detectedPhoneIdx;
                    cityIdx = 3;
                    emailIdx = 4;
                    stateIdx = 5;
                    langIdx = 6;
                } else {
                    // Fallback positions
                    phoneIdx = Math.min(2, headerCols.length - 1);
                    if (gymIdx === -1) gymIdx = 0;
                    if (ownerIdx === -1) ownerIdx = 1;
                    console.log(`⚠️ Phone header not matched, falling back to column indices: gym=${gymIdx}, owner=${ownerIdx}, phone=${phoneIdx}`);
                }
            }

            // Parse data rows
            const leads = [];
            const startIdx = hasHeaders ? 1 : 0;

            for (let i = startIdx; i < rawLines.length; i++) {
                const cols = splitCSVLine(rawLines[i]);
                if (cols.length < 2) continue;

                const rawPhone = cols[phoneIdx] || '';
                if (!rawPhone.replace(/[^\d]/g, '')) continue; // Skip empty rows

                leads.push({
                    gymName: cols[gymIdx] || cols[0] || 'Unknown Gym',
                    ownerName: cols[ownerIdx] || cols[gymIdx === 0 ? 1 : 0] || 'Unknown',
                    phone: rawPhone,
                    city: cityIdx !== -1 && cols[cityIdx] ? cols[cityIdx] : 'Pune',
                    email: emailIdx !== -1 ? cols[emailIdx] : '',
                    state: stateIdx !== -1 ? cols[stateIdx] : 'Maharashtra',
                    preferredLanguage: langIdx !== -1 && cols[langIdx] ? cols[langIdx] : 'Hindi'
                });
            }

            if (leads.length === 0) {
                alert('No valid leads found in CSV. Please verify the phone number column.');
                setUploading(false);
                return;
            }

            const res = await apiClient.post('admin/campaigns/leads/upload', {
                campaignId: selectedCampaign,
                leads
            });

            setUploadResult(res.data.data);
            fetchLeads();
            fetchCampaigns();
        } catch (err) {
            console.error('CSV upload failed', err);
            alert('Upload failed. Check console for details.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const statusColors: Record<string, string> = {
        pending: 'text-gray-400 bg-gray-500/10',
        calling: 'text-blue-400 bg-blue-500/10',
        meeting_scheduled: 'text-emerald-400 bg-emerald-500/10',
        callback_scheduled: 'text-amber-400 bg-amber-500/10',
        interested: 'text-green-400 bg-green-500/10',
        not_interested: 'text-red-400 bg-red-500/10',
        no_answer: 'text-orange-400 bg-orange-500/10',
        busy: 'text-yellow-400 bg-yellow-500/10',
        wrong_contact: 'text-pink-400 bg-pink-500/10',
        completed: 'text-blue-300 bg-blue-400/10',
        failed: 'text-red-500 bg-red-500/10',
    };

    const filteredLeads = leads.filter(l =>
        !searchQuery ||
        l.gymName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.phone.includes(searchQuery)
    );

    if (authLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Upload Section */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                <h3 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Upload size={16} className="text-emerald-400" /> Upload Leads
                </h3>

                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Select Campaign *</label>
                        <select
                            value={selectedCampaign}
                            onChange={(e) => setSelectedCampaign(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
                        >
                            <option value="">Choose a campaign...</option>
                            {campaigns.map(c => (
                                <option key={c._id} value={c._id}>{c.name} ({c.leadsCount} leads)</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleCSVUpload}
                            className="hidden"
                            id="csv-upload"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={!selectedCampaign || uploading}
                            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
                            {uploading ? 'Uploading...' : 'Upload CSV'}
                        </button>
                    </div>
                </div>

                <p className="text-[10px] text-gray-600 mt-3">
                    CSV format: gymName, ownerName, phone, city, state, email, language (Hindi/Marathi/English)
                </p>

                {/* Upload Result */}
                <AnimatePresence>
                    {uploadResult && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 bg-black/50 border border-emerald-500/20 rounded-xl p-4"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle size={16} className="text-emerald-400" />
                                <span className="text-sm font-bold text-emerald-400">Upload Complete</span>
                            </div>
                            <p className="text-xs text-gray-400">
                                {uploadResult.created} leads created • {uploadResult.duplicates} duplicates skipped
                            </p>
                            {uploadResult.errors.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-[10px] text-red-400 font-bold uppercase mb-1">Errors:</p>
                                    {uploadResult.errors.slice(0, 5).map((err, i) => (
                                        <p key={i} className="text-[10px] text-red-300">{err}</p>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search leads..."
                        className="w-full bg-zinc-900 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/30 transition-colors"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/30 transition-colors appearance-none min-w-[140px]"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="calling">Calling</option>
                    <option value="meeting_scheduled">Meeting Set</option>
                    <option value="callback_scheduled">Callback</option>
                    <option value="interested">Interested</option>
                    <option value="not_interested">Not Interested</option>
                    <option value="no_answer">No Answer</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* Leads Table */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                        <Users size={16} className="text-emerald-400" /> Leads
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{pagination.total} total</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="animate-spin text-emerald-500" size={24} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Gym</th>
                                    <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Owner</th>
                                    <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Phone</th>
                                    <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">City</th>
                                    <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Language</th>
                                    <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Status</th>
                                    <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Schedule</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3">
                                            <p className="text-xs font-bold text-white">{lead.gymName}</p>
                                        </td>
                                        <td className="px-5 py-3 text-xs text-gray-400">{lead.ownerName}</td>
                                        <td className="px-5 py-3">
                                            <span className="text-xs text-gray-300 font-mono flex items-center gap-1">
                                                <Phone size={10} className="text-gray-600" /> {lead.phone}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <MapPin size={10} className="text-gray-600" /> {lead.city || '—'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-xs text-gray-400">{lead.preferredLanguage}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[lead.status] || 'text-gray-400 bg-gray-500/10'}`}>
                                                {lead.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-[10px] text-gray-500">
                                            {lead.meetingDate && <span className="flex items-center gap-1"><Clock size={10} /> {lead.meetingDate} {lead.meetingTime}</span>}
                                            {lead.callbackDate && <span className="flex items-center gap-1"><Clock size={10} /> CB: {lead.callbackDate} {lead.callbackTime}</span>}
                                        </td>
                                    </tr>
                                ))}
                                {filteredLeads.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-gray-600 text-sm">
                                            {leads.length === 0 ? 'No leads yet. Upload a CSV to get started.' : 'No leads match your search.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
                        <button
                            onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                            disabled={pagination.page === 1}
                            className="text-xs font-bold text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-[10px] text-gray-600">Page {pagination.page} of {pagination.pages}</span>
                        <button
                            onClick={() => setPagination(p => ({ ...p, page: Math.min(p.pages, p.page + 1) }))}
                            disabled={pagination.page === pagination.pages}
                            className="text-xs font-bold text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
