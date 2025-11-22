/**
 * Animation Utilities Module
 *
 * Centralized exports for all animation-related utilities.
 * Import from '@/lib/animations' for convenience.
 *
 * @example
 * ```typescript
 * import { fadeIn, slideIn } from '@/lib/animations';
 * import { shimmer, spinner } from '@/lib/animations';
 * import { feedbackSuccess } from '@/lib/animations';
 * ```
 */

// Core animation variants and utilities
export * from './animations';

// Animation utility functions and helpers
export * from './animation-utils';
// Re-export prefersReducedMotion as shouldReduceMotion for backwards compatibility
export { prefersReducedMotion as shouldReduceMotion } from './animation-utils';

// Feedback animations (success, error, etc.)
export * from './feedback-animations';

// Loading state animations
export * from './loading-animations';

// Page transition animations
export * from './page-transitions';
