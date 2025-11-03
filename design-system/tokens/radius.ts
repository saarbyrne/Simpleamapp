/**
 * Border Radius Token System
 *
 * Provides consistent corner rounding across all components.
 * Creates visual harmony and reinforces brand personality.
 *
 * Our system uses:
 * - Small increments for precise control
 * - Named tokens for semantic meaning
 * - Component-specific assignments
 * - Support for full rounding (pills, circles)
 */

/**
 * Base Radius Scale
 * Incremental scale for border-radius values
 */
export const radius = {
  // No rounding (sharp corners)
  none: '0',

  // 2px - Minimal rounding (subtle softness)
  sm: '0.125rem',

  // 4px - Small rounding (slight softness, default for inputs)
  base: '0.25rem',

  // 6px - Medium rounding (comfortable softness, default for cards)
  md: '0.375rem',

  // 8px - Large rounding (noticeable softness, default for buttons)
  lg: '0.5rem',

  // 12px - Extra large rounding (pronounced softness)
  xl: '0.75rem',

  // 16px - 2X large rounding (very rounded)
  '2xl': '1rem',

  // 24px - 3X large rounding (heavily rounded)
  '3xl': '1.5rem',

  // Full rounding (perfect circle/pill)
  full: '9999px',
} as const;

/**
 * Semantic Radius
 * Named by purpose and usage context
 */

/**
 * Component Radius
 * Pre-assigned radius values for specific components
 */
export const component = {
  // Button radius
  button: radius.lg,
  buttonSm: radius.md,
  buttonLg: radius.xl,
  buttonPill: radius.full,

  // Input radius
  input: radius.md,
  inputSm: radius.base,
  inputLg: radius.lg,

  // Card radius
  card: radius.xl,
  cardSm: radius.lg,
  cardLg: radius['2xl'],

  // Badge radius
  badge: radius.full,
  badgeSquare: radius.base,

  // Avatar radius
  avatar: radius.full,
  avatarSquare: radius.md,

  // Modal radius
  modal: radius.xl,
  modalLg: radius['2xl'],

  // Popover radius
  popover: radius.lg,
  popoverSm: radius.md,

  // Tooltip radius
  tooltip: radius.md,

  // Dropdown radius
  dropdown: radius.lg,
  dropdownSm: radius.md,

  // Select radius
  select: radius.md,

  // Checkbox radius
  checkbox: radius.base,

  // Radio radius (always full)
  radio: radius.full,

  // Switch radius (always full for track)
  switch: radius.full,

  // Tag radius
  tag: radius.base,
  tagPill: radius.full,

  // Chip radius
  chip: radius.md,
  chipPill: radius.full,

  // Alert radius
  alert: radius.lg,
  alertSm: radius.md,

  // Toast radius
  toast: radius.lg,

  // Table radius
  table: radius.lg,
  tableCell: radius.none,

  // Tabs radius
  tab: radius.md,
  tabPill: radius.full,

  // Accordion radius
  accordion: radius.lg,

  // Menu radius
  menu: radius.lg,
  menuItem: radius.base,

  // Sheet radius
  sheet: radius.xl,

  // Drawer radius
  drawer: radius.xl,

  // Dialog radius
  dialog: radius.xl,

  // Sidebar radius
  sidebar: radius.none,

  // Image radius
  image: radius.md,
  imageRound: radius.full,

  // Progress bar radius
  progress: radius.full,

  // Slider radius
  slider: radius.full,

  // Separator radius (typically none)
  separator: radius.none,

  // Skeleton radius
  skeleton: radius.md,
} as const;

/**
 * Layout Radius
 * Radius values for layout-level elements
 */
export const layout = {
  // Container radius (rarely used at layout level)
  container: radius.none,

  // Section radius
  section: radius.xl,

  // Panel radius
  panel: radius.lg,

  // Well radius (inset areas)
  well: radius.md,
} as const;

/**
 * Interactive Radius
 * Radius for different interaction states
 * Some components increase radius on hover for playfulness
 */
export const interaction = {
  // Resting state
  rest: radius.lg,

  // Hover state (slightly more rounded)
  hover: radius.xl,

  // Active state (back to normal)
  active: radius.lg,

  // Focus state (same as rest, focus indicated by outline)
  focus: radius.lg,
} as const;

/**
 * Special Radius
 * Unique radius patterns for specific use cases
 */
