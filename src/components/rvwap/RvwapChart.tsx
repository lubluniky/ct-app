/**
 * RVWAP Chart Component using lightweight-charts
 */

import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  ColorType,
  LineSeries,
  CandlestickSeries,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type CandlestickData,
} from 'lightweight-charts';
import type { RvwapDataPoint } from '@/lib/rvwap';
import type { Kline } from '@/lib/binance';
import { Watermark } from '@/components/Watermark';

export interface RvwapChartProps {
  data: RvwapDataPoint[];
  klines: Kline[];
  height?: number;
  className?: string;
}

export function RvwapChart({ data, klines, height = 400, className = '' }: RvwapChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const isInitializedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log('[RvwapChart] 🔴 Component render called with data:', data.length, 'klines:', klines.length);

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return;

    const initChart = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        requestAnimationFrame(initChart);
        return;
      }

      try {
        const chart = createChart(containerRef.current, {
          width: rect.width,
          height,
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: 'rgba(255, 255, 255, 0.6)',
          },
          grid: {
            vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
            horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
          },
          crosshair: {
            mode: 1,
            vertLine: {
              color: 'rgba(255, 255, 255, 0.3)',
              width: 1,
              style: 2,
              labelBackgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
            horzLine: {
              color: 'rgba(255, 255, 255, 0.3)',
              width: 1,
              style: 2,
              labelBackgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          },
          timeScale: {
            borderColor: 'rgba(255, 255, 255, 0.2)',
            timeVisible: true,
            secondsVisible: false,
            barSpacing: 3,
            rightOffset: 0,
            fixLeftEdge: true,
            fixRightEdge: false,
          },
          rightPriceScale: {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          handleScroll: false,
          handleScale: false,
        });

        console.log('[RvwapChart] 📊 Chart object created:', {
          width: rect.width,
          height,
          hasChart: !!chart,
        });

        // Add line series for RVWAP line
        const lineSeries = chart.addSeries(LineSeries, {
          color: '#00b4ff',
          lineWidth: 2, // Thinner line
          priceLineVisible: true,
          lastValueVisible: true,
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 4,
        });

        console.log('[RvwapChart] 📈 LineSeries added:', {
          hasLineSeries: !!lineSeries,
          color: '#00b4ff',
          lineWidth: 2,
        });

        // Add candlestick series below RVWAP line
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderUpColor: '#26a69a',
          borderDownColor: '#ef5350',
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });

        console.log('[RvwapChart] 🕯️ CandlestickSeries added');

        chartRef.current = chart;
        lineSeriesRef.current = lineSeries;
        candlestickSeriesRef.current = candlestickSeries;
        isInitializedRef.current = true;

        console.log('[RvwapChart] ✅ Chart initialized successfully');

        // 🔥 CRITICAL: If data is already available, set it now!
        if (data.length > 0 && klines.length > 0) {
          console.log('[RvwapChart] 🔥 Data already available, setting immediately:', {
            rvwap: data.length,
            klines: klines.length,
          });
          
          const lineData: LineData[] = data.map((d) => ({
            time: (d.timestamp / 1000) as any,
            value: d.vwap,
          }));

          const candleData: CandlestickData[] = klines.map((k) => ({
            time: (k.openTime / 1000) as any,
            open: k.open,
            high: k.high,
            low: k.low,
            close: k.close,
          }));

          lineSeries.setData(lineData);
          candlestickSeries.setData(candleData);
          chart.timeScale().fitContent();
          
          console.log('[RvwapChart] ✅ Initial data set successfully (RVWAP + Candles)');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('[RvwapChart] ❌ Failed to initialize:', error);
      }
    };

    requestAnimationFrame(initChart);

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        lineSeriesRef.current = null;
        candlestickSeriesRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [height]);

  // Update data
  useEffect(() => {
    console.log('[RvwapChart] 🔄 Update effect triggered:', {
      dataLength: data.length,
      klinesLength: klines.length,
      hasLineSeries: !!lineSeriesRef.current,
      hasCandlestickSeries: !!candlestickSeriesRef.current,
      hasChart: !!chartRef.current,
      isInitialized: isInitializedRef.current,
    });
    
    if (!lineSeriesRef.current || !candlestickSeriesRef.current || !chartRef.current || data.length === 0 || klines.length === 0) {
      console.log('[RvwapChart] ⚠️ Update skipped:', {
        hasLineSeries: !!lineSeriesRef.current,
        hasCandlestickSeries: !!candlestickSeriesRef.current,
        hasChart: !!chartRef.current,
        dataLength: data.length,
        klinesLength: klines.length,
      });
      return;
    }

    setIsLoading(true);

    try {
      const lineData: LineData[] = data.map((d) => ({
        time: (d.timestamp / 1000) as any,
        value: d.vwap,
      }));

      const candleData: CandlestickData[] = klines.map((k) => ({
        time: (k.openTime / 1000) as any,
        open: k.open,
        high: k.high,
        low: k.low,
        close: k.close,
      }));

      console.log('[RvwapChart] 📝 Calling setData with:', {
        rvwapPoints: lineData.length,
        candlePoints: candleData.length,
        firstRvwap: lineData[0],
        firstCandle: candleData[0],
      });

      lineSeriesRef.current.setData(lineData);
      candlestickSeriesRef.current.setData(candleData);

      console.log('[RvwapChart] ✅ setData completed (RVWAP + Candles)');

      // Fit content to show all data
      chartRef.current.timeScale().fitContent();

      console.log('[RvwapChart] ✅ fitContent completed');

      console.log('[RvwapChart] 📊 Updated data:', {
        points: lineData.length,
        firstTime: new Date(data[0].timestamp).toISOString(),
        lastTime: new Date(data[data.length - 1].timestamp).toISOString(),
        firstVwap: data[0].vwap.toFixed(2),
        lastVwap: data[data.length - 1].vwap.toFixed(2),
      });

      setTimeout(() => setIsLoading(false), 300);
    } catch (error) {
      console.error('[RvwapChart] ❌ Error setting data:', error);
      setIsLoading(false);
    }
  }, [data, klines]); // Add klines to dependencies

  // Handle resize
  useEffect(() => {
    if (!containerRef.current || !isInitializedRef.current) return;

    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        chartRef.current.applyOptions({ width: rect.width });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        background: '#1a1a1a', // Lighter background so chart is visible
        borderRadius: '8px',
      }}
    >
      <Watermark visible={!isLoading} text="borkiss.trade RVWAP" opacity={0.04} fontSize={48} />
    </div>
  );
}
