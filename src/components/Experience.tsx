import { SectionLayout } from "./ui/SectionLayout";
import { Briefcase, TrendingUp, Users } from "lucide-react";

const experiences = [
  {
    title: "3 years of trading",
    description: "Developed and refined a custom trading strategy combining ICT concepts, price action, market profile, and microstructure analysis.",
    icon: TrendingUp
  },
  {
    title: "Market cycles",
    description: "Survived multiple bull and bear markets. Each cycle teaches something new about human psychology and market structure.",
    icon: Briefcase
  },
  {
    title: "Mentoring",
    description: "Taught hundreds of traders at cryptomannn.com. The biggest breakthrough isn't teaching strategy—it's helping people unlearn bad habits.",
    icon: Users
  }
];

export const Experience = () => {
  return (
    <SectionLayout number="02" title="Experience" className="bg-secondary/20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="relative p-8 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
              <exp.icon className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-semibold mb-3 text-foreground">{exp.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
};
