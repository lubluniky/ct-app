import { SectionLayout } from "./ui/SectionLayout";

const questions = [
  {
    q: "What makes a model \"semi-predictive\"?",
    a: "It provides probabilistic insights rather than deterministic forecasts. Think weather prediction—useful for planning, useless for guarantees."
  },
  {
    q: "How do you handle model failure?",
    a: "Models break. Markets evolve. The key is building systems that degrade gracefully and adapt quickly."
  },
  {
    q: "What's your edge?",
    a: "Focus on market microstructure and participant behavior rather than pure price patterns. Understanding why something happens is more valuable than knowing that it does."
  }
];

export const Models = () => {
  return (
    <SectionLayout number="04" title="Models" className="bg-secondary/20">
      <div className="grid grid-cols-1 gap-6">
        {questions.map((item, idx) => (
          <div
            key={idx}
            className="p-8 bg-card rounded-xl border border-border hover:border-primary/30 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold mb-3 text-foreground">{item.q}</h3>
            <p className="text-muted-foreground leading-relaxed border-l-2 border-primary/20 pl-4">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
};
