# Platform Admin Area

This is the SaaS provider administration area for managing all customer organizations, users, and billing.

## Access

The platform admin area is accessible at `/platform-admin` and is **only available to users with the `isPlatformAdmin` flag set to `true`**.

### Granting Platform Admin Access

Platform admin access **cannot be granted through the UI** for security reasons. You must manually update the database:

#### Method 1: Using Prisma Studio (Development)

```bash
npx prisma studio
```

Then navigate to the `User` model and set `isPlatformAdmin` to `true` for your user.

#### Method 2: Direct Database Query

```sql
-- Find your user by email
SELECT id, email, name FROM users WHERE email = 'your-email@yourcompany.com';

-- Grant platform admin access
UPDATE users SET "isPlatformAdmin" = true WHERE email = 'your-email@yourcompany.com';
```

#### Method 3: Using Prisma Client (one-time script)

Create a script `scripts/grant-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function grantPlatformAdmin(email: string) {
  const user = await prisma.user.update({
    where: { email },
    data: { isPlatformAdmin: true }
  })
  console.log(`Granted platform admin access to: ${user.name} (${user.email})`)
}

grantPlatformAdmin('your-email@yourcompany.com')
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```

Run with:
```bash
npx ts-node scripts/grant-admin.ts
```

## Running the Migration

The platform admin feature requires a database migration to add the `isPlatformAdmin` column:

```bash
npx prisma migrate deploy
```

Or in development:

```bash
npx prisma migrate dev
```

The migration file is located at:
```
prisma/migrations/20251118203003_add_platform_admin_flag/migration.sql
```

## Features

### Dashboard (`/platform-admin`)
- Overview of platform metrics
- Total organizations, users, subscriptions
- Recent sign-ups and activity

### Organizations (`/platform-admin/organizations`)
- List all customer organizations
- View organization details
- See user counts, activity, subscription status
- Individual organization view at `/platform-admin/organizations/[id]`

### Users (`/platform-admin/users`)
- List all users across all organizations
- View user details, roles, and permissions
- See authentication provider
- Track last login and join date
- Individual user view at `/platform-admin/users/[id]`

### Billing (`/platform-admin/billing`)
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Subscription breakdown by plan
- Expiring subscriptions alerts
- Direct links to Stripe dashboard

### Templates (`/platform-admin/templates`)
- Placeholder for global template management
- Coming soon: Form, Drawing, and Spreadsheet templates

### Settings (`/platform-admin/settings`)
- Placeholder for platform configuration
- Coming soon: Security, notifications, backups

## Security

### Authentication
- All routes protected by Supabase authentication
- Layout checks `isPlatformAdmin` flag before rendering
- Unauthorized users are redirected to `/dashboard`

### Authorization
- All server actions call `requirePlatformAdmin()`
- Database queries are not scoped to organization (platform-wide access)
- All actions are logged to the `Activity` table with type `platform_admin_*`

### Audit Logging

All platform admin actions are automatically logged:

```typescript
await logPlatformAdminAction('action_name', {
  // Action-specific data
})
```

View logs at `/platform-admin` (Recent Activity section) or query directly:

```sql
SELECT * FROM activities WHERE type LIKE 'platform_admin_%' ORDER BY "createdAt" DESC;
```

## Server Actions

> **Status: not implemented.** The platform admin console is currently **read-only**. Two competing
> draft implementations (`app/actions/platform-admin.ts` and `app/actions/platform-admin-enhanced.ts`)
> existed but were never imported by any page in the repo's entire history, and were removed in #164.
> Recover either for reference with:
> `git show 98ccde49:app/actions/platform-admin-enhanced.ts`
> (`-enhanced` is the better draft — Zod validation, Prisma error mapping, production error redaction.)

The write capabilities below are **planned, not available**. Nothing in `app/platform-admin/**`
can currently change a plan, suspend an organisation, export data, or grant admin access:

- `updateOrganizationPlan()` - Change subscription plan
- `suspendOrganization()` - Suspend/cancel organization
- `getPlatformMetrics()` - Get platform-wide statistics
- `exportOrganizationData()` - Export org data for backup/migration
- `getPlatformActivityLogs()` - Get audit trail
- `grantPlatformAdminAccess()` - Grant admin access (use with caution!)
- `revokePlatformAdminAccess()` - Revoke admin access

What **does** exist and is live: `lib/platform-admin/` provides `requirePlatformAdmin()`,
`logPlatformAdminAction()`, `getPlatformStats()`, `PLAN_PRICING`, and ready-made Zod input schemas
in `platform-admin-validation.ts` for all seven actions above.

## Stripe Integration

The billing page shows subscription data stored in your database. To sync with Stripe:

1. Ensure `stripeCustomerId` and `stripeSubscriptionId` are set on subscriptions
2. Links to Stripe dashboard are automatically generated
3. Update plan pricing in `/app/platform-admin/billing/page.tsx`:

```typescript
const PLAN_PRICING = {
  free: 0,
  pro: 29,      // Update to match your Stripe prices
  enterprise: 99, // Update to match your Stripe prices
}
```

## Navigation

The platform admin area has its own sidebar with minimal navigation:
- No team features (players, calendar, forms)
- Focus on SaaS management
- "Back to Main App" link to return to `/dashboard`

## Development

### Adding New Pages

1. Create page in `/app/platform-admin/your-page/page.tsx`
2. Add to sidebar in `/components/platform-admin/platform-admin-sidebar.tsx`
3. Use `PageHeader` component for consistent UI
4. Always log access with `logPlatformAdminAction()`

### Adding New Actions

No platform-admin action file currently exists — see the Server Actions status note above before
creating one. When you do:

1. Create the action via `createAction` from `lib/actions/safe-action.ts` (see #181/#182) rather
   than reintroducing a bespoke `app/actions/platform-admin.ts`
2. Always call `requirePlatformAdmin()` first
3. Validate input with the existing schemas in `lib/platform-admin/platform-admin-validation.ts`
4. Log the action with `logPlatformAdminAction()`
5. Revalidate affected paths

## Best Practices

1. **Never** expose `isPlatformAdmin` in client-side code
2. **Always** check authorization in server actions
3. **Always** log sensitive actions
4. **Never** allow platform admin access through the UI
5. **Consider** implementing IP whitelisting for production
6. **Enable** 2FA for all platform admin accounts
7. **Review** activity logs regularly

## Future Enhancements

- [ ] IP whitelisting for platform admin routes
- [ ] 2FA requirement for platform admins
- [ ] Real-time Stripe webhook integration
- [ ] Global template management
- [ ] Advanced analytics and reporting
- [ ] Customer support ticket system
- [ ] Automated billing alerts
- [ ] Usage metrics and quotas
- [ ] Multi-platform admin roles (read-only, billing-only, etc.)
