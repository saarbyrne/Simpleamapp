# Platform Admin - Security & Best Practices

## 🔒 Security Architecture

### Authentication & Authorization

The Platform Admin area uses a **multi-layered security approach**:

```
┌─────────────────────────────────────────┐
│ 1. Supabase Auth (User Authentication) │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. Database Flag (isPlatformAdmin)      │
│    - Set manually via SQL only          │
│    - Cannot be changed through UI       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. Layout-Level Check                   │
│    - requirePlatformAdmin() in layout   │
│    - Redirects unauthorized users       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. Action-Level Validation              │
│    - Every server action checks auth    │
│    - Validates input with Zod           │
└─────────────────────────────────────────┘
```

### Why This Approach?

**✅ Advantages:**
- **Defense in Depth**: Multiple security layers
- **Privilege Separation**: Platform admin ≠ Organization admin
- **Audit Trail**: All actions logged automatically
- **No UI Privilege Escalation**: Flag can only be set via database

**❌ What We Avoid:**
- ❌ Role-based access control (RBAC) for platform admin
  - *Why*: Too easy to accidentally grant via UI bug
- ❌ JWT claims for platform admin
  - *Why*: Can be manipulated if JWT secret leaks
- ❌ Environment variable for admin emails
  - *Why*: Not dynamic, requires deployment to change

## 🛡️ Security Features

### 1. Input Validation

All server actions use Zod schemas:

```typescript
// Example: Update subscription
const validatedData = updateOrganizationPlanSchema.parse({
  organizationId,  // Must be valid CUID
  plan,           // Must be 'free' | 'pro' | 'enterprise'
  status,         // Must be valid status
})
```

**Protection Against:**
- SQL Injection (via Prisma + validation)
- Invalid data types
- Missing required fields
- Out-of-range values

### 2. Error Handling

Production-safe error messages:

```typescript
if (process.env.NODE_ENV === 'production') {
  return { error: 'An unexpected error occurred' }
} else {
  return { error: error.message } // Dev only
}
```

**What This Prevents:**
- ✅ Leaking database schema in errors
- ✅ Exposing internal logic
- ✅ Revealing file paths
- ✅ Showing stack traces to end users

### 3. Audit Logging

Every platform admin action is logged:

```typescript
await logPlatformAdminAction('update_subscription', {
  organizationId,
  organizationName,
  newPlan,
  newStatus,
  adminEmail,
  timestamp,
})
```

**Compliance Benefits:**
- ✅ SOC 2 compliance (audit trail requirement)
- ✅ GDPR compliance (data access logging)
- ✅ Forensic analysis capabilities
- ✅ Internal accountability

### 4. Database Constraints

Schema-level data integrity:

```sql
-- One subscription per organization
CONSTRAINT subscriptions_organizationId_key UNIQUE ("organizationId")

-- Unique Stripe subscription IDs
CONSTRAINT subscriptions_stripeSubscriptionId_key UNIQUE ("stripeSubscriptionId")

-- Indexed for performance
CREATE INDEX subscriptions_status_idx ON subscriptions(status);
```

## 🚨 Common Security Mistakes to Avoid

### ❌ DON'T: Check isPlatformAdmin in Client Components

```typescript
// ❌ BAD - Client-side check can be bypassed
'use client'
if (user.isPlatformAdmin) {
  return <PlatformAdminPanel />
}
```

### ✅ DO: Check in Server Components or Server Actions

```typescript
// ✅ GOOD - Server-side check
export default async function PlatformAdminLayout() {
  const admin = await requirePlatformAdmin()
  // Only renders if authorized
}
```

---

### ❌ DON'T: Trust Client-Provided IDs Without Validation

```typescript
// ❌ BAD - No validation
export async function suspendOrg(orgId: string) {
  await prisma.subscription.update({ where: { orgId } })
}
```

### ✅ DO: Validate All Inputs

```typescript
// ✅ GOOD - Validated with Zod
const validatedData = suspendOrganizationSchema.parse({ organizationId })
await prisma.subscription.update({ where: { id: validatedData.organizationId } })
```

---

### ❌ DON'T: Expose Detailed Errors in Production

```typescript
// ❌ BAD - Leaks implementation details
catch (error) {
  return { error: error.message }
}
```

### ✅ DO: Use Generic Error Messages

```typescript
// ✅ GOOD - Safe for production
catch (error) {
  console.error('Internal error:', error) // Log internally
  return { error: 'An unexpected error occurred' } // Show to user
}
```

---

### ❌ DON'T: Grant Platform Admin Access via UI

```typescript
// ❌ BAD - Exposed to potential UI bugs/exploits
async function grantAdmin(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { isPlatformAdmin: true }
  })
}
```

### ✅ DO: Grant Access via SQL Only

```sql
-- ✅ GOOD - Manual, deliberate, logged
UPDATE users
SET "isPlatformAdmin" = true
WHERE email = 'trusted-admin@yourcompany.com';
```

## 🔐 Access Control Checklist

### For Platform Admins

- [ ] Enable 2FA on your account
- [ ] Use a strong, unique password (16+ characters)
- [ ] Don't share your credentials
- [ ] Log out when using shared computers
- [ ] Review your activity logs monthly

