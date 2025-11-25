export const calculateEMA = (data: number[], period: number): (number | null)[] => {
  if (data.length < period) return new Array(data.length).fill(null);

  const k = 2 / (period + 1);
  const emaArray: (number | null)[] = new Array(data.length).fill(null);
  
  // Initial SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  emaArray[period - 1] = sum / period;

  for (let i = period; i < data.length; i++) {
    const prevEma = emaArray[i - 1];
    if (prevEma !== null) {
      emaArray[i] = (data[i] * k) + (prevEma * (1 - k));
    }
  }
  
  return emaArray;
};

export const calculateRMA = (data: number[], period: number): (number | null)[] => {
  if (data.length < period) return new Array(data.length).fill(null);
  
  const alpha = 1 / period;
  const rmaArray: (number | null)[] = new Array(data.length).fill(null);

  // Initial SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  rmaArray[period - 1] = sum / period;

  for (let i = period; i < data.length; i++) {
    const prevRma = rmaArray[i - 1];
    if (prevRma !== null) {
      rmaArray[i] = (data[i] * alpha) + (prevRma * (1 - alpha));
    }
  }

  return rmaArray;
};

export const calculateATR = (high: number[], low: number[], close: number[], period: number): (number | null)[] => {
  if (high.length === 0) return [];
  
  const tr = new Array(high.length).fill(0);
  tr[0] = high[0] - low[0];
  
  for(let i = 1; i < high.length; i++) {
    const hl = high[i] - low[i];
    const hc = Math.abs(high[i] - close[i-1]);
    const lc = Math.abs(low[i] - close[i-1]);
    tr[i] = Math.max(hl, hc, lc);
  }

  return calculateRMA(tr, period);
};

export interface MoneyNoodleResult {
  emaFast: (number | null)[];
  emaMedium: (number | null)[];
  emaMain: (number | null)[];
  upperBand: (number | null)[];
  lowerBand: (number | null)[];
}

export const calculateMoneyNoodle = (
  close: number[], 
  high: number[], 
  low: number[],
  params: {
    emaFast: number;
    emaMedium: number;
    emaSlow: number;
    bandMultiplier: number;
    atrLength: number;
    useAtr: boolean;
  } = {
    emaFast: 12,
    emaMedium: 21,
    emaSlow: 35,
    bandMultiplier: 0.0125,
    atrLength: 20,
    useAtr: true
  }
): MoneyNoodleResult => {
  const emaFast = calculateEMA(close, params.emaFast);
  const emaMedium = calculateEMA(close, params.emaMedium);
  const emaMain = calculateEMA(close, params.emaSlow);
  
  const atr = calculateATR(high, low, close, params.atrLength);
  
  const upperBand = new Array(close.length).fill(null);
  const lowerBand = new Array(close.length).fill(null);

  for (let i = 0; i < close.length; i++) {
    const main = emaMain[i];
    if (main === null) continue;

    let offset = 0;
    if (params.useAtr) {
      const atrVal = atr[i];
      if (atrVal !== null) {
        offset = atrVal * params.bandMultiplier * 40;
      }
    } else {
      offset = main * params.bandMultiplier;
    }

    upperBand[i] = main + offset;
    lowerBand[i] = main - offset;
  }

  return {
    emaFast,
    emaMedium,
    emaMain,
    upperBand,
    lowerBand
  };
};
