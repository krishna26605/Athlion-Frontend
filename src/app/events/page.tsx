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
        <div className="min-h-screen pt-32 pb-24 px-4 bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <span className="text-[#f82506] font-black uppercase tracking-[0.3em] text-xs mb-4 block">Race Calendar</span>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-none">
                            UPCOMING <span className="text-white">EVENTS</span>
                        </h1>
                        <p className="text-gray-400 text-lg">Pick your race and Join the global series. New batches released daily.</p>
                    </div>

                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#f82506] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by city or venue..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#f82506] transition-all italic text-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="animate-spin text-[#f82506]" size={40} />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Events...</p>
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event, i) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card overflow-hidden group hover:border-[#f82506]/30 transition-all"
                            >
                                <div className="h-48 bg-zinc-900 relative overflow-hidden">
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="bg-white text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            {event.status}
                                        </span>
                                    </div>
                                    {/* Placeholder for event image */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                                    <div className="absolute bottom-4 left-6">
                                        <h3 className="text-2xl font-black italic tracking-tight leading-none uppercase">{event.name}</h3>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex flex-col gap-4 mb-8">
                                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                                            <MapPin size={16} className="text-[#f82506]" />
                                            <span className="truncate">{event.venue.address}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                                            <Calendar size={16} className="text-[#f82506]" />
                                            <span>{formatDate(event.date)} at {event.startTime}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                                            <Users size={16} className="text-[#f82506]" />
                                            <span>{event.currentParticipants}/{event.maxParticipants} Registered</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-bold uppercase">Registration</span>
                                            <span className="text-xl font-black italic">{formatCurrency(event.price)}</span>
                                        </div>
                                        <Link href={`/events/${event._id}`} className="p-3 bg-white/5 rounded-full group-hover:bg-[#f82506] transition-all text-white">
                                            <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
                        <Trophy size={48} className="mx-auto text-gray-700 mb-4" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No events found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
