import { SectionLayout } from "./ui/SectionLayout";
import { Activity, BarChart2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  {
    title: "Market Tension Map",
    description: "A multi-timeframe analysis of price extension relative to mean. Identifies potential reversal zones and exhaustion points.",
    metrics: ["15m", "1h", "4h", "Daily"],
    icon: Activity,
    link: "/dashboard"
  },
  {
    title: "Rolling VWAP",
    description: "Volume-Weighted Average Price models that adapt to market volatility. Tracks institutional interest and fair value zones.",
    metrics: ["Session", "Weekly", "Monthly"],
    icon: BarChart2,
    link: "/dashboard"
  }
];

export const ToolsOverview = () => {
  return (
    <SectionLayout number="05" title="Tools & Dashboards" className="bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className="flex flex-col p-8 bg-card rounded-xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 rounded-lg bg-secondary text-primary group-hover:scale-110 transition-transform duration-300">
                <tool.icon className="w-6 h-6" />
              </div>
              <div className="flex gap-2">
                {tool.metrics.map((metric, mIdx) => (
                  <span key={mIdx} className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground border border-border">
                    {metric}
                  </span>
                ))}
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-3 text-foreground">{tool.title}</h3>
            <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">
              {tool.description}
            </p>
            
            <Link 
              to={tool.link}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Launch Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
};
