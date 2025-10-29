const experiences = [
  {
    title: "3 years of trading",
    description: "Developed and refined a custom trading strategy combining ICT concepts, price action, market profile, and microstructure analysis."
  },
  {
    title: "Market cycles",
    description: "Survived multiple bull and bear markets. Each cycle teaches something new about human psychology and market structure."
  },
  {
    title: "Mentoring",
    description: "Taught hundreds of traders at cryptomannn.com. The biggest breakthrough isn't teaching strategy—it's helping people unlearn bad habits."
  }
];

export const Experience = () => {
  return (
    <section className="py-32 px-4 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-6 mb-6">
            <span className="text-6xl font-bold text-primary/20">02</span>
            <h2 className="text-4xl md:text-5xl font-bold">Experience</h2>
          </div>
          <div className="w-20 h-1 bg-primary shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
        </div>
        
        <div className="space-y-8">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="border-l-2 border-border hover:border-primary pl-8 py-4 transition-all duration-300 hover:translate-x-2 hover:shadow-[-4px_0_15px_rgba(168,85,247,0.15)]"
            >
              <h3 className="text-2xl font-semibold mb-3">{exp.title}</h3>
              <p className="text-muted-foreground text-lg">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
