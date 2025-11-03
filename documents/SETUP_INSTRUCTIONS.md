# SimpleAM.app - Security Setup Instructions

## ⚠️ CRITICAL: Complete Before Adding Real User Data

These steps enable Row-Level Security and Storage. Without them, your database is open to unauthorized access.

---

## Step 1: Enable Row-Level Security (RLS)

**Time Required:** 5 minutes

### Instructions:

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/hjzcimtmdxafilgrfeye

2. Click **SQL Editor** in the left sidebar

3. Click **New Query**

4. Copy and paste the entire contents of [RLS_POLICIES.sql](RLS_POLICIES.sql) into the editor

5. Click **Run** (or press Cmd/Ctrl + Enter)

6. Wait for completion message

7. **Verify RLS is enabled:**
   - Run this query:
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public'
   AND rowsecurity = true
   ORDER BY tablename;
   ```
   - You should see all 20 tables listed with `rowsecurity = true`

### What This Does:

- Enables RLS on all tables
- Users can only see data from their organization
- Admins have elevated privileges (create/delete)
- Users can update their own content (notes, files)
- Prevents data leakage between organizations

---

## Step 2: Create Storage Bucket

**Time Required:** 3 minutes

### Instructions:

1. In Supabase Dashboard, click **Storage** in the left sidebar

2. Click **Create a new bucket**

3. Configure the bucket:
   - **Name:** `player-photos`
   - **Public bucket:** ON (toggle to green)
   - **File size limit:** 5242880 (5MB)
   - **Allowed MIME types:** `image/jpeg,image/png,image/webp`

4. Click **Create bucket**

5. **Set up storage policies:**
   - Click on the `player-photos` bucket
   - Click **Policies** tab
   - Click **New Policy**
   - Select **Custom policy**
   - Add these 4 policies:

**Policy 1: Public can view photos**
```sql
CREATE POLICY "Public can view player photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'player-photos');
```

**Policy 2: Authenticated users can upload**
```sql
CREATE POLICY "Authenticated users can upload player photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'player-photos');
```

**Policy 3: Owners can update**
```sql
CREATE POLICY "Owners can update their player photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'player-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 4: Owners can delete**
```sql
CREATE POLICY "Owners can delete their player photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'player-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### What This Does:

- Creates secure storage for player photos
- Anyone can view photos (public bucket)
- Only authenticated users can upload
- Only file owners can update/delete their uploads
- Files organized by user ID for security

---

## Step 3: Verify Setup

### Test RLS:

1. Try to access players without authentication:
   ```bash
   curl https://hjzcimtmdxafilgrfeye.supabase.co/rest/v1/persons \
     -H "apikey: YOUR_ANON_KEY"
   ```
   **Expected:** Should return empty array or error (not actual player data)

2. Log in to the app with your test account

3. Navigate to /dashboard/players

4. **Expected:** You should see only players from your organization

### Test Storage:

1. Log in to the app

2. Try to add a new player

3. Upload a photo

4. **Expected:** Photo uploads successfully and displays in the table

5. Check Supabase Storage dashboard

6. **Expected:** File appears in `player-photos` bucket under your user ID folder

---

## Step 4: Test with Multiple Accounts

To verify multi-tenant isolation:

1. Create a second organization by signing up with a different email

2. Add players to the second organization

3. Switch between accounts

4. **Expected:** Each account only sees players from its own organization

---

## Troubleshooting

### RLS Issues:

**Problem:** "row-level security policy" error when accessing data

**Solution:** Make sure you're authenticated. Check that the `users` table has a record for your Supabase auth user.

**Problem:** Can't see any data after enabling RLS

**Solution:**
1. Check your user exists: `SELECT * FROM users WHERE id = auth.uid()::text;`
2. Check organization link: `SELECT * FROM user_roles WHERE user_id = auth.uid()::text;`
3. Run `/dashboard/setup` to create organization and user records

### Storage Issues:

**Problem:** "Failed to upload file" error

**Solution:**
1. Verify bucket exists and is public
2. Check storage policies are created
3. Verify you're authenticated
4. Check file size (max 5MB) and type (JPEG/PNG/WebP only)

**Problem:** Can't view uploaded photos

**Solution:**
1. Verify bucket is public
2. Check the SELECT policy is created
3. Try accessing the public URL directly in browser

### Database Connection Issues:

**Problem:** Can't connect to database from Prisma

**Solution:**
1. Verify DATABASE_URL uses pooler: `aws-1-eu-west-1.pooler.supabase.com:6543`
2. Check `?pgbouncer=true` is in connection string
3. Test connection: `npx prisma db push`

---

## Security Checklist

Before going to production, verify:

- [ ] RLS enabled on all tables
- [ ] Storage policies configured
- [ ] Environment variables not committed to git
- [ ] Supabase service role key kept secret
- [ ] 2FA enabled on Supabase account
- [ ] Only necessary CORS origins allowed
- [ ] Rate limiting configured
- [ ] Input validation with Zod
- [ ] Error monitoring set up (Sentry)

---

## Next Steps

After completing setup:

1. ✅ Test player creation with photo upload
2. ✅ Test multi-tenant isolation with 2+ orgs
3. ✅ Add more players to test CSV import
4. Continue with Forms module implementation

---

## Support

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Verify network requests in DevTools
4. Review [RLS_POLICIES.sql](RLS_POLICIES.sql) for policy details
