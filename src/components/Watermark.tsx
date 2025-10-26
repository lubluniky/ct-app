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
  opacity = 0.04,
  fontSize = 48,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: "'Inter', 'Poppins', system-ui, sans-serif",
        fontWeight: 600,
        fontSize: `${fontSize}px`,
        color: `rgba(255, 255, 255, ${visible ? opacity : 0})`,
        letterSpacing: '0.1em',
        textTransform: 'lowercase',
        pointerEvents: 'none',
        userSelect: 'none',
        transition: 'opacity 1s ease-in-out',
        opacity: visible ? 1 : 0,
        zIndex: 5,
        whiteSpace: 'nowrap',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      {text}
    </div>
  );
};
