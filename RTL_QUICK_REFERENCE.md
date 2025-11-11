# RTL Hardcoded Classes - Quick Reference

## Test Results Summary

✅ **Total Files Affected:** 63 files
✅ **Total Instances Found:** 272+ hardcoded directional classes

### Breakdown by Pattern:
- `mr-*` (margin-right): **81 instances** → Should be `me-*` (margin-end)
- `ml-*` (margin-left): **23 instances** → Should be `ms-*` (margin-start)  
- `text-left`: **13 instances** → Should be `text-start`
- `text-right`: **3 instances** → Should be `text-end`
- `pl-*` (padding-left): **~30 instances** → Should be `ps-*` (padding-start)
- `pr-*` (padding-right): **~25 instances** → Should be `pe-*` (padding-end)
- `left-*`: **~50 instances** → Should be `start-*`
- `right-*`: **~47 instances** → Should be `end-*`

## Quick Fix Reference

| Current Class | RTL-Aware Replacement | Count |
|---------------|----------------------|-------|
| `mr-2` | `me-2` | ~60 |
| `mr-1` | `me-1` | ~5 |
| `mr-4` | `me-4` | ~3 |
| `ml-auto` | `ms-auto` | ~15 |
| `ml-2` | `ms-2` | ~5 |
| `ml-1` | `ms-1` | ~3 |
| `-ml-1` | `-ms-1` | ~2 |
| `-ml-4` | `-ms-4` | ~1 |
| `text-left` | `text-start` | 13 |
| `text-right` | `text-end` | 3 |
| `pl-8` | `ps-8` | ~15 |
| `pl-4` | `ps-4` | ~5 |
| `pl-2` | `ps-2` | ~5 |
| `pr-2` | `pe-2` | ~10 |
| `pr-4` | `pe-4` | ~5 |
| `pr-8` | `pe-8` | ~5 |
| `pr-10` | `pe-10` | ~2 |
| `left-0` | `start-0` | ~15 |
| `left-2` | `start-2` | ~8 |
| `left-4` | `start-4` | ~5 |
| `left-[50%]` | `start-[50%]` | ~2 |
| `right-0` | `end-0` | ~15 |
| `right-1` | `end-1` | ~5 |
| `right-3` | `end-3` | ~3 |
| `right-4` | `end-4` | ~8 |

## Top Priority Files (User-Facing)

1. **components/dashboard/dashboard-layout-client.tsx** - 3 instances
2. **components/dashboard/app-sidebar.tsx** - 4 instances  
3. **components/ui/data-table.tsx** - 3 instances
4. **components/ui/date-picker.tsx** - 2 instances
5. **components/dashboard/players-table-new.tsx** - 2 instances

## Special Attention Required

### Icons That Need Conditional Flipping:
- `ChevronRight` → Should flip to `ChevronLeft` in RTL
- `ArrowLeft` → Should flip to `ArrowRight` in RTL

### Complex Positioning:
- Dialog/Modal centering (`left-[50%]`) - May need special handling
- Sidebar positioning logic - Needs RTL-aware adjustments

## Next Steps

1. Start with high-priority dashboard components (30 min)
2. Fix UI components systematically (2 hours)
3. Handle special cases with conditional logic (1 hour)
4. Test thoroughly in RTL mode (2-3 hours)

Total estimated time: **5-6 hours**
