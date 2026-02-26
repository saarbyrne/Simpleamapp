#!/bin/bash
# Stop hook: verify typecheck + lint pass — but ONLY when files changed.
# Exits immediately (~0.1s) if nothing was modified.

# Check if any files were actually changed
CHANGED=$(git diff --name-only 2>/dev/null)
STAGED=$(git diff --cached --name-only 2>/dev/null)

if [ -z "$CHANGED" ] && [ -z "$STAGED" ]; then
  exit 0
fi

# Files were modified — run checks
ERRORS=""

echo "⏳ Verifying typecheck..."
TC_OUTPUT=$(npx tsc --noEmit 2>&1)
TC_EXIT=$?
if [ $TC_EXIT -ne 0 ]; then
  ERRORS="${ERRORS}\n--- TypeCheck Errors ---\n$(echo "$TC_OUTPUT" | tail -10)"
fi

echo "⏳ Verifying lint..."
LINT_OUTPUT=$(npx next lint --quiet 2>&1)
LINT_EXIT=$?
if [ $LINT_EXIT -ne 0 ]; then
  ERRORS="${ERRORS}\n--- Lint Errors ---\n$(echo "$LINT_OUTPUT" | tail -10)"
fi

if [ -n "$ERRORS" ]; then
  echo ""
  echo "⚠️  Issues found in modified files:"
  echo -e "$ERRORS"
  echo ""
  echo "Run 'npm run qa:prep' for full details."
fi

# Always exit 0 — non-blocking warning only
exit 0
