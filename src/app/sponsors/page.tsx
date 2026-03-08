'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/api/client';
import { motion } from 'framer-motion';
import { Trophy, MapPin, Globe, Loader2, ArrowLeft, Zap, Users, Activity } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Sponsor {
    _id: string;
    name: string;
    logo?: string;
    description: string;
    type: 'Sponsor' | 'Gym Partner' | 'Run Club';
    website?: string;
    adImages: string[];
}

export default function SponsorsPage() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const res = await apiClient.get('sponsors');
                setSponsors(res.data.data || res.data);
            } catch (err) {
                console.error('Failed to fetch sponsors', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSponsors();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Loader2 className="animate-spin text-[#f82506]" size={40} />
        </div>
    );

    const categories = [
        { id: 'Sponsor', title: 'OFFICIAL SPONSORS', icon: <Trophy className="text-[#f82506]" /> },
        { id: 'Gym Partner', title: 'GYM PARTNERS', icon: <Zap className="text-[#f82506]" /> },
        { id: 'Run Club', title: 'RUN CLUBS', icon: <Users className="text-[#f82506]" /> }
    ];

    return (
        <div className="min-h-screen pt-32 pb-24 bg-black px-4">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 uppercase text-xs font-black tracking-widest group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="mb-20 text-center">
                    <span className="text-[#f82506] font-black uppercase tracking-[0.4em] text-xs mb-4 block">Powering the Performance</span>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none">
                        OUR <span className="text-white">PARTNERS</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto uppercase font-black italic">
                        The elite brands and communities driving the Athlion revolution across India.
                    </p>
                </div>

                <div className="space-y-32">
                    {categories.map((category) => {
                        const filteredSponsors = sponsors.filter(s => s.type === category.id);
                        if (filteredSponsors.length === 0) return null;

                        return (
                            <section key={category.id}>
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="p-3 bg-white/5 rounded-2xl">
                                        {category.icon}
                                    </div>
                                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">{category.title}</h2>
                                    <div className="flex-grow h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredSponsors.map((sponsor, i) => (
                                        <motion.div
                                            key={sponsor._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="glass-card group hover:border-[#f82506]/30 transition-all p-8 flex flex-col h-full bg-zinc-950/40"
                                        >
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden p-2">
                                                    {sponsor.logo ? (
                                                        <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <Trophy className="text-zinc-800" size={32} />
                                                    )}
                                                </div>
                                                {sponsor.website && (
                                                    <a
                                                        href={sponsor.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-white/5 rounded-xl hover:bg-[#f82506] transition-colors"
                                                    >
                                                        <Globe size={18} />
                                                    </a>
                                                )}
                                            </div>

                                            <h3 className="text-2xl font-black italic uppercase italic tracking-tight mb-4 group-hover:text-[#f82506] transition-colors">
                                                {sponsor.name}
                                            </h3>

                                            <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                                                {sponsor.description}
                                            </p>

                                            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f82506]">
                                                    {sponsor.type}
                                                </span>
                                                {sponsor.adImages?.length > 0 && (
                                                    <span className="flex items-center gap-2 text-[10px] font-black text-gray-600">
                                                        <Activity size={12} /> FEATURED AD
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>

                {sponsors.length === 0 && (
                    <div className="text-center py-24 border border-dashed border-white/10 rounded-[4rem]">
                        <Trophy size={64} className="mx-auto text-zinc-800 mb-6" />
                        <h3 className="text-2xl font-black italic uppercase mb-2">PARTNERSHIP IN PROGRESS</h3>
                        <p className="text-gray-500 uppercase font-black text-xs tracking-widest">Great things are coming to the stadium.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
