import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useChartDimensions } from './useChartDimensions';

export interface ChartDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  [key: string]: any; // Allow extra properties for overlays
}

export interface Overlay {
  id: string;
  type: 'line' | 'histogram' | 'area';
  dataKey: string;
  color: string;
  width?: number;
  opacity?: number;
  threshold?: number; // For histogram coloring
}

interface QuantChartProps {
  data: ChartDataPoint[];
  overlays?: Overlay[];
  height?: number;
  className?: string;
  showGrid?: boolean;
  padding?: { top: number; bottom: number };
}

export const QuantChart: React.FC<QuantChartProps> = ({
  data,
  overlays = [],
  height = 400,
  className = '',
  showGrid = true,
  padding = { top: 20, bottom: 30 },
}) => {
  const { containerRef, dimensions } = useChartDimensions();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Interaction State
  const [hoverData, setHoverData] = useState<ChartDataPoint | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState(0); // Bars from right edge
  const [zoom, setZoom] = useState(1); // Scale factor
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; offset: number } | null>(null);

  // Configuration
  const baseCandleWidth = 5;
  const gapRatio = 0.4;
  const candleWidth = Math.max(1, baseCandleWidth * zoom);
  const gap = Math.max(0, candleWidth * gapRatio);
  const totalBarWidth = candleWidth + gap;

  // Calculate visible range and scales
  const { visibleData, minPrice, maxPrice, priceRange, scaleY, startIndex } = useMemo(() => {
    if (!dimensions.width || data.length === 0) {
      return { visibleData: [], minPrice: 0, maxPrice: 0, priceRange: 0, scaleY: 0, startIndex: 0 };
    }

    const maxVisibleBars = Math.floor(dimensions.width / totalBarWidth);
    // offset 0 means we see the last maxVisibleBars
    // offset > 0 means we shift back
    const end = data.length - Math.floor(offset);
    const start = Math.max(0, end - maxVisibleBars);
    
    // If we scrolled too far left (start < 0 is handled by max(0)), but if end < 0?
    // We should clamp offset.
    
    const visibleData = data.slice(start, Math.max(start, end));

    let min = Infinity;
    let max = -Infinity;

    visibleData.forEach((d) => {
      min = Math.min(min, d.low);
      max = Math.max(max, d.high);
      overlays.forEach(o => {
        const val = d[o.dataKey];
        if (typeof val === 'number' && o.type !== 'histogram') {
             min = Math.min(min, val);
             max = Math.max(max, val);
        }
      });
    });

    if (min === Infinity) { min = 0; max = 100; }

    const range = max - min;
    const paddedMin = min - range * 0.1;
    const paddedMax = max + range * 0.1;

    return {
      visibleData,
      minPrice: paddedMin,
      maxPrice: paddedMax,
      priceRange: paddedMax - paddedMin,
      scaleY: (dimensions.height - padding.top - padding.bottom) / (paddedMax - paddedMin || 1),
      startIndex: start,
    };
  }, [data, dimensions.width, dimensions.height, overlays, padding, offset, totalBarWidth]);

  // Helper to convert price to Y coordinate
  const getY = (price: number) => {
    return dimensions.height - padding.bottom - (price - minPrice) * scaleY;
  };

  // Helper to convert index to X coordinate
  const getX = (index: number) => {
    return index * totalBarWidth + totalBarWidth / 2;
  };

  // Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, offset });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });

    // Dragging Logic
    if (isDragging && dragStart) {
      const dx = e.clientX - dragStart.x;
      const barsMoved = dx / totalBarWidth;
      // Dragging right (dx > 0) -> Move into history -> Increase offset
      const newOffset = Math.max(0, dragStart.offset + barsMoved);
      setOffset(newOffset);
      return; // Skip hover update while dragging for performance?
    }

    // Hover Logic
    const index = Math.floor((x) / totalBarWidth);
    if (index >= 0 && index < visibleData.length) {
      setHoverData(visibleData[index]);
    } else {
      setHoverData(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Prevent default page scroll if inside chart
    // Note: React synthetic events might need passive: false in native listener for preventDefault to work reliably for wheel
    // But here we just update state.
    
    if (Math.abs(e.deltaY) > 0) {
        const zoomSpeed = 0.001;
        const scrollSpeed = 0.5;

        if (e.ctrlKey || e.metaKey) {
            // Zoom
            const newZoom = Math.max(0.1, Math.min(5, zoom - e.deltaY * zoomSpeed));
            setZoom(newZoom);
        } else {
            // Scroll
            // deltaY > 0 (scroll down) -> move forward (decrease offset)
            // deltaY < 0 (scroll up) -> move back (increase offset)
            const newOffset = Math.max(0, offset - (e.deltaY * scrollSpeed / totalBarWidth));
            setOffset(newOffset);
        }
    }
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setHoverData(null);
    setIsDragging(false);
    setDragStart(null);
  };

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dimensions.width || !dimensions.height) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw Grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      
      // Horizontal lines
      const gridSteps = 5;
      for (let i = 0; i <= gridSteps; i++) {
        const y = padding.top + (i * (dimensions.height - padding.top - padding.bottom)) / gridSteps;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }
    }

    // Draw Overlays (Lines)
    overlays.filter(o => o.type === 'line').forEach(overlay => {
      ctx.beginPath();
      ctx.strokeStyle = overlay.color;
      ctx.lineWidth = overlay.width || 2;
      
      let started = false;
      visibleData.forEach((d, i) => {
        const val = d[overlay.dataKey];
        if (typeof val !== 'number') return;
        
        const x = getX(i);
        const y = getY(val);
        
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    });

    // Draw Candles
    visibleData.forEach((d, i) => {
      const x = getX(i);
      const openY = getY(d.open);
      const closeY = getY(d.close);
      const highY = getY(d.high);
      const lowY = getY(d.low);

      const isUp = d.close >= d.open;
      const color = isUp ? '#10B981' : '#EF4444'; // Emerald-500 : Red-500

      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      // Wick
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Body
      const bodyHeight = Math.max(1, Math.abs(closeY - openY));
      const bodyY = Math.min(openY, closeY);
      ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
    });

    // Draw Histograms (Separate scale usually, let's put them at bottom 20% height)
    overlays.filter(o => o.type === 'histogram').forEach(overlay => {
      const histHeight = dimensions.height * 0.2;
      const histBottom = dimensions.height - padding.bottom;
      
      // Find max value for scaling
      let maxVal = 0;
      visibleData.forEach(d => {
        const val = d[overlay.dataKey];
        if (typeof val === 'number') maxVal = Math.max(maxVal, val);
      });
      
      if (maxVal === 0) maxVal = 1;

      visibleData.forEach((d, i) => {
        const val = d[overlay.dataKey];
        if (typeof val !== 'number') return;

        const x = getX(i);
        const barHeight = (val / maxVal) * histHeight;
        const y = histBottom - barHeight;
        
        // Color logic based on threshold
        let color = overlay.color;
        if (overlay.threshold && val > overlay.threshold) {
            color = '#22D3EE'; // Cyan for high tension
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = overlay.opacity || 0.5;
        ctx.fillRect(x - candleWidth / 2, y, candleWidth, barHeight);
        ctx.globalAlpha = 1.0;
      });
    });

  }, [dimensions, visibleData, minPrice, maxPrice, overlays, showGrid]);

  // Interaction Layer
  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas || !dimensions.width || !dimensions.height) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    if (mousePos && hoverData) {
      const x = mousePos.x;
      const y = mousePos.y;

      // Crosshair
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;

      // Vertical
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, dimensions.height);
      ctx.stroke();

      // Horizontal
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(dimensions.width, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Price Label (Right)
      const price = minPrice + ((dimensions.height - padding.bottom - y) / scaleY);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(dimensions.width - 60, y - 10, 60, 20);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(price.toFixed(2), dimensions.width - 55, y + 4);

      // Time Label (Bottom)
      const date = new Date(hoverData.timestamp);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x - 25, dimensions.height - 20, 50, 20);
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText(timeStr, x, dimensions.height - 6);
      
      // Highlight current candle
      // Find index
      const index = visibleData.indexOf(hoverData);
      if (index >= 0) {
          const candleX = getX(index);
          // Glow effect
          ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
          ctx.shadowBlur = 10;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(candleX - candleWidth/2 - 1, padding.top, candleWidth + 2, dimensions.height - padding.bottom - padding.top);
          ctx.shadowBlur = 0;
      }
    }
  }, [mousePos, hoverData, dimensions, minPrice, scaleY, visibleData]);

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`} 
      style={{ height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Main Chart Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Interaction Layer */}
      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0 z-20 cursor-crosshair"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Floating Tooltip */}
      {hoverData && (
        <div className="absolute top-2 left-2 z-30 bg-background/80 backdrop-blur-sm border border-border p-2 rounded text-xs font-mono shadow-lg pointer-events-none">
          <div className="flex gap-4">
            <span className="text-muted-foreground">O: <span className="text-foreground">{hoverData.open.toFixed(2)}</span></span>
            <span className="text-muted-foreground">H: <span className="text-foreground">{hoverData.high.toFixed(2)}</span></span>
            <span className="text-muted-foreground">L: <span className="text-foreground">{hoverData.low.toFixed(2)}</span></span>
            <span className="text-muted-foreground">C: <span className={`font-bold ${hoverData.close >= hoverData.open ? 'text-emerald-500' : 'text-red-500'}`}>{hoverData.close.toFixed(2)}</span></span>
          </div>
          {overlays.map(o => {
             const val = hoverData[o.dataKey];
             if (typeof val !== 'number') return null;
             return (
               <div key={o.id} className="mt-1 flex gap-2">
                 <span style={{ color: o.color }}>{o.id}:</span>
                 <span>{val.toFixed(2)}</span>
               </div>
             );
          })}
        </div>
      )}
    </div>
  );
};
