import { Hero } from "@/components/Hero";
import { Philosophy } from "@/components/Philosophy";
import { Experience } from "@/components/Experience";
import { Ideas } from "@/components/Ideas";
import { Models } from "@/components/Models";
import { ToolsOverview } from "@/components/ToolsOverview";
import { Contact } from "@/components/Contact";
import { StickyNavbar } from "@/components/StickyNavbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20 selection:text-primary">
      <StickyNavbar />

      <main>
        <Hero />
        
        <div id="philosophy">
          <Philosophy />
        </div>
        
        <div id="experience">
          <Experience />
        </div>
        
        <div id="models">
          <Ideas />
          <Models />
        </div>

        <div id="tools">
          <ToolsOverview />
        </div>
        
        <div id="connect">
          <Contact />
        </div>
      </main>
        
      <footer className="border-t border-border py-12 bg-secondary/10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground font-mono">
            BORKISS.TRADE — QUANT RESEARCH LAB
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
