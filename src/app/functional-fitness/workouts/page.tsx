import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Dumbbell, Zap } from 'lucide-react';
import { JsonLd, getBreadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: "Functional Fitness Workouts & 11 Station Standards | Athlion",
  description: "Complete guide to Athlion's 11 physical challenge stations: 2KM Run, Mudgar Swings, Sled Push, Burpee Broad Jump, Farmer Carry, Wall Balls, and Ice Pool finish.",
  alternates: {
    canonical: "https://www.athlion.in/functional-fitness/workouts",
  },
  openGraph: {
    title: "Functional Fitness Workouts & 11 Station Standards | Athlion",
    description: "Master movement standards, weight standards, and workout programming for Athlion's 11 fitness racing stations.",
    url: "https://www.athlion.in/functional-fitness/workouts",
    siteName: "Athlion",
    type: "article",
  },
};

const stationDetails = [
  { name: "Station 1: 2KM Run", distance: "2km total", muscles: "Cardiovascular, Legs", tip: "Maintain Zone 3 pace; don't sprint early." },
  { name: "Station 2: Mudgar Ritual", distance: "50 reps total", muscles: "Shoulders, Grip, Core", tip: "Engage your core to maintain a smooth 360° swing arc." },
  { name: "Station 3: Sled Push", distance: "50m", muscles: "Quadriceps, Glutes, Calves", tip: "Keep hips low and drive with straight arms against the upright poles." },
  { name: "Station 4: Monkey Crawl", distance: "30m", muscles: "Full Body, Agility", tip: "Stay low to the ground and maintain a rhythmic 4-point gait." },
  { name: "Station 5: Burpee Broad Jump", distance: "80m (8x10m)", muscles: "Chest, Legs, Cardio", tip: "Chest must touch the floor on every rep before jumping explosively forward." },
  { name: "Station 6: Tire Flip", distance: "10 flips", muscles: "Posterior Chain, Traps", tip: "Lift from hips and knees rather than bending your back." },
  { name: "Station 7: Farmer's Carry", distance: "100m", muscles: "Grip, Upper Back, Core", tip: "Stand tall, pull shoulders back, and take fast short strides." },
  { name: "Station 8: Wall Ball Shots", distance: "30 reps", muscles: "Legs, Shoulders, Core", tip: "Squat below parallel before driving up and catching on the rebound." },
  { name: "Station 9: Low Mud Crawl", distance: "30m", muscles: "Core, Deltoids, Grit", tip: "Keep elbows close to your torso and crawl underneath obstacle netting." },
  { name: "Station 10: 20ft Net Trap", distance: "1 ascent", muscles: "Full Body, Mental Grit", tip: "Use foot hooks to maintain steady climbing balance." },
  { name: "Station 11: Ice Pool Slide", distance: "10m wade", muscles: "Mindset & Recovery", tip: "Control your breath upon entry to settle the shock response." },
];

export default function FunctionalFitnessWorkoutsPage() {
  const baseUrl = "https://www.athlion.in";

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 bg-black text-white px-4">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: `${baseUrl}/` },
          { name: "Functional Fitness", url: `${baseUrl}/functional-fitness` },
          { name: "Workouts & Stations", url: `${baseUrl}/functional-fitness/workouts` },
        ])}
      />

      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#f82506]/10 border border-[#f82506]/30 text-[#f82506] text-xs font-black uppercase tracking-[0.3em] mb-4">
            STATION STANDARDS & WORKOUTS
          </span>
          <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-tight">
            ATHLION <span className="text-[#f82506]">11 STATIONS GUIDE</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Comprehensive breakdown of movement standards, distance specs, and efficiency tips for all 11 race stations.
          </p>
        </header>

        {/* Stations Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {stationDetails.map((st, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-[#f82506] uppercase tracking-widest block mb-1">Station 0{i + 1}</span>
                <h2 className="text-xl font-black italic uppercase mb-3">{st.name}</h2>
                <div className="space-y-1 text-xs text-gray-400 mb-4">
                  <p><strong className="text-white">Spec/Rep:</strong> {st.distance}</p>
                  <p><strong className="text-white">Target Muscles:</strong> {st.muscles}</p>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-300">
                <strong className="text-[#f82506]">Pro Tip:</strong> {st.tip}
              </div>
            </div>
          ))}
        </div>

        {/* Sample Workout Routines */}
        <section className="mb-16 glass-card p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl md:text-3xl font-black italic uppercase mb-6 text-center">
            FEATURED ATHLETIC <span className="text-[#f82506]">WORKOUT ROUTINES</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-zinc-950/80 rounded-2xl border border-white/5">
              <span className="text-xs font-black text-green-500 uppercase tracking-widest block mb-2">Level 1: Beginner</span>
              <h3 className="text-lg font-black italic uppercase mb-3">The Engine Builder</h3>
              <ul className="text-xs text-gray-300 space-y-2">
                <li>• 400m Run</li>
                <li>• 15 Wall Balls</li>
                <li>• 20m Sled Push</li>
                <li>• 400m Run</li>
                <li>• 3 Rounds total</li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-950/80 rounded-2xl border border-white/5">
              <span className="text-xs font-black text-amber-500 uppercase tracking-widest block mb-2">Level 2: Intermediate</span>
              <h3 className="text-lg font-black italic uppercase mb-3">Compromised Split</h3>
              <ul className="text-xs text-gray-300 space-y-2">
                <li>• 800m Run</li>
                <li>• 50m Farmer Carry</li>
                <li>• 30 Burpee Broad Jumps</li>
                <li>• 800m Run</li>
                <li>• 4 Rounds total</li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-950/80 rounded-2xl border border-white/5">
              <span className="text-xs font-black text-[#f82506] uppercase tracking-widest block mb-2">Level 3: Elite</span>
              <h3 className="text-lg font-black italic uppercase mb-3">Full Stadium Race Sim</h3>
              <ul className="text-xs text-gray-300 space-y-2">
                <li>• 2KM Continuous Run</li>
                <li>• All 11 Stations back-to-back</li>
                <li>• Target Time: Under 60 mins</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer Link Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-white/10">
          <Link href="/functional-fitness/training" className="text-gray-400 hover:text-white font-bold text-sm uppercase">
            ← Training Guide
          </Link>
          <Link href="/events" className="btn-primary px-6 py-3 text-xs font-black uppercase italic flex items-center gap-2">
            View Race Calendar <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
