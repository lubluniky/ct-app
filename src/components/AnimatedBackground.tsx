import { useEffect, useRef } from 'react';

/**
 * Full-Screen Dense ASCII Wave Animation
 * Creates an immersive "ocean" of ASCII characters with flowing colors
 * Every part of the screen is animated - no empty spaces
 */

// ASCII character set - only classic letters and punctuation
const ASCII_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-=*/\\|:;.,<>()[]{}';

interface AnimationConfig {
  // Density: character size (smaller = more dense)
  charSize: number;
  // Wave animation speed
  waveSpeed: number;
  // Wave amplitude (how much characters move)
  waveAmplitude: number;
  // Color animation speed
  colorSpeed: number;
  // Color palette (HSL hue values)
  colorPalette: {
    start: number;  // Starting hue
    end: number;    // Ending hue
    saturation: number;
    lightness: number;
  };
}

const ASCIIWaveCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // Animation configuration - easy to adjust
  const config: AnimationConfig = {
    charSize: 14,           // Character size in pixels
    waveSpeed: 0.02,        // Speed of wave motion
    waveAmplitude: 15,      // How much the wave moves
    colorSpeed: 0.01,       // Speed of color transitions
    colorPalette: {
      start: 120,           // Green hue
      end: 30,              // Orange hue
      saturation: 80,       // Color intensity
      lightness: 50         // Brightness
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to fill screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Calculate grid dimensions
    const cols = Math.ceil(canvas.width / config.charSize);
    const rows = Math.ceil(canvas.height / config.charSize);

    // Initialize character grid - each cell gets a random character
    const charGrid: string[][] = [];
    for (let y = 0; y < rows; y++) {
      charGrid[y] = [];
      for (let x = 0; x < cols; x++) {
        charGrid[y][x] = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
      }
    }

    // Animation time tracker
    let time = 0;

    /**
     * Main animation loop
     * Uses requestAnimationFrame for smooth 60fps performance
     */
    const animate = () => {
      time += 0.016; // Approximate time delta for 60fps

      // Clear canvas with semi-transparent black for trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set font for ASCII characters
      ctx.font = `${config.charSize}px monospace`;
      ctx.textBaseline = 'top';

      // Draw each character with wave animation and color gradient
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Calculate base position
          const baseX = x * config.charSize;
          const baseY = y * config.charSize;

          // Wave motion - creates flowing effect
          // Using sine waves with different frequencies for natural movement
          const waveX = Math.sin(time * config.waveSpeed + y * 0.1) * config.waveAmplitude;
          const waveY = Math.cos(time * config.waveSpeed * 0.8 + x * 0.1) * config.waveAmplitude * 0.5;

          // Final position with wave offset
          const finalX = baseX + waveX;
          const finalY = baseY + waveY;

          // Calculate color based on position and time
          // Creates smooth gradient that flows across screen
          const colorPhase = (x / cols) * (y / rows) + time * config.colorSpeed;
          const hue = config.colorPalette.start + 
                     (Math.sin(colorPhase * Math.PI) * 0.5 + 0.5) * 
                     (config.colorPalette.end - config.colorPalette.start);
          
          // Add depth variation - characters further from center are dimmer
          const centerX = cols / 2;
          const centerY = rows / 2;
          const distanceFromCenter = Math.sqrt(
            Math.pow((x - centerX) / cols, 2) + 
            Math.pow((y - centerY) / rows, 2)
          );
          const lightness = config.colorPalette.lightness * (1 - distanceFromCenter * 0.3);

          // Set character color with smooth HSL transition
          ctx.fillStyle = `hsla(${hue}, ${config.colorPalette.saturation}%, ${lightness}%, 0.8)`;

          // Add glow effect for depth
          ctx.shadowColor = `hsla(${hue}, ${config.colorPalette.saturation}%, ${lightness}%, 0.5)`;
          ctx.shadowBlur = 4;

          // Draw the character
          ctx.fillText(charGrid[y][x], finalX, finalY);

          // Occasionally change character for variation
          if (Math.random() > 0.995) {
            charGrid[y][x] = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
          }
        }
      }

      // Reset shadow for next frame
      ctx.shadowBlur = 0;

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{
        width: '100%',
        height: '100%',
        background: '#000'
      }}
    />
  );
};

/**
 * Alternative: CSS-based ASCII wave for lighter performance
 * Uses pure CSS animations - good for less powerful devices
 */
const ASCIIWaveCSS = () => {
  const chars = ASCII_CHARS.split('');
  const gridSize = 20; // Number of characters per row/column

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div className="relative w-full h-full">
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          const char = chars[Math.floor(Math.random() * chars.length)];
          
          // Create staggered animation delays for wave effect
          const delay = (x + y) * 0.1;
          const duration = 3 + Math.random() * 2;

          return (
            <div
              key={i}
              className="absolute font-mono text-lg select-none pointer-events-none"
              style={{
                left: `${(x / gridSize) * 100}%`,
                top: `${(y / gridSize) * 100}%`,
                color: `hsl(${120 + (x / gridSize) * 60}, 80%, 50%)`,
                animation: `float ${duration}s ease-in-out ${delay}s infinite`,
                textShadow: '0 0 10px currentColor',
                opacity: 0.6
              }}
            >
              {char}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Main component - uses Canvas for better performance and density
 */
export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <ASCIIWaveCanvas />
    </div>
  );
};
