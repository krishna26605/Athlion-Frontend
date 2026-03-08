'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, QrCode, MapPin, Calendar, Clock, ArrowRight, Loader2, Download, Activity, ShieldCheck } from 'lucide-react';
import { formatDate } from '@/utils/utils';
import { QRCodeSVG } from 'qrcode.react';
import SponsorAds from '@/components/SponsorAds';

interface Sponsor {
    _id: string;
    name: string;
    adImages: string[];
    website?: string;
    type: string;
    logo?: string;
}

interface Event {
    _id: string;
    name: string;
    venue: {
        address: string;
    };
    date: string;
    startTime: string;
    price: number;
    status: string;
}

interface Registration {
    _id: string;
    event: {
        _id: string;
        name: string;
        venue: {
            address: string;
            googleMapsLink: string;
        };
        date: string;
    };
    batchNumber: number;
    batchTime: string;
    paymentStatus: string;
    qrCode: string;
    amountPaid: number;
    verifiedAt: string;
}

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [regRes, sponsorRes, eventRes] = await Promise.all([
                    apiClient.get('registrations/my'),
                    apiClient.get('sponsors'),
                    apiClient.get('events')
                ]);
                setRegistrations(regRes.data.data);
                setSponsors(sponsorRes.data.data || sponsorRes.data);
                setEvents(eventRes.data.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    if (authLoading || loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Loader2 className="animate-spin text-[#f82506]" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <span className="text-[#f82506] font-black uppercase tracking-[0.3em] text-xs mb-4 block">Athlete Profile</span>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-none">
                            MY <span className="text-white">DASHBOARD</span>
                        </h1>
                        <p className="text-gray-400 text-lg">Manage your registrations and view your assigned race slots.</p>
                    </div>

                    <div className="glass-card p-6 flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#f82506] rounded-2xl flex items-center justify-center font-black text-2xl italic">
                            {user?.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-black italic uppercase tracking-tight text-xl">{user?.name}</h3>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{user?.role}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 flex flex-col gap-12">
                        <h2 className="text-2xl font-black italic uppercase tracking-tight mb-0 flex items-center gap-3">
                            <QrCode className="text-[#f82506]" /> CONFIRMED TICKETS
                        </h2>

                        {registrations.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8">
                                {registrations.map((reg, i) => (
                                    <motion.div
                                        key={reg._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass-card overflow-hidden bg-zinc-950/50 flex flex-col md:flex-row p-8 gap-8 border-[#f82506]/20"
                                    >
                                        <div className="flex flex-col flex-grow">
                                            <span className="bg-[#f82506] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-fit mb-4">
                                                Confirmed Slot
                                            </span>
                                            <h3 className="text-3xl font-black italic uppercase italic tracking-tight mb-6">{reg.event.name}</h3>

                                            <div className="space-y-4 mb-8 text-sm">
                                                <div className="flex items-center gap-3 text-gray-400">
                                                    <Calendar size={16} className="text-[#f82506]" />
                                                    <span>{formatDate(reg.event.date)}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-white font-bold">
                                                    <Clock size={16} className="text-[#f82506]" />
                                                    <span className="text-lg">BATCH {reg.batchNumber} • {reg.batchTime}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-400">
                                                    <MapPin size={16} className="text-[#f82506]" />
                                                    <span className="truncate">{reg.event.venue.address}</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                <a
                                                    href={reg.event.venue.googleMapsLink}
                                                    target="_blank"
                                                    className="text-white hover:text-[#f82506] transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                                                >
                                                    GET DIRECTIONS <ArrowRight size={14} className="rotate-[-45deg]" />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl min-w-[200px]">
                                            <QRCodeSVG value={reg.qrCode} size={150} level="H" />
                                            <span className="mt-4 text-[10px] font-black uppercase text-black italic tracking-widest opacity-50">
                                                SCAN AT VENUE
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem] bg-zinc-950/20">
                                <Trophy size={64} className="mx-auto text-zinc-800 mb-6" />
                                <h3 className="text-2xl font-black italic uppercase mb-4">No registrations yet</h3>
                                <p className="text-gray-500 mb-10 max-w-sm mx-auto text-sm">Pick a race challenge yourself. The world's largest fitness race is waiting for you.</p>
                                <Link href="/events" className="btn-primary">EXPLORE EVENTS</Link>
                            </div>
                        )}

                        {/* Upcoming Events Section (Always Visible) */}
                        <div className="mt-12">
                            <h2 className="text-2xl font-black italic uppercase tracking-tight mb-8 flex items-center gap-3">
                                <Trophy className="text-[#f82506]" /> UPCOMING RACES
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {events.filter(ev => ev.status === 'upcoming').slice(0, 4).map((event) => (
                                    <Link key={event._id} href={`/events/${event._id}`}>
                                        <div className="glass-card p-6 border-white/5 hover:border-[#f82506]/30 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-zinc-900 text-white">
                                                    {event.status}
                                                </span>
                                                <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#f82506] transition-all">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-black italic uppercase tracking-tight mb-4 group-hover:text-[#f82506] transition-colors line-clamp-1">{event.name}</h3>
                                            <div className="space-y-2 text-xs text-gray-500 font-bold uppercase tracking-tight">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} className="text-[#f82506]" />
                                                    <span>{formatDate(event.date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={12} className="text-[#f82506]" />
                                                    <span className="truncate">{event.venue.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {events.filter(ev => ev.status === 'upcoming').length === 0 && (
                                    <div className="col-span-2 text-center py-10 border border-dashed border-white/5 rounded-3xl">
                                        <p className="text-gray-700 text-[10px] font-black uppercase tracking-widest">No new races announced yet.</p>
                                    </div>
                                )}
                            </div>
                            {events.length > 0 && (
                                <div className="mt-8">
                                    <Link href="/events" className="text-[#f82506] font-black uppercase tracking-widest text-[10px] hover:underline flex items-center gap-2">
                                        VIEW ALL RACES <ArrowRight size={14} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-12">
                        {/* Ads Sidebar Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-black italic uppercase tracking-tight flex items-center gap-3">
                                <Activity className="text-[#f82506]" size={18} /> FEATURED
                            </h2>
                            <SponsorAds sponsors={sponsors} />
                        </div>

                        {/* Partners Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-black italic uppercase tracking-tight flex items-center gap-3">
                                <ShieldCheck className="text-[#f82506]" size={18} /> OUR PARTNERS
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {sponsors.filter(s => s.type !== 'Sponsor').map(partner => (
                                    <div key={partner._id} className="glass-card p-4 border-white/5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden">
                                            {partner.logo ? (
                                                <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Trophy className="text-zinc-800" size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-black italic uppercase tracking-tight text-sm">{partner.name}</h4>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-[#f82506]">{partner.type}</span>
                                        </div>
                                    </div>
                                ))}
                                {sponsors.filter(s => s.type !== 'Sponsor').length === 0 && (
                                    <p className="text-center py-10 text-gray-700 text-[10px] font-black uppercase tracking-widest border border-dashed border-white/5 rounded-2xl">
                                        More partners coming soon...
                                    </p>
                                )}
                            </div>
                            {sponsors.length > 0 && (
                                <div className="mt-4">
                                    <Link href="/sponsors" className="text-[#f82506] font-black uppercase tracking-widest text-[8px] hover:underline flex items-center gap-1">
                                        VIEW ALL PARTNERS <ArrowRight size={12} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
