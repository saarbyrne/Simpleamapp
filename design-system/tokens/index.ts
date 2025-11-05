/**
 * Design System Token Index
 *
 * Central export point for all design tokens.
 * This file:
 * 1. Re-exports all token systems for easy import
 * 2. Provides unified token object
 * 3. Generates CSS variables from tokens
 * 4. Provides utilities for working with tokens
 *
 * Usage in components:
 * ```typescript
 * import { tokens } from '@/design-system/tokens'
 *
 * // Access tokens
 * const primaryColor = tokens.colors.interactive.primary
 * const spacing = tokens.spacing.lg
 * const shadow = tokens.elevation.component.modal
 * ```
 */

// Token system namespace exports to avoid name collisions
export * as colorTokens from './colors';
export * as typographyTokens from './typography';
export * as spacingSystem from './spacing';
export * as zIndexTokens from './z-index';
export * as elevationTokens from './elevation';
export * as radiusTokens from './radius';
export * as motionTokens from './motion';
export * as iconSystem from './icons';

// Individual token imports for unified object
import { colors, primitives, surface, text, border, interactive, feedback, focus, darkMode } from './colors';
import { typography } from './typography';
import { spacingTokens } from './spacing';
import { zIndex } from './z-index';
import { elevation } from './elevation';
import { borderRadius } from './radius';
import { motion } from './motion';
import { iconTokens } from './icons';

/**
 * Unified Token Object
 * Single source of truth for all design tokens
 */
export const tokens = {
  colors,
  primitives,
  surface,
  text,
  border,
  interactive,
  feedback,
  focus,
  typography,
  spacing: spacingTokens,
  zIndex,
  elevation,
  radius: borderRadius,
  motion,
  icons: iconTokens,
} as const;

export type Tokens = typeof tokens;

/**
 * CSS Variable Generation
 * Converts design tokens into CSS custom properties
 * These variables can be used in stylesheets and Tailwind config
 */

/**
 * Generate CSS variables for colors
 */
export function generateColorVariables(): Record<string, string> {
  return {
    // Surface colors
    '--ds-surface-base': surface.base,
    '--ds-surface-elevated': surface.elevated,
    '--ds-surface-elevated-hover': surface.elevatedHover,
    '--ds-surface-sunken': surface.sunken,
    '--ds-surface-overlay': surface.overlay,
    '--ds-surface-overlay-light': surface.overlayLight,
    '--ds-surface-sidebar': surface.sidebar,
    '--ds-surface-sidebar-hover': surface.sidebarHover,
    '--ds-surface-sidebar-active': surface.sidebarActive,

    // Text colors
    '--ds-text-primary': text.primary,
    '--ds-text-secondary': text.secondary,
    '--ds-text-tertiary': text.tertiary,
    '--ds-text-disabled': text.disabled,
    '--ds-text-inverse': text.inverse,
    '--ds-text-link': text.link,
    '--ds-text-link-hover': text.linkHover,
    '--ds-text-link-visited': text.linkVisited,
    '--ds-text-placeholder': text.placeholder,

    // Border colors
    '--ds-border-default': border.default,
    '--ds-border-hover': border.hover,
    '--ds-border-focus': border.focus,
    '--ds-border-strong': border.strong,
    '--ds-border-subtle': border.subtle,

    // Interactive colors
    '--ds-interactive-primary': interactive.primary,
    '--ds-interactive-primary-hover': interactive.primaryHover,
    '--ds-interactive-primary-active': interactive.primaryActive,
    '--ds-interactive-primary-disabled': interactive.primaryDisabled,
    '--ds-interactive-secondary': interactive.secondary,
    '--ds-interactive-secondary-hover': interactive.secondaryHover,
    '--ds-interactive-secondary-active': interactive.secondaryActive,
    '--ds-interactive-destructive': interactive.destructive,
    '--ds-interactive-destructive-hover': interactive.destructiveHover,
    '--ds-interactive-ghost': interactive.ghost,
    '--ds-interactive-ghost-hover': interactive.ghostHover,

    // Feedback colors
    '--ds-feedback-success': feedback.success,
    '--ds-feedback-success-light': feedback.successLight,
    '--ds-feedback-success-border': feedback.successBorder,
    '--ds-feedback-error': feedback.error,
    '--ds-feedback-error-light': feedback.errorLight,
    '--ds-feedback-error-border': feedback.errorBorder,
    '--ds-feedback-warning': feedback.warning,
    '--ds-feedback-warning-light': feedback.warningLight,
    '--ds-feedback-warning-border': feedback.warningBorder,
    '--ds-feedback-info': feedback.info,
    '--ds-feedback-info-light': feedback.infoLight,
    '--ds-feedback-info-border': feedback.infoBorder,

    // Focus colors
    '--ds-focus-ring': focus.ring,
    '--ds-focus-ring-offset': focus.ringOffset,
  };
}

/**
 * Generate CSS variables for spacing
 */
export function generateSpacingVariables(): Record<string, string> {
  const { spacing } = spacingTokens;
  const vars: Record<string, string> = {};

  Object.entries(spacing).forEach(([key, value]) => {
    vars[`--ds-spacing-${key}`] = value;
  });

  return vars;
}

