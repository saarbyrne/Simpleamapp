/**
 * Platform Admin Configuration
 *
 * Centralized configuration for platform admin features
 */

// Plan pricing configuration (monthly, in USD)
export const PLAN_PRICING = {
  free: 0,
  pro: parseInt(process.env.PLAN_PRICING_PRO || '29', 10),
  enterprise: parseInt(process.env.PLAN_PRICING_ENTERPRISE || '99', 10),
} as const

// Plan types
export type PlanType = keyof typeof PLAN_PRICING

// Subscription status types
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing'

// Platform admin rate limits (requests per minute)
export const RATE_LIMITS = {
  viewDashboard: 30,
  viewOrganizations: 60,
  viewUsers: 60,
  viewBilling: 30,
  updateSubscription: 10,
  suspendOrganization: 5,
  grantAdminAccess: 2,
  exportData: 5,
} as const

// Audit log retention (days)
export const AUDIT_LOG_RETENTION_DAYS = 365

// Alert thresholds
export const ALERTS = {
  subscriptionExpiringDays: 7,
  maxFailedLoginAttempts: 5,
  suspiciousActivityThreshold: 100,
} as const

// Feature flags
export const FEATURES = {
  enableRateLimiting: process.env.NODE_ENV === 'production',
  enableAuditLogging: true,
  enableEmailNotifications: false, // TODO: Implement
  enableSlackNotifications: false, // TODO: Implement
} as const

// Validation rules
export const VALIDATION = {
  minPasswordLength: 8,
  maxOrganizationNameLength: 100,
  maxUserNameLength: 100,
  allowedAuthProviders: ['email', 'google', 'facebook', 'instagram'] as const,
} as const
