import { useEffect, useRef, useState } from 'react';

const TradingChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Generate trading data
    const points: { x: number; y: number }[] = [];
    const numPoints = 100;
    let price = canvas.height / 2;
    
    for (let i = 0; i < numPoints; i++) {
      price += (Math.random() - 0.5) * 30;
      price = Math.max(canvas.height * 0.3, Math.min(canvas.height * 0.7, price));
      points.push({
        x: (i / numPoints) * canvas.width,
        y: price
      });
    }
    
    let offset = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      // Draw chart line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.lineWidth = 2;
      
      points.forEach((point, index) => {
        const x = point.x - offset;
        if (index === 0) {
          ctx.moveTo(x, point.y);
        } else {
          ctx.lineTo(x, point.y);
        }
      });
      
      ctx.stroke();
      
      // Fill area under chart
      ctx.lineTo(points[points.length - 1].x - offset, canvas.height);
      ctx.lineTo(points[0].x - offset, canvas.height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 255, 0, 0.05)';
      ctx.fill();
      
      offset += 0.5;
      if (offset > canvas.width / numPoints) {
        offset = 0;
        // Add new point
        const lastPoint = points[points.length - 1];
        let newPrice = lastPoint.y + (Math.random() - 0.5) * 30;
        newPrice = Math.max(canvas.height * 0.3, Math.min(canvas.height * 0.7, newPrice));
        points.shift();
        points.push({
          x: lastPoint.x + canvas.width / numPoints,
          y: newPrice
        });
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0" />;
};

const ASCIIArt = () => {
  const [chars, setChars] = useState<Array<{ char: string; x: number; y: number; opacity: number; delay: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const symbols = ['▲', '▼', '│', '─', '┼', '█', '▒', '░', '$', '%', '↑', '↓', '≈', '∿', '~', '•', '○', '◆', '■'];
    const newChars: Array<{ char: string; x: number; y: number; opacity: number; delay: number }> = [];
    
    const cols = Math.floor(window.innerWidth / 20);
    const rows = Math.floor(window.innerHeight / 30);
    
    for (let i = 0; i < cols * rows * 0.15; i++) {
      newChars.push({
        char: symbols[Math.floor(Math.random() * symbols.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: 0,
        delay: Math.random() * 2
      });
    }
    
    setChars(newChars);
    
    // Animate chars in
    const timeout = setTimeout(() => {
      setChars(prev => prev.map(char => ({
        ...char,
        opacity: Math.random() * 0.3 + 0.1
      })));
    }, 100);
    
    // Random flicker
    const interval = setInterval(() => {
      setChars(prev => prev.map(char => ({
        ...char,
        opacity: Math.random() > 0.7 ? Math.random() * 0.4 : char.opacity
      })));
    }, 3000);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);
  
  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {chars.map((char, i) => (
        <div
          key={i}
          className="absolute font-mono text-primary transition-opacity duration-1000"
          style={{
            left: `${char.x}%`,
            top: `${char.y}%`,
            opacity: char.opacity,
            fontSize: `${Math.random() * 10 + 14}px`,
            transitionDelay: `${char.delay}s`,
            textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
          }}
        >
          {char.char}
        </div>
      ))}
    </div>
  );
};

export const AnimatedBackground = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger entrance animation
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      {/* Trading Chart */}
      <TradingChart />
      
      {/* ASCII Art Overlay */}
      <ASCIIArt />
    </div>
  );
};
