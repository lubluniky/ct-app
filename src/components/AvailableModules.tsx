import { LayoutDashboard, ScanLine, ArrowRight, Activity, Zap, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AvailableModules = () => {
  return (
    <section className="relative py-32 bg-[#050505] border-t border-white/5 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-[#050505] to-[#050505] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-white/40"></div>
              <span className="text-xs font-mono text-white/60 tracking-[0.2em] uppercase">System Status</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
              ALREADY <span className="text-neutral-600">AVAILABLE</span>
            </h2>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-neutral-500 font-mono text-xs tracking-widest">
               OPERATIONAL STATUS: <span className="text-emerald-500">NOMINAL</span>
             </p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Dashboard Module */}
          <Link to="/dashboard" className="group relative block h-[400px]">
            <div className="absolute inset-0 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden transition-all duration-500 group-hover:border-white/30 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.05)]">
              
              {/* Hover Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Background Icon Watermark */}
              <LayoutDashboard className="absolute -right-10 -bottom-10 w-64 h-64 text-white/[0.02] group-hover:text-white/[0.05] transition-colors duration-500 rotate-[-15deg]" />

              <div className="relative h-full p-10 flex flex-col justify-between z-10">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono tracking-wider uppercase flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </div>
                  </div>
                  
                  <h3 className="text-4xl font-bold text-white mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-300">DASHBOARD</h3>
                  <p className="text-neutral-400 text-lg leading-relaxed font-light max-w-sm">
                    Market Pulse. Project SB. RORO Regtime and more.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-white/40 group-hover:text-white transition-colors">
                  <span className="font-mono text-sm tracking-wider">ACCESS TERMINAL</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </div>
          </Link>

          {/* Screener Module */}
          <Link to="/screener" className="group relative block h-[400px]">
            <div className="absolute inset-0 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden transition-all duration-500 group-hover:border-white/30 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.05)]">
              
              {/* Hover Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Background Icon Watermark */}
              <ScanLine className="absolute -right-10 -bottom-10 w-64 h-64 text-white/[0.02] group-hover:text-white/[0.05] transition-colors duration-500 rotate-[-15deg]" />

              <div className="relative h-full p-10 flex flex-col justify-between z-10">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <ScanLine className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-mono tracking-wider uppercase flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      Beta
                    </div>
                  </div>
                  
                  <h3 className="text-4xl font-bold text-white mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-300">SCREENER</h3>
                  <p className="text-neutral-400 text-lg leading-relaxed font-light max-w-sm">
                    Live monitoring of 60+ metrics across 530+ pairs. HFT engine.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-white/40 group-hover:text-white transition-colors">
                  <span className="font-mono text-sm tracking-wider">LAUNCH SCANNER</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
};
