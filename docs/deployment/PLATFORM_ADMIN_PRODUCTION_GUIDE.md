# Platform Admin - Production Deployment Guide

This guide will help you deploy the Platform Admin area to production with confidence.

## 🎯 Production-Ready Checklist

### ✅ What's Been Improved

1. **Database Connection** - Fixed Supabase pooler issues with `directUrl`
2. **Data Integrity** - Added unique constraints to prevent duplicate subscriptions
3. **Input Validation** - All server actions use Zod validation
4. **Error Handling** - Comprehensive error boundaries and handling
5. **Configuration** - Environment-based pricing and settings
6. **Loading States** - Proper loading indicators throughout
7. **Type Safety** - Enhanced TypeScript types and schemas
8. **Audit Logging** - All actions logged for compliance

## 📋 Pre-Deployment Steps

### 1. Update Environment Variables

Update your production `.env` file with these required variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Stripe (if using)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Platform Admin Configuration
PLAN_PRICING_PRO="29"
PLAN_PRICING_ENTERPRISE="99"
```

### 2. Run Database Migration

**IMPORTANT**: The Prisma migration system doesn't work well with Supabase pooler. You'll need to run the SQL manually.

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to SQL Editor
4. Copy and paste this SQL:

```sql
-- Add unique constraint to organizationId
-- First, remove duplicate subscriptions if any exist
WITH RankedSubscriptions AS (
  SELECT id, "organizationId",
    ROW_NUMBER() OVER (PARTITION BY "organizationId" ORDER BY "createdAt" DESC) as rn
  FROM subscriptions
)
DELETE FROM subscriptions
WHERE id IN (
  SELECT id FROM RankedSubscriptions WHERE rn > 1
);

-- Now add the unique constraint
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_organizationId_key;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_organizationId_key UNIQUE ("organizationId");

-- Add unique constraint to stripeSubscriptionId
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_stripeSubscriptionId_key;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_stripeSubscriptionId_key UNIQUE ("stripeSubscriptionId");

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_plan_idx ON subscriptions(plan);
```

5. Click "Run" to execute

#### Option B: Using psql CLI

```bash
psql "$DIRECT_URL" < /tmp/subscription_migration.sql
```

### 3. Regenerate Prisma Client

After schema changes, regenerate the Prisma client:

```bash
npx prisma generate
```

### 4. Grant Platform Admin Access

Grant yourself (and only trusted team members) platform admin access:

```sql
UPDATE users
SET "isPlatformAdmin" = true
WHERE email = 'your-email@yourcompany.com';
```

**CRITICAL**: Never grant this through the UI. Always use direct SQL.

## 🚀 Deployment Steps

### Using Vercel (Recommended)

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Add production-ready Platform Admin"
   git push
   ```

2. **Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env.example`
   - Ensure `DIRECT_URL` is set correctly

3. **Deploy**
   - Vercel will automatically deploy on push to main
   - Or manually trigger: `vercel --prod`

4. **Verify**
   - Visit `https://yourapp.com/platform-admin`
   - Check that only platform admins can access it
   - Test key features (organizations, users, billing)

### Using Other Platforms

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Set Environment Variables** on your hosting platform

3. **Deploy** using your platform's deployment process

## 🔒 Security Checklist

- [ ] Platform admin access granted only via SQL (not UI)
- [ ] Enable 2FA for all platform admin accounts
- [ ] Review and test error handling on all pages
- [ ] Verify audit logs are being created
- [ ] Test unauthorized access (should redirect to `/dashboard`)
- [ ] Verify Stripe links work correctly
- [ ] Test subscription updates
- [ ] Test organization suspension
- [ ] Check that sensitive errors aren't exposed in production

## 📊 Monitoring

### Key Metrics to Monitor

1. **Platform Admin Access Logs**
   ```sql
   SELECT * FROM activities
   WHERE type LIKE 'platform_admin_%'
   ORDER BY "createdAt" DESC
   LIMIT 50;
   ```

2. **Failed Access Attempts**
   - Monitor your application logs for redirect events
   - Set up alerts for repeated attempts

3. **Subscription Health**
   ```sql
   SELECT
     plan,
     status,
     COUNT(*) as count
   FROM subscriptions
   GROUP BY plan, status;
   ```

### Recommended Monitoring Tools

- **Sentry** (already configured) - Error tracking
- **Vercel Analytics** (already configured) - Performance
- **PostHog** (already configured) - User analytics
- **Supabase Dashboard** - Database metrics

## 🧪 Testing Checklist

### Before Going Live

