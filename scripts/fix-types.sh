#!/bin/bash

# Script to automatically find and attempt to fix TypeScript errors
# Run: ./scripts/fix-types.sh

set -e

echo "🔍 Running TypeScript type check..."
echo ""

# Run build and capture errors
BUILD_OUTPUT=$(npm run build 2>&1) || true

# Extract TypeScript errors
ERRORS=$(echo "$BUILD_OUTPUT" | grep -A 3 "Type error:" || echo "")

if [ -z "$ERRORS" ]; then
    echo "✅ No TypeScript errors found!"
    exit 0
fi

echo "❌ TypeScript errors found:"
echo "$ERRORS"
echo ""
echo "📝 Summary of errors:"
echo "$BUILD_OUTPUT" | grep "Type error:" | head -10
echo ""
echo "💡 To fix these:"
echo "1. Review each error above"
echo "2. Check the file and line number"
echo "3. Fix type mismatches, missing props, or incorrect types"
echo ""
echo "🔧 Common fixes:"
echo "- Missing props: Add to interface or make optional with '?'"
echo "- Type mismatches: Use type assertions 'as Type' or fix the type definition"
echo "- Null/undefined: Use '??' operator or optional chaining '?.'"
echo "- Generic types: Ensure generics match between definition and usage"
echo ""
echo "Run 'npm run build' to see full error details"

