import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Binance API Proxy
 * Simple proxy to forward requests to Binance API from server-side
 * This bypasses CORS and allows caching
 */

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
    const { symbol, startTime, endTime, limit, fromId } = req.query;

    if (!symbol || !startTime || !endTime) {
      return res.status(400).json({ 
        error: 'Missing required parameters: symbol, startTime, endTime' 
      });
    }

    // Build Binance API URL
    const params = new URLSearchParams({
      symbol: symbol as string,
      startTime: startTime as string,
      endTime: endTime as string,
      limit: (limit as string) || '1000',
    });

    if (fromId) {
      params.append('fromId', fromId as string);
    }

    const binanceUrl = `https://api.binance.com/api/v3/aggTrades?${params}`;
    
    console.log(`[binance-proxy] Fetching: ${binanceUrl}`);

    // Fetch from Binance
    const response = await fetch(binanceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[binance-proxy] Binance error: ${response.status}`, errorText);
      
      return res.status(response.status).json({
        error: 'Binance API error',
        status: response.status,
        message: errorText,
      });
    }

    const data = await response.json();
    
    console.log(`[binance-proxy] Success: ${data.length} trades`);
    
    // Return data with cache headers
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('[binance-proxy] Error:', error);
    
    return res.status(500).json({
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
