# Platform Admin - Quick Start Guide

Get your platform admin area up and running in 5 minutes.

## Prerequisites

- You must have an existing user account (sign up at `/signup` if you don't have one)
- Database access
- Node.js and npm installed

## Setup Steps

### Option 1: Automated Setup (Recommended)

Run the setup script:

```bash
./scripts/setup-platform-admin.sh
```

This will:
1. Run the database migration
2. Generate the Prisma client
3. Grant platform admin access to your email

### Option 2: Manual Setup

#### 1. Run the database migration

```bash
npx prisma migrate deploy
```

#### 2. Generate Prisma client

```bash
npx prisma generate
```

#### 3. Grant yourself platform admin access

**Using Prisma Studio (easiest):**

```bash
npx prisma studio
```

Navigate to the `User` model, find your user, and set `isPlatformAdmin` to `true`.

**Or using SQL:**

```bash
npx prisma db execute --stdin
```

Then paste:

```sql
UPDATE users SET "isPlatformAdmin" = true WHERE email = 'your-email@yourcompany.com';
```

Press `Ctrl+D` to execute.

## Access the Platform Admin

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to:
   ```
   http://localhost:3000/platform-admin
   ```

3. You should see the Platform Admin dashboard!

## First Steps

Once you're in the platform admin area:

1. **Dashboard** - View overview of your platform metrics
2. **Organizations** - See all customer organizations
3. **Users** - Manage all users across organizations
4. **Billing** - Monitor subscriptions and revenue

## Customization

### Update Stripe Pricing

Edit `/app/platform-admin/billing/page.tsx`:

```typescript
const PLAN_PRICING = {
  free: 0,
  pro: 29,        // Change to your actual price
  enterprise: 99, // Change to your actual price
}
```

### Add New Navigation Items

Edit `/components/platform-admin/platform-admin-sidebar.tsx`:

```typescript
const navigation = [
  // ... existing items
  {
    name: 'Your New Page',
    href: '/platform-admin/your-page',
    icon: YourIcon,
  },
]
```

### Create New Pages

```bash
mkdir -p app/platform-admin/your-page
touch app/platform-admin/your-page/page.tsx
```

Template:

```typescript
import { PageHeader } from '@/components/platform-admin/page-header'
import { logPlatformAdminAction } from '@/lib/platform-admin'

export default async function YourPage() {
  await logPlatformAdminAction('view_your_page', {})

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Your Page"
        description="Description of your page"
      />
      <div className="flex-1 p-8">
        {/* Your content */}
      </div>
    </div>
  )
}
```

## Troubleshooting

### "Access Denied" Error

- Make sure `isPlatformAdmin` is set to `true` in the database
- Log out and log back in
- Check the browser console for errors

### Migration Errors

- Ensure your database is running
- Check `DATABASE_URL` in `.env`
- Try `npx prisma migrate reset` (⚠️ destroys data)

### Missing Data

- Make sure you have some test organizations and users
- Sign up for a new account to create sample data
- Check database connection

## Production Deployment

Before deploying to production:

1. **Enable 2FA** for all platform admin accounts
2. **Set up IP whitelisting** (optional but recommended)
3. **Configure Stripe webhooks** for real-time billing updates
4. **Set up monitoring** for platform admin actions
5. **Review audit logs** regularly

## Security Checklist

- [ ] Platform admin flag is only set via database (not UI)
- [ ] All server actions call `requirePlatformAdmin()`
- [ ] All actions are logged to activity table
- [ ] 2FA enabled for platform admins
- [ ] Regular review of audit logs
- [ ] Secure DATABASE_URL and Stripe keys

## Need Help?

See the full documentation in `PLATFORM_ADMIN_README.md`
