import { useState, useEffect } from 'react';

export const CenturionLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const duration = 3500;
    const interval = 50;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    // Turn head to profile view at 2.5s
    const turnTimer = setTimeout(() => {
      setShowProfile(true);
    }, 2500);

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, duration - 500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
      clearTimeout(turnTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center transition-opacity duration-500 ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
       {/* Pixel Background Effect */}
       <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="w-full h-full" style={{ 
           backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', 
           backgroundSize: '20px 20px',
           color: 'var(--muted-foreground)'
         }}></div>
       </div>

       {/* Helmet Container */}
       <div className="mb-8 relative w-32 h-32">
         {/* Front View - Strict/Aggressive Spartan Style */}
         <div className={`absolute inset-0 transition-all duration-500 transform ${showProfile ? 'opacity-0 scale-90 rotate-y-90' : 'opacity-100 scale-100 rotate-y-0'}`} style={{ backfaceVisibility: 'hidden' }}>
           <svg viewBox="0 0 16 16" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
             {/* Crest */}
             <rect x="7" y="1" width="2" height="1" className="fill-foreground" />
             <rect x="6" y="2" width="4" height="1" className="fill-foreground" />
             <rect x="5" y="3" width="6" height="1" className="fill-foreground" />
             
             {/* Helmet Main Shape */}
             <path d="M4 4h8v9h-1v2h-1v-2h-4v2h-1v-2h-1v-9z" className="fill-foreground" />
             
             {/* Eye Slit - T-Shape Visor */}
             <rect x="5" y="7" width="6" height="1" className="fill-background" />
             <rect x="7" y="7" width="2" height="5" className="fill-background" />
           </svg>
         </div>

         {/* Side View - Profile */}
         <div className={`absolute inset-0 transition-all duration-500 transform ${showProfile ? 'opacity-100 scale-100 rotate-y-0' : 'opacity-0 scale-90 -rotate-y-90'}`} style={{ backfaceVisibility: 'hidden' }}>
           <svg viewBox="0 0 16 16" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
             {/* Crest Profile */}
             <rect x="3" y="1" width="8" height="1" className="fill-foreground" />
             <rect x="2" y="2" width="10" height="1" className="fill-foreground" />
             <rect x="2" y="3" width="11" height="1" className="fill-foreground" />
             
             {/* Helmet Profile */}
             <path d="M4 4h7v3h1v5h-1v2h-7z" className="fill-foreground" />
             
             {/* Eye Slit Profile */}
             <rect x="8" y="7" width="4" height="1" className="fill-background" />
           </svg>
         </div>
       </div>
       
       <div className="relative z-10 text-center flex flex-col items-center gap-1">
         <h1 className="text-5xl md:text-7xl font-bold text-foreground font-mono tracking-tighter">
           CENTURION
         </h1>
         <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-mono text-lg tracking-[0.3em] uppercase">Terminal</span>
            <div className="px-2 py-0.5 border border-primary/30 rounded bg-primary/5">
                <span className="text-primary font-mono text-[10px] tracking-wider font-bold">BETA</span>
            </div>
         </div>
       </div>
       
       {/* Progress Bar */}
       <div className="mt-12 w-64 h-1 bg-secondary rounded-full overflow-hidden">
         <div 
           className="h-full bg-primary transition-all duration-100 ease-linear"
           style={{ width: `${progress}%` }}
         />
       </div>
       
       <div className="mt-4 text-muted-foreground/60 font-mono text-xs animate-pulse">
         INITIALIZING SYSTEM...
       </div>
    </div>
  );
};
