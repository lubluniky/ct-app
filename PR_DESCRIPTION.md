# Revert: Remove Tension Glow Layer and Restore Chart Background

## Summary
This PR reverts the tension glow visualization feature that was causing visual rendering issues with lightweight-charts.

## Changes
- ❌ Removed `src/components/ohlc/TensionGlow.tsx` component
- ⏪ Restored `src/components/ohlc/OhlcChart.tsx` to pre-glow state (commit `aa604aa`)
- 🔧 Removed glow canvas layer and event subscriptions
- 🎨 Restored chart background to original dark color

## Reason for Revert
The glow layer implementation had visibility issues where the canvas layer was not properly rendering under the lightweight-charts canvas, causing visual regressions and layout conflicts. Reverting to the stable chart rendering state.

## Commits Reverted
- `be84828` - fix(viz): make glow layer visible under chart by using transparent chart bg and proper stacking
- `fe1ed73` - fix(viz): ensure tension glow canvas renders under chart once chart initialized and coordinates valid
- `723b7fe` - feat(viz): add tension glow canvas layer between chart and background to visualize MTM compression zones

## Test Checklist
- [x] Build succeeds locally (`npm run build` ✓)
- [x] Site loads without glow layer
- [x] Chart background restored to original dark color
- [x] Console has no TensionGlow logs
- [x] All 3 timeframes (M15, 1H, 4H) render correctly
- [x] Snapshot button still works
- [x] Watermark overlay still visible

## Deployment
After merge, Vercel will auto-deploy to https://borkiss.trade/dashboard/mtm

## Reviewer Notes
Please verify that:
1. Charts render with original dark background (no transparent bg)
2. No console errors related to TensionGlow
3. All existing features (snapshot, watermark) still work
4. Build passes CI checks

---

**Files Changed:** 2 files, 265 deletions(-)
**Branch:** `revert/tension-glow`
**Base:** `main`
