'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ScanLine, CheckCircle2, XCircle, AlertTriangle,
    Loader2, ArrowLeft, Zap, X
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

// Web Audio API beep generator
const playBeep = (type: 'success' | 'error') => {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = 0.3;

        if (type === 'success') {
            osc.frequency.value = 880;
            osc.type = 'sine';
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        } else {
            osc.frequency.value = 280;
            osc.type = 'square';
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        }

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) { /* Audio not available */ }
};

export default function AdminQRScanner() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [scannerLoading, setScannerLoading] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [scanCount, setScanCount] = useState(0);
    const [autoResetProgress, setAutoResetProgress] = useState(0);
    const scannerRef = useRef<any>(null);
    const scannerDivRef = useRef<HTMLDivElement>(null);
    const autoResetTimer = useRef<NodeJS.Timeout | null>(null);
    const progressTimer = useRef<NodeJS.Timeout | null>(null);
    const wakeLockRef = useRef<any>(null);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    // Auto-start scanner on mount
    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            const timer = setTimeout(() => startScanner(), 500);
            return () => clearTimeout(timer);
        }
    }, [authLoading, user]);

    // Request wake lock to keep screen on
    useEffect(() => {
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
                }
            } catch (e) { /* Wake lock not available */ }
        };
        requestWakeLock();
        return () => {
            wakeLockRef.current?.release?.();
        };
    }, []);

    const triggerHaptic = (pattern: number[]) => {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    };

    const startScanner = async () => {
        setResult(null);
        setShowOverlay(false);
        setScanning(true);

        const { Html5Qrcode } = await import('html5-qrcode');
        await new Promise(r => setTimeout(r, 400));

        if (!scannerDivRef.current) return;

        const scanner = new Html5Qrcode('qr-scanner-viewport');
        scannerRef.current = scanner;

        try {
            const viewportWidth = window.innerWidth;
            const qrboxSize = Math.min(Math.floor(viewportWidth * 0.65), 300);

            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 15,
                    qrbox: { width: qrboxSize, height: qrboxSize },
                    aspectRatio: window.innerWidth > window.innerHeight ? 16 / 9 : 9 / 16,
                },
                async (decodedText: string) => {
                    await scanner.stop();
                    scannerRef.current = null;
                    setScanning(false);
                    handleQRResult(decodedText);
                },
                () => { }
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
            try { await scannerRef.current.stop(); } catch (e) { }
            scannerRef.current = null;
        }
        setScanning(false);
    };

    const startAutoReset = useCallback(() => {
        setAutoResetProgress(0);
        let progress = 0;
        const totalMs = 2500;
        const interval = 50;
        const step = (interval / totalMs) * 100;

        progressTimer.current = setInterval(() => {
            progress += step;
            setAutoResetProgress(Math.min(progress, 100));
        }, interval);

        autoResetTimer.current = setTimeout(() => {
            if (progressTimer.current) clearInterval(progressTimer.current);
            setShowOverlay(false);
            setResult(null);
            setAutoResetProgress(0);
            startScanner();
        }, totalMs);
    }, []);

    const handleQRResult = async (qrCode: string) => {
        setScannerLoading(true);
        setShowOverlay(true);
        try {
            const res = await apiClient.post('checkin', { qrCode });
            triggerHaptic([50, 30, 50, 30, 100]);
            playBeep('success');

            setResult({
                status: 'success',
                message: res.data.message,
                data: res.data.data,
            });
            setScanCount(prev => prev + 1);
            startAutoReset();

        } catch (err: any) {
            const msg = err.response?.data?.message || 'Verification failed';
            playBeep('error');

            if (msg.includes('already')) {
                triggerHaptic([200, 100, 200]);
                setResult({
                    status: 'already',
                    message: msg,
                    data: err.response?.data?.data,
                });
            } else {
                triggerHaptic([500]);
                setResult({
                    status: 'error',
                    message: msg,
                });
            }
            startAutoReset();
        } finally {
            setScannerLoading(false);
        }
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (scannerRef.current) scannerRef.current.stop().catch(() => { });
            if (autoResetTimer.current) clearTimeout(autoResetTimer.current);
            if (progressTimer.current) clearInterval(progressTimer.current);
            wakeLockRef.current?.release?.();
        };
    }, []);

    if (authLoading) return (
        <div className="min-h-screen min-h-dvh flex items-center justify-center bg-black">
            <Loader2 className="animate-spin text-[#f82506]" size={40} />
        </div>
    );

    return (
        <div className="fixed inset-0 md:relative md:inset-auto bg-black flex flex-col h-screen h-dvh md:h-auto md:max-w-2xl md:mx-auto md:my-0">
            {/* Mobile Full-Screen / Desktop Card mode */}

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-gradient-to-b from-black/80 to-transparent safe-top">
                <button
                    onClick={() => router.push('/admin')}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="hidden md:inline text-xs font-black uppercase tracking-widest">Back</span>
                </button>

                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {scanning ? 'SCANNING' : 'PAUSED'}
                    </span>
                </div>

                {scanCount > 0 && (
                    <div className="bg-[#f82506] px-3 py-1 rounded-full">
                        <span className="text-[10px] font-black text-white">{scanCount} SCANNED</span>
                    </div>
                )}
            </div>

            {/* Camera Viewport - Full Screen */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden md:rounded-2xl md:m-4 md:border md:border-white/10">
                {scanning || showOverlay ? (
                    <>
                        <div id="qr-scanner-viewport" ref={scannerDivRef} className={`w-full h-full ${showOverlay ? 'blur-sm scale-105' : ''} transition-all duration-300`} />

                        {/* Scanning Corners */}
                        {!showOverlay && (
                            <div className="absolute inset-0 pointer-events-none z-10">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65vw] h-[65vw] max-w-[300px] max-h-[300px]">
                                    <div className="absolute top-0 left-0 w-10 h-10 border-t-3 border-l-3 border-[#f82506] rounded-tl-xl" />
                                    <div className="absolute top-0 right-0 w-10 h-10 border-t-3 border-r-3 border-[#f82506] rounded-tr-xl" />
                                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-3 border-l-3 border-[#f82506] rounded-bl-xl" />
                                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-3 border-r-3 border-[#f82506] rounded-br-xl" />
                                    <motion.div
                                        animate={{ y: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                                        className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-[#f82506] to-transparent shadow-[0_0_15px_rgba(248,37,6,0.6)]"
                                    />
                                </div>
                                <div className="absolute bottom-8 left-0 right-0 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Point at QR code</p>
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
                                    className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/70 backdrop-blur-xl"
                                >
                                    {scannerLoading ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="animate-spin text-[#f82506]" size={56} />
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Verifying...</p>
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0.7, y: 40 }}
                                            animate={{ scale: 1, y: 0 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                            className="w-full max-w-sm text-center"
                                        >
                                            {/* Status Icon */}
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: [0, 1.3, 1] }}
                                                transition={{ duration: 0.4 }}
                                                className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                                                    result.status === 'success'
                                                        ? 'bg-green-500 shadow-[0_0_60px_rgba(34,197,94,0.5)]'
                                                        : result.status === 'already'
                                                            ? 'bg-amber-500 shadow-[0_0_60px_rgba(245,158,11,0.4)]'
                                                            : 'bg-red-500 shadow-[0_0_60px_rgba(239,68,68,0.4)]'
                                                }`}
                                            >
                                                {result.status === 'success' ? <CheckCircle2 size={48} className="text-white" /> :
                                                    result.status === 'already' ? <AlertTriangle size={48} className="text-white" /> :
                                                        <XCircle size={48} className="text-white" />}
                                            </motion.div>

                                            {/* Status Text */}
                                            <h3 className={`text-3xl md:text-4xl font-black italic uppercase mb-2 ${
                                                result.status === 'success' ? 'text-green-400' :
                                                    result.status === 'already' ? 'text-amber-400' : 'text-red-500'
                                            }`}>
                                                {result.status === 'success' ? 'VERIFIED' :
                                                    result.status === 'already' ? 'ALREADY SCANNED' : 'INVALID'}
                                            </h3>

                                            {result.data && (
                                                <>
                                                    <p className="text-white text-xl md:text-2xl font-bold uppercase tracking-tight mb-2">{result.data.name}</p>
                                                    <div className="flex justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                        <span>{result.data.event}</span>
                                                        <span>•</span>
                                                        <span>{result.data.time}</span>
                                                    </div>
                                                </>
                                            )}

                                            {!result.data && (
                                                <p className="text-white/70 text-sm font-bold">{result.message}</p>
                                            )}

                                            {/* Auto-reset progress bar */}
                                            <div className="mt-8 mx-auto w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full rounded-full ${
                                                        result.status === 'success' ? 'bg-green-500' :
                                                            result.status === 'already' ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${autoResetProgress}%` }}
                                                />
                                            </div>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-2">Auto-resuming...</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-6 p-12">
                        <div className="p-8 bg-zinc-900/50 rounded-3xl border border-white/5">
                            <ScanLine size={48} className="text-gray-700" />
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Camera Off</p>
                            <p className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">Tap below to start</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-30 p-4 md:p-6 bg-gradient-to-t from-black/90 to-transparent safe-bottom">
                <div className="flex justify-center">
                    {scanning ? (
                        <button
                            onClick={stopScanner}
                            className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-white font-black italic uppercase text-xs md:text-sm tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                        >
                            <X size={18} /> STOP
                        </button>
                    ) : !showOverlay && (
                        <button
                            onClick={startScanner}
                            className="px-8 py-4 md:px-10 md:py-5 rounded-full bg-[#f82506] text-white font-black italic uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_rgba(248,37,6,0.4)] flex items-center gap-3"
                        >
                            <Zap size={20} /> START SCANNING
                        </button>
                    )}
                </div>
            </div>

            {/* Background flash on success */}
            <AnimatePresence>
                {result?.status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-green-500 pointer-events-none z-0"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
