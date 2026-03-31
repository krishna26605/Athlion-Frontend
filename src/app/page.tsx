'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Zap, Users, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AthlionStationsSection from '@/components/AthlionStationsSection';
import CardFlip from '@/components/ui/flip-card';
import { useState, useEffect } from 'react';
import { HeroFuturistic } from '@/components/ui/hero-futuristic';
import apiClient from '@/api/client';

export default function Home() {
  const { user } = useAuth();
  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('sponsors')
      .then(res => setSponsors(res.data.data || res.data))
      .catch(console.error);
  }, []);



  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}

      <section className="relative h-screen h-dvh w-full flex flex-col">
        <HeroFuturistic>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-50 text-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f82506] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6">
                INDIA'S PREMIER FITNESS RACE
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black italic tracking-tighter leading-none mb-4 md:mb-6">
                ARE YOU <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">ATHLION?</span>
              </h1>
              <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-lg lg:text-xl mb-8 md:mb-[10vh] leading-relaxed uppercase font-black italic px-4 md:px-0">
                The standardized format of fitness racing hits India. 1KM RUN. 13 STATIONS. NO LIMITS.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 px-4 md:px-0">
                <Link href="/events" className="btn-primary flex items-center justify-center gap-2 group text-base md:text-lg px-6 md:px-8 py-3 md:py-4 uppercase w-full sm:w-auto">
                  FIND YOUR RACE
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Link>

                {!user ? (
                  <Link href="/register" className="px-6 md:px-8 py-3 md:py-4 rounded-full border border-white/20 hover:bg-white/5 transition-all text-base md:text-lg font-bold uppercase italic text-center w-full sm:w-auto">
                    REGISTER AS USER
                  </Link>
                ) : (
                  <Link
                    href={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-[#f82506] text-white hover:scale-105 transition-all text-base md:text-lg font-black uppercase italic shadow-[0_0_30px_rgba(248,37,6,0.3)] text-center w-full sm:w-auto"
                  >
                    {user.role === 'admin' ? 'GO TO ADMIN PANEL' : 'GO TO DASHBOARD'}
                  </Link>
                )}
              </div>
            </motion.div>

          </div>
        </HeroFuturistic>

        {/* Dynamic Sponsor Flow Strip */}
        <div className="w-full overflow-hidden bg-[#0a0a0a] border-y border-white/5 py-4 md:py-6 z-40 relative flex-shrink-0">
          <div className="flex animate-marquee gap-8 md:gap-12 items-center min-w-max">
            {[...sponsors, ...sponsors, ...sponsors, ...sponsors, { name: 'ATHLION' }, { name: 'HYROX' }].map((s, i) => (
              <Link key={i} href="/sponsors" className="hover:scale-105 transition-transform">
                <span className="text-lg md:text-2xl font-black italic text-gray-500 uppercase px-4 md:px-8 opacity-50 whitespace-nowrap leading-normal py-1 pr-4">
                  {s?.name || 'PARTNER'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-8 md:mb-12">WHAT IS <span className="text-[#f82506]">ATHLION?</span></h2>
          <p className="text-gray-400 text-base md:text-xl leading-relaxed mb-6 md:mb-8 px-2">
            Athlion is India's answer to the global fitness racing revolution. We bring a standardized format that combines elite-level endurance with functional strength. Whether you're a first-timer or a pro, Athlion tests your heart, grit, and physical power in a high-octane stadium environment.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-12 md:mt-16 font-black italic uppercase">
            <div className="flex flex-col gap-1 md:gap-2"><span className="text-3xl md:text-4xl text-[#f82506]">1KM</span><span className="text-[10px] md:text-xs text-gray-600">Total Running</span></div>
            <div className="flex flex-col gap-1 md:gap-2"><span className="text-3xl md:text-4xl text-[#f82506]">13</span><span className="text-[10px] md:text-xs text-gray-600">Stations</span></div>
            <div className="flex flex-col gap-1 md:gap-2"><span className="text-3xl md:text-4xl text-[#f82506]">1</span><span className="text-[10px] md:text-xs text-gray-600">Winner</span></div>
            <div className="flex flex-col gap-1 md:gap-2"><span className="text-3xl md:text-4xl text-[#f82506]">550+</span><span className="text-[10px] md:text-xs text-gray-600">ATHLETES</span></div>
          </div>
        </div>
      </section>

      <AthlionStationsSection />

      {/* Partners Section */}
      <section className="py-16 md:py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#f82506]/5 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#f82506]/5 rounded-full blur-[80px] md:blur-[120px] translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-20">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#f82506] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs mb-3 md:mb-4 block"
            >
              OUR ECOSYSTEM
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
              WHO <span className="text-[#f82506]">WE ARE</span>
            </h2>
            <div className="w-16 md:w-24 h-1 bg-[#f82506] mx-auto mt-4 md:mt-6 mb-6 md:mb-8 rounded-full shadow-[0_0_10px_rgba(248,37,6,0.5)]" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] md:text-xs max-w-xl mx-auto leading-relaxed px-4">
              ATHLiON is more than a race. It&apos;s a nationwide network of elite gym partners, run clubs, and premium sponsors powering the next generation of Indian athletes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 items-stretch">
            {[
              {
                icon: <Zap className="text-[#f82506]" />,
                title: 'GYM PARTNERS',
                desc: 'Local gyms across India equipped with Athlion standards.',
                href: '/sponsors',
                detail: '20+ Cities'
              },
              {
                icon: <Users className="text-[#f82506]" />,
                title: 'RUN CLUBS',
                desc: 'Join official run clubs to improve your splits.',
                href: '/sponsors',
                detail: '5000+ Runners'
              },
              {
                icon: <Trophy className="text-[#f82506]" />,
                title: 'SPONSORS',
                desc: 'World-class brands powering fitness tomorrow.',
                href: '/sponsors',
                detail: 'Global Brands'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex justify-center w-full"
              >
                <CardFlip
                  title={feature.title}
                  subtitle={feature.desc}
                  description="Become an integral part of the ATHLiON ecosystem. Access exclusive benefits and tools by affiliating with us."
                  features={['Certified Support', 'Official Equipment', 'Global Network', 'Dedicated Dashboard']}
                  color="#f82506"
                  icon={React.cloneElement(feature.icon as React.ReactElement<any>, { className: 'h-10 w-10 text-[#f82506]' })}
                  detail={feature.detail}
                  href={feature.href}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
