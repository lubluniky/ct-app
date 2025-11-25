/**
 * Screener Calculations
 * Utility functions for calculating derived metrics
 */

import { KlineData, MicrostructureMetrics, BinanceAggTrade, OpenInterestHistory } from './types';

// ============================================
// VOLATILITY CALCULATIONS
// ============================================

/**
 * Calculate historical volatility from klines (standard deviation of log returns)
 */
export function calculateVolatility(klines: KlineData[]): number | null {
  if (klines.length < 2) return null;
  
  // Calculate log returns
  const logReturns: number[] = [];
  for (let i = 1; i < klines.length; i++) {
    const logReturn = Math.log(klines[i].close / klines[i - 1].close);
    logReturns.push(logReturn);
  }
  
  if (logReturns.length === 0) return null;
  
  // Calculate mean
  const mean = logReturns.reduce((sum, r) => sum + r, 0) / logReturns.length;
  
  // Calculate variance
  const variance = logReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / logReturns.length;
  
  // Return standard deviation (volatility)
  return Math.sqrt(variance);
}

/**
 * Calculate annualized volatility
 * periodsPerYear: 365*24*12 for 5m, 365*24 for 1h, 365 for 1d
 */
export function calculateAnnualizedVolatility(
  klines: KlineData[],
  periodsPerYear: number
): number | null {
  const volatility = calculateVolatility(klines);
  if (volatility === null) return null;
  
  return volatility * Math.sqrt(periodsPerYear);
}

// ============================================
// PRICE CHANGE CALCULATIONS
// ============================================

/**
 * Calculate price change percentage between first and last kline
 */
export function calculatePriceChange(klines: KlineData[]): number | null {
  if (klines.length < 2) return null;
  
  const firstClose = klines[0].close;
  const lastClose = klines[klines.length - 1].close;
  
  return ((lastClose - firstClose) / firstClose) * 100;
}

/**
 * Calculate price change from N periods ago
 */
export function calculatePriceChangeFromPeriods(
  klines: KlineData[],
  periodsBack: number
): number | null {
  if (klines.length < periodsBack + 1) return null;
  
  const startIndex = klines.length - 1 - periodsBack;
  const startClose = klines[startIndex].close;
  const endClose = klines[klines.length - 1].close;
  
  return ((endClose - startClose) / startClose) * 100;
}

// ============================================
// VOLUME CALCULATIONS
// ============================================

/**
 * Calculate total volume for last N klines
 */
export function calculateVolumeSum(klines: KlineData[], periods: number): number | null {
  if (klines.length === 0) return null;
  
  const startIndex = Math.max(0, klines.length - periods);
  let totalVolume = 0;
  
  for (let i = startIndex; i < klines.length; i++) {
    totalVolume += klines[i].quoteVolume; // Using quote volume (USDT)
  }
  
  return totalVolume;
}

/**
 * Calculate volume delta (buy volume - sell volume) from klines
 * Uses taker buy volume as proxy for buy pressure
 */
export function calculateVolumeDelta(klines: KlineData[]): number | null {
  if (klines.length === 0) return null;
  
  let buyVolume = 0;
  let sellVolume = 0;
  
  for (const k of klines) {
    buyVolume += k.takerBuyQuoteVolume;
    sellVolume += k.quoteVolume - k.takerBuyQuoteVolume;
  }
  
  return buyVolume - sellVolume;
}

// ============================================
// OPEN INTEREST CALCULATIONS
// ============================================

/**
 * Calculate OI change over a time period
 */
export function calculateOIChange(
  history: OpenInterestHistory[],
  hoursBack: number
): number | null {
  if (history.length < 2) return null;
  
  const now = Date.now();
  const cutoffTime = now - hoursBack * 60 * 60 * 1000;
  
  // Find the entry closest to cutoff time
  const oldEntry = history.find(h => h.timestamp <= cutoffTime) || history[0];
  const currentEntry = history[history.length - 1];
  
  const oldOI = parseFloat(oldEntry.sumOpenInterestValue);
  const currentOI = parseFloat(currentEntry.sumOpenInterestValue);
  
  return currentOI - oldOI;
}

/**
 * Calculate OI change percentage
 */
export function calculateOIChangePercent(
  history: OpenInterestHistory[],
  hoursBack: number
): number | null {
  if (history.length < 2) return null;
  
  const now = Date.now();
  const cutoffTime = now - hoursBack * 60 * 60 * 1000;
  
  const oldEntry = history.find(h => h.timestamp <= cutoffTime) || history[0];
  const currentEntry = history[history.length - 1];
  
  const oldOI = parseFloat(oldEntry.sumOpenInterestValue);
  const currentOI = parseFloat(currentEntry.sumOpenInterestValue);
  
  if (oldOI === 0) return null;
  
  return ((currentOI - oldOI) / oldOI) * 100;
}

