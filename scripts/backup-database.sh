#!/bin/bash

# ============================================
# Database Backup Script (for Free Plan)
# ============================================
# Since Free Plan doesn't include automatic backups,
# this script creates a manual backup before security deployment

set -e

echo "🗄️  Creating database backup..."
echo ""

# Add PostgreSQL to PATH if it's installed via Homebrew
if [ -d "/usr/local/opt/postgresql@16/bin" ]; then
    export PATH="/usr/local/opt/postgresql@16/bin:$PATH"
fi

# Check if pg_dump is available
if ! command -v pg_dump &> /dev/null; then
    echo "❌ pg_dump not found. Please install PostgreSQL client tools:"
    echo ""
    echo "macOS: brew install postgresql@16"
    echo "Ubuntu: sudo apt-get install postgresql-client"
    echo "Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

# Get database URL from .env or prompt user
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not found in environment"
    echo ""
    echo "Please enter your Supabase connection string:"
    echo "(Get it from: Supabase Dashboard > Settings > Database > Connection string > URI)"
    read -p "Connection string: " DATABASE_URL
fi

# Create backup directory
BACKUP_DIR="backups"
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/supabase_backup_${TIMESTAMP}.sql"

echo "📦 Backing up database to: $BACKUP_FILE"
echo ""

# Create backup
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup completed successfully!"
    echo ""
    echo "📁 Backup location: $BACKUP_FILE"
    echo "📊 Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
    echo ""
    echo "💡 To restore this backup later, run:"
    echo "   psql \"\$DATABASE_URL\" < $BACKUP_FILE"
    echo ""
    echo "⚠️  Keep this backup file safe until security deployment is complete!"
else
    echo "❌ Backup failed!"
    exit 1
fi
