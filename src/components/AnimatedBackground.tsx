export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      
      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/30 animate-float" style={{ animationDelay: '0s', animationDuration: '25s' }} />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-secondary/20 animate-float" style={{ animationDelay: '2s', animationDuration: '30s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-accent/25 animate-float" style={{ animationDelay: '4s', animationDuration: '28s' }} />
      <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '1s', animationDuration: '32s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-secondary/30 animate-float" style={{ animationDelay: '3s', animationDuration: '27s' }} />
      
      {/* Glowing orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/5 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-accent/5 blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      {/* Diagonal lines */}
      <div className="absolute w-px h-screen bg-gradient-to-b from-transparent via-primary/20 to-transparent" 
           style={{ left: '20%', animation: 'slide-diagonal 20s linear infinite', animationDelay: '0s' }} />
      <div className="absolute w-px h-screen bg-gradient-to-b from-transparent via-secondary/15 to-transparent" 
           style={{ left: '60%', animation: 'slide-diagonal 25s linear infinite', animationDelay: '5s' }} />
      <div className="absolute w-px h-screen bg-gradient-to-b from-transparent via-accent/15 to-transparent" 
           style={{ left: '80%', animation: 'slide-diagonal 22s linear infinite', animationDelay: '3s' }} />
    </div>
  );
};
