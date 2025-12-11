import { LayoutDashboard, ScanLine, ArrowRight, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AvailableModules = () => {
  return (
    <section className="relative py-32 bg-[#050505] border-t border-white/5">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-white/40"></div>
            <span className="text-xs font-mono text-white/60 tracking-[0.2em] uppercase">System Status</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
            ALREADY <span className="text-neutral-500">AVAILABLE</span>
          </h2>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Dashboard Module */}
          <Link to="/dashboard" className="group relative block">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm" />
            <div className="relative border border-white/10 p-8 h-full flex flex-col justify-between bg-black/20 backdrop-blur-sm hover:border-white/30 transition-colors duration-300">
              
              <div className="mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 rounded-sm inline-block">
                    <LayoutDashboard className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-neutral-600 group-hover:text-white transition-colors -rotate-45 group-hover:rotate-0 duration-300" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">DASHBOARD</h3>
                <p className="text-neutral-400 text-lg leading-relaxed font-light">
                  Market Pulse. Project SB. RORO Regtime and more.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live System
                </div>
              </div>
            </div>
          </Link>

          {/* Screener Module */}
          <Link to="/screener" className="group relative block">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm" />
            <div className="relative border border-white/10 p-8 h-full flex flex-col justify-between bg-black/20 backdrop-blur-sm hover:border-white/30 transition-colors duration-300">
              
              <div className="mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 rounded-sm inline-block">
                    <ScanLine className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-neutral-600 group-hover:text-white transition-colors -rotate-45 group-hover:rotate-0 duration-300" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">SCREENER</h3>
                <p className="text-neutral-400 text-lg leading-relaxed font-light">
                  Live monitoring of 60+ metrics across 530+ pairs. Maximum optimization. HFT engine. Microstructure analysis.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  High Frequency
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
};
