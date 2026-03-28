'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/client';

import { Loader2, Plus, Globe, Image as ImageIcon, Trash2, ExternalLink, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sponsor {
    _id: string;
    name: string;
    description: string;
    type: 'Sponsor' | 'Gym Partner' | 'Run Club';
    logo?: string;
    website?: string;
    adImages: string[];
}

export default function AdminSponsorsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'Sponsor',
        website: '',
        logo: '',
        adImages: ['']
    });

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchSponsors();
    }, []);

    const fetchSponsors = async () => {
        try {
            const res = await apiClient.get('sponsors');
            // Assuming res.data contains the list of sponsors
            setSponsors(res.data.data || res.data);
        } catch (err) {
            console.error('Failed to fetch sponsors', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSponsor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Filter out empty ad image URLs
            const finalData = {
                ...formData,
                adImages: formData.adImages.filter(img => img.trim() !== '')
            };
            await apiClient.post('sponsors', finalData);
            setIsModalOpen(false);
            fetchSponsors();
            setFormData({
                name: '',
                description: '',
                type: 'Sponsor',
                website: '',
                logo: '',
                adImages: ['']
            });
        } catch (err) {
            console.error('Failed to create sponsor', err);
            alert('Failed to create sponsor');
        }
    };

    const deleteSponsor = async (id: string) => {
        if (!confirm('Are you sure you want to remove this sponsor?')) return;
        try {
            await apiClient.delete(`sponsors/${id}`);
            fetchSponsors();
        } catch (err) {
            alert('Failed to delete sponsor');
        }
    };

    const addAdImageField = () => {
        setFormData({ ...formData, adImages: [...formData.adImages, ''] });
    };

    const updateAdImage = (index: number, val: string) => {
        const newAds = [...formData.adImages];
        newAds[index] = val;
        setFormData({ ...formData, adImages: newAds });
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
                    <div className="flex justify-between items-end mb-12">
                        

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black italic uppercase tracking-widest hover:bg-[#f82506] hover:text-white transition-all shadow-xl shadow-white/5"
                        >
                            <Plus size={20} /> Add New Partner
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sponsors.map((sponsor) => (
                            <motion.div
                                layout
                                key={sponsor._id}
                                className="glass-card p-6 border-white/5 group hover:border-[#f82506]/30 transition-all"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden">
                                        {sponsor.logo ? (
                                            <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Heart className="text-zinc-800" size={24} />
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => deleteSponsor(sponsor._id)}
                                            className="p-2 bg-zinc-900 text-gray-500 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-zinc-900 mb-2 inline-block ${sponsor.type === 'Sponsor' ? 'text-blue-400' :
                                        sponsor.type === 'Gym Partner' ? 'text-green-400' : 'text-purple-400'
                                        }`}>
                                        {sponsor.type}
                                    </span>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tight">{sponsor.name}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mt-2">{sponsor.description}</p>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600 font-bold uppercase">Ad Campaigns</span>
                                        <span className="text-white font-black italic">{sponsor.adImages?.length || 0} Images</span>
                                    </div>

                                    <div className="flex gap-2">
                                        {sponsor.website && (
                                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-gray-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                                                <Globe size={14} /> Website <ExternalLink size={10} />
                                            </a>
                                        )}
                                        <button className="flex-1 bg-white/5 text-gray-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                                            Edit Ads
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {sponsors.length === 0 && (
                        <div className="text-center py-32 border border-dashed border-white/5 rounded-3xl">
                            <Heart size={48} className="mx-auto text-zinc-900 mb-4" />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No partners registered yet.</p>
                        </div>
                    )}
                </motion.div>

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl p-10 overflow-y-auto max-h-[90vh]"
                        >
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Add <span className="text-[#f82506]">Partner</span></h2>

                            <form onSubmit={handleCreateSponsor} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Partner Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#f82506] transition-all"
                                            placeholder="e.g. FitTrack"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Partner Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#f82506] transition-all appearance-none"
                                        >
                                            <option value="Sponsor">Sponsor</option>
                                            <option value="Gym Partner">Gym Partner</option>
                                            <option value="Run Club">Run Club</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#f82506] transition-all min-h-[100px]"
                                        placeholder="Describe the partner..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Website URL</label>
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#f82506] transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Logo Image URL</label>
                                        <input
                                            type="text"
                                            value={formData.logo}
                                            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#f82506] transition-all"
                                            placeholder="Image URL..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ad Campaign Images (URLs)</label>
                                        <button
                                            type="button"
                                            onClick={addAdImageField}
                                            className="text-[10px] font-black text-[#f82506] uppercase tracking-widest flex items-center gap-1"
                                        >
                                            <Plus size={12} /> Add More
                                        </button>
                                    </div>
                                    {formData.adImages.map((ad, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={ad}
                                                onChange={(e) => updateAdImage(idx, e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#f82506] transition-all"
                                                placeholder="Ad image URL..."
                                            />
                                            {formData.adImages.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, adImages: formData.adImages.filter((_, i) => i !== idx) })}
                                                    className="p-4 text-gray-600 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 p-5 rounded-2xl border border-white/10 font-black italic uppercase tracking-widest text-xs hover:bg-white/5 transition-all text-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] p-5 rounded-2xl bg-white text-black font-black italic uppercase tracking-widest text-sm hover:bg-[#f82506] hover:text-white transition-all shadow-xl shadow-white/5"
                                    >
                                        Create Profile
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
