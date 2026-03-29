'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Calendar, Heart, Tag, Handshake,
    LogOut, ChevronRight, User as UserIcon, ScanLine, Menu, X, Home
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { name: 'Events', icon: <Calendar size={20} />, path: '/admin/events' },
        { name: 'Registrations', icon: <Users size={20} />, path: '/admin/registrations' },
        { name: 'QR Scanner', icon: <ScanLine size={20} />, path: '/admin/scanner' },
        { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
        { name: 'Sponsors & Ads', icon: <Heart size={20} />, path: '/admin/sponsors' },
        { name: 'Pricing & Coupons', icon: <Tag size={20} />, path: '/admin/pricing' },
    ];

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    // Dynamic header logic
    const getHeaderInfo = () => {
        if (pathname === '/admin/events/new') return { pre: 'Create', color: 'Event', sub: 'Event Management' };
        if (pathname === '/admin/events') return { pre: 'Manage', color: 'Events', sub: 'Event Management' };
        if (pathname === '/admin/pricing') return { pre: 'Platform', color: 'Pricing', sub: 'Coupons & Early Bird', colorClass: 'text-amber-500' };
        if (pathname === '/admin/registrations') return { pre: 'Event', color: 'Registrations', sub: 'Athlete Bookings' };
        if (pathname === '/admin/scanner') return { pre: 'QR', color: 'Scanner', sub: 'Athlete Verification' };
        if (pathname === '/admin/sponsors') return { pre: 'Sponsors', color: '& Ads', sub: 'Partners & Advertising' };
        if (pathname === '/admin/users') return { pre: 'Platform', color: 'Users', sub: 'Registered Athletes' };
        return { pre: 'Admin', color: 'Dashboard', sub: 'Executive Summary', titleSize: 'text-3xl' };
    };

    const header = getHeaderInfo();

    // For scanner page on mobile, use minimal layout
    const isScannerPage = pathname === '/admin/scanner';

    return (
        <div className="min-h-screen min-h-dvh bg-black flex overflow-hidden">
            {/* ═══════ DESKTOP SIDEBAR (md+) ═══════ */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 96 : 300 }}
                transition={{ type: 'spring', stiffness: 250, damping: 28, mass: 0.5 }}
                className="hidden md:flex bg-[#0a0a0a] border-r border-white/10 h-screen fixed left-0 top-0 flex-col z-50 shadow-2xl"
            >
                {/* Brand */}
                <div className="h-24 border-b border-white/10 flex items-center px-6 shrink-0 justify-between overflow-hidden">
                    <Link href="/admin" className="flex items-center gap-3 whitespace-nowrap overflow-visible">
                        <img src="/FINAL-ATH-LOGO.png" alt="ATHLiON Logo" className="w-12 h-12 object-contain shrink-0" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-3xl font-black tracking-tighter italic text-white pr-2"
                                >
                                    ATH<span className="text-[#f82506]">LiON</span>
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                {/* Nav */}
                <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mb-6 px-2 whitespace-nowrap"
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[gray]">Control Panel</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col gap-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    title={isCollapsed ? item.name : ''}
                                    className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-colors font-bold text-sm uppercase tracking-wider whitespace-nowrap flex-shrink-0 ${
                                        isActive
                                            ? 'bg-[#f82506] text-white shadow-lg shadow-[#f82506]/20'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span className="shrink-0">{item.icon}</span>
                                    <AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom */}
                <div className="p-4 border-t border-white/10 shrink-0 flex flex-col gap-2">
                    <Link
                        href="/"
                        title={isCollapsed ? "Back to Site" : ""}
                        className="flex items-center gap-4 px-4 py-4 text-gray-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors uppercase tracking-widest text-xs font-black whitespace-nowrap"
                    >
                        <span className="shrink-0"><Home size={20} /></span>
                        {!isCollapsed && <span>Live Site</span>}
                    </Link>
                </div>

                {/* Collapse Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-16 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#f82506] hover:border-[#f82506] shadow-xl z-50 group hover:scale-105 transition-all outline-none"
                    aria-label="Toggle Sidebar"
                >
                    <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                        <ChevronRight size={14} className="group-hover:text-white transition-colors" />
                    </motion.div>
                </button>
            </motion.aside>

            {/* ═══════ MAIN CONTENT AREA (Desktop) ═══════ */}
            <motion.div
                animate={{ marginLeft: isCollapsed ? 96 : 300 }}
                transition={{ type: 'spring', stiffness: 250, damping: 28, mass: 0.5 }}
                className="hidden md:flex flex-1 flex-col h-screen overflow-hidden"
            >
                {/* Desktop Header */}
                <header className="h-24 shrink-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-10 z-40 relative shadow-2xl">
                    <div className="flex flex-col">
                        <span className="text-[#f82506] font-black uppercase tracking-[0.3em] text-[10px] mb-1">{header.sub}</span>
                        <h1 className={`${header.titleSize || 'text-4xl'} font-black italic tracking-tighter uppercase leading-none`}>
                            {header.pre} <span className={header.colorClass || 'text-white'}>{header.color}</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {user && (
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col text-right">
                                    <span className="text-sm font-black uppercase tracking-widest text-white">{user.name}</span>
                                    <span className="text-[10px] uppercase font-bold text-[#f82506]">{user.role}</span>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center relative overflow-hidden shadow-lg shadow-black/50">
                                    <UserIcon size={20} className="text-gray-300" />
                                </div>
                                <div className="h-8 w-px bg-white/10 mx-2" />
                                <button onClick={logout} title="Sign off" className="p-3 text-gray-500 hover:text-[#f82506] transition-colors rounded-xl hover:bg-white/5 border border-transparent hover:border-[#f82506]/20">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Desktop Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-black custom-scrollbar w-full relative z-0">
                    {children}
                </main>
            </motion.div>

            {/* ═══════ MOBILE LAYOUT ═══════ */}
            <div className="flex md:hidden flex-1 flex-col min-h-screen min-h-dvh w-full">
                {/* Mobile Top Header — Clean & minimal, NO menu button */}
                {!isScannerPage && (
                    <header className="shrink-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 py-3 z-40 relative safe-top">
                        <div className="flex items-center gap-3">
                            <Link href="/admin" className="shrink-0">
                                <img src="/FINAL-ATH-LOGO.png" alt="ATHLiON" className="w-7 h-7 object-contain" />
                            </Link>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[8px] font-black uppercase tracking-[0.15em] text-[#f82506] leading-tight">{header.sub}</span>
                                <h1 className="text-base font-black italic tracking-tighter uppercase leading-tight truncate">
                                    {header.pre} <span className={header.colorClass || 'text-white'}>{header.color}</span>
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {user && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 hidden min-[400px]:block">{user.name.split(' ')[0]}</span>
                                    <div className="w-8 h-8 rounded-full bg-[#f82506]/10 border border-[#f82506]/30 flex items-center justify-center">
                                        <UserIcon size={14} className="text-[#f82506]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>
                )}

                {/* Mobile Content — padding bottom for floating nav */}
                <main className={`flex-1 overflow-y-auto bg-black custom-scrollbar w-full relative z-0 ${isScannerPage ? '' : 'p-4 pb-24'}`}>
                    {children}
                </main>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f82506; }
            `}</style>
        </div>
    );
}