/**
 * Generate CSS variables for typography
 */
export function generateTypographyVariables(): Record<string, string> {
  return {
    // Font families
    '--ds-font-sans': typography.fontFamily.sans,
    '--ds-font-mono': typography.fontFamily.mono,
    '--ds-font-display': typography.fontFamily.display,

    // Font sizes
    '--ds-text-xs': typography.fontSize.xs,
    '--ds-text-sm': typography.fontSize.sm,
    '--ds-text-base': typography.fontSize.base,
    '--ds-text-md': typography.fontSize.md,
    '--ds-text-lg': typography.fontSize.lg,
    '--ds-text-xl': typography.fontSize.xl,
    '--ds-text-2xl': typography.fontSize['2xl'],
    '--ds-text-3xl': typography.fontSize['3xl'],
    '--ds-text-4xl': typography.fontSize['4xl'],
    '--ds-text-5xl': typography.fontSize['5xl'],
    '--ds-text-6xl': typography.fontSize['6xl'],
    '--ds-text-7xl': typography.fontSize['7xl'],

    // Line heights
    '--ds-leading-none': typography.lineHeight.none,
    '--ds-leading-tight': typography.lineHeight.tight,
    '--ds-leading-snug': typography.lineHeight.snug,
    '--ds-leading-normal': typography.lineHeight.normal,
    '--ds-leading-relaxed': typography.lineHeight.relaxed,
    '--ds-leading-loose': typography.lineHeight.loose,

    // Font weights
    '--ds-font-light': typography.fontWeight.light,
    '--ds-font-normal': typography.fontWeight.normal,
    '--ds-font-medium': typography.fontWeight.medium,
    '--ds-font-semibold': typography.fontWeight.semibold,
    '--ds-font-bold': typography.fontWeight.bold,
  };
}

/**
 * Generate CSS variables for elevation (shadows)
 */
export function generateElevationVariables(): Record<string, string> {
  const { shadow } = elevation;
  const vars: Record<string, string> = {};

  Object.entries(shadow).forEach(([key, value]) => {
    vars[`--ds-shadow-${key}`] = value;
  });

  return vars;
}

/**
 * Generate CSS variables for border radius
 */
export function generateRadiusVariables(): Record<string, string> {
  const { radius } = borderRadius;
  const vars: Record<string, string> = {};

  Object.entries(radius).forEach(([key, value]) => {
    vars[`--ds-radius-${key}`] = value;
  });

  return vars;
}

/**
 * Generate CSS variables for motion (duration and easing)
 */
export function generateMotionVariables(): Record<string, string> {
  return {
    // Durations
    '--ds-duration-instant': motion.duration.instant,
    '--ds-duration-fastest': motion.duration.fastest,
    '--ds-duration-fast': motion.duration.fast,
    '--ds-duration-normal': motion.duration.normal,
    '--ds-duration-moderate': motion.duration.moderate,
    '--ds-duration-slow': motion.duration.slow,
    '--ds-duration-slower': motion.duration.slower,
    '--ds-duration-slowest': motion.duration.slowest,

    // Easing
    '--ds-ease-linear': motion.easing.linear,
    '--ds-ease-in': motion.easing.easeIn,
    '--ds-ease-out': motion.easing.easeOut,
    '--ds-ease-in-out': motion.easing.easeInOut,
    '--ds-ease-standard': motion.easing.standard,
  };
}

/**
 * Generate all CSS variables
 * Combines all token systems into a single CSS variable object
 */
export function generateAllCSSVariables(): Record<string, string> {
  return {
    ...generateColorVariables(),
    ...generateSpacingVariables(),
    ...generateTypographyVariables(),
    ...generateElevationVariables(),
    ...generateRadiusVariables(),
    ...generateMotionVariables(),
  };
}

/**
 * Generate CSS string for :root selector
 * Can be injected into a style tag or CSS file
 */
export function generateCSSString(): string {
  const variables = generateAllCSSVariables();
  const entries = Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `:root {\n${entries}\n}`;
}

/**
 * Generate CSS variables for dark mode
 * Uses dark mode color tokens for theme switching
 */
