'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, User, CheckCircle2, AlertTriangle, Loader2, Camera, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StaffCheckinPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [scanResult, setScanResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || (user.role !== 'staff' && user.role !== 'admin'))) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (scanning) {
            const scanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                rememberLastUsedCamera: true
            }, false);

            scanner.render(onScanSuccess, onScanFailure);

            async function onScanSuccess(decodedText: string) {
                scanner.clear();
                setScanning(false);
                handleCheckIn(decodedText);
            }

            function onScanFailure(error: any) {
                // console.warn(error);
            }

            return () => {
                scanner.clear().catch(err => console.error("Failed to clear scanner", err));
            }
        }
    }, [scanning]);

    const handleCheckIn = async (qrCode: string) => {
        setLoading(true);
        setError(null);
        setScanResult(null);
        try {
            const res = await apiClient.post('checkin', { qrCode });
            setScanResult(res.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Check-in failed');
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
        <div className="min-h-screen pt-32 pb-24 px-4 bg-black">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <ShieldCheck className="mx-auto text-[#f82506] mb-4" size={48} />
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">STAFF <span className="text-white">CHECK-IN</span></h1>
                    <p className="text-gray-500 uppercase font-black tracking-widest text-[10px]">Event Day Operations Only</p>
                </div>

                <div className="glass-card p-8 mb-8 border-[#f82506]/20 bg-zinc-950/80">
                    {!scanning ? (
                        <div className="text-center py-12">
                            <button
                                onClick={() => setScanning(true)}
                                className="w-24 h-24 bg-[#f82506] rounded-full flex items-center justify-center text-white mb-6 mx-auto hover:scale-105 transition-transform shadow-[0_0_30px_rgba(248,37,6,0.3)]"
                            >
                                <Camera size={32} />
                            </button>
                            <h3 className="text-xl font-bold uppercase italic italic">Ready to Scan</h3>
                            <p className="text-gray-500 text-sm mt-2">Scan the participant's digital ticket QR code to verify their batch and mark attendance.</p>
                        </div>
                    ) : (
                        <div>
                            <div id="reader" className="overflow-hidden rounded-2xl border border-white/10 bg-black"></div>
                            <button
                                onClick={() => setScanning(false)}
                                className="w-full mt-6 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest"
                            >
                                Cancel Scanner
                            </button>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-12"
                        >
                            <Loader2 className="animate-spin text-[#f82506] mb-4" size={32} />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Verifying Signature...</p>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl flex items-start gap-4 text-red-500"
                        >
                            <AlertTriangle className="flex-shrink-0" size={24} />
                            <div>
                                <h4 className="font-black uppercase italic tracking-tight mb-1">Access Denied</h4>
                                <p className="text-sm opacity-80">{error}</p>
                            </div>
                        </motion.div>
                    )}

                    {scanResult && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-500/10 border border-green-500/50 p-8 rounded-[2rem] text-green-500"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-green-500/20 rounded-2xl">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div>
                                    <h4 className="font-black uppercase italic tracking-tight text-2xl leading-none">CHECK-IN SUCCESS</h4>
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">Identity Verified</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 bg-green-500/5 p-6 rounded-2xl border border-green-500/10 mb-8">
                                <div>
                                    <span className="text-[10px] font-black uppercase opacity-60 block">Participant</span>
                                    <span className="text-white font-bold text-lg uppercase">{scanResult.name}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase opacity-60 block">Batch Info</span>
                                    <span className="text-white font-bold text-lg uppercase">{scanResult.batch} • {scanResult.time}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-[10px] font-black uppercase opacity-60 block">Race Event</span>
                                    <span className="text-white font-bold uppercase">{scanResult.event}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setScanResult(null)}
                                className="w-full py-4 bg-green-500 text-black font-black uppercase italic tracking-widest rounded-xl hover:bg-green-400 transition-colors"
                            >
                                NEXT SCAN
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
