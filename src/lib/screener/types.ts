/**
 * Screener Types - All interfaces for the Binance Screener
 */

// ============================================
// BASE TYPES
// ============================================

export interface SymbolInfo {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
  contractType?: string;
}

// ============================================
// PRICE & TICKER DATA
// ============================================

export interface TickerData {
  symbol: string;
  markPrice: number | null;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;           // 24h base volume
  quoteVolume: number;      // 24h quote volume
  weightedAvgPrice: number;
  openPrice: number;
  closeTime: number;
  trades: number;
}

// ============================================
// ORDER BOOK DATA
// ============================================

export interface OrderBookTop {
  symbol: string;
  bidPrice: number;
  bidQty: number;
  askPrice: number;
  askQty: number;
  spread: number;
  spreadPercent: number;
  midPrice: number;
  timestamp: number;
}

// ============================================
// FUTURES-SPECIFIC DATA
// ============================================

export interface FuturesData {
  symbol: string;
  markPrice: number;
  indexPrice: number;
  lastFundingRate: number;
  nextFundingTime: number;
  openInterest: number;        // Current OI in base asset
  openInterestValue: number;   // Current OI in USDT
  time: number;
}

export interface OpenInterestHistory {
  symbol: string;
  sumOpenInterest: string;
  sumOpenInterestValue: string;
  timestamp: number;
}

export interface FundingRateHistory {
  symbol: string;
  fundingRate: string;
  fundingTime: number;
}

// ============================================
// KLINE / OHLC DATA
// ============================================

export interface KlineData {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteVolume: number;
  trades: number;
  takerBuyBaseVolume: number;
  takerBuyQuoteVolume: number;
}

// ============================================
// CALCULATED METRICS
// ============================================

export interface CalculatedMetrics {
  // Volatility metrics
  volatility5m: number | null;
  volatility15m: number | null;
  volatility1h: number | null;
  volatility1d: number | null;
  
  // Price changes
  change5m: number | null;
  change1h: number | null;
  change1d: number | null;
  
  // Volume metrics
  volume5m: number | null;
  volume1h: number | null;
  
  // OI changes
  oiChange1h: number | null;
  oiChange8h: number | null;
  oiChange24h: number | null;
  
  // Tick metrics
  ticks5m: number | null;
  tickRate5m: number | null;  // ticks per second
}

// ============================================
// MICROSTRUCTURE METRICS (Tick-level analysis)
// ============================================

export interface MicrostructureMetrics {
  // Tick analysis
  tickCount: number;
  tickRate: number;           // ticks per second
  
  // Volume analysis
  buyVolume: number;
  sellVolume: number;
  totalVolume: number;
  imbalance: number;          // (buy - sell) / (buy + sell)
  
  // Price analysis
  midPriceChange: number;
  spreadAvg: number;
  
  // Derived metrics
  tickVolatility: number | null;   // std dev of log prices
  microtrend: number | null;       // sign(midPriceChange) * imbalance
  
  // Timestamps
  windowStart: number;
  windowEnd: number;
}

// ============================================
// AGGREGATED SCREENER ROW
// ============================================

export interface ScreenerRow {
  // Identification
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  
  // Price data
  price: number;
  markPrice: number | null;
  
  // 24h ticker data
  priceChangePercent24h: number;
  volume24h: number;
  quoteVolume24h: number;
  highPrice24h: number;
  lowPrice24h: number;
  trades24h: number;
  
  // Order book
  bidPrice: number | null;
  askPrice: number | null;
  spread: number | null;
  spreadPercent: number | null;
  
  // Futures specific
  openInterest: number | null;
  openInterestValue: number | null;
  fundingRate: number | null;
  nextFundingTime: number | null;
  
  // Calculated metrics
  ticks5m: number | null;
  change5m: number | null;
  volume5m: number | null;
  volatility15m: number | null;
  volume1h: number | null;
  vdelta1h: number | null;
  oiChange8h: number | null;
  change1d: number | null;
  
  // Day/Week opens
  dayOpen: number | null;
  weekOpen: number | null;
  
  // Market cap (estimated)
  marketCap: number | null;
  
  // Microstructure
  imbalance: number | null;
  tickVolatility: number | null;
  microtrend: number | null;
  
  // Metadata
  lastUpdate: number;
  isFutures: boolean;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface BinanceTicker24hr {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceFuturesTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  lastPrice: string;
  lastQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceMarkPrice {
  symbol: string;
  markPrice: string;
  indexPrice: string;
  estimatedSettlePrice: string;
  lastFundingRate: string;
  nextFundingTime: number;
  interestRate: string;
  time: number;
}

export interface BinanceOpenInterest {
  symbol: string;
  openInterest: string;
  time: number;
}

export interface BinanceBookTicker {
  symbol: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  time?: number;
}

export interface BinanceAggTrade {
  a: number;           // Aggregate tradeId
  p: string;           // Price
  q: string;           // Quantity
  f: number;           // First tradeId
  l: number;           // Last tradeId
  T: number;           // Timestamp
  m: boolean;          // Was the buyer the maker?
  M: boolean;          // Was the trade the best price match?
}

// ============================================
// SCREENER STATE
// ============================================

export interface ScreenerState {
  symbols: SymbolInfo[];
  data: Map<string, ScreenerRow>;
  loading: boolean;
  error: string | null;
  lastUpdate: number;
}
