/**
 * Color Token System
 *
 * Two-tier token architecture:
 * 1. Primitives: Raw color values (immutable base palette)
 * 2. Semantic: Contextual meaning and purpose (what colors represent)
 *
 * This approach provides:
 * - Single source of truth for all color decisions
 * - Clear semantic meaning for color usage
 * - Easy theming support (light/dark modes)
 * - Type-safe color references throughout the application
 */

/**
 * TIER 1: PRIMITIVE COLORS
 * Base color palette - these are the raw values that never change
 * Generated from Radix Colors for accessibility and consistency
 */
export const primitives = {
  // Grayscale - Used for text, borders, backgrounds
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },

  // Primary - Brand color, main interactive elements
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Success - Positive feedback, confirmations
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  // Error - Errors, destructive actions, validation
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  // Warning - Warnings, cautions
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  // Info - Informational messages
  sky: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },

  // Pure values
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

/**
 * TIER 2: SEMANTIC TOKENS
 * Contextual color assignments with clear purpose
 * These reference primitive tokens but provide meaning
 */

/**
 * Surface Colors
 * Used for backgrounds, cards, panels, overlays
 */
export const surface = {
  // Base application background
  base: primitives.gray[50],

  // Elevated surfaces (cards, modals, dropdowns)
  elevated: primitives.white,

  // Slightly elevated (hover states on cards)
  elevatedHover: primitives.gray[100],

  // Sunken/inset areas (input fields, wells)
  sunken: primitives.gray[100],

  // Overlay backgrounds (modal backdrops, drawers)
  overlay: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',

  // Sidebar and navigation
  sidebar: primitives.white,
  sidebarHover: primitives.gray[100],
  sidebarActive: primitives.blue[50],
} as const;

/**
 * Text Colors
 * Used for all text content throughout the application
 */
export const text = {
  // Primary text - body copy, headlines
  primary: primitives.gray[900],

  // Secondary text - supporting copy, descriptions
  secondary: primitives.gray[600],

  // Tertiary text - metadata, timestamps, least emphasis
  tertiary: primitives.gray[500],

  // Disabled text
  disabled: primitives.gray[400],

  // Inverse text (on dark backgrounds)
  inverse: primitives.white,

  // Interactive text (links)
  link: primitives.blue[600],
  linkHover: primitives.blue[700],
  linkVisited: primitives.blue[800],

  // Placeholder text
  placeholder: primitives.gray[400],
} as const;

/**
 * Border Colors
 * Used for dividers, input outlines, component boundaries
 */
export const border = {
  // Default borders
  default: primitives.gray[300],

  // Hover state borders
  hover: primitives.gray[400],

  // Focus state borders
  focus: primitives.blue[500],

  // Strong borders (section dividers)
  strong: primitives.gray[400],

  // Subtle borders (cards, containers)
  subtle: primitives.gray[200],
} as const;

/**
 * Interactive Colors
 * Used for buttons, links, form controls, and other interactive elements
 */
export const interactive = {
  // Primary actions (submit buttons, main CTAs)
  primary: primitives.blue[600],
  primaryHover: primitives.blue[700],
  primaryActive: primitives.blue[800],
  primaryDisabled: primitives.gray[300],

  // Secondary actions (cancel, alternative options)
  secondary: primitives.gray[100],
  secondaryHover: primitives.gray[200],
  secondaryActive: primitives.gray[300],
  secondaryDisabled: primitives.gray[100],

  // Destructive actions (delete, remove)
  destructive: primitives.red[600],
  destructiveHover: primitives.red[700],
  destructiveActive: primitives.red[800],

  // Ghost/tertiary actions (minimal emphasis)
  ghost: primitives.transparent,
  ghostHover: primitives.gray[100],
  ghostActive: primitives.gray[200],
} as const;

/**
 * Feedback Colors
 * Used for validation, alerts, status indicators
 */
