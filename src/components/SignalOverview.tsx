/**
 * Signal Overview Panel - Displays all indicator statuses at a glance
 * Shows: OE-BTC, MTM Signals, RVWAP Status, VPIN Status with color codes
 */

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, AlertCircle, Zap, Activity, ChevronRight } from 'lucide-react';
import type { Kline } from '@/lib/binance';

interface SignalStatus {
  name: string;
  icon: React.ReactNode;
  status: 'bullish' | 'neutral' | 'bearish' | 'loading';
  value?: string | number;
  detail?: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface SignalOverviewProps {
  oeBtcValue?: number;
  mtmStatus?: 'bullish' | 'neutral' | 'bearish' | 'loading';
  mtmValue?: number;
  rvwapStatus?: 'bullish' | 'neutral' | 'bearish' | 'loading';
  rvwap90d?: number;
  vpinValue?: number;
  vpinTrend?: 'increasing' | 'decreasing' | 'stable';
  onIndicatorClick?: (indicator: string) => void;
}

export function SignalOverview({
  oeBtcValue,
  mtmStatus = 'loading',
  mtmValue,
  rvwapStatus = 'loading',
  rvwap90d,
  vpinValue,
  vpinTrend = 'stable',
  onIndicatorClick,
}: SignalOverviewProps) {
  const [signals, setSignals] = useState<SignalStatus[]>([]);

  useEffect(() => {
    const getOEBTCStatus = (value?: number) => {
      if (value === undefined) return 'loading' as const;
      if (value > 0.5) return 'bullish' as const;
      if (value < -0.5) return 'bearish' as const;
      return 'neutral' as const;
    };

    const getStatusStyle = (status: string) => {
      switch (status) {
        case 'bullish':
          return {
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/30',
          };
        case 'bearish':
          return {
            color: 'text-red-400',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/30',
          };
        case 'neutral':
          return {
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/30',
          };
        default:
          return {
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30',
          };
      }
    };

    const oeBtcStatus = getOEBTCStatus(oeBtcValue);
    const newSignals: SignalStatus[] = [
      {
        name: 'OE-BTC',
        icon: <Activity className="w-5 h-5" />,
        status: oeBtcStatus,
        value: oeBtcValue?.toFixed(2),
        detail: oeBtcStatus === 'bullish' ? '✓ Risk-On' : oeBtcStatus === 'bearish' ? '✗ Risk-Off' : '≈ Neutral',
        ...getStatusStyle(oeBtcStatus),
      },
      {
        name: 'MTM',
        icon: <Zap className="w-5 h-5" />,
        status: mtmStatus,
        value: mtmValue?.toFixed(0),
        detail: mtmStatus === 'bullish' ? 'Tensioning' : mtmStatus === 'bearish' ? 'Relaxing' : 'Neutral',
        ...getStatusStyle(mtmStatus),
      },
      {
        name: 'RVWAP',
        icon: <TrendingUp className="w-5 h-5" />,
        status: rvwapStatus,
        value: rvwap90d?.toFixed(0),
        detail: rvwapStatus === 'bullish' ? 'Above 90D' : rvwapStatus === 'bearish' ? 'Below 90D' : 'At 90D',
        ...getStatusStyle(rvwapStatus),
      },
      {
        name: 'VPIN',
        icon: <AlertCircle className="w-5 h-5" />,
        status: vpinTrend === 'increasing' ? 'bullish' : vpinTrend === 'decreasing' ? 'bearish' : 'neutral',
        value: vpinValue?.toFixed(4),
        detail: vpinTrend === 'increasing' ? '↗ Increasing' : vpinTrend === 'decreasing' ? '↘ Decreasing' : '→ Stable',
        ...getStatusStyle(vpinTrend === 'increasing' ? 'bullish' : vpinTrend === 'decreasing' ? 'bearish' : 'neutral'),
      },
    ];

    setSignals(newSignals);
  }, [oeBtcValue, mtmStatus, mtmValue, rvwapStatus, rvwap90d, vpinValue, vpinTrend]);

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border border-border/50 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold">Signal Overview</h2>
        </div>

        {/* Signals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {signals.map((signal) => (
            <button
              key={signal.name}
              onClick={() => onIndicatorClick?.(signal.name.toLowerCase())}
              className={`p-3 rounded-lg border transition-all hover:scale-105 cursor-pointer group ${signal.bgColor} ${signal.borderColor} border`}
            >
              {/* Top: Icon + Name */}
              <div className="flex items-center justify-between mb-2">
                <div className={`${signal.color}`}>
                  {signal.icon}
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  {signal.name}
                </span>
              </div>

              {/* Value */}
              {signal.value !== undefined && (
                <div className={`text-sm font-bold mb-1 ${signal.color}`}>
                  {signal.value}
                </div>
              )}

              {/* Detail/Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {signal.detail}
                </span>
                <ChevronRight className={`w-3 h-3 ${signal.color} transition-transform group-hover:translate-x-0.5`} />
              </div>
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="border-t border-border/30 pt-3 mt-4">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>Bullish</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Neutral</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Bearish</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
