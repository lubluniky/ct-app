
import type { VercelRequest, VercelResponse } from '@vercel/node';

const SYMBOLS = {
  'BTC': 'BTC-USD',
  'ES': 'ES=F',       // S&P 500 Futures
  'NQ': 'NQ=F',       // Nasdaq 100 Futures
  'DXY': 'DX-Y.NYB',  // US Dollar Index
  'RTY': 'RTY=F',     // Russell 2000 Futures
  'GOLD': 'GC=F',     // Gold Futures
  'NIKKEI': '^N225',  // Nikkei 225
  'US10Y': '^TNX',    // 10 Year Treasury Yield
  'US02Y': '^IRX'     // Using 13 Week Bill as proxy or try to find 2Y. 
                      // Actually, let's use ZT=F (2-Year T-Note Futures) or just skip if unreliable.
                      // Yahoo has ^IRX (13 week), ^FVX (5 year), ^TNX (10 year), ^TYX (30 year).
                      // Let's use ^FVX (5 Year) as a proxy for short term if 2Y is missing, 
                      // or just stick to what we can find. 
                      // Let's try 'ZT=F' for 2-Year Note Futures.
};

// Map for display names
const DISPLAY_NAMES = {
  'ES': 'S&P 500',
  'NQ': 'Nasdaq 100',
  'DXY': 'DXY',
  'RTY': 'Russell 2000',
  'GOLD': 'Gold',
  'NIKKEI': 'Nikkei 225',
  'US10Y': 'US 10Y Yield',
  'US02Y': 'US 2Y Note'
};

async function fetchYahooData(symbol: string) {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=90d&interval=1d`
    );
    const data = await response.json();
    
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      return null;
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const close = result.indicators.quote[0].close;

    return timestamps.map((t: number, i: number) => ({
      timestamp: t,
      close: close[i]
    })).filter((d: any) => d.close !== null && d.close !== undefined);
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

function calculateCorrelation(x: number[], y: number[]) {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  return numerator / denominator;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1. Fetch BTC Data
    const btcData = await fetchYahooData(SYMBOLS.BTC);
    if (!btcData) {
      return res.status(500).json({ error: 'Failed to fetch BTC data' });
    }

    const results = [];

    // 2. Fetch and Calculate for each symbol
    for (const [key, symbol] of Object.entries(SYMBOLS)) {
      if (key === 'BTC') continue;

      const assetData = await fetchYahooData(symbol);
      
      if (assetData) {
        // Align data
        // We need to match timestamps (daily closes)
        // Since crypto trades 24/7 and stocks don't, we'll use the dates that exist in both.
        
        const btcMap = new Map(btcData.map((d: any) => {
            // Normalize to date string YYYY-MM-DD to ignore time differences
            const date = new Date(d.timestamp * 1000).toISOString().split('T')[0];
            return [date, d.close];
        }));

        const alignedX: number[] = []; // BTC
        const alignedY: number[] = []; // Asset

        assetData.forEach((d: any) => {
            const date = new Date(d.timestamp * 1000).toISOString().split('T')[0];
            if (btcMap.has(date)) {
                alignedX.push(btcMap.get(date) as number);
                alignedY.push(d.close);
            }
        });

        // Calculate correlation on the last 30 data points (approx 30 trading days)
        const lookback = 30;
        const sliceX = alignedX.slice(-lookback);
        const sliceY = alignedY.slice(-lookback);
        
        // Get dates for the slice
        const dates = [];
        let dateIndex = 0;
        // Re-iterate to find dates matching the slice (a bit inefficient but safe)
        // Better: store dates in alignment
        const alignedDates: string[] = [];
        assetData.forEach((d: any) => {
            const date = new Date(d.timestamp * 1000).toISOString().split('T')[0];
            if (btcMap.has(date)) {
                alignedDates.push(date);
            }
        });
        const sliceDates = alignedDates.slice(-lookback);

        const correlation = calculateCorrelation(sliceX, sliceY);

        const history = sliceDates.map((date, i) => ({
            date,
            btcPrice: sliceX[i],
            assetPrice: sliceY[i]
        }));

        results.push({
          id: key,
          name: DISPLAY_NAMES[key as keyof typeof DISPLAY_NAMES] || key,
          symbol: symbol,
          correlation: correlation,
          lastPrice: assetData[assetData.length - 1].close,
          dataPoints: sliceY.length,
          history: history
        });
      }
    }

    res.status(200).json({ 
      btcPrice: btcData[btcData.length - 1].close,
      correlations: results 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
