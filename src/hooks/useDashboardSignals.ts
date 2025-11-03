/**
 * useDashboardSignals hook - aggregates latest signal values for overview panel
 * Fetches latest data from OE-BTC, MTM (M15/1H/4H), RVWAP
 */

import { useEffect, useState } from 'react';
import { useKlines } from './useKlines';

export interface DashboardSignals {
  oeBtcValue?: number;
  mtmM15Value?: number;
  mtmM15Status?: 'bullish' | 'neutral' | 'bearish' | 'loading';
  mtm1hValue?: number;
  mtm1hStatus?: 'bullish' | 'neutral' | 'bearish' | 'loading';
  mtm4hValue?: number;
  mtm4hStatus?: 'bullish' | 'neutral' | 'bearish' | 'loading';
  rvwap90d?: number;
  rvwapStatus?: 'bullish' | 'neutral' | 'bearish' | 'loading';
  isLoading: boolean;
}

export function useDashboardSignals(symbol: string = 'BTCUSDT') {
  const [signals, setSignals] = useState<DashboardSignals>({
    isLoading: true,
  });

  // Fetch OE-BTC data (1 hour interval)
  // Note: OE-BTC is external macro indicator, not currently fetched here
  // Would need to be passed in from parent component

  // Fetch MTM data for three timeframes
  const { klines: klinesM15, tensionData: tensionM15 } = useKlines({
    symbol,
    interval: '15m',
    lookbackDays: 4,
    minRefreshMs: 15000,
    dataSource: 'futures',
  });

  const { klines: klines1h, tensionData: tension1h } = useKlines({
    symbol,
    interval: '1h',
    lookbackDays: 10,
    minRefreshMs: 15000,
    dataSource: 'futures',
  });

  const { klines: klines4h, tensionData: tension4h } = useKlines({
    symbol,
    interval: '4h',
    lookbackDays: 40,
    minRefreshMs: 15000,
    dataSource: 'futures',
  });

  // Fetch RVWAP data
  const { klines: rvwapKlines } = useKlines({
    symbol,
    interval: '1h',
    lookbackDays: 365,
    minRefreshMs: 60000,
    dataSource: 'spot',
  });

  useEffect(() => {
    // Calculate MTM status based on latest tension value
    const getMTMStatus = (tensionData: any[]) => {
      if (!tensionData || tensionData.length === 0) return 'loading';
      const latest = tensionData[tensionData.length - 1];
      const avgTension = tensionData.reduce((sum, d) => sum + d.tensionIndex, 0) / tensionData.length;
      const threshold = avgTension * 1.5; // 50% above average

      if (latest.tensionIndex > threshold) return 'bullish';
      if (latest.tensionIndex < avgTension * 0.5) return 'bearish';
      return 'neutral';
    };

    // Calculate latest tension value
    const getLatestTension = (tensionData: any[]) => {
      if (!tensionData || tensionData.length === 0) return undefined;
      return tensionData[tensionData.length - 1].tensionIndex;
    };

    // Calculate RVWAP status based on price vs 90D VWAP
    // Note: RVWAP status would need to be calculated from actual RVWAP hook data
    // For now, we'll indicate it as loading since we don't have real RVWAP data yet

    setSignals({
      // OE-BTC: would come from parent or external hook
      oeBtcValue: undefined,

      // MTM M15
      mtmM15Value: getLatestTension(tensionM15),
      mtmM15Status: getMTMStatus(tensionM15) as any,

      // MTM 1H
      mtm1hValue: getLatestTension(tension1h),
      mtm1hStatus: getMTMStatus(tension1h) as any,

      // MTM 4H
      mtm4hValue: getLatestTension(tension4h),
      mtm4hStatus: getMTMStatus(tension4h) as any,

      // RVWAP: placeholder (would need real RVWAP calculation)
      rvwap90d: undefined,
      rvwapStatus: 'loading' as const,

      isLoading: false,
    });
  }, [tensionM15, tension1h, tension4h, rvwapKlines]);

  return signals;
}
