# Database Backup Instructions (Free Plan)

Since your Free Plan doesn't include automatic backups, here are 3 options to backup your database before deploying security fixes:

## Option 1: Using pg_dump (Recommended)

**Quick Method:**

```bash
# Run the backup script
./scripts/backup-database.sh
```

The script will:
- Create a `backups/` folder
- Export your entire database to a `.sql` file
- Show you the backup size and location

**Manual Method:**

```bash
# Create backups directory
mkdir -p backups

# Get your connection string from Supabase Dashboard
# Settings > Database > Connection string > URI

# Run backup (replace with your actual connection string)
pg_dump "postgresql://postgres.[PASSWORD]@db.hjzcimtmdxafilgrfeye.supabase.co:5432/postgres" > backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

**Install pg_dump if needed:**
- macOS: `brew install postgresql`
- Ubuntu: `sudo apt-get install postgresql-client`
- Windows: Download from https://www.postgresql.org/download/

---

## Option 2: Using Supabase CLI (Easiest)

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref hjzcimtmdxafilgrfeye

# Create backup
supabase db dump -f backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## Option 3: Export from Supabase Dashboard (Manual)

Since Free Plan doesn't have backup features, you can manually export your data:

**Step 1: Export Table Data**

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Export each important table to CSV
COPY (SELECT * FROM users) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM organizations) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM notes) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM files) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM form_responses) TO STDOUT WITH CSV HEADER;
-- ... repeat for critical tables
```

Save each result as a CSV file.

**Step 2: Export Schema**

In SQL Editor, run:

```sql
-- This will show you the schema
SELECT
    'CREATE TABLE ' || tablename || ' (' ||
    array_to_string(
        array_agg(
            column_name || ' ' || data_type
        ),
        ', '
    ) || ');'
FROM information_schema.columns
WHERE table_schema = 'public'
GROUP BY tablename;
```

Save the output.

⚠️ **This method is incomplete** - it won't capture all relationships, constraints, or functions. Use Option 1 or 2 if possible.

---

## Option 4: Skip Backup (Not Recommended)

If you absolutely cannot create a backup:

1. **Understand the risk**: If something goes wrong, you cannot restore your data
2. **Test in staging first**: Set up a test Supabase project and run migrations there
3. **Deploy during low-traffic time**: Minimize impact if issues occur
4. **Have rollback plan ready**: Know how to disable RLS if needed

**Rollback without backup:**

If migrations fail, you can disable RLS to restore access (but data may be inconsistent):

```sql
-- Emergency rollback - disables security
ALTER TABLE ai_workspaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
-- ... etc
```

---

## Recommended Approach

**Best:** Option 1 (pg_dump) or Option 2 (Supabase CLI)
- Complete backup of schema + data
- Easy to restore
- Takes 1-2 minutes

**Acceptable:** Option 3 (Manual CSV export)
- Incomplete but better than nothing
- Can recover critical data if needed

**Not Recommended:** Option 4 (Skip backup)
- Only if you're confident in the migrations
- Have tested in staging environment

---

## To Restore a Backup

### If you used pg_dump or Supabase CLI:

```bash
# Restore full database
psql "your-connection-string" < backups/your_backup_file.sql
```

### If you used CSV exports:

```sql
-- Restore table by table
COPY users FROM '/path/to/users.csv' WITH CSV HEADER;
COPY organizations FROM '/path/to/organizations.csv' WITH CSV HEADER;
-- ... etc
```

---

## Next Steps After Backup

Once you have a backup (or decided to proceed without one):

1. ✅ Read [SECURITY_FIXES_SUMMARY.md](./SECURITY_FIXES_SUMMARY.md)
2. ✅ Run the 3 migration files in order
3. ✅ Test your application
4. ✅ Keep the backup for 7 days after successful deployment

---

## Questions?

- **How long does backup take?** 1-5 minutes depending on database size
- **How much space needed?** Usually 10-100 MB for typical databases
- **Can I delete the backup?** Keep it for at least 7 days after deployment
- **What if I don't have PostgreSQL installed?** Use Option 2 (Supabase CLI) instead

**Ready to create your backup?** Run `./scripts/backup-database.sh` to start!
