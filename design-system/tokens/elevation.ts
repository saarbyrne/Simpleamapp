/**
 * Elevation Token System
 *
 * Provides a consistent shadow system for creating depth and hierarchy.
 * Based on Material Design principles adapted for our design language.
 *
 * Shadows communicate:
 * - Elevation (how "high" an element is above the page)
 * - Interactivity (elevated elements are often interactive)
 * - Focus and hierarchy (important elements are elevated)
 *
 * Our system uses:
 * - Ambient shadows (soft, diffuse light from above)
 * - Direct shadows (sharper, from a point light source)
 * - Multiple shadow layers for realistic depth
 */

/**
 * Shadow Levels
 * Numbered 0-5 for increasing elevation
 */
export const shadow = {
  // No shadow (flat on page)
  none: 'none',

  // Subtle shadow for slight elevation (1px)
  // Use: Hover states, selected items, slightly raised cards
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',

  // Small shadow for low elevation (2-4px)
  // Use: Default cards, buttons, small popovers
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',

  // Medium shadow for standard elevation (4-8px)
  // Use: Dropdowns, floating action buttons, raised cards
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',

  // Large shadow for high elevation (8-16px)
  // Use: Modals, dialogs, important popovers
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',

  // Extra large shadow for very high elevation (16-24px)
  // Use: Major modals, drawers, sheets
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',

  // 2X large shadow for maximum elevation (24-32px)
  // Use: Fullscreen modals, critical alerts
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

/**
 * Inner Shadows
 * Used for inset/sunken elements
 */
export const innerShadow = {
  // Subtle inset
  sm: 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',

  // Medium inset
  md: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.06)',

  // Strong inset
  lg: 'inset 0 4px 6px 0 rgb(0 0 0 / 0.1)',
} as const;

/**
 * Colored Shadows
 * Shadows with color tint for special cases
 * Used for focus states, validation, branding
 */
export const coloredShadow = {
  // Blue shadow for focus states
  focus: '0 0 0 3px rgb(59 130 246 / 0.5)',
  focusLg: '0 0 0 4px rgb(59 130 246 / 0.5)',

  // Red shadow for error states
  error: '0 0 0 3px rgb(239 68 68 / 0.5)',
  errorLg: '0 0 0 4px rgb(239 68 68 / 0.5)',

  // Green shadow for success states
  success: '0 0 0 3px rgb(34 197 94 / 0.5)',
  successLg: '0 0 0 4px rgb(34 197 94 / 0.5)',

  // Amber shadow for warning states
  warning: '0 0 0 3px rgb(245 158 11 / 0.5)',
  warningLg: '0 0 0 4px rgb(245 158 11 / 0.5)',

  // Primary brand shadow
  primary: '0 0 0 3px rgb(37 99 235 / 0.5)',
  primaryLg: '0 0 0 4px rgb(37 99 235 / 0.5)',
} as const;

/**
 * Semantic Elevation
 * Named by purpose and component type
 */

/**
 * Component Elevation
 * Pre-assigned shadow values for specific components
 */
export const component = {
  // Card elevation
  card: shadow.sm,
  cardHover: shadow.md,
  cardActive: shadow.xs,

  // Button elevation
  button: shadow.xs,
  buttonHover: shadow.sm,
  buttonActive: shadow.none,

  // Input elevation
  input: shadow.none,
  inputFocus: coloredShadow.focus,
  inputError: coloredShadow.error,
  inputSuccess: coloredShadow.success,

  // Dropdown elevation
  dropdown: shadow.lg,
  dropdownSm: shadow.md,

  // Modal elevation
  modal: shadow['2xl'],
  modalBackdrop: shadow.none,

  // Popover elevation
  popover: shadow.lg,
  popoverSm: shadow.md,

  // Tooltip elevation
  tooltip: shadow.md,

  // Sheet/Drawer elevation
  sheet: shadow.xl,
  drawer: shadow.xl,

  // Toast elevation
  toast: shadow.lg,

  // Menu elevation
  menu: shadow.lg,
  contextMenu: shadow.lg,

  // Command palette elevation
  commandPalette: shadow['2xl'],

  // Table elevation
  table: shadow.none,
  tableRow: shadow.none,
  tableRowHover: shadow.xs,

  // Sidebar elevation
  sidebar: shadow.md,

  // Header elevation
  header: shadow.sm,

  // Badge elevation
  badge: shadow.none,

  // Avatar elevation
  avatar: shadow.xs,
} as const;

/**
 * Interaction Elevation
 * Shadows for different interaction states
 */
export const interaction = {
  // Resting state (no interaction)
  rest: shadow.sm,

  // Hover state (mouse over)
  hover: shadow.md,

  // Active state (being clicked/pressed)
  active: shadow.xs,

  // Focus state (keyboard navigation)
  focus: coloredShadow.focus,

  // Disabled state (no interaction possible)
  disabled: shadow.none,

  // Dragging state
  dragging: shadow.xl,
} as const;

/**
 * Layered Shadows
 * Complex shadows with multiple layers for ultra-realistic depth
 * Use sparingly for hero elements and critical UI
 */
