/**
 * Icon Token System
 *
 * Provides standardized sizing, spacing, and usage patterns for icons
 * throughout the application. Works with Lucide React icon library.
 *
 * Design Principles:
 * - Icons should be visually balanced with text
 * - Consistent sizing creates visual rhythm
 * - Proper spacing prevents crowding
 * - Color should inherit from context when possible
 */

/**
 * ICON SIZES
 * Standard sizes for icons based on common use cases
 */
export const size = {
  // Extra small - inline with small text (12px)
  xs: '0.75rem',

  // Small - inline with body text, compact UIs (16px)
  sm: '1rem',

  // Medium - default size, buttons, most UI elements (20px)
  md: '1.25rem',

  // Large - headings, emphasized actions (24px)
  lg: '1.5rem',

  // Extra large - page headers, empty states (32px)
  xl: '2rem',

  // 2X large - illustrations, hero sections (48px)
  '2xl': '3rem',
} as const;

/**
 * ICON STROKE WIDTH
 * Controls icon line thickness
 */
export const strokeWidth = {
  // Thin - decorative, low emphasis (1px)
  thin: 1,

  // Regular - default for most icons (1.5px)
  regular: 1.5,

  // Medium - slightly bolder, more emphasis (2px)
  medium: 2,

  // Bold - strong emphasis, important actions (2.5px)
  bold: 2.5,
} as const;

/**
 * ICON SPACING
 * Spacing between icons and adjacent elements
 */
export const spacing = {
  // No spacing - icon touches text/element
  none: '0',

  // Extra small spacing (4px)
  xs: '0.25rem',

  // Small spacing - compact layouts (8px)
  sm: '0.5rem',

  // Medium spacing - default (12px)
  md: '0.75rem',

  // Large spacing - more breathing room (16px)
  lg: '1rem',
} as const;

/**
 * ICON USE CASES
 * Pre-configured combinations for common scenarios
 */
export const useCase = {
  // Inline with body text
  inline: {
    size: size.sm,
    spacing: spacing.xs,
    strokeWidth: strokeWidth.regular,
  },

  // Button icons (leading or trailing)
  button: {
    size: size.md,
    spacing: spacing.sm,
    strokeWidth: strokeWidth.medium,
  },

  // Input field icons (leading or trailing)
  input: {
    size: size.md,
    spacing: spacing.sm,
    strokeWidth: strokeWidth.regular,
  },

  // Navigation menu items
  navigation: {
    size: size.md,
    spacing: spacing.md,
    strokeWidth: strokeWidth.regular,
  },

  // Card headers and titles
  cardHeader: {
    size: size.lg,
    spacing: spacing.md,
    strokeWidth: strokeWidth.medium,
  },

  // Empty states and placeholders
  emptyState: {
    size: size['2xl'],
    spacing: spacing.lg,
    strokeWidth: strokeWidth.thin,
  },

  // Badge or chip icons
  badge: {
    size: size.xs,
    spacing: spacing.xs,
    strokeWidth: strokeWidth.bold,
  },

  // Alerts and notifications
  alert: {
    size: size.md,
    spacing: spacing.sm,
    strokeWidth: strokeWidth.medium,
  },
} as const;

/**
 * ICON COLORS
 * Semantic color assignments for icons
 * Icons should typically inherit color from their context,
 * but these provide explicit options when needed
 */
export const color = {
  // Inherit from parent text color (default)
  inherit: 'currentColor',

  // Primary brand color (blue)
  primary: 'var(--ds-interactive-primary)',

  // Secondary/muted appearance
  secondary: 'var(--ds-text-secondary)',

  // Tertiary/least emphasis
  tertiary: 'var(--ds-text-tertiary)',

  // Success state (green)
  success: 'var(--ds-feedback-success)',

  // Error/destructive state (red)
  error: 'var(--ds-feedback-error)',

  // Warning state (amber)
  warning: 'var(--ds-feedback-warning)',

  // Info state (blue)
  info: 'var(--ds-feedback-info)',

  // Disabled state (gray)
  disabled: 'var(--ds-text-disabled)',

  // Inverse color (for dark backgrounds)
  inverse: 'var(--ds-text-inverse)',
} as const;

/**
 * ANIMATION
 * Standard icon animations
 */
export const animation = {
  // Spin animation (for loading spinners)
  spin: {
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  },

  // Pulse animation (for notifications)
  pulse: {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
  },

  // Bounce animation (for emphasis)
  bounce: {
    animation: 'bounce 1s infinite',
    '@keyframes bounce': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-25%)' },
    },
  },
} as const;

/**
 * ACCESSIBILITY
 * Guidelines for accessible icon usage
 */
export const accessibility = {
  // Icons with semantic meaning need labels
  decorative: {
    'aria-hidden': true,
    role: 'presentation',
  },

  // Icons representing actions/content
  semantic: {
    role: 'img',
    // Add aria-label with description
  },

  // Icons in buttons (button provides label)
  inButton: {
    'aria-hidden': true,
  },
} as const;

/**
 * Type Exports
 */
export type IconSize = keyof typeof size;
export type IconStrokeWidth = keyof typeof strokeWidth;
export type IconSpacing = keyof typeof spacing;
export type IconUseCase = keyof typeof useCase;
export type IconColor = keyof typeof color;

/**
 * Unified Icon Token Export
 */
export const iconTokens = {
  size,
  strokeWidth,
  spacing,
  useCase,
  color,
  animation,
  accessibility,
} as const;

export type IconTokens = typeof iconTokens;
