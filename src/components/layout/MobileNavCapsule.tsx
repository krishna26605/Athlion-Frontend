'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Calendar, LayoutDashboard, Trophy, User as UserIcon,
    LogOut, Shield, LogIn, UserPlus, X, ScanLine, Users, Tag
} from 'lucide-react';

const MobileNavCapsule = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const capsuleRef = useRef<HTMLDivElement>(null);

    const isAdminPage = pathname?.startsWith('/admin');
    const isScannerPage = pathname === '/admin/scanner';

    // PWA Install Logic
    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            const installBtn = document.getElementById('pwa-install-btn');
            const installBanner = document.getElementById('pwa-install-banner');
            if (installBanner) installBanner.classList.remove('hidden');
            
            if (installBtn) {
                installBtn.onclick = async () => {
                    e.prompt();
                    const { outcome } = await e.userChoice;
                    if (outcome === 'accepted') {
                        if (installBanner) installBanner.classList.add('hidden');
                    }
                };
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    // Auto-hide on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current && currentY > 100) {
                setIsVisible(false);
                setIsExpanded(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close expanded on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (capsuleRef.current && !capsuleRef.current.contains(e.target as Node)) {
                setIsExpanded(false);
            }
        };
        if (isExpanded) {
            document.addEventListener('mousedown', handleClick);
            return () => document.removeEventListener('mousedown', handleClick);
        }
    }, [isExpanded]);

    // Close expanded on route change
    useEffect(() => {
        setIsExpanded(false);
    }, [pathname]);

    // Hide on scanner page (full-screen mode)
    if (isScannerPage) return null;

    // Different nav items for public vs admin pages
    const publicNavItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: user ? 'Dashboard' : 'Login', href: user ? '/dashboard' : '/login', icon: user ? LayoutDashboard : LogIn },
        { name: 'Sponsors', href: '/sponsors', icon: Trophy },
    ];

    const adminNavItems = [
        { name: 'Home', href: '/admin', icon: LayoutDashboard },
        { name: 'Events', href: '/admin/events', icon: Calendar },
        { name: 'Scanner', href: '/admin/scanner', icon: ScanLine },
        { name: 'Users', href: '/admin/users', icon: Users },
    ];

    const navItems = isAdminPage ? adminNavItems : publicNavItems;

    const isActive = (href: string) => {
        if (href === '/' && !isAdminPage) return pathname === '/';
        if (href === '/admin' && isAdminPage) return pathname === '/admin';
        return pathname?.startsWith(href) && href !== '/' && href !== '/admin';
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={capsuleRef}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] md:hidden"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
                >
                    {/* Expanded Profile Menu (Dynamic Island expansion) */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scaleY: 0.8 }}
                                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                                exit={{ opacity: 0, y: 10, scaleY: 0.8 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 origin-bottom"
                            >
                                <div className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50 overflow-hidden">
                                    {/* Installation Prompt (PWA) */}
                                    <div id="pwa-install-banner" className="hidden px-4 py-3 bg-[#f82506]/10 border-b border-white/5 mb-1 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-wider text-white">ATHLiON App</p>
                                                <p className="text-[8px] font-bold text-gray-500 uppercase">Better experience</p>
                                            </div>
                                            <button 
                                                id="pwa-install-btn"
                                                className="bg-[#f82506] text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-lg shadow-[#f82506]/20"
                                            >
                                                Install
                                            </button>
                                        </div>
                                    </div>
                                    {user ? (
                                        <>
                                            <div className="px-4 py-3 border-b border-white/5">
                                                <p className="text-xs font-black uppercase tracking-wider text-white truncate">{user.name}</p>
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-[#f82506]">{user.role}</p>
                                            </div>
                                            {isAdminPage ? (
                                                <>
                                                    <Link
                                                        href="/admin/registrations"
                                                        onClick={() => setIsExpanded(false)}
                                                        className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                                    >
                                                        <Users size={16} className="text-[#f82506]" />
                                                        Registrations
                                                    </Link>
                                                    <Link
                                                        href="/admin/sponsors"
                                                        onClick={() => setIsExpanded(false)}
                                                        className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                                    >
                                                        <Trophy size={16} className="text-[#f82506]" />
                                                        Sponsors
                                                    </Link>
                                                    <Link
                                                        href="/admin/pricing"
                                                        onClick={() => setIsExpanded(false)}
                                                        className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                                    >
                                                        <Tag size={16} className="text-[#f82506]" />
                                                        Pricing
                                                    </Link>
                                                    <Link
                                                        href="/"
                                                        onClick={() => setIsExpanded(false)}
                                                        className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                                    >
                                                        <Home size={16} className="text-[#f82506]" />
                                                        Live Site
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    {user.role === 'admin' && (
                                                        <Link
                                                            href="/admin"
                                                            onClick={() => setIsExpanded(false)}
                                                            className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                                        >
                                                            <Shield size={16} className="text-[#f82506]" />
                                                            Admin Panel
                                                        </Link>
                                                    )}
                                                </>
                                            )}
                                            <button
                                                onClick={() => { logout(); setIsExpanded(false); }}
                                                className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 rounded-xl transition-colors w-full text-left"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                onClick={() => setIsExpanded(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                            >
                                                <LogIn size={16} />
                                                Sign In
                                            </Link>
                                            <Link
                                                href="/register"
                                                onClick={() => setIsExpanded(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#f82506] hover:bg-[#f82506]/10 rounded-xl transition-colors"
                                            >
                                                <UserPlus size={16} />
                                                Join Now
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Capsule */}
                    <div className="flex items-center gap-1 px-2 py-2 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl shadow-black/60">
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsExpanded(false)}
                                    className="relative"
                                >
                                    <motion.div
                                        whileTap={{ scale: 0.85 }}
                                        className={`flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-200 ${
                                            active
                                                ? 'text-white'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        <item.icon size={20} className="relative z-10" strokeWidth={active ? 2.5 : 1.8} />
                                        <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5 relative z-10">{item.name}</span>
                                        {active && (
                                            <motion.div
                                                layoutId="capsule-highlight"
                                                className="absolute inset-x-1.5 inset-y-1 bg-gradient-to-b from-white/20 to-[#f82506]/10 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2),0_0_20px_rgba(248,37,6,0.1)] border-t border-white/20"
                                                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                                            />
                                        )}
                                    </motion.div>
                                </Link>
                            );
                        })}

                        {/* Profile / More button */}
                        <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-200 ${
                                isExpanded ? 'text-[#f82506]' : 'text-gray-500'
                            }`}
                        >
                            {isExpanded ? (
                                <X size={20} strokeWidth={2.5} />
                            ) : (
                                <UserIcon size={20} strokeWidth={1.8} />
                            )}
                            <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">
                                {isExpanded ? 'Close' : isAdminPage ? 'More' : 'Profile'}
                            </span>
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileNavCapsule;
