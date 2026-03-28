'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Trophy, Dumbbell, Move, Zap, 
    RefreshCcw, Briefcase, ArrowUpCircle, 
    Footprints, CircleDot, Wind, ArrowRight,
    Search, Info, History, Target, Activity,
    RotateCw, LucideIcon
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
    {
        id: 'Start',
        name: '1km Run',
        description: 'Opening sprint to spread field',
        distanceReps: '1km',
        muscleGroup: 'Cardio, Legs',
        culturalRoots: 'Standard hybrid race opener',
        icon: Activity,
        image: '/images/stations/run_1km.png'
    },
    {
        id: 1,
        name: 'Mudgar Ritual',
        description: '360° mace swings in controlled pattern',
        distanceReps: '20 reps each direction (40 total)',
        muscleGroup: 'Shoulders, Grip, Core rotation',
        culturalRoots: 'Ancient Indian warrior training',
        icon: RotateCw,
        image: '/images/stations/mudgar_ritual.png'
    },
    {
        id: 2,
        name: 'Balance Beam',
        description: 'Traverse narrow beam (6" wide) without falling',
        distanceReps: '20m length',
        muscleGroup: 'Core, Stabilizers, Focus',
        culturalRoots: 'Gymnastics/Mallakhamb influence',
        icon: Target,
        image: '/images/stations/balance_beam.png'
    },
    {
        id: 3,
        name: 'Sled Push',
        description: 'Drive weighted sled on turf/ground',
        distanceReps: '50m',
        muscleGroup: 'Legs, Power, Mental grit',
        culturalRoots: 'ATHLiON-proven staple',
        icon: ArrowUpCircle,
        image: '/images/stations/sled_push.png'
    },
    {
        id: 4,
        name: 'Sled Pull',
        description: 'Rope-drag weighted sled backward',
        distanceReps: '50m',
        muscleGroup: 'Back, Arms, Endurance',
        culturalRoots: 'ATHLiON-proven staple',
        icon: RefreshCcw,
        image: '/images/stations/sled_pull.png'
    },
    {
        id: 5,
        name: 'Monkey Bar Traverse',
        description: 'Horizontal ladder crossing (no swinging)',
        distanceReps: '15m length',
        muscleGroup: 'Grip, Lats, Core',
        culturalRoots: 'OCR classic',
        icon: Move,
        image: '/images/stations/monkey_bar.png'
    },
    {
        id: 6,
        name: 'Burpee Broad Jump',
        description: 'Burpee → explosive forward jump',
        distanceReps: '80m total (10m x 8 reps)',
        muscleGroup: 'Full body, Cardio',
        culturalRoots: 'Functional fitness standard',
        icon: Zap,
        image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop'
    },
    {
        id: 7,
        name: 'Tire Flip',
        description: 'Lift and flip heavy tractor tire',
        distanceReps: '10 flips (20m total)',
        muscleGroup: 'Posterior chain, Power',
        culturalRoots: 'Bootcamp trend',
        icon: Dumbbell,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 8,
        name: 'Low Crawl',
        description: 'Army crawl under netting/barbed wire',
        distanceReps: '30m',
        muscleGroup: 'Core, Shoulders, Grit',
        culturalRoots: 'Military/OCR staple',
        icon: Move,
        image: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 9,
        name: 'Farmer\'s Carry',
        description: 'Heavy kettlebell/dumbbell walk',
        distanceReps: '100m (50m out/back)',
        muscleGroup: 'Grip, Traps, Core',
        culturalRoots: 'Functional fitness essential',
        icon: Briefcase,
        image: 'https://images.unsplash.com/photo-1541534741688-6078c6422736?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 10,
        name: 'Height Net Trap',
        description: 'Climb 12ft cargo net, descend other side',
        distanceReps: '1 ascent/descent',
        muscleGroup: 'Full body, Fear conquer',
        culturalRoots: 'OCR signature',
        icon: ArrowUpCircle,
        image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 11,
        name: 'Sandbag Lunges',
        description: 'Walking lunges with sandbag on shoulders',
        distanceReps: '100m',
        muscleGroup: 'Legs, Stability, Grind',
        culturalRoots: 'ATHLiON-style load carry',
        icon: Footprints,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 12,
        name: 'Wall Ball',
        description: 'Squat + throw medicine ball to target',
        distanceReps: '30 reps (9kg men / 6kg women)',
        muscleGroup: 'Legs, Power, Accuracy',
        culturalRoots: 'CrossFit-proven, measurable',
        icon: CircleDot,
        image: 'https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?q=80&w=1887&auto=format&fit=crop'
    },
    {
        id: 13,
        name: 'Ice Pool Obstacle',
        description: 'Submerge and traverse ice water channel',
        distanceReps: '10m wade + 2min immersion',
        muscleGroup: 'Mental fortitude, Recovery',
        culturalRoots: 'ATHLiON signature',
        icon: Wind,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'
    }
];

