# UI/UX Refresh - Feature Branch

## Overview
This branch (`feature/ui-ux-refresh`) implements a complete redesign of the borkiss.trade platform, moving from a dark/neon aesthetic to a clean, minimal "Quant Research Lab" identity.

## Changes

### Visual Identity
- **Theme**: Light mode default.
- **Colors**: 
  - Background: Off-white / Paper (`#F8FAFC`)
  - Text: Deep Slate (`#1E293B`)
  - Accents: Minimal Blue/Cyan (non-neon)
- **Typography**: Clean sans-serif (Inter), optimized for readability.

### Landing Page (`/`)
- **Hero Section**: Redesigned with a split layout (Text Left, Abstract Animation Right).
- **Animation**: New lightweight HTML5 Canvas particle network animation.
- **Content Sections**:
  - **Philosophy**: Clean cards grid, refined quote section.
  - **Experience**: Vertical timeline/grid with icons.
  - **Ideas/Models**: Minimalist card layouts.
  - **Tools Overview**: New section showcasing MTM and RVWAP.
  - **Connect**: Clean contact grid.
- **Navigation**: Simplified sticky navbar with "Research Terminal" branding.

### Dashboard (`/dashboard`)
- **Layout**: Unified top-navigation layout.
- **Tabs**: Easy switching between "Market Tension Map" and "Rolling VWAP".
- **Charts**:
  - Updated `LightweightCharts` configuration for light theme.
  - Transparent backgrounds.
  - Dark text/grid lines for contrast.
  - Optimized colors for candles and indicators.

### Components
- **New**: `HeroAnimation.tsx`, `ToolsOverview.tsx`, `SectionLayout.tsx`.
- **Updated**: `Hero.tsx`, `Philosophy.tsx`, `Experience.tsx`, `Ideas.tsx`, `Models.tsx`, `Contact.tsx`, `StickyNavbar.tsx`.
- **Charts**: `OhlcChart.tsx`, `RvwapChart.tsx`, `SnapshotButton.tsx`.

## Local Run Instructions

1. Ensure you are on the correct branch:
   ```bash
   git checkout feature/ui-ux-refresh
   ```

2. Install dependencies (if needed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` to view the new design.

## Verification
- Check the Landing Page for responsiveness and animation performance.
- Verify Dashboard charts load correctly with the new light theme colors.
- Ensure all navigation links work.
