import { useState } from "react";

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 px-4 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-6 mb-6">
            <span className="text-6xl font-bold text-primary/20">04</span>
            <h2 className="text-4xl md:text-5xl font-bold">Models</h2>
          </div>
          <div className="w-20 h-1 bg-primary" />
        </div>
        
        <div className="space-y-4">
          {questions.map((item, idx) => (
            <div
              key={idx}
              className="border border-border bg-background transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-primary/5 transition-all"
              >
                <span className="text-lg font-medium">{item.q}</span>
                <span className="text-2xl text-primary flex-shrink-0 transition-transform" style={{
                  transform: openIndex === idx ? 'rotate(45deg)' : 'rotate(0)'
                }}>
                  +
                </span>
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 text-muted-foreground border-t border-border pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
