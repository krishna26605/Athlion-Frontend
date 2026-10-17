'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    RotateCw,
    ArrowUpCircle,
    Move,
    Zap,
    Dumbbell,
    Briefcase,
    Wind,
    Trophy,
    Target,
    Compass,
    Play,
    Pause,
    Maximize2,
    X,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Users,
    Flame,
    Navigation,
    Info,
    Shield,
    LucideIcon
} from 'lucide-react';

interface Zone {
    id: string;
    index: number;
    title: string;
    subtitle: string;
    category: 'run' | 'station' | 'finish' | 'village';
    badge: string;
    description: string;
    distanceReps: string;
    targetMuscles: string;
    tacticalTip: string;
    icon: LucideIcon;
    color: string; // Hex color for glow
    // Coordinates for SVG viewBox="0 0 816 1024"
    hotspot: {
        type: 'rect' | 'polygon' | 'path';
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        rx?: number;
        points?: string;
        d?: string;
        labelPos: { x: number; y: number };
    };
}

const zones: Zone[] = [
    {
        id: 'run-loop',
        index: 0,
        title: 'Start Line & 1km Run Loop',
        subtitle: 'The Hybrid Engine Opener',
        category: 'run',
        badge: 'COURSE OPENER',
        description:
            'Every racer launches from the yellow Start Arch into the standardized 1km outer loop. Athletes complete 1 full lap before peeling off at the "IN" gate for Station 1.',
        distanceReps: '1km Loop (8 Laps Total)',
        targetMuscles: 'Aerobic Engine, Calves, Mental Pace',
        tacticalTip: 'Pace your threshold early. Do not redline on Lap 1 before Mudgar swings.',
        icon: Navigation,
        color: '#fbbf24',
        hotspot: {
            type: 'path',
            d: 'M 380 110 L 460 110 C 495 110, 502 135, 502 180 L 502 720 C 502 770, 450 775, 380 775 C 280 775, 235 770, 235 720 L 235 180 C 235 125, 275 110, 360 110',
            labelPos: { x: 388, y: 110 }
        }
    },
    {
        id: 'mudgar-ritual',
        index: 1,
        title: 'Station 1: Mudgar Ritual',
        subtitle: 'Ancient Mace Mastery',
        category: 'station',
        badge: 'STATION 01',
        description:
            'Athlion’s signature traditional opener. Controlled 360° swings with heavy traditional Indian clubs (Mudgars) taxing shoulders and rotational core stamina.',
        distanceReps: '25 Reps Each Direction (50 Total)',
        targetMuscles: 'Shoulders, Forearm Grip, Core Rotation',
        tacticalTip: 'Drive momentum from your hips and brace your thoracic spine throughout.',
        icon: RotateCw,
        color: '#f82506',
        hotspot: {
            type: 'rect',
            x: 247,
            y: 161,
            width: 204,
            height: 40,
            rx: 6,
            labelPos: { x: 349, y: 181 }
        }
    },
    {
        id: 'balance-beam',
        index: 2,
        title: 'Station 2: Balance Beam',
        subtitle: 'Precision Under High Heart Rate',
        category: 'station',
        badge: 'STATION 02',
        description:
            'A true test of proprioception and nervous system regulation. Traverse elevated, narrow beams immediately following heart-rate spiking runs without stepping off.',
        distanceReps: 'Full Traverse (2 Lanes)',
        targetMuscles: 'Ankle Stabilizers, Core Balance, Focus',
        tacticalTip: 'Fix your gaze 2 meters ahead on the beam rather than looking directly down.',
        icon: Activity,
        color: '#f59e0b',
        hotspot: {
            type: 'rect',
            x: 264,
            y: 207,
            width: 146,
            height: 40,
            rx: 6,
            labelPos: { x: 337, y: 227 }
        }
    },
    {
        id: 'sled-push',
        index: 3,
        title: 'Station 03: Sled Push',
        subtitle: 'Pure Leg Drive & Lactic Burn',
        category: 'station',
        badge: 'STATION 03',
        description:
            'Drive a weighted steel sled across high-friction turf. Requires maximum forward torso lean and relentless explosive leg drive.',
        distanceReps: '50m Push (Weighted)',
        targetMuscles: 'Quadriceps, Glutes, Calves, Mindset',
        tacticalTip: 'Keep arms fully extended and lock your shoulders to transmit 100% force into the handles.',
        icon: ArrowUpCircle,
        color: '#f82506',
        hotspot: {
            type: 'rect',
            x: 265,
            y: 252,
            width: 177,
            height: 88,
            rx: 6,
            labelPos: { x: 353, y: 296 }
        }
    },
    {
        id: 'sled-pull',
        index: 4,
        title: 'Station 04: Sled Pull',
        subtitle: 'Posterior Chain Grip Grit',
        category: 'station',
        badge: 'STATION 04',
        description:
            'Seated or standing backward drag utilizing heavy nautical rope. Demands explosive lat engagement, forearm endurance, and posterior chain tension.',
        distanceReps: '50m Hand-Over-Hand Drag',
        targetMuscles: 'Lats, Rhomboids, Biceps, Hamstrings',
        tacticalTip: 'Squat low into a stable athletic stance and use hand-over-hand rhythm without resting.',
        icon: Dumbbell,
        color: '#f82506',
        hotspot: {
            type: 'rect',
            x: 265,
            y: 348,
            width: 177,
            height: 36,
            rx: 6,
            labelPos: { x: 353, y: 366 }
        }
    },
    {
        id: 'monkey-bar',
        index: 5,
        title: 'Station 05: Monkey Bar Traverse',
        subtitle: 'Upper Body Suspension Rig',
        category: 'station',
        badge: 'STATION 05',
        description:
            'Suspension obstacle requiring athletes to traverse heavy steel rungs over the arena floor. Tests grip endurance when forearms are already saturated with lactic acid.',
        distanceReps: '30m Rig Traverse',
        targetMuscles: 'Grip Strength, Lats, Shoulder Girdle',
        tacticalTip: 'Maintain a gentle swing tempo so kinetic momentum carries you from rung to rung.',
        icon: Move,
        color: '#f82506',
        hotspot: {
            type: 'rect',
            x: 265,
            y: 384,
            width: 177,
            height: 54,
            rx: 6,
            labelPos: { x: 353, y: 411 }
        }
    },
    {
        id: 'farmers-carry',
        index: 6,
        title: 'Station 06 & 08: Farmer’s Carry Loop',
        subtitle: 'Relentless Load Carriage',
        category: 'station',
        badge: 'STATION 06 & 08',
        description:
            'Hoist dual heavy dumbbells or kettlebells and march through the designated lower turning loop (2N markers) and arena carry sector without dropping.',
        distanceReps: '100m Carry Loop',
        targetMuscles: 'Traps, Forearms, Core Anti-Lateral Flexion',
        tacticalTip: 'Shoulders back, ribs pulled down, take quick short rhythmic strides.',
        icon: Briefcase,
        color: '#f97316',
        hotspot: {
            type: 'rect',
            x: 278,
            y: 534,
            width: 109,
            height: 58,
            rx: 6,
            labelPos: { x: 332, y: 563 }
        }
    },
    {
        id: 'tire-flip',
        index: 7,
        title: 'Station 7: Tire Flip (Hyrox Thunderdome)',
        subtitle: 'The Stadium Centerpiece',
        category: 'station',
        badge: 'STATION 07',
        description:
            'Centerstage inside the Hyrox Thunderdome arena zone! Deadlift and explosively propel heavy industrial tractor tires across the combat lane under the stadium lights.',
        distanceReps: '10 Heavy Tire Flips (20m Lane)',
        targetMuscles: 'Glutes, Hamstrings, Chest, Hip Extension',
        tacticalTip: 'Drive chest firmly into the tire and explode up with knees and hips in one fluid surge.',
        icon: Flame,
        color: '#f82506',
        hotspot: {
            type: 'rect',
            x: 256,
            y: 452,
            width: 132,
            height: 74,
            rx: 6,
            labelPos: { x: 322, y: 489 }
        }
    },
    {
        id: 'sandbag-lunges',
        index: 8,
        title: 'Station 10: Sandbag Lunges',
        subtitle: 'Crushing Lower-Body Endurance',
        category: 'station',
        badge: 'STATION 10',
        description:
            'Shoulder a 20kg–30kg sandbag and execute continuous walking lunges through the inner lane. Knee touches the turf on every repetition for full standardization.',
        distanceReps: '30m Walking Lunges',
        targetMuscles: 'Quadriceps, Gluteus Medius, Core Stability',
        tacticalTip: 'Keep torso upright to prevent the sandbag shifting backward and taxing lower back.',
        icon: Dumbbell,
        color: '#f82506',
        hotspot: {
            type: 'rect',
            x: 278,
            y: 594,
            width: 109,
            height: 42,
            rx: 6,
            labelPos: { x: 332, y: 615 }
        }
    },
    {
        id: 'mud-crawl',
        index: 9,
        title: 'Station 12: Low Mud Crawl',
        subtitle: 'Military Grade Primal Crawl',
        category: 'station',
        badge: 'STATION 12',
        description:
            'The penultimate ritual. Get low and army crawl beneath military netting and wire through the authentic muddy obstacle pit before the sprint to glory.',
        distanceReps: '30m Low Trench Crawl',
        targetMuscles: 'Deltoids, Hip Flexors, Deep Abdominals',
        tacticalTip: 'Slither like a reptile—keep hips hugging the earth to clear low netting cords.',
        icon: Move,
        color: '#f82506',
        hotspot: {
            type: 'rect',
            x: 278,
            y: 647,
            width: 109,
            height: 56,
            rx: 6,
            labelPos: { x: 332, y: 675 }
        }
    },
    {
        id: 'ice-plunge',
        index: 10,
        title: 'Ice Plunge Recovery Pools',
        subtitle: 'Sub-Zero Cryo Immersion',
        category: 'station',
        badge: 'RECOVERY SHOCK',
        description:
            'Dual cryo ice pools located in the eastern inner sector. Athletes brave freezing sub-zero ice water to trigger vascular reset and mental resilience.',
        distanceReps: '2-Minute Immersion / Ice Dip',
        targetMuscles: 'Vascular System, Vagus Nerve, Recovery',
        tacticalTip: 'Control slow exhales to master the initial cold shock and calm the heart rate.',
        icon: Wind,
        color: '#06b6d4',
        hotspot: {
            type: 'rect',
            x: 400,
            y: 602,
            width: 58,
            height: 82,
            rx: 6,
            labelPos: { x: 429, y: 643 }
        }
    },
    {
        id: 'finish-line',
        index: 11,
        title: 'Finish Line & Ceremony Stage',
        subtitle: 'The Moment of Glory',
        category: 'finish',
        badge: 'GLORY & PODIUM',
        description:
            'Pass under the illuminated yellow Finish Arch adjacent to the Thunderdome, lock your official chip time, and ascend the Ceremony Stage for the medal ritual.',
        distanceReps: 'Official Chip Timing Mat & Podium',
        targetMuscles: 'Final Anaerobic Kick, Champion Spirit',
        tacticalTip: 'Empty the tank on the final 100m straightaway into the finish chute.',
        icon: Trophy,
        color: '#fbbf24',
        hotspot: {
            type: 'rect',
            x: 388,
            y: 478,
            width: 44,
            height: 80,
            rx: 6,
            labelPos: { x: 410, y: 518 }
        }
    },
    {
        id: 'arena-village',
        index: 12,
        title: 'Athlion Hub & Arena Village',
        subtitle: 'The Athlete & Spectator Ecosystem',
        category: 'village',
        badge: 'ARENA HUBS',
        description:
            'Comprehensive event infrastructure: Dedicated Recovery Lounge (by Rocktape), VIP & Founders Viewing Galleries, Athlion Hub, Registration, Bag Drop, and Partner Village.',
        distanceReps: 'Full Arena Access & Spectator Arenas',
        targetMuscles: 'Nutrition, Rehydration, Athlete Network',
        tacticalTip: 'Check in at Registration 45 minutes prior to your wave launch.',
        icon: Users,
        color: '#a855f7',
        hotspot: {
            type: 'rect',
            x: 512,
            y: 305,
            width: 226,
            height: 243,
            rx: 8,
            labelPos: { x: 625, y: 426 }
        }
    }
];

