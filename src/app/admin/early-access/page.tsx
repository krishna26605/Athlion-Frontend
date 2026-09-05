'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/api/client';
import {
    Users, Eye, TrendingUp, Award, Send, Search, Filter,
    Download, CheckCircle, Clock, AlertCircle, Building2,
    Mail, MessageSquare, Phone
} from 'lucide-react';

interface Lead {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    leadSource: string;
    gymReferralCode?: string;
    gymName?: string;
    notified: boolean;
    notifiedChannels?: string[];
    convertedToTicket: boolean;
    convertedEventId?: {
        name: string;
        date: string;
    };
    ticketAmountPaid: number;
    createdAt: string;
}

interface AnalyticsData {
    totalVisits: number;
    totalLeads: number;
    convertedLeadsToTicket: number;
    visitToLeadRate: number;
    leadToTicketRate: number;
    totalEarlyAccessRevenue: number;
    sourceBreakdown: Array<{ _id: string; count: number }>;
}

interface GymAnalyticsData {
    gymCode: string;
    gymName: string;
    totalLeads: number;
    ticketBuyers: number;
    totalRevenue: number;
    thresholdReached: boolean;
    progressPercentage: number;
    royaltyEligible: boolean;
}

interface EventItem {
    _id: string;
    name: string;
    date: string;
}