- [ ] Visit `/platform-admin` as non-admin (should redirect)
- [ ] Visit `/platform-admin` as admin (should load)
- [ ] View Organizations page
- [ ] Click into an organization detail page
- [ ] View Users page
- [ ] Click into a user detail page
- [ ] View Billing page
- [ ] Verify MRR/ARR calculations
- [ ] Check Stripe dashboard links
- [ ] View Templates page (coming soon)
- [ ] View Settings page (coming soon)
- [ ] Test navigation between pages
- [ ] Verify loading states work
- [ ] Trigger an error to test error boundary

## 🔄 Post-Deployment

### 1. Verify Deployment

```bash
curl -I https://yourapp.com/platform-admin
# Should return 200 or 307 (redirect)
```

### 2. Check Database Constraints

```sql
SELECT
  conname AS constraint_name,
  contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'subscriptions'::regclass;
```

Should show:
- `subscriptions_organizationId_key` (unique)
- `subscriptions_stripeSubscriptionId_key` (unique)

### 3. Monitor Logs

Check your hosting platform's logs for any errors:
- Vercel: `vercel logs`
- Check Supabase logs for database errors

### 4. Test Key Workflows

1. **View Dashboard**
   - Go to `/platform-admin`
   - Verify metrics are correct

2. **Manage Subscriptions**
   - Try updating a subscription (if you have test data)
   - Verify audit log is created

3. **Review Activity**
   - Check that all your actions are logged
   - Verify timestamps are correct

## 🆘 Troubleshooting

### "Database error occurred"

**Cause**: Usually a Prisma/Supabase connection issue

**Fix**:
1. Verify `DATABASE_URL` and `DIRECT_URL` are set correctly
2. Check Supabase connection pooling settings
3. Regenerate Prisma client: `npx prisma generate`

### "Not authenticated" or Redirect Loop

**Cause**: Issue with Supabase auth cookies

**Fix**:
1. Clear browser cookies
2. Verify Supabase env variables are correct
3. Check `NEXT_PUBLIC_SUPABASE_URL` matches your project

### "Organization not found" After Update

**Cause**: Stale cache

**Fix**:
1. Server actions include `revalidatePath()` calls
2. Try hard refresh (Cmd+Shift+R)
3. Check that the org actually exists in database

### Subscription Unique Constraint Violation

**Cause**: Multiple subscriptions for one org

**Fix**:
```sql
-- Remove duplicates, keeping most recent
WITH RankedSubscriptions AS (
  SELECT id, "organizationId",
    ROW_NUMBER() OVER (PARTITION BY "organizationId" ORDER BY "createdAt" DESC) as rn
  FROM subscriptions
)
DELETE FROM subscriptions
WHERE id IN (
  SELECT id FROM RankedSubscriptions WHERE rn > 1
);
```

## 📈 Next Steps

### Recommended Enhancements

1. **Rate Limiting** (High Priority)
   - Implement rate limiting on server actions
   - Consider using Vercel's Edge middleware

2. **Email Notifications**
   - Alert on subscription expirations
   - Notify on platform admin access grants

3. **Advanced Analytics**
   - Customer lifetime value (CLV)
   - Churn rate tracking
   - Growth trends

4. **Global Template Management**
   - Create and manage form templates
   - Create and manage drawing templates

5. **Feature Flags**
   - Enable/disable features per organization
   - A/B testing capabilities

6. **Customer Support Integration**
   - Link to support tickets
   - Customer communication history

## 🛡️ Security Best Practices

1. **Access Control**
   - Only grant platform admin to essential team members
   - Require 2FA for all platform admins
   - Consider IP whitelisting for production

2. **Audit Trail**
   - Review logs monthly
   - Set up alerts for suspicious activity
   - Keep logs for at least 1 year (compliance)

3. **Data Protection**
   - Never expose sensitive data in error messages
   - Use parameterized queries (Prisma does this)
   - Regularly backup your database

4. **Regular Reviews**
   - Quarterly security audits
   - Review platform admin access list
   - Update dependencies regularly

## 📞 Support

If you encounter issues during deployment:

1. Check this guide first
2. Review error logs in your hosting platform
3. Check Supabase logs for database issues
4. Review the enhanced server actions for better error messages

## ✅ Production Deployment Complete

Once you've completed all steps above, your Platform Admin area is production-ready and secure!

Remember to:
- Monitor logs regularly
- Review audit trail monthly
- Keep dependencies updated
- Test new features thoroughly before deploying

---

**Last Updated**: November 2025
**Version**: 1.0.0 (Production-Ready)
