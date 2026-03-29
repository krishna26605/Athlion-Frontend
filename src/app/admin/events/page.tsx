'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, MapPin, Loader2, Trophy, ArrowRight } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


interface Event {
    _id: string;
    name: string;
    venue: {
        address: string;
    };
    date: string;
    startTime: string;
    price: number;
    currentParticipants: number;
    maxParticipants: number;
    status: string;
}

export default function AdminEventsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await apiClient.get('events');
            setEvents(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteEvent = async (id: string) => {
        if (confirm('Are you sure you want to cancel this event?')) {
            try {
                await apiClient.delete(`events/${id}`);
                fetchEvents();
            } catch (err) {
                alert('Failed to delete event');
            }
        }
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
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-4 mb-8 md:mb-12">
                    <Link href="/admin/events/new" className="w-full sm:w-auto">
                        <button className="w-full flex items-center justify-center gap-2 bg-white text-black px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black italic uppercase tracking-widest text-[10px] md:text-xs hover:bg-[#f82506] hover:text-white transition-all shadow-xl shadow-white/5">
                            <Plus size={18} /> New Race
                        </button>
                    </Link>
                </div>

                {/* Mobile Event Cards */}
                <div className="md:hidden space-y-4 mb-8">
                    {events.map((event) => (
                        <div key={event._id} className="glass-card p-4 border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-1">
                                <span className={`px-2 py-0.5 rounded-bl-xl text-[8px] font-black uppercase tracking-wider ${event.status === 'upcoming' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}>
                                    {event.status}
                                </span>
                            </div>
                            
                            <div className="mb-4 pr-12">
                                <div className="font-black italic uppercase tracking-tighter text-xl leading-tight mb-1 truncate">{event.name}</div>
                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1 truncate">
                                    <MapPin size={10} className="text-[#f82506] shrink-0" /> {event.venue.address.split(',')[0]}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                                    <div className="text-[8px] text-gray-500 font-bold uppercase mb-1">Date & Time</div>
                                    <div className="text-[10px] font-black italic text-white truncate">{formatDate(event.date)}</div>
                                    <div className="text-[9px] text-gray-400 font-black italic">{event.startTime} START</div>
                                </div>
                                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                                    <div className="text-[8px] text-gray-500 font-bold uppercase mb-1">Registered</div>
                                    <div className="text-[10px] font-black italic text-[#f82506]">{event.currentParticipants} / {event.maxParticipants}</div>
                                    <div className="h-1 w-full bg-zinc-900 rounded-full mt-1.5 overflow-hidden">
                                        <div className="h-full bg-[#f82506]" style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                <div className="font-black italic text-base">{formatCurrency(event.price)}</div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 bg-zinc-900 text-gray-400 rounded-xl hover:text-white transition-all">
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteEvent(event._id)}
                                        className="p-2.5 bg-zinc-900 text-[#f82506] rounded-xl hover:bg-[#f82506]/10 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                            <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">No races found.</p>
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block glass-card overflow-hidden border-white/5">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] bg-white/[0.02]">
                                <th className="py-6 pl-8">Race Details</th>
                                <th className="py-6">Date & Time</th>
                                <th className="py-6">Registration</th>
                                <th className="py-6">Price</th>
                                <th className="py-6">Status</th>
                                <th className="py-6 pr-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {events.map((event) => (
                                <tr key={event._id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="py-8 pl-8">
                                        <div className="font-black italic uppercase tracking-tight text-xl">{event.name}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <MapPin size={10} /> {event.venue.address.split(',')[0]}
                                        </div>
                                    </td>
                                    <td className="py-8">
                                        <div className="font-bold text-sm text-gray-300">{formatDate(event.date)}</div>
                                        <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{event.startTime} START</div>
                                    </td>
                                    <td className="py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="h-1.5 w-24 bg-zinc-900 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#f82506]"
                                                    style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-black italic">{event.currentParticipants} / {event.maxParticipants}</span>
                                        </div>
                                    </td>
                                    <td className="py-8">
                                        <div className="font-black text-white italic">{formatCurrency(event.price)}</div>
                                    </td>
                                    <td className="py-8">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${event.status === 'upcoming' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="py-8 pr-8 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-3 bg-zinc-900 text-gray-400 rounded-xl hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteEvent(event._id)}
                                                className="p-3 bg-zinc-900 text-gray-400 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {events.length === 0 && (
                        <div className="text-center py-24">
                            <Trophy size={48} className="mx-auto text-zinc-800 mb-4" />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No races found.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
}
