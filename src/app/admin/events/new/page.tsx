'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Save, MapPin, Calendar, Clock, Trophy, Info, DollarSign, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function NewEventPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        venue: {
            address: '',
            googleMapsLink: ''
        },
        date: '',
        startTime: '',
        batchSize: 10,
        gapBetweenBatches: 15,
        maxParticipants: 500,
        price: 0,
        status: 'upcoming'
    });

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof typeof prev] as any),
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiClient.post('events', formData);
            router.push('/admin/events');
        } catch (err: any) {
            console.error('Failed to create event', err);
            alert(err.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return (
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
                    className="max-w-4xl"
                >
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 uppercase text-[10px] font-black tracking-widest group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Races
                    </button>

                    <div className="mb-12">
                        <span className="text-[#f82506] font-black uppercase tracking-[0.3em] text-xs mb-4 block">Event Management</span>
                        <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2 leading-none">
                            Create <span className="text-white">New Race</span>
                        </h1>
                        <p className="text-gray-400">Define the parameters for a new Athlion competitive event.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Basic Information */}
                        <div className="glass-card p-8 border-white/5 space-y-6">
                            <h3 className="text-lg font-black italic uppercase tracking-tight flex items-center gap-3 border-b border-white/5 pb-4">
                                <Info className="text-[#f82506]" size={18} /> Basic Information
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Race Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="e.g., Hyrox City Sprint 2026"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 focus:border-[#f82506]/50 transition-all outline-none font-bold italic uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Description</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={4}
                                        placeholder="Describe the event format, challenges, and details..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 focus:border-[#f82506]/50 transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Venue Details */}
                        <div className="glass-card p-8 border-white/5 space-y-6">
                            <h3 className="text-lg font-black italic uppercase tracking-tight flex items-center gap-3 border-b border-white/5 pb-4">
                                <MapPin className="text-[#f82506]" size={18} /> Venue Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Full Address</label>
                                    <input
                                        type="text"
                                        name="venue.address"
                                        required
                                        placeholder="Venue Name, Street, City"
                                        value={formData.venue.address}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 focus:border-[#f82506]/50 transition-all outline-none font-medium"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Google Maps Link</label>
                                    <input
                                        type="url"
                                        name="venue.googleMapsLink"
                                        required
                                        placeholder="https://goo.gl/maps/..."
                                        value={formData.venue.googleMapsLink}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 focus:border-[#f82506]/50 transition-all outline-none font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Schedule & Capacity */}
                        <div className="glass-card p-8 border-white/5 space-y-6">
                            <h3 className="text-lg font-black italic uppercase tracking-tight flex items-center gap-3 border-b border-white/5 pb-4">
                                <Calendar className="text-[#f82506]" size={18} /> Schedule & Capacity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Race Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 focus:border-[#f82506]/50 transition-all outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Start Time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        required
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 focus:border-[#f82506]/50 transition-all outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Total Capacity</label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                        <input
                                            type="number"
                                            name="maxParticipants"
                                            required
                                            value={formData.maxParticipants}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl py-4 pl-12 pr-4 focus:border-[#f82506]/50 transition-all outline-none font-bold"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Batch Size</label>
                                    <input
                                        type="number"
                                        name="batchSize"
                                        required
                                        value={formData.batchSize}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 focus:border-[#f82506]/50 transition-all outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Gap (Minutes)</label>
                                    <input
                                        type="number"
                                        name="gapBetweenBatches"
                                        required
                                        value={formData.gapBetweenBatches}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 focus:border-[#f82506]/50 transition-all outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Entry Fee (INR)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                        <input
                                            type="number"
                                            name="price"
                                            required
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl py-4 pl-12 pr-4 focus:border-[#f82506]/50 transition-all outline-none font-black italic text-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-8">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-8 py-4 rounded-2xl border border-white/5 font-black italic uppercase tracking-widest hover:bg-white/5 transition-all text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-12 py-4 bg-[#f82506] text-white rounded-2xl font-black italic uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(248,37,6,0.3)] flex items-center gap-3 text-xs"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                    <>
                                        <Save size={18} /> Publish Race
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
