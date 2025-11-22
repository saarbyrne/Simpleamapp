# Platform Admin Module

Platform-wide administration tools and permission management.

## File Structure

- **`platform-admin.ts`** - Core admin utilities and permission checks
- **`platform-admin-config.ts`** - Configuration for platform admin features
- **`platform-admin-validation.ts`** - Validation utilities for admin actions
- **`index.ts`** - Centralized exports

## Usage

```typescript
import {
  checkPlatformAdmin,
  requirePlatformAdmin,
  PLATFORM_ADMIN_CONFIG,
  validateAdminAction
} from '@/lib/platform-admin';
```

## Core Functionality

### Permission Checks (`platform-admin.ts`)

**Check Admin Status:**
```typescript
const isAdmin = await checkPlatformAdmin(userId);
if (!isAdmin) {
  throw new Error('Unauthorized');
}
```

**Require Admin (with redirect):**
```typescript
await requirePlatformAdmin(); // Redirects non-admins to /dashboard
```

### Configuration (`platform-admin-config.ts`)

Platform admin configuration and feature flags:

```typescript
export const PLATFORM_ADMIN_CONFIG = {
  features: {
    userManagement: true,
    organizationManagement: true,
    billingManagement: true,
    systemSettings: true
  },
  permissions: {
    // Permission definitions
  }
};
```

### Validation (`platform-admin-validation.ts`)

Validate admin actions before execution:

```typescript
const isValid = validateAdminAction(action, userId);
if (!isValid) {
  throw new Error('Invalid admin action');
}
```

## Platform Admin Features

### User Management
- View all users across organizations
- Edit user details and permissions
- Suspend or delete user accounts
- Assign platform admin status

### Organization Management
- View all organizations
- Edit organization details
- Manage organization billing
- View organization usage metrics

### Billing Management
- View billing across all organizations
- Manage subscriptions
- View payment history
- Handle billing issues

### System Settings
- Configure platform-wide settings
- Manage feature flags
- View system health and metrics

## Security

### Access Control
Platform admin routes are protected with middleware:

```typescript
// app/platform-admin/layout.tsx
await requirePlatformAdmin(); // Protects entire section
```

### Audit Logging
All platform admin actions should be logged for audit purposes.

## Related Documentation

- Platform Admin Quickstart: `/docs/features/PLATFORM_ADMIN_QUICKSTART.md`
- Platform Admin Security: `/docs/features/PLATFORM_ADMIN_SECURITY.md`
- Deployment Guide: `/docs/deployment/PLATFORM_ADMIN_PRODUCTION_GUIDE.md`

## Best Practices

1. **Always check permissions** before showing admin UI
2. **Log all actions** for audit trails
3. **Validate input** before executing admin operations
4. **Use transactions** for multi-step operations
5. **Test thoroughly** - admin features affect all users
