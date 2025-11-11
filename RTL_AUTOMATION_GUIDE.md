# RTL Hardcoded Classes - Automated Testing & Fixing Guide

## Overview

We've created automated tools to systematically find and fix all hardcoded directional classes that need to be updated for RTL support.

## Test Results

**Current Status:** 🔴 **230 issues found** across **63 files**

### Breakdown:
- **High Priority:** 162 issues (margin/padding/text classes)
- **Medium Priority:** 68 issues (positioning classes)
- **Low Priority:** 0 issues (manual review items)

### Top Patterns:
- `mr-*` → `me-*`: **80 instances**
- `left-*` → `start-*`: **42 instances**
- `right-*` → `end-*`: **26 instances**
- `pl-*` → `ps-*`: **25 instances**
- `ml-*` → `ms-*`: **23 instances**
- `pr-*` → `pe-*`: **18 instances**
- `text-left` → `text-start`: **13 instances**
- `text-right` → `text-end`: **3 instances**

## Available Tools

### 1. Scanner Script (`npm run rtl:scan`)

Scans the codebase and generates a detailed report.

**Usage:**
```bash
npm run rtl:scan
```

**Output:**
- Console summary with counts
- Detailed markdown report: `RTL_SCAN_REPORT.md`
- Exit code 1 if issues found (useful for CI/CD)

**Example Output:**
```
📊 Scan Complete!

Total Issues: 230
  🔴 High Priority: 162
  🟡 Medium Priority: 68
  🟢 Low Priority: 0

Files Affected: 63
```

### 2. Preview Fixes (`npm run rtl:fix`)

Shows what would be fixed without modifying files (dry-run mode).

**Usage:**
```bash
npm run rtl:fix
```

**Output:**
- Lists all files that would be modified
- Shows how many issues would be fixed per file
- Does NOT modify any files

**Example Output:**
```
🔍 DRY RUN MODE - No files will be modified

🔧 Would fix 4 issue(s) in components/dashboard/app-sidebar.tsx
🔧 Would fix 3 issue(s) in components/dashboard/dashboard-layout-client.tsx
...
Would fix 226 total issue(s)
```

### 3. Apply Fixes (`npm run rtl:fix:apply`)

**⚠️ WARNING: This modifies files!** Review the dry-run first.

**Usage:**
```bash
# First, preview what will be fixed
npm run rtl:fix

# Then apply fixes
npm run rtl:fix:apply
```

**What it does:**
- Automatically replaces hardcoded classes with RTL-aware equivalents
- Skips files with manual review items (icons, complex logic)
- Creates backups? (Consider adding this feature)

### 4. Automated Test (`npm run test:rtl`)

Runs Vitest tests that verify RTL readiness.

**Usage:**
```bash
npm run test:rtl
```

**What it tests:**
- ✅ No hardcoded margin-left/right classes
- ✅ No hardcoded padding-left/right classes
- ✅ No hardcoded text-left/right classes
- ✅ No hardcoded left/right positioning classes
- ✅ Reports all issues found

**Current Status:** ❌ **5 tests failing** (expected - we have 230 issues to fix)

**After fixes:** ✅ All tests should pass

## Workflow Recommendations

### Option 1: Automated Fix (Recommended for most cases)

```bash
# 1. Scan and review report
npm run rtl:scan
# Review RTL_SCAN_REPORT.md

# 2. Preview fixes
npm run rtl:fix
# Review what would be changed

# 3. Apply fixes
npm run rtl:fix:apply

# 4. Verify fixes worked
npm run test:rtl
# Should pass after fixes are applied
```

### Option 2: Manual Review & Fix

```bash
# 1. Generate detailed report
npm run rtl:scan

# 2. Review RTL_SCAN_REPORT.md file by file
# 3. Manually fix issues in priority order
# 4. Run test to verify
npm run test:rtl
```

### Option 3: Incremental Fixes

```bash
# Fix high-priority files first
# Then run test to see progress
npm run test:rtl

# Continue fixing until tests pass
```

## What Gets Fixed Automatically

✅ **Safe to auto-fix:**
- `mr-2` → `me-2`
- `ml-auto` → `ms-auto`
- `text-left` → `text-start`
- `text-right` → `text-end`
- `pl-8` → `ps-8`
- `pr-2` → `pe-2`
- `left-0` → `start-0`
- `right-4` → `end-4`
- Most positioning classes

⚠️ **Needs manual review:**
- Icon components (ChevronRight, ArrowLeft) - need conditional logic
- Dialog centering (`left-[50%]`) - may need special handling
- Complex sidebar positioning logic
- Animation classes (Radix UI handles these automatically)

## Files Most Affected

1. **components/ui/sidebar.tsx** - 16 issues
2. **components/ui/dropdown-menu.tsx** - 15 issues
3. **components/ui/context-menu.tsx** - 15 issues
4. **components/ui/menubar.tsx** - 15 issues
5. **components/ui/select.tsx** - 8 issues
6. **app/dashboard/spreadsheets/page.tsx** - 8 issues
7. **app/dashboard/calendar/events/[eventId]/page.tsx** - 9 issues

## Integration with CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/rtl-check.yml
- name: Check RTL Readiness
  run: |
    npm run rtl:scan
    npm run test:rtl
```

This will fail the build if RTL issues are found, ensuring they're fixed before merging.

## Next Steps

1. **Review the scan report:** `RTL_SCAN_REPORT.md`
2. **Preview fixes:** `npm run rtl:fix`
3. **Apply fixes:** `npm run rtl:fix:apply` (after review)
4. **Verify:** `npm run test:rtl` should pass
5. **Test in browser:** Switch to Arabic locale and verify UI looks correct

## Estimated Time

- **Automated fixes:** ~5 minutes (226 issues)
- **Manual review of special cases:** ~1 hour
- **Testing:** ~2-3 hours
- **Total:** ~3-4 hours (vs 5-6 hours manual)

## Notes

- The scanner is conservative - it only fixes safe replacements
- Always review the dry-run output before applying fixes
- Some complex cases (icons, centering) need manual attention
- The test suite will catch any regressions