interface AthlionInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AthlionInfoModal({ isOpen, onClose }: AthlionInfoModalProps) {
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-6xl bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[80vh]"
                    >
                        {/* Left Side: Station List */}
                        <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-black/40">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
                                <div>
                                    <h2 className="text-xl font-black italic uppercase tracking-tighter">ATHLiON <span className="text-[#f82506]">STATIONS</span></h2>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Master the ritual</p>
                                </div>
                                <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="flex-grow overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
                                {stations.map((station) => (
                                    <button
                                        key={station.id}
                                        onClick={() => setSelectedStation(station)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all group ${
                                            selectedStation?.id === station.id 
                                            ? 'bg-[#f82506] text-white shadow-lg shadow-[#f82506]/20' 
                                            : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-xl bg-zinc-900 group-hover:scale-110 transition-transform ${
                                            selectedStation?.id === station.id ? 'bg-white/20' : ''
                                        }`}>
                                            <station.icon size={16} />
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <p className="text-[7px] font-black uppercase opacity-60 truncate">Station {station.id}</p>
                                            <p className="font-bold italic uppercase tracking-tight text-xs truncate">{station.name}</p>
                                        </div>
                                        <ArrowRight size={12} className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${
                                            selectedStation?.id === station.id ? 'opacity-100' : ''
                                        }`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Station Detail & Image */}
                        <div className="w-full md:w-3/4 flex flex-col bg-zinc-900/20 overflow-hidden relative">
                            {/* Close Button Desktop */}
                            <button 
                                onClick={onClose} 
                                className="hidden md:flex absolute top-6 right-6 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-[#f82506] transition-all z-50 shadow-xl"
                            >
                                <X size={20} />
                            </button>

                            <AnimatePresence mode="wait">
                                {selectedStation ? (
                                    <motion.div
                                        key={selectedStation.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col md:flex-row overflow-hidden"
                                    >
                                        {/* Station Details */}
                                        <div className="w-full md:w-1/2 p-8 md:p-12 space-y-8 overflow-y-auto custom-scrollbar">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-[#f82506] flex items-center justify-center text-white shadow-lg shadow-[#f82506]/20 font-black italic text-xl">
                                                        <selectedStation.icon size={32} />
                                                    </div>
                                                    <div>
                                                        <span className="text-[#f82506] font-black uppercase tracking-[0.2em] text-[10px]">ATHLiON CHALLENGE</span>
                                                        <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">{selectedStation.name}</h3>
                                                    </div>
                                                </div>
                                                <p className="text-lg text-gray-300 font-medium italic border-l-4 border-[#f82506] pl-6 py-2 bg-white/[0.02]">
                                                    {selectedStation.description}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="glass-card p-6 border-white/5 bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                                                    <div className="flex items-center gap-3 mb-2 text-[#f82506]">
                                                        <Trophy size={14} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Target</span>
                                                    </div>
                                                    <p className="text-sm font-black italic uppercase text-white">{selectedStation.distanceReps}</p>
                                                </div>
                                                <div className="glass-card p-6 border-white/5 bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                                                    <div className="flex items-center gap-3 mb-2 text-[#f82506]">
                                                        <Dumbbell size={14} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Muscle Group</span>
                                                    </div>
                                                    <p className="text-sm font-black italic uppercase text-white">{selectedStation.muscleGroup}</p>
                                                </div>
                                            </div>

                                            <div className="glass-card p-8 border-[#f82506]/20 bg-[#f82506]/5 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                                    <History size={100} />
                                                </div>
                                                <div className="flex items-center gap-3 mb-4 text-[#f82506]">
                                                    <Info size={16} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Roots & Origin</span>
                                                </div>
                                                <p className="text-sm text-gray-400 leading-relaxed relative z-10 font-bold italic uppercase">{selectedStation.culturalRoots}</p>
                                            </div>

                                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#f82506] animate-pulse" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">The Ritual of Strength</span>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        const nextIdx = (stations.findIndex(s => s.id === selectedStation.id) + 1) % stations.length;
                                                        setSelectedStation(stations[nextIdx]);
                                                    }}
                                                    className="flex items-center gap-2 text-white hover:text-[#f82506] transition-all font-black uppercase tracking-widest text-[9px] hover:translate-x-1"
                                                >
                                                    NEXT CHALLENGE <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Station Image */}
                                        <div className="w-full md:w-1/2 relative h-[300px] md:h-full overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent z-10 hidden md:block" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10 md:hidden" />
                                            <motion.img
                                                key={`${selectedStation.id}-img`}
                                                initial={{ scale: 1.1, filter: 'blur(10px)' }}
                                                animate={{ scale: 1, filter: 'blur(0px)' }}
                                                transition={{ duration: 0.6 }}
                                                src={selectedStation.image}
                                                alt={selectedStation.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                            />
                                            <div className="absolute bottom-12 left-12 right-12 z-20 space-y-2 opacity-0 md:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl w-fit">
                                                    <p className="text-white text-[10px] font-black uppercase tracking-widest">ATHLiON MEDIA</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-8 bg-black">
                                        <div className="relative">
                                            <div className="absolute inset-0 rounded-full bg-[#f82506]/20 blur-3xl animate-pulse" />
                                            <div className="w-32 h-32 rounded-full bg-zinc-950 flex items-center justify-center border-2 border-[#f82506]/30 animate-vertical-bounce relative z-10 overflow-hidden p-6">
                                                <img src="/FINAL-ATH-LOGO.png" alt="ATHLiON Logo" className="w-full h-full object-contain" />
                                            </div>
                                        </div>
                                        <div className="space-y-4 relative z-10">
                                            <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">ELITE <span className="text-[#f82506]">STATIONS</span></h3>
                                            <p className="text-gray-500 max-w-md mx-auto uppercase text-xs font-bold tracking-[0.2em] leading-relaxed">
                                                Each station is a monument to human endurance. 
                                                Explore the biomechanics and origins behind the ATHLiON rituals.
                                            </p>
                                        </div>
                                        <div className="flex gap-3 justify-center pt-4">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <motion.div 
                                                    key={i} 
                                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                                                    className="w-16 h-1.5 bg-[#f82506] rounded-full" 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(248, 37, 6, 0.5);
                }
                
                @keyframes vertical-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-vertical-bounce {
                    animation: vertical-bounce 4s ease-in-out infinite;
                }
            `}</style>
        </AnimatePresence>
    );
}
