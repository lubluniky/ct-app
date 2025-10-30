import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Crypto Data Proxy
 * Uses alternative data sources since Binance blocks Vercel IPs
 * Fetches from CryptoCompare (free, no geo-restrictions)
 */

interface CryptoCompareOHLCV {
  time: number;
  high: number;
  low: number;
  open: number;
  volumefrom: number;
  volumeto: number;
  close: number;
  conversionType: string;
  conversionSymbol: string;
}

interface AggTrade {
  a: number;    // Aggregate trade ID
  p: string;    // Price
  q: string;    // Quantity
  f: number;    // First trade ID
  l: number;    // Last trade ID
  T: number;    // Timestamp
  m: boolean;   // Was buyer maker (true = sell, false = buy)
  M: boolean;   // Was trade best price match
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { symbol, startTime, endTime, limit } = req.query;

    if (!symbol || !startTime || !endTime) {
      return res.status(400).json({ 
        error: 'Missing required parameters: symbol, startTime, endTime' 
      });
    }

    // Parse symbol (e.g., "BTCUSDT" -> "BTC", "USDT")
    const symbolStr = symbol as string;
    const fsym = symbolStr.replace('USDT', '').replace('BUSD', '').replace('USDC', '');
    const tsym = 'USD';

    const startTimeSec = Math.floor(parseInt(startTime as string) / 1000);
    const endTimeSec = Math.floor(parseInt(endTime as string) / 1000);
    
    console.log(`[crypto-proxy] Fetching ${fsym}/${tsym} from ${new Date(startTimeSec * 1000).toISOString()} to ${new Date(endTimeSec * 1000).toISOString()}`);

    // Use CryptoCompare minute data (free, no restrictions)
    const url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${fsym}&tsym=${tsym}&limit=2000&toTs=${endTimeSec}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[crypto-proxy] CryptoCompare error: ${response.status}`, errorText);
      
      return res.status(response.status).json({
        error: 'Data provider error',
        status: response.status,
        message: errorText,
      });
    }

    const result = await response.json();
    
    if (result.Response === 'Error') {
      console.error('[crypto-proxy] CryptoCompare API error:', result.Message);
      return res.status(500).json({
        error: 'Data provider error',
        message: result.Message,
      });
    }

    const data: CryptoCompareOHLCV[] = result.Data?.Data || [];
    
    // Convert OHLCV data to mock aggregate trades format
    // We'll simulate trades from OHLCV bars
    const trades: AggTrade[] = [];
    let tradeId = 1;

    for (const bar of data) {
      const timestamp = bar.time * 1000;
      
      // Skip if outside requested range
      if (timestamp < parseInt(startTime as string) || timestamp > parseInt(endTime as string)) {
        continue;
      }

      const volume = bar.volumefrom;
      const price = bar.close;
      
      // Create synthetic buy and sell trades based on price movement
      const priceChange = bar.close - bar.open;
      const isBullish = priceChange >= 0;
      
      // Split volume into buy/sell based on price action
      const buyVolume = isBullish ? volume * 0.6 : volume * 0.4;
      const sellVolume = volume - buyVolume;

      // Add buy trade
      if (buyVolume > 0) {
        trades.push({
          a: tradeId++,
          p: price.toString(),
          q: buyVolume.toString(),
          f: tradeId,
          l: tradeId,
          T: timestamp,
          m: false, // buyer maker = buy
          M: true,
        });
      }

      // Add sell trade
      if (sellVolume > 0) {
        trades.push({
          a: tradeId++,
          p: price.toString(),
          q: sellVolume.toString(),
          f: tradeId,
          l: tradeId,
          T: timestamp + 30000, // offset by 30 seconds
          m: true, // buyer maker = sell
          M: true,
        });
      }
    }
    
    console.log(`[crypto-proxy] Success: Generated ${trades.length} synthetic trades from ${data.length} OHLCV bars`);
    
    // Return data with cache headers
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(trades);
    
  } catch (error) {
    console.error('[crypto-proxy] Error:', error);
    
    return res.status(500).json({
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
