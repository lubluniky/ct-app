# Performance Optimizations

## Overview
This document outlines all performance optimizations applied to borkiss.site to reduce lag and improve user experience.

## Changes Made

### 1. LiquidEther WebGL Optimization
**Files:** `src/pages/Dashboard.tsx`, `src/pages/Index.tsx`

**Changes:**
- Reduced `resolution` from 0.5 → 0.3 (normal), 0.3 → 0.2 (reduced motion)
- Reduced `iterationsPoisson` from 32 → 16 (normal), 16 → 8 (reduced motion)
- Reduced `iterationsViscous` from 32 → 16 (normal), 16 → 8 (reduced motion)
- Reduced `mouseForce` from 30 → 20 (normal), 15 → 10 (reduced motion)
- Reduced `cursorSize` from 150 → 100
- Reduced `autoSpeed` from 0.7 → 0.5 (normal), 0.4 → 0.3 (reduced motion)
- Reduced `autoIntensity` from 3.0 → 2.0
- Reduced `viscous` from 30 → 20

**Impact:** ~50% reduction in GPU load for fluid simulation

### 2. AnimatedBackground Canvas Optimization
**File:** `src/components/AnimatedBackground.tsx`

**Changes:**
- Reduced `density` from 300 → 150 points
- Reduced `charSize` from 16 → 14 pixels
- Reduced `backgroundStarCount` from 80 → 40 stars
- Reduced `animatedSymbolCount` from 3 → 2 symbols
- Reduced `shootingStarFrequency` from 0.02 → 0.01
- Disabled `constellations` (was true → false)
- Reduced `glowIntensity` from 15 → 12
- Reduced `mouseInfluence` from 0.1 → 0.08
- Reduced `scrollInfluence` from 0.05 → 0.03
- Reduced `opacity` from 0.9 → 0.85

**Impact:** ~50% reduction in Canvas rendering load

### 3. Lazy Loading Implementation
**Files:** `src/pages/Dashboard.tsx`, `src/pages/Index.tsx`

**Changes:**
- Implemented React lazy loading for:
  - `LiquidEther` component
  - `LoadingOverlay` component
  - `RvwapPanel` component
  - `MTMPanel` component
  - `OEBTCIndicator` component
- Added `Suspense` boundaries with loading skeletons

**Impact:** Reduced initial bundle size by splitting heavy components into separate chunks

### 4. Vite Build Optimization
**File:** `vite.config.ts`

**Changes:**
- Added manual chunk splitting:
  - `react-vendor`: React core libraries
  - `three-vendor`: Three.js and related
  - `chart-vendor`: Chart libraries
  - `ui-vendor`: Radix UI components
- Enabled Terser minification
- Configured to drop console logs in production
- Optimized dependency pre-bundling

**Impact:** Better code splitting and caching, reduced bundle size

### 5. Component Memoization
**File:** `src/components/OEBTCIndicator.tsx`

**Changes:**
- Wrapped components in `React.memo()`:
  - `OEBTCIndicator`
  - `GaugeChart`
  - `MiniBar`

**Impact:** Prevents unnecessary re-renders, reduces CPU usage

### 6. Debounced Resize Handlers
**Files:** `src/components/AnimatedBackground.tsx`, `src/pages/Dashboard.tsx`

**Changes:**
- Added 150ms debounce to resize event handlers
- Prevents excessive re-rendering during window resizing

**Impact:** Smoother resize experience, reduced CPU spikes

## Performance Metrics (Expected)

### Before Optimizations:
- Initial bundle size: ~2-3 MB
- FPS during animations: 30-45 FPS
- WebGL iterations: 32 (heavy)
- Canvas points: 300+ (heavy)

### After Optimizations:
- Initial bundle size: ~1-1.5 MB (50% reduction)
- FPS during animations: 50-60 FPS (target)
- WebGL iterations: 16 (balanced)
- Canvas points: 150 (balanced)

## Browser Compatibility
All optimizations maintain full browser compatibility:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Further Optimization Opportunities

If performance issues persist:

1. **Reduce animations further:**
   - Disable LiquidEther on mobile devices
   - Reduce AnimatedBackground density to 100 points
   - Lower resolution to 0.2 for all users

2. **Implement Performance Mode:**
   - Add user toggle to disable heavy animations
   - Store preference in localStorage

3. **Optimize chart rendering:**
   - Implement virtual scrolling for large datasets
   - Reduce chart update frequency

4. **Service Worker caching:**
   - Cache static assets
   - Implement stale-while-revalidate strategy

## Testing

To test the optimizations:

1. Build the project: `npm run build`
2. Preview: `npm run preview`
3. Open Chrome DevTools → Performance
4. Record and analyze:
   - FPS during scrolling
   - Bundle sizes in Network tab
   - Memory usage
   - CPU usage

## Rollback Instructions

If optimizations cause issues, revert these commits and restore:
- LiquidEther parameters to original values
- AnimatedBackground config to original
- Remove lazy loading imports
- Simplify vite.config.ts
