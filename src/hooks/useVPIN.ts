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

// Fetch trades via CORS proxy (Binance blocks direct browser requests)
async function fetchBinanceTrades(symbol: string, hours: number): Promise<AggTrade[]> {
  const endTime = Date.now();
  const startTime = endTime - hours * 60 * 60 * 1000;
  
  const allTrades: AggTrade[] = [];
  let fromId: number | null = null;
  let iterationCount = 0;
  const maxIterations = 150;

  console.log(`[useVPIN] Fetching ${hours}h of ${symbol} trades via CORS proxy...`);

  // List of CORS proxies to try
  const proxies = [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
  ];

  try {
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

      const binanceUrl = `https://api.binance.com/api/v3/aggTrades?${params}`;
      
      // Try each proxy until one works
      let trades: AggTrade[] | null = null;
      let lastError: Error | null = null;

      for (const proxyFn of proxies) {
        try {
          const proxyUrl = proxyFn(binanceUrl);
          console.log(`[useVPIN] Iteration ${iterationCount}: trying proxy...`);

          const response = await fetch(proxyUrl);
          
          if (!response.ok) {
            console.warn(`[useVPIN] Proxy returned ${response.status}, trying next...`);
            continue;
          }
          
          trades = await response.json() as AggTrade[];
          console.log(`[useVPIN] ✅ Iteration ${iterationCount}: received ${trades.length} trades`);
          break; // Success!
        } catch (err) {
          lastError = err as Error;
          console.warn(`[useVPIN] Proxy failed:`, err);
          continue; // Try next proxy
        }
      }

      if (!trades) {
        throw new Error(`All proxies failed. Last error: ${lastError?.message || 'Unknown'}`);
      }

      if (!trades.length) {
        console.log(`[useVPIN] No more trades at iteration ${iterationCount}`);
        break;
      }
      
      allTrades.push(...trades);
      
      const lastTradeTime = trades[trades.length - 1].T;
      if (lastTradeTime >= endTime) {
        console.log(`[useVPIN] Reached end time at iteration ${iterationCount}`);
        break;
      }
      
      fromId = trades[trades.length - 1].a + 1;
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    const filteredTrades = allTrades.filter(trade => trade.T >= startTime && trade.T <= endTime);
    console.log(`[useVPIN] ✅ Fetched ${allTrades.length} trades total, ${filteredTrades.length} after filtering`);
    
    return filteredTrades;
  } catch (error) {
    console.error('[useVPIN] Error fetching trades:', error);
    throw error;
  }
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
  try {
    const urlObj = new URL(url, window.location.origin);
    const symbol = urlObj.searchParams.get('symbol') || 'BTCUSDT';
    const timeframe = urlObj.searchParams.get('tf') || 'm5';
    const hours = parseInt(urlObj.searchParams.get('hours') || '24', 10);

    console.log(`[vpinFetcher] Starting fetch for ${symbol} (${timeframe}, ${hours}h)`);

    // Step 1: Fetch trades from Binance (bypasses Vercel geo-block)
    const trades = await fetchBinanceTrades(symbol, hours);
    
    if (!trades.length) {
      throw new Error('No trades received from Binance');
    }

    console.log(`[vpinFetcher] Sending ${trades.length} trades to server for calculation...`);
    
    // Step 2: Send to server for VPIN calculation + Redis caching
    const vpinData = await calculateVPIN(trades, symbol, timeframe, hours);
    
    console.log(`[vpinFetcher] ✅ VPIN calculated successfully`);
    return vpinData;
  } catch (error) {
    console.error('[vpinFetcher] Error:', error);
    throw error;
  }
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