export function generateDarkModeColorVariables(): Record<string, string> {
  return {
    // Surface colors - dark mode
    '--ds-surface-base': darkMode.surface.base,
    '--ds-surface-elevated': darkMode.surface.elevated,
    '--ds-surface-elevated-hover': darkMode.surface.elevatedHover,
    '--ds-surface-sunken': darkMode.surface.sunken,
    '--ds-surface-overlay': darkMode.surface.overlay,
    '--ds-surface-overlay-light': darkMode.surface.overlayLight,
    '--ds-surface-sidebar': darkMode.surface.sidebar,
    '--ds-surface-sidebar-hover': darkMode.surface.sidebarHover,
    '--ds-surface-sidebar-active': darkMode.surface.sidebarActive,

    // Text colors - dark mode
    '--ds-text-primary': darkMode.text.primary,
    '--ds-text-secondary': darkMode.text.secondary,
    '--ds-text-tertiary': darkMode.text.tertiary,
    '--ds-text-disabled': darkMode.text.disabled,
    '--ds-text-inverse': darkMode.text.inverse,
    '--ds-text-link': darkMode.text.link,
    '--ds-text-link-hover': darkMode.text.linkHover,
    '--ds-text-link-visited': darkMode.text.linkVisited,
    '--ds-text-placeholder': darkMode.text.placeholder,

    // Border colors - dark mode
    '--ds-border-default': darkMode.border.default,
    '--ds-border-hover': darkMode.border.hover,
    '--ds-border-focus': darkMode.border.focus,
    '--ds-border-strong': darkMode.border.strong,
    '--ds-border-subtle': darkMode.border.subtle,

    // Interactive colors - dark mode
    '--ds-interactive-primary': darkMode.interactive.primary,
    '--ds-interactive-primary-hover': darkMode.interactive.primaryHover,
    '--ds-interactive-primary-active': darkMode.interactive.primaryActive,
    '--ds-interactive-primary-disabled': darkMode.interactive.primaryDisabled,
    '--ds-interactive-secondary': darkMode.interactive.secondary,
    '--ds-interactive-secondary-hover': darkMode.interactive.secondaryHover,
    '--ds-interactive-secondary-active': darkMode.interactive.secondaryActive,
    '--ds-interactive-destructive': darkMode.interactive.destructive,
    '--ds-interactive-destructive-hover': darkMode.interactive.destructiveHover,
    '--ds-interactive-ghost': darkMode.interactive.ghost,
    '--ds-interactive-ghost-hover': darkMode.interactive.ghostHover,

    // Feedback colors - dark mode
    '--ds-feedback-success': darkMode.feedback.success,
    '--ds-feedback-success-light': darkMode.feedback.successLight,
    '--ds-feedback-success-border': darkMode.feedback.successBorder,
    '--ds-feedback-error': darkMode.feedback.error,
    '--ds-feedback-error-light': darkMode.feedback.errorLight,
    '--ds-feedback-error-border': darkMode.feedback.errorBorder,
    '--ds-feedback-warning': darkMode.feedback.warning,
    '--ds-feedback-warning-light': darkMode.feedback.warningLight,
    '--ds-feedback-warning-border': darkMode.feedback.warningBorder,
    '--ds-feedback-info': darkMode.feedback.info,
    '--ds-feedback-info-light': darkMode.feedback.infoLight,
    '--ds-feedback-info-border': darkMode.feedback.infoBorder,

    // Focus colors - dark mode
    '--ds-focus-ring': darkMode.focus.ring,
    '--ds-focus-ring-offset': darkMode.focus.ringOffset,
  };
}

/**
 * Generate CSS string for dark mode
 * Uses dark mode color tokens for theme switching
 */
export function generateDarkModeCSSString(): string {
  const variables = generateDarkModeColorVariables();
  const entries = Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `.dark {\n${entries}\n}`;
}

/**
 * Utility: Get token by path
 * Allows dynamic access to nested token values
 *
 * Example:
 * getToken('colors.surface.elevated') => '#ffffff'
 * getToken('spacing.lg') => '1rem'
 */
export function getToken(path: string): string | number | undefined {
  const parts = path.split('.');
  let current: any = tokens;

  for (const part of parts) {
    if (current[part] === undefined) {
      console.warn(`Token not found: ${path}`);
      return undefined;
    }
    current = current[part];
  }

  return current;
}

/**
 * Utility: Check if token exists
 */
export function hasToken(path: string): boolean {
  return getToken(path) !== undefined;
}

/**
 * Export CSS variable generator for use in app
 */
export const cssVariables = generateAllCSSVariables();

/**
 * Export CSS string for injection
 */
export const cssString = generateCSSString();

/**
 * Token Documentation Export
 * Structured data for documentation generation
 */
export const tokenDocumentation = {
  version: '1.0.0',
  categories: [
    {
      name: 'Colors',
      description: 'Color palette with primitive and semantic tokens',
      tokens: Object.keys(colors),
    },
    {
      name: 'Typography',
      description: 'Font families, sizes, weights, and text styles',
      tokens: Object.keys(typography),
    },
    {
      name: 'Spacing',
      description: 'Spacing scale and semantic spacing values',
      tokens: Object.keys(spacingTokens),
    },
    {
      name: 'Z-Index',
      description: 'Layering system for stacking elements',
      tokens: Object.keys(zIndex),
    },
    {
      name: 'Elevation',
      description: 'Shadow system for creating depth',
      tokens: Object.keys(elevation),
    },
    {
      name: 'Border Radius',
      description: 'Corner rounding scale',
      tokens: Object.keys(borderRadius),
    },
    {
      name: 'Motion',
      description: 'Animation and transition timing',
      tokens: Object.keys(motion),
    },
  ],
} as const;

/**
 * Type-safe token getter with autocomplete
 * Provides full TypeScript support for token access
 */
export function useToken<K extends keyof typeof tokens>(category: K): (typeof tokens)[K] {
  return tokens[category];
}

/**
 * Default Export
 * Exports unified token object as default
 */
export default tokens;
