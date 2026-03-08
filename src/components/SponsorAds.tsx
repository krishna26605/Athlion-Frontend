'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface Sponsor {
    _id: string;
    name: string;
    adImages: string[];
    website?: string;
    type: string;
}

const SponsorAds = ({ sponsors }: { sponsors: Sponsor[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const ads = sponsors.flatMap(s => s.adImages.map(img => ({ img, website: s.website, name: s.name })));

    useEffect(() => {
        if (ads.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [ads.length]);

    if (ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    return (
        <div className="relative w-full h-64 md:h-80 rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-950/50 group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute inset-0"
                >
                    <img
                        src={currentAd.img}
                        alt={currentAd.name}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f82506] mb-2">Sponsored Ad</span>
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">{currentAd.name}</h3>
                            </div>
                            {currentAd.website && (
                                <a
                                    href={currentAd.website}
                                    target="_blank"
                                    className="bg-white text-black p-3 rounded-xl hover:bg-[#f82506] hover:text-white transition-all shadow-xl"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dots */}
            {ads.length > 1 && (
                <div className="absolute top-8 right-8 flex gap-1.5">
                    {ads.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-[#f82506]' : 'w-2 bg-white/20'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SponsorAds;
