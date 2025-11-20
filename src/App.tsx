import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useState } from "react";
import { CenturionLoader } from "@/components/CenturionLoader";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import BonusPage from "./pages/BonusPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Log analytics initialization on mount
  if (typeof window !== 'undefined') {
    console.log('Vercel Analytics active');
  }

  return (
    <QueryClientProvider client={queryClient}>
      {isLoading && <CenturionLoader onComplete={() => setIsLoading(false)} />}
      <div className={isLoading ? "hidden" : ""}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bonus" element={<BonusPage />} />
              
              {/* Redirect old routes to new dashboard */}
              <Route path="/dashboard/mtm" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard/test" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard/rvwap" element={<Navigate to="/dashboard" replace />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Analytics />
        </TooltipProvider>
      </div>
    </QueryClientProvider>
  );
};

export default App;
