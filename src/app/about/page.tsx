import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Trophy, Zap, Users, ArrowRight } from 'lucide-react';
import { JsonLd, getBreadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: "About Athlion | India's Premier Fitness Racing Series",
  description: "Learn about Athlion: India's premier hybrid sports and fitness competition platform. Discover our mission, standardized race format, safety protocols, and ecosystem.",
  alternates: {
    canonical: "https://www.athlion.in/about",
  },
  openGraph: {
    title: "About Athlion | India's Premier Fitness Racing Series",
    description: "Discover Athlion's vision to revolutionize hybrid athletic performance and functional fitness racing across India.",
    url: "https://www.athlion.in/about",
    siteName: "Athlion",
    type: "website",
  },
};

export default function AboutPage() {
  const baseUrl = "https://www.athlion.in";

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 bg-black text-white px-4">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: `${baseUrl}/` },
          { name: "About Us", url: `${baseUrl}/about` },
        ])}
      />

      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#f82506]/10 border border-[#f82506]/30 text-[#f82506] text-xs font-black uppercase tracking-[0.3em] mb-4">
            OUR STORY & VISION
          </span>
          <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-tight">
            ABOUT <span className="text-[#f82506]">ATHLION</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Athlion is India&apos;s premier standardized fitness racing series—combining elite endurance, functional strength, and community athletic passion.
          </p>
        </header>

        {/* Mission Statement */}
        <section className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 mb-12">
          <h2 className="text-2xl md:text-4xl font-black italic uppercase mb-4 text-[#f82506]">OUR MISSION</h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            Athlion was founded with a singular objective: to elevate functional fitness racing in India to global standards. We provide everyday fitness enthusiasts, runners, gym-goers, and elite athletes with a measurable, stadium-scale racing environment where grit, endurance, and physical mastery are celebrated.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <Trophy className="text-[#f82506] shrink-0" size={24} />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-200">Standardized Format</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#f82506] shrink-0" size={24} />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-200">Safety & Integrity</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-[#f82506] shrink-0" size={24} />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-200">Nationwide Ecosystem</span>
            </div>
          </div>
        </section>

        {/* E-E-A-T Quality Pillars */}
        <section className="space-y-6 mb-12">
          <h2 className="text-2xl md:text-3xl font-black italic uppercase text-center mb-8">
            WHY ATHLETES TRUST <span className="text-[#f82506]">ATHLION</span>
          </h2>

          <div className="p-6 bg-zinc-950/60 rounded-2xl border border-white/5">
            <h3 className="text-lg font-black italic uppercase mb-2 text-white">Standardized 11-Station Challenge</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every Athlion event adheres strictly to verified distance, movement, and weight metrics, allowing athletes to measure their performance and progress across multiple cities and seasons.
            </p>
          </div>

          <div className="p-6 bg-zinc-950/60 rounded-2xl border border-white/5">
            <h3 className="text-lg font-black italic uppercase mb-2 text-white">Certified Gym Partners & Run Clubs</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We collaborate with premier gym facilities and running organizations across 20+ Indian cities to ensure participants have local access to official equipment, sleds, wall balls, and certified coaches.
            </p>
          </div>

          <div className="p-6 bg-zinc-950/60 rounded-2xl border border-white/5">
            <h3 className="text-lg font-black italic uppercase mb-2 text-white">Athlete Safety & Professional Officiating</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Medical teams, hydration checkpoints, and trained judges monitor every station and wave to guarantee safety, rulebook enforcement, and timing accuracy.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/events" className="btn-primary px-8 py-4 text-sm font-black italic uppercase flex items-center justify-center gap-2">
            Explore Events <ArrowRight size={16} />
          </Link>
          <Link href="/contact" className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 text-sm font-bold uppercase italic text-center">
            Contact Support & Inquiries
          </Link>
        </div>
      </div>
    </div>
  );
}
