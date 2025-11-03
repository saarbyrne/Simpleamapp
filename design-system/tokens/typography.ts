/**
 * Typography Token System
 *
 * Provides a comprehensive type system with:
 * - Font families for different use cases
 * - Type scales for consistent sizing
 * - Line heights for optimal readability
 * - Font weights for proper hierarchy
 * - Letter spacing for visual refinement
 * - Text styles as complete compositions
 *
 * Based on modular scale (1.25 ratio) for mathematical harmony
 */

/**
 * Font Families
 */
export const fontFamily = {
  // Primary font for all UI elements and body text
  sans: [
    'Inter',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(', '),

  // Monospace for code, data, and technical content
  mono: [
    '"SF Mono"',
    'Monaco',
    'Consolas',
    '"Liberation Mono"',
    '"Courier New"',
    'monospace',
  ].join(', '),

  // Display font for marketing and hero sections (optional)
  display: [
    'Inter',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'sans-serif',
  ].join(', '),
} as const;

/**
 * Font Sizes
 * Modular scale based on 16px base with 1.25 ratio
 * Each step is 25% larger than the previous
 */
export const fontSize = {
  // 10px - Tiny text, rarely used
  xs: '0.625rem',

  // 12px - Small labels, captions, metadata
  sm: '0.75rem',

  // 14px - Secondary body text, form labels
  base: '0.875rem',

  // 16px - Primary body text (default)
  md: '1rem',

  // 18px - Emphasized body text, small headings
  lg: '1.125rem',

  // 20px - Large body text, h4
  xl: '1.25rem',

  // 24px - Section headings, h3
  '2xl': '1.5rem',

  // 30px - Page subheadings, h2
  '3xl': '1.875rem',

  // 36px - Page headings, h1
  '4xl': '2.25rem',

  // 48px - Hero headings
  '5xl': '3rem',

  // 60px - Large display text
  '6xl': '3.75rem',

  // 72px - Extra large display text
  '7xl': '4.5rem',
} as const;

/**
 * Line Heights
 * Optimized for readability across different font sizes
 * Smaller text = taller line height for readability
 * Larger text = shorter line height for visual impact
 */
export const lineHeight = {
  // 100% - Very tight, used for large display text
  none: '1',

  // 125% - Tight, used for headings
  tight: '1.25',

  // 140% - Snug, used for UI elements
  snug: '1.4',

  // 150% - Normal, default for body text
  normal: '1.5',

  // 160% - Relaxed, used for long-form content
  relaxed: '1.6',

  // 175% - Loose, used for small text that needs breathing room
  loose: '1.75',
} as const;

/**
 * Font Weights
 * Inter font family supports variable weights
 */
export const fontWeight = {
  // 300 - Light, used sparingly for large display text
  light: '300',

  // 400 - Regular, default body text
  normal: '400',

  // 500 - Medium, emphasized text, labels
  medium: '500',

  // 600 - Semibold, headings, strong emphasis
  semibold: '600',

  // 700 - Bold, important headings, buttons
  bold: '700',
} as const;

/**
 * Letter Spacing
 * Subtle adjustments for optical balance
 */
export const letterSpacing = {
  // -0.02em - Tighter for large headings
  tighter: '-0.02em',

  // -0.01em - Slightly tight for headings
  tight: '-0.01em',

  // 0 - Normal spacing (default)
  normal: '0',

  // 0.01em - Slightly wide for small text
  wide: '0.01em',

  // 0.025em - Wider for uppercase text
  wider: '0.025em',

  // 0.05em - Very wide for all-caps UI elements
  widest: '0.05em',
} as const;

/**
 * Text Styles
 * Complete typographic compositions for common use cases
 * Each style includes font-size, line-height, weight, and letter-spacing
 */

/**
 * Display Text Styles
 * Used for hero sections, large page headings, marketing content
 */
export const display = {
  // 72px - Extra large display (homepage hero)
  xl: {
    fontSize: fontSize['7xl'],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tighter,
    fontFamily: fontFamily.display,
  },

  // 60px - Large display
  lg: {
    fontSize: fontSize['6xl'],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tighter,
    fontFamily: fontFamily.display,
  },

  // 48px - Medium display
  md: {
    fontSize: fontSize['5xl'],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.display,
  },

  // 36px - Small display
  sm: {
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.display,
  },
} as const;

/**
 * Heading Text Styles
 * Used for section headings, page titles, content hierarchy
 */
export const heading = {
  // 30px - H1, page title
  h1: {
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.tight,
  },

  // 24px - H2, section heading
  h2: {
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.tight,
  },

  // 20px - H3, subsection heading
  h3: {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },

  // 18px - H4, small heading
  h4: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },

  // 16px - H5, card title
  h5: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },

  // 14px - H6, small card title
  h6: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },
} as const;

/**
 * Body Text Styles
 * Used for paragraphs, descriptions, content
 */
export const body = {
  // 18px - Large body text (article content, long-form reading)
  lg: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // 16px - Default body text
  md: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // 14px - Small body text (UI descriptions, form help text)
  sm: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // 12px - Extra small body text (captions, footnotes)
  xs: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.loose,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.wide,
  },
} as const;

/**
 * UI Element Text Styles
 * Used for buttons, labels, inputs, and interactive elements
 */
export const ui = {
  // Button text (large)
  buttonLg: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.normal,
  },

  // Button text (default)
  button: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.normal,
  },

  // Button text (small)
  buttonSm: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
  },

  // Form labels
  label: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.normal,
  },

  // Form input text
  input: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Form help text
  help: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.wide,
  },

  // Badges and tags
  badge: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wider,
  },

  // Table headers
  tableHeader: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.wide,
  },

  // Table cells
  tableCell: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Navigation items
  nav: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.normal,
  },
} as const;

/**
 * Code and Technical Text Styles
 * Used for code snippets, data display, technical content
 */
export const code = {
  // Inline code
  inline: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.mono,
  },

  // Code block
  block: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.mono,
  },
} as const;

/**
 * Utility Text Styles
 * Special-purpose text styles
 */
export const utility = {
  // Uppercase labels (e.g., section labels)
  overline: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },

  // Small caps text
  caption: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.wide,
  },

  // Metadata and timestamps
  metadata: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.wide,
  },
} as const;

/**
 * Type Exports for TypeScript
 */
export type FontFamily = keyof typeof fontFamily;
export type FontSize = keyof typeof fontSize;
export type LineHeight = keyof typeof lineHeight;
export type FontWeight = keyof typeof fontWeight;
export type LetterSpacing = keyof typeof letterSpacing;

/**
 * Unified Typography Token Export
 */
export const typography = {
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  display,
  heading,
  body,
  ui,
  code,
  utility,
} as const;

export type TypographyTokens = typeof typography;
