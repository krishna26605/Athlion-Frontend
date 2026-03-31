'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Trophy, Dumbbell, Move, Zap,
    RefreshCcw, Briefcase, ArrowUpCircle,
    Footprints, CircleDot, Wind, ArrowRight,
    Search, Info, History, Target, Activity,
    RotateCw, LucideIcon, ChevronLeft, ChevronRight
} from 'lucide-react';

interface Station {
    id: string | number;
    name: string;
    description: string;
    distanceReps: string;
    muscleGroup: string;
    culturalRoots: string;
    icon: LucideIcon;
    image: string;
}

const stations: Station[] = [
    { id: 'Start', name: '1km Run', description: 'Opening sprint to spread field', distanceReps: '1km', muscleGroup: 'Cardio, Legs', culturalRoots: 'Standard hybrid race opener', icon: Activity, image: '/images/stations/run_1km.png' },
    { id: 1, name: 'Mudgar Ritual', description: '360° mace swings in controlled pattern', distanceReps: '25 reps each direction (50 total)', muscleGroup: 'Shoulders, Grip, Core rotation', culturalRoots: 'Ancient Indian warrior training', icon: RotateCw, image: '/images/stations/mudgar_ritual.png' },
    { id: 2, name: 'Balance Beam', description: 'Traverse narrow beam (6" wide) without falling', distanceReps: '20m length', muscleGroup: 'Core, Stabilizers, Focus', culturalRoots: 'Gymnastics/Mallakhamb influence', icon: Target, image: '/images/stations/balance_beam.png' },
    { id: 3, name: 'Sled Push', description: 'Drive weighted sled on turf/ground', distanceReps: '50m', muscleGroup: 'Legs, Power, Mental grit', culturalRoots: 'ATHLiON-proven staple', icon: ArrowUpCircle, image: '/images/stations/sled_push.png' },
    { id: 4, name: 'Sled Pull', description: 'Rope-drag weighted sled backward', distanceReps: '50m', muscleGroup: 'Back, Arms, Endurance', culturalRoots: 'ATHLiON-proven staple', icon: RefreshCcw, image: '/images/stations/sled_pull.png' },
    { id: 5, name: 'Monkey Bar Traverse', description: 'Horizontal ladder crossing (no swinging)', distanceReps: '15m length', muscleGroup: 'Grip, Lats, Core', culturalRoots: 'OCR classic', icon: Move, image: '/images/stations/monkey_bar.png' },
    { id: 6, name: 'Burpee Broad Jump', description: 'Burpee → explosive forward jump', distanceReps: '80m total (10m x 8 reps)', muscleGroup: 'Full body, Cardio', culturalRoots: 'Functional fitness standard', icon: Zap, image: '/images/stations/burpee_broad_jump.png' },
    { id: 7, name: 'Tire Flip', description: 'Lift and flip heavy tractor tire', distanceReps: '10 flips (20m total)', muscleGroup: 'Posterior chain, Power', culturalRoots: 'Bootcamp trend', icon: Dumbbell, image: '/images/stations/tire_flip.png' },
    { id: 8, name: "Farmer's Carry", description: 'Heavy kettlebell/dumbbell walk', distanceReps: '100m (50m out/back)', muscleGroup: 'Grip, Traps, Core', culturalRoots: 'Functional fitness essential', icon: Briefcase, image: '/images/stations/farmers_carry.png' },
    { id: 9, name: 'Height Net Trap', description: 'Climb 12ft cargo net, descend other side', distanceReps: '1 ascent/descent', muscleGroup: 'Full body, Fear conquer', culturalRoots: 'OCR signature', icon: ArrowUpCircle, image: '/images/stations/HIghtrap.png' },
    { id: 10, name: 'Sandbag Lunges', description: 'Walking lunges with sandbag on shoulders', distanceReps: '100m', muscleGroup: 'Legs, Stability, Grind', culturalRoots: 'ATHLiON-style load carry', icon: Footprints, image: '/images/stations/sandbag_lunges.png' },
    { id: 11, name: 'Wall Ball', description: 'Squat + throw medicine ball to target', distanceReps: '30 reps (9kg men / 6kg women)', muscleGroup: 'Legs, Power, Accuracy', culturalRoots: 'CrossFit-proven, measurable', icon: CircleDot, image: '/images/stations/wall_ball.png' },
    { id: 12, name: 'Low Mud Crawl', description: 'Army crawl under netting/barbed wire', distanceReps: '30m', muscleGroup: 'Core, Shoulders, Grit', culturalRoots: 'Military/OCR staple', icon: Move, image: '/images/stations/mud-crawl.png' },
    { id: 13, name: 'Ice Plunge', description: 'Submerge and traverse ice water channel', distanceReps: '10m wade + 2min immersion', muscleGroup: 'Mental fortitude, Recovery', culturalRoots: 'ATHLiON signature', icon: Wind, image: '/images/stations/ice-plunge.png' },
];

