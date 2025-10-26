import React from 'react';

interface WatermarkProps {
  text?: string;
  visible?: boolean;
  opacity?: number;
  fontSize?: number;
}

export const Watermark: React.FC<WatermarkProps> = ({
  text = 'borkiss.trade',
  visible = true,
  opacity = 0.08,
  fontSize = 12,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'Inter', 'Roboto', system-ui, sans-serif",
        fontWeight: 500,
        fontSize: `${fontSize}px`,
        color: `rgba(255, 255, 255, ${visible ? opacity : 0})`,
        letterSpacing: '0.05em',
        pointerEvents: 'none',
        userSelect: 'none',
        transition: 'opacity 0.5s ease-in-out',
        opacity: visible ? 1 : 0,
        zIndex: 10,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};
