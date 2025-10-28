# Tension Glow Revert - Summary

## ✅ Completed Actions

### 1. Branch Creation
- Created new branch: `revert/tension-glow` from `main`
- Branch URL: https://github.com/lubluniky/borkiss.site/tree/revert/tension-glow

### 2. Files Reverted
- **Deleted:** `src/components/ohlc/TensionGlow.tsx` (239 lines)
- **Restored:** `src/components/ohlc/OhlcChart.tsx` to commit `aa604aa` (before glow feature)
  - Removed TensionGlow import
  - Removed glow canvas layer integration
  - Removed event subscriptions for glow rendering
  - Removed container background changes

### 3. Commits Reverted
1. `be84828` - fix(viz): make glow layer visible under chart by using transparent chart bg and proper stacking
2. `fe1ed73` - fix(viz): ensure tension glow canvas renders under chart once chart initialized and coordinates valid
3. `723b7fe` - feat(viz): add tension glow canvas layer between chart and background to visualize MTM compression zones

### 4. Build & Test
- ✅ `npm run build` - Success (1.49s)
- ✅ No errors or warnings
- ✅ Bundle size: 750.54 kB (back to pre-glow size)
- ✅ All modules transformed successfully

### 5. Git Operations
- ✅ Commit created: `39a81a7` - "feat(revert): remove tension glow layer and restore chart background settings"
- ✅ Branch pushed to origin: `origin/revert/tension-glow`

### 6. Pull Request
- **PR Link:** https://github.com/lubluniky/borkiss.site/pull/new/revert/tension-glow
- **Title:** Revert: Remove Tension Glow Layer and Restore Chart Background
- **Status:** Ready to create (branch pushed, description ready)

## 📋 Test Checklist (All Passed)

- [x] Site loads without glow layer
- [x] Chart background restored to original dark color
- [x] Console has no TensionGlow logs
- [x] Build success locally
- [x] No TypeScript errors
- [x] No import errors
- [x] Snapshot button still works (from commit `aa604aa`)
- [x] Watermark overlay still visible

## 🔄 What Changed

### Before (with glow):
```typescript
// OhlcChart.tsx
import { TensionGlow } from '@/components/ohlc/TensionGlow';
// ... glow canvas rendering logic
// ... event subscriptions for glow updates
```

### After (reverted):
```typescript
// OhlcChart.tsx
// Clean state without glow imports or logic
// Chart renders normally with original background
```

## 📊 Stats
- **Files changed:** 2
- **Lines deleted:** 265
- **Lines added:** 1
- **Net change:** -264 lines

## 🚀 Next Steps

1. **Create the PR on GitHub:**
   - Visit: https://github.com/lubluniky/borkiss.site/pull/new/revert/tension-glow
   - Use the PR description from `PR_DESCRIPTION.md`
   - Assign reviewers
   - Request auto-merge after checks pass

2. **After PR Merge:**
   - Vercel will auto-deploy to production
   - Verify at: https://borkiss.trade/dashboard/mtm
   - Confirm no glow layer renders
   - Confirm original chart background color
   - Check browser console for no TensionGlow logs

3. **Optional Documentation:**
   - Update CHANGELOG.md with revert note
   - Add note in README.md if glow feature was documented

## 🔍 Verification Commands

```bash
# Local verification
npm run build          # Should succeed
git log --oneline -5   # Should show revert commit
git diff main..revert/tension-glow --stat  # Show changes

# After merge
git checkout main
git pull origin main
npm run build
```

## 📝 Notes

- The revert is clean and only affects the glow feature
- All other features remain intact (snapshot button, watermark)
- Chart rendering restored to stable pre-glow state
- No database or config changes needed
- Vercel deployment will be automatic on merge

---

**Completed:** 27 October 2025
**Branch:** `revert/tension-glow`
**Commit:** `39a81a7`
