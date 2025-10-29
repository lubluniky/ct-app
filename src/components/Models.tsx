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
          <div className="w-20 h-1 bg-primary shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
        </div>
        
        <div className="space-y-4">
          {questions.map((item, idx) => (
            <div
              key={idx}
              className="border border-border bg-background transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-primary/5 transition-all duration-300"
              >
                <span className="text-lg font-medium">{item.q}</span>
                <span 
                  className="text-2xl text-primary flex-shrink-0 transition-transform duration-400"
                  style={{
                    transform: openIndex === idx ? 'rotate(45deg)' : 'rotate(0)',
                    transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
                  }}
                >
                  +
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-400"
                style={{
                  maxHeight: openIndex === idx ? '500px' : '0',
                  opacity: openIndex === idx ? '1' : '0',
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
                }}
              >
                <div className="px-6 pb-6 text-muted-foreground border-t border-border pt-4">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
