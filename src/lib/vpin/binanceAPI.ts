/**
 * Binance API utilities for fetching aggTrades
 */

export interface AggTrade {
  a: number; // Aggregate trade ID
  p: string; // Price
  q: string; // Quantity
  f: number; // First trade ID
  l: number; // Last trade ID
  T: number; // Timestamp
  m: boolean; // Was the buyer the maker?
  M: boolean; // Was the trade the best price match?
}

/**
 * Fetch aggregated trades from Binance Futures API
 * @param symbol Trading pair (e.g., 'BTCUSDT')
 * @param hours Number of hours to fetch (default: 24)
 * @returns Array of aggregated trades
 */
export async function fetchAggTrades(
  symbol: string,
  hours: number = 24
): Promise<AggTrade[]> {
  const url = 'https://fapi.binance.com/fapi/v1/aggTrades';
  const endTime = Date.now();
  const startTime = endTime - hours * 60 * 60 * 1000;
  
  console.log(`[binanceAPI] Fetching aggTrades for ${symbol} (last ${hours}h)`);
  
  const allTrades: AggTrade[] = [];
  let fromId: number | null = null;
  let iterationCount = 0;
  const maxIterations = 150; // Safety limit

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

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
      }
      
      const trades: AggTrade[] = await response.json();

      if (!trades.length) {
        console.log(`[binanceAPI] No more trades, stopping at iteration ${iterationCount}`);
        break;
      }
      
      allTrades.push(...trades);
      
      // Check if we've reached the end time
      const lastTradeTime = trades[trades.length - 1].T;
      if (lastTradeTime >= endTime) {
        console.log(`[binanceAPI] Reached end time at iteration ${iterationCount}`);
        break;
      }
      
      // Set next fromId
      fromId = trades[trades.length - 1].a + 1;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`[binanceAPI] ✅ Fetched ${allTrades.length} trades in ${iterationCount} iterations`);
    
    // Filter trades to be within the exact time range
    const filteredTrades = allTrades.filter(
      trade => trade.T >= startTime && trade.T <= endTime
    );
    
    console.log(`[binanceAPI] ✅ After filtering: ${filteredTrades.length} trades`);
    
    return filteredTrades;
  } catch (error) {
    console.error('[binanceAPI] Error fetching aggTrades:', error);
    throw error;
  }
}

/**
 * Fetch recent aggTrades (for incremental updates)
 * @param symbol Trading pair
 * @param minutes Number of minutes to fetch
 * @param fromTimestamp Optional start timestamp
 */
export async function fetchRecentAggTrades(
  symbol: string,
  minutes: number = 5,
  fromTimestamp?: number
): Promise<AggTrade[]> {
  const url = 'https://fapi.binance.com/fapi/v1/aggTrades';
  const endTime = Date.now();
  const startTime = fromTimestamp || (endTime - minutes * 60 * 1000);

  const params = new URLSearchParams({
    symbol,
    startTime: startTime.toString(),
    endTime: endTime.toString(),
    limit: '1000',
  });

  try {
    const response = await fetch(`${url}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    const trades: AggTrade[] = await response.json();
    console.log(`[binanceAPI] ✅ Fetched ${trades.length} recent trades`);
    
    return trades;
  } catch (error) {
    console.error('[binanceAPI] Error fetching recent aggTrades:', error);
    throw error;
  }
}
