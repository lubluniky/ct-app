import { UnifiedChartPanel } from '@/components/charts/UnifiedChartPanel';
import { MarketPulseAlerts } from '@/components/MarketPulseAlerts';
import { VwapZScorePanel } from '@/components/charts/VwapZScorePanel';
import { MacroCorrelations } from '@/components/macro/MacroCorrelations';
import { CenturionLoader } from '@/components/CenturionLoader';
import MobileDashboard from '@/components/MobileDashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(() => {
    return !sessionStorage.getItem('dashboard_intro_shown');
  });

  const handleLoaderComplete = () => {
    sessionStorage.setItem('dashboard_intro_shown', 'true');
    setIsLoading(false);
  };

  if (isMobile) {
    return <MobileDashboard />;
  }

  return (
    <>
      {isLoading && <CenturionLoader onComplete={handleLoaderComplete} />}
      <div className={`flex flex-col h-full w-full overflow-hidden ${isLoading ? 'hidden' : ''}`}>
        {/* Header */}
        <header className="h-14 border-b border-border/40 bg-background/95 backdrop-blur flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-lg tracking-tight">Market Overview</h1>
          </div>
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono bg-secondary/50 px-3 py-1 rounded-full border border-border/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              SYSTEM ONLINE
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="macro">Macro</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="flex-1 mt-0 h-full min-h-0">
              <div className="grid grid-cols-1 lg:grid-cols-4 grid-rows-[3fr_2fr] gap-4 h-full min-h-[600px]">
                {/* Main Chart Area (Top Left - 3 cols) */}
                <div className="lg:col-span-3 row-span-1 min-h-0">
                  <UnifiedChartPanel />
                </div>

                {/* Alerts Panel (Top Right - 1 col) */}
                <div className="lg:col-span-1 row-span-1 min-h-0">
                  <MarketPulseAlerts />
                </div>

                {/* VWAP Z-Score Mod (Bottom - Full Width) */}
                <div className="lg:col-span-4 row-span-1 min-h-0">
                  <VwapZScorePanel />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="macro" className="flex-1 mt-0 h-full overflow-y-auto">
              <div className="space-y-6">
                <MacroCorrelations />
                {/* Placeholder for future macro components */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-[400px] rounded-xl border border-border/40 bg-card/30 flex items-center justify-center text-muted-foreground">
                    Additional Macro Charts Coming Soon
                  </div>
                  <div className="h-[400px] rounded-xl border border-border/40 bg-card/30 flex items-center justify-center text-muted-foreground">
                    Economic Calendar Coming Soon
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
