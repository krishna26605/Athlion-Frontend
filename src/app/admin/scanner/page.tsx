'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ScanLine, Camera, CheckCircle2, XCircle, AlertTriangle,
    Loader2, User, Calendar, Clock, MapPin, RefreshCw, Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VerificationResult {
    status: 'success' | 'already' | 'error';
    message: string;
    data?: {
        name: string;
        event: string;
        batch: number;
        time: string;
    };
}

export default function AdminQRScanner() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [scannerLoading, setScannerLoading] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const scannerRef = useRef<any>(null);
    const scannerDivRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<{ success: HTMLAudioElement | null; error: HTMLAudioElement | null }>({ success: null, error: null });

    useEffect(() => {
        // Initialize audio on client
        audioRef.current.success = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
        audioRef.current.error = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    }, []);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    const triggerHaptic = (pattern: number[]) => {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    };

    const startScanner = async () => {
        setResult(null);
        setScanning(true);

        // Dynamically import html5-qrcode only on client
        const { Html5Qrcode } = await import('html5-qrcode');

        // Small delay for DOM to render
        await new Promise(r => setTimeout(r, 300));

        if (!scannerDivRef.current) return;

        const scanner = new Html5Qrcode('qr-scanner-viewport');
        scannerRef.current = scanner;

        try {
            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
                async (decodedText: string) => {
                    // Stop scanning immediately after first successful decode
                    await scanner.stop();
                    scannerRef.current = null;
                    setScanning(false);
                    handleQRResult(decodedText);
                },
                () => { /* ignore scan errors */ }
            );
        } catch (err: any) {
            console.error('Scanner Error:', err);
            setScanning(false);
            setResult({
                status: 'error',
                message: err.message || 'Camera access denied. Please allow camera permissions.',
            });
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
            } catch (e) { /* already stopped */ }
            scannerRef.current = null;
        }
        setScanning(false);
    };

    const handleQRResult = async (qrCode: string) => {
        setScannerLoading(true);
        setShowOverlay(true);
        try {
            const res = await apiClient.post('checkin', { qrCode });
            triggerHaptic([100, 50, 100]); // Success vibration
            audioRef.current.success?.play().catch(() => {});
            
            setResult({
                status: 'success',
                message: res.data.message,
                data: res.data.data,
            });

            // Auto-reset after 3 seconds
            setTimeout(() => {
                setShowOverlay(false);
                setResult(null);
                startScanner();
            }, 3000);

        } catch (err: any) {
            const msg = err.response?.data?.message || 'Verification failed';
            audioRef.current.error?.play().catch(() => {});
            
            if (msg.includes('already')) {
                triggerHaptic([200, 100, 200]); // Warning vibration
                setResult({
                    status: 'already',
                    message: msg,
                    data: err.response?.data?.data,
                });
            } else {
                triggerHaptic([500]); // Error vibration
                setResult({
                    status: 'error',
                    message: msg,
                });
            }

            // Auto-reset even on error
            setTimeout(() => {
                setShowOverlay(false);
                setResult(null);
                startScanner();
            }, 3000);
        } finally {
            setScannerLoading(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {});
            }
        };
    }, []);

    if (authLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Loader2 className="animate-spin text-[#f82506]" size={40} />
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto relative"
        >
            {/* Background Ambient Glow for Success */}
            <AnimatePresence>
                {result?.status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.15 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-green-500 pointer-events-none z-0 blur-[100px]"
                    />
                )}
            </AnimatePresence>

            {/* Scanner Area */}
            <div className="glass-card overflow-hidden border-white/5 relative z-10">
                {/* Scanner Header */}
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#f82506]/10 rounded-xl">
                            <ScanLine size={20} className="text-[#f82506]" />
                        </div>
                        <div>
                            <h2 className="font-black italic uppercase tracking-tight text-lg">QR Scanner</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Point camera at athlete&apos;s QR code</p>
                        </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${scanning ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} />
                </div>

                {/* Camera Viewport */}
                <div className="relative bg-black aspect-square max-h-[60vh] flex items-center justify-center overflow-hidden">
                    {scanning || showOverlay ? (
                        <>
                            <div id="qr-scanner-viewport" ref={scannerDivRef} className={`w-full h-full ${showOverlay ? 'blur-sm' : ''}`} />
                            
                            {/* Scanning overlay corners */}
                            {!showOverlay && (
                                <div className="absolute inset-0 pointer-events-none z-10">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px]">
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#f82506] rounded-tl-lg" />
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#f82506] rounded-tr-lg" />
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#f82506] rounded-bl-lg" />
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#f82506] rounded-br-lg" />
                                        <motion.div
                                            animate={{ y: [0, 230, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                            className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#f82506] to-transparent shadow-[0_0_10px_rgba(248,37,6,0.5)]"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Verification Overlay */}
                            <AnimatePresence>
                                {showOverlay && result && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                                    >
                                        {scannerLoading ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 className="animate-spin text-[#f82506]" size={60} />
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Verifying...</p>
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ scale: 0.8, y: 20 }}
                                                animate={{ scale: 1, y: 0 }}
                                                className="w-full max-w-sm"
                                            >
                                                {result.status === 'success' ? (
                                                    <div className="text-center">
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: [0, 1.2, 1] }}
                                                            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.5)]"
                                                        >
                                                            <CheckCircle2 size={48} className="text-white" />
                                                        </motion.div>
                                                        <h3 className="text-4xl font-black italic uppercase text-green-400 mb-2">VERIFIED</h3>
                                                        <p className="text-white text-xl font-bold uppercase tracking-tight mb-4">{result.data?.name}</p>
                                                        <div className="flex justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                            <span>{result.data?.event}</span>
                                                            <span>{result.data?.time}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: [0, 1.2, 1] }}
                                                            className={`w-24 h-24 ${result.status === 'already' ? 'bg-amber-500' : 'bg-red-500'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}
                                                        >
                                                            {result.status === 'already' ? <AlertTriangle size={48} className="text-white" /> : <XCircle size={48} className="text-white" />}
                                                        </motion.div>
                                                        <h3 className={`text-3xl font-black italic uppercase ${result.status === 'already' ? 'text-amber-400' : 'text-red-500'} mb-2`}>
                                                            {result.status === 'already' ? 'ALREADY SCANNED' : 'INVALID'}
                                                        </h3>
                                                        <p className="text-white text-sm font-bold opacity-80">{result.message}</p>
                                                        {result.data && (
                                                            <p className="text-[#f82506] mt-2 font-black italic text-lg uppercase">{result.data.name}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-6 p-12">
                            <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5">
                                <Camera size={48} className="text-gray-700" />
                            </div>
                            <div className="text-center">
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Camera Inactive</p>
                                <p className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">Tap the button below to start scanning</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Scanner Controls */}
                <div className="p-6 border-t border-white/5 flex justify-center">
                    {scanning ? (
                        <button
                            onClick={stopScanner}
                            className="px-8 py-4 rounded-2xl bg-zinc-900 border border-white/10 text-white font-black italic uppercase text-sm tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                        >
                            <XCircle size={18} /> STOP SCANNER
                        </button>
                    ) : (
                        <button
                            onClick={startScanner}
                            className="px-8 py-4 rounded-2xl bg-[#f82506] text-white font-black italic uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(248,37,6,0.3)] flex items-center gap-3 group"
                        >
                            <Zap size={18} className="group-hover:rotate-12 transition-transform" /> START SCANNING
                        </button>
                    )}
                </div>
            </div>

            {/* Manual Result Card (Fallback/Detailed) */}
            <AnimatePresence>
                {result && !showOverlay && !scannerLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="mt-6 relative z-10"
                    >
                        {/* Status elements here if needed, but the overlay covers current scan */}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
