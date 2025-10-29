export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Grid pattern removed - using Liquid Ether background instead */}
      
      <div className="relative max-w-5xl w-full">
        <div className="mb-8">
          <div className="inline-block px-4 py-1.5 border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300">
            SEMI-PREDICTIVE MODELS
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            BORKISS
            <span className="text-gradient drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">.TRADE</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-muted-foreground mb-6">
            Trader / Mentor / Indicator Developer
          </p>
          
          <p className="text-lg text-foreground/80 max-w-2xl leading-relaxed">
            Philosophy over prediction. Experience over emotion. Models that acknowledge uncertainty rather than promise certainty.
          </p>
        </div>
      </div>
    </section>
  );
};
