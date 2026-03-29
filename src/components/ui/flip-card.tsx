'use client';

import { cn } from '@/lib/utils';
import { ArrowRight, Code2, Copy, Rocket, Zap } from 'lucide-react';
import { useState } from 'react';
import React from 'react';
import Link from 'next/link';

export interface CardFlipProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  color?: string;
  icon?: React.ReactNode;
  detail?: string;
  href?: string;
}

export default function CardFlip({
  title = 'Build MVPs Fast',
  subtitle = 'Launch your idea in record time',
  description = 'Copy, paste, customize—and launch your MVP faster than ever with our developer-first component library.',
  features = [
    'Copy & Paste Ready',
    'Developer-First',
    'MVP Optimized',
    'Zero Setup Required',
  ],
  color = '#f82506',
  icon,
  detail = 'Explore',
  href = '#'
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  React.useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  const handleInteraction = () => {
    if (isTouchDevice) setIsFlipped(!isFlipped);
  };

  return (
    <div
      style={{
        ['--primary' as any]: color ?? '#2563eb',
      }}
      className="group relative h-[420px] md:h-[450px] w-full max-w-[400px] [perspective:2000px] mx-auto cursor-pointer"
      onMouseEnter={() => !isTouchDevice && setIsFlipped(true)}
      onMouseLeave={() => !isTouchDevice && setIsFlipped(false)}
      onClick={handleInteraction}
    >
      <div
        className={cn(
          'relative h-full w-full',
          '[transform-style:preserve-3d]',
          'transition-transform duration-[800ms] ease-in-out',
          isFlipped
            ? '[transform:rotateY(180deg)]'
            : '[transform:rotateY(0deg)]',
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(0deg)] [backface-visibility:hidden]',
            'overflow-hidden rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8',
            'bg-zinc-950 border border-white/10',
            'shadow-2xl transition-all duration-700',
            'group-hover:shadow-[0_0_50px_rgba(248,37,6,0.2)] group-hover:border-primary/40',
            'flex flex-col justify-between'
          )}
        >
          {/* Rich Background Gradients */}
          <div className="absolute top-0 right-0 -m-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-black/60 z-0" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-zinc-950/90 to-transparent z-0" />

          {/* Upper Content - Huge Icon */}
          <div className="relative z-10 pt-2 flex justify-center">
             <div
                  className={cn(
                    'h-20 w-20 md:h-28 md:w-28 rounded-2xl md:rounded-3xl',
                    'bg-gradient-to-br from-primary/40 to-black/60',
                    'border border-primary/30 backdrop-blur-xl',
                    'flex items-center justify-center',
                    'shadow-[0_20px_40px_rgba(248,37,6,0.3)]',
                    'transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary/50'
                  )}
                >
                  {icon ? React.cloneElement(icon as React.ReactElement<any>, { className: 'h-10 w-10 md:h-12 md:w-12 text-primary' }) : <Rocket className="h-10 w-10 md:h-12 md:w-12 text-primary animate-pulse" />}
             </div>
          </div>

          {/* Bottom content - Descriptive front */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full border border-primary/30 backdrop-blur-md">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#f82506]">{detail}</span>
            </div>
            
            <div className="space-y-0.5 md:space-y-1">
                <h3 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">
                    {title}
                </h3>
                <p className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-bold text-primary transition-colors">
                    {subtitle}
                </p>
            </div>

            <p className="text-[10px] md:text-[11px] text-gray-400 font-medium leading-relaxed max-w-[250px] mx-auto mt-1 md:mt-2 line-clamp-2 md:line-clamp-none">
                Master the standards of the ATHLiON ecosystem. Access exclusive benefits as an affiliated partner.
            </p>

            <div className="mt-3 md:mt-4 inline-flex items-center gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary border border-primary/30 rounded-full px-4 py-1.5 md:py-2 bg-primary/5 hover:bg-primary/20 transition-all">
                VIEW DETAILS <ArrowRight size={12} className="animate-pulse" />
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(180deg)] [backface-visibility:hidden]',
            'rounded-[2rem] p-5 md:p-8',
            'bg-zinc-950 border border-primary/20 text-white',
            'shadow-2xl flex flex-col',
            'transition-all duration-700 pointer-events-auto',
            'group-hover:border-primary/40',
          )}
        >
          {/* Strong back gradient */}
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/15 via-black to-zinc-950" />

          <div className="relative z-10 flex-1 flex flex-col">
            <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-primary/50 shadow-lg shadow-primary/30">
                    {icon ? React.cloneElement(icon as React.ReactElement<any>, { className: 'h-4 w-4 md:h-5 md:w-5 text-white' }) : <Code2 className="h-4 w-4 md:h-5 md:w-5 text-white" />}
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-white">
                  {title}
                </h3>
            </div>
            
            <p className="text-xs md:text-sm font-medium tracking-wide text-gray-400 leading-relaxed italic border-l-2 border-primary pl-4 mb-5 md:mb-6 line-clamp-3 md:line-clamp-none">
                {description}
            </p>

            <div className="space-y-2.5 md:space-y-3 flex-1 overflow-y-auto hide-scrollbar">
              {features.map((feature, index) => {
                const icons = [Copy, Code2, Rocket, Zap];
                const IconComponent = icons[index % icons.length];

                return (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-xs md:text-sm text-gray-300 transition-all duration-500"
                    style={{
                      transform: isFlipped ? 'translateX(0)' : 'translateX(-10px)',
                      opacity: isFlipped ? 1 : 0,
                      transitionDelay: `${index * 100 + 100}ms`,
                    }}
                  >
                    <div className="flex h-5 w-5 md:h-6 md:w-6 flex-shrink-0 items-center justify-center rounded-md bg-primary/20 border border-primary/30 shadow-sm">
                      <IconComponent className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary" />
                    </div>
                    <span className="font-bold uppercase tracking-wider text-[10px] md:text-xs text-gray-300">{feature}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-[90] mt-4 border-t border-white/10 pt-4">
            <Link href={href} className="block w-full">
              <button
                className={cn(
                  'group/start w-full relative',
                  'flex items-center justify-between',
                  'rounded-xl py-2.5 md:py-3 px-4 md:px-5',
                  'transition-all duration-300',
                  'bg-zinc-800 backdrop-blur-md',
                  'hover:bg-primary',
                  'hover:scale-[1.02] cursor-pointer',
                  'border border-transparent hover:border-white/20 shadow-xl',
                )}
              >
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white transition-colors duration-300">
                  Explore Now
                </span>
                <div className="group/icon relative">
                  <ArrowRight className="text-white relative z-10 h-3 w-3 md:h-4 md:w-4 transition-all duration-300 group-hover/start:translate-x-1" />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
