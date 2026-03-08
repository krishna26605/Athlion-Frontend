'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Heart,
    Tag,
    Handshake,
    ChevronLeft
} from 'lucide-react';

const AdminSidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { name: 'Events', icon: <Calendar size={20} />, path: '/admin/events' },
        { name: 'Registered Users', icon: <Users size={20} />, path: '/admin/users' },
        { name: 'Sponsors & Ads', icon: <Heart size={20} />, path: '/admin/sponsors' },
        { name: 'Pricing & Coupons', icon: <Tag size={20} />, path: '/admin/pricing' },
        { name: 'Partners', icon: <Handshake size={20} />, path: '/admin/partners' },
    ];

    return (
        <div className="w-64 bg-zinc-950 border-r border-white/5 min-h-screen fixed left-0 top-0 pt-32 p-4 flex flex-col gap-2 z-40">
            <div className="mb-8 px-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f82506]">Control Panel</span>
            </div>
            {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm uppercase tracking-wider ${isActive
                                ? 'bg-[#f82506] text-white'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {item.icon}
                        {item.name}
                    </Link>
                );
            })}
            <div className="mt-auto pb-8">
                <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors">
                    <ChevronLeft size={16} /> Back to Site
                </Link>
            </div>
        </div>
    );
};

export default AdminSidebar;
