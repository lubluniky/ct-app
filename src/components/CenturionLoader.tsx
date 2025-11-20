import { useState, useEffect } from 'react';

export const CenturionLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

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
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
       {/* Pixel Background Effect */}
       <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="w-full h-full" style={{ 
           backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', 
           backgroundSize: '20px 20px' 
         }}></div>
       </div>

       {/* Pixel Art Centurion Head (SVG) */}
       <div className="mb-8 relative w-32 h-32 animate-pulse">
         <svg viewBox="0 0 16 16" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
           {/* Helmet Crest */}
           <rect x="6" y="1" width="4" height="1" fill="#ef4444" />
           <rect x="5" y="2" width="6" height="1" fill="#ef4444" />
           <rect x="4" y="3" width="8" height="1" fill="#ef4444" />
           
           {/* Helmet Main */}
           <rect x="4" y="4" width="8" height="1" fill="#eab308" />
           <rect x="3" y="5" width="10" height="1" fill="#eab308" />
           <rect x="3" y="6" width="10" height="1" fill="#eab308" />
           <rect x="3" y="7" width="2" height="5" fill="#eab308" />
           <rect x="11" y="7" width="2" height="5" fill="#eab308" />
           <rect x="5" y="7" width="6" height="1" fill="#eab308" />
           
           {/* Face/Eyes area (dark) */}
           <rect x="5" y="8" width="6" height="4" fill="#1f2937" />
           
           {/* Nose guard */}
           <rect x="7" y="7" width="2" height="4" fill="#eab308" />
         </svg>
       </div>
       
       <div className="relative z-10 text-center">
         <h1 className="text-4xl md:text-6xl font-bold text-white font-mono tracking-tighter mb-2">
           CenturionTerminal
         </h1>
         <div className="inline-block px-3 py-1 border border-yellow-500/50 rounded bg-yellow-500/10">
           <span className="text-yellow-500 font-mono text-sm tracking-[0.2em] font-bold">BETA VERSION</span>
         </div>
       </div>
       
       {/* Progress Bar */}
       <div className="mt-12 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
         <div 
           className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(234,179,8,0.5)]"
           style={{ width: `${progress}%` }}
         />
       </div>
       
       <div className="mt-4 text-gray-500 font-mono text-xs animate-pulse">
         INITIALIZING SYSTEM...
       </div>
    </div>
  );
};
