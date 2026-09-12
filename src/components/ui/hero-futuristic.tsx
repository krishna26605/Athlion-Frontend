'use client';

import React, { useState, useEffect, Component, ReactNode } from 'react';
import dynamic from 'next/dynamic';

const TEXTUREMAP = { src: '/images/hero-texture.png' };

const HeroCanvas = dynamic(() => import('./hero-canvas'), {
  ssr: false,
});

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('HeroCanvas rendering failed, falling back to static background:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export const HeroFuturistic = ({ children }: { children?: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const smallScreen = window.innerWidth < 768;
      setIsMobileDevice(mobileUA || smallScreen);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative flex-1 w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-10 flex items-center justify-center w-full h-full pointer-events-none">
        {children}
      </div>

      {/* Static Fallback background (always present as backdrop / fallback) */}
      <div 
        className="absolute inset-0 z-0 bg-black opacity-60 transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${TEXTUREMAP.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Subtle glowing overlay simulating the futuristic scanner/pulse */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f82506]/10 via-transparent to-[#f82506]/10 animate-pulse duration-[8000ms]" />
      </div>

      {isMounted && !isMobileDevice && (
        <CanvasErrorBoundary>
          <HeroCanvas />
        </CanvasErrorBoundary>
      )}

      <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-t from-black via-transparent to-black" />
      <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-r from-black via-transparent to-black opacity-80" />
      {/* Dark overlay mask for better text readability */}
      <div className="absolute inset-0 z-[6] pointer-events-none bg-black/60 backdrop-blur-[2px]" />
    </div>
  );
};

export default HeroFuturistic;
