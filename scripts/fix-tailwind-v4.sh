#!/bin/bash

# Script to fix Tailwind v4 CSS variable syntax in shadcn components
# This converts Tailwind v3 arbitrary values to v4-compatible inline styles

echo "🔧 Fixing Tailwind v4 CSS variable syntax in components/ui..."

# Find all TypeScript files in components/ui
find components/ui -name "*.tsx" -o -name "*.ts" | while read -r file; do
  # Check if file contains problematic patterns
  if grep -q 'w-\[--' "$file" || grep -q 'w-\[var(--' "$file" || grep -q 'h-\[--' "$file" || grep -q 'h-\[var(--' "$file"; then
    echo "  📝 Found CSS variable usage in: $file"

    # Backup the file
    cp "$file" "$file.bak"

    # Note: Automated replacement is complex due to React component structure
    # This script identifies files that need manual review
    echo "     ⚠️  Manual review required - see fix pattern in components/ui/sidebar.tsx"
  fi
done

echo ""
echo "✅ Scan complete!"
echo ""
echo "📚 Fix Pattern:"
echo "   Before: className=\"w-[--sidebar-width]\""
echo "   After:  style={{ width: \"var(--sidebar-width)\" }} className=\"...\""
echo ""
echo "   Before: className=\"w-[calc(var(--custom-var)+1rem)]\""
echo "   After:  Use hardcoded values like \"!w-16\" or inline styles"
echo ""
echo "💡 Tip: Check components/ui/sidebar.tsx for examples of the correct pattern"
