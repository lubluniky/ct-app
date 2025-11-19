import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SnapshotButtonProps {
  containerRef: React.RefObject<HTMLDivElement>;
  symbol: string;
  timeframe: string;
  onCapture?: () => void;
}

export const SnapshotButton: React.FC<SnapshotButtonProps> = ({
  containerRef,
  symbol,
  timeframe,
  onCapture,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureChart = async () => {
    if (!containerRef.current || isCapturing) return;

    setIsCapturing(true);

    try {
      // Generate timestamp for filename
      const now = new Date();
      const timestamp = now
        .toISOString()
        .replace(/T/, '_')
        .replace(/:/g, '-')
        .substring(0, 19);
      const filename = `${symbol}_${timeframe}_${timestamp}.png`;

      // Hide UI elements during capture (buttons, tooltips, etc.)
      const uiElements = containerRef.current.querySelectorAll<HTMLElement>(
        '[data-snapshot-hide]'
      );
      uiElements.forEach((el) => {
        el.style.opacity = '0';
      });

      // Small delay to ensure UI is hidden
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Capture the chart at 2x scale for retina displays
      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        backgroundColor: '#ffffff', // Match theme background
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Restore UI elements
      uiElements.forEach((el) => {
        el.style.opacity = '';
      });

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          console.log(`[SnapshotButton] Saved: ${filename}`);
          onCapture?.();
        }
      }, 'image/png');
    } catch (error) {
      console.error('[SnapshotButton] Capture failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={captureChart}
            disabled={isCapturing}
            data-snapshot-hide
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Camera className="h-[18px] w-[18px]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCapturing ? 'Saving...' : 'Save chart as PNG'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