export default function AthlionCourseMapSection() {
    const [activeZoneId, setActiveZoneId] = useState<string>('run-loop');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'run' | 'station' | 'village'>('all');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const isManualScrolling = useRef(false);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const activeZone = zones.find((z) => z.id === activeZoneId) || zones[0];

    // Filter zones based on active category
    const filteredZones = zones.filter((z) => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'run') return z.category === 'run';
        if (selectedCategory === 'station') return z.category === 'station' || z.category === 'finish';
        if (selectedCategory === 'village') return z.category === 'village';
        return true;
    });

    // Scroll listener: detect which card is currently in view
    useEffect(() => {
        const handleScroll = () => {
            if (isManualScrolling.current) return;
            const viewportMiddle = window.innerHeight * 0.45;
            let closestId = filteredZones[0]?.id || zones[0].id;
            let minDistance = Infinity;

            filteredZones.forEach((zone) => {
                const el = cardRefs.current[zone.id];
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const elCenter = rect.top + rect.height / 2;
                    const distance = Math.abs(elCenter - viewportMiddle);

                    if (rect.top <= viewportMiddle + 140 && rect.bottom >= viewportMiddle - 140) {
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestId = zone.id;
                        }
                    }
                }
            });

            if (closestId && closestId !== activeZoneId && !isPlaying) {
                setActiveZoneId(closestId);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeZoneId, isPlaying, filteredZones]);

    // Auto-Tour playback timer
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setActiveZoneId((curr) => {
                const currentIndex = zones.findIndex((z) => z.id === curr);
                const nextIndex = (currentIndex + 1) % zones.length;
                const nextZone = zones[nextIndex];

                isManualScrolling.current = true;
                if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
                scrollTimeout.current = setTimeout(() => {
                    isManualScrolling.current = false;
                }, 700);

                // Scroll the card smoothly into view on desktop/laptop
                if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                    const cardEl = cardRefs.current[nextZone.id];
                    if (cardEl) {
                        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }

                return nextZone.id;
            });
        }, 3600);

        return () => clearInterval(interval);
    }, [isPlaying]);

    // Handle manual click on map or card
    const handleSelectZone = (id: string) => {
        setIsPlaying(false);
        setActiveZoneId(id);
        isManualScrolling.current = true;
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            isManualScrolling.current = false;
        }, 700);

        // On desktop/laptop (lg+), scroll the right-hand timeline card into view
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            const cardEl = cardRefs.current[id];
            if (cardEl) {
                cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    const isCurrentActive = (zoneId: string) => activeZoneId === zoneId;
    const isCurrentHovered = (zoneId: string) => hoveredZoneId === zoneId;

    return (
        <section
            id="course-map"
            ref={containerRef}
            className="relative bg-[#020202] text-white border-y border-white/10 overflow-x-clip"
        >
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#f82506]/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px]" />
            </div>

            {/* Header Strip */}
            <div className="max-w-7xl mx-auto px-4 pt-16 md:pt-24 pb-8 md:pb-12 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-[#f82506] animate-ping" />
                    <span className="text-[#f82506] text-[10px] md:text-xs font-black uppercase tracking-[0.25em]">
                        INTERACTIVE ARENA SITE PLAN & COURSE MAP
                    </span>
                </div>

                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
                    SATURDAY NIGHT <span className="text-[#f82506]">ADVENTURE</span>
                </h2>

                <p className="max-w-2xl mx-auto text-gray-400 text-xs md:text-base font-medium tracking-wide uppercase">
                    Central Halls Arena • 1km Hybrid Challenge Course. Scroll down to tour the live arena layout and inspect every ritual zone.
                </p>

                {/* Filter and Tour Bar */}
                <div className="flex items-center gap-2 md:gap-4 mt-6 md:mt-8 overflow-x-auto pb-2 px-1 max-w-full justify-start sm:justify-center hide-scrollbar">
                    {(
                        [
                            { key: 'all', label: 'FULL ARENA' },
                            { key: 'station', label: '11 CHALLENGES' },
                            { key: 'run', label: '1KM RUN LOOP' },
                            { key: 'village', label: 'ATHLETE VILLAGE' }
                        ] as const
                    ).map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setSelectedCategory(cat.key)}
                            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                                selectedCategory === cat.key
                                    ? 'bg-[#f82506] text-white shadow-lg shadow-[#f82506]/30'
                                    : 'bg-white/5 hover:bg-white/10 text-gray-400'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                            isPlaying
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                                : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                        }`}
                    >
                        {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                        {isPlaying ? 'PAUSE TOUR' : 'AUTO TOUR'}
                    </button>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold transition-all border border-white/10"
                        title="Expand Full Arena Map"
                    >
                        <Maximize2 size={13} />
                        <span className="hidden sm:inline">FULLSCREEN</span>
                    </button>
                </div>
            </div>

            {/* Scrollytelling Body: Sticky Map (Mobile: Centered Radar, Desktop: Sticky Map + Scrolling Cards) */}
            <div className="max-w-7xl mx-auto px-4 pb-12 lg:pb-48 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
                    {/* LEFT / TOP STICKY MAP CONTAINER */}
                    <div className="w-full max-w-2xl mx-auto lg:max-w-none lg:col-span-7 lg:sticky lg:top-20 z-30 lg:max-h-[calc(100vh-5.5rem)] flex flex-col">
                        <div className="relative rounded-2xl md:rounded-3xl border border-white/15 bg-zinc-950/90 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col flex-1 min-h-0">
                            {/* Tactical HUD Header */}
                            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-white/10 text-[10px] md:text-xs flex-shrink-0">
                                <div className="flex items-center gap-2 font-mono text-gray-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="font-bold tracking-widest text-gray-200">ARENA MAP</span>
                                  
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 font-mono text-[9px]">
                                        ZONE: {activeZone.badge}
                                    </span>
                                </div>
                            </div>

                            {/* MAP CANVAS WITH SVG OVERLAYS */}
                            <div className="relative w-full aspect-[816/1024] max-h-[60vh] sm:max-h-[68vh] lg:max-h-[calc(100vh-13.5rem)] flex-1 min-h-0 flex items-center justify-center bg-black overflow-hidden select-none">
                                {/* Base Site Plan Map Image */}
                                <img
                                    src="/images/arena-site-plan.jpg"
                                    alt="Athlion Saturday Night Adventure Arena Site Plan"
                                    className="w-full h-full object-contain pointer-events-none transition-transform duration-500"
                                />

                                {/* Interactive SVG Hotspots Overlay Layer */}
                                <svg
                                    viewBox="0 0 816 1024"
                                    className="absolute inset-0 w-full h-full pointer-events-auto"
                                    preserveAspectRatio="xMidYMid meet"
                                >
                                    <defs>
                                        {/* Glow Filter for Active Stations */}
                                        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                                            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
                                            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
                                            <feMerge>
                                                <feMergeNode in="blur2" />
                                                <feMergeNode in="blur1" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>

                                        {/* Run Course Moving Dash Animation */}
                                        <style>{`
                                            @keyframes dashMove {
                                                0% { stroke-dashoffset: 200; }
                                                100% { stroke-dashoffset: 0; }
                                            }
                                            .run-trail-animated {
                                                stroke-dasharray: 14 10;
                                                animation: dashMove 3s linear infinite;
                                            }
                                        `}</style>
                                    </defs>

                                    {/* Vignette Dimming Mask: Dims unselected stations when one is active */}
                                    <rect
                                        x="0"
                                        y="0"
                                        width="816"
                                        height="1024"
                                        fill="black"
                                        className="transition-opacity duration-300 pointer-events-none"
                                        opacity={activeZoneId === 'run-loop' ? 0.15 : 0.45}
                                    />

                                    {/* 1KM RUN LOOP PATH */}
                                    <path
                                        d={zones[0].hotspot.d}
                                        fill="none"
                                        stroke={activeZoneId === 'run-loop' ? '#fbbf24' : 'rgba(255,255,255,0.15)'}
                                        strokeWidth={activeZoneId === 'run-loop' ? 14 : 6}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        filter={activeZoneId === 'run-loop' ? 'url(#neon-glow)' : undefined}
                                        className={`cursor-pointer transition-all duration-300 ${
                                            activeZoneId === 'run-loop' ? 'run-trail-animated' : ''
                                        }`}
                                        onClick={() => handleSelectZone('run-loop')}
                                        onMouseEnter={() => setHoveredZoneId('run-loop')}
                                        onMouseLeave={() => setHoveredZoneId(null)}
                                    />

                                    {/* Hotspot Renderers for all zones */}
                                    {zones.map((zone) => {
                                        if (zone.id === 'run-loop') return null;

                                        const isActive = isCurrentActive(zone.id);
                                        const isHovered = isCurrentHovered(zone.id);
                                        const hs = zone.hotspot;

                                        return (
                                            <g
                                                key={zone.id}
                                                className="cursor-pointer group"
                                                onClick={() => handleSelectZone(zone.id)}
                                                onMouseEnter={() => setHoveredZoneId(zone.id)}
                                                onMouseLeave={() => setHoveredZoneId(null)}
                                            >
                                                {hs.type === 'rect' && (
                                                    <rect
                                                        x={hs.x}
                                                        y={hs.y}
                                                        width={hs.width}
                                                        height={hs.height}
                                                        rx={hs.rx || 4}
                                                        fill={
                                                            isActive
                                                                ? `${zone.color}40`
                                                                : isHovered
                                                                ? `${zone.color}25`
                                                                : 'transparent'
                                                        }
                                                        stroke={
                                                            isActive
                                                                ? zone.color
                                                                : isHovered
                                                                ? '#ffffff'
                                                                : 'rgba(255,255,255,0.2)'
                                                        }
                                                        strokeWidth={isActive ? 4 : isHovered ? 2.5 : 1.2}
                                                        strokeDasharray={isActive ? 'none' : '4 3'}
                                                        filter={isActive ? 'url(#neon-glow)' : undefined}
                                                        className="transition-all duration-300"
                                                    />
                                                )}

                                                {/* Active Target Corner Brackets & Radar Pin */}
                                                {isActive && (
                                                    <g>
                                                        {/* Pulsing epicenter circle */}
                                                        <circle
                                                            cx={hs.labelPos.x}
                                                            cy={hs.labelPos.y}
                                                            r={14}
                                                            fill={`${zone.color}30`}
                                                            stroke={zone.color}
                                                            strokeWidth={2}
                                                            className="animate-ping"
                                                        />
                                                        <circle
                                                            cx={hs.labelPos.x}
                                                            cy={hs.labelPos.y}
                                                            r={6}
                                                            fill={zone.color}
                                                            filter="url(#neon-glow)"
                                                        />
                                                    </g>
                                                )}

                                                {/* Mini Marker Pill on Hover */}
                                                {(isActive || isHovered) && (
                                                    <g pointerEvents="none">
                                                        <rect
                                                            x={hs.labelPos.x - 45}
                                                            y={hs.labelPos.y - 28}
                                                            width={90}
                                                            height={20}
                                                            rx={10}
                                                            fill="#0a0a0a"
                                                            stroke={zone.color}
                                                            strokeWidth={1.5}
                                                        />
                                                        <text
                                                            x={hs.labelPos.x}
                                                            y={hs.labelPos.y - 14}
                                                            textAnchor="middle"
                                                            fill="#ffffff"
                                                            fontSize={8.5}
                                                            fontWeight="900"
                                                            fontFamily="sans-serif"
                                                            letterSpacing="0.05em"
                                                        >
                                                            {zone.badge}
                                                        </text>
                                                    </g>
                                                )}
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Active Zone Floating Callout Tag (Hidden on mobile to keep map clean, visible on sm+) */}
                                <div className="absolute bottom-3 left-3 right-3 hidden sm:flex items-center justify-between gap-2 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 pointer-events-none">
                                    <div className="flex items-center gap-2.5 overflow-hidden">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: `${activeZone.color}25`, color: activeZone.color }}
                                        >
                                            <activeZone.icon size={16} />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 truncate">
                                                {activeZone.badge} • ARENA FOCUS
                                            </p>
                                            <h4 className="text-xs md:text-sm font-black italic uppercase text-white truncate">
                                                {activeZone.title}
                                            </h4>
                                        </div>
                                    </div>
                                    <span
                                        className="text-[10px] font-mono px-2 py-1 rounded font-bold uppercase tracking-wider flex-shrink-0"
                                        style={{ backgroundColor: `${activeZone.color}20`, color: activeZone.color }}
                                    >
                                        {activeZone.distanceReps.split('(')[0]}
                                    </span>
                                </div>
                            </div>

                            {/* Quick Navigation Footer Controls */}
                            <div className="px-4 py-2.5 bg-zinc-950 border-t border-white/10 flex items-center justify-between flex-shrink-0">
                                <button
                                    onClick={() => {
                                        const currIdx = zones.findIndex((z) => z.id === activeZoneId);
                                        const prevIdx = (currIdx - 1 + zones.length) % zones.length;
                                        handleSelectZone(zones[prevIdx].id);
                                    }}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors flex items-center gap-1 text-xs font-bold"
                                >
                                    <ChevronLeft size={16} />
                                    <span className="hidden sm:inline">PREV</span>
                                </button>

                                <div className="flex items-center gap-1.5 overflow-x-auto max-w-[60%] hide-scrollbar py-1">
                                    {zones.map((z, idx) => (
                                        <button
                                            key={z.id}
                                            onClick={() => handleSelectZone(z.id)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all flex-shrink-0 ${
                                                activeZoneId === z.id
                                                    ? 'w-7 bg-[#f82506] shadow-sm shadow-[#f82506]'
                                                    : 'bg-white/20 hover:bg-white/40'
                                            }`}
                                            title={z.title}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        const currIdx = zones.findIndex((z) => z.id === activeZoneId);
                                        const nextIdx = (currIdx + 1) % zones.length;
                                        handleSelectZone(zones[nextIdx].id);
                                    }}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors flex items-center gap-1 text-xs font-bold"
                                >
                                    <span className="hidden sm:inline">NEXT</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SCROLLING TIMELINE / STORY CARDS (Desktop/Laptop only) */}
                    <div className="hidden lg:block lg:col-span-5 space-y-6 pt-2 lg:pt-0">
                        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 mb-2">
                            <p className="text-[11px] font-mono text-gray-400 leading-relaxed uppercase">
                                💡 <strong className="text-white">Pro Tip:</strong> Scroll through the checkpoints below or tap any sector directly on the radar map to inspect the course sequence.
                            </p>
                        </div>

                        {filteredZones.map((zone, idx) => {
                            const isActive = isCurrentActive(zone.id);

                            return (
                                <div
                                    key={zone.id}
                                    ref={(el) => {
                                        cardRefs.current[zone.id] = el;
                                    }}
                                    onClick={() => handleSelectZone(zone.id)}
                                    className={`relative p-6 rounded-2xl md:rounded-3xl border transition-all duration-300 cursor-pointer ${
                                        isActive
                                            ? 'bg-gradient-to-br from-zinc-900/90 via-black to-zinc-950 border-[#f82506] shadow-[0_0_35px_rgba(248,37,6,0.25)] scale-[1.01]'
                                            : 'bg-zinc-950/60 border-white/10 hover:border-white/20 hover:bg-zinc-900/40 opacity-75 hover:opacity-100'
                                    }`}
                                >
                                    {/* Active Highlight Line */}
                                    {isActive && (
                                        <div
                                            className="absolute top-0 left-8 right-8 h-[2px] rounded-full blur-[1px]"
                                            style={{ backgroundColor: zone.color }}
                                        />
                                    )}

                                    {/* Header Badge & Category */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="px-2.5 py-1 rounded-md font-mono text-[10px] font-black uppercase tracking-wider"
                                                style={{
                                                    backgroundColor: `${zone.color}25`,
                                                    color: zone.color,
                                                    border: `1px solid ${zone.color}40`
                                                }}
                                            >
                                                {zone.badge}
                                            </span>
                                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                                STAGE {idx + 1} OF {zones.length}
                                            </span>
                                        </div>

                                        <div
                                            className="w-8 h-8 rounded-xl flex items-center justify-center"
                                            style={{
                                                backgroundColor: isActive ? `${zone.color}20` : 'rgba(255,255,255,0.05)',
                                                color: isActive ? zone.color : '#888'
                                            }}
                                        >
                                            <zone.icon size={16} />
                                        </div>
                                    </div>

                                    {/* Title & Subtitle */}
                                    <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white mb-1">
                                        {zone.title}
                                    </h3>
                                    <p className="text-xs font-semibold text-gray-400 mb-4 tracking-wide">
                                        {zone.subtitle}
                                    </p>

                                    {/* Description */}
                                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 font-normal">
                                        {zone.description}
                                    </p>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="p-3 rounded-xl bg-black/60 border border-white/5">
                                            <div className="flex items-center gap-1.5 text-gray-400 text-[9px] font-mono uppercase mb-1">
                                                <Target size={11} className="text-[#f82506]" />
                                                <span>Workload</span>
                                            </div>
                                            <p className="text-xs md:text-sm font-black italic text-gray-100 truncate">
                                                {zone.distanceReps}
                                            </p>
                                        </div>

                                        <div className="p-3 rounded-xl bg-black/60 border border-white/5">
                                            <div className="flex items-center gap-1.5 text-gray-400 text-[9px] font-mono uppercase mb-1">
                                                <Activity size={11} className="text-[#f82506]" />
                                                <span>Target</span>
                                            </div>
                                            <p className="text-xs md:text-sm font-black italic text-gray-100 truncate">
                                                {zone.targetMuscles.split(',')[0]}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tactical Coach Tip */}
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                                        <Shield size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-[11px] text-gray-400 leading-snug">
                                            <strong className="text-amber-400 font-bold uppercase">Coach Tip:</strong>{' '}
                                            {zone.tacticalTip}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* FULLSCREEN ARENA MAP MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-4 md:p-8"
                    >
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 max-w-7xl mx-auto w-full">
                            <div>
                                <h3 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter">
                                    CENTRAL HALLS ARENA • <span className="text-[#f82506]">EVENT SITE PLAN</span>
                                </h3>
                                <p className="text-xs text-gray-400 uppercase font-mono">
                                    High-Resolution Tactical Course Blueprint
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 flex items-center justify-center p-2 md:p-6 overflow-auto">
                            <img
                                src="/images/arena-site-plan.jpg"
                                alt="High Resolution Central Halls Arena Plan"
                                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/10"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
