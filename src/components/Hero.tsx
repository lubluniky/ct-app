import { useEffect, useState } from "react";
import { CornerBrackets } from "./CornerBrackets";

export const Hero = () => {
  const [text, setText] = useState("");
  const fullText = "> INITIALIZING PORTFOLIO SYSTEM...";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <CornerBrackets className="p-8 md:p-16 max-w-4xl w-full mx-4">
        <div className="space-y-6">
          <div className="text-matrix text-sm mb-8 font-mono">
            {text}
            <span className="animate-pulse">|</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            BORKISS<span className="text-secondary">.TRADE</span>
          </h1>
          
          <div className="space-y-2 text-muted-foreground">
            <p className="text-xl md:text-2xl">
              <span className="text-secondary">$</span> ROLE: FULL-STACK DEVELOPER
            </p>
            <p className="text-xl md:text-2xl">
              <span className="text-secondary">$</span> SPEC: WEB3 | SECURITY | SYSTEMS
            </p>
            <p className="text-xl md:text-2xl">
              <span className="text-secondary">$</span> STATUS: <span className="text-primary">OPERATIONAL</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <button className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-background transition-all duration-300 font-mono">
              VIEW_PROJECTS
            </button>
            <button className="px-6 py-3 border border-secondary text-secondary hover:bg-secondary hover:text-background transition-all duration-300 font-mono">
              CONTACT
            </button>
          </div>
        </div>
      </CornerBrackets>
    </section>
  );
};