// ============================================
// TICK METRICS
// ============================================

/**
 * Calculate tick count from aggregate trades within a time window
 */
export function calculateTickCount(
  trades: BinanceAggTrade[],
  windowMs: number
): number {
  const now = Date.now();
  const cutoff = now - windowMs;
  
  return trades.filter(t => t.T >= cutoff).length;
}

/**
 * Calculate tick rate (ticks per second)
 */
export function calculateTickRate(
  trades: BinanceAggTrade[],
  windowMs: number
): number {
  const tickCount = calculateTickCount(trades, windowMs);
  const windowSeconds = windowMs / 1000;
  
  return tickCount / windowSeconds;
}

// ============================================
// MICROSTRUCTURE METRICS
// ============================================

/**
 * Calculate microstructure metrics from aggregate trades
 */
export function calculateMicrostructure(
  trades: BinanceAggTrade[],
  windowMs: number,
  currentBid: number,
  currentAsk: number
): MicrostructureMetrics {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Filter trades within window
  const windowTrades = trades.filter(t => t.T >= windowStart);
  
  if (windowTrades.length === 0) {
    return {
      tickCount: 0,
      tickRate: 0,
      buyVolume: 0,
      sellVolume: 0,
      totalVolume: 0,
      imbalance: 0,
      midPriceChange: 0,
      spreadAvg: (currentAsk - currentBid),
      tickVolatility: null,
      microtrend: null,
      windowStart,
      windowEnd: now,
    };
  }
  
  // Calculate volumes
  let buyVolume = 0;
  let sellVolume = 0;
  const prices: number[] = [];
  
  for (const trade of windowTrades) {
    const qty = parseFloat(trade.q);
    const price = parseFloat(trade.p);
    prices.push(price);
    
    // m = true means buyer is maker (taker sold, so this is sell volume)
    if (trade.m) {
      sellVolume += qty * price;
    } else {
      buyVolume += qty * price;
    }
  }
  
  const totalVolume = buyVolume + sellVolume;
  const imbalance = totalVolume > 0 ? (buyVolume - sellVolume) / totalVolume : 0;
  
  // Calculate mid price change
  const firstMid = (currentBid + currentAsk) / 2; // Approximation
  const midPriceChange = prices.length > 1 
    ? (prices[prices.length - 1] - prices[0]) / prices[0] * 100
    : 0;
  
  // Calculate tick volatility (std dev of log prices)
  let tickVolatility: number | null = null;
  if (prices.length > 1) {
    const logReturns: number[] = [];
    for (let i = 1; i < prices.length; i++) {
      logReturns.push(Math.log(prices[i] / prices[i - 1]));
    }
    
    const mean = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
    const variance = logReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / logReturns.length;
    tickVolatility = Math.sqrt(variance);
  }
  
  // Calculate microtrend
  const microtrend = tickVolatility !== null 
    ? Math.sign(midPriceChange) * Math.abs(imbalance)
    : null;
  
  return {
    tickCount: windowTrades.length,
    tickRate: windowTrades.length / (windowMs / 1000),
    buyVolume,
    sellVolume,
    totalVolume,
    imbalance,
    midPriceChange,
    spreadAvg: currentAsk - currentBid,
    tickVolatility,
    microtrend,
    windowStart,
    windowEnd: now,
  };
}

// ============================================
// FORMATTING HELPERS
// ============================================

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatLargeNumber(num: number | null): string {
  if (num === null) return '-';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 1e9) {
    return sign + (absNum / 1e9).toFixed(2) + 'B';
  }
  if (absNum >= 1e6) {
    return sign + (absNum / 1e6).toFixed(2) + 'M';
  }
  if (absNum >= 1e3) {
    return sign + (absNum / 1e3).toFixed(2) + 'K';
  }
  
  return sign + absNum.toFixed(2);
}

/**
 * Format price with appropriate decimals
 */
export function formatPrice(price: number | null): string {
  if (price === null) return '-';
  
  if (price >= 1000) return price.toFixed(2);
  if (price >= 1) return price.toFixed(4);
  if (price >= 0.001) return price.toFixed(6);
  return price.toFixed(8);
}

/**
 * Format percentage with sign
 */
export function formatPercent(percent: number | null): string {
  if (percent === null) return '-';
  
  const sign = percent > 0 ? '+' : '';
  return sign + percent.toFixed(2) + '%';
}

/**
 * Format funding rate (usually very small numbers)
 */
export function formatFundingRate(rate: number | null): string {
  if (rate === null) return '-';
  
  const percent = rate * 100;
  const sign = percent > 0 ? '+' : '';
  return sign + percent.toFixed(4) + '%';
}
