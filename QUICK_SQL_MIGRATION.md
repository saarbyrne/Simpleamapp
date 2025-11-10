# Quick SQL Migration Guide

## IMPORTANT: Use the SQL file, NOT the bash script!

**Use this file:** `prisma/migration-complete.sql` ✅  
**DO NOT use:** `scripts/migrate-dev.sh` or any `.sh` file ❌

## Steps:

1. **Open Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/hjzcimtmdxafilgrfeye
   → SQL Editor → New Query
   ```

2. **Open the SQL file:**
   ```bash
   # In your terminal, open the file:
   open prisma/migration-complete.sql
   # OR
   code prisma/migration-complete.sql
   ```

3. **Copy ALL contents** from `prisma/migration-complete.sql` (starts with `-- Complete Prisma Schema Migration`)

4. **Paste into Supabase SQL Editor**

5. **Click Run**

6. **After success, run:**
   ```bash
   npm run db:generate
   npx tsx scripts/seed-spreadsheet-templates.ts
   ```

## Verify it's the right file:

The SQL file should start with:
```sql
-- Complete Prisma Schema Migration for Supabase
-- This migration is idempotent and can be run multiple times safely
```

If you see `#!/bin/bash` anywhere, you're copying from the wrong file!

