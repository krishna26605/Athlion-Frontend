'use client';

import React, { useState, useEffect, useRef } from 'react';
import apiClient from '@/api/client';
import { Search, Building2, Check, X } from 'lucide-react';

interface GymPartner {
    code: string;
    name: string;
    description?: string;
    logo?: string;
}

interface EarlyAccessModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    embedded?: boolean;
}

export default function EarlyAccessModal({ isOpen = false, onClose, embedded = false }: EarlyAccessModalProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [leadSource, setLeadSource] = useState('meta_ads');
    const [gymReferralCode, setGymReferralCode] = useState('');
    const [gymName, setGymName] = useState('');
    const [gymList, setGymList] = useState<GymPartner[]>([]);

    // Searchable Gym State
    const [gymSearchTerm, setGymSearchTerm] = useState('');
    const [isGymDropdownOpen, setIsGymDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const res = await apiClient.get('early-access/gyms');
                if (res.data?.success) {
                    setGymList(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch gym partners:', err);
            }
        };

        // Extract URL params if visitor arrived via Meta Ads or Gym link
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const sourceParam = params.get('utm_source') || params.get('source');
            const gymParam = params.get('gym') || params.get('gym_code');
            if (sourceParam) setLeadSource(sourceParam);
            if (gymParam) setGymReferralCode(gymParam);
        }

        fetchGyms();

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsGymDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter sponsored gyms based on search term
    const filteredGyms = gymList.filter(gym =>
        gym.name.toLowerCase().includes(gymSearchTerm.toLowerCase()) ||
        gym.code.toLowerCase().includes(gymSearchTerm.toLowerCase())
    );

    const handleSelectGym = (gym: GymPartner) => {
        setGymReferralCode(gym.code);
        setGymName(gym.name);
        setGymSearchTerm(gym.name);
        setIsGymDropdownOpen(false);
    };

    const handleClearGym = () => {
        setGymReferralCode('');
        setGymName('');
        setGymSearchTerm('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            const visitorId = localStorage.getItem('athlion_visitor_id') || undefined;

            const res = await apiClient.post('early-access/register', {
                fullName,
                email,
                phone,
                leadSource,
                gymReferralCode,
                gymName: gymName || gymSearchTerm,
                visitorId,
            });

            if (res.data?.success) {
                setSuccess(true);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to submit registration. Please try again.';
            setErrorMsg(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen && !embedded) return null;

    const formContent = (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
            {/* Ambient Red Glow */}
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            {!embedded && onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl p-2 rounded-full hover:bg-zinc-900 transition-colors"
                >
                    ✕
                </button>
            )}

            {success ? (
                <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl font-black animate-bounce">
                        ⚡
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tight text-white uppercase">
                        You&apos;re On The Early Access List!
                    </h3>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                        Thank you for joining <span className="text-red-500 font-bold">ATHLiON</span> early access. 
                        As soon as our flagship fitness event dates are announced, you will receive exclusive priority booking notifications via Email, SMS &amp; WhatsApp!
                    </p>
                    {gymName && (
                        <div className="inline-block bg-zinc-900 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-semibold text-red-400">
                            Partner Gym: {gymName}
                        </div>
                    )}
                    <div className="pt-4">
                        <button
                            onClick={() => {
                                setSuccess(false);
                                if (onClose) onClose();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all shadow-lg shadow-red-600/30"
                        >
                            Done
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest">
                            🔥 Early Access Community
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
                            Get Priority Ticket Access
                        </h2>
                        <p className="text-zinc-400 text-xs sm:text-sm">
                            Be the first to know when official Athlion event dates &amp; early bird tickets launch!
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-950/60 border border-red-600/50 text-red-300 text-xs p-3 rounded-xl">
                            {errorMsg}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="e.g. Rahul Sharma"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="rahul@gmail.com"
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                                    Phone Number (WhatsApp) *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="9876543210"
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                                    How Did You Find Us?
                                </label>
                                <select
                                    value={leadSource}
                                    onChange={(e) => setLeadSource(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                                >
                                    <option value="meta_ads">Meta Ad (Facebook / Instagram)</option>
                                    <option value="instagram_reel">Instagram Reel</option>
                                    <option value="gym_referral">Gym Partner / Trainer</option>
                                    <option value="direct">Website Search / Direct</option>
                                    <option value="other">Other Referral</option>
                                </select>
                            </div>

                            {/* Searchable Sponsored Gym Selection */}
                            <div className="relative" ref={dropdownRef}>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider flex items-center justify-between">
                                    <span>Sponsored Gym Partner</span>
                                    {gymReferralCode && (
                                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Selected</span>
                                    )}
                                </label>

                                <div className="relative">
                                    <input
                                        type="text"
                                        value={gymSearchTerm}
                                        onChange={(e) => {
                                            setGymSearchTerm(e.target.value);
                                            setIsGymDropdownOpen(true);
                                            if (!e.target.value) {
                                                setGymReferralCode('');
                                                setGymName('');
                                            }
                                        }}
                                        onFocus={() => setIsGymDropdownOpen(true)}
                                        placeholder="Search sponsored gym..."
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-8 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
                                    />
                                    <Search size={16} className="absolute left-3 top-3.5 text-zinc-500 pointer-events-none" />

                                    {gymSearchTerm ? (
                                        <button
                                            type="button"
                                            onClick={handleClearGym}
                                            className="absolute right-2.5 top-3 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800"
                                        >
                                            <X size={14} />
                                        </button>
                                    ) : null}
                                </div>

                                {/* Filtered Dropdown List */}
                                {isGymDropdownOpen && (
                                    <div className="absolute z-30 left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                                        {filteredGyms.length > 0 ? (
                                            filteredGyms.map((gym) => {
                                                const isSelected = gymReferralCode === gym.code;
                                                return (
                                                    <div
                                                        key={gym.code}
                                                        onClick={() => handleSelectGym(gym)}
                                                        className={`px-4 py-2.5 text-xs flex items-center justify-between cursor-pointer hover:bg-zinc-800 transition-colors ${
                                                            isSelected ? 'bg-red-600/20 text-red-400 font-bold' : 'text-zinc-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {gym.logo ? (
                                                                <img src={gym.logo} alt={gym.name} className="w-5 h-5 object-cover rounded-full border border-zinc-700 shrink-0" />
                                                            ) : (
                                                                <Building2 size={14} className="text-red-500 shrink-0" />
                                                            )}
                                                            <span>{gym.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[9px] uppercase font-bold bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                                                                Sponsored
                                                            </span>
                                                            {isSelected && <Check size={14} className="text-red-500" />}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="px-4 py-3 text-xs text-zinc-500 text-center">
                                                No sponsored gyms matching &quot;{gymSearchTerm}&quot;
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-4 px-6 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span>Registering...</span>
                        ) : (
                            <>
                                <span>Register For Early Access</span>
                                <span className="text-lg">→</span>
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );

    if (embedded) return formContent;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg">
                {formContent}
            </div>
        </div>
    );
}
