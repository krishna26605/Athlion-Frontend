'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Trophy, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Events', href: '/events' },
        { name: 'Schedule', href: '#schedule' },
        { name: 'Sponsors', href: '/sponsors' },
    ];

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <motion.nav 
            initial={false}
            animate={{
                backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'rgba(0, 0, 0, 0)',
                backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
                paddingTop: scrolled ? '12px' : '20px',
                paddingBottom: scrolled ? '12px' : '20px',
                borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.03)' : '1px solid rgba(255, 255, 255, 0)'
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed w-full z-50 left-0 top-0"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="/FINAL-ATH-LOGO.png" alt="ATHLiON Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain transition-transform group-hover:scale-105" />
                        <span className="text-xl md:text-2xl font-black tracking-tighter italic">ATH<span className="text-[#f82506]">LiON</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="nav-link font-bold uppercase tracking-widest text-[11px] text-gray-400 hover:text-white transition-colors">
                                {link.name}
                            </Link>
                        ))}
                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.role === 'admin' && (
                                    <Link href="/admin" className="text-[#f82506] font-extrabold text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors">
                                        Admin Panel
                                    </Link>
                                )}
                                <Link href="/dashboard" className="flex items-center gap-2 text-white bg-white/5 border border-white/10 px-4 py-1.5 rounded-full hover:bg-white/10 transition-all text-[11px] font-black uppercase tracking-wider">
                                    <UserIcon size={14} />
                                    <span>{user.name.split(' ')[0]}</span>
                                </Link>
                                <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/register" className="bg-[#f82506] text-white px-5 py-2 rounded-full font-black uppercase text-[11px] tracking-[0.15em] hover:bg-white hover:text-black transition-all duration-300 shadow-lg shadow-[#f82506]/20">
                                Join Now
                            </Link>
                        )}
                    </div>

                    {/* Mobile: Space for floating nav compatibility */}
                    <div className="md:hidden w-8" />
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
