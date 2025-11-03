/**
 * Spacing Token System
 *
 * Provides a consistent spatial system based on an 8px base unit.
 * This creates visual rhythm and alignment across all components.
 *
 * System benefits:
 * - Mathematical consistency (all values divisible by 4 or 8)
 * - Predictable spacing relationships
 * - Easy mental model (count in 8s)
 * - Supports pixel-perfect alignment
 * - Works across different screen densities
 */

/**
 * Base Spacing Scale
 * Built on 8px increments for visual consistency
 * Named using t-shirt sizing for intuitive understanding
 */
export const spacing = {
  // 0px - No space
  none: '0',

  // 2px - Hairline space (very rare)
  '3xs': '0.125rem',

  // 4px - Minimal space (icon padding, tight spacing)
  '2xs': '0.25rem',

  // 6px - Tiny space (compact UI elements)
  xs: '0.375rem',

  // 8px - Extra small (close spacing, compact groups)
  sm: '0.5rem',

  // 12px - Small (related elements, form field spacing)
  md: '0.75rem',

  // 16px - Medium (default spacing, comfortable distance)
  lg: '1rem',

  // 20px - Medium-large (component padding, card spacing)
  xl: '1.25rem',

  // 24px - Large (section spacing, generous padding)
  '2xl': '1.5rem',

  // 32px - Extra large (major section breaks)
  '3xl': '2rem',

  // 40px - 2X large (page section spacing)
  '4xl': '2.5rem',

  // 48px - 3X large (major page divisions)
  '5xl': '3rem',

  // 64px - 4X large (hero spacing, major layout breaks)
  '6xl': '4rem',

  // 80px - 5X large (extra spacious sections)
  '7xl': '5rem',

  // 96px - 6X large (maximum spacing, homepage sections)
  '8xl': '6rem',

  // 128px - 7X large (hero sections)
  '9xl': '8rem',
} as const;

/**
 * Semantic Spacing
 * Named by purpose rather than size
 * Maps to base spacing scale but provides meaning
 */

/**
 * Component Internal Spacing
 * Used within components (padding, gaps between child elements)
 */
export const component = {
  // Button padding, input padding
  inputPadding: spacing.md,
  inputPaddingLg: spacing.lg,
  inputPaddingSm: spacing.sm,

  // Card padding
  cardPadding: spacing.xl,
  cardPaddingLg: spacing['2xl'],
  cardPaddingSm: spacing.lg,

  // Modal padding
  modalPadding: spacing['2xl'],
  modalPaddingLg: spacing['3xl'],
  modalPaddingSm: spacing.xl,

  // Table cell padding
  tableCellPadding: spacing.md,
  tableCellPaddingLg: spacing.lg,
  tableCellPaddingSm: spacing.sm,

  // List item padding
  listItemPadding: spacing.lg,
  listItemPaddingLg: spacing.xl,
  listItemPaddingSm: spacing.md,
} as const;

/**
 * Layout Spacing
 * Used for page-level and section-level spacing
 */
export const layout = {
  // Page margins and padding
  pageGutter: spacing['2xl'],
  pageGutterLg: spacing['3xl'],
  pageGutterSm: spacing.lg,

  // Section spacing (vertical rhythm)
  sectionGap: spacing['4xl'],
  sectionGapLg: spacing['5xl'],
  sectionGapSm: spacing['3xl'],

  // Container max-widths (not spacing but related)
  containerSm: '640px',
  containerMd: '768px',
  containerLg: '1024px',
  containerXl: '1280px',
  container2xl: '1536px',
} as const;

/**
 * Stack Spacing
 * Vertical spacing between stacked elements
 */
export const stack = {
  // Tight stacking (related items in a group)
  tight: spacing.sm,

  // Normal stacking (default vertical rhythm)
  normal: spacing.lg,

  // Relaxed stacking (more breathing room)
  relaxed: spacing.xl,

  // Loose stacking (clear separation)
  loose: spacing['2xl'],
} as const;

/**
 * Inline Spacing
 * Horizontal spacing between inline elements
 */
export const inline = {
  // Tight inline spacing (icon + text, badge groups)
  tight: spacing.xs,

  // Normal inline spacing (button groups, form fields)
  normal: spacing.md,

  // Relaxed inline spacing (toolbar items)
  relaxed: spacing.lg,

  // Loose inline spacing (separated actions)
  loose: spacing.xl,
} as const;

/**
 * Gap Spacing
 * Used for CSS Grid and Flexbox gap property
 */
export const gap = {
  // Minimal gap (tight grids, compact layouts)
  xs: spacing['2xs'],

  // Small gap (form fields, table cells)
  sm: spacing.sm,

  // Medium gap (card grids, default layouts)
  md: spacing.lg,

  // Large gap (spacious grids, feature sections)
  lg: spacing.xl,

  // Extra large gap (major layout divisions)
  xl: spacing['2xl'],
} as const;

