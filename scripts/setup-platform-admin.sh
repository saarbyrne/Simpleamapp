#!/bin/bash

# Platform Admin Setup Script
# Run this script to set up the platform admin area for the first time

echo "🚀 Setting up Platform Admin Area..."
echo ""

# Step 1: Run migration
echo "📦 Step 1: Running database migration..."
npx prisma migrate deploy
if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully"
else
    echo "❌ Migration failed. Please check your database connection."
    exit 1
fi
echo ""

# Step 2: Generate Prisma client
echo "🔧 Step 2: Generating Prisma client..."
npx prisma generate
if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated successfully"
else
    echo "❌ Prisma client generation failed."
    exit 1
fi
echo ""

# Step 3: Prompt for admin email
echo "👤 Step 3: Granting platform admin access..."
read -p "Enter email address to grant platform admin access: " ADMIN_EMAIL

if [ -z "$ADMIN_EMAIL" ]; then
    echo "❌ Email address is required"
    exit 1
fi

# Grant platform admin access
npx prisma db execute --stdin <<SQL
UPDATE users SET "isPlatformAdmin" = true WHERE email = '$ADMIN_EMAIL';
SQL

if [ $? -eq 0 ]; then
    echo "✅ Platform admin access granted to: $ADMIN_EMAIL"
else
    echo "❌ Failed to grant platform admin access. User might not exist."
    echo "   Please create an account first at /signup"
    exit 1
fi

echo ""
echo "🎉 Platform Admin setup complete!"
echo ""
echo "You can now access the platform admin area at:"
echo "   http://localhost:3000/platform-admin"
echo ""
echo "For more information, see PLATFORM_ADMIN_README.md"
