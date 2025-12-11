import { useRef, useEffect } from "react";
import { Zap, Database, Globe, Cpu, Flag, Activity, Terminal, Layers } from "lucide-react";

const milestones = [
  {
    quarter: "Q1 2026",
    title: "Metric Explosion",
    description: "Expanding the intelligence layer with a vast range of market, behavioral, and sentiment-based indicators.",
    details: ["+100 New Metrics", "Deep Insight Layer", "Unified Dashboard"],
    type: "database",
    icon: Database
  },
  {
    quarter: "Q2 2026",
    title: "Amex Heart Core",
    description: "Next-generation analytics core in Rust for speed, safety, and precision execution.",
    details: ["50µs Latency", "Risk Guard", "Memory Safety"],
    type: "heart",
    icon: Activity
  },
  {
    quarter: "Q3 2026",
    title: "Terminal V2",
    description: "Institutional-grade experience for retail. Performance-optimized front-end with new layout.",
    details: ["Native Execution", "Liquidity Zones", "Advanced Charting"],
    type: "terminal",
    icon: Terminal
  },
  {
    quarter: "Q4 2026",
    title: "Data Fusion API",
    description: "Launch of ultra-fast data engine. Rust-powered low-latency API aggregates raw data.",
    details: ["Sub-10ms Response", "AWS Lambda/EKS", "ML Pipeline Ready"],
    type: "api",
    icon: Zap
  },
  {
    quarter: "Strategic",
    title: "Ecosystem Expansion",
    description: "Deep AWS integration and open SDK for custom analytics.",
    details: ["Compute Hosting", "Open SDK", "Fintech Integration"],
    type: "ecosystem",
    icon: Globe
  }
];

const HeartAnimation = () => (
  <div className="relative w-20 h-20 flex items-center justify-center">
    <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-ping" />
    <div className="absolute inset-2 border border-emerald-500/40 rounded-full animate-pulse" />
    <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" />
    {/* EKG Line */}
    <svg className="absolute inset-0 w-full h-full text-emerald-500/50" viewBox="0 0 100 100">
      <path d="M0 50 H30 L40 20 L50 80 L60 50 H100" fill="none" stroke="currentColor" strokeWidth="1" className="animate-[dash_2s_linear_infinite]" strokeDasharray="100" strokeDashoffset="100" />
    </svg>
  </div>
);

const DatabaseAnimation = () => (
  <div className="relative w-20 h-20 flex flex-col items-center justify-center gap-2 perspective-500">
    {[...Array(3)].map((_, i) => (
      <div 
        key={i} 
        className="w-16 h-4 border border-emerald-500/30 bg-emerald-500/5 rounded-[50%] relative overflow-hidden transform rotate-x-12"
        style={{ animation: `float 3s ease-in-out infinite ${i * 0.5}s` }}
      >
        <div className="absolute inset-0 bg-emerald-400/10 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent animate-shimmer" />
      </div>
    ))}
  </div>
);

const TerminalAnimation = () => (
  <div className="relative w-20 h-16 border border-emerald-500/30 bg-black/80 rounded-sm p-2 flex flex-col gap-1 overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.1)]">
    <div className="w-full h-[1px] bg-emerald-500/20" />
    <div className="font-mono text-[6px] text-emerald-400/90 leading-none">
      <span className="text-emerald-600">{">"}</span> INIT_CORE<br/>
      <span className="text-emerald-600">{">"}</span> LOAD_MODULES<br/>
      <span className="text-emerald-600">{">"}</span> OPTIMIZING...<br/>
      <span className="animate-pulse text-emerald-300">{">"} _</span>
    </div>
  </div>
);

const ApiAnimation = () => (
  <div className="relative w-20 h-20 flex items-center justify-center">
    <div className="absolute w-16 h-16 border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
    <div className="absolute w-12 h-12 border-t border-b border-emerald-500/50 rounded-full animate-[spin_3s_linear_infinite]" />
    <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" />
    {[...Array(4)].map((_, i) => (
      <div 
        key={i} 
        className="absolute w-0.5 h-8 bg-gradient-to-b from-emerald-400/50 to-transparent"
        style={{ transform: `rotate(${i * 90}deg) translateY(-16px)` }} 
      />
    ))}
  </div>
);

const EcosystemAnimation = () => (
  <div className="relative w-20 h-20">
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden rounded-sm group-hover:border-emerald-500/40 transition-colors">
           <div className="absolute inset-0 bg-emerald-400/5 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
        </div>
      ))}
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-24 h-[1px] bg-emerald-500/20 rotate-45" />
      <div className="w-24 h-[1px] bg-emerald-500/20 -rotate-45" />
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
    </div>
  </div>
);

const getAnimation = (type: string) => {
  switch (type) {
    case 'heart': return <HeartAnimation />;
    case 'database': return <DatabaseAnimation />;
    case 'terminal': return <TerminalAnimation />;
    case 'api': return <ApiAnimation />;
    case 'ecosystem': return <EcosystemAnimation />;
    default: return <div className="w-12 h-12 border border-white/20" />;
  }
};

export const Roadmap = () => {
  return (
    <section className="py-32 relative bg-[#050505] overflow-hidden" id="roadmap">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98105_1px,transparent_1px),linear-gradient(to_bottom,#10b98105_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase">Strategic Vision</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Roadmap</span>
          </h2>
          
          <p className="text-neutral-400 max-w-xl text-lg leading-relaxed">
            Executing a phased rollout of high-performance infrastructure. 
            From metric expansion to institutional-grade execution core.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent hidden lg:block -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {milestones.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative bg-black/40 backdrop-blur-md border border-white/5 hover:border-emerald-500/30 p-8 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)] overflow-hidden rounded-xl"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Connector Line (Design Element) */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-emerald-500/10 group-hover:border-emerald-500/30 transition-colors rounded-tr-xl" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col gap-2">
                      <div className="font-mono text-xs text-emerald-500/80 border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 rounded w-fit">
                        {item.quarter}
                      </div>
                      <item.icon className="w-5 h-5 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    
                    {/* Custom Animation Container */}
                    <div className="opacity-70 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                      {getAnimation(item.type)}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6 group-hover:text-neutral-300 transition-colors">
                    {item.description}
                  </p>

                  <div className="space-y-3 pt-6 border-t border-white/5 group-hover:border-emerald-500/10 transition-colors">
                    {item.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-3 text-xs font-mono text-neutral-500 group-hover:text-emerald-400/80 transition-colors">
                        <div className="w-1.5 h-1.5 bg-emerald-500/30 rounded-full group-hover:bg-emerald-400 transition-colors" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

