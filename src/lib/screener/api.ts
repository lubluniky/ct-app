/**
 * Binance Screener API Service
 * Handles all API calls to Binance public REST API (spot + futures)
 */

import {
  SymbolInfo,
  BinanceTicker24hr,
  BinanceFuturesTicker,
  BinanceMarkPrice,
  BinanceOpenInterest,
  BinanceBookTicker,
  BinanceAggTrade,
  OpenInterestHistory,
  FundingRateHistory,
  KlineData,
} from './types';

// ============================================
// CONSTANTS
// ============================================

const SPOT_BASE_URL = 'https://api.binance.com/api/v3';
const FUTURES_BASE_URL = 'https://fapi.binance.com/fapi/v1';

// Rate limiting
const REQUEST_DELAY = 50; // ms between requests
let lastRequestTime = 0;

// ============================================
// UTILITY FUNCTIONS
// ============================================

async function rateLimitedFetch(url: string, signal?: AbortSignal): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < REQUEST_DELAY) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  return fetch(url, { signal });
}

function parseKlineResponse(raw: any[]): KlineData[] {
  return raw.map((k) => ({
    openTime: k[0],
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5]),
    closeTime: k[6],
    quoteVolume: parseFloat(k[7]),
    trades: k[8],
    takerBuyBaseVolume: parseFloat(k[9]),
    takerBuyQuoteVolume: parseFloat(k[10]),
  }));
}

// ============================================
// SPOT API
// ============================================

/**
 * Fetch all spot trading symbols
 */
export async function fetchSpotSymbols(signal?: AbortSignal): Promise<SymbolInfo[]> {
  const response = await rateLimitedFetch(`${SPOT_BASE_URL}/exchangeInfo`, signal);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch spot exchange info: ${response.status}`);
  }
  
  const data = await response.json();
  
  return data.symbols
    .filter((s: any) => s.status === 'TRADING' && s.quoteAsset === 'USDT')
    .map((s: any) => ({
      symbol: s.symbol,
      baseAsset: s.baseAsset,
      quoteAsset: s.quoteAsset,
      status: s.status,
    }));
}

/**
 * Fetch 24hr ticker for all spot symbols
 */
export async function fetchSpotTickers(signal?: AbortSignal): Promise<BinanceTicker24hr[]> {
  const response = await rateLimitedFetch(`${SPOT_BASE_URL}/ticker/24hr`, signal);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch spot tickers: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Fetch spot klines (OHLC)
 */
export async function fetchSpotKlines(
  symbol: string,
  interval: string,
  limit: number = 500,
  signal?: AbortSignal
): Promise<KlineData[]> {
  const url = `${SPOT_BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const response = await rateLimitedFetch(url, signal);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch spot klines for ${symbol}: ${response.status}`);
  }
  
  const data = await response.json();
  return parseKlineResponse(data);
}

/**
 * Fetch spot order book ticker (best bid/ask)
 */
export async function fetchSpotBookTickers(signal?: AbortSignal): Promise<BinanceBookTicker[]> {
  const response = await rateLimitedFetch(`${SPOT_BASE_URL}/ticker/bookTicker`, signal);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch spot book tickers: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Fetch recent aggregate trades for a symbol
 */
export async function fetchSpotAggTrades(
  symbol: string,
  limit: number = 500,
  signal?: AbortSignal
): Promise<BinanceAggTrade[]> {
  const url = `${SPOT_BASE_URL}/aggTrades?symbol=${symbol}&limit=${limit}`;
  const response = await rateLimitedFetch(url, signal);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch spot agg trades for ${symbol}: ${response.status}`);
  }
  
  return response.json();
}

// ============================================
// FUTURES API
// ============================================

/**
 * Fetch all futures perpetual symbols
 */
export async function fetchFuturesSymbols(signal?: AbortSignal): Promise<SymbolInfo[]> {
  console.log('[API] Fetching futures exchange info...');
  const response = await rateLimitedFetch(`${FUTURES_BASE_URL}/exchangeInfo`, signal);
  
  if (!response.ok) {
    console.error(`[API] ❌ Failed to fetch futures exchange info: ${response.status}`);
    throw new Error(`Failed to fetch futures exchange info: ${response.status}`);
  }
  
  const data = await response.json();
  console.log(`[API] ✅ Exchange info received, ${data.symbols?.length || 0} total symbols`);
  
  return data.symbols
    .filter((s: any) => s.status === 'TRADING' && s.contractType === 'PERPETUAL')
    .map((s: any) => ({
      symbol: s.symbol,
      baseAsset: s.baseAsset,
      quoteAsset: s.quoteAsset,
      status: s.status,
      contractType: s.contractType,
    }));
}

/**
 * Fetch 24hr ticker for all futures symbols
 */