### For Developers

- [ ] Never commit `.env` files
- [ ] Use environment variables for all secrets
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Review Prisma queries for N+1 issues
- [ ] Test authorization failures
- [ ] Use `DIRECT_URL` for migrations only

### For DevOps

- [ ] Restrict database access to necessary IPs
- [ ] Enable database SSL (Supabase does this by default)
- [ ] Regular database backups
- [ ] Monitor for suspicious activity
- [ ] Set up alerts for failed auth attempts
- [ ] Keep Supabase project access restricted

## 🎯 Principle of Least Privilege

### Who Should Have Platform Admin Access?

**YES** ✅:
- Company founders/C-level
- Head of Customer Success
- Senior engineers on-call
- Billing/Finance team lead

**NO** ❌:
- Junior developers
- Contractors (unless essential)
- Customer support (tier 1)
- Temporary employees
- Third-party integrations

### Recommended Access Matrix

| Role | Platform Admin | Organization Admin | User |
|------|---------------|-------------------|------|
| CEO | ✅ | N/A | N/A |
| CTO | ✅ | N/A | N/A |
| DevOps Lead | ✅ | N/A | N/A |
| Senior Engineer | ✅ | N/A | N/A |
| Customer Success | ❌ | ✅ | ❌ |
| Customer | ❌ | ✅ | ✅ |

## 📊 Monitoring & Alerting

### Key Metrics to Monitor

1. **Platform Admin Access**
   ```sql
   SELECT COUNT(*)
   FROM activities
   WHERE type LIKE 'platform_admin_%'
     AND "createdAt" > NOW() - INTERVAL '1 day';
   ```

2. **Failed Authentication Attempts**
   - Monitor application logs
   - Set alert threshold: > 5 failed attempts in 5 minutes

3. **Unusual Activity Patterns**
   - Access from new IP addresses
   - Access outside business hours
   - Bulk operations (suspend multiple orgs)
   - Admin access grants/revocations

### Recommended Alerts

```yaml
# Example alert configuration (pseudocode)
alerts:
  - name: "Platform Admin Access from New IP"
    trigger: "platform_admin_* action from IP not in whitelist"
    severity: "HIGH"
    action: "Email security team"

  - name: "Multiple Admin Grants"
    trigger: "> 2 platform_admin_grant_access in 1 hour"
    severity: "CRITICAL"
    action: "Page on-call engineer"

  - name: "Mass Subscription Changes"
    trigger: "> 10 subscription updates in 5 minutes"
    severity: "MEDIUM"
    action: "Slack notification"
```

## 🔍 Audit Log Retention

### Compliance Requirements

| Regulation | Minimum Retention | Recommended |
|------------|------------------|-------------|
| GDPR | 1 year | 2 years |
| SOC 2 | 1 year | 3 years |
| HIPAA | 6 years | 7 years |
| CCPA | 2 years | 3 years |

### Implementation

```typescript
// In platform-admin-config.ts
export const AUDIT_LOG_RETENTION_DAYS = 365 // 1 year

// Cron job to archive old logs (pseudocode)
async function archiveOldLogs() {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - AUDIT_LOG_RETENTION_DAYS)

  // Archive to cold storage
  const oldLogs = await prisma.activity.findMany({
    where: {
      type: { startsWith: 'platform_admin_' },
      createdAt: { lt: cutoffDate }
    }
  })

  await archiveToS3(oldLogs) // Your archival solution
  await prisma.activity.deleteMany({
    where: {
      type: { startsWith: 'platform_admin_' },
      createdAt: { lt: cutoffDate }
    }
  })
}
```

## 🚀 Security Review Checklist

Before deploying to production:

### Application Security
- [ ] All server actions have authentication checks
- [ ] All inputs are validated with Zod
- [ ] Error messages don't leak sensitive data
- [ ] Audit logging is enabled
- [ ] Database constraints are in place
- [ ] HTTPS is enforced
- [ ] CORS is configured correctly

### Access Control
- [ ] Platform admin access granted via SQL only
- [ ] 2FA enabled for all platform admins
- [ ] Principle of least privilege applied
- [ ] Regular access reviews scheduled
- [ ] Emergency revocation process documented

### Monitoring
- [ ] Audit logs are being collected
- [ ] Alerts configured for suspicious activity
- [ ] Log retention policy implemented
- [ ] Regular log reviews scheduled
- [ ] Incident response plan documented

### Compliance
- [ ] Data access logging (GDPR Article 30)
- [ ] Audit trail (SOC 2 CC6.3)
- [ ] Access controls (ISO 27001 A.9.2)
- [ ] Log retention (varies by industry)
- [ ] Privacy policy updated (if needed)

## 📚 Additional Resources

### Standards & Frameworks
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Controls](https://www.cisecurity.org/controls)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Prisma Security
- [Prisma Security Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/security)
- [SQL Injection Prevention](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#sql-injection-prevention)

### Next.js Security
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [Authentication Patterns](https://nextjs.org/docs/pages/building-your-application/authentication)

---

**Remember**: Security is not a one-time task. It's an ongoing process that requires regular review, testing, and updates.

**Last Updated**: November 2025
**Version**: 1.0.0
