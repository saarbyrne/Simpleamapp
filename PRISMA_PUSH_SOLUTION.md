# Prisma DB Push Issue - Complete Solution

## The Problem

`prisma db push` hangs indefinitely when using Supabase's connection pooler (port 6543) because:
- Prisma uses prepared statements
- PgBouncer (connection pooler) reuses connections
- This causes conflicts: "prepared statement 's1' already exists"

## The Solution: Use Supabase SQL Editor

Since `prisma db push` doesn't work with connection poolers, run the SQL migration directly in Supabase.

### Step 1: Run SQL Migration in Supabase

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/hjzcimtmdxafilgrfeye
   ```

2. **Go to SQL Editor → New Query**

3. **Copy and paste the entire contents of:**
   ```
   prisma/migration-complete.sql
   ```

4. **Click Run** and wait for success

This migration is **idempotent** - it can be run multiple times safely. It will:
- Create all tables if they don't exist
- Add missing columns to existing tables
- Create indexes and foreign keys if they don't exist

### Step 2: Generate Prisma Client

After the migration succeeds, generate Prisma Client:

```bash
npm run db:generate
# or
npx prisma generate
```

### Step 3: Seed Templates (Optional)

Now you can seed the spreadsheet templates:

```bash
npx tsx scripts/seed-spreadsheet-templates.ts
```

## Why This Happens

- **Connection Pooler (port 6543)**: Uses PgBouncer, doesn't support prepared statements well
- **Direct Connection (port 5432)**: Full PostgreSQL, works with Prisma but often blocked by Supabase

## Verification

After running the migration, verify tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see all tables including:
- `spreadsheet_templates` ✅
- `spreadsheet_versions` ✅
- `spreadsheets` ✅
- And all other tables from your schema

## Alternative: Direct Connection (If Available)

If Supabase allows direct connections from your IP:

```bash
# Temporarily use direct connection (port 5432)
export DATABASE_URL="postgresql://postgres.hjzcimtmdxafilgrfeye:%2BG%2Ba.8PbaUjBrry@db.hjzcimtmdxafilgrfeye.supabase.co:5432/postgres"

# Then run
npx prisma db push
npx prisma generate
```

**Note:** Direct connections are often blocked for security reasons, so the SQL Editor method is more reliable.

