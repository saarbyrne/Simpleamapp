#!/bin/bash
# Check if database tables exist

echo "🔍 Checking Database Status"
echo "=========================="
echo ""

# Try to check if tables exist using Prisma
echo "Checking if tables exist..."
echo ""

# Check if migrations folder exists
if [ ! -d "prisma/migrations" ]; then
    echo "⚠️  Migrations folder not found"
    echo "   This is normal if you haven't run migrations yet"
    echo ""
fi

echo "📋 Next Steps:"
echo ""
echo "1. Open Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/hjzcimtmdxafilgrfeye"
echo ""
echo "2. Go to SQL Editor → New Query"
echo ""
echo "3. Copy ALL contents from: prisma/migration.sql"
echo "   (Run: npm run db:migrate:open to open the file)"
echo ""
echo "4. Paste into SQL Editor and click Run"
echo ""
echo "5. After success, verify tables exist by running:"
echo "   SELECT table_name FROM information_schema.tables"
echo "   WHERE table_schema = 'public' ORDER BY table_name;"
echo ""
echo "6. Then mark migration as applied:"
echo "   mkdir -p prisma/migrations"
echo "   npx prisma migrate resolve --applied init"
echo ""
echo "7. Restart your dev server"
echo ""