export const feedback = {
  // Success states
  success: primitives.green[600],
  successLight: primitives.green[50],
  successBorder: primitives.green[300],

  // Error states
  error: primitives.red[600],
  errorLight: primitives.red[50],
  errorBorder: primitives.red[300],

  // Warning states
  warning: primitives.amber[600],
  warningLight: primitives.amber[50],
  warningBorder: primitives.amber[300],

  // Info states
  info: primitives.sky[600],
  infoLight: primitives.sky[50],
  infoBorder: primitives.sky[300],
} as const;

/**
 * Focus Ring Colors
 * Used for keyboard navigation focus indicators
 */
export const focus = {
  ring: primitives.blue[500],
  ringOffset: primitives.white,
} as const;

/**
 * DARK MODE SEMANTIC TOKENS
 * These are swapped in when dark mode is active
 * Designed for WCAG AA contrast compliance on dark backgrounds
 */
export const darkMode = {
  surface: {
    base: primitives.gray[950],
    elevated: primitives.gray[900],
    elevatedHover: primitives.gray[800],
    sunken: primitives.black,
    overlay: 'rgba(0, 0, 0, 0.9)',
    overlayLight: 'rgba(0, 0, 0, 0.6)',
    sidebar: primitives.gray[900],
    sidebarHover: primitives.gray[800],
    sidebarActive: primitives.blue[950],
  },
  text: {
    primary: primitives.gray[50],
    secondary: primitives.gray[400],
    tertiary: primitives.gray[500],
    disabled: primitives.gray[600],
    inverse: primitives.gray[900],
    link: primitives.blue[400],
    linkHover: primitives.blue[300],
    linkVisited: primitives.blue[500],
    placeholder: primitives.gray[600],
  },
  border: {
    default: primitives.gray[700],
    hover: primitives.gray[600],
    focus: primitives.blue[500],
    strong: primitives.gray[600],
    subtle: primitives.gray[800],
  },
  interactive: {
    // Primary actions - slightly lighter in dark mode for contrast
    primary: primitives.blue[500],
    primaryHover: primitives.blue[400],
    primaryActive: primitives.blue[600],
    primaryDisabled: primitives.gray[700],

    // Secondary actions - lighter grays for visibility
    secondary: primitives.gray[800],
    secondaryHover: primitives.gray[700],
    secondaryActive: primitives.gray[600],
    secondaryDisabled: primitives.gray[900],

    // Destructive actions - lighter red for better visibility
    destructive: primitives.red[500],
    destructiveHover: primitives.red[400],
    destructiveActive: primitives.red[600],

    // Ghost actions - subtle hover states
    ghost: primitives.transparent,
    ghostHover: primitives.gray[800],
    ghostActive: primitives.gray[700],
  },
  feedback: {
    // Success states - adjusted for dark backgrounds
    success: primitives.green[500],
    successLight: primitives.green[950],
    successBorder: primitives.green[700],

    // Error states - adjusted for dark backgrounds
    error: primitives.red[500],
    errorLight: primitives.red[950],
    errorBorder: primitives.red[700],

    // Warning states - adjusted for dark backgrounds
    warning: primitives.amber[500],
    warningLight: primitives.amber[950],
    warningBorder: primitives.amber[700],

    // Info states - adjusted for dark backgrounds
    info: primitives.sky[500],
    infoLight: primitives.sky[950],
    infoBorder: primitives.sky[700],
  },
  focus: {
    ring: primitives.blue[500],
    ringOffset: primitives.gray[950],
  },
} as const;

/**
 * Type Exports
 * Provides TypeScript autocomplete and type safety
 */
export type PrimitiveColor = keyof typeof primitives;
export type GrayScale = keyof typeof primitives.gray;
export type SurfaceToken = keyof typeof surface;
export type TextToken = keyof typeof text;
export type BorderToken = keyof typeof border;
export type InteractiveToken = keyof typeof interactive;
export type FeedbackToken = keyof typeof feedback;

/**
 * Unified Color Token Export
 * Single object containing all semantic tokens for easy import
 */
export const colors = {
  surface,
  text,
  border,
  interactive,
  feedback,
  focus,
} as const;

export type ColorTokens = typeof colors;
