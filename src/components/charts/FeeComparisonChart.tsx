import { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShareChartDialog } from '@/components/charts/ShareChartDialog';

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export const FeeComparisonChart = () => {
  const [tradeSize, setTradeSize] = useState([10000]);
  // Debounce the chart data update to prevent jitter
  const debouncedTradeSize = useDebounce(tradeSize, 100);

  const data = useMemo(() => {
    const points = [];
    const size = debouncedTradeSize[0];
    
    // Fee Rates (Spot Taker)
    const binanceRate = 0.001; // 0.1%
    const bybitRate = 0.001;   // 0.1%
    const okxRate = 0.0008;    // 0.08%
    const okxRebateRate = 0.0008 * 0.85; // 15% off

    for (let i = 0; i <= 100; i += 5) {
      points.push({
        trades: i,
        Binance: Math.round(i * size * binanceRate),
        Bybit: Math.round(i * size * bybitRate),
        OKX: Math.round(i * size * okxRate),
        'OKX + Rebate': Math.round(i * size * okxRebateRate),
      });
    }
    return points;
  }, [debouncedTradeSize]);

  // Calculate savings based on real-time value for the text display
  const currentSavings = useMemo(() => {
      const size = tradeSize[0];
      const binanceFee = 100 * size * 0.001;
      const okxRebateFee = 100 * size * (0.0008 * 0.85);
      return Math.round(binanceFee - okxRebateFee);
  }, [tradeSize]);

  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Fee Comparison (100 Trades)</CardTitle>
          <CardDescription>
            Cumulative fees based on trade volume. See how much you save with OKX + Rebate.
          </CardDescription>
        </div>
        <ShareChartDialog targetRef={chartRef} title="Fee Comparison" />
      </CardHeader>
      <CardContent>
        <div className="mb-8 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Trade Volume:</span>
            <span className="font-mono font-bold text-primary">${tradeSize[0].toLocaleString()}</span>
          </div>
          <Slider
            value={tradeSize}
            onValueChange={setTradeSize}
            min={10000}
            max={1000000}
            step={10000}
            className="w-full"
          />
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
            <span className="text-muted-foreground text-sm">Potential Savings: </span>
            <span className="text-xl font-bold text-primary ml-2">${currentSavings.toLocaleString()}</span>
          </div>
        </div>

        <div ref={chartRef} className="h-[300px] w-full bg-background">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="trades" 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Number of Trades', position: 'insideBottomRight', offset: -5, fill: '#94a3b8', fontSize: 10 }}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                // Use animation to smooth axis transitions
                allowDataOverflow={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                itemStyle={{ fontSize: '12px' }}
                formatter={(value: number) => [`$${value}`, 'Fees Paid']}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              {/* Binance: Rose (High Fees) */}
              <Line 
                type="monotone" 
                dataKey="Binance" 
                stroke="#e11d48" 
                strokeWidth={3} 
                dot={false} 
                animationDuration={300}
              />
              
              {/* Bybit: Slate (Neutral/Competitor) */}
              <Line 
                type="monotone" 
                dataKey="Bybit" 
                stroke="#64748b" 
                strokeWidth={3} 
                dot={false} 
                strokeDasharray="4 4" 
                animationDuration={300}
              />
              
              {/* OKX Standard: Darker Cyan/Slate */}
              <Line 
                type="monotone" 
                dataKey="OKX" 
                stroke="#334155" 
                strokeWidth={3} 
                dot={false} 
                name="OKX Standard" 
                animationDuration={300}
              />
              
              {/* OKX + Rebate: Cyan (Best/Accent) */}
              <Line 
                type="monotone" 
                dataKey="OKX + Rebate" 
                stroke="#0891b2" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#0891b2' }}
                activeDot={{ r: 6 }}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
