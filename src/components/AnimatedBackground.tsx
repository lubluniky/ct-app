import { useEffect, useRef, useState } from 'react';

/**
 * Interactive ASCII Pattern Background
 * Features:
 * - White ASCII on black background for high contrast
 * - Forms recognizable geometric patterns (star, spiral, wave)
 * - Reacts to mouse movement and scroll
 * - Fully customizable via config object
 * - Non-intrusive opacity to keep main content readable
 */

// ASCII character set - classic letters and numbers only
const ASCII_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Pattern types available
type PatternType = 'star' | 'spiral' | 'wave' | 'grid' | 'circle';

interface AnimationConfig {
  // Pattern configuration
  pattern: PatternType;
  charSize: number;          // Size of each character
  density: number;           // How many points in the pattern
  
  // Animation settings
  rotationSpeed: number;     // Pattern rotation speed
  pulseSpeed: number;        // Pulsing animation speed
  pulseAmplitude: number;    // How much the pattern expands/contracts
  
  // Interactivity
  mouseInfluence: number;    // How much mouse affects the pattern (0-1)
  scrollInfluence: number;   // How much scroll affects the pattern (0-1)
  
  // Visual settings
  opacity: number;           // Overall opacity (0-1)
  glowIntensity: number;     // Text glow strength
}

// Default configuration - easy to customize
const DEFAULT_CONFIG: AnimationConfig = {
  pattern: 'star',
  charSize: 12,
  density: 300,
  rotationSpeed: 0.0005,
  pulseSpeed: 0.002,
  pulseAmplitude: 0.15,
  mouseInfluence: 0.3,
  scrollInfluence: 0.2,
  opacity: 0.25,
  glowIntensity: 8
};

/**
 * Generate pattern coordinates
 * Returns array of points forming the specified pattern
 */
const generatePattern = (
  type: PatternType,
  density: number,
  centerX: number,
  centerY: number,
  size: number
): Array<{ x: number; y: number; char: string }> => {
  const points: Array<{ x: number; y: number; char: string }> = [];

  switch (type) {
    case 'star':
      // Five-pointed star pattern
      for (let i = 0; i < density; i++) {
        const angle = (i / density) * Math.PI * 2;
        const pointIndex = Math.floor((i / density) * 10) % 10;
        const isOuter = pointIndex % 2 === 0;
        const radius = isOuter ? size : size * 0.4;
        
        const starAngle = angle * 5; // Five points
        const x = centerX + Math.cos(starAngle) * radius;
        const y = centerY + Math.sin(starAngle) * radius;
        
        points.push({
          x,
          y,
          char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
        });
      }
      break;

    case 'spiral':
      // Fibonacci spiral pattern
      for (let i = 0; i < density; i++) {
        const t = i / density;
        const angle = t * Math.PI * 8; // Multiple rotations
        const radius = t * size;
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        points.push({
          x,
          y,
          char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
        });
      }
      break;

    case 'wave':
      // Sine wave pattern
      const waves = 4;
      for (let i = 0; i < density; i++) {
        const t = (i / density) * waves * Math.PI * 2;
        const x = centerX + (i / density - 0.5) * size * 2;
        const y = centerY + Math.sin(t) * size * 0.3;
        
        points.push({
          x,
          y,
          char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
        });
      }
      break;

    case 'grid':
      // Geometric grid pattern
      const gridSize = Math.floor(Math.sqrt(density));
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const x = centerX + (i / gridSize - 0.5) * size * 2;
          const y = centerY + (j / gridSize - 0.5) * size * 2;
          
          points.push({
            x,
            y,
            char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
          });
        }
      }
      break;

    case 'circle':
      // Perfect circle pattern
      for (let i = 0; i < density; i++) {
        const angle = (i / density) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * size;
        const y = centerY + Math.sin(angle) * size;
        
        points.push({
          x,
          y,
          char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
        });
      }
      break;
  }

  return points;
};

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [config] = useState<AnimationConfig>(DEFAULT_CONFIG);
  
  // Track mouse position for interactivity
  const mouseRef = useRef({ x: 0, y: 0 });
  // Track scroll position for interactivity
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to fill screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler - track position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll handler - track scroll position
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    // Animation state
    let time = 0;
    let rotation = 0;

    /**
     * Main animation loop
     */
    const animate = () => {
      time += 0.016; // ~60fps
      rotation += config.rotationSpeed;

      // Clear canvas with pure black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate center point
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Calculate base size with pulsing effect
      const baseSize = Math.min(canvas.width, canvas.height) * 0.3;
      const pulse = Math.sin(time * config.pulseSpeed) * config.pulseAmplitude;
      const currentSize = baseSize * (1 + pulse);

      // Generate pattern points
      const points = generatePattern(
        config.pattern,
        config.density,
        centerX,
        centerY,
        currentSize
      );

      // Set up drawing style
      ctx.font = `${config.charSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = config.glowIntensity;

      // Draw each point with transformations
      points.forEach((point, index) => {
        // Apply rotation around center
        const rotatedX = 
          centerX + 
          (point.x - centerX) * Math.cos(rotation) - 
          (point.y - centerY) * Math.sin(rotation);
        const rotatedY = 
          centerY + 
          (point.x - centerX) * Math.sin(rotation) + 
          (point.y - centerY) * Math.cos(rotation);

        // Apply mouse influence - points move away from mouse
        const mouseX = mouseRef.current.x * canvas.width;
        const mouseY = mouseRef.current.y * canvas.height;
        const dx = rotatedX - mouseX;
        const dy = rotatedY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;
        
        let finalX = rotatedX;
        let finalY = rotatedY;
        
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * config.mouseInfluence;
          finalX += (dx / distance) * force * 50;
          finalY += (dy / distance) * force * 50;
        }

        // Apply scroll influence - pattern shifts based on scroll
        const scrollOffset = scrollRef.current * config.scrollInfluence * 0.1;
        finalY += Math.sin(index * 0.1 + scrollOffset) * 10;

        // Draw character with opacity
        ctx.globalAlpha = config.opacity;
        ctx.fillText(point.char, finalX, finalY);
      });

      // Reset global alpha
      ctx.globalAlpha = 1;

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        mixBlendMode: 'normal',
        background: '#000000'
      }}
    />
  );
};

/**
 * CUSTOMIZATION GUIDE:
 * 
 * To change the pattern:
 * - Modify DEFAULT_CONFIG.pattern to: 'star', 'spiral', 'wave', 'grid', or 'circle'
 * 
 * To adjust animation speed:
 * - rotationSpeed: higher = faster rotation
 * - pulseSpeed: higher = faster pulsing
 * - pulseAmplitude: higher = more expansion/contraction
 * 
 * To change interactivity:
 * - mouseInfluence: 0 = no effect, 1 = maximum effect
 * - scrollInfluence: 0 = no effect, 1 = maximum effect
 * 
 * To adjust visibility:
 * - opacity: lower = more transparent, keeps text readable
 * - glowIntensity: higher = more glow effect
 * 
 * To change density:
 * - density: higher = more characters in pattern
 * - charSize: larger = bigger characters
 */
