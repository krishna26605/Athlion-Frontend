'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import { motion } from 'framer-motion';
import { Users, Calendar, Trophy, TrendingUp, Loader2, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/utils/utils';
import { useRouter } from 'next/navigation';


interface Stats {
    totalUsers: number;
    totalEvents: number;
    totalRegistrations: number;
    revenue: number;
}

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await apiClient.get('admin/stats');
            setStats(res.data.data);
        } catch (err) {
            console.error('Failed to fetch stats', err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Loader2 className="animate-spin text-[#f82506]" size={40} />
        </div>
    );

    const cards = [
        { title: 'Total Revenue', value: formatCurrency(stats?.revenue || 0), icon: <TrendingUp className="text-green-500" />, sub: '+12% from last month' },
        { title: 'Athletes Registered', value: stats?.totalUsers.toString() || '0', icon: <Users className="text-blue-500" />, sub: 'Across all levels' },
        { title: 'Active Events', value: stats?.totalEvents.toString() || '0', icon: <Calendar className="text-[#f82506]" />, sub: 'Currently live' },
        { title: 'Total Bookings', value: stats?.totalRegistrations.toString() || '0', icon: <Trophy className="text-yellow-500" />, sub: 'Confirmed entries' },
    ];

    return (
        <>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {cards.map((card, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={card.title}
                                className="glass-card p-8 border-white/5 hover:border-white/10 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                                        {card.icon}
                                    </div>
                                    <ArrowUpRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{card.title}</h3>
                                <div className="text-3xl font-black italic tracking-tight mb-2">{card.value}</div>
                                <p className="text-[10px] font-bold text-gray-700 uppercase">{card.sub}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 glass-card p-8 border-white/5 min-h-[400px] flex items-center justify-center">
                            <div className="text-center">
                                <TrendingUp size={48} className="text-zinc-900 mx-auto mb-4" />
                                <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Analytics Visualization coming soon</p>
                            </div>
                        </div>
                        <div className="glass-card p-8 border-white/5 bg-zinc-950/50">
                            <h3 className="text-lg font-black italic uppercase mb-6 tracking-tight">Recent Activity</h3>
                            <div className="space-y-6">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex gap-4 items-start border-l-2 border-[#f82506]/20 pl-4 py-1">
                                        <div>
                                            <p className="text-xs font-bold text-gray-300 uppercase tracking-tight line-clamp-1">New registration for ATHLiON North</p>
                                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1">2 mins ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </>
);
}
