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

// Small star characters for background starfield
const STAR_CHARS = ['*', '.', '+', 'x', '·', '✦', '✧'];

// Pattern types available
type PatternType = 'star' | 'spiral' | 'wave' | 'grid' | 'circle';

// Background star interface
interface BackgroundStar {
  x: number;
  y: number;
  char: string;
  size: number;
  brightness: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

// Animated bitcoin symbol interface
interface AnimatedSymbol {
  x: number;
  y: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  speed: number;
  char: string;
  size: number;
  opacity: number;
}

// Shooting star interface
interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  brightness: number;
  active: boolean;
}

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
  
  // Background elements
  backgroundStarCount: number;      // Number of small scattered stars
  animatedSymbolCount: number;      // Number of flying bitcoin symbols
  shootingStarFrequency: number;    // How often shooting stars appear (0-1)
  enableConstellations: boolean;    // Draw constellation lines
}

// Default configuration - easy to customize
const DEFAULT_CONFIG: AnimationConfig = {
  pattern: 'star',
  charSize: 16,              // Larger characters for better visibility
  density: 300,              // Reduced density - more space between letters
  rotationSpeed: 0,          // No rotation - static star
  pulseSpeed: 0.0008,        // Very slow gentle pulse
  pulseAmplitude: 0.05,      // Minimal breathing effect
  mouseInfluence: 0.1,       // Subtle mouse interaction
  scrollInfluence: 0.05,     // Minimal scroll effect
  opacity: 0.9,              // High opacity for clear visibility
  glowIntensity: 15,         // Strong glow for dramatic effect
  backgroundStarCount: 80,   // Elegant scatter of small stars
  animatedSymbolCount: 3,    // Few bitcoin symbols floating
  shootingStarFrequency: 0.02, // Occasional shooting stars
  enableConstellations: true // Subtle constellation lines
};

/**
 * Generate pattern coordinates with depth information
 * Returns array of points forming the specified pattern
 * Each point includes a depth value (0-1) for grayscale shading
 */
