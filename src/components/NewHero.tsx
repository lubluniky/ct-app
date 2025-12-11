import { ArrowRight, Terminal, Activity, Cpu, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TechnicalGrid } from './TechnicalGrid';
import { DataStream } from './DataStream';

const HeroAnimation = () => (
  <div className="relative w-full h-full min-h-[400px] flex items-center justify-center perspective-1000">
    {/* Central Core */}
    <div className="relative w-64 h-64 md:w-96 md:h-96">
      {/* Outer Ring */}
      <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
      <div className="absolute inset-4 border border-emerald-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
      
      {/* Rotating Data Rings */}
      <div className="absolute inset-0 rounded-full border-t border-emerald-500/50 animate-[spin_3s_linear_infinite]" />
      <div className="absolute inset-8 rounded-full border-b border-cyan-500/50 animate-[spin_4s_linear_infinite_reverse]" />
      
      {/* Core Glow */}
      <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
      
      {/* Central Orb */}
      <div className="absolute inset-0 m-auto w-32 h-32 bg-black/80 backdrop-blur-md rounded-full border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-emerald-400 tracking-widest">
          SYSTEM_ACTIVE
        </div>
      </div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: `rotate(${i * 60}deg) translateY(-140px)`,
            animation: `pulse 2s infinite ${i * 0.2}s`
          }}
        />
      ))}
    </div>
  </div>
);

export const NewHero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-[#050505] overflow-hidden selection:bg-emerald-500/30">
      <TechnicalGrid />
      <DataStream />
      
      {/* Ambient Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 tracking-wider">GEN-3 ANALYTICS ENGINE</span>
            </div>

            {/* Main Title */}
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
                CENTURION
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-shimmer bg-[length:200%_100%]">
                  ECOSYSTEM
                </span>
              </h1>
              <div className="absolute -left-8 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent hidden md:block" />
            </div>

            {/* Description */}
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-xl border-l-2 border-emerald-500/30 pl-6">
              The unfair advantage for <span className="text-white italic font-serif">institutional</span> retail traders. 
              Architecting the next generation of execution infrastructure with precision and speed.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5">
              <div className="space-y-1">
                <div className="text-2xl font-mono text-white">50µs</div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Latency</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-mono text-white">20k+</div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">TPS</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-mono text-white">99.9%</div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Uptime</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/dashboard" 
                className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold tracking-wider transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center gap-3">
                  <Terminal className="w-5 h-5" />
                  <span>LAUNCH TERMINAL</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link 
                to="/dashboard/screener" 
                className="group px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold tracking-wider transition-all backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>SCREENER</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Animation */}
          <div className="hidden lg:block h-[600px] w-full">
            <HeroAnimation />
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/5 bg-black/40 backdrop-blur-md py-4">
        <div className="container mx-auto px-6 flex justify-between items-center text-[10px] font-mono text-neutral-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM ONLINE
            </span>
            <span>//</span>
            <span>V.2.0.4 [STABLE]</span>
          </div>
          <div className="flex items-center gap-4">
            <span>ENCRYPTION: AES-256</span>
            <span>//</span>
            <span>SECURE CONNECTION</span>
          </div>
        </div>
      </div>

    </section>
  );
};
