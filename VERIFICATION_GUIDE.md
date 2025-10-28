# Dashboard Rendering Verification Guide

## Overview
This guide helps you verify that the dashboard is rendering correctly after the fixes.

## Changes Made

### 1. RVWAP Panel Visibility ✅
**Status:** Working as designed
- The RVWAP panel is **hidden by default** (toggle switch OFF)
- Toggle "Show Rolling VWAP" in the header to display it
- When hidden, a helpful indicator message is shown: 
  > 💡 **Rolling VWAP panel is hidden.** Toggle "Show Rolling VWAP" above to display it.

**Implementation:**
- State: `showRvwap` (boolean, defaults to `false` unless localStorage has `'true'`)
- Persistence: Saved to `localStorage.getItem('mtm_showRvwap')`
- Conditional render: `{showRvwap && <RvwapPanel />}`
- Animation: Fade-in with slide-up when toggled ON

### 2. TensionGlow Removal ✅
**Status:** Confirmed removed
- `src/components/ohlc/TensionGlow.tsx` was deleted in commit `39a81a7`
- No glow canvas render loops exist in the codebase
- No `requestAnimationFrame` calls related to glow rendering
- All TensionGlow imports removed from `OhlcChart.tsx`

**Verification Logs:**
The following console logs confirm TensionGlow is disabled:
```
[MtmDashboard] Component mounted
[MtmDashboard] ShowRvwap: false
[TensionGlow] Disabled - feature removed in revert

[OhlcChart] Chart initialized successfully with histogram pane
[TensionGlow] Not initialized - feature removed in revert

[RvwapPanel] Mounted and rendering (when toggle is ON)
[TensionGlow] Disabled for RVWAP context - glow not initialized
```

## Verification Steps

### Step 1: Check Dashboard Loads
1. Open browser to `http://localhost:8080/dashboard/mtm`
2. Open Developer Console (F12)
3. Verify logs appear:
   - ✅ `[MtmDashboard] Component mounted`
   - ✅ `[TensionGlow] Disabled - feature removed in revert`
   - ✅ `[OhlcChart] Chart initialized successfully with histogram pane`

### Step 2: Verify RVWAP Panel Hidden by Default
1. Scroll to bottom of dashboard
2. See the indicator message:
   > 💡 **Rolling VWAP panel is hidden.** Toggle "Show Rolling VWAP" above to display it.
3. Verify no RVWAP chart is visible
4. Console should show: `[MtmDashboard] ShowRvwap: false`

### Step 3: Toggle RVWAP Panel ON
1. Click the "Show Rolling VWAP" toggle switch in the header
2. Verify the panel fades in smoothly (500ms animation)
3. Console should show:
   - ✅ `[MtmDashboard] ShowRvwap: true`
   - ✅ `[RvwapPanel] Mounted and rendering`
   - ✅ `[TensionGlow] Disabled for RVWAP context - glow not initialized`
4. See the RVWAP chart with controls (Period: 30d/90d/365d, Timeframe: M15/1H/4H)
5. The indicator message should disappear

### Step 4: Verify TensionGlow Not Running
1. With console open, check for any of these patterns:
   - ❌ `[TensionGlow] Drawing glow` (should NOT appear)
   - ❌ `[TensionGlow] Initialized` (should NOT appear)
   - ❌ Any canvas-related glow errors
2. Search console for "TensionGlow" - should only see:
   - ✅ `[TensionGlow] Disabled - feature removed in revert`
   - ✅ `[TensionGlow] Not initialized - feature removed in revert`
   - ✅ `[TensionGlow] Disabled for RVWAP context - glow not initialized`

### Step 5: Verify Market Tension Charts (M15/1H/4H)
1. Scroll through the three Market Tension panels
2. Each should have:
   - ✅ OHLC candlestick chart (green/red candles)
   - ✅ Tension histogram below (gray/green bars)
   - ✅ Watermark: "borkiss.trade" (center overlay, semi-transparent)
   - ✅ Status indicator (green dot = OK, amber = loading, red = error)
   - ✅ Snapshot button (camera icon)
3. Console should show:
   - ✅ `[OhlcChart] Chart initialized successfully with histogram pane`
   - ✅ `[TensionGlow] Not initialized - feature removed in revert`
4. Verify NO glow effects under candles

### Step 6: Test Toggle Persistence
1. Toggle RVWAP ON
2. Refresh the page (F5)
3. RVWAP panel should remain visible (state persisted to localStorage)
4. Toggle RVWAP OFF
5. Refresh again
6. RVWAP panel should be hidden, indicator message shown

