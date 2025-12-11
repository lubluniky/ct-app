import { NewHero } from "@/components/NewHero";
import { Roadmap } from "@/components/Roadmap";
import { Contact } from "@/components/Contact";
import { StickyNavbar } from "@/components/StickyNavbar";
import { Suspense, lazy, useEffect } from "react";

const PixelBackground = lazy(() => import("@/components/PixelBackground"));

const Index = () => {
  useEffect(() => {
    // Reset dashboard intro flag when visiting the landing page
    sessionStorage.removeItem('dashboard_intro_shown');
    // Ensure dark mode is active for the landing page
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <Suspense fallback={null}>
          <PixelBackground />
        </Suspense>
      </div>

      <StickyNavbar />

      <main className="relative z-10">
        <NewHero />
        
        <Roadmap />

        <Contact />
      </main>
        
      <footer className="relative z-10 border-t border-border py-12 bg-background">
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
