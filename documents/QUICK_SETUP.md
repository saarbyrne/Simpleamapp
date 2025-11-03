# Quick Database Setup - 5 Minutes

## Step 1: Push Prisma Schema (1 minute)

Run this command:

```bash
npx prisma db push --accept-data-loss
```

**If it hangs:** Press Ctrl+C and use the Supabase Dashboard method below instead.

## Step 2: Verify Tables (30 seconds)

Go to Supabase Dashboard → SQL Editor and run:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see 18 tables including: `organizations`, `users`, `persons`, `forms`, `events`, etc.

## Step 3: Run RLS Policies (3 minutes)

1. Open [RLS_POLICIES.sql](RLS_POLICIES.sql)
2. Copy the entire file
3. Paste into Supabase SQL Editor
4. Click **Run**
5. Wait for "Success. No rows returned"

## Step 4: Create Storage Bucket (1 minute)

In Supabase Dashboard:

1. Click **Storage**
2. Click **Create a new bucket**
3. Name: `player-photos`
4. Public: **ON**
5. Click **Create**

Then add these 4 storage policies (New Policy → Custom):

**Policy 1:**
```sql
CREATE POLICY "Public can view player photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'player-photos');
```

**Policy 2:**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'player-photos');
```

**Policy 3:**
```sql
CREATE POLICY "Owners can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'player-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 4:**
```sql
CREATE POLICY "Owners can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'player-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Done! 🎉

Your database is secure and ready to use.

Test it:
1. Go to http://localhost:3000
2. Log in
3. Add a player with photo
4. View player profile
5. Delete player

---

## Troubleshooting

### Prisma hangs on db push
- Kill it (Ctrl+C)
- Tables might have been created anyway - check Step 2
- If not, use Database Dashboard → Table Editor → Create tables manually

### "relation does not exist" error
- Run Step 2 to verify tables exist
- If not, run Prisma command again or create via Dashboard

### Storage upload fails
- Verify bucket exists (Storage → player-photos)
- Check all 4 policies are created
- Verify bucket is PUBLIC

### Can't see players after adding
- RLS might not be configured
- Check Step 3 completed successfully
- Verify you're logged in with the same user