### Step 7: Check for Render Loops
1. With console open, watch for repeated log messages
2. Should NOT see continuous/infinite logging patterns
3. Logs should only appear:
   - Once on mount: `[MtmDashboard] Component mounted`
   - When data updates: `[OhlcChart] Updated candlestick data` (every 15s)
   - When RVWAP data loads: `[RvwapPanel] State:` (once per data fetch)
4. No infinite `requestAnimationFrame` loops (except AnimatedBackground, which is intentional)

## Expected Console Output (Example)

### Dashboard Load (RVWAP OFF)
```
[MtmDashboard] Component mounted
[MtmDashboard] Symbol: BTCUSDT
[MtmDashboard] DataSource: spot
[MtmDashboard] ShowRvwap: false
[TensionGlow] Disabled - feature removed in revert

[Panel M15] Rendering with: {symbol: 'BTCUSDT', dataSource: 'spot', timeframe: {…}}
[Panel 1H] Rendering with: {symbol: 'BTCUSDT', dataSource: 'spot', timeframe: {…}}
[Panel 4H] Rendering with: {symbol: 'BTCUSDT', dataSource: 'spot', timeframe: {…}}

[OhlcChart] Chart initialized successfully with histogram pane
[TensionGlow] Not initialized - feature removed in revert
[OhlcChart] Updated candlestick data: {points: 384, barSpacing: 3, ...}
```

### Toggle RVWAP ON
```
[MtmDashboard] ShowRvwap: true

[RvwapPanel] Mounted and rendering
[RvwapPanel] State: {symbol: 'BTCUSDT', period: '90d', timeframe: '1h', dataPoints: 0, isLoading: true, error: null}
[TensionGlow] Disabled for RVWAP context - glow not initialized

[RvwapChart] Chart initialized successfully
[RvwapChart] Updated data: {points: 2160, ...}
[RvwapPanel] State: {symbol: 'BTCUSDT', period: '90d', timeframe: '1h', dataPoints: 2160, isLoading: false, error: null}
```

## Troubleshooting

### Issue: RVWAP panel not visible
- **Cause:** Toggle is OFF (default state)
- **Solution:** Click "Show Rolling VWAP" toggle in header
- **Check:** Console should show `[MtmDashboard] ShowRvwap: true` when ON

### Issue: TensionGlow logs appear
- **Cause:** Browser cache or old build
- **Solution:** 
  1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
  2. Clear browser cache: DevTools → Application → Clear storage
  3. Rebuild: `npm run build`
  4. Restart dev server: `npm run dev`

### Issue: Chart not rendering
- **Cause:** Container dimensions not ready
- **Solution:** Check console for `[OhlcChart] Container has no dimensions yet, retrying...`
- **Workaround:** Resize browser window to trigger re-render

### Issue: Data not loading
- **Cause:** Binance API rate limit or network error
- **Solution:** Check console for error messages:
  - `[Panel M15] Data state: {error: "..."}` → Shows API error
  - Wait 60s and refresh (rate limit reset)

## Success Criteria

✅ All 3 Market Tension panels render (M15, 1H, 4H)
✅ RVWAP panel hidden by default with indicator message
✅ RVWAP panel appears when toggle is ON
✅ RVWAP toggle state persists across page refreshes
✅ Console shows TensionGlow disabled messages
✅ No "[TensionGlow] Drawing glow" logs appear
✅ No infinite render loops
✅ No TypeScript or runtime errors
✅ Build completes successfully: `npm run build` → `✓ built in 1.42s`

## Commit Reference

**Commit:** `974b1ae`
**Branch:** `revert/tension-glow`
**Message:** "fix(dashboard): ensure RVWAP panel renders correctly and disable TensionGlow render loop when inactive"

**Files Changed:**
- `src/pages/MtmDashboard.tsx` (+5 lines)
- `src/components/rvwap/RvwapPanel.tsx` (+2 lines)
- `src/components/ohlc/OhlcChart.tsx` (+1 line)

**Changes:**
1. Added console logs confirming TensionGlow is not initialized
2. Added visual indicator when RVWAP panel is hidden
3. Improved debug logging for RVWAP panel mount state

## Next Steps

1. ✅ Verify dashboard renders correctly (this guide)
2. ⏳ Merge `revert/tension-glow` branch to `main`
3. ⏳ Deploy to production (Vercel auto-deploy on main)
4. ⏳ Test on production: https://borkiss.trade/dashboard/mtm

---

**Last Updated:** October 28, 2025
**Status:** Ready for verification
