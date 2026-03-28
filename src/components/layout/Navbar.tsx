'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Trophy, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
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
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/90 border-b border-white/5 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/FINAL-ATH-LOGO.png" alt="ATHLiON Logo" className="w-10 h-10 object-contain" />
                        <span className="text-2xl font-black tracking-tighter italic">ATH<span className="text-[#f82506]">LiON</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="nav-link font-medium uppercase tracking-wider text-sm">
                                {link.name}
                            </Link>
                        ))}
                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.role === 'admin' && (
                                    <Link href="/admin" className="text-[#f82506] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
                                        Admin Panel
                                    </Link>
                                )}
                                <Link href="/dashboard" className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all">
                                    <UserIcon size={18} />
                                    <span>{user.name.split(' ')[0]}</span>
                                </Link>
                                <button onClick={logout} className="text-gray-400 hover:text-white transition-colors">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/register" className="btn-primary uppercase text-sm tracking-widest">
                                Join Now
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-[#f82506]">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden bg-black/95 absolute w-full h-screen top-0 left-0 pt-24 px-8"
                    >
                        <div className="flex flex-col gap-6 text-2xl font-bold italic uppercase">
                            {navLinks.map((link) => (
                                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="hover:text-[#f82506]">
                                    {link.name}
                                </Link>
                            ))}
                            {user ? (
                                <>
                                    {user.role === 'admin' && (
                                        <Link href="/admin" onClick={() => setIsOpen(false)} className="text-[#f82506]">Admin Panel</Link>
                                    )}
                                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                    <button onClick={logout} className="text-left text-[#f82506]">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setIsOpen(false)} className="hover:text-[#f82506]">Login</Link>
                                    <Link href="/register" onClick={() => setIsOpen(false)} className="text-[#f82506]">Register</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
