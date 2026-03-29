'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Trophy, ArrowLeft, Loader2, CheckCircle, ShieldCheck, Tag, Zap, X } from 'lucide-react';
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

interface DiscountInfo {
    type: string;
    value: number;
    label: string;
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
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
    const [step, setStep] = useState(1);
    const [regData, setRegData] = useState({
        level: '',
        height: '',
        weight: '',
        category: 'Single',
        batchTime: ''
    });

    // --- DISCOUNT STATE ---
    const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [spotsRemaining, setSpotsRemaining] = useState<number | null>(null);

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

    // Fetch early bird discount info when user reaches payment step
    useEffect(() => {
        const fetchDiscount = async () => {
            if (!user || !id || couponApplied) return;
            try {
                const res = await apiClient.get(`registrations/check-discount/${id}`);
                if (res.data.discount && res.data.discount.type !== 'none') {
                    setDiscountInfo(res.data.discount);
                    setSpotsRemaining(res.data.spotsRemaining);
                }
            } catch (error) {
                console.error('Failed to fetch discount', error);
            }
        };

        if (step === 4) {
            fetchDiscount();
        }
    }, [step, user, id, couponApplied]);

    const steps = [
        { id: 1, title: 'SELECT LEVEL' },
        { id: 2, title: 'PHYSICAL DETAILS' },
        { id: 3, title: 'CATEGORY' },
        { id: 4, title: 'WAVE & PAY' }
    ];

    const generateWaveTimes = () => {
        const times = [];
        let current = new Date();
        current.setHours(9, 0, 0, 0);
        const end = new Date();
        end.setHours(17, 0, 0, 0);

        while (current <= end) {
            const timeStr = `${current.getHours().toString().padStart(2, '0')}:${current.getMinutes().toString().padStart(2, '0')}`;
            const isDefaultSoldOut = (timeStr === '09:00' || timeStr === '09:10' || timeStr === '09:20' || timeStr === '09:30' || timeStr === '09:40' || timeStr === '09:50');
            times.push({
                time: timeStr,
                isSoldOut: isDefaultSoldOut
            });
            current.setMinutes(current.getMinutes() + 10);
        }
        return times;
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const res = await apiClient.post('sponsors/coupons/validate', { code: couponCode.trim() });
            if (res.data.success) {
                const couponData = res.data.data;
                let discountValue = 0;
                if (couponData.type === 'percentage') {
                    discountValue = Math.round((event!.price * couponData.value) / 100);
                } else {
                    discountValue = Math.min(couponData.value, event!.price);
                }
                setDiscountInfo({
                    type: 'coupon',
                    value: discountValue,
                    label: `Coupon ${couponData.code} (${couponData.type === 'percentage' ? `${couponData.value}%` : `₹${couponData.value}`} off)`
                });
                setCouponApplied(true);
            }
        } catch (error: any) {
            setCouponError(error.response?.data?.message || 'Invalid coupon code');
            setCouponApplied(false);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setCouponApplied(false);
        setCouponError('');
        setDiscountInfo(null);
        // Re-fetch early bird discount
        const fetchDiscount = async () => {
            try {
                const res = await apiClient.get(`registrations/check-discount/${id}`);
                if (res.data.discount && res.data.discount.type !== 'none') {
                    setDiscountInfo(res.data.discount);
                    setSpotsRemaining(res.data.spotsRemaining);
                }
            } catch (error) {
                console.error('Failed to re-fetch discount', error);
            }
        };
        fetchDiscount();
    };

    const getFinalPrice = () => {
        if (!event) return 0;
        if (discountInfo && discountInfo.value > 0) {
            return Math.max(event.price - discountInfo.value, 0);
        }
        return event.price;
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
            const bookingPayload: any = { ...regData };
            if (couponApplied && couponCode.trim()) {
                bookingPayload.couponCode = couponCode.trim();
            }

            // --- TEST MODE BYPASS ---
            if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'rzp_test_placeholder') {
                console.log('--- TEST MODE: BYPASSING RAZORPAY ---');
                try {
                    await apiClient.post(`registrations/test-register/${id}`, bookingPayload);
                    setShowSuccessOverlay(true);
                    setTimeout(() => router.push('/dashboard'), 2000);
                    return;
                } catch (err: any) {
                    console.error('Test registration failed', err);
                    const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Test registration failed';
                    alert(err.response?.status ? `Error ${err.response.status}: ${msg}` : msg);
                    setBookingLoading(false);
                    return;
                }
            }