export const layered = {
  // Subtle layered shadow
  subtle: [
    '0 1px 1px hsl(0deg 0% 0% / 0.075)',
    '0 2px 2px hsl(0deg 0% 0% / 0.075)',
    '0 4px 4px hsl(0deg 0% 0% / 0.075)',
  ].join(', '),

  // Medium layered shadow
  medium: [
    '0 1px 1px hsl(0deg 0% 0% / 0.075)',
    '0 2px 2px hsl(0deg 0% 0% / 0.075)',
    '0 4px 4px hsl(0deg 0% 0% / 0.075)',
    '0 8px 8px hsl(0deg 0% 0% / 0.075)',
  ].join(', '),

  // Strong layered shadow
  strong: [
    '0 1px 1px hsl(0deg 0% 0% / 0.075)',
    '0 2px 2px hsl(0deg 0% 0% / 0.075)',
    '0 4px 4px hsl(0deg 0% 0% / 0.075)',
    '0 8px 8px hsl(0deg 0% 0% / 0.075)',
    '0 16px 16px hsl(0deg 0% 0% / 0.075)',
  ].join(', '),

  // Dramatic layered shadow (for hero elements)
  dramatic: [
    '0 1px 1px hsl(0deg 0% 0% / 0.075)',
    '0 2px 2px hsl(0deg 0% 0% / 0.075)',
    '0 4px 4px hsl(0deg 0% 0% / 0.075)',
    '0 8px 8px hsl(0deg 0% 0% / 0.075)',
    '0 16px 16px hsl(0deg 0% 0% / 0.075)',
    '0 32px 32px hsl(0deg 0% 0% / 0.075)',
  ].join(', '),
} as const;

/**
 * Glow Effects
 * Special shadow effects for emphasis and branding
 */
export const glow = {
  // Subtle glow (brand color)
  subtle: '0 0 15px rgb(59 130 246 / 0.3)',

  // Medium glow
  medium: '0 0 25px rgb(59 130 246 / 0.4)',

  // Strong glow
  strong: '0 0 35px rgb(59 130 246 / 0.5)',

  // Success glow
  success: '0 0 20px rgb(34 197 94 / 0.4)',

  // Error glow
  error: '0 0 20px rgb(239 68 68 / 0.4)',

  // Warning glow
  warning: '0 0 20px rgb(245 158 11 / 0.4)',
} as const;

/**
 * Type Exports for TypeScript
 */
export type Shadow = keyof typeof shadow;
export type InnerShadow = keyof typeof innerShadow;
export type ColoredShadow = keyof typeof coloredShadow;
export type ComponentElevation = keyof typeof component;
export type InteractionElevation = keyof typeof interaction;
export type LayeredShadow = keyof typeof layered;
export type GlowEffect = keyof typeof glow;

/**
 * Unified Elevation Token Export
 */
export const elevation = {
  shadow,
  innerShadow,
  coloredShadow,
  component,
  interaction,
  layered,
  glow,
} as const;

export type ElevationTokens = typeof elevation;

/**
 * Helper function to combine shadows
 * Useful for creating custom shadow combinations
 */
export function combineShadows(...shadows: string[]): string {
  return shadows.join(', ');
}

/**
 * Shadow Usage Guidelines
 *
 * 1. FLAT ELEMENTS (shadow.none):
 *    - Page backgrounds
 *    - Section containers
 *    - Text blocks
 *    - Inline elements
 *
 * 2. SUBTLE ELEVATION (shadow.xs, shadow.sm):
 *    - Default cards
 *    - List items
 *    - Buttons at rest
 *    - Table rows on hover
 *    - Selected items
 *
 * 3. STANDARD ELEVATION (shadow.md):
 *    - Dropdowns
 *    - Tooltips
 *    - Floating action buttons
 *    - Hover states for cards
 *    - Sticky headers
 *
 * 4. HIGH ELEVATION (shadow.lg, shadow.xl):
 *    - Modals
 *    - Dialogs
 *    - Sheets and drawers
 *    - Command palettes
 *    - Context menus
 *    - Important popovers
 *
 * 5. MAXIMUM ELEVATION (shadow.2xl):
 *    - Fullscreen modals
 *    - Critical system alerts
 *    - Loading overlays
 *    - Dragging states
 *
 * 6. FOCUS RINGS (coloredShadow.focus):
 *    - Keyboard focus indicators
 *    - Active form fields
 *    - Interactive elements with keyboard focus
 *
 * 7. VALIDATION SHADOWS (coloredShadow.error, success, warning):
 *    - Form field validation states
 *    - Error messages
 *    - Success confirmations
 *    - Warning indicators
 *
 * IMPORTANT RULES:
 *
 * 1. NEVER use arbitrary box-shadow values in components
 * 2. ALWAYS import from this token system
 * 3. Elevation should match z-index (higher z-index = stronger shadow)
 * 4. Use colored shadows for focus states and validation only
 * 5. Reduce shadow on active states (pressed buttons feel lower)
 * 6. Increase shadow on hover states (elements feel interactive)
 * 7. Modals should have maximum elevation (shadow.2xl)
 * 8. Tooltips and popovers should use shadow.md or shadow.lg
 */
