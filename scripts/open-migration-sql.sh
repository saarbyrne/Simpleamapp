#!/bin/bash
# Quick helper to open the correct migration SQL file

echo "📋 Opening Prisma Migration SQL File"
echo "======================================"
echo ""
echo "This is the CORRECT file to copy/paste into Supabase SQL Editor"
echo ""
echo "File: prisma/migration.sql"
echo ""

# Try to open the file
if command -v code &> /dev/null; then
    code prisma/migration.sql
    echo "✅ Opened in VS Code"
elif command -v open &> /dev/null; then
    open -a "TextEdit" prisma/migration.sql 2>/dev/null || open prisma/migration.sql
    echo "✅ Opened in default editor"
else
    echo "Showing first 50 lines:"
    echo ""
    head -50 prisma/migration.sql
    echo ""
    echo "... (file continues)"
fi

echo ""
echo "📝 Next Steps:"
echo "1. Copy ALL contents from prisma/migration.sql"
echo "2. Go to: https://supabase.com/dashboard/project/hjzcimtmdxafilgrfeye"
echo "3. Click: SQL Editor → New Query"
echo "4. Paste the SQL"
echo "5. Click: Run"
echo "6. After success, run: npx prisma generate"

