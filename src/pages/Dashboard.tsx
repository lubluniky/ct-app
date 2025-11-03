import { ArrowLeft, Menu, X, Activity, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import { SignalOverview } from '@/components/SignalOverview';
import { useDashboardSignals } from '@/hooks/useDashboardSignals';

// Lazy load heavy components
const LoadingOverlay = lazy(() => import('@/components/LoadingOverlay'));
const RvwapPanel = lazy(() => import('@/components/rvwap/RvwapPanel').then(module => ({ default: module.RvwapPanel })));
const MTMPanel = lazy(() => import('@/components/mtm/MTMPanel').then(module => ({ default: module.MTMPanel })));
const OEBTCIndicator = lazy(() => import('@/components/OEBTCIndicator').then(module => ({ default: module.OEBTCIndicator })));

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeIndicator, setActiveIndicator] = useState<'overview' | 'oe-btc' | 'mtm' | 'rvwap'>('overview');
  
  // Fetch dashboard signals
  const signals = useDashboardSignals('BTCUSDT');

  // Navigation tabs config
  const tabs = [
    { id: 'overview', label: 'Overview', icon: AlertCircle },
    { id: 'oe-btc', label: 'OE-BTC', icon: Activity },
    { id: 'mtm', label: 'MTM', icon: Zap },
    { id: 'rvwap', label: 'RVWAP', icon: TrendingUp },
  ] as const;

  // Remove sessionStorage check - always show animation
  // Animation will play every time user navigates to dashboard

  useEffect(() => {
    let resizeTimeout: number | null = null;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const debouncedCheckMobile = () => {
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = window.setTimeout(checkMobile, 150);
    };

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    checkMobile();
    window.addEventListener('resize', debouncedCheckMobile);

    return () => {
      window.removeEventListener('resize', debouncedCheckMobile);
      mediaQuery.removeEventListener('change', handleChange);
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout);
      }
    };
  }, []);

  const handleLoadingComplete = () => {
    console.log('📍 Dashboard: анимация завершена, показываем контент');
    setShowLoading(false);
    
    // Small delay before starting content fade-in for smooth transition
    setTimeout(() => {
      setContentOpacity(1);
    }, 50);
  };

  // Mobile blocker
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card border-2 border-border rounded-lg p-8 shadow-2xl text-center space-y-6">
          <div className="text-7xl">📱🚫</div>
          <h1 className="text-3xl font-bold">Dashboard Not Available on Mobile</h1>
          <p className="text-muted-foreground text-lg">
            The trading dashboard is currently not available on mobile devices due to complex chart interactions and data requirements.
          </p>
          <div className="pt-4 space-y-3 text-left bg-muted/30 rounded-lg p-4">
            <p className="font-semibold text-center">Please try:</p>
            <ul className="space-y-2 text-sm">
              <li>• Enable <strong>Desktop Mode</strong> in your browser settings</li>
              <li>• Access from a <strong>computer</strong> for the best experience</li>
            </ul>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-semibold"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Loading Overlay - shows every time dashboard is loaded */}
      {showLoading && (
        <Suspense fallback={null}>
          <LoadingOverlay onComplete={handleLoadingComplete} />
        </Suspense>
      )}

      {/* Simple Gradient Background - no heavy WebGL */}
      <div
        className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950"
        style={{
          pointerEvents: 'none'
        }}
      />

      {/* Subtle accent gradient overlay */}
      <div
        className="fixed inset-0 z-[0.5] bg-gradient-to-t from-blue-500/5 to-transparent"
        style={{
          pointerEvents: 'none'
        }}
      />

      {/* Content - fades in after loading */}
      <div 
        className="relative z-10 min-h-screen transition-opacity duration-500"
        style={{ 
          pointerEvents: 'auto',
          opacity: contentOpacity,
          transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
        }}
      >
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Menu toggle + Back */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden"
                  title="Toggle sidebar"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>

              {/* Center: Title */}
              <h1 className="text-2xl font-bold">Trading Dashboard</h1>

              {/* Right: Spacer */}
              <div className="w-20"></div>
            </div>
          </div>
        </header>

        {/* Main Content - Sidebar + Grid Layout */}
        <main className="px-4 py-6 flex gap-6">
          {/* Sidebar Navigation - Hidden on mobile unless toggled */}
          <aside
            className={`
              fixed lg:static left-0 top-16 bottom-0 z-40 w-48 bg-background/95 backdrop-blur-sm border-r border-border
              transition-transform duration-300 ease-in-out transform
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0 lg:w-auto lg:relative lg:top-auto lg:bottom-auto lg:bg-transparent lg:backdrop-blur-none lg:border-r lg:border-border
              overflow-y-auto
            `}
          >
            <nav className="p-4 space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveIndicator(id as typeof activeIndicator);
                    setSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`
                    w-full px-4 py-2 rounded-lg flex items-center gap-3 transition-all text-left
                    ${activeIndicator === id
                      ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400 font-semibold'
                      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Close overlay on mobile when sidebar is open */}
          {sidebarOpen && (
            <div
              className="fixed lg:hidden inset-0 z-30 bg-black/20 top-16"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Content Grid */}
          <div className="flex-1 max-w-7xl mx-auto w-full">
            <div className="space-y-6">
              {/* Overview Panel */}
              {activeIndicator === 'overview' && (
                <Suspense fallback={<div className="h-40 bg-card/50 animate-pulse rounded-lg" />}>
                  <SignalOverview
                    mtmM15Value={signals.mtmM15Value}
                    mtmM15Status={signals.mtmM15Status}
                    mtm1hValue={signals.mtm1hValue}
                    mtm1hStatus={signals.mtm1hStatus}
                    mtm4hValue={signals.mtm4hValue}
                    mtm4hStatus={signals.mtm4hStatus}
                    rvwapStatus={signals.rvwapStatus}
                    rvwap90d={signals.rvwap90d}
                    onIndicatorClick={(indicator) => {
                      setActiveIndicator(indicator as any);
                    }}
                  />
                </Suspense>
              )}

              {/* OE-BTC Indicator */}
              {(activeIndicator === 'overview' || activeIndicator === 'oe-btc') && (
                <Suspense fallback={<div className="h-64 bg-card/50 animate-pulse rounded-lg" />}>
                  <OEBTCIndicator />
                </Suspense>
              )}

              {/* MTM Panel - Two-column layout */}
              {(activeIndicator === 'overview' || activeIndicator === 'mtm') && (
                <Suspense fallback={<div className="h-96 bg-card/50 animate-pulse rounded-lg" />}>
                  <MTMPanel symbol="BTCUSDT" dataSource="futures" />
                </Suspense>
              )}

              {/* RVWAP Panel - Two-column layout */}
              {(activeIndicator === 'overview' || activeIndicator === 'rvwap') && (
                <Suspense fallback={<div className="h-96 bg-card/50 animate-pulse rounded-lg" />}>
                  <RvwapPanel symbol="BTCUSDT" dataSource="spot" />
                </Suspense>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
