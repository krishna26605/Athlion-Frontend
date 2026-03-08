'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Trophy, ArrowLeft, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/utils';
import Script from 'next/script';

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
    batchSize: number;
    gapBetweenBatches: number;
    currentParticipants: number;
    maxParticipants: number;
    status: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function EventDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    // --- ATHLION REGISTRATION STATE ---
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [regData, setRegData] = useState({
        level: '',
        height: '',
        weight: '',
        category: 'Single',
        batchTime: ''
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await apiClient.get(`events/${id}`);
                setEvent(res.data.data);
            } catch (error) {
                console.error('Failed to fetch event', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchEvent();
    }, [id]);

    const steps = [
        { id: 1, title: 'SELECT LEVEL' },
        { id: 2, title: 'PHYSICAL DETAILS' },
        { id: 3, title: 'CATEGORY' },
        { id: 4, title: 'WAVE SELECTION' }
    ];

    const generateWaveTimes = () => {
        const times = [];
        let current = new Date();
        current.setHours(9, 0, 0, 0); // Start at 9:00 AM
        const end = new Date();
        end.setHours(17, 0, 0, 0); // End at 5:00 PM

        while (current <= end) {
            const timeStr = `${current.getHours().toString().padStart(2, '0')}:${current.getMinutes().toString().padStart(2, '0')}`;
            // 9:00-9:20 and 9:30-9:50 are sold out by default
            const isDefaultSoldOut = (timeStr === '09:00' || timeStr === '09:20' || timeStr === '09:30' || timeStr === '09:40' || timeStr === '09:50');
            times.push({
                time: timeStr,
                isSoldOut: isDefaultSoldOut
            });
            current.setMinutes(current.getMinutes() + 10); // 10 min intervals for variety, but user mentioned specific slots
        }
        return times;
    };

    const handleBooking = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!regData.batchTime) {
            alert('Please select a wave timing');
            return;
        }

        setBookingLoading(true);
        try {
            const res = await apiClient.post(`registrations/book/${id}`, regData);
            const { order } = res.data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "ATHLION",
                description: `Registration for ${event?.name} - ${regData.level}`,
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        await apiClient.post('registrations/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        router.push('/dashboard');
                    } catch (error) {
                        console.error('Payment verification failed', error);
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone || '',
                },
                theme: {
                    color: "#f82506",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error: any) {
            console.error('Booking failed', error);
            alert(error.response?.data?.message || 'Failed to initialize booking');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Loader2 className="animate-spin text-[#f82506]" size={40} />
        </div>
    );

    if (!event) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-gray-500">
            <Trophy size={60} className="mb-4 text-zinc-800" />
            <p className="text-xl font-black italic uppercase italic">Event Not Found</p>
            <button onClick={() => router.back()} className="mt-6 text-white hover:text-[#f82506] transition-colors flex items-center gap-2">
                <ArrowLeft size={20} /> Go Back
            </button>
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-24 bg-black px-4 lg:px-0">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <div className="max-w-7xl mx-auto px-4">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 uppercase text-xs font-black tracking-widest group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Calender
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Event Info */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-8 leading-none">
                                {event.name?.split(' ')[0]} <span className="text-[#f82506]">{event.name?.split(' ').slice(1).join(' ')}</span>
                            </h1>

                            <div className="flex flex-wrap gap-4 mb-12">
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300">
                                    <Calendar size={14} className="text-[#f82506]" /> {formatDate(event.date)}
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300">
                                    <Clock size={14} className="text-[#f82506]" /> {event.startTime} Start
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300">
                                    <MapPin size={14} className="text-[#f82506]" /> {event.venue.address.split(',')[0]}
                                </div>
                            </div>

                            <div className="space-y-8 text-gray-400 text-lg leading-relaxed mb-12">
                                <p>{event.description}</p>
                                <div className="glass-card p-8 border-l-4 border-l-[#f82506] bg-zinc-950/30">
                                    <h3 className="text-white text-xl font-black italic uppercase mb-4 tracking-tight">Race Format</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
                                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#f82506]" /> 1km Run x 8 Sections</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#f82506]" /> 1000m Ski Erg</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#f82506]" /> 50m Sled Push</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#f82506]" /> 50m Sled Pull</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#f82506]" /> 80m Burpee Broad Jumps</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#f82506]" /> 1000m Row</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#f82506]" /> 200m Farmers Carry</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#f82506]" /> 100 Wall Balls</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Multi-Step Registration */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="sticky top-32 glass-card p-8 md:p-10 border-[#f82506]/20 bg-zinc-950/80"
                        >
                            {/* Progress Header */}
                            <div className="flex justify-between items-center mb-10">
                                {steps.map((s) => (
                                    <div key={s.id} className="flex flex-col items-center gap-2">
                                        <div className={`w-10 h-1 md:w-16 rounded-full transition-all duration-500 ${step >= s.id ? 'bg-[#f82506]' : 'bg-gray-800'}`} />
                                        <span className={`text-[8px] font-black tracking-tighter ${step === s.id ? 'text-[#f82506]' : 'text-gray-600'}`}>{s.title}</span>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={(e) => e.preventDefault()}>
                                {/* STEP 1: LEVEL */}
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">PICK YOUR <span className="text-[#f82506]">LEVEL</span></h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {['advance', 'intermediate'].map((lvl) => (
                                                <button
                                                    key={lvl}
                                                    type="button"
                                                    onClick={() => { setRegData({ ...regData, level: lvl }); setStep(2); }}
                                                    className={`glass-card-hover p-6 rounded-2xl text-left border transition-all ${regData.level === lvl ? 'border-[#f82506] bg-[#f82506]/10' : 'border-white/5'}`}
                                                >
                                                    <span className="block text-xl font-black italic uppercase">{lvl}</span>
                                                    <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">{lvl === 'advance' ? 'For experienced athletes' : 'For regular fitness enthusiasts'}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: PHYSICAL DETAILS */}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">PHYSICAL <span className="text-[#f82506]">DETAILS</span></h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Height (CM)</label>
                                                <input
                                                    type="number"
                                                    placeholder="175"
                                                    value={regData.height}
                                                    onChange={(e) => setRegData({ ...regData, height: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-[#f82506] transition-all outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Weight (KG)</label>
                                                <input
                                                    type="number"
                                                    placeholder="70"
                                                    value={regData.weight}
                                                    onChange={(e) => setRegData({ ...regData, weight: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-[#f82506] transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={() => setStep(1)} className="flex-1 p-4 rounded-xl border border-white/10 font-bold text-xs uppercase hover:bg-white/5">Back</button>
                                            <button
                                                disabled={!regData.height || !regData.weight}
                                                onClick={() => setStep(3)}
                                                className="flex-[2] btn-primary p-4 disabled:bg-zinc-800 disabled:text-zinc-500 py-4 font-black italic tracking-widest"
                                            >
                                                CONTINUE
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: CATEGORY */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">PICK <span className="text-[#f82506]">CATEGORY</span></h3>
                                        <button
                                            type="button"
                                            onClick={() => setStep(4)}
                                            className="w-full glass-card-hover p-10 rounded-2xl text-center border border-[#f82506] bg-[#f82506]/10 transition-all group"
                                        >
                                            <Trophy className="mx-auto mb-4 text-[#f82506] group-hover:scale-110 transition-transform" size={48} />
                                            <span className="block text-4xl font-black italic uppercase tracking-tighter mb-2">SINGLE</span>
                                            <span className="text-xs text-gray-300 uppercase font-black tracking-[0.2em]">Standard Solo Entry</span>
                                        </button>
                                        <button onClick={() => setStep(2)} className="w-full p-4 rounded-xl border border-white/10 font-bold text-xs uppercase hover:bg-white/5">Back</button>
                                    </div>
                                )}

                                {/* STEP 4: WAVE SELECTION */}
                                {step === 4 && (
                                    <div className="space-y-6">
                                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">WAVE <span className="text-[#f82506]">SELECTION</span></h3>
                                        <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {generateWaveTimes().map((wave) => (
                                                <button
                                                    key={wave.time}
                                                    type="button"
                                                    disabled={wave.isSoldOut}
                                                    onClick={() => setRegData({ ...regData, batchTime: wave.time })}
                                                    className={`p-3 rounded-lg text-xs font-black italic transition-all border ${wave.isSoldOut ? 'bg-zinc-900 border-white/5 text-zinc-700 cursor-not-allowed opacity-50' :
                                                        regData.batchTime === wave.time ? 'bg-[#f82506] border-[#f82506] text-white' :
                                                            'bg-white/5 border-white/10 text-gray-400 hover:border-[#f82506]/50'
                                                        }`}
                                                >
                                                    {wave.time}
                                                    {wave.isSoldOut && <span className="block text-[8px] mt-1 text-red-900">SOLD OUT</span>}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="pt-6 border-t border-white/5 space-y-6">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Entry Fee</span>
                                                <span className="text-4xl font-black italic text-white">{formatCurrency(event.price)}</span>
                                            </div>

                                            <div className="flex gap-4">
                                                <button onClick={() => setStep(3)} className="flex-1 p-4 rounded-xl border border-white/10 font-bold text-xs uppercase hover:bg-white/5">Back</button>
                                                <button
                                                    onClick={handleBooking}
                                                    disabled={bookingLoading || !regData.batchTime}
                                                    className="flex-[2] btn-primary p-4 py-4 font-black italic tracking-widest text-lg disabled:bg-zinc-800 disabled:text-zinc-500"
                                                >
                                                    {bookingLoading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'PAY & REGISTER'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>

                            <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-[9px] font-black uppercase tracking-widest">
                                <ShieldCheck size={14} /> Official Athlion Payment Gateway
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f82506; }
            `}</style>
        </div>
    );
}

