/**
 * Status Color Tokens
 *
 * Centralized status color definitions for consistent status indicators
 * across the application (player status, feature status, billing status, etc.)
 *
 * Usage:
 * import { statusColors } from '@/design-system/tokens/status-colors'
 *
 * <Badge className={statusColors.active}>Active</Badge>
 */

export const statusColors = {
  // Player status colors
  active: 'bg-success text-success-foreground hover:bg-success/90',
  available: 'bg-success text-success-foreground hover:bg-success/90',
  injured: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  suspended: 'bg-warning text-warning-foreground hover:bg-warning/90',
  inactive: 'bg-muted text-muted-foreground hover:bg-muted/80',
} as const

export type PlayerStatus = keyof typeof statusColors

/**
 * Helper function to safely get player status colors
 * @param status - The player status (will be normalized to lowercase)
 * @returns The status color classes or a fallback
 */
export function getPlayerStatusColor(status: string | undefined | null): string {
  if (!status) return 'bg-muted text-muted-foreground hover:bg-muted/80'
  const normalized = status.toLowerCase() as PlayerStatus
  return statusColors[normalized] ?? 'bg-muted text-muted-foreground hover:bg-muted/80'
}

/**
 * Password strength indicators
 */
export const passwordStrengthColors = {
  weak: {
    text: 'text-destructive',
    bg: 'bg-destructive',
    border: 'border-destructive',
  },
  medium: {
    text: 'text-warning',
    bg: 'bg-warning',
    border: 'border-warning',
  },
  strong: {
    text: 'text-success',
    bg: 'bg-success',
    border: 'border-success',
  },
} as const

export type PasswordStrength = keyof typeof passwordStrengthColors

/**
 * Feature status colors
 */
export const featureStatusColors = {
  enabled: 'text-success',
  disabled: 'text-muted-foreground',
  beta: 'text-info',
  deprecated: 'text-warning',
} as const

export type FeatureStatus = keyof typeof featureStatusColors

/**
 * Billing status colors
 */
export const billingStatusColors = {
  active: 'bg-success/10 border-success text-success',
  warning: 'bg-warning/10 border-warning text-warning',
  overdue: 'bg-destructive/10 border-destructive text-destructive',
  cancelled: 'bg-muted border-border text-muted-foreground',
} as const

export type BillingStatus = keyof typeof billingStatusColors

/**
 * General status indicator colors (for progress, completion, etc.)
 */
export const generalStatusColors = {
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  error: 'bg-destructive text-destructive-foreground',
  info: 'bg-info text-info-foreground',
  pending: 'bg-muted text-muted-foreground',
} as const

export type GeneralStatus = keyof typeof generalStatusColors
