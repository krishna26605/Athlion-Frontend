import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Activity, Zap, CheckCircle } from 'lucide-react';
import { JsonLd, getBreadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: "Functional Fitness Training Guide & Preparation Program | Athlion",
  description: "Learn how to train for functional fitness races with Athlion's comprehensive training guide. Master Zone 2 aerobic base running, compromised running workouts, and station endurance splits.",
  alternates: {
    canonical: "https://www.athlion.in/functional-fitness/training",
  },
  openGraph: {
    title: "Functional Fitness Training Guide & Preparation Program | Athlion",
    description: "Master functional fitness training with Athlion's structured preparation guide for runners and fitness athletes in India.",
    url: "https://www.athlion.in/functional-fitness/training",
    siteName: "Athlion",
    type: "article",
  },
};

export default function FunctionalFitnessTrainingPage() {
  const baseUrl = "https://www.athlion.in";

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 bg-black text-white px-4">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: `${baseUrl}/` },
          { name: "Functional Fitness", url: `${baseUrl}/functional-fitness` },
          { name: "Training Guide", url: `${baseUrl}/functional-fitness/training` },
        ])}
      />

      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#f82506]/10 border border-[#f82506]/30 text-[#f82506] text-xs font-black uppercase tracking-[0.3em] mb-4">
            OFFICIAL TRAINING GUIDE
          </span>
          <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-tight">
            HOW TO TRAIN FOR <span className="text-[#f82506]">FUNCTIONAL FITNESS RACES</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            A science-backed guide to building endurance, leg power, grip stamina, and compromised running capacity for your race.
          </p>
        </header>

        {/* Core Pillars */}
        <section className="space-y-8 mb-16">
          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-black italic uppercase text-[#f82506] mb-3">Pillar 1: Aerobic Base (Zone 2 Running)</h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              50% of fitness race performance depends on your running efficiency. Dedicate 2 to 3 sessions per week to easy Zone 2 cardiovascular runs (60-70% max heart rate) to expand mitochondrial capacity and clear lactic acid effortlessly during station transitions.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-black italic uppercase text-[#f82506] mb-3">Pillar 2: Compromised Running</h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Compromised running is the skill of running with heavy, fatigued legs immediately after performing high-intensity stations like heavy sled pushes or wall ball reps. Practice running 500m intervals right after 30 burpees or sled pushes.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-black italic uppercase text-[#f82506] mb-3">Pillar 3: Functional Strength & Grip Stamina</h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Develop core anti-rotation, trap endurance, and grip strength through heavy farmer walks, mace swings, and overhead wall ball repetitions.
            </p>
          </div>
        </section>

        {/* 4-Week Sample Training Split Table */}
        <section className="mb-16 glass-card p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl font-black italic uppercase mb-6 text-center">RECOMMENDED WEEKLY TRAINING SPLIT</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300 border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[#f82506] font-black uppercase text-xs">
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Focus</th>
                  <th className="py-3 px-4">Workout Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-3 px-4 font-bold">Monday</td>
                  <td className="py-3 px-4 text-white">Strength & Station Tech</td>
                  <td className="py-3 px-4">Heavy Sled Push, Farmers Carry, Mudgar Swings</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Tuesday</td>
                  <td className="py-3 px-4 text-white">Zone 2 Aerobic Run</td>
                  <td className="py-3 px-4">5KM continuous easy run @ conversational pace</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Wednesday</td>
                  <td className="py-3 px-4 text-white">Active Recovery</td>
                  <td className="py-3 px-4">Mobility, stretching, light walk</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Thursday</td>
                  <td className="py-3 px-4 text-white">Compromised Run Intervals</td>
                  <td className="py-3 px-4">4x (400m Run + 20 Burpee Broad Jumps + 20 Wall Balls)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Friday</td>
                  <td className="py-3 px-4 text-white">Full Body Endurance</td>
                  <td className="py-3 px-4">Ski Erg / Row intervals + Grip work</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Saturday</td>
                  <td className="py-3 px-4 text-white">Simulation Circuit</td>
                  <td className="py-3 px-4">Athlion 11-station mini race simulation</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Sunday</td>
                  <td className="py-3 px-4 text-white">Rest & Cold Recovery</td>
                  <td className="py-3 px-4">Full rest day, ice bath immersion</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Back Link */}
        <div className="flex justify-between items-center pt-8 border-t border-white/10">
          <Link href="/functional-fitness" className="text-gray-400 hover:text-white font-bold text-sm uppercase">
            ← Back to Functional Fitness Hub
          </Link>
          <Link href="/functional-fitness/workouts" className="btn-primary px-6 py-3 text-xs font-black uppercase italic flex items-center gap-2">
            Explore Workouts & Stations <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