export default function AthlionStationsSection() {
    const [selectedStation, setSelectedStation] = useState<Station>(stations[0]);
    const [isHovered, setIsHovered] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setSelectedStation((current) => {
                const currentIndex = stations.findIndex(s => s.id === current.id);
                const nextIndex = (currentIndex + 1) % stations.length;
                return stations[nextIndex];
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [isHovered]);

    // Scroll selected station into view on mobile (manual container scroll only)
    useEffect(() => {
        if (scrollRef.current) {
            const selectedIdx = stations.findIndex(s => s.id === selectedStation.id);
            const buttons = scrollRef.current.querySelectorAll<HTMLButtonElement>('[data-station-btn]');
            const selectedButton = buttons[selectedIdx];

            if (selectedButton) {
                const container = scrollRef.current;
                const scrollLeft = selectedButton.offsetLeft - (container.offsetWidth / 2) + (selectedButton.offsetWidth / 2);
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [selectedStation]);

    return (
        <section id="stations" className="py-16 md:py-24 bg-[#050505] border-y border-white/5 relative z-10 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-3 md:mb-4">ATHLiON <span className="text-[#f82506]">CHALLENGES</span></h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-3 md:mt-4">Master the ritual. Explore the 8 challenges.</p>
                </div>

                <div className="flex justify-center w-full">
                    <motion.div
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={() => setIsHovered(true)}
                        onTouchEnd={() => setTimeout(() => setIsHovered(false), 5000)}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full max-w-6xl bg-black border border-white/10 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[70vh] md:h-[75vh]"
                    >
                        {/* Mobile: Horizontal scrollable station chips */}
                        <div className="md:hidden flex-shrink-0 border-b border-white/10 bg-black">
                            <div className="p-3 border-b border-white/10 bg-zinc-900/50">
                                <h2 className="text-sm font-black italic uppercase tracking-tighter">ATHLiON <span className="text-[#f82506]">CHALLENGES</span></h2>
                            </div>
                            <div ref={scrollRef} className="flex overflow-x-auto gap-2 p-3 hide-scrollbar scroll-smooth">
                                {stations.map((station) => (
                                    <button
                                        key={station.id}
                                        data-station-btn
                                        onClick={() => setSelectedStation(station)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap flex-shrink-0 text-xs font-bold ${selectedStation?.id === station.id
                                            ? 'bg-[#f82506] text-white shadow-lg shadow-[#f82506]/20'
                                            : 'bg-white/5 text-gray-400'
                                            }`}
                                    >
                                        <station.icon size={14} />
                                        <span className="truncate max-w-[100px]">{station.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Desktop: Station List (sidebar) */}
                        <div className="hidden md:flex w-1/4 border-r border-white/10 flex-col bg-black">
                            <div className="p-6 border-b border-white/10 flex flex-col bg-zinc-900/50">
                                <h2 className="text-xl font-black italic uppercase tracking-tighter">ATHLiON <span className="text-[#f82506]">CHALLENGES</span></h2>
                            </div>
                            <div className="flex-grow overflow-y-auto p-3 space-y-1.5 custom-scrollbar bg-black">
                                {stations.map((station) => (
                                    <button
                                        key={station.id}
                                        onClick={() => setSelectedStation(station)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all group ${selectedStation?.id === station.id
                                            ? 'bg-[#f82506] text-white shadow-lg shadow-[#f82506]/20'
                                            : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-xl bg-zinc-900 group-hover:scale-110 transition-transform ${selectedStation?.id === station.id ? 'bg-white/20' : ''}`}>
                                            <station.icon size={16} />
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <p className="text-[7px] font-black uppercase opacity-60 truncate">Station {station.id}</p>
                                            <p className="font-bold italic uppercase tracking-tight text-xs truncate">{station.name}</p>
                                        </div>
                                        <ArrowRight size={12} className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${selectedStation?.id === station.id ? 'opacity-100' : ''}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Station Detail & Image */}
                        <div className="flex-1 flex flex-col bg-zinc-900/20 overflow-hidden relative">
                            <AnimatePresence mode="wait">
                                {selectedStation && (
                                    <motion.div
                                        key={selectedStation.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute inset-0 z-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${selectedStation.image})` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                {selectedStation && (
                                    <motion.div
                                        key={selectedStation.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: 0.1 }}
                                        className="relative z-10 flex flex-col h-full justify-end p-5 md:p-8 lg:p-12 text-white"
                                    >
                                        <div className="mb-3 md:mb-4 inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 w-fit">
                                            <selectedStation.icon size={12} className="text-[#f82506]" />
                                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Station {selectedStation.id}</span>
                                        </div>

                                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black italic uppercase tracking-tighter mb-2 md:mb-4 drop-shadow-lg">
                                            {selectedStation.name}
                                        </h3>

                                        <p className="text-sm md:text-lg lg:text-xl text-gray-300 mb-4 md:mb-8 max-w-2xl font-medium tracking-wide drop-shadow-md line-clamp-2 md:line-clamp-none">
                                            {selectedStation.description}
                                        </p>

                                        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-2 md:mb-4">
                                            <div className="p-3 md:p-4 bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10">
                                                <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2 text-[#f82506]">
                                                    <Target size={12} />
                                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Dist/Reps</span>
                                                </div>
                                                <p className="font-bold italic uppercase tracking-tight text-[10px] md:text-sm text-gray-200 truncate">{selectedStation.distanceReps}</p>
                                            </div>

                                            <div className="p-3 md:p-4 bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10">
                                                <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2 text-[#f82506]">
                                                    <Activity size={12} />
                                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Muscles</span>
                                                </div>
                                                <p className="font-bold italic uppercase tracking-tight text-[10px] md:text-sm text-gray-200 truncate">{selectedStation.muscleGroup}</p>
                                            </div>

                                            <div className="p-3 md:p-4 bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10">
                                                <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2 text-[#f82506]">
                                                    <History size={12} />
                                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Roots</span>
                                                </div>
                                                <p className="font-bold italic uppercase tracking-tight text-[10px] md:text-sm text-gray-200 truncate">{selectedStation.culturalRoots}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
