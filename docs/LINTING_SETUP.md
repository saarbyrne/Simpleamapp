# Linting Setup & Early Error Detection

## Problem Summary

You were experiencing lint errors during Vercel deployment that weren't being caught earlier in the development process. This document explains what was fixed and how to catch lint errors earlier.

## Issues Found & Fixed

### 1. ✅ ESLint Configuration Compatibility Issue
**Problem**: ESLint was failing locally with errors about deprecated options (`useEslintrc`, `extensions`, etc.)

**Root Cause**: Version mismatch - `eslint-config-next@16.0.3` was installed but the project uses Next.js 14.2.35, which requires `eslint-config-next@14.2.35`.

**Fix**: Reinstalled the correct version of `eslint-config-next` to match Next.js version.

### 2. ✅ Build Process Not Running Lint Explicitly
**Problem**: While Next.js runs linting during build, it wasn't explicit and could be missed.

**Fix**: Updated `build` script to explicitly run `npm run lint` before `next build`, ensuring:
- Linting fails fast with clear error messages
- Errors are caught before the build process starts
- Consistent behavior across local, CI, and Vercel deployments

### 3. ✅ Next.js Build Configuration
**Problem**: Next.js could potentially ignore lint errors during builds.

**Fix**: Configured `next.config.js` to:
- Set `eslint.ignoreDuringBuilds: false` - ensures build fails on lint errors
- Set `typescript.ignoreBuildErrors: false` - ensures build fails on type errors

## Current Setup

### Scripts Available

```bash
# Run linting (shows warnings and errors)
npm run lint

# Run linting and auto-fix issues where possible
npm run lint:fix

# Build (runs linting first, then builds)
npm run build

# Full QA check (lint + typecheck + tests)
npm run qa:prep
```

### CI/CD Protection

**GitHub Actions** (`.github/workflows/qa.yml`):
- ✅ Runs `npm run lint` as a separate job before other tests
- ✅ Blocks all subsequent jobs if linting fails
- ✅ Runs on every push to `main` and on pull requests

**Vercel Deployment**:
- ✅ Runs `npm run build` which now includes `npm run lint`
- ✅ Build will fail if linting errors are present
- ✅ Next.js build also runs linting as a secondary check

## How to Catch Errors Earlier

### 1. Run Linting Locally (Recommended)
Before committing or pushing:

```bash
npm run lint
```

Or use the auto-fix option:

```bash
npm run lint:fix
```

### 2. Use Your IDE/Editor
Most modern editors (VS Code, WebStorm, etc.) can show ESLint errors in real-time:
- Install the ESLint extension
- Errors will appear with red underlines
- Warnings will appear with yellow underlines

### 3. Pre-commit Hook (Optional but Recommended)
To automatically run linting before each commit, you can set up a pre-commit hook:

**Option A: Using husky (recommended)**
```bash
npm install --save-dev husky lint-staged
npx husky init
```

Then create `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
```

**Option B: Simple Git hook**
Create `.git/hooks/pre-commit`:
```bash
#!/bin/sh
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix errors before committing."
  exit 1
fi
```

### 4. Use the QA Scripts
Before pushing, run:

```bash
npm run qa:prep
```

This runs linting, type checking, and unit tests.

## Current Lint Status

As of the fix, linting is working correctly. You currently have:
- ✅ **0 errors** - Build will succeed
- ⚠️ **Several warnings** - These won't block deployment but should be addressed

### Common Warnings Found
- React Hook dependency warnings (`react-hooks/exhaustive-deps`)
- Missing alt text on images (`jsx-a11y/alt-text`)

These are warnings, not errors, so they won't block deployment. However, you can fix them using:

```bash
npm run lint:fix  # Auto-fixes some issues
```

Or manually address the warnings shown in the lint output.

## Troubleshooting

### Linting Fails Locally
1. Make sure dependencies are installed: `npm ci`
2. Check ESLint version: `npm list eslint eslint-config-next`
3. Try reinstalling: `npm install eslint-config-next@14.2.35 --save-dev`

### Linting Passes Locally but Fails on Vercel
1. Ensure you're using the same Node.js version
2. Run `npm ci` locally (not `npm install`) to match CI/Vercel
3. Check for environment-specific issues

### Want to Temporarily Skip Linting
If you need to build without linting (not recommended for production):

```bash
# Skip linting in build script
ESLINT_NO_DEV_ERRORS=true npm run build
```

Or modify `next.config.js` temporarily:
```javascript
eslint: {
  ignoreDuringBuilds: true, // ⚠️ Only for emergencies
}
```

## Next Steps

1. **Fix existing warnings** (optional but recommended):
   ```bash
   npm run lint:fix
   ```

2. **Set up pre-commit hook** (optional but recommended):
   - Prevents committing code with lint errors
   - Catches issues before they reach CI/Vercel

3. **Configure your IDE**:
   - Install ESLint extension
   - Enable "format on save" with ESLint

4. **Review CI settings**:
   - Ensure the "Lint & Typecheck" job is set as a required check in GitHub
   - Go to: Repository Settings → Branches → Branch protection rules

## Summary

✅ **Fixed**: ESLint configuration compatibility  
✅ **Fixed**: Build process now explicitly runs linting  
✅ **Fixed**: Next.js configured to fail on lint errors  
✅ **Verified**: CI/CD properly blocks on lint failures  

You should now catch lint errors:
- **Locally** when running `npm run lint` or `npm run build`
- **In CI** before code is merged
- **On Vercel** during deployment (as a final check)

The linting test you thought was included **was** there, but it wasn't working due to the configuration issue. It's now fixed and will catch errors at all stages of your workflow.
