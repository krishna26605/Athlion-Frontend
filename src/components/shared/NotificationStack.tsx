'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck } from 'lucide-react';

const NAMES = ['Rahul', 'Anjali', 'Vikram', 'Priya', 'Amit', 'Sneha', 'Arjun', 'Deepa', 'Karan', 'Ishani', 'Siddharth', 'Meera'];
const LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];

export default function NotificationStack() {
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const id = Date.now();
            const name = NAMES[Math.floor(Math.random() * NAMES.length)];
            const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

            const newNotif = { id, name, location };
            setNotifications(prev => [...prev, newNotif]);

            // Remove notification after 5 seconds
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, 5000);
        }, 60000); // Every 60 seconds as requested

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-8 left-8 z-[100] pointer-events-none space-y-4">
            <AnimatePresence>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        className="glass-card p-4 flex items-center gap-4 bg-black/80 border-[#f82506]/30 shadow-[0_0_20px_rgba(248,37,6,0.1)] min-w-[280px]"
                    >
                        <div className="w-10 h-10 bg-[#f82506]/20 rounded-full flex items-center justify-center text-[#f82506]">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <p className="text-white text-xs font-black italic uppercase tracking-tight">
                                {n.name} FROM {n.location}
                            </p>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                                JUST REGISTERED FOR ATHLION
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 h-full w-1 bg-[#f82506] opacity-50" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
