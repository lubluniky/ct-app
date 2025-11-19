import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UnifiedChartPanel } from '@/components/charts/UnifiedChartPanel';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="h-6 w-px bg-border mx-2" />
            
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <span className="font-semibold tracking-tight">Research Terminal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground font-mono bg-secondary/50 px-3 py-1 rounded-full border border-border">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              DATA STREAM: ACTIVE
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Market Analysis
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Advanced technical analysis combining Market Tension Map and Rolling VWAP indicators.
              </p>
            </div>
          </div>

          <UnifiedChartPanel />
      </main>
    </div>
  );
};

export default Dashboard;
