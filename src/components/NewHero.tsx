import { Terminal, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background pointer-events-none" />
        {/* Subtle grid or effect could go here */}
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="flex flex-col items-center text-center space-y-12">
          
          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-secondary/20 backdrop-blur-sm text-xs font-mono text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM ONLINE
            </div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-foreground">
              BORKISS
              <span className="block text-2xl md:text-4xl font-light text-muted-foreground mt-2 tracking-widest uppercase">
                Trade Development
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Building the next generation of retail trading infrastructure.
              <span className="block mt-2 text-foreground font-medium">
                Institutional-grade analytics. Light-speed execution.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mt-12">
            {/* Centurion Terminal Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-8 hover:bg-card/80 transition-all duration-300 hover:border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Terminal className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Centurion Terminal</h3>
                <p className="text-muted-foreground">
                  The command center for your trading operations. Advanced charting, execution, and portfolio management.
                </p>
                <div className="pt-4">
                  <Link 
                    to="/dashboard" 
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Launch Terminal <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Centurion Screener Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-8 hover:bg-card/80 transition-all duration-300 hover:border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Centurion Screener</h3>
                <p className="text-muted-foreground">
                  Real-time market scanning. Detect anomalies, volume spikes, and trend shifts instantly.
                </p>
                <div className="pt-4">
                  <Link 
                    to="/dashboard/screener" 
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Open Screener <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
