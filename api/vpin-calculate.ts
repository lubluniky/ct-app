import type { VercelRequest, VercelResponse } from '@vercel/node';

// ==================== TYPES ====================

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

// ==================== REDIS HELPERS ====================

async function redisSet(key: string, value: string, expirySeconds: number): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('[Redis] Missing credentials, skipping cache');
    return;
  }

  try {
    await fetch(`${url}/set/${key}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value, ex: expirySeconds }),
    });
  } catch (error) {
    console.error('[Redis] Error setting cache:', error);
  }
}

async function redisGet(key: string): Promise<string | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    const response = await fetch(`${url}/get/${key}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error('[Redis] Error getting cache:', error);
    return null;
  }
}

// ==================== VPIN CALCULATION ====================

function getTimeframeMs(timeframe: string): number {
  const map: Record<string, number> = {
    'm1': 60 * 1000,
    'm5': 5 * 60 * 1000,
    'm15': 15 * 60 * 1000,
    'm30': 30 * 60 * 1000,
    'h1': 60 * 60 * 1000,
    'h4': 4 * 60 * 60 * 1000,
  };
  return map[timeframe.toLowerCase()] || 5 * 60 * 1000;
}

function calculateVPIN(
  trades: AggTrade[],
  timeframe: string = 'm5',
  hours: number = 24
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
    const volume = parseFloat(trade.q) * parseFloat(trade.p);

    if (trade.m) {
      bucket.sellVolume += volume;
    } else {
      bucket.buyVolume += volume;
    }
    bucket.trades++;
  }

  const sortedBuckets = Array.from(bucketMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([timestamp, data]) => {
      const totalVolume = data.buyVolume + data.sellVolume;
      const imbalance = Math.abs(data.buyVolume - data.sellVolume);
      const vpin = totalVolume > 0 ? imbalance / totalVolume : 0;

      return {
        timestamp,
        vpin,
        buyVolume: data.buyVolume,
        sellVolume: data.sellVolume,
        totalVolume,
        imbalance,
        trades: data.trades,
      };
    });

  const avgVPIN = sortedBuckets.length > 0
    ? sortedBuckets.reduce((sum, b) => sum + b.vpin, 0) / sortedBuckets.length
    : 0;

  const currentVPIN = sortedBuckets.length > 0
    ? sortedBuckets[sortedBuckets.length - 1].vpin
    : 0;

  const symbol = trades[0] ? 'BTCUSDT' : 'UNKNOWN'; // Symbol from trades or default

  console.log(`[calculateVPIN] ✅ Calculated VPIN: current=${currentVPIN.toFixed(4)}, avg=${avgVPIN.toFixed(4)}, buckets=${sortedBuckets.length}`);

  return {
    symbol,
    timeframe,
    timestamp: Date.now(),
    currentVPIN,
    avgVPIN,
    buckets: sortedBuckets,
    totalTrades: trades.length,
    hours,
  };
}

// ==================== API HANDLER ====================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers for browser requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { trades, symbol, timeframe, hours } = req.body;

    if (!trades || !Array.isArray(trades)) {
      return res.status(400).json({ error: 'trades array is required' });
    }

    const symbolStr = symbol || 'BTCUSDT';
    const tf = timeframe || 'm5';
    const hoursNum = hours || 24;

    console.log(`[API] Calculating VPIN for ${symbolStr} (${tf}, ${hoursNum}h) with ${trades.length} trades from client`);

    // Check cache first
    const cacheKey = `vpin:${symbolStr}:${tf}:${hoursNum}`;
    const cached = await redisGet(cacheKey);

    if (cached) {
      console.log('[API] ✅ Cache hit');
      return res.status(200).json(JSON.parse(cached));
    }

    // Calculate VPIN
    const vpinData = calculateVPIN(trades, tf, hoursNum);
    vpinData.symbol = symbolStr;

    // Cache for 1 hour
    await redisSet(cacheKey, JSON.stringify(vpinData), 3600);

    console.log(`[API] ✅ VPIN calculated and cached`);
    
    return res.status(200).json(vpinData);
  } catch (error) {
    console.error('[API] Error:', error);
    
    return res.status(500).json({
      error: 'Failed to calculate VPIN',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined,
    });
  }
}
