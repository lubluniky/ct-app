import { useState, useEffect } from 'react';

export const CenturionLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [eyeGlow, setEyeGlow] = useState(false);

  useEffect(() => {
    const duration = 4000; // Slightly longer for the full animation sequence
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

    // Turn head to profile view at 1.5s
    const turnTimer = setTimeout(() => {
      setShowProfile(true);
    }, 1500);

    // Activate eye glow at 2.2s
    const glowTimer = setTimeout(() => {
      setEyeGlow(true);
    }, 2200);

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
      clearTimeout(glowTimer);
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

       {/* Helmet Container - Increased Size for Detail */}
       <div className="mb-12 relative w-64 h-64">
         {/* Front View - High Resolution Amex Style */}
         <div className={`absolute inset-0 transition-all duration-700 transform ${showProfile ? 'opacity-0 scale-90 rotate-y-90' : 'opacity-100 scale-100 rotate-y-0'}`} style={{ backfaceVisibility: 'hidden' }}>
           <svg viewBox="0 0 64 64" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
             {/* Crest (Front View) */}
             <rect x="30" y="4" width="4" height="4" className="fill-foreground/90" />
             <rect x="28" y="6" width="8" height="2" className="fill-foreground/90" />
             <rect x="26" y="8" width="12" height="2" className="fill-foreground/80" />
             
             {/* Helmet Dome */}
             <rect x="20" y="10" width="24" height="2" className="fill-foreground" />
             <rect x="18" y="12" width="28" height="4" className="fill-foreground" />
             <rect x="16" y="16" width="32" height="14" className="fill-foreground" />
             
             {/* Brow/Visor Line */}
             <rect x="16" y="20" width="32" height="2" className="fill-background/20" />
             
             {/* Cheek Guards */}
             <rect x="16" y="30" width="8" height="18" className="fill-foreground" />
             <rect x="40" y="30" width="8" height="18" className="fill-foreground" />
             
             {/* Nose Guard (T-Shape) */}
             <rect x="30" y="28" width="4" height="12" className="fill-foreground" />
             <rect x="28" y="28" width="8" height="2" className="fill-foreground" />
             
             {/* Eyes (Darkness) */}
             <rect x="24" y="32" width="4" height="2" className="fill-background/80" />
             <rect x="36" y="32" width="4" height="2" className="fill-background/80" />
             
             {/* Neck/Shoulders */}
             <rect x="22" y="50" width="20" height="4" className="fill-foreground" />
             <rect x="14" y="54" width="36" height="8" className="fill-foreground" />
           </svg>
         </div>

         {/* Side View - High Resolution Amex Profile */}
         <div className={`absolute inset-0 transition-all duration-700 transform ${showProfile ? 'opacity-100 scale-100 rotate-y-0' : 'opacity-0 scale-90 -rotate-y-90'}`} style={{ backfaceVisibility: 'hidden' }}>
           <svg viewBox="0 0 64 64" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
             {/* Circular Border Hint (Coin style) */}
             <path d="M32 2a30 30 0 1 0 30 30A30 30 0 0 0 32 2zm0 2a28 28 0 1 1-28 28A28 28 0 0 1 32 4z" className="fill-foreground/5" />

             {/* Plume (Fan Shape) */}
             <rect x="16" y="8" width="24" height="2" className="fill-foreground/90" />
             <rect x="12" y="10" width="32" height="2" className="fill-foreground/90" />
             <rect x="10" y="12" width="36" height="2" className="fill-foreground/90" />
             <rect x="8" y="14" width="8" height="24" className="fill-foreground/80" /> {/* Tail */}
             
             {/* Helmet Cap */}
             <rect x="16" y="14" width="26" height="2" className="fill-foreground" />
             <rect x="16" y="16" width="28" height="8" className="fill-foreground" />
             
             {/* Visor/Brim */}
             <rect x="36" y="16" width="10" height="2" className="fill-foreground" />
             <rect x="42" y="18" width="4" height="2" className="fill-foreground" />
             
             {/* Face Profile */}
             <rect x="40" y="24" width="4" height="2" className="fill-foreground" /> {/* Brow */}
             <rect x="40" y="26" width="2" height="4" className="fill-foreground" /> {/* Nose bridge */}
             <rect x="42" y="30" width="4" height="2" className="fill-foreground" /> {/* Nose tip */}
             <rect x="40" y="34" width="4" height="2" className="fill-foreground" /> {/* Mouth/Chin */}
             <rect x="38" y="36" width="6" height="2" className="fill-foreground" /> {/* Jaw */}
             <rect x="30" y="36" width="8" height="2" className="fill-foreground" /> {/* Jawline back */}
             
             {/* Eye (The Glowing Part) */}
             <rect x="36" y="26" width="2" height="2" className={`transition-all duration-1000 ${eyeGlow ? 'fill-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'fill-background/10'}`} />
             
             {/* Neck */}
             <rect x="26" y="38" width="12" height="10" className="fill-foreground" />
             
             {/* Tunic/Shoulder */}
             <rect x="16" y="48" width="28" height="8" className="fill-foreground" />
             <rect x="18" y="50" width="24" height="2" className="fill-background/20" /> {/* Tunic detail */}
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
