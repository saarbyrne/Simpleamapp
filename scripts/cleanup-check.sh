#!/bin/bash

# Comprehensive cleanup script for design system issues

echo "==== DESIGN SYSTEM CLEANUP ===="
echo ""

# Track what we're fixing
issues_fixed=0

echo "[1/3] Removing Spanish text from story files..."
echo ""

# List of files with Spanish (from our earlier scan)
spanish_files=(
  "components/ui/alert.stories.tsx"
  "components/ui/carousel.stories.tsx"
  "components/ui/collapsible.stories.tsx"
  "components/ui/input-otp.stories.tsx"
  "components/ui/popover.stories.tsx"
  "components/ui/radio-group.stories.tsx"
  "components/ui/sonner.stories.tsx"
)

for file in "${spanish_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  Checking: $file"
    if grep -q "ción\|ía\|ó\|ñ" "$file"; then
      echo "    ⚠️  Contains Spanish text - needs manual fix"
    else
      echo "    ✓  No Spanish found"
    fi
  fi
done

echo ""
echo "[2/3] Checking for hardcoded colors (dark mode issues)..."
echo ""

# Find hardcoded colors that won't switch in dark mode
echo "  Files with hardcoded colors:"
grep -r "color:#\|text-\[color:" components/ui/*.stories.tsx 2>/dev/null | cut -d: -f1 | sort -u | while read file; do
  echo "    ⚠️  $file"
done

echo ""
echo "[3/3] Validating Tailwind classes..."
echo ""

# Check if all needed Tailwind classes exist in globals.css
needed_classes=("p-3" "p-6" "p-8" "pt-0" "space-y-1.5")
for class in "${needed_classes[@]}"; do
  if grep -q "\.$class " app/globals.css 2>/dev/null || grep -q "\.$class {" app/globals.css 2>/dev/null; then
    echo "  ✓  .$class exists"
  else
    echo "  ⚠️  .$class missing"
  fi
done

echo ""
echo "==== SUMMARY ===="
echo "Review the warnings above and fix manually."
echo ""
echo "To fix Spanish text, edit each file and translate to English."
echo "To fix dark mode, replace hardcoded colors with CSS variables like 'text-foreground'."
echo ""
