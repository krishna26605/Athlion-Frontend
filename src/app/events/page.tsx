'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/api/client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowRight, Loader2, Search, Trophy } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/utils';

interface Event {
    _id: string;
    name: string;
    description: string;
    venue: {
        address: string;
        googleMapsLink: string;
    };
    date: string;
    startTime: string;
    price: number;
    currentParticipants: number;
    maxParticipants: number;
    status: string;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await apiClient.get('events');
                setEvents(res.data.data);
            } catch (err) {
                console.error('Failed to fetch events', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-20 md:pt-32 pb-28 md:pb-24 px-4 bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8 mb-10 md:mb-16">
                    <div className="max-w-2xl">
                        <span className="text-[#f82506] font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 md:mb-4 block">Race Calendar</span>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4 md:mb-6 leading-none">
                            UPCOMING <span className="text-white">EVENTS</span>
                        </h1>
                        <p className="text-gray-400 text-sm md:text-lg">Pick your race and Join the global series. New batches released daily.</p>
                    </div>

                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#f82506] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by city or venue..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 md:py-4 pl-11 md:pl-12 pr-4 focus:outline-none focus:border-[#f82506] transition-all italic text-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="animate-spin text-[#f82506]" size={40} />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Events...</p>
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredEvents.map((event, i) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card overflow-hidden group hover:border-[#f82506]/30 transition-all"
                            >
                                <div className="h-32 md:h-48 bg-zinc-900 relative overflow-hidden">
                                    <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
                                        <span className="bg-white text-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-green-600 animate-pulse" /> {event.status}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                                    <div className="absolute bottom-3 left-4 md:bottom-4 md:left-6 pr-4">
                                        <h3 className="text-lg md:text-2xl font-black italic tracking-tighter leading-[1.1] uppercase break-words line-clamp-2">{event.name}</h3>
                                    </div>
                                </div>

                                <div className="p-4 md:p-6 bg-zinc-950/20">
                                    <div className="grid grid-cols-1 gap-2.5 md:gap-4 mb-5 md:mb-8">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <MapPin size={12} className="text-[#f82506] shrink-0" />
                                            <span className="text-[10px] md:text-sm font-bold uppercase tracking-tight truncate line-clamp-1">{event.venue.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Calendar size={12} className="text-[#f82506] shrink-0" />
                                            <span className="text-[10px] md:text-sm font-bold uppercase tracking-tight">{formatDate(event.date)} @ {event.startTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Users size={12} className="text-[#f82506] shrink-0" />
                                            <span className="text-[10px] md:text-sm font-bold uppercase tracking-tight">Spots: {event.currentParticipants}/{event.maxParticipants} Full</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/5">
                                        <div>
                                            <span className="text-[8px] md:text-xs text-gray-500 font-bold uppercase tracking-widest block mb-0.5">Entry Pass</span>
                                            <span className="text-base md:text-xl font-black italic text-white flex items-center gap-1">
                                                <Trophy size={14} className="text-[#f82506]" /> {formatCurrency(event.price)}
                                            </span>
                                        </div>
                                        <Link href={`/events/${event._id}`} className="px-4 py-2 md:p-3 bg-white text-black rounded-lg md:rounded-full group-hover:bg-[#f82506] group-hover:text-white transition-all text-xs font-black uppercase italic flex items-center gap-2">
                                            <span className="md:hidden">Join Now</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 md:py-24 border border-dashed border-white/10 rounded-3xl">
                        <img src="/FINAL-ATH-LOGO.png" alt="ATHLiON Logo" className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 object-contain opacity-20 grayscale" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs md:text-sm">No events found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
