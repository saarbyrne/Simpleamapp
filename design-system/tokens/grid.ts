/**
 * Grid System Token
 *
 * Defines the responsive grid layout system.
 * Based on 12-column grid with responsive gutters and margins.
 *
 * Philosophy:
 * - 12-column grid for maximum flexibility
 * - Responsive gutters that scale with viewport
 * - Consistent container padding
 * - Fluid layouts with max-width constraints
 *
 * Usage:
 * - Use with CSS Grid: grid-template-columns: repeat(12, minmax(0, 1fr))
 * - Use with Flexbox: width: calc((100% / 12) * {columns})
 * - Use with Tailwind: grid-cols-12, gap-{size}
 */

import { breakpoints } from './breakpoints';

/**
 * Grid columns
 * Standard 12-column grid system
 */
export const gridColumns = {
  /** Total columns in grid */
  total: 12,

  /** Common column spans */
  spans: {
    /** Full width (12 columns) */
    full: 12,

    /** Three quarters (9 columns) */
    threeQuarters: 9,

    /** Two thirds (8 columns) */
    twoThirds: 8,

    /** Half (6 columns) */
    half: 6,

    /** Third (4 columns) */
    third: 4,

    /** Quarter (3 columns) */
    quarter: 3,

    /** Sixth (2 columns) */
    sixth: 2,

    /** Single column */
    single: 1,
  },
} as const;

/**
 * Grid gutters (gaps between columns)
 * Responsive spacing that increases with viewport size
 */
export const gridGutters = {
  /** Extra small: Mobile phones - 16px gap */
  xs: '1rem',

  /** Small: Mobile landscape - 20px gap */
  sm: '1.25rem',

  /** Medium: Tablets - 24px gap */
  md: '1.5rem',

  /** Large: Desktop - 32px gap */
  lg: '2rem',

  /** Extra large: Large desktop - 40px gap */
  xl: '2.5rem',

  /** 2X large: Wide screens - 48px gap */
  '2xl': '3rem',
} as const;

/**
 * Container padding (outer margins)
 * Ensures content doesn't touch viewport edges
 */
export const containerPadding = {
  /** Extra small: Mobile - 16px padding */
  xs: '1rem',

  /** Small: Mobile landscape - 24px padding */
  sm: '1.5rem',

  /** Medium: Tablets - 32px padding */
  md: '2rem',

  /** Large: Desktop - 48px padding */
  lg: '3rem',

  /** Extra large: Large desktop - 64px padding */
  xl: '4rem',

  /** 2X large: Wide screens - 80px padding */
  '2xl': '5rem',
} as const;

/**
 * Container max widths
 * Prevents content from being too wide on large screens
 */
export const containerMaxWidths = {
  /** Small container: 640px */
  sm: '640px',

  /** Medium container: 768px */
  md: '768px',

  /** Large container: 1024px */
  lg: '1024px',

  /** Extra large container: 1280px */
  xl: '1280px',

  /** 2X large container: 1536px */
  '2xl': '1536px',

  /** Full width container: No max width */
  full: '100%',

  /** Narrow content container: 720px (for reading comfort) */
  narrow: '720px',

  /** Wide content container: 1440px */
  wide: '1440px',
} as const;

/**
 * Responsive grid configuration
 * Defines how many columns to show at each breakpoint
 */
export const responsiveGrids = {
  /** 1 column on mobile */
  mobile: {
    columns: 1,
    gutter: gridGutters.xs,
    padding: containerPadding.xs,
  },

  /** 2 columns on small devices */
  tablet: {
    columns: 2,
    gutter: gridGutters.sm,
    padding: containerPadding.sm,
  },

  /** 3 columns on medium devices */
  desktop: {
    columns: 3,
    gutter: gridGutters.md,
    padding: containerPadding.md,
  },

  /** 4 columns on large devices */
  wide: {
    columns: 4,
    gutter: gridGutters.lg,
    padding: containerPadding.lg,
  },
} as const;

/**
 * Grid templates (pre-defined layouts)
 * Common grid patterns for quick implementation
 */
