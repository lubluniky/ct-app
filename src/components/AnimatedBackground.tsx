export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Trading numbers floating up */}
      <div className="absolute left-[10%] animate-slide-up text-primary/20 font-mono text-sm" style={{ animationDelay: '0s' }}>
        +2.45%
      </div>
      <div className="absolute left-[25%] animate-slide-up text-secondary/20 font-mono text-sm" style={{ animationDelay: '3s' }}>
        -1.32%
      </div>
      <div className="absolute left-[45%] animate-slide-up text-primary/20 font-mono text-sm" style={{ animationDelay: '6s' }}>
        +5.67%
      </div>
      <div className="absolute left-[65%] animate-slide-up text-accent/20 font-mono text-sm" style={{ animationDelay: '2s' }}>
        0x7A4F...
      </div>
      <div className="absolute left-[80%] animate-slide-up text-primary/20 font-mono text-sm" style={{ animationDelay: '8s' }}>
        +3.21%
      </div>
      <div className="absolute left-[90%] animate-slide-up text-secondary/20 font-mono text-sm" style={{ animationDelay: '4s' }}>
        RSI: 67
      </div>

      {/* Mini candlestick patterns */}
      <svg className="absolute top-20 left-[15%] w-32 h-24 opacity-10" style={{ animation: 'flicker 4s ease-in-out infinite' }}>
        <line x1="10" y1="10" x2="10" y2="70" stroke="hsl(var(--primary))" strokeWidth="1" />
        <rect x="5" y="25" width="10" height="30" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
        
        <line x1="30" y1="5" x2="30" y2="75" stroke="hsl(var(--secondary))" strokeWidth="1" />
        <rect x="25" y="20" width="10" height="40" fill="hsl(var(--secondary))" strokeWidth="2" />
        
        <line x1="50" y1="15" x2="50" y2="65" stroke="hsl(var(--primary))" strokeWidth="1" />
        <rect x="45" y="30" width="10" height="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
        
        <line x1="70" y1="8" x2="70" y2="72" stroke="hsl(var(--primary))" strokeWidth="1" />
        <rect x="65" y="22" width="10" height="35" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
      </svg>

      <svg className="absolute bottom-40 right-[20%] w-32 h-24 opacity-10" style={{ animation: 'flicker 5s ease-in-out infinite', animationDelay: '2s' }}>
        <line x1="10" y1="40" x2="10" y2="80" stroke="hsl(var(--secondary))" strokeWidth="1" />
        <rect x="5" y="45" width="10" height="25" fill="hsl(var(--secondary))" strokeWidth="2" />
        
        <line x1="30" y1="20" x2="30" y2="70" stroke="hsl(var(--primary))" strokeWidth="1" />
        <rect x="25" y="30" width="10" height="30" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
        
        <line x1="50" y1="25" x2="50" y2="75" stroke="hsl(var(--primary))" strokeWidth="1" />
        <rect x="45" y="35" width="10" height="25" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
      </svg>

      {/* Chart lines */}
      <svg className="absolute top-1/3 left-[5%] w-64 h-32 opacity-10">
        <polyline
          points="0,80 40,60 80,70 120,30 160,40 200,20 240,35"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          style={{
            strokeDasharray: '1000',
            animation: 'draw-chart 8s ease-in-out infinite'
          }}
        />
      </svg>

      <svg className="absolute bottom-1/4 right-[10%] w-64 h-32 opacity-10">
        <polyline
          points="0,100 40,80 80,85 120,60 160,65 200,40 240,50"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="2"
          style={{
            strokeDasharray: '1000',
            animation: 'draw-chart 10s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
      </svg>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/5 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-accent/5 blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

      {/* Algorithm patterns - triangles */}
      <div className="absolute top-1/4 right-1/4 opacity-5">
        <svg width="60" height="60" className="animate-float" style={{ animationDuration: '25s' }}>
          <polygon points="30,5 55,50 5,50" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
          <polygon points="30,15 45,40 15,40" fill="none" stroke="hsl(var(--accent))" strokeWidth="1" />
        </svg>
      </div>

      <div className="absolute bottom-1/3 left-1/4 opacity-5">
        <svg width="50" height="50" className="animate-float" style={{ animationDuration: '30s', animationDelay: '3s' }}>
          <polygon points="25,45 45,10 5,10" fill="none" stroke="hsl(var(--secondary))" strokeWidth="2" />
        </svg>
      </div>

      {/* Binary/hex patterns */}
      <div className="absolute top-1/2 left-[8%] text-xs font-mono text-primary/5 animate-flicker" style={{ animationDelay: '1s' }}>
        01001010<br/>
        11010110<br/>
        00110101
      </div>

      <div className="absolute bottom-1/3 right-[12%] text-xs font-mono text-secondary/5 animate-flicker" style={{ animationDelay: '3s' }}>
        0xA7F2<br/>
        0x3B9C<br/>
        0x8D41
      </div>
    </div>
  );
};
