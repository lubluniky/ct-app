/**
 * useVPIN hook for fetching VPIN data with SWR
 * Fetches trades from Binance in browser, calculates VPIN on server
 */

import useSWR from 'swr';

interface VPINBucket {
  timestamp: number;
  vpin: number;
  buyVolume: number;
  sellVolume: number;
  totalVolume: number;
  imbalance: number;
  trades: number;
}

interface VPINData {
  symbol: string;
  timeframe: string;
  timestamp: number;
  currentVPIN: number;
  avgVPIN: number;
  buckets: VPINBucket[];
  totalTrades: number;
  hours: number;
}

interface AggTrade {
  a: number;
  p: string;
  q: string;
  f: number;
  l: number;
  T: number;
  m: boolean;
  M: boolean;
}

interface UseVPINOptions {
  symbol?: string;
  timeframe?: string;
  hours?: number;
  refreshInterval?: number;
}

// Fetch trades directly from Binance (from browser, bypasses Vercel US IP geo-block)
async function fetchBinanceTrades(symbol: string, hours: number): Promise<AggTrade[]> {
  const endTime = Date.now();
  const startTime = endTime - hours * 60 * 60 * 1000;
  
  const allTrades: AggTrade[] = [];
  let fromId: number | null = null;
  let iterationCount = 0;
  const maxIterations = 150;

  console.log(`[useVPIN] Fetching ${hours}h of ${symbol} trades from browser...`);

  while (iterationCount < maxIterations) {
    iterationCount++;
    
    const params = new URLSearchParams({
      symbol,
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      limit: '1000',
    });
    
    if (fromId !== null) {
      params.append('fromId', fromId.toString());
    }

    const response = await fetch(
      `https://api.binance.com/api/v3/aggTrades?${params}`
    );
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    const trades = await response.json() as AggTrade[];

    if (!trades.length) {
      break;
    }
    
    allTrades.push(...trades);
    
    const lastTradeTime = trades[trades.length - 1].T;
    if (lastTradeTime >= endTime) {
      break;
    }
    
    fromId = trades[trades.length - 1].a + 1;
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`[useVPIN] ✅ Fetched ${allTrades.length} trades in ${iterationCount} iterations`);
  
  return allTrades.filter(trade => trade.T >= startTime && trade.T <= endTime);
}

// Calculate VPIN on server (with Redis caching)
async function calculateVPIN(
  trades: AggTrade[],
  symbol: string,
  timeframe: string,
  hours: number
): Promise<VPINData> {
  const response = await fetch('/api/vpin-calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ trades, symbol, timeframe, hours }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to calculate VPIN');
  }

  return response.json();
}

// Combined fetcher: fetch trades from Binance (browser) → calculate on server
const vpinFetcher = async (url: string): Promise<VPINData> => {
  const urlObj = new URL(url, window.location.origin);
  const symbol = urlObj.searchParams.get('symbol') || 'BTCUSDT';
  const timeframe = urlObj.searchParams.get('tf') || 'm5';
  const hours = parseInt(urlObj.searchParams.get('hours') || '24', 10);

  // Step 1: Fetch trades from Binance (bypasses Vercel geo-block)
  const trades = await fetchBinanceTrades(symbol, hours);
  
  // Step 2: Send to server for VPIN calculation + Redis caching
  return calculateVPIN(trades, symbol, timeframe, hours);
};

export function useVPIN(options: UseVPINOptions = {}) {
  const {
    symbol = 'BTCUSDT',
    timeframe = 'm5',
    hours = 24,
    refreshInterval = 60000, // 1 minute
  } = options;

  const apiUrl = `/api/vpin?symbol=${symbol}&tf=${timeframe}&hours=${hours}`;

  const { data, error, isLoading, mutate } = useSWR<VPINData>(
    apiUrl,
    vpinFetcher,
    {
      refreshInterval,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Dedupe requests within 1 minute
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    data,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Unknown error') : null,
    mutate,
    lastUpdated: data?.timestamp ? new Date(data.timestamp) : null,
  };
}