export const gridTemplates = {
  /** Sidebar + Content layout (1/4 + 3/4) */
  sidebarContent: {
    sidebar: 3,
    content: 9,
    description: 'Sidebar (3 cols) + Main content (9 cols)',
  },

  /** Content + Sidebar layout (3/4 + 1/4) */
  contentSidebar: {
    content: 9,
    sidebar: 3,
    description: 'Main content (9 cols) + Sidebar (3 cols)',
  },

  /** Two equal columns */
  twoColumn: {
    left: 6,
    right: 6,
    description: 'Two equal columns (6 cols each)',
  },

  /** Three equal columns */
  threeColumn: {
    left: 4,
    center: 4,
    right: 4,
    description: 'Three equal columns (4 cols each)',
  },

  /** Four equal columns */
  fourColumn: {
    col1: 3,
    col2: 3,
    col3: 3,
    col4: 3,
    description: 'Four equal columns (3 cols each)',
  },

  /** Narrow sidebar (1/6) + Wide content (5/6) */
  narrowSidebar: {
    sidebar: 2,
    content: 10,
    description: 'Narrow sidebar (2 cols) + Wide content (10 cols)',
  },

  /** Hero layout (centered content) */
  hero: {
    offset: 2,
    content: 8,
    description: 'Centered content with 2-col offset on each side',
  },
} as const;

/**
 * Utility: Calculate column width percentage
 * @param columns - Number of columns to span
 * @returns Percentage width as string
 *
 * Example:
 * ```typescript
 * const width = getColumnWidth(6); // '50%'
 * ```
 */
export function getColumnWidth(columns: number): string {
  return `${(columns / gridColumns.total) * 100}%`;
}

/**
 * Utility: Calculate responsive grid classes
 * @param config - Responsive column configuration
 * @returns Tailwind-style responsive classes
 *
 * Example:
 * ```typescript
 * const classes = getResponsiveGridClasses({
 *   xs: 1, sm: 2, md: 3, lg: 4
 * });
 * // Returns: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
 * ```
 */
export function getResponsiveGridClasses(config: {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}): string {
  const classes: string[] = [];

  if (config.xs) classes.push(`grid-cols-${config.xs}`);
  if (config.sm) classes.push(`sm:grid-cols-${config.sm}`);
  if (config.md) classes.push(`md:grid-cols-${config.md}`);
  if (config.lg) classes.push(`lg:grid-cols-${config.lg}`);
  if (config.xl) classes.push(`xl:grid-cols-${config.xl}`);
  if (config['2xl']) classes.push(`2xl:grid-cols-${config['2xl']}`);

  return classes.join(' ');
}

/**
 * Utility: Generate CSS Grid template
 * @param columns - Number of columns
 * @returns CSS grid-template-columns value
 *
 * Example:
 * ```typescript
 * const template = getGridTemplate(12);
 * // Returns: 'repeat(12, minmax(0, 1fr))'
 * ```
 */
export function getGridTemplate(columns: number): string {
  return `repeat(${columns}, minmax(0, 1fr))`;
}

/**
 * Utility: Calculate grid gap
 * @param breakpoint - Current breakpoint
 * @returns Gap value for the breakpoint
 */
export function getGridGap(breakpoint: keyof typeof gridGutters): string {
  return gridGutters[breakpoint];
}

/**
 * Utility: Calculate container padding
 * @param breakpoint - Current breakpoint
 * @returns Padding value for the breakpoint
 */
export function getContainerPadding(breakpoint: keyof typeof containerPadding): string {
  return containerPadding[breakpoint];
}

/**
 * Type definitions
 */
export type GridSpan = keyof typeof gridColumns.spans;
export type GridGutter = keyof typeof gridGutters;
export type GridTemplate = keyof typeof gridTemplates;

/**
 * Export all grid tokens
 */
export const gridTokens = {
  gridColumns,
  gridGutters,
  containerPadding,
  containerMaxWidths,
  responsiveGrids,
  gridTemplates,
  getColumnWidth,
  getResponsiveGridClasses,
  getGridTemplate,
  getGridGap,
  getContainerPadding,
} as const;

export default gridTokens;
