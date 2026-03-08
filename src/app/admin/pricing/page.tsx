'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/client';
import AdminSidebar from '@/components/AdminSidebar';
import { Loader2, Tag, Plus, Download, Trash2, Calendar, LayoutGrid } from 'lucide-react';
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

export default function AdminPricingPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        sponsorId: '',
        count: 10,
        value: 100,
        type: 'flat',
        prefix: 'ATH',
        expiryDate: ''
    });

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        Promise.all([fetchSponsors(), fetchCoupons()]).finally(() => setLoading(false));
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
            // Need to implement this endpoint or use sponsors/coupons if available
            // For now assuming we can list them
            const res = await apiClient.get('admin/coupons');
            setCoupons(res.data.data);
        } catch (err) {
            console.error('Failed to fetch coupons', err);
        }
    };

    const handleGenerateCoupons = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('admin/coupons/bulk-generate', formData);
            setIsModalOpen(false);
            fetchCoupons();
        } catch (err) {
            console.error('Failed to generate coupons', err);
            alert('Failed to generate coupons');
        }
    };

    if (authLoading || loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Loader2 className="animate-spin text-[#f82506]" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-black flex">
            <AdminSidebar />
            <div className="flex-1 ml-64 p-12 pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-[#f82506] font-black uppercase tracking-[0.3em] text-xs mb-4 block">Revenue & Promotions</span>
                            <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2 leading-none">
                                Pricing <span className="text-white">& Coupons</span>
                            </h1>
                            <p className="text-gray-400">Manage event pricing, discounts, and sponsor benefit codes.</p>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black italic uppercase tracking-widest hover:bg-[#f82506] hover:text-white transition-all shadow-xl shadow-white/5"
                        >
                            <Plus size={20} /> Generate Bulk Coupons
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 border-white/5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Active Coupons</h4>
                                <div className="text-3xl font-black italic text-white">{coupons.filter(c => c.usageCount === 0).length}</div>
                            </div>
                            <div className="glass-card p-6 border-white/5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Average Discount</h4>
                                <div className="text-3xl font-black italic text-[#f82506]">₹ 150</div>
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
                                    <Tag size={18} className="text-[#f82506]" /> Recent Coupons
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
            </div>

            {/* Bulk Generate Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
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
                                        value={formData.sponsorId}
                                        onChange={(e) => setFormData({ ...formData, sponsorId: e.target.value })}
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
                                            value={formData.count}
                                            onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#f82506] transition-all text-sm"
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Prefix Code</label>
                                        <input
                                            type="text"
                                            value={formData.prefix}
                                            onChange={(e) => setFormData({ ...formData, prefix: e.target.value.toUpperCase() })}
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
                                                onClick={() => setFormData({ ...formData, type: 'flat' })}
                                                className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'flat' ? 'bg-[#f82506] text-white shadow-lg' : 'text-gray-500'}`}
                                            >
                                                Flat ₹
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type: 'percentage' })}
                                                className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'percentage' ? 'bg-[#f82506] text-white shadow-lg' : 'text-gray-500'}`}
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
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) })}
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
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 outline-none focus:border-[#f82506] transition-all text-sm uppercase color-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
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
        </div>
    );
}
