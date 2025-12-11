import { NewHero } from "@/components/NewHero";
import { Roadmap } from "@/components/Roadmap";
import { Contact } from "@/components/Contact";
import { StickyNavbar } from "@/components/StickyNavbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Reset dashboard intro flag when visiting the landing page
    sessionStorage.removeItem('dashboard_intro_shown');
    // Ensure dark mode is active for the landing page
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] relative selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden text-slate-200 font-sans">
      <AnimatedBackground />

      <StickyNavbar />

      <main className="relative z-10">
        <NewHero />
        
        <Roadmap />

        <Contact />
      </main>
        
      <footer className="relative z-10 border-t border-white/5 py-12 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-slate-500 font-mono">
            BORKISS.TRADE — QUANT RESEARCH LAB
          </p>
          <p className="text-xs text-slate-600 mt-2">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
