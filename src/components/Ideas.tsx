const ideas = [
  {
    title: "Structural thinking",
    description: "Markets are networks, not machines. Understand the nodes and edges to see how information flows."
  },
  {
    title: "Asymmetric risk",
    description: "The best trades risk little to gain much. When you win, it matters more than when you lose."
  },
  {
    title: "Adaptive positioning",
    description: "Position size should reflect conviction and market conditions, not arbitrary percentages."
  }
];

export const Ideas = () => {
  return (
    <section className="py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-6 mb-6">
            <span className="text-6xl font-bold text-primary/20">03</span>
            <h2 className="text-4xl md:text-5xl font-bold">Ideas</h2>
          </div>
          <div className="w-20 h-1 bg-primary" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ideas.map((idea, idx) => (
            <div
              key={idx}
              className="border border-border bg-card p-8 hover-lift"
            >
              <h3 className="text-xl font-semibold mb-4">{idea.title}</h3>
              <p className="text-muted-foreground">{idea.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
