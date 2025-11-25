import React, { useState, useMemo } from 'react';
import { QuantChart, ChartDataPoint, Overlay } from './QuantChart';
import { useKlines } from '@/hooks/useKlines';
import { getRecommendedThreshold } from '@/lib/tension';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Activity, Layers } from 'lucide-react';
import { ShareChartDialog } from '@/components/charts/ShareChartDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { calculateMoneyNoodle } from '@/lib/indicators';

export const UnifiedChartPanel = () => {
  const [symbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1h');
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['Market Pulse']);
  const chartRef = React.useRef<HTMLDivElement>(null);

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
        // Band Fill
        list.push({
            id: 'MN Band',
            type: 'band',
            dataKey: 'mn_upper', // Not used for band but required by type
            upperDataKey: 'mn_upper',
            lowerDataKey: 'mn_lower',
            color: '#808080', // Gray
            opacity: 0.15,
        });
        
        // Upper Band
        list.push({
            id: 'MN Upper',
            type: 'line',
            dataKey: 'mn_upper',
            color: '#ffffff',
            width: 1,
            opacity: 0.5,
        });

        // Lower Band
        list.push({
            id: 'MN Lower',
            type: 'line',
            dataKey: 'mn_lower',
            color: '#ffffff',
            width: 1,
            opacity: 0.5,
        });

        // EMA 1 (Aqua)
        list.push({
            id: 'MN EMA1',
            type: 'line',
            dataKey: 'mn_ema1',
            color: '#00FFFF', // Aqua
            width: 2,
        });

        // EMA 2 (Lime)
        list.push({
            id: 'MN EMA2',
            type: 'line',
            dataKey: 'mn_ema2',
            color: '#00FF00', // Lime
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
                  Market Pulse
                </DropdownMenuCheckboxItem>
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
                  Money Noodle
                </DropdownMenuCheckboxItem>
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