export async function fetchFuturesTickers(signal?: AbortSignal): Promise<BinanceFuturesTicker[]> {
  console.log('[API] Fetching futures tickers...');
  const response = await rateLimitedFetch(`${FUTURES_BASE_URL}/ticker/24hr`, signal);
  
  if (!response.ok) {
    console.error(`[API] ❌ Failed to fetch futures tickers: ${response.status}`);
    throw new Error(`Failed to fetch futures tickers: ${response.status}`);
  }
  
  const data = await response.json();
  console.log(`[API] ✅ Tickers received: ${data?.length || 0}`);
  return data;
}

/**
 * Fetch mark price and funding rate for all symbols
 */
export async function fetchMarkPrices(signal?: AbortSignal): Promise<BinanceMarkPrice[]> {
  console.log('[API] Fetching mark prices...');
  const response = await rateLimitedFetch(`${FUTURES_BASE_URL}/premiumIndex`, signal);
  
  if (!response.ok) {
    console.error(`[API] ❌ Failed to fetch mark prices: ${response.status}`);
    throw new Error(`Failed to fetch mark prices: ${response.status}`);
  }
  
  const data = await response.json();
  console.log(`[API] ✅ Mark prices received: ${data?.length || 0}`);
  return data;
}

/**
 * Fetch current open interest for a symbol
 */
export async function fetchOpenInterest(
  symbol: string,
  signal?: AbortSignal
): Promise<BinanceOpenInterest> {
  const url = `${FUTURES_BASE_URL}/openInterest?symbol=${symbol}`;
  const response = await rateLimitedFetch(url, signal);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch OI for ${symbol}: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Fetch open interest history (max 30 days back)
 * Period: 5m, 15m, 30m, 1h, 2h, 4h, 6h, 12h, 1d
 */
export async function fetchOpenInterestHistory(
  symbol: string,
  period: string = '1h',
  limit: number = 200,
  signal?: AbortSignal
): Promise<OpenInterestHistory[]> {
  const url = `https://fapi.binance.com/futures/data/openInterestHist?symbol=${symbol}&period=${period}&limit=${limit}`;
  const response = await rateLimitedFetch(url, signal);
  
  if (!response.ok) {
    // This endpoint might not be available for all symbols
    console.warn(`OI history not available for ${symbol}`);
    return [];
  }
  
  return response.json();
}

/**
 * Fetch funding rate history
 */
export async function fetchFundingRateHistory(
  symbol: string,
  limit: number = 100,
  signal?: AbortSignal
): Promise<FundingRateHistory[]> {
  const url = `${FUTURES_BASE_URL}/fundingRate?symbol=${symbol}&limit=${limit}`;
  const response = await rateLimitedFetch(url, signal);
  
  if (!response.ok) {
    console.warn(`Funding rate history not available for ${symbol}`);
    return [];
  }
  
  return response.json();
}

/**
 * Fetch futures klines (OHLC)
 */
export async function fetchFuturesKlines(
  symbol: string,
  interval: string,
  limit: number = 500,
  signal?: AbortSignal
): Promise<KlineData[]> {
  const url = `${FUTURES_BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const response = await rateLimitedFetch(url, signal);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch futures klines for ${symbol}: ${response.status}`);
  }
  
  const data = await response.json();
  return parseKlineResponse(data);
}

/**
 * Fetch futures order book ticker (best bid/ask)
 */
export async function fetchFuturesBookTickers(signal?: AbortSignal): Promise<BinanceBookTicker[]> {
  const response = await rateLimitedFetch(`${FUTURES_BASE_URL}/ticker/bookTicker`, signal);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch futures book tickers: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Fetch recent aggregate trades for a futures symbol
 */
export async function fetchFuturesAggTrades(
  symbol: string,
  limit: number = 500,
  signal?: AbortSignal
): Promise<BinanceAggTrade[]> {
  const url = `${FUTURES_BASE_URL}/aggTrades?symbol=${symbol}&limit=${limit}`;
  const response = await rateLimitedFetch(url, signal);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch futures agg trades for ${symbol}: ${response.status}`);
  }
  
  return response.json();
}

// ============================================
// BATCH FETCHERS (for initial load)
// ============================================

/**
 * Fetch all futures data in parallel
 */
export async function fetchAllFuturesData(signal?: AbortSignal) {
  const [symbols, tickers, markPrices, bookTickers] = await Promise.all([
    fetchFuturesSymbols(signal),
    fetchFuturesTickers(signal),
    fetchMarkPrices(signal),
    fetchFuturesBookTickers(signal),
  ]);
  
  return {
    symbols,
    tickers,
    markPrices,
    bookTickers,
  };
}

/**
 * Fetch OI for multiple symbols with rate limiting
 */
export async function fetchMultipleOpenInterest(
  symbols: string[],
  signal?: AbortSignal
): Promise<Map<string, BinanceOpenInterest>> {
  const result = new Map<string, BinanceOpenInterest>();
  
  // Batch requests to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const promises = batch.map(symbol => 
      fetchOpenInterest(symbol, signal)
        .then(data => ({ symbol, data }))
        .catch(() => null)
    );
    
    const results = await Promise.all(promises);
    results.forEach(r => {
      if (r) result.set(r.symbol, r.data);
    });
    
    // Small delay between batches
    if (i + batchSize < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return result;
}
