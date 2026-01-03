/**
 * Typography Design Tokens
 * 
 * Typography tokens define font families, sizes, weights, and line heights.
 * Use Tailwind typography utilities instead of hardcoded values.
 */

export const typography = {
  // Font Families
  fontFamily: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  },
  
  // Font Sizes (in rem)
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px (default)
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
    '8xl': '6rem',      // 96px
    '9xl': '8rem',      // 128px
  },
  
  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const

/**
 * Typography scale with semantic names
 */
export const typographyScale = {
  // Headings
  h1: {
    fontSize: 'text-4xl',
    fontWeight: 'font-bold',
    lineHeight: 'leading-tight',
  },
  h2: {
    fontSize: 'text-3xl',
    fontWeight: 'font-bold',
    lineHeight: 'leading-tight',
  },
  h3: {
    fontSize: 'text-2xl',
    fontWeight: 'font-semibold',
    lineHeight: 'leading-snug',
  },
  h4: {
    fontSize: 'text-xl',
    fontWeight: 'font-semibold',
    lineHeight: 'leading-snug',
  },
  h5: {
    fontSize: 'text-lg',
    fontWeight: 'font-medium',
    lineHeight: 'leading-normal',
  },
  h6: {
    fontSize: 'text-base',
    fontWeight: 'font-medium',
    lineHeight: 'leading-normal',
  },
  
  // Body text
  body: {
    fontSize: 'text-base',
    fontWeight: 'font-normal',
    lineHeight: 'leading-normal',
  },
  bodySmall: {
    fontSize: 'text-sm',
    fontWeight: 'font-normal',
    lineHeight: 'leading-normal',
  },
  
  // UI text
  label: {
    fontSize: 'text-sm',
    fontWeight: 'font-medium',
    lineHeight: 'leading-normal',
  },
  caption: {
    fontSize: 'text-xs',
    fontWeight: 'font-normal',
    lineHeight: 'leading-relaxed',
  },
  
  // Code
  code: {
    fontSize: 'text-sm',
    fontFamily: 'font-mono',
    lineHeight: 'leading-normal',
  },
} as const

/**
 * CSS Variable Names
 */
export const typographyVariables = {
  fontSans: '--font-sans',
  fontMono: '--font-mono',
  fontSize: '--font-size',
  textXs: '--text-xs',
  textSm: '--text-sm',
  textBase: '--text-base',
  textLg: '--text-lg',
  textXl: '--text-xl',
  text2xl: '--text-2xl',
  fontWeightNormal: '--font-weight-normal',
  fontWeightMedium: '--font-weight-medium',
  fontWeightSemibold: '--font-weight-semibold',
} as const

/**
 * Usage Examples:
 * 
 * // Headings
 * <h1 className="text-4xl font-bold">Heading 1</h1>
 * <h2 className="text-3xl font-semibold">Heading 2</h2>
 * 
 * // Body text
 * <p className="text-base text-foreground">Body text</p>
 * <p className="text-sm text-muted-foreground">Small text</p>
 * 
 * // Code
 * <code className="font-mono text-sm">Code snippet</code>
 * 
 * // Using typography scale
 * <h1 className={`${typographyScale.h1.fontSize} ${typographyScale.h1.fontWeight}`}>
 */
