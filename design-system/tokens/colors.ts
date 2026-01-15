/**
 * Color Design Tokens
 * 
 * Color tokens are defined as CSS custom properties in app/globals.css
 * and mapped to Tailwind utilities in tailwind.config.js.
 * 
 * Colors use OKLCH color space for better perceptual uniformity.
 * All colors support both light and dark modes.
 */

export const colors = {
  // Semantic Colors
  primary: {
    light: 'oklch(0.646 0.222 41.116)',
    dark: 'oklch(0.705 0.213 47.604)',
    foreground: {
      light: 'oklch(0.98 0.016 73.684)',
      dark: 'oklch(0.98 0.016 73.684)',
    },
  },
  secondary: {
    light: 'oklch(0.967 0.001 286.375)',
    dark: 'oklch(0.274 0.006 286.033)',
    foreground: {
      light: 'oklch(0.21 0.006 285.885)',
      dark: 'oklch(0.985 0 0)',
    },
  },
  destructive: {
    light: 'oklch(0.577 0.245 27.325)',
    dark: 'oklch(0.704 0.191 22.216)',
    foreground: {
      light: 'oklch(0.98 0.016 73.684)',
      dark: 'oklch(0.98 0.016 73.684)',
    },
  },
  muted: {
    light: 'oklch(0.967 0.001 286.375)',
    dark: 'oklch(0.274 0.006 286.033)',
    foreground: {
      light: 'oklch(0.552 0.016 285.938)',
      dark: 'oklch(0.705 0.015 286.067)',
    },
  },
  accent: {
    light: 'oklch(0.967 0.001 286.375)',
    dark: 'oklch(0.274 0.006 286.033)',
    foreground: {
      light: 'oklch(0.21 0.006 285.885)',
      dark: 'oklch(0.985 0 0)',
    },
  },
  
  // Background Colors
  background: {
    light: 'oklch(1 0 0)',
    dark: 'oklch(0.141 0.005 285.823)',
  },
  foreground: {
    light: 'oklch(0.141 0.005 285.823)',
    dark: 'oklch(0.985 0 0)',
  },
  card: {
    light: 'oklch(1 0 0)',
    dark: 'oklch(0.21 0.006 285.885)',
    foreground: {
      light: 'oklch(0.141 0.005 285.823)',
      dark: 'oklch(0.985 0 0)',
    },
  },
  popover: {
    light: 'oklch(1 0 0)',
    dark: 'oklch(0.21 0.006 285.885)',
    foreground: {
      light: 'oklch(0.141 0.005 285.823)',
      dark: 'oklch(0.985 0 0)',
    },
  },
  pageBackground: {
    light: 'oklch(0.97 0.002 286.375)',
    dark: 'oklch(0.141 0.005 285.823)',
  },
  navBackground: {
    light: 'oklch(1 0 0)',
    dark: 'oklch(0.21 0.006 285.885)',
  },
  
  // Border & Input Colors
  border: {
    light: 'oklch(0.92 0.004 286.32)',
    dark: 'oklch(1 0 0 / 10%)',
  },
  input: {
    light: 'oklch(0.92 0.004 286.32)',
    dark: 'oklch(1 0 0 / 15%)',
  },
  ring: {
    light: 'oklch(0.75 0.183 55.934)',
    dark: 'oklch(0.408 0.123 38.172)',
  },
  
  // Sidebar Colors
  sidebar: {
    light: 'oklch(1 0 0)',
    dark: 'oklch(0.21 0.006 285.885)',
    foreground: {
      light: 'oklch(0.141 0.005 285.823)',
      dark: 'oklch(0.985 0 0)',
    },
    primary: {
      light: 'oklch(0.646 0.222 41.116)',
      dark: 'oklch(0.705 0.213 47.604)',
      foreground: {
        light: 'oklch(0.98 0.016 73.684)',
        dark: 'oklch(0.98 0.016 73.684)',
      },
    },
    accent: {
      light: 'oklch(0.967 0.001 286.375)',
      dark: 'oklch(0.274 0.006 286.033)',
      foreground: {
        light: 'oklch(0.21 0.006 285.885)',
        dark: 'oklch(0.985 0 0)',
      },
    },
    border: {
      light: 'oklch(0.92 0.004 286.32)',
      dark: 'oklch(1 0 0 / 10%)',
    },
    ring: {
      light: 'oklch(0.75 0.183 55.934)',
      dark: 'oklch(0.408 0.123 38.172)',
    },
  },
  
  // Chart Colors (same in light and dark)
  chart: {
    '1': 'oklch(0.837 0.128 66.29)',
    '2': 'oklch(0.705 0.213 47.604)',
    '3': 'oklch(0.646 0.222 41.116)',
    '4': 'oklch(0.553 0.195 38.402)',
    '5': 'oklch(0.47 0.157 37.304)',
  },

  // Marketing Brand Colors
  // These colors are used specifically for marketing pages
  marketing: {
    brand: {
      // Deep blue brand color (#142978)
      primary: 'oklch(0.29 0.12 274)',
      // Dark text/background (#1E1E1E)
      dark: 'oklch(0.18 0.002 286)',
      // Light gray background (#F5F5F5)
      light: 'oklch(0.97 0.001 286)',
      // Orange accent (#FF6A1F)
      accent: 'oklch(0.68 0.19 35)',
    },
  },
} as const

/**
 * CSS Variable Names
 * 
 * These correspond to the CSS custom properties defined in app/globals.css
 */
export const colorVariables = {
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  destructive: '--destructive',
  destructiveForeground: '--destructive-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  background: '--background',
  foreground: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  popover: '--popover',
  popoverForeground: '--popover-foreground',
  border: '--border',
  input: '--input',
  ring: '--ring',
  pageBackground: '--page-background',
  navBackground: '--nav-background',
  sidebar: '--sidebar',
  sidebarForeground: '--sidebar-foreground',
  sidebarPrimary: '--sidebar-primary',
  sidebarPrimaryForeground: '--sidebar-primary-foreground',
  sidebarAccent: '--sidebar-accent',
  sidebarAccentForeground: '--sidebar-accent-foreground',
  sidebarBorder: '--sidebar-border',
  sidebarRing: '--sidebar-ring',
  chart1: '--chart-1',
  chart2: '--chart-2',
  chart3: '--chart-3',
  chart4: '--chart-4',
  chart5: '--chart-5',
} as const

/**
 * Usage Examples:
 * 
 * // In Tailwind classes (recommended)
 * <div className="bg-primary text-primary-foreground">
 * 
 * // Direct CSS variable access
 * <div style={{ backgroundColor: 'var(--primary)' }}>
 * 
 * // Using token values programmatically
 * import { colors } from '@/design-system/tokens/colors'
 * const primaryColor = colors.primary.light
 */
