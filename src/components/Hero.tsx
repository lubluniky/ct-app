import { ArrowRight, BookOpen, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroAnimation from './HeroAnimation';

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <HeroAnimation />
        {/* Gradient overlay to fade out animation on the left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-white/50 backdrop-blur-sm text-xs font-mono text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SYSTEM ONLINE
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary">
                BORKISS
                <span className="text-muted-foreground font-light">.TRADE</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
                Quant research environment. <br />
                <span className="text-foreground font-medium">Semi-predictive modeling</span> & market microstructure.
              </p>
            </div>

            <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
              A personal laboratory for exploring market tension, rolling VWAP metrics, and asymmetric risk strategies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:translate-y-[-2px] shadow-lg shadow-primary/20"
              >
                <Terminal className="w-4 h-4" />
                Open Dashboard
              </Link>
              
              <a 
                href="#philosophy" 
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg border border-border bg-white text-foreground font-medium hover:bg-secondary transition-all hover:translate-y-[-2px]"
              >
                <BookOpen className="w-4 h-4" />
                Read Philosophy
              </a>
            </div>

            <div className="pt-12 grid grid-cols-3 gap-8 border-t border-border/50">
              <div>
                <div className="text-2xl font-bold text-foreground">3+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Years Trading</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">200+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">15+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Models</div>
              </div>
            </div>
          </div>

          {/* Right side is left empty for the animation to shine through, 
              or we could add a floating "Terminal" preview card here */}
          <div className="hidden lg:block relative h-[400px]">
             {/* Abstract visual element or empty space for canvas */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
