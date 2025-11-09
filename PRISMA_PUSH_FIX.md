# Prisma DB Push Issue - Solution Guide

## Problem
`npx prisma db push` hangs when using Supabase connection pooler (`aws-1-eu-west-1.pooler.supabase.com:6543`). This is a known issue with Prisma and PgBouncer connection poolers.

**Error symptoms:**
- Command hangs indefinitely
- "prepared statement 's1' already exists" error
- Connection timeout issues

## Solution Options

### Option 1: Use Supabase Dashboard SQL (Recommended) ✅

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/hjzcimtmdxafilgrfeye
   - Click **SQL Editor** → **New Query**

2. **Run the migration SQL:**
   - Open `prisma/migration.sql` (392 lines)
   - Copy entire contents
   - Paste into SQL Editor
   - Click **Run**
   - Wait for "Success" message

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Seed templates:**
   ```bash
   npx tsx scripts/seed-templates.ts
   ```

### Option 2: Use Helper Script

Run the helper script:
```bash
./scripts/push-schema.sh
```

This will guide you through the process.

### Option 3: Direct Connection (May Not Work)

If Supabase allows direct connections from your IP:

```bash
export DATABASE_URL="postgresql://postgres:%2BG%2Ba.8PbaUjBrry@db.hjzcimtmdxafilgrfeye.supabase.co:5432/postgres"
npx prisma db push --accept-data-loss
npx prisma generate
npx tsx scripts/seed-templates.ts
```

**Note:** Direct connections (port 5432) are often blocked by Supabase for security reasons.

## Why This Happens

Prisma's `db push` command uses prepared statements that conflict with PgBouncer's connection pooling. The pooler reuses connections and prepared statements, causing conflicts.

## Verification

After applying the migration, verify tables exist:

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

## Next Steps After Schema Push

1. ✅ Tables created
2. ✅ Run `npx prisma generate`
3. ✅ Run `npx tsx scripts/seed-templates.ts`
4. ⚠️ Apply RLS policies (if not already done)
5. ⚠️ Create storage buckets (if needed)

