#!/bin/bash
# SessionStart hook: inject git context at the start of every session.

# Guard: only run inside a git repo
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
  exit 0
fi

echo "=== Session Context ==="
echo "Branch: $(git branch --show-current 2>/dev/null)"
echo ""
echo "Last 3 commits:"
git log --oneline -3 2>/dev/null
echo ""

# Show uncommitted changes (if any)
STATUS=$(git status --short 2>/dev/null | head -10)
if [ -n "$STATUS" ]; then
  echo "Uncommitted changes:"
  echo "$STATUS"
  TOTAL=$(git status --short 2>/dev/null | wc -l | tr -d ' ')
  if [ "$TOTAL" -gt 10 ]; then
    echo "  ... and $((TOTAL - 10)) more"
  fi
else
  echo "Working tree: clean"
fi

exit 0
