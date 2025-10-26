import { useEffect, useRef } from 'react';
import type { IChartApi } from 'lightweight-charts';
import type { TensionDataPoint } from '@/lib/tension';

interface TensionGlowProps {
  chartApi: IChartApi | null;
  tensionData: TensionDataPoint[];
  threshold: number;
  width: number;
  height: number;
}

export const TensionGlow: React.FC<TensionGlowProps> = ({
  chartApi,
  tensionData,
  threshold,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastDrawTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current || !chartApi || tensionData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions for retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const timeScale = chartApi.timeScale();
    const priceScale = chartApi.priceScale('right');

    // Filter high-tension zones
    const highTensionZones = tensionData.filter((d) => d.tensionIndex > threshold);

    // Throttled render at ~30fps
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const render = (timestamp: number) => {
      if (!ctx || !timeScale || !priceScale) return;

      const elapsed = timestamp - lastDrawTimeRef.current;
      if (elapsed < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      lastDrawTimeRef.current = timestamp;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Breathing animation
      const breathingAlpha = 0.05 + 0.03 * Math.sin(timestamp / 1200);

      // Get visible range
      const logicalRange = timeScale.getVisibleLogicalRange();
      if (!logicalRange) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // Render glow for each high-tension zone
      highTensionZones.forEach((point) => {
        const timeSeconds = Math.floor(point.timestamp / 1000);
        
        // Get X coordinate from time
        const x = timeScale.timeToCoordinate(timeSeconds as any);
        if (x === null || x < 0 || x > width) return;

        // Get Y coordinate (bottom of chart area, just above x-axis)
        // Use a fixed bottom position for consistent glow placement
        const y = height - 30; // 30px from bottom to stay above x-axis labels

        // Draw radial gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 60);
        
        // Adjust alpha based on tension intensity
        const intensityFactor = Math.min((point.tensionIndex - threshold) / threshold, 1);
        const alpha = breathingAlpha * intensityFactor;

        gradient.addColorStop(0, `rgba(0, 180, 255, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(0, 150, 255, ${alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(0, 150, 255, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(x - 60, y - 60, 120, 120);
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(render);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [chartApi, tensionData, threshold, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
