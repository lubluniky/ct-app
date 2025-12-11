import { Zap, Database, Globe, Cpu, Flag } from "lucide-react";

const milestones = [
  {
    quarter: "Q1 2026",
    title: "Metric Explosion & User Empowerment",
    description: "+100 new metrics added to dashboard. Expanding the intelligence layer with a vast range of market, behavioral, and sentiment-based indicators.",
    details: [
      "Most data-rich trading environment for retail",
      "Lightweight and beautiful UX/UI",
      "Deeper insights without switching tools"
    ],
    icon: Database,
    color: "text-blue-400",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    border: "border-blue-500/20"
  },
  {
    quarter: "Q2 2026",
    title: "Amex Heart — The Analytical Core",
    description: "Release of Amex Heart Core Engine. Next-generation analytics core in Rust for speed, safety, and precision.",
    details: [
      "Real-time data processing & execution management",
      "Quantitative risk controls (Risk Guard)",
      "Memory-safe concurrency for mission-critical trading"
    ],
    icon: Zap,
    color: "text-amber-400",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
    border: "border-amber-500/20"
  },
  {
    quarter: "Q3 2026",
    title: "Terminal V2 — Institutional Experience",
    description: "Launch of Borkiss Terminal V2. Next-gen terminal powered by Amex Heart Core.",
    details: [
      "Performance-optimized front-end with new layout",
      "Native execution & alert systems",
      "Advanced modules: funding rate arb, liquidity zones"
    ],
    icon: Globe,
    color: "text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.3)]",
    border: "border-emerald-500/20"
  },
  {
    quarter: "Q4 2026",
    title: "API Infrastructure & Data Fusion",
    description: "Launch of ultra-fast data engine. Rust-powered low-latency API aggregates raw data → ready metrics.",
    details: [
      "Sub-10ms responses (async Rust + in-memory cache)",
      "Scales via AWS Lambda/EKS",
      "Plug-and-play for fintech, quants, ML pipelines"
    ],
    icon: Cpu,
    color: "text-purple-400",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    border: "border-purple-500/20"
  },
  {
    quarter: "Strategic",
    title: "Strategic Alignment",
    description: "Deep AWS integration and ecosystem expansion.",
    details: [
      "Compute & AI hosting",
      "Open SDK for custom analytics",
      "Target: fintech startups, algo devs, funds"
    ],
    icon: Flag,
    color: "text-rose-400",
    glow: "shadow-[0_0_20px_rgba(251,113,133,0.3)]",
    border: "border-rose-500/20"
  }
];

export const Roadmap = () => {
  return (
    <section className="py-32 relative overflow-hidden" id="roadmap">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-24 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-slate-400 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            TIMELINE
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
            Development Roadmap
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Our path to redefining retail trading infrastructure.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-[20px] md:left-1/2 md:-ml-[1px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-blue-500/50 to-transparent" />

            <div className="space-y-16">
              {milestones.map((item, idx) => (
                <div key={idx} className="relative group">
                  
                  {/* Timeline Dot */}
                  <div className={`absolute left-[16px] md:left-1/2 md:-ml-[5px] top-8 w-[10px] h-[10px] rounded-full bg-[#050505] border-2 border-blue-500 z-20 group-hover:scale-150 transition-transform duration-500 ${item.glow}`} />
                  
                  <div className={`flex flex-col md:flex-row gap-8 md:gap-24 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* Content Card */}
                    <div className="flex-1 ml-12 md:ml-0">
                      <div className={`
                        relative glass-card p-8 rounded-2xl transition-all duration-500
                        hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]
                        group-hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]
                        ${idx % 2 === 0 ? 'md:text-left' : 'md:text-left'}
                      `}>
                        {/* Glow Effect on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`font-mono text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10 ${item.color}`}>
                              {item.quarter}
                            </span>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                          </div>
                          
                          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-glow transition-all">
                            {item.title}
                          </h3>
                          
                          <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                            {item.description}
                          </p>

                          <ul className="space-y-3">
                            {item.details.map((detail, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-3 text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block flex-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
