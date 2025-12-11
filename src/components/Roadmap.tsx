import { SectionLayout } from "./ui/SectionLayout";
import { CheckCircle2, Circle, Clock, Zap, Database, Globe, Cpu } from "lucide-react";

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
    status: "upcoming"
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
    status: "upcoming"
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
    status: "upcoming"
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
    status: "upcoming"
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
    icon: CheckCircle2,
    status: "planning"
  }
];

export const Roadmap = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden" id="roadmap">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Development Roadmap
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our path to redefining retail trading infrastructure.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative border-l border-border/50 ml-4 md:ml-0 space-y-12">
            {milestones.map((item, idx) => (
              <div key={idx} className="relative pl-12 md:pl-0">
                {/* Timeline Dot */}
                <div className="absolute left-[-5px] top-0 md:left-1/2 md:-ml-[5px] w-[10px] h-[10px] rounded-full bg-primary border border-background shadow-[0_0_10px_rgba(var(--primary),0.5)] z-20" />
                
                <div className={`flex flex-col md:flex-row gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Content Card */}
                  <div className="flex-1">
                    <div className="group relative bg-card/30 border border-border/50 rounded-xl p-6 hover:bg-card/50 hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-border/50 text-xs font-mono text-primary">
                          <item.icon className="w-3 h-3" />
                          {item.quarter}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {item.description}
                      </p>

                      <ul className="space-y-2">
                        {item.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2 text-xs text-muted-foreground/80">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/50" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Spacer for the other side of the timeline */}
                  <div className="hidden md:block flex-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