const generatePattern = (
  type: PatternType,
  density: number,
  centerX: number,
  centerY: number,
  size: number
): Array<{ x: number; y: number; char: string; depth: number }> => {
  const points: Array<{ x: number; y: number; char: string; depth: number }> = [];

  switch (type) {
    case 'star':
      // Elegant four-pointed star with sharp, crisp tips
      // Long graceful vertical arms, shorter horizontal arms
      const verticalRadius = size * 1.8;    // Long, elegant vertical reach
      const horizontalRadius = size * 0.7;  // Shorter horizontal arms
      const innerRadius = size * 0.08;      // Very tight center for sharp transitions
      
      // Define the four sharp points and create segments between them
      const vertices = [
        { x: centerX, y: centerY - verticalRadius, type: 'tip' },           // Top tip
        { x: centerX + innerRadius, y: centerY - innerRadius, type: 'inner' },
        { x: centerX + horizontalRadius, y: centerY, type: 'tip' },         // Right tip
        { x: centerX + innerRadius, y: centerY + innerRadius, type: 'inner' },
        { x: centerX, y: centerY + verticalRadius, type: 'tip' },           // Bottom tip
        { x: centerX - innerRadius, y: centerY + innerRadius, type: 'inner' },
        { x: centerX - horizontalRadius, y: centerY, type: 'tip' },         // Left tip
        { x: centerX - innerRadius, y: centerY - innerRadius, type: 'inner' }
      ];
      
      const totalVertices = vertices.length;
      const pointsPerSegment = Math.ceil(density / totalVertices);
      
      for (let i = 0; i < totalVertices; i++) {
        const start = vertices[i];
        const end = vertices[(i + 1) % totalVertices];
        
        // Determine if this segment leads to or from a tip
        const isToTip = end.type === 'tip';
        const isFromTip = start.type === 'tip';
        
        for (let j = 0; j < pointsPerSegment; j++) {
          const t = j / pointsPerSegment;
          
          let x, y, depth;
          
          if (isFromTip) {
            // From tip to inner - use exponential easing for sharp point
            // This creates a rapid expansion from the tip
            const sharpT = Math.pow(t, 0.4); // Sharp at start, gradual expansion
            x = start.x + (end.x - start.x) * sharpT;
            y = start.y + (end.y - start.y) * sharpT;
            
            // Brightest at tip, fading towards center
            depth = 1.0 - (t * 0.5);
            
            // Very minimal width variation near tip for sharpness
            const width = Math.pow(t, 2) * innerRadius * 0.3;
            if (Math.abs(end.x - start.x) > Math.abs(end.y - start.y)) {
              // Horizontal variation
              y += (Math.random() - 0.5) * width;
            } else {
              // Vertical variation
              x += (Math.random() - 0.5) * width;
            }
            
          } else if (isToTip) {
            // From inner to tip - use exponential easing for sharp convergence
            // This creates points that taper to a fine point
            const sharpT = Math.pow(t, 2.5); // Gradual at start, very sharp at end
            x = start.x + (end.x - start.x) * sharpT;
            y = start.y + (end.y - start.y) * sharpT;
            
            // Brighten as we approach tip
            depth = 0.5 + (t * 0.5);
            
            // Converge to zero width at tip
            const width = Math.pow(1 - t, 2) * innerRadius * 0.3;
            if (Math.abs(end.x - start.x) > Math.abs(end.y - start.y)) {
              y += (Math.random() - 0.5) * width;
            } else {
              x += (Math.random() - 0.5) * width;
            }
            
          } else {
            // Between two inner points - straight connection
            x = start.x + (end.x - start.x) * t;
            y = start.y + (end.y - start.y) * t;
            depth = 0.5;
          }
          
          points.push({
            x,
            y,
            char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
            depth
          });
        }
      }
      break;

    case 'spiral':
      // Fibonacci spiral pattern with depth gradient
      for (let i = 0; i < density; i++) {
        const t = i / density;
        const angle = t * Math.PI * 8; // Multiple rotations
        const radius = t * size;
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Depth increases from center to edge
        const depth = t;
        
        points.push({
          x,
          y,
          char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
          depth
        });
      }
      break;

    case 'wave':
      // Sine wave pattern with depth based on wave height
      const waves = 4;
      for (let i = 0; i < density; i++) {
        const t = (i / density) * waves * Math.PI * 2;
        const x = centerX + (i / density - 0.5) * size * 2;
        const waveHeight = Math.sin(t);
        const y = centerY + waveHeight * size * 0.3;
        
        // Depth based on wave amplitude (peaks are brighter)
        const depth = (waveHeight + 1) / 2;
        
        points.push({
          x,
          y,
          char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
          depth
        });
      }
      break;

    case 'grid':
      // Geometric grid pattern with radial depth gradient
      const gridSize = Math.floor(Math.sqrt(density));
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const x = centerX + (i / gridSize - 0.5) * size * 2;
          const y = centerY + (j / gridSize - 0.5) * size * 2;
          
          // Distance from center determines depth
          const dx = (i / gridSize - 0.5);
          const dy = (j / gridSize - 0.5);
          const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
          const depth = 1 - Math.min(distanceFromCenter, 1);
          
          points.push({
            x,
            y,
            char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
            depth
          });
        }
      }
      break;

    case 'circle':
      // Perfect circle pattern with smooth gradient
      for (let i = 0; i < density; i++) {
        const angle = (i / density) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * size;
        const y = centerY + Math.sin(angle) * size;
        
        // Depth varies smoothly around circle
        const depth = (Math.sin(angle * 2) + 1) / 2;
        
        points.push({
          x,
          y,
          char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
          depth
        });
      }
      break;
  }

  return points;
};

/**
 * Generate background starfield
 */
const generateBackgroundStars = (width: number, height: number, count: number): BackgroundStar[] => {
  const stars: BackgroundStar[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const exclusionRadius = Math.min(width, height) * 0.35; // Keep stars away from center star
  
  for (let i = 0; i < count; i++) {
    let x, y;
    // Ensure stars don't overlap with center star
    do {
      x = Math.random() * width;
      y = Math.random() * height;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > exclusionRadius) break;
    } while (true);
    
    stars.push({
      x,
      y,
      char: STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)],
      size: 8 + Math.random() * 6, // Vary size 8-14
      brightness: 0.3 + Math.random() * 0.5, // Vary brightness 0.3-0.8
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.5 + Math.random() * 1.5
    });
  }
  
  return stars;
};

/**
 * Initialize animated symbols (bitcoin)
 */
const initAnimatedSymbols = (width: number, height: number, count: number): AnimatedSymbol[] => {
  const symbols: AnimatedSymbol[] = [];
  
  for (let i = 0; i < count; i++) {
    // Random starting position (from edges)
    const side = Math.floor(Math.random() * 4);
    let startX, startY, endX, endY;
    
    switch (side) {
      case 0: // From left
        startX = -50;
        startY = Math.random() * height;
        endX = width + 50;
        endY = Math.random() * height;
        break;
      case 1: // From top
        startX = Math.random() * width;
        startY = -50;
        endX = Math.random() * width;
        endY = height + 50;
        break;
      case 2: // From right
        startX = width + 50;
        startY = Math.random() * height;
        endX = -50;
        endY = Math.random() * height;
        break;
      default: // From bottom
        startX = Math.random() * width;
        startY = height + 50;
        endX = Math.random() * width;
        endY = -50;
    }
    
    symbols.push({
      x: startX,
      y: startY,
      startX,
      startY,
      endX,
      endY,
      progress: Math.random(), // Random starting progress
      speed: 0.0002 + Math.random() * 0.0003, // Very slow movement
      char: '₿',
      size: 14 + Math.random() * 8,
      opacity: 0.2 + Math.random() * 0.3
    });
  }
  
  return symbols;
};

