'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Zap, Users, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const sponsors = [
    { name: 'Sponsor 1', logo: 'S1' },
    { name: 'Sponsor 2', logo: 'S2' },
    { name: 'Sponsor 3', logo: 'S3' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(248,37,6,0.15),transparent_70%)] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#f82506]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f82506] text-xs font-black uppercase tracking-[0.3em] mb-6">
              INDIA'S PREMIER FITNESS RACE
            </span>
            <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none mb-6">
              ARE YOU <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">ATHLION?</span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-10 leading-relaxed uppercase font-black italic">
              The standardized format of fitness racing hits India. 8KM RUN. 8 WORKOUTS. NO LIMITS.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/events" className="btn-primary flex items-center gap-2 group text-lg px-8 py-4 uppercase">
                FIND YOUR RACE
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {!user ? (
                <>
                  <Link href="/register" className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-all text-lg font-bold uppercase italic">
                    REGISTER AS USER
                  </Link>
                  <Link href="/admin" className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-all text-lg font-bold uppercase italic text-gray-500 hover:text-white">
                    ADMIN LOGIN
                  </Link>
                </>
              ) : (
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="px-8 py-4 rounded-full bg-[#f82506] text-white hover:scale-105 transition-all text-lg font-black uppercase italic shadow-[0_0_30px_rgba(248,37,6,0.3)]"
                >
                  {user.role === 'admin' ? 'GO TO ADMIN PANEL' : 'GO TO DASHBOARD'}
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sponsor Banner (Static Placeholder for now) */}
        <div className="absolute bottom-32 w-full overflow-hidden bg-white/5 backdrop-blur-md py-4 border-y border-white/5">
          <div className="flex animate-marquee gap-12 items-center justify-center whitespace-nowrap">
            {sponsors.map((s, i) => (
              <span key={i} className="text-2xl font-black italic text-gray-600 uppercase opacity-30 px-12">{s.name}</span>
            ))}
            {sponsors.map((s, i) => (
              <span key={i + 10} className="text-2xl font-black italic text-gray-600 uppercase opacity-30 px-12">{s.name}</span>
            ))}
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SCROLL</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#f82506] to-transparent" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-zinc-950/50 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-12">WHAT IS <span className="text-[#f82506]">ATHLION?</span></h2>
          <p className="text-gray-400 text-xl leading-relaxed mb-8">
            Athlion is India's answer to the global fitness racing revolution. We bring a standardized format that combines elite-level endurance with functional strength. Whether you're a first-timer or a pro, Athlion tests your heart, grit, and physical power in a high-octane stadium environment.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 font-black italic uppercase italic">
            <div className="flex flex-col gap-2"><span className="text-4xl text-[#f82506]">8KM</span><span className="text-xs text-gray-600">Total Running</span></div>
            <div className="flex flex-col gap-2"><span className="text-4xl text-[#f82506]">8</span><span className="text-xs text-gray-600">Workouts</span></div>
            <div className="flex flex-col gap-2"><span className="text-4xl text-[#f82506]">1</span><span className="text-xs text-gray-600">Winner</span></div>
            <div className="flex flex-col gap-2"><span className="text-4xl text-[#f82506]">ALL</span><span className="text-xs text-gray-600">ATHLETES</span></div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black italic uppercase italic">WHO <span className="text-[#f82506]">WE ARE</span></h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-4">Gym Partners & Run Clubs Affiliated with Athlion</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="text-[#f82506]" />, title: 'GYM PARTNERS', desc: 'Local gyms across India equipped with Athlion training standards.', href: '/sponsors' },
              { icon: <Users className="text-[#f82506]" />, title: 'RUN CLUBS', desc: 'Join our official run clubs to improve your splits and endurance.', href: '/sponsors' },
              { icon: <Trophy className="text-[#f82506]" />, title: 'SPONSORS', desc: 'World-class brands powering the fitness performance of tomorrow.', href: '/sponsors' }
            ].map((feature, i) => (
              <Link key={i} href={feature.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 group hover:border-[#f82506]/30 transition-all border-white/5 h-full"
                >
                  <div className="mb-6 p-4 bg-white/5 rounded-2xl inline-block group-hover:bg-[#f82506]/10 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black italic mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm uppercase">{feature.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

