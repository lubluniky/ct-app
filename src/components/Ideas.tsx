import { SectionLayout } from "./ui/SectionLayout";
import { Network, ShieldAlert, Scale } from "lucide-react";

const ideas = [
  {
    title: "Structural thinking",
    description: "Markets are networks, not machines. Understand the nodes and edges to see how information flows.",
    icon: Network
  },
  {
    title: "Asymmetric risk",
    description: "The best trades risk little to gain much. When you win, it matters more than when you lose.",
    icon: ShieldAlert
  },
  {
    title: "Adaptive positioning",
    description: "Position size should reflect conviction and market conditions, not arbitrary percentages.",
    icon: Scale
  }
];

export const Ideas = () => {
  return (
    <SectionLayout number="03" title="Ideas" className="bg-background">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ideas.map((idea, idx) => (
          <div
            key={idx}
            className="group p-8 bg-card border border-border rounded-xl hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
          >
            <div className="mb-6 text-muted-foreground group-hover:text-primary transition-colors duration-300">
              <idea.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">{idea.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{idea.description}</p>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
};
