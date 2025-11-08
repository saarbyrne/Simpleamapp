/**
 * Breakpoints Token System
 *
 * Defines responsive breakpoints for mobile-first design.
 * Based on common device sizes and usage patterns.
 *
 * Philosophy:
 * - Mobile-first: Start with mobile and progressively enhance
 * - Named semantically: sm, md, lg, xl, 2xl reflect viewport sizes
 * - Based on content needs, not specific devices
 * - Consistent with Tailwind CSS breakpoint system
 *
 * Usage:
 * - Use in media queries: @media (min-width: ${breakpoints.sm})
 * - Use with Tailwind: sm:, md:, lg:, xl:, 2xl: prefixes
 * - Use in JavaScript: window.matchMedia(`(min-width: ${breakpoints.md})`)
 */

/**
 * Breakpoint values in pixels
 * Mobile-first approach: styles apply from this size upward
 */
export const breakpoints = {
  /** Extra small: Mobile phones (portrait) - 0px and up (default) */
  xs: '0px',

  /** Small: Mobile phones (landscape), small tablets - 640px and up */
  sm: '640px',

  /** Medium: Tablets (portrait), large phones - 768px and up */
  md: '768px',

  /** Large: Tablets (landscape), small desktops - 1024px and up */
  lg: '1024px',

  /** Extra large: Desktops, large screens - 1280px and up */
  xl: '1280px',

  /** 2X large: Large desktops, wide screens - 1536px and up */
  '2xl': '1536px',
} as const;

/**
 * Breakpoint values as numbers (for JavaScript calculations)
 */
export const breakpointValues = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Container max widths for each breakpoint
 * Ensures content doesn't stretch too wide on large screens
 */
export const containerMaxWidths = {
  /** Mobile: Full width */
  xs: '100%',

  /** Small: 640px container */
  sm: '640px',

  /** Medium: 768px container */
  md: '768px',

  /** Large: 1024px container */
  lg: '1024px',

  /** Extra large: 1280px container */
  xl: '1280px',

  /** 2X large: 1536px container */
  '2xl': '1536px',
} as const;

/**
 * Responsive viewport ranges for targeting specific screen sizes
 * Useful for analytics, device detection, or conditional rendering
 */
export const viewportRanges = {
  /** Mobile phones (portrait): 0 - 639px */
  mobile: {
    min: 0,
    max: 639,
    label: 'Mobile',
    description: 'Small phones and mobile devices in portrait mode',
  },

  /** Tablets and large phones: 640 - 1023px */
  tablet: {
    min: 640,
    max: 1023,
    label: 'Tablet',
    description: 'Tablets, large phones in landscape, and small tablets',
  },

  /** Desktop and laptops: 1024px+ */
  desktop: {
    min: 1024,
    max: Infinity,
    label: 'Desktop',
    description: 'Desktop computers, laptops, and large screens',
  },
} as const;

/**
 * Media query helpers
 * Pre-built media query strings for common patterns
 */
export const mediaQueries = {
  /** Mobile and up (default) */
  xs: `(min-width: ${breakpoints.xs})`,

  /** Small devices and up */
  sm: `(min-width: ${breakpoints.sm})`,

  /** Medium devices and up */
  md: `(min-width: ${breakpoints.md})`,

  /** Large devices and up */
  lg: `(min-width: ${breakpoints.lg})`,

  /** Extra large devices and up */
  xl: `(min-width: ${breakpoints.xl})`,

  /** 2X large devices and up */
  '2xl': `(min-width: ${breakpoints['2xl']})`,

  /** Mobile only (0 - 639px) */
  mobileOnly: `(max-width: ${breakpointValues.sm - 1}px)`,

  /** Tablet only (640 - 1023px) */
  tabletOnly: `(min-width: ${breakpoints.sm}) and (max-width: ${breakpointValues.lg - 1}px)`,

  /** Desktop only (1024px+) */
  desktopOnly: `(min-width: ${breakpoints.lg})`,

  /** Prefer reduced motion */
  reducedMotion: '(prefers-reduced-motion: reduce)',

  /** Dark mode preference */
  darkMode: '(prefers-color-scheme: dark)',

  /** High contrast mode */
  highContrast: '(prefers-contrast: high)',
} as const;

/**
 * Utility: Check if viewport matches breakpoint
 * @param breakpoint - Breakpoint name
 * @returns boolean indicating if viewport matches
 *
 * Example:
 * ```typescript
 * if (matchesBreakpoint('md')) {
 *   // Show desktop navigation
 * }
 * ```
 */
export function matchesBreakpoint(breakpoint: keyof typeof breakpoints): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(mediaQueries[breakpoint]).matches;
}

/**
 * Utility: Get current breakpoint
 * @returns Current breakpoint name based on viewport width
 *
 * Example:
 * ```typescript
 * const breakpoint = getCurrentBreakpoint(); // 'md', 'lg', etc.
 * ```
 */
export function getCurrentBreakpoint(): keyof typeof breakpoints {
  if (typeof window === 'undefined') return 'xs';

  const width = window.innerWidth;

  if (width >= breakpointValues['2xl']) return '2xl';
  if (width >= breakpointValues.xl) return 'xl';
  if (width >= breakpointValues.lg) return 'lg';
  if (width >= breakpointValues.md) return 'md';
  if (width >= breakpointValues.sm) return 'sm';
  return 'xs';
}

/**
 * Utility: Check if viewport is mobile
 * @returns boolean indicating if viewport is mobile size
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpointValues.md;
}

/**
 * Utility: Check if viewport is tablet
 * @returns boolean indicating if viewport is tablet size
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= breakpointValues.sm && width < breakpointValues.lg;
}

/**
 * Utility: Check if viewport is desktop
 * @returns boolean indicating if viewport is desktop size
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpointValues.lg;
}

/**
 * Type definitions
 */
export type Breakpoint = keyof typeof breakpoints;
export type BreakpointValue = typeof breakpointValues[Breakpoint];
export type ViewportRange = keyof typeof viewportRanges;

/**
 * Export all breakpoint tokens
 */
export const breakpointTokens = {
  breakpoints,
  breakpointValues,
  containerMaxWidths,
  viewportRanges,
  mediaQueries,
  matchesBreakpoint,
  getCurrentBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
} as const;

export default breakpointTokens;
