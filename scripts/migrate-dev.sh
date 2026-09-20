#!/bin/bash
# Prisma Migration Helper Script
# This script handles Prisma migrations with Supabase connection pooler workaround

set -e

echo "🔧 Prisma Migration Helper"
echo "=========================="
echo ""

# Check if migrations folder exists
if [ ! -d "prisma/migrations" ]; then
    echo "📁 Initializing Prisma migrations..."
    mkdir -p prisma/migrations
    
    # Create initial migration from schema
    echo "📝 Creating initial migration..."
    
    # Try with direct connection first (port 5432)
    DIRECT_URL="${DATABASE_URL//:6543/:5432}"
    DIRECT_URL="${DIRECT_URL//pooler.supabase.com/db.your-project-ref.supabase.co}"
    DIRECT_URL="${DIRECT_URL//pgbouncer=true&connect_timeout=15&pool_timeout=15/}"
    
    echo "Attempting direct connection (port 5432)..."
    if DATABASE_URL="$DIRECT_URL" npx prisma migrate dev --name init --create-only 2>/dev/null; then
        echo "✅ Migration created successfully with direct connection"
        echo "Applying migration..."
        DATABASE_URL="$DIRECT_URL" npx prisma migrate deploy 2>/dev/null || {
            echo "⚠️  Migration apply failed, but migration files were created"
            echo "You can apply the migration manually via Supabase SQL Editor"
        }
    else
        echo "⚠️  Direct connection failed (expected with Supabase)"
        echo ""
        echo "📋 Manual Migration Required"
        echo "============================"
        echo ""
        echo "Since Prisma migrations don't work with Supabase's connection pooler,"
        echo "you need to apply migrations manually:"
        echo ""
        echo "1. Open Supabase Dashboard:"
        echo "   https://supabase.com/dashboard/project/your-project-ref"
        echo ""
        echo "2. Go to SQL Editor → New Query"
        echo ""
        echo "3. Copy the SQL from: prisma/migration.sql"
        echo ""
        echo "4. Paste and click Run"
        echo ""
        echo "5. After running, initialize migrations:"
        echo "   npx prisma migrate resolve --applied init"
        echo ""
        echo "6. Generate Prisma Client:"
        echo "   npx prisma generate"
        echo ""
        exit 1
    fi
else
    echo "✅ Migrations folder already exists"
    echo "Running migrations..."
    
    # Try to run migrations with direct connection
    DIRECT_URL="${DATABASE_URL//:6543/:5432}"
    DIRECT_URL="${DIRECT_URL//pooler.supabase.com/db.your-project-ref.supabase.co}"
    DIRECT_URL="${DIRECT_URL//pgbouncer=true&connect_timeout=15&pool_timeout=15/}"
    
    if DATABASE_URL="$DIRECT_URL" npx prisma migrate dev 2>/dev/null; then
        echo "✅ Migrations applied successfully"
    else
        echo "⚠️  Migration failed with direct connection"
        echo ""
        echo "Please apply migrations manually via Supabase SQL Editor"
        echo "See PRISMA_PUSH_FIX.md for instructions"
        exit 1
    fi
fi

echo ""
echo "✅ Generating Prisma Client..."
npx prisma generate

echo ""
echo "✅ Migration complete!"

