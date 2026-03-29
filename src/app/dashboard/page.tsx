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
import AthlionInfoModal from '@/components/AthlionInfoModal';
import { HelpCircle } from 'lucide-react';

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
    checkInStatus: boolean;
    verificationCode: string;
    createdAt: string;
    verifiedAt: string;
}

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

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
        <div className="min-h-screen pt-20 md:pt-32 pb-28 md:pb-24 px-4 bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8 mb-10 md:mb-16">
                    <div>
                        <span className="text-[#f82506] font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 md:mb-4 block">Athlete Profile</span>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4 md:mb-6 leading-none">
                            MY <span className="text-white">DASHBOARD</span>
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                            <p className="text-gray-400 text-sm md:text-lg">Manage your registrations and view your assigned race slots.</p>
                            <button
                                onClick={() => setIsInfoModalOpen(true)}
                                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-[#f82506]/10 border border-[#f82506]/30 text-[#f82506] hover:bg-[#f82506] hover:text-white transition-all group w-fit"
                            >
                                <HelpCircle size={16} className="group-hover:rotate-12 transition-transform" />
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">What is ATHLiON?</span>
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-4 md:p-6 flex items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-[#f82506] rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl italic shrink-0">
                            {user?.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-black italic uppercase tracking-tight text-base md:text-xl">{user?.name}</h3>
                            <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">{user?.role}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    <div className="lg:col-span-8 flex flex-col gap-8 md:gap-12">
                        <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight mb-0 flex items-center gap-3">
                            <QrCode className="text-[#f82506]" size={20} /> CONFIRMED TICKETS
                        </h2>

                        {registrations.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:gap-8">
                                {registrations.map((reg, i) => (
                                    <motion.div
                                        key={reg._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass-card overflow-hidden flex flex-col p-5 md:p-8 gap-6 md:gap-8 md:flex-row border-[#f82506]/20"
                                    >
                                        <div className="flex flex-col flex-grow">
                                            <span className="bg-[#f82506] text-white px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider w-fit mb-3 md:mb-4">
                                                Confirmed Slot
                                            </span>
                                            <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight mb-4 md:mb-6">{reg.event.name}</h3>

                                            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-sm">
                                                <div className="flex items-center gap-2.5 md:gap-3 text-gray-400">
                                                    <Calendar size={14} className="text-[#f82506] shrink-0" />
                                                    <span>{formatDate(reg.event.date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 md:gap-3 text-white font-bold">
                                                    <Clock size={14} className="text-[#f82506] shrink-0" />
                                                    <span className="text-base md:text-lg">BATCH {reg.batchNumber} • {reg.batchTime}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 md:gap-3 text-gray-400">
                                                    <MapPin size={14} className="text-[#f82506] shrink-0" />
                                                    <span className="truncate">{reg.event.venue.address}</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                <a
                                                    href={reg.event.venue.googleMapsLink}
                                                    target="_blank"
                                                    className="text-white hover:text-[#f82506] transition-colors flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest"
                                                >
                                                    GET DIRECTIONS <ArrowRight size={14} className="rotate-[-45deg]" />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center justify-center p-5 md:p-6 bg-white rounded-2xl md:rounded-3xl min-w-0 md:min-w-[200px] mx-auto md:mx-0">
                                            <QRCodeSVG value={reg.qrCode} size={120} level="H" className="md:w-[150px] md:h-[150px]" />
                                            <span className="mt-2 md:mt-3 text-[9px] md:text-[10px] font-black uppercase text-black italic tracking-widest opacity-50">
                                                SCAN AT VENUE
                                            </span>
                                            {reg.checkInStatus ? (
                                                <span className="mt-2 md:mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[8px] md:text-[9px] font-black uppercase tracking-wider">
                                                    <ShieldCheck size={11} /> VERIFIED
                                                </span>
                                            ) : (
                                                <span className="mt-2 md:mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[8px] md:text-[9px] font-black uppercase tracking-wider">
                                                    <Clock size={11} /> PENDING
                                                </span>
                                            )}
                                            {reg.verificationCode && (
                                                <div className="mt-2 text-center">
                                                    <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-gray-400">Code: </span>
                                                    <span className="text-xs md:text-sm font-black italic tracking-[0.15em] text-black">{reg.verificationCode}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 md:py-20 border border-dashed border-white/10 rounded-2xl md:rounded-[3rem] bg-[#0a0a0a]">
                                <img src="/FINAL-ATH-LOGO.png" alt="ATHLiON Logo" className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 object-contain opacity-20 grayscale" />
                                <h3 className="text-xl md:text-2xl font-black italic uppercase mb-4">No registrations yet</h3>
                                <p className="text-gray-500 mb-8 md:mb-10 max-w-sm mx-auto text-xs md:text-sm px-4">Pick a race challenge yourself. The world&apos;s largest fitness race is waiting for you.</p>
                                <Link href="/events" className="btn-primary">EXPLORE EVENTS</Link>
                            </div>
                        )}

                        {/* Upcoming Events */}
                        <div className="mt-8 md:mt-12">
                            <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight mb-6 md:mb-8 flex items-center gap-3">
                                <Trophy className="text-[#f82506]" size={20} /> UPCOMING RACES
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                {events.filter(ev => ev.status === 'upcoming').slice(0, 4).map((event) => (
                                    <Link key={event._id} href={`/events/${event._id}`}>
                                        <div className="glass-card p-4 md:p-6 border-white/5 hover:border-[#f82506]/30 transition-all group">
                                            <div className="flex justify-between items-start mb-3 md:mb-4">
                                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-zinc-900 text-white">
                                                    {event.status}
                                                </span>
                                                <div className="p-1.5 md:p-2 bg-white/5 rounded-full group-hover:bg-[#f82506] transition-all">
                                                    <ArrowRight size={12} />
                                                </div>
                                            </div>
                                            <h3 className="text-lg md:text-xl font-black italic uppercase tracking-tight mb-3 md:mb-4 group-hover:text-[#f82506] transition-colors line-clamp-1">{event.name}</h3>
                                            <div className="space-y-1.5 md:space-y-2 text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-tight">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={11} className="text-[#f82506]" />
                                                    <span>{formatDate(event.date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={11} className="text-[#f82506]" />
                                                    <span className="truncate">{event.venue.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {events.filter(ev => ev.status === 'upcoming').length === 0 && (
                                    <div className="col-span-full text-center py-8 md:py-10 border border-dashed border-white/5 rounded-2xl md:rounded-3xl">
                                        <p className="text-gray-700 text-[10px] font-black uppercase tracking-widest">No new races announced yet.</p>
                                    </div>
                                )}
                            </div>
                            {events.length > 0 && (
                                <div className="mt-6 md:mt-8">
                                    <Link href="/events" className="text-[#f82506] font-black uppercase tracking-widest text-[10px] hover:underline flex items-center gap-2">
                                        VIEW ALL RACES <ArrowRight size={14} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8 md:space-y-12">
                        {/* Ads */}
                        <div className="space-y-4 md:space-y-6">
                            <h2 className="text-base md:text-lg font-black italic uppercase tracking-tight flex items-center gap-3">
                                <Activity className="text-[#f82506]" size={16} /> FEATURED
                            </h2>
                            <SponsorAds sponsors={sponsors} />
                        </div>

                        {/* Partners */}
                        <div className="space-y-4 md:space-y-6">
                            <h2 className="text-base md:text-lg font-black italic uppercase tracking-tight flex items-center gap-3">
                                <ShieldCheck className="text-[#f82506]" size={16} /> OUR PARTNERS
                            </h2>
                            <div className="grid grid-cols-1 gap-3 md:gap-4">
                                {sponsors.filter(s => s.type !== 'Sponsor').map(partner => (
                                    <div key={partner._id} className="glass-card p-3 md:p-4 border-white/5 flex items-center gap-3 md:gap-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                                            {partner.logo ? (
                                                <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Trophy className="text-zinc-800" size={18} />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-black italic uppercase tracking-tight text-xs md:text-sm truncate">{partner.name}</h4>
                                            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-[#f82506]">{partner.type}</span>
                                        </div>
                                    </div>
                                ))}
                                {sponsors.filter(s => s.type !== 'Sponsor').length === 0 && (
                                    <p className="text-center py-8 md:py-10 text-gray-700 text-[10px] font-black uppercase tracking-widest border border-dashed border-white/5 rounded-2xl">
                                        More partners coming soon...
                                    </p>
                                )}
                            </div>
                            {sponsors.length > 0 && (
                                <div className="mt-3 md:mt-4">
                                    <Link href="/sponsors" className="text-[#f82506] font-black uppercase tracking-widest text-[8px] hover:underline flex items-center gap-1">
                                        VIEW ALL PARTNERS <ArrowRight size={12} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <AthlionInfoModal 
                isOpen={isInfoModalOpen} 
                onClose={() => setIsInfoModalOpen(false)} 
            />
        </div>
    );
}
