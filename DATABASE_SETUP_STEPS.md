# Database Setup - Step by Step Guide

## Current Status
✅ Prisma Client generated  
❌ Database tables not created yet

## Step 1: Run SQL Migration in Supabase

You need to manually run the SQL migration because Prisma's migration tool doesn't work with Supabase's connection pooler.

### Quick Steps:

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/hjzcimtmdxafilgrfeye
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

2. **Copy the Migration SQL:**
   - Open the file: `prisma/migration.sql` (638 lines)
   - Select ALL contents (Cmd+A / Ctrl+A)
   - Copy (Cmd+C / Ctrl+C)

3. **Paste and Run:**
   - Paste into the SQL Editor
   - Click **Run** button (or press Cmd+Enter / Ctrl+Enter)
   - Wait for "Success" message (may take 10-30 seconds)

4. **Verify Tables Were Created:**
   Run this query in SQL Editor to check:
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
   - person_organizations
   - events
   - event_templates
   - form_templates
   - etc.

## Step 2: Initialize Prisma Migrations (OPTIONAL - Can Skip!)

**IMPORTANT:** The `prisma migrate resolve` command hangs with Supabase connection poolers. **You can skip this step!** It's only for Prisma's internal tracking and doesn't affect your app.

If you want to try it anyway (it will likely hang/timeout):
```bash
# Create migrations folder (already done)
mkdir -p prisma/migrations

# This will likely hang - that's OK, just skip it!
npx prisma migrate resolve --applied init
```

**You can safely skip this step** - your app will work fine without it!

## Step 3: Verify Everything Works (Do This Instead!)

Skip Step 2 and go straight to testing:

1. **Restart your dev server** (if running):
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Try accessing the profile page:**
   - Go to: http://localhost:3000/dashboard/profile
   - Should now load without errors

## Step 4: Seed Initial Data (Optional)

If you want to seed some initial data:

```bash
npx tsx scripts/seed-templates.ts
```

## Troubleshooting

### If SQL fails with errors:
- Check the error message
- Common issues:
  - Tables already exist → Drop them first or use `CREATE TABLE IF NOT EXISTS`
  - Syntax errors → Check the SQL file is complete
  - Connection timeout → Try running in smaller chunks

### If tables still don't show:
- Verify you're connected to the correct database
- Check the Supabase project URL matches your `.env` file
- Try refreshing the Supabase dashboard

### Quick Test Query:
After migration, test with:
```sql
SELECT COUNT(*) FROM organizations;
```
Should return 0 (no error means tables exist).

