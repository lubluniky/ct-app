import { Hero } from "@/components/Hero";
import { Philosophy } from "@/components/Philosophy";
import { Experience } from "@/components/Experience";
import { Ideas } from "@/components/Ideas";
import { Models } from "@/components/Models";
import { Contact } from "@/components/Contact";
import { useState, useEffect, lazy, Suspense } from 'react';

// Lazy load heavy components
const LiquidEther = lazy(() => import("@/components/LiquidEther"));

const Index = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Liquid Ether Background */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
            mouseForce={prefersReducedMotion ? 8 : 15}
            cursorSize={80}
            isViscous={false}
            viscous={15}
            iterationsViscous={prefersReducedMotion ? 4 : 8}
            iterationsPoisson={prefersReducedMotion ? 4 : 8}
            resolution={0.25}
            isBounce={false}
            autoDemo={true}
            autoSpeed={prefersReducedMotion ? 0.3 : 0.5}
            autoIntensity={2.0}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      </div>

      {/* Subtle darkening for text readability */}
      <div 
        className="fixed inset-0 z-[1] bg-black/30" 
        style={{ pointerEvents: 'none' }}
      />

      {/* Content */}
      <div className="relative z-10" style={{ pointerEvents: 'auto' }}>
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-xl font-bold">BORKISS</div>
            <div className="flex gap-8">
              <a href="#philosophy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Philosophy
              </a>
              <a href="#experience" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Experience
              </a>
              <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </a>
              <a href="#connect" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Connect
              </a>
            </div>
          </div>
        </nav>
        
        <Hero />
        <div id="philosophy">
          <Philosophy />
        </div>
        <div id="experience">
          <Experience />
        </div>
        <Ideas />
        <Models />
        <div id="connect">
          <Contact />
        </div>
        
        <footer className="border-t border-border py-8">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 borkiss.trade — All rights reserved
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
