# Singularity v6 Component Integration

The components have been updated to use the new "Singularity v6" color palette.

## Changes

### `src/components/charts/QuantChart.tsx`
- Updated default candle colors:
  - **Bullish:** `#10b981` (was `#00FF9D`)
  - **Bearish:** `#ef4444` (was `#FF2E54`)
- Updated default line/area color to `#10b981`.

### `src/components/charts/UnifiedChartPanel.tsx`
- Updated Market Pulse overlay color to `#f43f5e` (Pulse Hot).

### `src/components/labs/CrossPairAnalyzer.tsx`
- Updated overlay colors to match Data Series palette:
  - **Correlation:** `#f59e0b` (Chart-3)
  - **Symbol A:** `#3b82f6` (Chart-1)
  - **Symbol B:** `#8b5cf6` (Chart-2)

### `src/components/rvwap/RvwapChart.tsx`
- Updated RVWAP lines to match Data Series palette:
  - **30D:** `#3b82f6` (Chart-1)
  - **90D:** `#8b5cf6` (Chart-2)
  - **365D:** `#f59e0b` (Chart-3)
  - **Single:** `#06b6d4` (Chart-4)

### `src/components/charts/VwapZScorePanel.tsx`
- Updated status colors to use Tailwind utility classes (`text-z-expensive`, `text-z-cheap`, etc.).
- Updated Sparkline colors to match Z-Score palette (`#ff4500` / `#00e396`).

## Verification
- Check the charts again.
- Candles should be Teal/Red instead of Neon Green/Red.
- Market Pulse should be a hot pink/red instead of yellow.
- Cross Pair Analyzer lines should be Blue/Purple/Amber.
