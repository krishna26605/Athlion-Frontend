'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/client';

import { Loader2, Search, Mail, Phone, Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';
import { formatDate } from '@/utils/utils';
import { motion } from 'framer-motion';

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await apiClient.get('admin/users');
            setUsers(res.data.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (authLoading || loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Loader2 className="animate-spin text-[#f82506]" size={40} />
        </div>
    );

    return (
        <>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-end gap-4 mb-6 md:mb-12">
                        

                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3.5 md:py-4 pl-11 md:pl-12 pr-6 text-sm outline-none focus:border-[#f82506]/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Mobile Card List */}
                    <div className="md:hidden space-y-3">
                        {filteredUsers.map((u) => (
                            <div key={u._id} className="glass-card p-4 border-white/5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-[#f82506] shrink-0">
                                        <UserIcon size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-black italic uppercase tracking-tight text-sm truncate">{u.name}</div>
                                        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">ID: {u._id.slice(-6)}</div>
                                    </div>
                                    <span className={`ml-auto px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider shrink-0 ${u.role === 'admin' ? 'bg-[#f82506]/10 text-[#f82506]' : 'bg-zinc-800 text-gray-400'}`}>
                                        {u.role}
                                    </span>
                                </div>
                                <div className="space-y-1 text-[10px]">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Mail size={10} className="text-gray-600" /> {u.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Phone size={10} className="text-gray-600" /> {u.phone || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block glass-card overflow-hidden border-white/5">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] bg-white/[0.02]">
                                    <th className="py-6 pl-8">User Details</th>
                                    <th className="py-6">Contact Info</th>
                                    <th className="py-6">Joined Date</th>
                                    <th className="py-6">Role</th>
                                    <th className="py-6 pr-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-6 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-[#f82506]">
                                                    <UserIcon size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-black italic uppercase tracking-tight text-lg">{u.name}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-0.5">ID: {u._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                                                    <Mail size={14} className="text-gray-600" /> {u.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Phone size={14} className="text-gray-600" /> {u.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-400 font-bold">
                                                <CalendarIcon size={14} className="text-gray-600" /> {formatDate(u.createdAt)}
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-[#f82506]/10 text-[#f82506]' : 'bg-zinc-800 text-gray-400'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-6 pr-8 text-right">
                                            <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">View Profile</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="p-12 md:p-20 text-center glass-card md:glass-card-none border-white/5">
                            <Search size={32} className="mx-auto text-zinc-800 mb-4" />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">No users found matching your search.</p>
                        </div>
                    )}
                </motion.div>
            </>
);
}
