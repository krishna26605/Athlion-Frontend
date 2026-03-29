'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

import { usePathname } from 'next/navigation';

const Footer = () => {
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="bg-black border-t border-white/10 pt-12 md:pt-16 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 md:mb-6">
                            <img src="/FINAL-ATH-LOGO.png" alt="ATHLiON Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                            <span className="text-xl md:text-2xl font-black tracking-tighter italic">ATH<span className="text-[#f82506]">LiON</span></span>
                        </Link>
                        <p className="text-gray-400 max-w-sm mb-4 md:mb-6 text-sm md:text-base">
                            The world series of fitness racing. Test your strength, endurance, and mental toughness in the ultimate fitness competition.
                        </p>
                        <div className="flex gap-3">
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#f82506] transition-colors"><Instagram size={18} /></Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#f82506] transition-colors"><Twitter size={18} /></Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#f82506] transition-colors"><Facebook size={18} /></Link>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4 md:mb-6 uppercase tracking-widest text-sm">Quick Links</h4>
                        <ul className="space-y-3 md:space-y-4 text-gray-400 text-sm">
                            <li><Link href="/events" className="hover:text-white transition-colors">Find an Event</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Rulebook</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Training</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Volunteers</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-white mb-4 md:mb-6 uppercase tracking-widest text-sm">Support</h4>
                        <ul className="space-y-3 md:space-y-4 text-gray-400 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">FAQs</Link></li>
                            <li className="flex items-center gap-2"><Mail size={16} /><span className="text-xs">support@athlion.com</span></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-white/5 text-center text-gray-500 text-xs md:text-sm">
                    <p>© {new Date().getFullYear()} ATHLiON FITNESS. ALL RIGHTS RESERVED.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
