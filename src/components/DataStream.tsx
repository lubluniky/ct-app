import { useEffect, useState } from 'react';

export const DataStream = () => {
  const [streams, setStreams] = useState<Array<{ id: number; left: number; delay: number; duration: number; opacity: number }>>([]);

  useEffect(() => {
    const newStreams = [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.5
    }));
    setStreams(newStreams);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Vertical Data Streams */}
      {streams.map((stream) => (
        <div
          key={stream.id}
          className="absolute top-[-20%] w-[1px] md:w-[2px]"
          style={{
            left: `${stream.left}%`,
            animation: `data-stream ${stream.duration}s linear infinite`,
            animationDelay: `${stream.delay}s`,
            opacity: stream.opacity
          }}
        >
          {/* Glowing Head */}
          <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-emerald-400 to-transparent" />
          
          {/* Trail */}
          <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-emerald-500/50 via-emerald-900/20 to-transparent" />
          
          {/* Binary/Data Characters */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 text-[8px] md:text-[10px] font-mono text-emerald-300/80">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="leading-none opacity-80">
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Horizontal Scan Lines - Radar Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(16,185,129,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan-line opacity-30" />
    </div>
  );
};
