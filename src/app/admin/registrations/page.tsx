'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Search, Loader2, CheckCircle2, Clock, ShieldCheck,
    Mail, Activity, Tag, Filter, X, Phone, ArrowUpRight, Percent, Award
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface User {
    _id?: string;
    name: string;
    email: string;
    phone: string;
}

interface CouponInfo {
    _id: string;
    code: string;
    type: 'flat' | 'percentage';
    value: number;
    sponsor?: {
        _id?: string;
        name: string;
    };
}

interface Registration {
    _id: string;
    user: User;
    event: {
        _id?: string;
        name: string;
    };
    level: string;
    category?: string;
    batchTime: string;
    verificationCode: string;
    paymentStatus: string;
    checkInStatus: boolean;
    createdAt: string;
    amountPaid?: number;
    couponUsed?: CouponInfo | null;
    discountType?: string;
    discountValue?: number;
    discountLabel?: string;
}

interface AvailableCoupon {
    _id: string;
    code: string;
    sponsorName?: string;
    type?: 'flat' | 'percentage';
    value?: number;
}

function AdminRegistrationsContent() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [couponsList, setCouponsList] = useState<AvailableCoupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCoupon, setSelectedCoupon] = useState<string>('all');

    // Read coupon from URL on load
    useEffect(() => {
        const urlCoupon = searchParams.get('coupon');
        if (urlCoupon) {
            setSelectedCoupon(urlCoupon);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [regRes, couponsRes] = await Promise.all([
                apiClient.get('registrations/admin/all'),
                apiClient.get('admin/coupons').catch(() => ({ data: { data: [] } }))
            ]);

            setRegistrations(regRes.data?.data || []);
            setCouponsList(
                (couponsRes.data?.data || []).map((c: any) => ({
                    _id: c._id,
                    code: c.code,
                    sponsorName: c.sponsor?.name || 'General',
                    type: c.type,
                    value: c.value
                }))
            );
        } catch (err) {
            console.error('Failed to fetch registrations data', err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate coupon counts based on completed registrations
    const { couponStats, allCouponOptions } = useMemo(() => {
        const counts: Record<string, number> = {};
        let withAnyCoupon = 0;
        let withNoCoupon = 0;

        registrations.forEach((reg) => {
            const code = reg.couponUsed?.code?.toUpperCase();
            if (code) {
                counts[code] = (counts[code] || 0) + 1;
                withAnyCoupon++;
            } else if (reg.discountType === 'coupon' && reg.discountLabel) {
                // Fallback check if coupon code is embedded in label
                const match = reg.discountLabel.match(/Coupon\s+([A-Za-z0-9_-]+)/i);
                if (match && match[1]) {
                    const fallbackCode = match[1].toUpperCase();
                    counts[fallbackCode] = (counts[fallbackCode] || 0) + 1;
                    withAnyCoupon++;
                } else {
                    withAnyCoupon++;
                }
            } else {
                withNoCoupon++;
            }
        });

        // Combine known coupon list with any dynamically observed coupons in registrations
        const optionsMap = new Map<string, AvailableCoupon>();

        couponsList.forEach((c) => {
            optionsMap.set(c.code.toUpperCase(), c);
        });

        registrations.forEach((reg) => {
            if (reg.couponUsed?.code) {
                const upper = reg.couponUsed.code.toUpperCase();
                if (!optionsMap.has(upper)) {
                    optionsMap.set(upper, {
                        _id: reg.couponUsed._id || upper,
                        code: upper,
                        sponsorName: reg.couponUsed.sponsor?.name || 'Partner',
                        type: reg.couponUsed.type,
                        value: reg.couponUsed.value
                    });
                }
            }
        });

        return {
            couponStats: {
                counts,
                withAnyCoupon,
                withNoCoupon,
                total: registrations.length,
            },
            allCouponOptions: Array.from(optionsMap.values()).sort((a, b) => {
                const countA = counts[a.code.toUpperCase()] || 0;
                const countB = counts[b.code.toUpperCase()] || 0;
                return countB - countA; // Most used coupons first
            })
        };
    }, [registrations, couponsList]);

    // Filter registrations
    const filteredRegs = useMemo(() => {
        return registrations.filter((reg) => {
            // Text Search Filter
            const search = searchTerm.toLowerCase().trim();
            const matchesSearch =
                !search ||
                reg.user?.name?.toLowerCase().includes(search) ||
                reg.user?.email?.toLowerCase().includes(search) ||
                reg.user?.phone?.includes(search) ||
                reg.verificationCode?.includes(search) ||
                reg.event?.name?.toLowerCase().includes(search) ||
                reg.couponUsed?.code?.toLowerCase().includes(search) ||
                reg.discountLabel?.toLowerCase().includes(search);

            if (!matchesSearch) return false;

            // Coupon Filter
            if (selectedCoupon === 'all') return true;

            if (selectedCoupon === 'any_coupon') {
                return Boolean(reg.couponUsed || reg.discountType === 'coupon');
            }

            if (selectedCoupon === 'no_coupon') {
                return !reg.couponUsed && reg.discountType !== 'coupon';
            }

            const targetCode = selectedCoupon.toUpperCase().trim();
            const regCode = reg.couponUsed?.code?.toUpperCase().trim();
            const regId = reg.couponUsed?._id;

            return (
                regCode === targetCode ||
                regId === selectedCoupon ||
                Boolean(reg.discountLabel && reg.discountLabel.toUpperCase().includes(targetCode))
            );
        });
    }, [registrations, searchTerm, selectedCoupon]);

    const handleClearCouponFilter = () => {
        setSelectedCoupon('all');
        const url = new URL(window.location.href);
        url.searchParams.delete('coupon');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    };

    const handleSelectCoupon = (val: string) => {
        setSelectedCoupon(val);
        const url = new URL(window.location.href);
        if (val === 'all') {
            url.searchParams.delete('coupon');
        } else {
            url.searchParams.set('coupon', val);
        }
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    };

    const handleCheckIn = async (regId: string) => {
        try {
            await apiClient.post(`registrations/admin/verify/${regId}`);
            setRegistrations((prev) =>
                prev.map((r) => (r._id === regId ? { ...r, checkInStatus: true } : r))
            );
        } catch (err) {
            alert('Verification failed');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-[#f82506]" size={40} />
            </div>
        );
    }

    const verifiedCount = registrations.filter((r) => r.checkInStatus).length;
    const totalCouponRedeemed = couponStats.withAnyCoupon;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div className="glass-card p-4 md:p-5 border-white/5 bg-zinc-950/40">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest">Total Bookings</span>
                        <Users size={16} className="text-[#f82506]" />
                    </div>
                    <div className="text-2xl md:text-3xl font-black italic tracking-tight text-white">
                        {registrations.length}
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">Confirmed Athletes</p>
                </div>

                <div className="glass-card p-4 md:p-5 border-white/5 bg-zinc-950/40">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest">Coupon Enrolled</span>
                        <Tag size={16} className="text-emerald-400" />
                    </div>
                    <div className="text-2xl md:text-3xl font-black italic tracking-tight text-emerald-400">
                        {totalCouponRedeemed}
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                        {registrations.length > 0
                            ? `${Math.round((totalCouponRedeemed / registrations.length) * 100)}% of athletes`
                            : '0%'}
                    </p>
                </div>

                <div className="glass-card p-4 md:p-5 border-white/5 bg-zinc-950/40">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest">Active Filter View</span>
                        <Filter size={16} className="text-amber-400" />
                    </div>
                    <div className="text-2xl md:text-3xl font-black italic tracking-tight text-amber-400">
                        {filteredRegs.length}
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">Matching Criteria</p>
                </div>

                <div className="glass-card p-4 md:p-5 border-white/5 bg-zinc-950/40">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest">Venue Verified</span>
                        <CheckCircle2 size={16} className="text-green-500" />
                    </div>
                    <div className="text-2xl md:text-3xl font-black italic tracking-tight text-white">
                        {verifiedCount}
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">Checked-In Athletes</p>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="glass-card p-4 md:p-6 border-white/5 bg-zinc-950/60">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search Athlete, Email, Phone, Code, or Event..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl py-3.5 pl-11 pr-10 text-sm text-white placeholder-gray-500 outline-none focus:border-[#f82506]/50 transition-all font-medium"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Coupon Selector Dropdown */}
                    <div className="relative w-full lg:w-80">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5 text-gray-400">
                            <Tag size={16} className="text-[#f82506]" />
                        </div>
                        <select
                            value={selectedCoupon}
                            onChange={(e) => handleSelectCoupon(e.target.value)}
                            className="w-full appearance-none bg-black/60 border border-white/10 rounded-2xl py-3.5 pl-11 pr-10 text-xs font-bold uppercase tracking-wider text-white outline-none focus:border-[#f82506]/50 transition-all cursor-pointer"
                        >
                            <option value="all" className="bg-zinc-900 text-white">
                                All Registrations ({registrations.length})
                            </option>
                            <option value="any_coupon" className="bg-zinc-900 text-emerald-400 font-bold">
                                🎟️ Any Coupon Used ({couponStats.withAnyCoupon})
                            </option>
                            <option value="no_coupon" className="bg-zinc-900 text-gray-400">
                                Standard Entry / No Coupon ({couponStats.withNoCoupon})
                            </option>

                            {allCouponOptions.length > 0 && (
                                <optgroup label="── Individual Coupons ──" className="bg-zinc-950 text-gray-400">
                                    {allCouponOptions.map((c) => {
                                        const count = couponStats.counts[c.code.toUpperCase()] || 0;
                                        return (
                                            <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                                                🏷️ {c.code} {c.sponsorName ? `(${c.sponsorName})` : ''} — {count} athlete{count !== 1 ? 's' : ''}
                                            </option>
                                        );
                                    })}
                                </optgroup>
                            )}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Active Filter Chips / Pills */}
                <AnimatePresence>
                    {(selectedCoupon !== 'all' || searchTerm) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/5"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                Active Filters:
                            </span>

                            {selectedCoupon !== 'all' && (
                                <div className="inline-flex items-center gap-2 bg-[#f82506]/10 border border-[#f82506]/40 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm shadow-[#f82506]/20">
                                    <Tag size={12} className="text-[#f82506]" />
                                    <span>
                                        {selectedCoupon === 'any_coupon'
                                            ? 'Any Coupon'
                                            : selectedCoupon === 'no_coupon'
                                            ? 'Standard / No Coupon'
                                            : `Coupon: ${selectedCoupon.toUpperCase()}`}
                                    </span>
                                    <span className="bg-[#f82506] text-white px-1.5 py-0.2 rounded-full text-[9px] font-black">
                                        {filteredRegs.length}
                                    </span>
                                    <button
                                        onClick={handleClearCouponFilter}
                                        className="hover:text-red-400 transition-colors ml-1"
                                        title="Clear coupon filter"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}

                            {searchTerm && (
                                <div className="inline-flex items-center gap-2 bg-zinc-900 border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-gray-300">
                                    <Search size={12} className="text-gray-400" />
                                    <span>Search: &ldquo;{searchTerm}&rdquo;</span>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="hover:text-white transition-colors ml-1"
                                        title="Clear search"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    handleClearCouponFilter();
                                    setSearchTerm('');
                                }}
                                className="text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-white transition-colors ml-auto"
                            >
                                Reset All
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden space-y-3">
                {filteredRegs.map((reg) => (
                    <div key={reg._id} className="glass-card p-4 border-white/5 bg-zinc-950/50 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-black italic uppercase tracking-tight text-base text-white">
                                    {reg.user?.name || 'Unknown Athlete'}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold mt-0.5">
                                    <Mail size={10} className="text-gray-500" />
                                    <span>{reg.user?.email || 'N/A'}</span>
                                </div>
                                {reg.user?.phone && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold mt-0.5">
                                        <Phone size={10} className="text-gray-500" />
                                        <span>{reg.user?.phone}</span>
                                    </div>
                                )}
                            </div>

                            {reg.checkInStatus ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-wider border border-green-500/20">
                                    <CheckCircle2 size={10} /> Verified
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 text-gray-500 text-[9px] font-black uppercase tracking-wider border border-white/5">
                                    <ShieldCheck size={10} /> Pending
                                </span>
                            )}
                        </div>

                        {/* Race & Coupon Info */}
                        <div className="bg-black/60 rounded-xl p-3 border border-white/5 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-gray-300 uppercase">{reg.event?.name || 'ATHLiON Race'}</span>
                                <span className="text-[10px] text-[#f82506] font-black uppercase italic tracking-wider">
                                    {reg.level || 'Classical'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <Clock size={12} className="text-gray-500" />
                                    <span className="font-bold italic">{reg.batchTime || 'Wave Slot'}</span>
                                </div>
                                <div className="font-mono font-black text-[#f82506] tracking-widest bg-zinc-900 px-2 py-0.5 rounded">
                                    {reg.verificationCode}
                                </div>
                            </div>

                            {/* Coupon / Discount Badge */}
                            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                {reg.couponUsed?.code ? (
                                    <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-[#f82506]/40 px-2 py-1 rounded-lg">
                                        <Tag size={10} className="text-[#f82506]" />
                                        <span className="font-mono font-black text-xs text-white">{reg.couponUsed.code}</span>
                                        <span className="text-[9px] text-emerald-400 font-bold">
                                            ({reg.couponUsed.type === 'percentage' ? `${reg.couponUsed.value}% off` : `₹${reg.couponUsed.value} off`})
                                        </span>
                                    </div>
                                ) : reg.discountType === 'coupon' ? (
                                    <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-[#f82506]/40 px-2 py-1 rounded-lg">
                                        <Tag size={10} className="text-[#f82506]" />
                                        <span className="font-mono font-black text-xs text-white">
                                            {reg.discountLabel || 'Coupon Applied'}
                                        </span>
                                    </div>
                                ) : reg.discountType === 'super_early' || reg.discountType === 'early' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                                        <Percent size={10} /> {reg.discountLabel || 'Early Bird'}
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">
                                        Standard Entry
                                    </span>
                                )}

                                {reg.amountPaid !== undefined && (
                                    <span className="text-[10px] font-mono font-bold text-gray-300">
                                        Paid: ₹{reg.amountPaid}
                                    </span>
                                )}
                            </div>
                        </div>

                        {!reg.checkInStatus && (
                            <button
                                onClick={() => handleCheckIn(reg._id)}
                                className="w-full bg-white text-black py-2 rounded-xl font-black italic uppercase text-[10px] tracking-wider hover:bg-[#f82506] hover:text-white transition-all shadow-md"
                            >
                                Verify Athlete
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block glass-card overflow-hidden border-white/5 bg-zinc-950/40">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] bg-white/[0.02]">
                            <th className="py-5 pl-8">Athlete Info</th>
                            <th className="py-5">Race Details</th>
                            <th className="py-5">Coupon / Discount</th>
                            <th className="py-5">Wave Slot</th>
                            <th className="py-5">Verification</th>
                            <th className="py-5">Status</th>
                            <th className="py-5 pr-8 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredRegs.map((reg) => (
                            <tr key={reg._id} className="group hover:bg-white/[0.015] transition-colors">
                                {/* Athlete Info */}
                                <td className="py-5 pl-8">
                                    <div className="font-black italic uppercase tracking-tight text-base text-white">
                                        {reg.user?.name || 'Unknown'}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mt-0.5">
                                        <span className="flex items-center gap-1">
                                            <Mail size={10} className="text-gray-500" />
                                            {reg.user?.email || 'N/A'}
                                        </span>
                                        {reg.user?.phone && (
                                            <span className="flex items-center gap-1 text-gray-500">
                                                • <Phone size={10} className="text-gray-600" />
                                                {reg.user?.phone}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                {/* Race Details */}
                                <td className="py-5">
                                    <div className="font-bold text-sm text-gray-200 uppercase">
                                        {reg.event?.name || 'ATHLiON Race'}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-[#f82506] font-black uppercase italic tracking-widest mt-0.5">
                                        <span>{reg.level || 'Classical'}</span>
                                        {reg.category && <span className="text-gray-600">• {reg.category}</span>}
                                    </div>
                                </td>

                                {/* Discount / Coupon Column */}
                                <td className="py-5">
                                    {reg.couponUsed?.code ? (
                                        <div className="space-y-1">
                                            <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-[#f82506]/40 px-2.5 py-1 rounded-lg">
                                                <Tag size={12} className="text-[#f82506]" />
                                                <span className="font-mono font-black text-xs text-white">
                                                    {reg.couponUsed.code}
                                                </span>
                                                <span className="text-[10px] font-bold text-emerald-400">
                                                    ({reg.couponUsed.type === 'percentage'
                                                        ? `${reg.couponUsed.value}% off`
                                                        : `₹${reg.couponUsed.value} off`})
                                                </span>
                                            </div>
                                            {reg.couponUsed.sponsor?.name && (
                                                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                                                    Partner: {reg.couponUsed.sponsor.name}
                                                </div>
                                            )}
                                        </div>
                                    ) : reg.discountType === 'coupon' ? (
                                        <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-[#f82506]/40 px-2.5 py-1 rounded-lg">
                                            <Tag size={12} className="text-[#f82506]" />
                                            <span className="font-mono font-bold text-xs text-white">
                                                {reg.discountLabel || 'Coupon Applied'}
                                            </span>
                                        </div>
                                    ) : reg.discountType === 'super_early' || reg.discountType === 'early' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                            <Percent size={12} />
                                            {reg.discountLabel || 'Early Bird Discount'}
                                        </span>
                                    ) : (
                                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                            Standard Entry
                                        </span>
                                    )}

                                    {reg.amountPaid !== undefined && (
                                        <div className="text-[10px] text-gray-400 font-mono mt-1">
                                            Paid: ₹{reg.amountPaid}
                                        </div>
                                    )}
                                </td>

                                {/* Wave Slot */}
                                <td className="py-5">
                                    <div className="flex items-center gap-2 text-sm text-gray-300 font-bold italic">
                                        <Clock size={14} className="text-[#f82506]" />
                                        <span>{reg.batchTime || 'TBA'}</span>
                                    </div>
                                </td>

                                {/* Verification Code */}
                                <td className="py-5">
                                    <div className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 w-fit text-lg font-black italic tracking-[0.2em] text-[#f82506] shadow-inner font-mono">
                                        {reg.verificationCode}
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="py-5">
                                    {reg.checkInStatus ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black uppercase tracking-wider">
                                            <CheckCircle2 size={12} /> Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-gray-500 text-[9px] font-black uppercase tracking-wider">
                                            <ShieldCheck size={12} /> Pending
                                        </span>
                                    )}
                                </td>

                                {/* Action */}
                                <td className="py-5 pr-8 text-right">
                                    {!reg.checkInStatus ? (
                                        <button
                                            onClick={() => handleCheckIn(reg._id)}
                                            className="bg-white text-black px-4 py-2 rounded-xl font-black italic uppercase text-[10px] tracking-widest hover:bg-[#f82506] hover:text-white transition-all shadow-lg shadow-white/5 active:scale-95"
                                        >
                                            Verify
                                        </button>
                                    ) : (
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                            Checked In
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {filteredRegs.length === 0 && (
                <div className="p-12 md:p-20 text-center glass-card border-white/5 rounded-3xl bg-zinc-950/40">
                    <Activity size={36} className="mx-auto text-zinc-800 mb-4" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-1">
                        No Registrations Found
                    </h3>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-widest max-w-md mx-auto mb-6">
                        {selectedCoupon !== 'all'
                            ? `No athletes found enrolled under coupon "${selectedCoupon}".`
                            : 'No athlete bookings match your current search criteria.'}
                    </p>
                    {(selectedCoupon !== 'all' || searchTerm) && (
                        <button
                            onClick={() => {
                                handleClearCouponFilter();
                                setSearchTerm('');
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-black uppercase tracking-wider hover:border-[#f82506] transition-all"
                        >
                            <X size={14} /> Clear All Filters
                        </button>
                    )}
                </div>
            )}
        </motion.div>
    );
}

export default function AdminRegistrations() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[50vh] flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#f82506]" size={36} />
                </div>
            }
        >
            <AdminRegistrationsContent />
        </Suspense>
    );
}
