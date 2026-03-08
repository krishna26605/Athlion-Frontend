'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/client';
import AdminSidebar from '@/components/AdminSidebar';
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
        <div className="min-h-screen bg-black flex">
            <AdminSidebar />
            <div className="flex-1 ml-64 p-12 pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-[#f82506] font-black uppercase tracking-[0.3em] text-xs mb-4 block">Management</span>
                            <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2 leading-none">
                                Registered <span className="text-white">Users</span>
                            </h1>
                            <p className="text-gray-400">View and manage all members of the Athlion platform.</p>
                        </div>

                        <div className="relative w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-[#f82506]/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="glass-card overflow-hidden border-white/5">
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

                        {filteredUsers.length === 0 && (
                            <div className="p-20 text-center">
                                <Search size={40} className="mx-auto text-zinc-800 mb-4" />
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No users found matching your search.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
