import React, { useMemo, useState, useEffect } from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Activity, AlertTriangle } from "lucide-react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format } from 'date-fns';

// Types based on the API contract
interface RiskRegimeResponse {
  history: {
    date: string;      // Format: "YYYY-MM-DD"
    score: number;     // -100 to 100
    btc_price: number; // Price on that date (snapshot)
  }[];
  current_breakdown: {
    name: string;      // Indicator name
    value: number;     // Raw value
    signal: string;    // "Risk On" | "Risk Off" | "Neutral"
    score: number;     // Contribution to total score
  }[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const RISK_API_URL = 'https://api.borkiss.trade/api/risk-regime';
const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=90'; // Fetch slightly more to ensure overlap

export const RoroRegime = () => {
  const { data: riskData, error: riskError, isLoading: riskLoading } = useSWR<RiskRegimeResponse>(RISK_API_URL, fetcher);
  const [btcHistory, setBtcHistory] = useState<Record<string, number>>({});

  // Fetch Binance Data
  useEffect(() => {
    const fetchBinance = async () => {
      try {
        const res = await fetch(BINANCE_API_URL);
        const data = await res.json();
        // Binance kline: [time, open, high, low, close, ...]
        const history: Record<string, number> = {};
        data.forEach((k: any) => {
          const dateStr = format(new Date(k[0]), 'yyyy-MM-dd');
          history[dateStr] = parseFloat(k[4]);
        });
        setBtcHistory(history);
      } catch (e) {
        console.error("Failed to fetch Binance data", e);
      }
    };
    fetchBinance();
  }, []);

  const chartData = useMemo(() => {
    if (!riskData || !riskData.history) return [];
    
    return riskData.history.map(h => {
      // Prefer Binance price if available, else fallback to API snapshot
      const price = btcHistory[h.date] || h.btc_price;
      return {
        date: h.date,
        timestamp: new Date(h.date).getTime(),
        score: h.score,
        btc_price: price
      };
    });
  }, [riskData, btcHistory]);

  const currentScore = useMemo(() => {
    if (!riskData) return 0;
    if (riskData.history && riskData.history.length > 0) {
      return riskData.history[riskData.history.length - 1].score;
    }
    return riskData.current_breakdown.reduce((acc, item) => acc + item.score, 0);
  }, [riskData]);
  
  const getRegime = (score: number) => {
    if (score > 20) return { label: "RISK ON", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (score < -20) return { label: "RISK OFF", color: "text-rose-500", bg: "bg-rose-500/10" };
    return { label: "NEUTRAL", color: "text-yellow-500", bg: "bg-yellow-500/10" };
  };

  const regime = getRegime(currentScore);

  // Gradient Offsets Calculation
  // Range: -100 to 100. Total = 200.
  // Top (100) is 0%. Bottom (-100) is 100%.
  // 0 score is at 50%.
  // 50 score: (100 - 50) / 200 = 0.25 (25%)
  // 20 score: (100 - 20) / 200 = 0.40 (40%)
  // -20 score: (100 - (-20)) / 200 = 0.60 (60%)
  // -50 score: (100 - (-50)) / 200 = 0.75 (75%)
  
  const gradientOffset = () => {
    // This function is static for fixed domain [-100, 100]
    return {
      off50: 0.25,
      off20: 0.40,
      offMinus20: 0.60,
      offMinus50: 0.75
    };
  };

  const off = gradientOffset();

  if (riskLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (riskError) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-destructive">
        Failed to load RORO data
      </div>
    );
  }

  const CustomLegend = () => (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs mb-6 px-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-0.5 bg-foreground"></div>
        <span className="text-muted-foreground font-medium">BTC Price</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#d1c4e9]"></div>
        <span className="text-muted-foreground">Neutral risk-on</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#d7ccc8]"></div>
        <span className="text-muted-foreground">Neutral risk-off</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#9575cd]"></div>
        <span className="text-muted-foreground">Basic risk-on</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#8d6e63]"></div>
        <span className="text-muted-foreground">Basic risk-off</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#673ab7]"></div>
        <span className="text-muted-foreground">Strong bull</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#4e342e]"></div>
        <span className="text-muted-foreground">Strong bear</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Side Panel - Stats */}
      <Card className="lg:col-span-1 border-border/40 bg-card/50 backdrop-blur-sm h-full overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Risk Regime
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Score */}
          <div className={`p-4 rounded-lg border ${regime.bg} border-border/50 text-center space-y-2`}>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Current Status</div>
            <div className={`text-3xl font-bold ${regime.color}`}>{regime.label}</div>
            <div className="text-4xl font-mono font-bold">{currentScore.toFixed(1)}</div>
          </div>

          {/* Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Component Breakdown</h3>
            <div className="space-y-3">
              {riskData?.current_breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                  <div className="space-y-0.5">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.signal}</div>
                  </div>
                  <div className={`font-mono font-bold ${item.score > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {item.score > 0 ? '+' : ''}{item.score.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3 rounded bg-muted/20 text-xs text-muted-foreground border border-border/30">
            <div className="flex items-center gap-2 mb-1 text-foreground font-medium">
              <AlertTriangle className="w-3 h-3" />
              About this metric
            </div>
            The RORO (Risk-On / Risk-Off) score aggregates data from volatility markets, credit spreads, and funding rates to determine the current market appetite for risk assets.
          </div>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card className="lg:col-span-3 border-border/40 bg-card/50 backdrop-blur-sm h-full flex flex-col">
        <CardHeader className="py-4 border-b border-border/40">
          <CardTitle className="text-center text-xl font-medium">Risk-on/Risk-off regime</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 min-h-0 flex flex-col">
          <div className="pt-4">
            <CustomLegend />
          </div>
          <div className="w-full flex-1 min-h-0 px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    {/* Strong Bull (>50) */}
                    <stop offset="0%" stopColor="#673ab7" stopOpacity={0.9} />
                    <stop offset={`${off.off50 * 100}%`} stopColor="#673ab7" stopOpacity={0.9} />
                    
                    {/* Basic Risk-On (20-50) */}
                    <stop offset={`${off.off50 * 100}%`} stopColor="#9575cd" stopOpacity={0.9} />
                    <stop offset={`${off.off20 * 100}%`} stopColor="#9575cd" stopOpacity={0.9} />
                    
                    {/* Neutral Risk-On (0-20) */}
                    <stop offset={`${off.off20 * 100}%`} stopColor="#d1c4e9" stopOpacity={0.9} />
                    <stop offset={`${off.offMinus20 * 100}%`} stopColor="#d1c4e9" stopOpacity={0.9} /> {/* Note: Using same color for 0-20 and -20-0 if desired, or split at 50% */}
                    
                    {/* Correction: Split Neutral at 0 (50%) */}
                    {/* Neutral Risk-On (0-20) -> 40% to 50% */}
                    {/* Neutral Risk-Off (-20-0) -> 50% to 60% */}
                  </linearGradient>
                  
                  <linearGradient id="scoreGradientCorrected" x1="0" y1="0" x2="0" y2="1">
                     {/* Strong Bull (>50) */}
                    <stop offset="0%" stopColor="#673ab7" stopOpacity={0.85} />
                    <stop offset={`${off.off50 * 100}%`} stopColor="#673ab7" stopOpacity={0.85} />
                    
                    {/* Basic Risk-On (20-50) */}
                    <stop offset={`${off.off50 * 100}%`} stopColor="#9575cd" stopOpacity={0.85} />
                    <stop offset={`${off.off20 * 100}%`} stopColor="#9575cd" stopOpacity={0.85} />
                    
                    {/* Neutral Risk-On (0-20) */}
                    <stop offset={`${off.off20 * 100}%`} stopColor="#d1c4e9" stopOpacity={0.85} />
                    <stop offset="50%" stopColor="#d1c4e9" stopOpacity={0.85} />
                    
                    {/* Neutral Risk-Off (-20-0) */}
                    <stop offset="50%" stopColor="#d7ccc8" stopOpacity={0.85} />
                    <stop offset={`${off.offMinus20 * 100}%`} stopColor="#d7ccc8" stopOpacity={0.85} />
                    
                    {/* Basic Risk-Off (-50--20) */}
                    <stop offset={`${off.offMinus20 * 100}%`} stopColor="#8d6e63" stopOpacity={0.85} />
                    <stop offset={`${off.offMinus50 * 100}%`} stopColor="#8d6e63" stopOpacity={0.85} />
                    
                    {/* Strong Bear (<-50) */}
                    <stop offset={`${off.offMinus50 * 100}%`} stopColor="#4e342e" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#4e342e" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => format(new Date(val), 'yyyy-MM-dd')}
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={30}
                  dy={10}
                />
                
                <YAxis 
                  yAxisId="left"
                  domain={[-100, 100]}
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  ticks={[100, 50, 0, -50, -100]}
                />
                
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  domain={['auto', 'auto']}
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => val.toLocaleString()}
                />
                
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const score = payload[0].value as number;
                      const price = payload[1]?.value as number;
                      return (
                        <div className="bg-background/95 backdrop-blur border border-border p-3 rounded shadow-xl text-xs">
                          <div className="font-medium mb-2 text-muted-foreground">{format(new Date(label), 'EEE, dd MMM yyyy')}</div>
                          <div className="flex items-center gap-3 mb-1">
                            <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                            <span className="text-muted-foreground">Risk Score:</span>
                            <span className={`font-bold ${score > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {score.toFixed(1)}
                            </span>
                          </div>
                          {price && (
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-foreground"></div>
                              <span className="text-muted-foreground">BTC Price:</span>
                              <span className="font-mono font-medium text-foreground">
                                ${price.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                <ReferenceLine y={0} yAxisId="left" stroke="rgba(255,255,255,0.1)" />
                
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="score"
                  stroke="none"
                  fill="url(#scoreGradientCorrected)"
                  animationDuration={1000}
                />
                
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="btc_price"
                  stroke="currentColor" 
                  className="text-foreground"
                  strokeWidth={1.5}
                  dot={false}
                  animationDuration={1000}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