export const special = {
  // Pill shape (full rounded on left/right, flat top/bottom)
  // Used for: Tags, badges, status indicators
  pill: radius.full,

  // Circle (full rounded all sides)
  // Used for: Avatars, icons, FAB buttons
  circle: radius.full,

  // Stadium (rounded ends, straight sides)
  // Used for: Buttons, inputs, progress bars
  stadium: radius.full,

  // Squircle (between circle and square, iOS style)
  // Not directly supported in CSS, use radius.xl as approximation
  squircle: radius.xl,

  // Top-only rounding (modals that slide from bottom)
  topOnly: {
    topLeft: radius.xl,
    topRight: radius.xl,
    bottomLeft: radius.none,
    bottomRight: radius.none,
  },

  // Bottom-only rounding (dropdowns from top)
  bottomOnly: {
    topLeft: radius.none,
    topRight: radius.none,
    bottomLeft: radius.xl,
    bottomRight: radius.xl,
  },

  // Left-only rounding (drawers from right)
  leftOnly: {
    topLeft: radius.xl,
    topRight: radius.none,
    bottomLeft: radius.xl,
    bottomRight: radius.none,
  },

  // Right-only rounding (drawers from left)
  rightOnly: {
    topLeft: radius.none,
    topRight: radius.xl,
    bottomLeft: radius.none,
    bottomRight: radius.xl,
  },
} as const;

/**
 * Type Exports for TypeScript
 */
export type Radius = keyof typeof radius;
export type ComponentRadius = keyof typeof component;
export type LayoutRadius = keyof typeof layout;
export type InteractionRadius = keyof typeof interaction;
export type SpecialRadius = keyof typeof special;

/**
 * Unified Radius Token Export
 */
export const borderRadius = {
  radius,
  component,
  layout,
  interaction,
  special,
} as const;

export type BorderRadiusTokens = typeof borderRadius;

/**
 * Helper function to create asymmetric radius
 * Useful for components with different corner radiuses
 */
export function asymmetricRadius(
  topLeft: string,
  topRight: string,
  bottomRight: string,
  bottomLeft: string
): string {
  return `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
}

/**
 * Helper function to create top-rounded style
 */
export function topRounded(size: keyof typeof radius = 'xl'): {
  borderTopLeftRadius: string;
  borderTopRightRadius: string;
  borderBottomLeftRadius: string;
  borderBottomRightRadius: string;
} {
  return {
    borderTopLeftRadius: radius[size],
    borderTopRightRadius: radius[size],
    borderBottomLeftRadius: radius.none,
    borderBottomRightRadius: radius.none,
  };
}

/**
 * Helper function to create bottom-rounded style
 */
export function bottomRounded(size: keyof typeof radius = 'xl'): {
  borderTopLeftRadius: string;
  borderTopRightRadius: string;
  borderBottomLeftRadius: string;
  borderBottomRightRadius: string;
} {
  return {
    borderTopLeftRadius: radius.none,
    borderTopRightRadius: radius.none,
    borderBottomLeftRadius: radius[size],
    borderBottomRightRadius: radius[size],
  };
}

/**
 * Radius Usage Guidelines
 *
 * 1. SHARP CORNERS (radius.none):
 *    - Tables
 *    - Layouts
 *    - Separators
 *    - Elements that need to align perfectly
 *
 * 2. SUBTLE ROUNDING (radius.sm, radius.base):
 *    - Checkboxes
 *    - Small badges
 *    - Tight UI elements
 *    - Menu items
 *
 * 3. STANDARD ROUNDING (radius.md, radius.lg):
 *    - Inputs
 *    - Buttons
 *    - Cards
 *    - Dropdowns
 *    - Most interactive elements
 *
 * 4. PRONOUNCED ROUNDING (radius.xl, radius.2xl):
 *    - Large cards
 *    - Modals
 *    - Hero sections
 *    - Feature panels
 *
 * 5. FULL ROUNDING (radius.full):
 *    - Avatars (circles)
 *    - Badges (pills)
 *    - Tags (pills)
 *    - Progress bars
 *    - Pills and chips
 *    - Radio buttons
 *    - Switches
 *
 * IMPORTANT RULES:
 *
 * 1. NEVER use arbitrary border-radius values in components
 * 2. ALWAYS import from this token system
 * 3. Smaller elements = smaller radius (badges, inputs)
 * 4. Larger elements = larger radius (cards, modals)
 * 5. Interactive elements should have visible rounding (radius.md+)
 * 6. Use radius.full for circular/pill shapes only
 * 7. Maintain consistent radius within component families
 * 8. Consider nested radius (inner elements slightly less rounded)
 *
 * NESTING RULE:
 * When nesting rounded elements, reduce inner radius by one step:
 * - Outer: radius.xl (16px) → Inner: radius.lg (8px)
 * - Outer: radius.lg (8px) → Inner: radius.md (6px)
 * - Outer: radius.md (6px) → Inner: radius.base (4px)
 *
 * This creates visual harmony and prevents awkward corner clipping.
 */
