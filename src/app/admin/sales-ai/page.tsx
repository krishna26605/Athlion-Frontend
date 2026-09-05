'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Phone, PhoneCall, PhoneOff, Calendar, Users, TrendingUp,
    Play, Pause, Plus, Trash2, Loader2, CheckCircle, XCircle,
    Clock, BarChart3, Zap
} from 'lucide-react';

interface Campaign {
    _id: string;
    name: string;
    description?: string;
    agentName: string;
    status: 'created' | 'running' | 'paused' | 'completed';
    concurrencyLimit: number;
    leadsCount: number;
    stats: {
        totalCalls: number;
        answeredCalls: number;
        interested: number;
        notInterested: number;
        meetingsScheduled: number;
        callbacksScheduled: number;
        wrongContacts: number;
        noAnswer: number;
    };
    createdAt: string;
}

interface DashboardStats {
    totalLeads: number;
    totalCalls: number;
    completedCalls: number;
    meetingsScheduled: number;
    callbacksScheduled: number;
    interestedLeads: number;
    notInterestedLeads: number;
    pendingLeads: number;
    activeCampaigns: number;
    todayCalls: number;
    todayMeetings: number;
    answerRate: number;
    interestRate: number;
    recentCalls: Array<{
        _id: string;
        lead: { gymName: string; ownerName: string; phone: string; city: string };
        campaign: { name: string };
        status: string;
        duration: number;
        languageUsed: string;
        createdAt: string;
    }>;
}

