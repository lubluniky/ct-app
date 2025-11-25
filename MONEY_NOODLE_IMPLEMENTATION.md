# Money Noodle Indicator Implementation

## Overview
Added the "Money Noodle" technical indicator to the Unified Chart Panel. This indicator is a port of a PineScript strategy involving multiple EMAs and ATR-based bands.

## Changes

### 1. New Library: `src/lib/indicators.ts`
- Created a new utility file for technical indicator calculations.
- Implemented:
  - `calculateEMA`: Exponential Moving Average
  - `calculateRMA`: Running Moving Average (used for ATR)
  - `calculateATR`: Average True Range
  - `calculateMoneyNoodle`: Main logic for the indicator.

### 2. Chart Engine Update: `src/components/charts/QuantChart.tsx`
- Added support for a new overlay type: `'band'`.
- Implemented rendering logic to fill the area between two lines (`upperDataKey` and `lowerDataKey`).
- Updated `Overlay` interface to include these new keys.

### 3. UI Integration: `src/components/charts/UnifiedChartPanel.tsx`
- Imported `calculateMoneyNoodle`.
- Added "Money Noodle" to the Indicators Dropdown menu.
- Implemented on-the-fly calculation of indicator values when active.
- Configured 5 overlays for the indicator:
  - **Band Fill**: Gray, transparent fill between upper and lower bands.
  - **Upper Band**: White line.
  - **Lower Band**: White line.
  - **EMA 1**: Aqua line (Fast EMA).
  - **EMA 2**: Lime line (Medium EMA).

## Usage
1. Open the dashboard.
2. Click the "Indicators" dropdown in the chart header.
3. Toggle "Money Noodle".
4. The chart will display the EMAs and Bands overlaid on the price action.
