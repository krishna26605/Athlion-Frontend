'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Phone, Loader2, X, MessageSquare, Clock, MapPin,
    CheckCircle, XCircle, PhoneOff, Calendar, User,
    ChevronRight, FileText, Globe
} from 'lucide-react';

interface CallLog {
    _id: string;
    lead: {
        _id: string;
        gymName: string;
        ownerName: string;
        phone: string;
        city: string;
        status: string;
        preferredLanguage: string;
    };
    campaign: { _id: string; name: string };
    twilioCallSid: string;
    status: string;
    duration: number;
    languageUsed: string;
    transcript: Array<{ speaker: string; text: string; timestamp: string }>;
    conversationState: string;
    callSummary?: {
        gymName?: string;
        ownerName?: string;
        phoneNumber?: string;
        city?: string;
        language?: string;
        meetingScheduled?: boolean;
        meetingDate?: string;
        meetingTime?: string;
        callbackRequired?: boolean;
        callbackDate?: string;
        callbackTime?: string;
        interested?: boolean;
        status?: string;
        summary?: string;
        notes?: string;
        followUpRequired?: boolean;
    };
    createdAt: string;
}

export default function CRMLogsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [calls, setCalls] = useState<CallLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchCalls();
    }, [pagination.page]);

    const fetchCalls = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('admin/crm/calls', {
                params: { page: pagination.page, limit: 30 }
            });
            setCalls(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error('Failed to fetch calls', err);
        } finally {
            setLoading(false);
        }
    };

    const openCallDetail = async (callId: string) => {
        setDetailLoading(true);
        setDrawerOpen(true);
        try {
            const res = await apiClient.get(`admin/crm/calls/${callId}`);
            setSelectedCall(res.data.data);
        } catch (err) {
            console.error('Failed to fetch call detail', err);
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setTimeout(() => setSelectedCall(null), 300);
    };

    const callStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle size={14} className="text-emerald-400" />;
            case 'in-progress': return <Phone size={14} className="text-blue-400 animate-pulse" />;
            case 'busy': return <PhoneOff size={14} className="text-amber-400" />;
            case 'no-answer': return <PhoneOff size={14} className="text-orange-400" />;
            case 'failed': return <XCircle size={14} className="text-red-400" />;
            default: return <Clock size={14} className="text-gray-400" />;
        }
    };

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            completed: 'text-emerald-400 bg-emerald-500/10',
            'in-progress': 'text-blue-400 bg-blue-500/10',
            busy: 'text-amber-400 bg-amber-500/10',
            'no-answer': 'text-orange-400 bg-orange-500/10',
            failed: 'text-red-400 bg-red-500/10',
            initiated: 'text-gray-400 bg-gray-500/10',
            ringing: 'text-cyan-400 bg-cyan-500/10',
        };
        return map[status] || 'text-gray-400 bg-gray-500/10';
    };

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
            {/* Call Logs Table */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare size={16} className="text-emerald-400" /> Call Logs
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{pagination.total} calls</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="animate-spin text-emerald-500" size={24} />
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {calls.map((call) => (
                            <button
                                key={call._id}
                                onClick={() => openCallDetail(call._id)}
                                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-white/[0.03] transition-colors text-left group"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusBadge(call.status)} shrink-0`}>
                                    {callStatusIcon(call.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-white truncate">{call.lead?.gymName || 'Unknown'}</p>
                                        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${statusBadge(call.status)}`}>
                                            {call.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-600 mt-0.5 flex items-center gap-2">
                                        <span>{call.lead?.ownerName}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-0.5"><MapPin size={8} /> {call.lead?.city || '—'}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-0.5"><Globe size={8} /> {call.languageUsed}</span>
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[10px] font-bold text-gray-400">{call.duration}s</p>
                                    <p className="text-[9px] text-gray-600">
                                        {new Date(call.createdAt).toLocaleString('en-IN', {
                                            hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short'
                                        })}
                                    </p>
                                </div>
                                <ChevronRight size={16} className="text-gray-700 group-hover:text-gray-400 transition-colors shrink-0" />
                            </button>
                        ))}
                        {calls.length === 0 && (
                            <div className="px-5 py-16 text-center text-gray-600 text-sm">
                                No calls recorded yet. Start a campaign to begin calling.
                            </div>
                        )}
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

            {/* ═══════ CALL DETAIL DRAWER ═══════ */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeDrawer}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#0a0a0a] border-l border-white/10 z-50 overflow-y-auto custom-scrollbar"
                        >
                            {detailLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="animate-spin text-emerald-500" size={32} />
                                </div>
                            ) : selectedCall ? (
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-lg font-black tracking-tight text-white">{selectedCall.lead?.gymName}</h2>
                                            <p className="text-xs text-gray-500 mt-0.5">{selectedCall.lead?.ownerName} • {selectedCall.lead?.phone}</p>
                                        </div>
                                        <button
                                            onClick={closeDrawer}
                                            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                                        >
                                            <X size={20} className="text-gray-500" />
                                        </button>
                                    </div>

                                    {/* Call Info */}
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        <div className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-center">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Status</p>
                                            <p className={`text-xs font-black uppercase mt-1 ${statusBadge(selectedCall.status).split(' ')[0]}`}>
                                                {selectedCall.status}
                                            </p>
                                        </div>
                                        <div className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-center">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Duration</p>
                                            <p className="text-xs font-black text-white mt-1">{selectedCall.duration}s</p>
                                        </div>
                                        <div className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-center">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Language</p>
                                            <p className="text-xs font-black text-white mt-1">{selectedCall.languageUsed}</p>
                                        </div>
                                    </div>

                                    {/* Call Summary */}
                                    {selectedCall.callSummary?.summary && (
                                        <div className="mb-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1">
                                                <FileText size={12} /> AI Summary
                                            </h4>
                                            <p className="text-xs text-gray-300 leading-relaxed">{selectedCall.callSummary.summary}</p>

                                            <div className="grid grid-cols-2 gap-3 mt-4">
                                                <div className="text-[10px]">
                                                    <span className="text-gray-600 font-bold uppercase">Interested:</span>
                                                    <span className={`ml-1 font-black ${selectedCall.callSummary.interested ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {selectedCall.callSummary.interested ? 'Yes' : 'No'}
                                                    </span>
                                                </div>
                                                <div className="text-[10px]">
                                                    <span className="text-gray-600 font-bold uppercase">Outcome:</span>
                                                    <span className="ml-1 font-black text-white">{selectedCall.callSummary.status}</span>
                                                </div>
                                                {selectedCall.callSummary.meetingScheduled && (
                                                    <>
                                                        <div className="text-[10px]">
                                                            <span className="text-gray-600 font-bold uppercase">Meeting:</span>
                                                            <span className="ml-1 font-black text-emerald-400">
                                                                {selectedCall.callSummary.meetingDate} {selectedCall.callSummary.meetingTime}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                                {selectedCall.callSummary.callbackRequired && (
                                                    <div className="text-[10px]">
                                                        <span className="text-gray-600 font-bold uppercase">Callback:</span>
                                                        <span className="ml-1 font-black text-amber-400">
                                                            {selectedCall.callSummary.callbackDate} {selectedCall.callSummary.callbackTime}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {selectedCall.callSummary.notes && (
                                                <p className="text-[10px] text-gray-500 mt-3 border-t border-emerald-500/10 pt-3">
                                                    {selectedCall.callSummary.notes}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Transcript */}
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-1">
                                            <MessageSquare size={12} /> Conversation Transcript
                                        </h4>

                                        {selectedCall.transcript.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedCall.transcript.map((msg, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className={`flex ${msg.speaker === 'agent' ? 'justify-start' : 'justify-end'}`}
                                                    >
                                                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                                            msg.speaker === 'agent'
                                                                ? 'bg-emerald-500/10 border border-emerald-500/20 rounded-tl-md'
                                                                : 'bg-zinc-800 border border-white/5 rounded-tr-md'
                                                        }`}>
                                                            <p className={`text-[9px] font-black uppercase tracking-wider mb-1 ${
                                                                msg.speaker === 'agent' ? 'text-emerald-500' : 'text-gray-500'
                                                            }`}>
                                                                {msg.speaker === 'agent' ? '🤖 AI Agent' : '👤 Customer'}
                                                            </p>
                                                            <p className="text-xs text-gray-300 leading-relaxed">{msg.text}</p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-700 text-xs">
                                                No transcript available for this call.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