export default function SalesAIDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [dispatching, setDispatching] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [newCampaign, setNewCampaign] = useState({ name: '', description: '', agentName: 'Arjun', concurrencyLimit: 2 });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, campaignsRes] = await Promise.all([
                apiClient.get('admin/crm/stats'),
                apiClient.get('admin/campaigns')
            ]);
            setStats(statsRes.data.data);
            setCampaigns(campaignsRes.data.data);
        } catch (err) {
            console.error('Failed to fetch sales AI data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleCampaign = async (id: string, action: string) => {
        try {
            await apiClient.post(`admin/campaigns/${id}/toggle`, { action });
            fetchData();
        } catch (err) {
            console.error('Failed to toggle campaign', err);
        }
    };

    const handleDeleteCampaign = async (id: string) => {
        if (!confirm('Delete this campaign and all its leads?')) return;
        try {
            await apiClient.delete(`admin/campaigns/${id}`);
            fetchData();
        } catch (err) {
            console.error('Failed to delete campaign', err);
        }
    };

    const handleDispatch = async () => {
        setDispatching(true);
        try {
            const res = await apiClient.post('voice/dispatch');
            alert(`Dispatched ${res.data.data?.processed || 0} calls`);
            fetchData();
        } catch (err) {
            console.error('Dispatch failed', err);
            alert('Dispatch failed. Check console.');
        } finally {
            setDispatching(false);
        }
    };

    const handleCreateCampaign = async () => {
        if (!newCampaign.name.trim()) return;
        setCreating(true);
        try {
            await apiClient.post('admin/campaigns', newCampaign);
            setNewCampaign({ name: '', description: '', agentName: 'Arjun', concurrencyLimit: 2 });
            setShowCreate(false);
            fetchData();
        } catch (err) {
            console.error('Failed to create campaign', err);
        } finally {
            setCreating(false);
        }
    };

    if (authLoading || loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
        </div>
    );

    const statCards = [
        { label: 'Total Leads', value: stats?.totalLeads || 0, icon: <Users size={22} />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { label: 'Total Calls', value: stats?.totalCalls || 0, icon: <Phone size={22} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { label: 'Answer Rate', value: `${stats?.answerRate || 0}%`, icon: <PhoneCall size={22} />, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        { label: 'Meetings Set', value: stats?.meetingsScheduled || 0, icon: <Calendar size={22} />, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { label: 'Interest Rate', value: `${stats?.interestRate || 0}%`, icon: <TrendingUp size={22} />, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
        { label: 'Today\'s Calls', value: stats?.todayCalls || 0, icon: <Zap size={22} />, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    ];

    const statusColors: Record<string, string> = {
        created: 'text-gray-400 bg-gray-500/10 border-gray-500/30',
        running: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        paused: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        completed: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`${card.bg} border ${card.border} rounded-2xl p-4 md:p-5 backdrop-blur-sm`}
                    >
                        <div className={`${card.color} mb-3`}>{card.icon}</div>
                        <p className="text-2xl md:text-3xl font-black tracking-tight text-white">{card.value}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">{card.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30"
                >
                    <Plus size={16} /> New Campaign
                </button>
                <button
                    onClick={handleDispatch}
                    disabled={dispatching}
                    className="flex items-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/10 disabled:opacity-50"
                >
                    {dispatching ? <Loader2 size={16} className="animate-spin" /> : <PhoneCall size={16} />}
                    {dispatching ? 'Dispatching...' : 'Dispatch Calls'}
                </button>
            </div>

            {/* Create Campaign Modal */}
            {showCreate && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
                >
                    <h3 className="text-lg font-black uppercase tracking-tight mb-4">Create Campaign</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Campaign Name *</label>
                            <input
                                type="text"
                                value={newCampaign.name}
                                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-colors"
                                placeholder="e.g. Pune Gyms Q3"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Agent Name</label>
                            <input
                                type="text"
                                value={newCampaign.agentName}
                                onChange={(e) => setNewCampaign({ ...newCampaign, agentName: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-colors"
                                placeholder="AI agent's spoken name"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Description</label>
                            <input
                                type="text"
                                value={newCampaign.description}
                                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-colors"
                                placeholder="Optional campaign description"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Concurrency Limit</label>
                            <input
                                type="number"
                                min={1}
                                max={10}
                                value={newCampaign.concurrencyLimit}
                                onChange={(e) => setNewCampaign({ ...newCampaign, concurrencyLimit: parseInt(e.target.value) || 2 })}
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={handleCreateCampaign}
                            disabled={creating || !newCampaign.name.trim()}
                            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                        >
                            {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                            Create
                        </button>
                        <button
                            onClick={() => setShowCreate(false)}
                            className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-gray-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Campaigns Table */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider">Campaigns</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{campaigns.length} total</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Name</th>
                                <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Status</th>
                                <th className="text-center px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Leads</th>
                                <th className="text-center px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Calls</th>
                                <th className="text-center px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Meetings</th>
                                <th className="text-center px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Interested</th>
                                <th className="text-right px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map((c) => (
                                <tr key={c._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-bold text-white">{c.name}</p>
                                        <p className="text-[10px] text-gray-600 mt-0.5">{c.description || c.agentName}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColors[c.status]}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center text-sm font-bold text-gray-300">{c.leadsCount}</td>
                                    <td className="px-5 py-4 text-center text-sm font-bold text-gray-300">{c.stats.totalCalls}</td>
                                    <td className="px-5 py-4 text-center text-sm font-bold text-emerald-400">{c.stats.meetingsScheduled}</td>
                                    <td className="px-5 py-4 text-center text-sm font-bold text-amber-400">{c.stats.interested}</td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {c.status === 'created' || c.status === 'paused' ? (
                                                <button
                                                    onClick={() => handleToggleCampaign(c._id, 'start')}
                                                    className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                    title="Start"
                                                >
                                                    <Play size={16} />
                                                </button>
                                            ) : c.status === 'running' ? (
                                                <button
                                                    onClick={() => handleToggleCampaign(c._id, 'pause')}
                                                    className="p-2 text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                                                    title="Pause"
                                                >
                                                    <Pause size={16} />
                                                </button>
                                            ) : null}
                                            {c.status !== 'running' && (
                                                <button
                                                    onClick={() => handleDeleteCampaign(c._id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {campaigns.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-gray-600 text-sm">
                                        No campaigns yet. Create one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Calls */}
            {stats?.recentCalls && stats.recentCalls.length > 0 && (
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/5">
                        <h3 className="text-sm font-black uppercase tracking-wider">Recent Calls</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {stats.recentCalls.map((call) => (
                            <div key={call._id} className="px-5 py-3 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    call.status === 'completed' ? 'bg-emerald-500/10' :
                                    call.status === 'busy' || call.status === 'no-answer' ? 'bg-amber-500/10' :
                                    'bg-red-500/10'
                                }`}>
                                    {call.status === 'completed' ? <CheckCircle size={14} className="text-emerald-400" /> :
                                     call.status === 'busy' ? <PhoneOff size={14} className="text-amber-400" /> :
                                     <XCircle size={14} className="text-red-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{call.lead?.gymName || 'Unknown'}</p>
                                    <p className="text-[10px] text-gray-600">{call.lead?.ownerName} • {call.lead?.city}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[10px] font-bold text-gray-400">{call.duration}s • {call.languageUsed}</p>
                                    <p className="text-[9px] text-gray-600">{new Date(call.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
