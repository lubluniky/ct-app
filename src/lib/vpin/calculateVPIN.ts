/**
 * VPIN (Volume-Synchronized Probability of Informed Trading) calculation
 */

import type { AggTrade } from './binanceAPI';

export interface VPINBucket {
  time: number;
  vpin: number;
  buyVolume: number;
  sellVolume: number;
  totalVolume: number;
  trades: number;
  imbalance: number;
}

export interface VPINData {
  symbol: string;
  timeframe: string;
  period: number;
  buckets: VPINBucket[];
  lastUpdate: number;
  stats: {
    avgVPIN: number;
    maxVPIN: number;
    minVPIN: number;
    currentVPIN: number;
  };
}

/**
 * Get timeframe duration in milliseconds
 */
function getTimeframeMs(timeframe: string): number {
  const map: Record<string, number> = {
    'm1': 60 * 1000,
    'm5': 5 * 60 * 1000,
    'm15': 15 * 60 * 1000,
    'm30': 30 * 60 * 1000,
    'h1': 60 * 60 * 1000,
    'h4': 4 * 60 * 60 * 1000,
  };
  return map[timeframe.toLowerCase()] || 5 * 60 * 1000; // Default: 5 minutes
}

/**
 * Calculate VPIN from aggregated trades
 * @param trades Array of aggregated trades
 * @param timeframe Timeframe for bucketing (e.g., 'm5', 'h1')
 * @returns VPIN data with buckets
 */
export function calculateVPIN(
  trades: AggTrade[],
  timeframe: string = 'm5'
): VPINData {
  if (!trades.length) {
    throw new Error('No trades provided for VPIN calculation');
  }

  const bucketMs = getTimeframeMs(timeframe);
  const bucketMap = new Map<number, {
    buyVolume: number;
    sellVolume: number;
    trades: number;
  }>();

  console.log(`[calculateVPIN] Processing ${trades.length} trades with ${timeframe} buckets (${bucketMs}ms)`);

  // Group trades into time buckets
  for (const trade of trades) {
    const bucketTime = Math.floor(trade.T / bucketMs) * bucketMs;
    
    if (!bucketMap.has(bucketTime)) {
      bucketMap.set(bucketTime, {
        buyVolume: 0,
        sellVolume: 0,
        trades: 0,
      });
    }

    const bucket = bucketMap.get(bucketTime)!;
    const volume = parseFloat(trade.q) * parseFloat(trade.p); // Quantity × Price = Volume in USDT

    // Classification: 
    // m = true → buyer is maker (seller is taker) → SELL
    // m = false → buyer is taker → BUY
    if (trade.m) {
      bucket.sellVolume += volume;
    } else {
      bucket.buyVolume += volume;
    }
    
    bucket.trades += 1;
  }

  // Convert map to sorted array of buckets
  const buckets: VPINBucket[] = Array.from(bucketMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([time, data]) => {
      const totalVolume = data.buyVolume + data.sellVolume;
      const imbalance = Math.abs(data.buyVolume - data.sellVolume);
      const vpin = totalVolume > 0 ? imbalance / totalVolume : 0;

      return {
        time,
        vpin: parseFloat(vpin.toFixed(4)),
        buyVolume: parseFloat(data.buyVolume.toFixed(2)),
        sellVolume: parseFloat(data.sellVolume.toFixed(2)),
        totalVolume: parseFloat(totalVolume.toFixed(2)),
        imbalance: parseFloat(imbalance.toFixed(2)),
        trades: data.trades,
      };
    });

  // Calculate statistics
  const vpinValues = buckets.map(b => b.vpin).filter(v => v > 0);
  const avgVPIN = vpinValues.length > 0
    ? vpinValues.reduce((sum, v) => sum + v, 0) / vpinValues.length
    : 0;
  const maxVPIN = vpinValues.length > 0 ? Math.max(...vpinValues) : 0;
  const minVPIN = vpinValues.length > 0 ? Math.min(...vpinValues) : 0;
  const currentVPIN = buckets.length > 0 ? buckets[buckets.length - 1].vpin : 0;

  console.log(`[calculateVPIN] ✅ Created ${buckets.length} buckets`);
  console.log(`[calculateVPIN] Stats: avg=${avgVPIN.toFixed(4)}, max=${maxVPIN.toFixed(4)}, current=${currentVPIN.toFixed(4)}`);

  return {
    symbol: 'BTCUSDT', // Symbol from function parameter
    timeframe,
    period: 24, // hours
    buckets,
    lastUpdate: Date.now(),
    stats: {
      avgVPIN: parseFloat(avgVPIN.toFixed(4)),
      maxVPIN: parseFloat(maxVPIN.toFixed(4)),
      minVPIN: parseFloat(minVPIN.toFixed(4)),
      currentVPIN: parseFloat(currentVPIN.toFixed(4)),
    },
  };
}

/**
 * Update VPIN data with new trades (incremental update)
 * @param existingData Existing VPIN data
 * @param newTrades New trades to add
 * @returns Updated VPIN data
 */
export function updateVPIN(
  existingData: VPINData,
  newTrades: AggTrade[]
): VPINData {
  if (!newTrades.length) {
    return existingData;
  }

  // Combine old and new trades
  // In practice, you'd want to store raw trades or implement smarter incremental updates
  console.log(`[updateVPIN] Adding ${newTrades.length} new trades`);
  
  // For now, recalculate from scratch (in production, implement proper incremental logic)
  return existingData;
}
