import React, { useState, useMemo } from 'react';
import { QuantChart, ChartDataPoint, Overlay } from './QuantChart';
import { useKlines } from '@/hooks/useKlines';
import { getRecommendedThreshold } from '@/lib/tension';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Activity, Layers, Lock } from 'lucide-react';
import { ShareChartDialog } from '@/components/charts/ShareChartDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { calculateMoneyNoodle } from '@/lib/indicators';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const UnifiedChartPanel = () => {
  const [symbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1h');
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['Market Pulse']);
  const chartRef = React.useRef<HTMLDivElement>(null);
  const { user, profile, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const isProOrUltra = !!(user && (profile?.tier === 'pro' || profile?.tier === 'ultra'));

  // Fetch Data
  // Primary source for candles: Futures (matches MTM Tension)
  const { klines: futuresKlines, tensionData, isLoading: loadingKlines } = useKlines({
    symbol,
    interval,
    lookbackDays: 90, 
    minRefreshMs: 5000, // Update every 5 seconds
    dataSource: 'futures',
  });

  // Merge Data
  const chartData = useMemo(() => {
    if (!futuresKlines.length) return [];

    // Create base map from timestamps
    const dataMap = new Map<number, ChartDataPoint>();
    
    futuresKlines.forEach(k => {
      dataMap.set(k.openTime, {
        timestamp: k.openTime,
        open: k.open,
        high: k.high,
        low: k.low,
        close: k.close,
      });
    });

    // Merge Tension
    tensionData.forEach(t => {
      const point = dataMap.get(t.timestamp);
      if (point) {
        point.tension = t.tensionIndex;
      }
    });

    // Calculate Money Noodle if active
    if (activeIndicators.includes('Money Noodle')) {
        const closes = futuresKlines.map(k => k.close);
        const highs = futuresKlines.map(k => k.high);
        const lows = futuresKlines.map(k => k.low);
        
        const noodle = calculateMoneyNoodle(closes, highs, lows);
        
        // Merge back into dataMap
        futuresKlines.forEach((k, i) => {
            const point = dataMap.get(k.openTime);
            if (point) {
                point.mn_ema1 = noodle.emaFast[i];
                point.mn_ema2 = noodle.emaMedium[i];
                point.mn_main = noodle.emaMain[i];
                point.mn_upper = noodle.upperBand[i];
                point.mn_lower = noodle.lowerBand[i];
            }
        });
    }

    return Array.from(dataMap.values()).sort((a, b) => a.timestamp - b.timestamp);
  }, [futuresKlines, tensionData, activeIndicators]);

  // Define Overlays
  const overlays: Overlay[] = useMemo(() => {
    const list: Overlay[] = [];

    if (activeIndicators.includes('Market Pulse')) {
      list.push({
        id: 'Market Pulse',
        type: 'pulse',
        dataKey: 'tension',
        color: '#06b6d4', // Pulse Cold (Singularity v6) - Cyan-500
        opacity: 0.4,
        threshold: getRecommendedThreshold(interval), // Highlight high tension
      });
    }

    if (activeIndicators.includes('Money Noodle')) {
        // Band Fill (Gray Channel)
        list.push({
            id: 'MN Band',
            type: 'band',
            dataKey: 'mn_upper', // Not used for band but required by type
            upperDataKey: 'mn_upper',
            lowerDataKey: 'mn_lower',
            color: '#94a3b8', // Slate-400
            opacity: 0.1,
        });
        
        // Middle Value (Curve in gray channel)
        list.push({
            id: 'MN Middle',
            type: 'line',
            dataKey: 'mn_main',
            color: '#cbd5e1', // Slate-300
            width: 1,
            opacity: 0.7,
        });

        // Upper Band Border
        list.push({
            id: 'MN Upper',
            type: 'line',
            dataKey: 'mn_upper',
            color: '#475569', // Slate-600
            width: 1,
            opacity: 0.5,
        });

        // Lower Band Border
        list.push({
            id: 'MN Lower',
            type: 'line',
            dataKey: 'mn_lower',
            color: '#475569', // Slate-600
            width: 1,
            opacity: 0.5,
        });

        // EMA 1 (Yellow)
        list.push({
            id: 'MN EMA1',
            type: 'line',
            dataKey: 'mn_ema1',
            color: '#facc15', // Yellow-400
            width: 2,
        });

        // EMA 2 (Pink)
        list.push({
            id: 'MN EMA2',
            type: 'line',
            dataKey: 'mn_ema2',
            color: '#f472b6', // Pink-400
            width: 2,
        });
    }

    return list;
  }, [interval, activeIndicators]);

  return (
    <Card className="w-full h-full border-border/40 bg-card/50 backdrop-blur-sm shadow-sm flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 gap-4 border-b border-border/40">
        <div className="flex items-center gap-4">
            <CardTitle className="text-base font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                {symbol} <span className="text-muted-foreground text-sm font-normal">Perpetual</span>
            </CardTitle>
            
            <Tabs value={interval} onValueChange={setInterval} className="h-7">
                <TabsList className="h-7 bg-secondary/50">
                    <TabsTrigger value="15m" className="text-xs h-6 px-3">15m</TabsTrigger>
                    <TabsTrigger value="1h" className="text-xs h-6 px-3">1h</TabsTrigger>
                    <TabsTrigger value="4h" className="text-xs h-6 px-3">4h</TabsTrigger>
                </TabsList>
            </Tabs>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-2 text-xs border-dashed">
                  <Layers className="h-3.5 w-3.5" />
                  Indicators
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuCheckboxItem
                  checked={activeIndicators.includes('Market Pulse')}
                  onCheckedChange={(checked) => {
                    setActiveIndicators(prev => 
                      checked 
                        ? [...prev, 'Market Pulse']
                        : prev.filter(i => i !== 'Market Pulse')
                    )
                  }}
                >
                  Market Pulse (V4)
                </DropdownMenuCheckboxItem>
                
                {isProOrUltra ? (
                  <DropdownMenuCheckboxItem
                    checked={activeIndicators.includes('Money Noodle')}
                    onCheckedChange={(checked) => {
                      setActiveIndicators(prev => 
                        checked 
                          ? [...prev, 'Money Noodle']
                          : prev.filter(i => i !== 'Money Noodle')
                      )
                    }}
                  >
                    Project SB (preview)
                  </DropdownMenuCheckboxItem>
                ) : (
                  <DropdownMenuItem 
                    className="flex items-center justify-between cursor-pointer text-muted-foreground"
                    onSelect={(e) => {
                      e.preventDefault();
                      if (!user) {
                        toast({
                          title: "Login Required",
                          description: "Please login to access Project SB (preview).",
                          action: <Button variant="outline" size="sm" onClick={() => signInWithGoogle()}>Login</Button>
                        });
                      } else {
                        toast({
                          title: "Access Restricted",
                          description: "Project SB is available for PRO and ULTRA members only.",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    <span>Project SB (preview)</span>
                    <Lock className="h-3 w-3 ml-2" />
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <ShareChartDialog 
          targetRef={chartRef} 
          title={`${symbol} Market Pulse`} 
          symbol={symbol}
          timeframe={interval}
          indicator="Market Pulse"
        />
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
         {loadingKlines && chartData.length === 0 ? (
             <div className="h-full flex items-center justify-center">
                 <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
         ) : (
             <div ref={chartRef} className="w-full h-full bg-background">
               <QuantChart 
                  data={chartData} 
                  overlays={overlays} 
                  height="100%" // Let it fill container
                  className="h-full w-full"
                  mainSeriesName="Price"
               />
             </div>
         )}
      </CardContent>
    </Card>
  );
};
