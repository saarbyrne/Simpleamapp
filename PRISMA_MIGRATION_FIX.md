# Prisma Migration Issue - Quick Fix Guide

## The Problem

`npx prisma migrate dev` hangs or fails with Supabase's connection pooler because:
- Prisma uses prepared statements
- PgBouncer (connection pooler) reuses connections
- This causes "prepared statement 's1' already exists" errors

## Quick Solution

### Option 1: Use the Helper Script (Recommended)

```bash
npm run db:migrate
```

This script will:
1. Try to use direct connection (port 5432) if available
2. Fall back to manual instructions if direct connection fails
3. Guide you through the Supabase SQL Editor method

### Option 2: Manual Migration via Supabase Dashboard

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/hjzcimtmdxafilgrfeye
   ```

2. **Go to SQL Editor → New Query**

3. **Copy the SQL from `prisma/migration.sql`** and paste it

4. **Click Run** and wait for success

5. **Initialize Prisma migrations:**
   ```bash
   # Create migrations folder structure
   mkdir -p prisma/migrations
   
   # Mark the migration as applied (since you ran it manually)
   npx prisma migrate resolve --applied init
   
   # Generate Prisma Client
   npx prisma generate
   ```

### Option 3: Use Direct Connection (If Available)

If Supabase allows direct connections from your IP:

```bash
# Temporarily use direct connection
export DATABASE_URL="postgresql://postgres.hjzcimtmdxafilgrfeye:%2BG%2Ba.8PbaUjBrry@db.hjzcimtmdxafilgrfeye.supabase.co:5432/postgres"

# Run migrations
npx prisma migrate dev --name init

# Generate client
npx prisma generate
```

**Note:** Direct connections (port 5432) are often blocked by Supabase for security reasons.

## Why This Happens

- **Connection Pooler (port 6543)**: Uses PgBouncer, doesn't support prepared statements well
- **Direct Connection (port 5432)**: Full PostgreSQL, works with Prisma but may be blocked

## After Migration

Once migrations are applied:

1. ✅ Tables created in database
2. ✅ Run `npx prisma generate` to create Prisma Client
3. ✅ Run `npx tsx scripts/seed-templates.ts` to seed initial data

## Future Migrations

For future schema changes:

1. **Edit `prisma/schema.prisma`**
2. **Create migration SQL manually** or use:
   ```bash
   npm run db:migrate
   ```
3. **Apply via Supabase SQL Editor** if script fails
4. **Mark as resolved:**
   ```bash
   npx prisma migrate resolve --applied <migration_name>
   ```

## Verification

Check if tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see tables like:
- organizations
- users
- persons
- events
- event_templates
- etc.