/**
 * Create a new shooting star
 */
const createShootingStar = (width: number, height: number): ShootingStar => {
  const fromEdge = Math.random() < 0.5;
  
  return {
    x: fromEdge ? (Math.random() < 0.5 ? 0 : width) : Math.random() * width,
    y: fromEdge ? Math.random() * height : (Math.random() < 0.5 ? 0 : height),
    angle: Math.random() * Math.PI * 2,
    speed: 3 + Math.random() * 5,
    length: 30 + Math.random() * 50,
    brightness: 0.6 + Math.random() * 0.4,
    active: true
  };
};

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [config] = useState<AnimationConfig>(DEFAULT_CONFIG);
  
  // Track mouse position for interactivity
  const mouseRef = useRef({ x: 0, y: 0 });
  // Track scroll position for interactivity
  const scrollRef = useRef(0);
  
  // Background elements
  const backgroundStarsRef = useRef<BackgroundStar[]>([]);
  const animatedSymbolsRef = useRef<AnimatedSymbol[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to fill screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Regenerate background elements on resize
      backgroundStarsRef.current = generateBackgroundStars(canvas.width, canvas.height, config.backgroundStarCount);
      animatedSymbolsRef.current = initAnimatedSymbols(canvas.width, canvas.height, config.animatedSymbolCount);
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

      // Clear canvas with pure black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      /**
       * DRAW BACKGROUND STARS
       */
      backgroundStarsRef.current.forEach((star) => {
        // Twinkle effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
        const brightness = star.brightness * twinkle;
        const gray = Math.floor(brightness * 255);
        
        ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
        ctx.font = `${star.size}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 0.6;
        ctx.shadowBlur = 0;
        ctx.fillText(star.char, star.x, star.y);
      });
      
      /**
       * DRAW CONSTELLATION LINES
       */
      if (config.enableConstellations) {
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.15)';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 4]);
        ctx.globalAlpha = 0.3;
        
        // Connect nearby stars with dotted lines
        for (let i = 0; i < backgroundStarsRef.current.length; i++) {
          const star1 = backgroundStarsRef.current[i];
          for (let j = i + 1; j < backgroundStarsRef.current.length; j++) {
            const star2 = backgroundStarsRef.current[j];
            const dx = star2.x - star1.x;
            const dy = star2.y - star1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Only connect stars within a certain distance
            if (distance < 150 && Math.random() > 0.95) {
              ctx.beginPath();
              ctx.moveTo(star1.x, star1.y);
              ctx.lineTo(star2.x, star2.y);
              ctx.stroke();
            }
          }
        }
        ctx.setLineDash([]);
      }
      
      /**
       * UPDATE AND DRAW ANIMATED SYMBOLS (Bitcoin)
       */
      animatedSymbolsRef.current.forEach((symbol) => {
        // Update position with bezier curve
        symbol.progress += symbol.speed;
        if (symbol.progress >= 1) {
          symbol.progress = 0;
        }
        
        const t = symbol.progress;
        // Cubic bezier for smooth curved path
        const controlX = (symbol.startX + symbol.endX) / 2 + (Math.sin(t * Math.PI * 2) * 200);
        const controlY = (symbol.startY + symbol.endY) / 2 + (Math.cos(t * Math.PI * 2) * 200);
        
        symbol.x = (1 - t) * (1 - t) * symbol.startX + 2 * (1 - t) * t * controlX + t * t * symbol.endX;
        symbol.y = (1 - t) * (1 - t) * symbol.startY + 2 * (1 - t) * t * controlY + t * t * symbol.endY;
        
        // Draw symbol
        ctx.fillStyle = `rgba(200, 200, 200, ${symbol.opacity})`;
        ctx.font = `${symbol.size}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = symbol.opacity;
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(200, 200, 200, 0.5)';
        ctx.fillText(symbol.char, symbol.x, symbol.y);
      });
      
      /**
       * UPDATE AND DRAW SHOOTING STARS
       */
      // Spawn new shooting stars randomly
      if (Math.random() < config.shootingStarFrequency) {
        shootingStarsRef.current.push(createShootingStar(canvas.width, canvas.height));
      }
      
      // Update and draw existing shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        if (!star.active) return false;
        
        // Update position
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        
        // Check if off screen
        if (star.x < -100 || star.x > canvas.width + 100 || star.y < -100 || star.y > canvas.height + 100) {
          star.active = false;
          return false;
        }
        
        // Draw shooting star trail
        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        
        const brightness = Math.floor(star.brightness * 255);
        gradient.addColorStop(0, `rgba(${brightness}, ${brightness}, ${brightness}, 0.8)`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.9;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${brightness}, ${brightness}, ${brightness}, 0.8)`;
        
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        ctx.stroke();
        
        return true;
      });
      
      // Reset for main star drawing
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

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

      // Draw each point with transformations
      points.forEach((point, index) => {
        // No rotation - star remains static and centered
        let finalX = point.x;
        let finalY = point.y;
        // Minimal mouse influence - subtle interaction
        const mouseX = mouseRef.current.x * canvas.width;
        const mouseY = mouseRef.current.y * canvas.height;
        const dx = finalX - mouseX;
        const dy = finalY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 300;
        
        if (distance < maxDistance && distance > 0) {
          const force = (1 - distance / maxDistance) * config.mouseInfluence;
          finalX += (dx / distance) * force * 30;
          finalY += (dy / distance) * force * 30;
        }

        // Apply minimal scroll influence
        const scrollOffset = scrollRef.current * config.scrollInfluence * 0.05;
        finalY += Math.sin(index * 0.05 + scrollOffset) * 3;

        /**
         * ANIMATED GRADIENT SYSTEM
         * Creates a flowing wave of brightness across the star
         * Gradient animates from dark gray → light gray → bright white → light gray → dark gray
         */
        
        // Base depth from pattern (0 to 1)
        const baseDepth = point.depth;
        
        // Create animated gradient wave that flows along the star
        // Using sine wave that moves over time
        const gradientWave = Math.sin(time * 0.5 + index * 0.02);
        
        // Combine base depth with animated wave
        // This creates a "breathing" gradient effect
        const animatedDepth = baseDepth * 0.5 + (gradientWave * 0.5 + 0.5) * 0.5;
        
        // Map depth to grayscale range
        // Minimum: 40 (dark gray) → Maximum: 255 (bright white)
        const minGray = 40;   // Dark gray - never completely black for visibility
        const maxGray = 255;  // Bright white
        const grayValue = minGray + Math.floor(animatedDepth * (maxGray - minGray));
        
        // Add position-based variation for more organic gradient
        // Creates subtle variations in brightness based on position
        const positionVariation = Math.sin(index * 0.1 + time * 0.3) * 20;
        const finalGray = Math.max(minGray, Math.min(maxGray, grayValue + positionVariation));
        
        // Create RGB color (grayscale)
        const color = `rgb(${finalGray}, ${finalGray}, ${finalGray})`;
        
        // Apply color
        ctx.fillStyle = color;
        
        /**
         * GLOW EFFECT
         * Brighter characters get more glow for dramatic depth
         * Creates a luminous, ethereal quality
         */
        if (finalGray > 120) {
          ctx.shadowColor = color;
          // Scale glow intensity based on brightness
          const glowStrength = ((finalGray - 120) / 135) * config.glowIntensity;
          ctx.shadowBlur = glowStrength;
        } else {
          ctx.shadowBlur = 0;
        }

        // Draw character with configured opacity
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
        background: '#000000'  // Pure black background
      }}
    />
  );
};

/**
 * CUSTOMIZATION GUIDE:
 * 
 * STAR PROPORTIONS:
 * - verticalRadius: Controls height of top/bottom arms (line 72)
 * - horizontalRadius: Controls width of left/right arms (line 73)
 * - innerRadius: Controls tightness of center connection (line 74)
 * 
 * DENSITY & SPACING:
 * - density: Lower = more space between letters, higher = denser (line 40)
 * - charSize: Size of each ASCII character (line 39)
 * 
 * ANIMATION:
 * - pulseSpeed: Speed of breathing effect (line 42)
 * - pulseAmplitude: Strength of breathing (line 43)
 * - time * 0.5: Speed of gradient animation wave (line 319)
 * - index * 0.02: Spacing of gradient wave (line 319)
 * 
 * GRADIENT COLORS:
 * - minGray (40): Darkest shade - adjust for darker/lighter minimum (line 327)
 * - maxGray (255): Brightest shade - always white
 * - positionVariation: Organic variation amount (line 333)
 * 
 * GLOW EFFECT:
 * - glowIntensity: Overall glow strength (line 47)
 * - Threshold (120): When glow starts (line 346)
 * 
 * INTERACTIVITY:
 * - mouseInfluence: How much mouse affects pattern (line 44)
 * - scrollInfluence: How much scroll affects pattern (line 45)
 * - maxDistance: Range of mouse interaction (line 297)
 * 
 * VISIBILITY:
 * - opacity: Overall transparency of animation (line 46)
 * - Use lower opacity if text readability is an issue
 */
