'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/client';
import { Loader2, Tag, Plus, Download, Trash2, Calendar, Zap, Gift, Settings2, ToggleLeft, ToggleRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sponsor {
    _id: string;
    name: string;
}

interface Coupon {
    _id: string;
    code: string;
    value: number;
    type: 'flat' | 'percentage';
    expiryDate: string;
    isSingleUse: boolean;
    usageCount: number;
    sponsor: {
        name: string;
    };
}

interface EventItem {
    _id: string;
    name: string;
    date: string;
    price: number;
    status: string;
}

interface EarlyBirdConfig {
    _id: string;
    event: EventItem;
    superEarlyLimit: number;
    superEarlyDiscountType: 'flat' | 'percentage';
    superEarlyDiscountValue: number;
    earlyDiscountType: 'flat' | 'percentage';
    earlyDiscountValue: number;
    isActive: boolean;
}

export default function AdminPricingPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [earlyBirdConfigs, setEarlyBirdConfigs] = useState<EarlyBirdConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [isEarlyBirdModalOpen, setIsEarlyBirdModalOpen] = useState(false);
    const [couponFormData, setCouponFormData] = useState({
        sponsorId: '',
        count: 10,
        value: 100,
        type: 'flat',
        prefix: 'ATH',
        expiryDate: ''
    });
    const [earlyBirdFormData, setEarlyBirdFormData] = useState({
        eventId: '',
        superEarlyLimit: 50,
        superEarlyDiscountType: 'percentage' as 'flat' | 'percentage',
        superEarlyDiscountValue: 20,
        earlyDiscountType: 'flat' as 'flat' | 'percentage',
        earlyDiscountValue: 200,
        isActive: true
    });

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        Promise.all([fetchSponsors(), fetchCoupons(), fetchEvents(), fetchEarlyBirdConfigs()]).finally(() => setLoading(false));
    }, []);

    const fetchSponsors = async () => {
        try {
            const res = await apiClient.get('sponsors');
            setSponsors(res.data.data || res.data);
        } catch (err) {
            console.error('Failed to fetch sponsors', err);
        }
    };

    const fetchCoupons = async () => {
        try {
            const res = await apiClient.get('admin/coupons');
            setCoupons(res.data.data);
        } catch (err) {
            console.error('Failed to fetch coupons', err);
        }
    };

    const fetchEvents = async () => {
        try {
            const res = await apiClient.get('events');
            setEvents(res.data.data);
        } catch (err) {
            console.error('Failed to fetch events', err);
        }
    };

    const fetchEarlyBirdConfigs = async () => {
        try {
            const res = await apiClient.get('admin/early-bird');
            setEarlyBirdConfigs(res.data.data);
        } catch (err) {
            console.error('Failed to fetch early bird configs', err);
        }
    };

    const handleGenerateCoupons = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('admin/coupons/bulk-generate', couponFormData);
            setIsCouponModalOpen(false);
            fetchCoupons();
        } catch (err) {
            console.error('Failed to generate coupons', err);
            alert('Failed to generate coupons');
        }
    };

    const handleSaveEarlyBird = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('admin/early-bird', earlyBirdFormData);
            setIsEarlyBirdModalOpen(false);
            fetchEarlyBirdConfigs();
            setEarlyBirdFormData({
                eventId: '',
                superEarlyLimit: 50,
                superEarlyDiscountType: 'percentage',
                superEarlyDiscountValue: 20,
                earlyDiscountType: 'flat',
                earlyDiscountValue: 200,
                isActive: true
            });
        } catch (err) {
            console.error('Failed to save early bird config', err);
            alert('Failed to save early bird config');
        }
    };

    const handleToggleEarlyBird = async (config: EarlyBirdConfig) => {
        try {
            await apiClient.post('admin/early-bird', {
                eventId: config.event._id,
                superEarlyLimit: config.superEarlyLimit,
                superEarlyDiscountType: config.superEarlyDiscountType,
                superEarlyDiscountValue: config.superEarlyDiscountValue,
                earlyDiscountType: config.earlyDiscountType,
                earlyDiscountValue: config.earlyDiscountValue,
                isActive: !config.isActive,
            });
            fetchEarlyBirdConfigs();
        } catch (err) {
            alert('Failed to toggle early bird config');
        }
    };

    const handleDeleteEarlyBird = async (eventId: string) => {
        if (!confirm('Remove this early bird config?')) return;
        try {
            await apiClient.delete(`admin/early-bird/${eventId}`);
            fetchEarlyBirdConfigs();
        } catch (err) {
            alert('Failed to delete early bird config');
        }
    };

    const handleEditEarlyBird = (config: EarlyBirdConfig) => {
        setEarlyBirdFormData({
            eventId: config.event._id,
            superEarlyLimit: config.superEarlyLimit,
            superEarlyDiscountType: config.superEarlyDiscountType,
            superEarlyDiscountValue: config.superEarlyDiscountValue,
            earlyDiscountType: config.earlyDiscountType,
            earlyDiscountValue: config.earlyDiscountValue,
            isActive: config.isActive,
        });
        setIsEarlyBirdModalOpen(true);
    };

    if (authLoading || loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Loader2 className="animate-spin text-[#f82506]" size={40} />
        </div>
    );

    return (
        <>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex justify-between items-end mb-12">
                        

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEarlyBirdModalOpen(true)}
                                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-6 py-4 rounded-2xl font-black italic uppercase tracking-widest text-[10px] hover:shadow-xl hover:shadow-amber-500/20 transition-all"
                            >
                                <Zap size={16} /> Early Bird Config
                            </button>
                            <button
                                onClick={() => setIsCouponModalOpen(true)}
                                className="flex items-center gap-2 bg-white text-black px-6 py-4 rounded-2xl font-black italic uppercase tracking-widest text-[10px] hover:bg-[#f82506] hover:text-white transition-all shadow-xl shadow-white/5"
                            >
                                <Plus size={16} /> Generate Coupons
                            </button>
                        </div>
                    </div>

                    {/* ═══════ EARLY BIRD CONFIGS SECTION ═══════ */}
                    <div className="mb-12">
                        <h2 className="text-xl font-black italic uppercase tracking-tight mb-6 flex items-center gap-3">
                            <Zap className="text-amber-500" size={20} /> Early Bird Discounts
                        </h2>

                        {earlyBirdConfigs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {earlyBirdConfigs.map((config) => (
                                    <motion.div
                                        key={config._id}
                                        layout
                                        className={`glass-card p-6 border-white/5 transition-all ${config.isActive ? 'border-amber-500/30' : 'opacity-50'}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-black italic uppercase tracking-tight text-lg text-white">{config.event?.name || 'Deleted Event'}</h3>
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-1 inline-block ${config.isActive ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-gray-600'}`}>
                                                    {config.isActive ? 'ACTIVE' : 'DISABLED'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleToggleEarlyBird(config)}
                                                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                                    title={config.isActive ? 'Disable' : 'Enable'}
                                                >
                                                    {config.isActive
                                                        ? <ToggleRight size={20} className="text-green-500" />
                                                        : <ToggleLeft size={20} className="text-gray-600" />
                                                    }
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEarlyBird(config.event._id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Super Early Bird */}
                                            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Gift size={14} className="text-amber-500" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">Super Early Bird</span>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs text-gray-400">First <span className="text-white font-black">{config.superEarlyLimit}</span> registrations</span>
                                                    <span className="text-xl font-black italic text-amber-400">
                                                        {config.superEarlyDiscountType === 'percentage' ? `${config.superEarlyDiscountValue}%` : `₹${config.superEarlyDiscountValue}`}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Early Bird */}
                                            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Tag size={14} className="text-blue-400" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Early Bird</span>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs text-gray-400">All remaining registrations</span>
                                                    <span className="text-xl font-black italic text-blue-400">
                                                        {config.earlyDiscountType === 'percentage' ? `${config.earlyDiscountValue}%` : `₹${config.earlyDiscountValue}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleEditEarlyBird(config)}
                                            className="w-full mt-4 py-3 rounded-xl bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            <Settings2 size={12} /> Edit Configuration
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 border border-dashed border-amber-500/10 rounded-3xl bg-amber-500/[0.02]">
                                <Zap size={36} className="mx-auto text-amber-500/30 mb-4" />
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-4">No early bird discounts configured yet.</p>
                                <button
                                    onClick={() => setIsEarlyBirdModalOpen(true)}
                                    className="text-amber-500 text-[10px] font-black uppercase tracking-widest hover:underline"
                                >
                                    Configure your first early bird discount →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ═══════ COUPONS SECTION ═══════ */}
                    <div className="grid grid-cols-1 gap-8">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 border-white/5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Active Coupons</h4>
                                <div className="text-3xl font-black italic text-white">{coupons.filter(c => c.usageCount === 0).length}</div>
                            </div>
                            <div className="glass-card p-6 border-white/5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Average Discount</h4>
                                <div className="text-3xl font-black italic text-[#f82506]">
                                    {coupons.length > 0
                                        ? `₹${Math.round(coupons.filter(c => c.type === 'flat').reduce((acc, c) => acc + c.value, 0) / Math.max(coupons.filter(c => c.type === 'flat').length, 1))}`
                                        : '₹0'
                                    }
                                </div>
                            </div>
                            <div className="glass-card p-6 border-white/5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Total Redeemed</h4>
                                <div className="text-3xl font-black italic text-green-500">{coupons.reduce((acc, curr) => acc + curr.usageCount, 0)}</div>
                            </div>
                        </div>

                        {/* Coupon Table */}
                        <div className="glass-card border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h3 className="text-sm font-black italic uppercase tracking-wider flex items-center gap-2">
                                    <Tag size={18} className="text-[#f82506]" /> Sponsor / Partner Coupons
                                </h3>
                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                                    <Download size={14} /> Export CSV
                                </button>
                            </div>

                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                                        <th className="py-4 pl-8">Code</th>
                                        <th className="py-4">Sponsor/Group</th>
                                        <th className="py-4">Discount</th>
                                        <th className="py-4">Expiry</th>
                                        <th className="py-4">Status</th>
                                        <th className="py-4 pr-8 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {coupons.length > 0 ? coupons.map((c) => (
                                        <tr key={c._id} className="group hover:bg-white/[0.01] transition-colors">
                                            <td className="py-4 pl-8">
                                                <code className="bg-zinc-900 px-2 py-1 rounded text-[#f82506] font-mono font-bold text-xs">{c.code}</code>
                                            </td>
                                            <td className="py-4">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">{c.sponsor?.name || 'General'}</span>
                                            </td>
                                            <td className="py-4">
                                                <span className="text-xs font-black italic text-white">
                                                    {c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                                                    {new Date(c.expiryDate).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${c.usageCount > 0 ? 'bg-zinc-800 text-gray-600' : 'bg-green-500/10 text-green-500'
                                                    }`}>
                                                    {c.usageCount > 0 ? 'USED' : 'ACTIVE'}
                                                </span>
                                            </td>
                                            <td className="py-4 pr-8 text-right">
                                                <button className="text-gray-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="py-20 text-center">
                                                <Tag size={32} className="mx-auto text-zinc-900 mb-4" />
                                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No coupons generated yet.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

            {/* ═══════ BULK COUPON MODAL ═══════ */}
            <AnimatePresence>
                {isCouponModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCouponModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl p-10 shadow-2xl"
                        >
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8">Generate <span className="text-[#f82506]">Bulk Coupons</span></h2>

                            <form onSubmit={handleGenerateCoupons} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sponsor / Partner Group</label>
                                    <select
                                        required
                                        value={couponFormData.sponsorId}
                                        onChange={(e) => setCouponFormData({ ...couponFormData, sponsorId: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#f82506] transition-all appearance-none text-sm text-gray-300"
                                    >
                                        <option value="">Select a partner...</option>
                                        {sponsors.map(s => (
                                            <option key={s._id} value={s._id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Quantity</label>
                                        <input
                                            required
                                            type="number"
                                            value={couponFormData.count}
                                            onChange={(e) => setCouponFormData({ ...couponFormData, count: parseInt(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#f82506] transition-all text-sm"
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Prefix Code</label>
                                        <input
                                            type="text"
                                            value={couponFormData.prefix}
                                            onChange={(e) => setCouponFormData({ ...couponFormData, prefix: e.target.value.toUpperCase() })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#f82506] transition-all text-sm uppercase font-mono"
                                            placeholder="GYM"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Discount Type</label>
                                        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                                            <button
                                                type="button"
                                                onClick={() => setCouponFormData({ ...couponFormData, type: 'flat' })}
                                                className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${couponFormData.type === 'flat' ? 'bg-[#f82506] text-white shadow-lg' : 'text-gray-500'}`}
                                            >
                                                Flat ₹
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setCouponFormData({ ...couponFormData, type: 'percentage' })}
                                                className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${couponFormData.type === 'percentage' ? 'bg-[#f82506] text-white shadow-lg' : 'text-gray-500'}`}
                                            >
                                                Percent %
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Value</label>
                                        <input
                                            required
                                            type="number"
                                            value={couponFormData.value}
                                            onChange={(e) => setCouponFormData({ ...couponFormData, value: parseInt(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#f82506] transition-all text-sm"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Expiration Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                        <input
                                            required
                                            type="date"
                                            value={couponFormData.expiryDate}
                                            onChange={(e) => setCouponFormData({ ...couponFormData, expiryDate: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 outline-none focus:border-[#f82506] transition-all text-sm uppercase color-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCouponModalOpen(false)}
                                        className="flex-1 p-5 rounded-2xl border border-white/10 font-black italic uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all text-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] p-5 rounded-2xl bg-white text-black font-black italic uppercase tracking-widest text-xs hover:bg-[#f82506] hover:text-white transition-all shadow-xl shadow-white/5"
                                    >
                                        Generate Codes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════ EARLY BIRD CONFIG MODAL ═══════ */}
            <AnimatePresence>
                {isEarlyBirdModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEarlyBirdModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Early Bird <span className="text-amber-500">Config</span></h2>
                            <p className="text-gray-500 text-sm mb-8">Set automatic discounts for early registrations. Super early bird users get a bigger discount.</p>

                            <form onSubmit={handleSaveEarlyBird} className="space-y-6">
                                {/* Select Event */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Event</label>
                                    <select
                                        required
                                        value={earlyBirdFormData.eventId}
                                        onChange={(e) => setEarlyBirdFormData({ ...earlyBirdFormData, eventId: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-amber-500 transition-all appearance-none text-sm text-gray-300"
                                    >
                                        <option value="">Select an event...</option>
                                        {events.filter(e => e.status === 'upcoming').map(e => (
                                            <option key={e._id} value={e._id}>{e.name} — ₹{e.price}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Super Early Bird Section */}
                                <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Gift size={16} className="text-amber-500" />
                                        <span className="text-xs font-black uppercase tracking-widest text-amber-500">Super Early Bird</span>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">First N Registrations</label>
                                        <input
                                            required
                                            type="number"
                                            min="1"
                                            value={earlyBirdFormData.superEarlyLimit}
                                            onChange={(e) => setEarlyBirdFormData({ ...earlyBirdFormData, superEarlyLimit: parseInt(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-amber-500 transition-all text-sm"
                                            placeholder="e.g. 50"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Discount Type</label>
                                            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                                                <button
                                                    type="button"
                                                    onClick={() => setEarlyBirdFormData({ ...earlyBirdFormData, superEarlyDiscountType: 'flat' })}
                                                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${earlyBirdFormData.superEarlyDiscountType === 'flat' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500'}`}
                                                >
                                                    ₹ Flat
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEarlyBirdFormData({ ...earlyBirdFormData, superEarlyDiscountType: 'percentage' })}
                                                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${earlyBirdFormData.superEarlyDiscountType === 'percentage' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500'}`}
                                                >
                                                    % Off
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Value</label>
                                            <input
                                                required
                                                type="number"
                                                min="0"
                                                value={earlyBirdFormData.superEarlyDiscountValue}
                                                onChange={(e) => setEarlyBirdFormData({ ...earlyBirdFormData, superEarlyDiscountValue: parseInt(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-amber-500 transition-all text-sm"
                                                placeholder="e.g. 20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Early Bird Section */}
                                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Tag size={16} className="text-blue-400" />
                                        <span className="text-xs font-black uppercase tracking-widest text-blue-400">Early Bird (Remaining Users)</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Discount Type</label>
                                            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                                                <button
                                                    type="button"
                                                    onClick={() => setEarlyBirdFormData({ ...earlyBirdFormData, earlyDiscountType: 'flat' })}
                                                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${earlyBirdFormData.earlyDiscountType === 'flat' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500'}`}
                                                >
                                                    ₹ Flat
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEarlyBirdFormData({ ...earlyBirdFormData, earlyDiscountType: 'percentage' })}
                                                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${earlyBirdFormData.earlyDiscountType === 'percentage' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500'}`}
                                                >
                                                    % Off
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Value</label>
                                            <input
                                                required
                                                type="number"
                                                min="0"
                                                value={earlyBirdFormData.earlyDiscountValue}
                                                onChange={(e) => setEarlyBirdFormData({ ...earlyBirdFormData, earlyDiscountValue: parseInt(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500 transition-all text-sm"
                                                placeholder="e.g. 200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEarlyBirdModalOpen(false)}
                                        className="flex-1 p-5 rounded-2xl border border-white/10 font-black italic uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all text-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black italic uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-amber-500/20 transition-all"
                                    >
                                        Save Configuration
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