            const res = await apiClient.post(`registrations/book/${id}`, bookingPayload);
            const { order } = res.data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "ATHLiON",
                description: `Registration for ${event?.name}`,
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        await apiClient.post('registrations/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        setShowSuccessOverlay(true);
                        setTimeout(() => router.push('/dashboard'), 2000);
                    } catch (err) {
                        console.error('Payment verification failed', err);
                        alert('Payment verified on gateway but failed on our server. Please contact support.');
                        router.push('/dashboard');
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
        <div className="min-h-screen flex items-center justify-center bg-black">
            <p className="text-white font-black italic uppercase tracking-widest text-xl">Event Not Found</p>
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
        <div className="min-h-screen pt-20 md:pt-32 pb-28 md:pb-24 bg-black px-4 lg:px-0">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <div className="max-w-7xl mx-auto px-0 md:px-4">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 md:mb-12 uppercase text-xs font-black tracking-widest group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Calendar
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    {/* Left Side: Event Info */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black italic tracking-tighter uppercase mb-4 md:mb-8 leading-[0.9] break-words">
                                {event.name?.split(' ')[0]} <span className="text-[#f82506]">{event.name?.split(' ').slice(1).join(' ')}</span>
                            </h1>

                            <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-12">
                                <div className="flex items-center gap-2 bg-white/5 px-3 md:px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-300">
                                    <Calendar size={13} className="text-[#f82506] shrink-0" /> {formatDate(event.date)}
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-3 md:px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-300">
                                    <Clock size={13} className="text-[#f82506] shrink-0" /> {event.startTime} Start
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-3 md:px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-300">
                                    <MapPin size={13} className="text-[#f82506] shrink-0" /> <span className="truncate max-w-[180px] md:max-w-none">{event.venue.address.split(',')[0]}</span>
                                </div>
                            </div>

                            <div className="space-y-6 md:space-y-8 text-gray-400 text-sm md:text-lg leading-relaxed mb-8 md:mb-12">
                                <p>{event.description}</p>
                                <div className="glass-card p-5 md:p-8 border-l-4 border-l-[#f82506] bg-zinc-950/30">
                                    <h3 className="text-white text-base md:text-xl font-black italic uppercase mb-3 md:mb-4 tracking-tight">Race Format</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4 text-xs md:text-sm font-medium">
                                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#f82506] shrink-0" /> 1km Run x 8 Sections</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#f82506] shrink-0" /> 1000m Ski Erg</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#f82506] shrink-0" /> 50m Sled Push</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#f82506] shrink-0" /> 50m Sled Pull</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#f82506] shrink-0" /> 80m Burpee Broad Jumps</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#f82506] shrink-0" /> 1000m Row</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#f82506] shrink-0" /> 200m Farmers Carry</li>
                                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#f82506] shrink-0" /> 100 Wall Balls</li>
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
                            className="sticky top-24 md:top-32 glass-card p-5 md:p-8 lg:p-10 border-[#f82506]/20 bg-zinc-950/80"
                        >
                            {/* Progress Header */}
                            <div className="flex justify-between items-center mb-6 md:mb-10">
                                {steps.map((s) => (
                                    <div key={s.id} className="flex flex-col items-center gap-1 md:gap-2">
                                        <div className={`w-8 h-1 md:w-16 rounded-full transition-all duration-500 ${step >= s.id ? 'bg-[#f82506]' : 'bg-gray-800'}`} />
                                        <span className={`text-[7px] md:text-[8px] font-black tracking-tighter ${step === s.id ? 'text-[#f82506]' : 'text-gray-600'}`}>{s.title}</span>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={(e) => e.preventDefault()}>
                                {/* STEP 1: LEVEL */}
                                {step === 1 && (
                                    <div className="space-y-5 md:space-y-6">
                                        <h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">PICK YOUR <span className="text-[#f82506]">LEVEL</span></h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { id: 'elite', label: 'Elite (VIP)', desc: 'For experienced athletes' },
                                                { id: 'classical', label: 'Classical (regular)', desc: 'For regular fitness enthusiasts' }
                                            ].map((lvl) => (
                                                <button
                                                    key={lvl.id}
                                                    type="button"
                                                    onClick={() => { setRegData({ ...regData, level: lvl.id }); setStep(2); }}
                                                    className={`glass-card-hover p-4 md:p-6 rounded-xl md:rounded-2xl text-left border transition-all ${regData.level === lvl.id ? 'border-[#f82506] bg-[#f82506]/10' : 'border-white/5'}`}
                                                >
                                                    <span className="block text-lg md:text-xl font-black italic uppercase">{lvl.label}</span>
                                                    <span className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-widest">{lvl.desc}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: PHYSICAL DETAILS */}
                                {step === 2 && (
                                    <div className="space-y-5 md:space-y-6">
                                        <h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">PHYSICAL <span className="text-[#f82506]">DETAILS</span></h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Height (CM)</label>
                                                <input
                                                    type="number"
                                                    placeholder="175"
                                                    value={regData.height}
                                                    onChange={(e) => setRegData({ ...regData, height: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 focus:border-[#f82506] transition-all outline-none text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Weight (KG)</label>
                                                <input
                                                    type="number"
                                                    placeholder="70"
                                                    value={regData.weight}
                                                    onChange={(e) => setRegData({ ...regData, weight: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 focus:border-[#f82506] transition-all outline-none text-sm"
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
                                    <div className="space-y-5 md:space-y-6">
                                        <h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">PICK <span className="text-[#f82506]">CATEGORY</span></h3>
                                        <button
                                            type="button"
                                            onClick={() => setStep(4)}
                                            className="w-full glass-card-hover p-6 md:p-10 rounded-xl md:rounded-2xl text-center border border-[#f82506] bg-[#f82506]/10 transition-all group"
                                        >
                                            <Trophy className="mx-auto mb-3 md:mb-4 text-[#f82506] group-hover:scale-110 transition-transform" size={40} />
                                            <span className="block text-2xl md:text-4xl font-black italic uppercase tracking-tighter mb-2">SINGLE</span>
                                            <span className="text-[10px] md:text-xs text-gray-300 uppercase font-black tracking-[0.2em]">Standard Solo Entry</span>
                                        </button>
                                        <button onClick={() => setStep(2)} className="w-full p-4 rounded-xl border border-white/10 font-bold text-xs uppercase hover:bg-white/5">Back</button>
                                    </div>
                                )}

                                {/* STEP 4: WAVE SELECTION + COUPON + PAYMENT */}
                                {step === 4 && (
                                    <div className="space-y-5 md:space-y-6">
                                        <h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">WAVE <span className="text-[#f82506]">SELECTION</span></h3>
                                        <div className="grid grid-cols-4 md:grid-cols-3 gap-2 md:gap-3 max-h-52 md:max-h-60 overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
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

                                        {/* ═══════ COUPON CODE INPUT ═══════ */}
                                        <div className="pt-4 border-t border-white/5">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                                                <Tag size={12} className="inline mr-1" /> Have a Coupon Code?
                                            </label>
                                            {couponApplied ? (
                                                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle size={18} className="text-green-500" />
                                                        <div>
                                                            <code className="text-green-400 font-mono font-bold text-sm">{couponCode.toUpperCase()}</code>
                                                            <p className="text-[10px] text-green-500/70 font-bold">Coupon applied successfully!</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveCoupon}
                                                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-red-500"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter coupon code..."
                                                        value={couponCode}
                                                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm uppercase font-mono outline-none focus:border-[#f82506] transition-all"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleApplyCoupon}
                                                        disabled={couponLoading || !couponCode.trim()}
                                                        className="px-6 py-3 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#f82506] transition-all disabled:opacity-50"
                                                    >
                                                        {couponLoading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                                                    </button>
                                                </div>
                                            )}
                                            {couponError && (
                                                <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wider">{couponError}</p>
                                            )}
                                        </div>

                                        {/* ═══════ PRICE BREAKDOWN ═══════ */}
                                        <div className="pt-6 border-t border-white/5 space-y-4">
                                            {/* Early Bird Badge */}
                                            {discountInfo && discountInfo.type !== 'none' && discountInfo.type !== 'coupon' && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center gap-3"
                                                >
                                                    <Zap size={16} className="text-amber-500" />
                                                    <div>
                                                        <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">{discountInfo.label}</span>
                                                        {spotsRemaining !== null && (
                                                            <p className="text-amber-500/50 text-[9px] font-bold">{spotsRemaining} super early spot{spotsRemaining !== 1 ? 's' : ''} remaining!</p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Price Lines */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Entry Fee</span>
                                                    <span className={`text-lg font-black italic ${discountInfo && discountInfo.value > 0 ? 'text-gray-500 line-through' : 'text-white'}`}>
                                                        {formatCurrency(event.price)}
                                                    </span>
                                                </div>

                                                {discountInfo && discountInfo.value > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="flex justify-between items-center"
                                                    >
                                                        <span className="text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                                                            <Tag size={12} /> Discount
                                                        </span>
                                                        <span className="text-lg font-black italic text-green-500">- {formatCurrency(discountInfo.value)}</span>
                                                    </motion.div>
                                                )}

                                                <div className="flex justify-between items-end pt-3 border-t border-white/5">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total</span>
                                                    <span className="text-2xl md:text-4xl font-black italic text-white">{formatCurrency(getFinalPrice())}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button onClick={() => setStep(3)} className="flex-1 p-4 rounded-xl border border-white/10 font-bold text-xs uppercase hover:bg-white/5">Back</button>
                                                <button
                                                    onClick={handleBooking}
                                                    disabled={bookingLoading || !regData.batchTime}
                                                    className="flex-[2] btn-primary p-3 md:p-4 py-3 md:py-4 font-black italic tracking-widest text-sm md:text-lg disabled:bg-zinc-800 disabled:text-zinc-500"
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

            {/* --- SUCCESS OVERLAY --- */}
            <AnimatePresence>
                {showSuccessOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden"
                    >
                        {/* Background Pulsing Glow */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute w-[800px] h-[800px] bg-[#f82506] rounded-full blur-[150px] pointer-events-none"
                        />

                        <div className="relative z-10">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="mb-8 inline-block p-8 bg-[#f82506] rounded-[2.5rem] shadow-[0_0_50px_rgba(248,37,6,0.5)]"
                            >
                                <Trophy size={80} className="text-white" />
                            </motion.div>

                            <motion.h2
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white mb-4"
                            >
                                SUCCESSFUL<span className="text-[#f82506]">!</span>
                            </motion.h2>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full inline-block mb-12"
                            >
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">Registration Confirmed</span>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-2"
                            >
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Redirecting to your dashboard</p>
                                <div className="flex gap-1 justify-center" title="Redirecting...">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                            className="w-1.5 h-1.5 bg-[#f82506] rounded-full"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Particle fragments */}
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: 0,
                                    y: 0,
                                    opacity: 1,
                                    rotate: 0,
                                    scale: Math.random() * 2
                                }}
                                animate={{
                                    x: (Math.random() - 0.5) * 1000,
                                    y: (Math.random() - 0.5) * 1000,
                                    opacity: 0,
                                    rotate: Math.random() * 360
                                }}
                                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.1 }}
                                className="absolute w-2 h-8 bg-[#f82506] rounded-full pointer-events-none"
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
