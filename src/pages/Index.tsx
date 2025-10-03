import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Skills />
      <Projects />
      <Contact />
      
      <footer className="border-t border-primary/20 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm font-mono">
            © 2025 BORKISS.TRADE | <span className="text-primary">SYSTEM_OPERATIONAL</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
