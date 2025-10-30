/**
 * VPIN API Route with Redis caching
 * Vercel Serverless Function
 */

import { Redis } from '@upstash/redis';
import { fetchAggTrades } from '../src/lib/vpin/binanceAPI';
import { calculateVPIN } from '../src/lib/vpin/calculateVPIN';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { symbol = 'BTCUSDT', tf = 'm5', hours = '24' } = req.query;
    const hoursNum = parseInt(hours as string);
    const cacheKey = `vpin:${symbol}:${tf}:${hoursNum}h`;

    console.log(`[VPIN API] Request: ${symbol} ${tf} ${hoursNum}h`);

    // 1. Check Redis cache
    console.log(`[VPIN API] Checking cache: ${cacheKey}`);
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log(`[VPIN API] ✅ Cache HIT: ${cacheKey}`);
      
      // Set cache headers
      res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=60');
      res.setHeader('X-Cache-Status', 'HIT');
      
      return res.status(200).json(cached);
    }

    console.log(`[VPIN API] ❌ Cache MISS: ${cacheKey}`);
    console.log(`[VPIN API] Computing VPIN for ${symbol}...`);

    // 2. Fetch aggTrades from Binance
    const startTime = Date.now();
    const trades = await fetchAggTrades(symbol as string, hoursNum);
    const fetchTime = Date.now() - startTime;

    console.log(`[VPIN API] Fetched ${trades.length} trades in ${fetchTime}ms`);

    if (!trades.length) {
      return res.status(404).json({
        error: 'No trades found',
        symbol,
        timeframe: tf,
        hours: hoursNum,
      });
    }

    // 3. Calculate VPIN
    const calcStartTime = Date.now();
    const vpin = calculateVPIN(trades, tf as string);
    const calcTime = Date.now() - calcStartTime;

    console.log(`[VPIN API] Calculated VPIN in ${calcTime}ms`);
    console.log(`[VPIN API] Result: ${vpin.buckets.length} buckets, avg VPIN: ${vpin.stats.avgVPIN}`);

    // 4. Cache for 1 hour (3600 seconds)
    await redis.setex(cacheKey, 3600, JSON.stringify(vpin));
    console.log(`[VPIN API] ✅ Cached result for 1 hour`);

    // 5. Return response
    res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=60');
    res.setHeader('X-Cache-Status', 'MISS');
    res.setHeader('X-Fetch-Time', fetchTime.toString());
    res.setHeader('X-Calc-Time', calcTime.toString());

    return res.status(200).json(vpin);
  } catch (error) {
    console.error('[VPIN API] Error:', error);
    
    return res.status(500).json({
      error: 'Failed to calculate VPIN',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