export default function AdminEarlyAccessPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [gymAnalytics, setGymAnalytics] = useState<GymAnalyticsData[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [gymFilter, setGymFilter] = useState('');

    // Notification State
    const [selectedEventId, setSelectedEventId] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [selectedChannels, setSelectedChannels] = useState<{ email: boolean; sms: boolean; whatsapp: boolean }>({
        email: true,
        sms: true,
        whatsapp: true,
    });
    const [sendingNotify, setSendingNotify] = useState(false);
    const [notifyStatus, setNotifyStatus] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, [searchTerm, sourceFilter, gymFilter]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [analyticsRes, gymRes, leadsRes, eventsRes] = await Promise.all([
                apiClient.get('admin/early-access/analytics'),
                apiClient.get('admin/early-access/gym-analytics'),
                apiClient.get('admin/early-access/leads', {
                    params: { search: searchTerm, source: sourceFilter, gym: gymFilter },
                }),
                apiClient.get('events'),
            ]);

            if (analyticsRes.data?.success) setAnalytics(analyticsRes.data.data);
            if (gymRes.data?.success) setGymAnalytics(gymRes.data.data);
            if (leadsRes.data?.success) setLeads(leadsRes.data.data);
            if (eventsRes.data?.data) setEvents(eventsRes.data.data);
        } catch (err) {
            console.error('Failed to load Early Access admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleChannel = (channel: 'email' | 'sms' | 'whatsapp') => {
        setSelectedChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
    };

    const handleSendNotification = async () => {
        if (!selectedEventId) {
            alert('Please select an event to notify leads about.');
            return;
        }

        const channels = Object.entries(selectedChannels)
            .filter(([_, enabled]) => enabled)
            .map(([channel]) => channel);

        if (channels.length === 0) {
            alert('Please select at least one notification channel (Email, SMS, or WhatsApp).');
            return;
        }

        if (!confirm(`Confirm dispatching notifications to all un-notified early access leads via [${channels.join(', ')}]?`)) {
            return;
        }

        setSendingNotify(true);
        setNotifyStatus(null);

        try {
            const res = await apiClient.post('admin/early-access/notify', {
                eventId: selectedEventId,
                customMessage,
                channels,
            });

            if (res.data?.success) {
                setNotifyStatus(`✅ ${res.data.message} (Email: ${res.data.breakdown.emailSent}, SMS: ${res.data.breakdown.smsSent}, WhatsApp: ${res.data.breakdown.whatsappSent})`);
                fetchDashboardData();
            }
        } catch (err: any) {
            setNotifyStatus(`❌ Error sending notifications: ${err.response?.data?.message || err.message}`);
        } finally {
            setSendingNotify(false);
        }
    };

    const exportToCSV = () => {
        if (leads.length === 0) return;
        const headers = ['Full Name', 'Email', 'Phone', 'Lead Source', 'Gym Partner', 'Notified', 'Ticket Buyer', 'Amount Paid', 'Date'];
        const rows = leads.map(l => [
            `"${l.fullName}"`,
            `"${l.email}"`,
            `"${l.phone}"`,
            `"${l.leadSource}"`,
            `"${l.gymName || l.gymReferralCode || 'N/A'}"`,
            `"${l.notified ? 'Yes' : 'No'}"`,
            `"${l.convertedToTicket ? 'Yes' : 'No'}"`,
            `"${l.ticketAmountPaid || 0}"`,
            `"${new Date(l.createdAt).toLocaleDateString()}"`
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `athlion_early_access_leads_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 text-white">
            {/* Top Header & Overview */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tight uppercase text-white">
                        Early Access &amp; <span className="text-[#f82506]">Traffic Funnel</span>
                    </h1>
                    <p className="text-zinc-400 text-xs sm:text-sm">
                        Track Meta Ad website visits, Early Access lead captures, Gym 0.1% royalty progress, and send event launch alerts.
                    </p>
                </div>

                <button
                    onClick={exportToCSV}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                >
                    <Download size={16} className="text-[#f82506]" />
                    Export Leads CSV
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Website Traffic</span>
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                            <Eye size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-black italic">{analytics?.totalVisits || 0}</div>
                    <p className="text-xs text-zinc-500 mt-1">Unique site visits captured</p>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Early Access Leads</span>
                        <div className="w-10 h-10 rounded-xl bg-[#f82506]/10 text-[#f82506] flex items-center justify-center">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-black italic">{analytics?.totalLeads || 0}</div>
                    <p className="text-xs text-zinc-500 mt-1">
                        Visit Conversion: <span className="text-white font-bold">{analytics?.visitToLeadRate || 0}%</span>
                    </p>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Ticket Conversion</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-black italic">{analytics?.convertedLeadsToTicket || 0}</div>
                    <p className="text-xs text-zinc-500 mt-1">
                        Lead to Ticket Rate: <span className="text-white font-bold">{analytics?.leadToTicketRate || 0}%</span>
                    </p>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Early Access Revenue</span>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                            <Award size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-black italic text-amber-400">₹{analytics?.totalEarlyAccessRevenue || 0}</div>
                    <p className="text-xs text-zinc-500 mt-1">Generated from pre-event community</p>
                </div>
            </div>

            {/* Notification Dispatch Center */}
            <div className="bg-zinc-950 border border-[#f82506]/30 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#f82506]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f82506]/20 text-[#f82506] flex items-center justify-center font-bold">
                        <Send size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white">
                            Launch Alert Broadcast Dispatcher
                        </h2>
                        <p className="text-xs text-zinc-400">
                            Trigger multi-channel notifications (Email, SMS, WhatsApp) to all Early Access subscribers when an event launches.
                        </p>
                    </div>
                </div>

                {notifyStatus && (
                    <div className="mb-4 p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-semibold">
                        {notifyStatus}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                            Select Launched Event *
                        </label>
                        <select
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f82506]"
                        >
                            <option value="">-- Choose Event --</option>
                            {events.map(ev => (
                                <option key={ev._id} value={ev._id}>
                                    {ev.name} ({new Date(ev.date).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                            Select Notification Triggers (Channels)
                        </label>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <label className="inline-flex items-center gap-2 cursor-pointer bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
                                <input
                                    type="checkbox"
                                    checked={selectedChannels.email}
                                    onChange={() => toggleChannel('email')}
                                    className="accent-[#f82506] w-4 h-4"
                                />
                                <Mail size={16} className="text-blue-400" />
                                <span className="text-xs font-bold">Email</span>
                            </label>

                            <label className="inline-flex items-center gap-2 cursor-pointer bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
                                <input
                                    type="checkbox"
                                    checked={selectedChannels.sms}
                                    onChange={() => toggleChannel('sms')}
                                    className="accent-[#f82506] w-4 h-4"
                                />
                                <Phone size={16} className="text-purple-400" />
                                <span className="text-xs font-bold">SMS</span>
                            </label>

                            <label className="inline-flex items-center gap-2 cursor-pointer bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
                                <input
                                    type="checkbox"
                                    checked={selectedChannels.whatsapp}
                                    onChange={() => toggleChannel('whatsapp')}
                                    className="accent-[#f82506] w-4 h-4"
                                />
                                <MessageSquare size={16} className="text-emerald-400" />
                                <span className="text-xs font-bold">WhatsApp</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                        Custom Announcement Message (Optional)
                    </label>
                    <textarea
                        rows={2}
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="e.g. Athlion Mumbai Grand Prix registration is now officially LIVE! Early Access tickets available for next 48 hours."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#f82506]"
                    />
                </div>

                <button
                    onClick={handleSendNotification}
                    disabled={sendingNotify || !selectedEventId}
                    className="bg-[#f82506] hover:bg-red-700 disabled:opacity-50 text-white font-black py-3 px-8 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-[#f82506]/30 flex items-center gap-2 transition-all"
                >
                    <Send size={16} />
                    {sendingNotify ? 'Dispatching Notifications...' : 'Broadcast Event Launch Alert'}
                </button>
            </div>

            {/* Gym Referral & Royalty Tracker */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <Building2 className="text-[#f82506]" size={24} />
                    <div>
                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white">
                            Gym Partner Royalty Performance (0.1% Threshold)
                        </h2>
                        <p className="text-xs text-zinc-400">
                            Criteria: Minimum 50 member registrations per gym required to unlock 0.1% event royalty.
                        </p>
                    </div>
                </div>

                {gymAnalytics.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500 text-xs uppercase font-bold">
                        No Gym Partner registrations captured yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                                <tr>
                                    <th className="py-3 px-4">Gym Name / Code</th>
                                    <th className="py-3 px-4">Registered Members</th>
                                    <th className="py-3 px-4">50-Member Goal Progress</th>
                                    <th className="py-3 px-4">Ticket Buyers</th>
                                    <th className="py-3 px-4">Revenue</th>
                                    <th className="py-3 px-4">Royalty Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {gymAnalytics.map(g => (
                                    <tr key={g.gymCode} className="hover:bg-zinc-900/50">
                                        <td className="py-3.5 px-4 font-bold text-white">
                                            {g.gymName}
                                            <span className="block text-[10px] text-zinc-500 font-mono">{g.gymCode}</span>
                                        </td>
                                        <td className="py-3.5 px-4 font-black text-sm text-white">
                                            {g.totalLeads} / 50
                                        </td>
                                        <td className="py-3.5 px-4 min-w-[160px]">
                                            <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${g.thresholdReached ? 'bg-emerald-500' : 'bg-[#f82506]'}`}
                                                    style={{ width: `${g.progressPercentage}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-zinc-400 mt-1 block font-semibold">
                                                {g.progressPercentage}% Completed
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-emerald-400">
                                            {g.ticketBuyers}
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-amber-400">
                                            ₹{g.totalRevenue}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {g.royaltyEligible ? (
                                                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                                                    <CheckCircle size={12} /> 0.1% Royalty Eligible
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                                                    <Clock size={12} /> {50 - g.totalLeads} leads needed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Early Access Leads Table */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-black italic uppercase tracking-tight text-white">
                        Early Access Lead Database ({leads.length})
                    </h2>

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-3 text-zinc-500" size={16} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search name, email..."
                                className="bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#f82506] w-full sm:w-48"
                            />
                        </div>

                        <select
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f82506]"
                        >
                            <option value="">All Lead Sources</option>
                            <option value="meta_ads">Meta Ads</option>
                            <option value="instagram_reel">Instagram Reels</option>
                            <option value="gym_referral">Gym Partner</option>
                            <option value="direct">Direct</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        Loading lead records...
                    </div>
                ) : leads.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        No Early Access leads match search criteria.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                                <tr>
                                    <th className="py-3 px-4">Athlete Name</th>
                                    <th className="py-3 px-4">Contact Info</th>
                                    <th className="py-3 px-4">Source</th>
                                    <th className="py-3 px-4">Gym Partner</th>
                                    <th className="py-3 px-4">Alert Sent</th>
                                    <th className="py-3 px-4">Ticket Status</th>
                                    <th className="py-3 px-4">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {leads.map(lead => (
                                    <tr key={lead._id} className="hover:bg-zinc-900/50">
                                        <td className="py-3.5 px-4 font-bold text-white">
                                            {lead.fullName}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="text-zinc-300 font-semibold">{lead.email}</div>
                                            <div className="text-zinc-500 font-mono text-[10px]">{lead.phone}</div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="bg-zinc-900 border border-zinc-700 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold text-zinc-300">
                                                {lead.leadSource}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-zinc-300">
                                            {lead.gymName || lead.gymReferralCode ? (
                                                <span className="text-red-400 font-semibold">
                                                    {lead.gymName || lead.gymReferralCode}
                                                </span>
                                            ) : (
                                                <span className="text-zinc-600">—</span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {lead.notified ? (
                                                <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                                    <CheckCircle size={10} /> Notified ({lead.notifiedChannels?.join(', ') || 'Email'})
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-500 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                                    Pending Launch Alert
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {lead.convertedToTicket ? (
                                                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                                                    Converted (₹{lead.ticketAmountPaid})
                                                </span>
                                            ) : (
                                                <span className="text-zinc-500 text-[10px]">
                                                    Pre-event Subscriber
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-zinc-500 text-[10px]">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