/**
 * Inset Spacing
 * Symmetrical padding (all sides equal)
 * Used for containers, cards, buttons
 */
export const inset = {
  // Minimal inset (badges, compact buttons)
  xs: spacing.xs,

  // Small inset (small buttons, tags)
  sm: spacing.sm,

  // Medium inset (default buttons, inputs)
  md: spacing.md,

  // Large inset (large buttons, cards)
  lg: spacing.lg,

  // Extra large inset (hero sections, feature cards)
  xl: spacing.xl,

  // 2X large inset (page containers, modals)
  '2xl': spacing['2xl'],
} as const;

/**
 * Squish Spacing
 * Vertical padding smaller than horizontal
 * Used for buttons, badges, tags (typically 0.5x ratio)
 */
export const squish = {
  // Small squish (8px horizontal, 4px vertical)
  sm: {
    x: spacing.sm,
    y: spacing['2xs'],
  },

  // Medium squish (12px horizontal, 6px vertical)
  md: {
    x: spacing.md,
    y: spacing.xs,
  },

  // Large squish (16px horizontal, 8px vertical)
  lg: {
    x: spacing.lg,
    y: spacing.sm,
  },
} as const;

/**
 * Stretch Spacing
 * Vertical padding larger than horizontal
 * Used for list items, navigation (typically 2x ratio)
 */
export const stretch = {
  // Small stretch (6px horizontal, 12px vertical)
  sm: {
    x: spacing.xs,
    y: spacing.md,
  },

  // Medium stretch (8px horizontal, 16px vertical)
  md: {
    x: spacing.sm,
    y: spacing.lg,
  },

  // Large stretch (12px horizontal, 24px vertical)
  lg: {
    x: spacing.md,
    y: spacing['2xl'],
  },
} as const;

/**
 * Icon Spacing
 * Specific spacing for icons relative to text
 */
export const icon = {
  // Icon next to text (in buttons, links)
  adjacentText: spacing.sm,

  // Icon in input fields
  inputGap: spacing.md,

  // Icon in large elements
  largeGap: spacing.lg,
} as const;

/**
 * Form Spacing
 * Spacing specific to form layouts
 */
export const form = {
  // Vertical gap between form fields
  fieldGap: spacing.lg,

  // Gap between label and input
  labelGap: spacing.sm,

  // Gap between input and help text
  helpGap: spacing.xs,

  // Gap between form sections
  sectionGap: spacing['2xl'],

  // Gap in field groups (inline fields)
  groupGap: spacing.md,
} as const;

/**
 * Type Exports for TypeScript
 */
export type Spacing = keyof typeof spacing;
export type ComponentSpacing = keyof typeof component;
export type LayoutSpacing = keyof typeof layout;
export type StackSpacing = keyof typeof stack;
export type InlineSpacing = keyof typeof inline;
export type GapSpacing = keyof typeof gap;
export type InsetSpacing = keyof typeof inset;

/**
 * Unified Spacing Token Export
 */
export const spacingTokens = {
  spacing,
  component,
  layout,
  stack,
  inline,
  gap,
  inset,
  squish,
  stretch,
  icon,
  form,
} as const;

export type SpacingTokens = typeof spacingTokens;

/**
 * Helper function to create consistent spacing
 * Useful for dynamic spacing calculations
 */
export function getSpacing(multiplier: number): string {
  return `${multiplier * 0.5}rem`; // 0.5rem = 8px base
}

/**
 * Spacing scale as array for iteration
 * Useful when generating variants or documentation
 */
export const spacingScale = [
  { name: '3xs', value: spacing['3xs'], pixels: '2px' },
  { name: '2xs', value: spacing['2xs'], pixels: '4px' },
  { name: 'xs', value: spacing.xs, pixels: '6px' },
  { name: 'sm', value: spacing.sm, pixels: '8px' },
  { name: 'md', value: spacing.md, pixels: '12px' },
  { name: 'lg', value: spacing.lg, pixels: '16px' },
  { name: 'xl', value: spacing.xl, pixels: '20px' },
  { name: '2xl', value: spacing['2xl'], pixels: '24px' },
  { name: '3xl', value: spacing['3xl'], pixels: '32px' },
  { name: '4xl', value: spacing['4xl'], pixels: '40px' },
  { name: '5xl', value: spacing['5xl'], pixels: '48px' },
  { name: '6xl', value: spacing['6xl'], pixels: '64px' },
  { name: '7xl', value: spacing['7xl'], pixels: '80px' },
  { name: '8xl', value: spacing['8xl'], pixels: '96px' },
  { name: '9xl', value: spacing['9xl'], pixels: '128px' },
] as const;
