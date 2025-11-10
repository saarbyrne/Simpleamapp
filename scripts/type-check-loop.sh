#!/bin/bash

# Continuously check for TypeScript errors and report them
# Useful for finding all errors at once instead of fixing one-by-one
# Run: ./scripts/type-check-loop.sh

set -e

echo "🔍 Running comprehensive TypeScript type check..."
echo "This will find ALL type errors, not just the first one."
echo ""

# Use tsc directly for better error reporting
npx tsc --noEmit --pretty 2>&1 | tee /tmp/tsc-errors.txt

ERROR_COUNT=$(grep -c "error TS" /tmp/tsc-errors.txt || echo "0")

if [ "$ERROR_COUNT" -eq "0" ]; then
    echo ""
    echo "✅ No TypeScript errors found!"
    exit 0
fi

echo ""
echo "📊 Found $ERROR_COUNT TypeScript error(s)"
echo ""
echo "💡 Tips for fixing:"
echo "1. Start with the first error - fixing it may resolve others"
echo "2. Look for patterns - similar errors can be fixed together"
echo "3. Check type definitions in interfaces/types"
echo "4. Verify imports are correct"
echo ""
echo "Full error log saved to: /tmp/tsc-errors.txt"

