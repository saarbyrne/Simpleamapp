#!/bin/bash
# Script to push Prisma schema using Supabase SQL method
# This avoids the connection pooler hanging issue

echo "📋 Prisma Schema Push Helper"
echo "=============================="
echo ""
echo "Since 'prisma db push' hangs with connection poolers,"
echo "we'll use the Supabase Dashboard SQL method instead."
echo ""
echo "Step 1: Open Supabase Dashboard"
echo "  https://supabase.com/dashboard/project/your-project-ref"
echo ""
echo "Step 2: Go to SQL Editor → New Query"
echo ""
echo "Step 3: Copy and paste the SQL from: prisma/migration.sql"
echo ""
echo "Step 4: Click Run"
echo ""
echo "Step 5: After tables are created, run:"
echo "  npx prisma generate"
echo "  npx tsx scripts/seed-templates.ts"
echo ""
echo "Would you like to open the migration SQL file? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    if command -v code &> /dev/null; then
        code prisma/migration.sql
    elif command -v open &> /dev/null; then
        open prisma/migration.sql
    else
        cat prisma/migration.sql
    fi
fi

