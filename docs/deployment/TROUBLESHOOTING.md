# Deployment Troubleshooting Guide

## Issue: No Data Showing / Authentication Failing

### Symptoms
- No players, forms, or other data showing in the deployed app
- Console errors like:
  - `Failed to load resource: the server responded with a status of 400 ()` from Supabase auth endpoint
  - `hjzcimtmdxafilgrfeye.supabase.co/auth/v1/token?grant_type=password:1 Failed to load resource`

### Root Cause
Missing or incorrect Supabase environment variables in your Vercel deployment.

### Solution

#### 1. Check Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Verify these variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL` - Should be `https://hjzcimtmdxafilgrfeye.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key (starts with `eyJ...`)

#### 2. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`hjzcimtmdxafilgrfeye`)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 3. Set Environment Variables in Vercel

1. In Vercel, go to **Settings** → **Environment Variables**
2. For each variable:
   - Click **Add New**
   - Enter the variable name
   - Enter the value
   - Select **Production**, **Preview**, and **Development** environments (or as needed)
   - Click **Save**

#### 4. Redeploy

After setting the environment variables:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a new deployment

### Verification

After redeploying, check:
1. Open your deployed app
2. Try to log in
3. Check browser console - should not see 400 errors from Supabase
4. Data should load correctly

### Additional Environment Variables

Make sure these are also set in Vercel:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string (transaction pooler)
- `DIRECT_URL` - PostgreSQL connection string (direct connection)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

**Optional (but recommended):**
- `NEXT_PUBLIC_APP_URL` - Your app URL (e.g., `https://simpleam.app`)
- `NODE_ENV` - Should be `production` for production deployments

### Common Mistakes

1. **Missing `NEXT_PUBLIC_` prefix**: Client-side variables MUST start with `NEXT_PUBLIC_`
2. **Wrong environment**: Make sure variables are set for the correct environment (Production/Preview/Development)
3. **Trailing spaces**: Check for extra spaces when copying values
4. **Old values**: If you regenerated Supabase keys, make sure Vercel has the latest values

### Still Having Issues?

1. Check Vercel build logs for errors during build
2. Check Vercel function logs for runtime errors
3. Verify Supabase project is active and not paused
4. Check Supabase dashboard for any service issues
