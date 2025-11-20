/**
 * Platform Admin Validation Schemas
 *
 * Zod schemas for validating platform admin server action inputs
 */

import { z } from 'zod'

// Plan types
export const planSchema = z.enum(['free', 'pro', 'enterprise'])

// Subscription status types
export const subscriptionStatusSchema = z.enum(['active', 'cancelled', 'past_due', 'trialing'])

// Update organization plan schema
export const updateOrganizationPlanSchema = z.object({
  organizationId: z.string().cuid('Invalid organization ID'),
  plan: planSchema,
  status: subscriptionStatusSchema,
})

// Suspend organization schema
export const suspendOrganizationSchema = z.object({
  organizationId: z.string().cuid('Invalid organization ID'),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500, 'Reason too long'),
})

// Grant/Revoke platform admin schema
export const platformAdminAccessSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
})

// Export organization data schema
export const exportOrganizationDataSchema = z.object({
  organizationId: z.string().cuid('Invalid organization ID'),
})

// Get activity logs schema
export const getActivityLogsSchema = z.object({
  limit: z.number().int().positive().max(100).optional().default(50),
})

// Common error messages
export const ValidationErrors = {
  INVALID_ORGANIZATION_ID: 'Invalid organization ID format',
  INVALID_USER_ID: 'Invalid user ID format',
  INVALID_PLAN: 'Invalid subscription plan',
  INVALID_STATUS: 'Invalid subscription status',
  REASON_TOO_SHORT: 'Suspension reason must be at least 10 characters',
  REASON_TOO_LONG: 'Suspension reason must not exceed 500 characters',
  INVALID_LIMIT: 'Limit must be a positive number between 1 and 100',
} as const
