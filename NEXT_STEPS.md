# 🎯 Final Steps to Complete the Revert

## ✅ What's Already Done

1. ✅ Branch `revert/tension-glow` created and pushed
2. ✅ TensionGlow.tsx deleted
3. ✅ OhlcChart.tsx reverted to pre-glow state
4. ✅ Build verified successful
5. ✅ All changes committed and pushed

## 🚀 Next Step: Create Pull Request

### Option 1: Using GitHub Web Interface (Recommended)

1. **Visit this URL:**
   ```
   https://github.com/lubluniky/borkiss.site/pull/new/revert/tension-glow
   ```

2. **Fill in PR details:**
   - **Title:** `Revert: Remove Tension Glow Layer and Restore Chart Background`
   - **Description:** Copy from `PR_DESCRIPTION.md` (located in project root)
   - **Base branch:** `main`
   - **Compare branch:** `revert/tension-glow`

3. **Assign Reviewers:**
   - Add yourself or repo owner as reviewer
   - Request review if needed

4. **Enable Auto-merge (optional):**
   - After creating PR, click "Enable auto-merge"
   - Select "Squash and merge" or "Merge commit"
   - PR will auto-merge when checks pass

### Option 2: Using GitHub CLI (if installed)

```bash
cd /Users/borkiss../Desktop/borkiss

gh pr create \
  --title "Revert: Remove Tension Glow Layer and Restore Chart Background" \
  --body-file PR_DESCRIPTION.md \
  --base main \
  --head revert/tension-glow \
  --assignee @me
```

## 📋 After PR is Created

### Immediate Checks:
- [ ] Verify PR appears in GitHub
- [ ] Check that CI/CD checks start running
- [ ] Confirm branch comparison shows -265 lines

### After PR is Merged:
- [ ] Vercel auto-deploys to production
- [ ] Visit https://borkiss.trade/dashboard/mtm
- [ ] Verify no glow layer renders
- [ ] Check browser console - no TensionGlow logs
- [ ] Confirm charts display normally with all 3 timeframes

### Cleanup (after merge):
```bash
# Switch back to main
git checkout main

# Pull latest changes
git pull origin main

# Delete local revert branch (optional)
git branch -d revert/tension-glow

# Delete remote branch (optional, after confirming deployment)
git push origin --delete revert/tension-glow
```

## 📊 Quick Reference

**Branch:** `revert/tension-glow`
**Commit:** `39a81a7`
**Files Changed:** 2 (-265 lines)
**Build Status:** ✅ Passing
**PR Link:** https://github.com/lubluniky/borkiss.site/pull/new/revert/tension-glow

## 🔍 What Was Reverted

### Removed:
- ❌ `src/components/ohlc/TensionGlow.tsx` (entire file, 239 lines)
- ❌ TensionGlow import in OhlcChart.tsx
- ❌ Glow canvas rendering logic
- ❌ Event subscriptions for glow updates
- ❌ Container background changes (#141414 → original)

### Preserved:
- ✅ Snapshot button functionality
- ✅ Watermark overlay
- ✅ Chart rendering with transparent background
- ✅ All original MTM dashboard features

## 💡 Tips

1. **Review the PR carefully** before merging to ensure no unintended changes
2. **Test on staging** if available before merging to production
3. **Monitor Vercel deployment** after merge for any issues
4. **Keep the branch** for a few days in case rollback is needed

---

**Ready to proceed!** Just create the PR using the link above. 🚀
