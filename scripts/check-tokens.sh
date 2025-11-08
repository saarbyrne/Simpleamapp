#!/bin/bash

# Simple script to check for hardcoded Tailwind values in UI components
# Searches for common patterns that should be using design system tokens

echo "🔍 Checking for hardcoded Tailwind values in components..."
echo ""

# Define patterns to search for (common hardcoded values)
PATTERNS=(
  # Spacing patterns
  "p-[0-9]"
  "px-[0-9]"
  "py-[0-9]"
  "gap-[0-9]"
  "space-x-[0-9]"
  "space-y-[0-9]"
  # Icon sizing patterns
  'className.*h-[2-5].*w-[2-5]'
  'className.*w-[2-5].*h-[2-5]'
)

VIOLATIONS=0
FILES_CHECKED=0

# Check each component file
for file in components/ui/*.tsx; do
  # Skip story files
  if [[ $file == *.stories.tsx ]]; then
    continue
  fi

  FILES_CHECKED=$((FILES_CHECKED + 1))
  FILE_VIOLATIONS=0

  # Check for each pattern
  for pattern in "${PATTERNS[@]}"; do
    matches=$(grep -n -E "$pattern" "$file" 2>/dev/null | grep -v "ds-" || true)

    if [ -n "$matches" ]; then
      if [ $FILE_VIOLATIONS -eq 0 ]; then
        echo "📄 $file"
      fi

      # Count lines with matches
      count=$(echo "$matches" | wc -l)
      VIOLATIONS=$((VIOLATIONS + count))
      FILE_VIOLATIONS=$((FILE_VIOLATIONS + count))

      echo "$matches" | while read -r line; do
        echo "  $line"
      done
    fi
  done

  if [ $FILE_VIOLATIONS -gt 0 ]; then
    echo ""
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary:"
echo "  Files checked: $FILES_CHECKED"
echo "  Potential violations: $VIOLATIONS"
echo ""

if [ $VIOLATIONS -eq 0 ]; then
  echo "✅ No hardcoded values found! All components appear to use tokens."
  exit 0
else
  echo "⚠️  Found $VIOLATIONS lines with potential hardcoded values."
  echo "💡 Review these and ensure they use design system tokens where appropriate."
  echo ""
  echo "Examples of correct token usage:"
  echo "  gap-2 → gap-ds-sm"
  echo "  p-4 → p-ds-lg"
  echo "  h-4 w-4 → h-ds-icon-sm w-ds-icon-sm"
  exit 1
fi
