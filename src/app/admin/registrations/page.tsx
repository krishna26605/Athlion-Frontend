'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import { motion } from 'framer-motion';
import { Users, Search, Loader2, CheckCircle2, Clock, ShieldCheck, Mail, Activity } from 'lucide-react';
import { formatDate } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

interface User {
    name: string;
    email: string;
    phone: string;
}

interface Registration {
    _id: string;
    user: User;
    event: {
        name: string;
    };
    level: string;
    batchTime: string;
    verificationCode: string;
    paymentStatus: string;
    checkInStatus: boolean;
    createdAt: string;
}

export default function AdminRegistrations() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchAllRegistrations();
    }, []);

    const fetchAllRegistrations = async () => {
        try {
            const res = await apiClient.get('registrations/admin/all');
            setRegistrations(res.data.data);
        } catch (err) {
            console.error('Failed to fetch registrations', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredRegs = registrations.filter(reg =>
        reg.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.verificationCode?.includes(searchTerm) ||
        reg.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCheckIn = async (regId: string) => {
        try {
            await apiClient.post(`registrations/admin/verify/${regId}`);
            setRegistrations(prev => prev.map(r =>
                r._id === regId ? { ...r, checkInStatus: true } : r
            ));
        } catch (err) {
            alert('Verification failed');
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
                            <span className="text-[#f82506] font-black uppercase tracking-[0.3em] text-xs mb-4 block">Race Day Operations</span>
                            <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2 leading-none">
                                Athlete <span className="text-white">Check-in</span>
                            </h1>
                            <p className="text-gray-400">Verify athlete credentials and manage event registrations.</p>
                        </div>

                        <div className="relative w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search Name or 4-Digit Code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-[#f82506]/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="glass-card overflow-hidden border-white/5">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] bg-white/[0.02]">
                                    <th className="py-6 pl-8">Athlete Info</th>
                                    <th className="py-6">Race Details</th>
                                    <th className="py-6">Wave Slot</th>
                                    <th className="py-6">Verification</th>
                                    <th className="py-6">Status</th>
                                    <th className="py-6 pr-8 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredRegs.map((reg) => (
                                    <tr key={reg._id} className="group hover:bg-white/[0.01] transition-colors">
                                        <td className="py-6 pl-8">
                                            <div className="font-black italic uppercase tracking-tight text-lg">{reg.user?.name || 'Unknown'}</div>
                                            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                                <Mail size={10} /> {reg.user?.email || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <div className="font-bold text-sm text-gray-300 uppercase">{reg.event?.name || 'Deleted Event'}</div>
                                            <div className="text-[10px] text-[#f82506] font-black uppercase italic tracking-widest mt-0.5">{reg.level}</div>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-400 font-bold italic">
                                                <Clock size={14} className="text-gray-700" /> {reg.batchTime}
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <div className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-1.5 w-fit text-xl font-black italic tracking-[0.2em] text-[#f82506] shadow-inner">
                                                {reg.verificationCode}
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            {reg.checkInStatus ? (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-wider">
                                                    <CheckCircle2 size={12} /> Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-gray-500 text-[9px] font-black uppercase tracking-wider">
                                                    <ShieldCheck size={12} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-6 pr-8 text-right">
                                            {!reg.checkInStatus && (
                                                <button
                                                    onClick={() => handleCheckIn(reg._id)}
                                                    className="bg-white text-black px-5 py-2 rounded-xl font-black italic uppercase text-[10px] tracking-widest hover:bg-[#f82506] hover:text-white transition-all shadow-xl shadow-white/5"
                                                >
                                                    Verify Athlete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredRegs.length === 0 && (
                            <div className="p-20 text-center">
                                <Activity size={40} className="mx-auto text-zinc-800 mb-4" />
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No registrations matching your search.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
