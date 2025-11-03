/**
 * Motion Token System
 *
 * Provides consistent animation and transition values across all components.
 * Motion adds life to the interface and provides important feedback about:
 * - State changes
 * - User interactions
 * - System processes
 * - Spatial relationships
 *
 * Our system is based on:
 * - Natural motion curves (easing functions)
 * - Appropriate duration for element size/distance
 * - Accessibility considerations (respects prefers-reduced-motion)
 * - Performance optimization (transform and opacity preferred)
 */

/**
 * Duration Scale
 * Time values for animations and transitions
 * Based on perceptual speed (feels right to humans)
 */
export const duration = {
  // 0ms - Instant (no animation)
  instant: '0ms',

  // 75ms - Very fast (micro-interactions, property changes)
  fastest: '75ms',

  // 150ms - Fast (hover states, focus rings, small movements)
  fast: '150ms',

  // 250ms - Normal (default for most transitions)
  normal: '250ms',

  // 350ms - Moderate (larger elements, slides)
  moderate: '350ms',

  // 500ms - Slow (modals, drawers, page transitions)
  slow: '500ms',

  // 700ms - Slower (large modals, complex animations)
  slower: '700ms',

  // 1000ms - Slowest (full-screen transitions, loaders)
  slowest: '1000ms',
} as const;

/**
 * Easing Functions
 * Timing functions that control animation acceleration
 * Based on natural motion and Material Design principles
 */
export const easing = {
  // Linear - Constant speed (rarely used, feels robotic)
  linear: 'linear',

  // Ease - Browser default (acceptable but generic)
  ease: 'ease',

  // Ease In - Starts slow, ends fast (elements exiting view)
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',

  // Ease Out - Starts fast, ends slow (elements entering view) - MOST COMMON
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',

  // Ease In Out - Slow start and end, fast middle (modals, large transitions)
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Sharp - Quick and decisive (dropdowns, tooltips)
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',

  // Standard - Natural feeling (Material Design standard)
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Decelerate - Emphasizes ending (emphasized ease out)
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',

  // Accelerate - Emphasizes start (emphasized ease in)
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',

  // Bounce - Playful spring effect (use sparingly)
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

  // Elastic - Exaggerated spring (very playful, use rarely)
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.8)',

  // Spring - Natural spring physics
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

/**
 * Transition Presets
 * Complete transition strings for common use cases
 */
export const transition = {
  // Color transitions (text, backgrounds, borders)
  colors: `color ${duration.fast} ${easing.easeOut}, background-color ${duration.fast} ${easing.easeOut}, border-color ${duration.fast} ${easing.easeOut}`,

  // Opacity transitions
  opacity: `opacity ${duration.fast} ${easing.easeOut}`,

  // Transform transitions (position, scale, rotate)
  transform: `transform ${duration.normal} ${easing.easeOut}`,

  // Shadow transitions (elevation changes)
  shadow: `box-shadow ${duration.normal} ${easing.easeOut}`,

  // All properties (use sparingly, can be performance-heavy)
  all: `all ${duration.normal} ${easing.easeOut}`,

  // Fast all (for quick feedback)
  allFast: `all ${duration.fast} ${easing.easeOut}`,

  // Slow all (for dramatic effects)
  allSlow: `all ${duration.slow} ${easing.easeInOut}`,

  // Button transition (colors + shadow)
  button: `color ${duration.fast} ${easing.easeOut}, background-color ${duration.fast} ${easing.easeOut}, border-color ${duration.fast} ${easing.easeOut}, box-shadow ${duration.fast} ${easing.easeOut}`,

  // Input transition (border + shadow for focus)
  input: `border-color ${duration.fast} ${easing.easeOut}, box-shadow ${duration.fast} ${easing.easeOut}`,

  // Card transition (shadow + transform on hover)
  card: `box-shadow ${duration.normal} ${easing.easeOut}, transform ${duration.normal} ${easing.easeOut}`,

  // Modal transition (all properties for entrance)
  modal: `all ${duration.moderate} ${easing.easeOut}`,

  // Dropdown transition (opacity + transform)
  dropdown: `opacity ${duration.fast} ${easing.easeOut}, transform ${duration.fast} ${easing.easeOut}`,

  // Slide transition (transform only)
  slide: `transform ${duration.normal} ${easing.easeOut}`,

  // Fade transition (opacity only)
  fade: `opacity ${duration.normal} ${easing.easeOut}`,

  // Scale transition (transform scale)
  scale: `transform ${duration.normal} ${easing.easeOut}`,

  // Rotate transition (transform rotate)
  rotate: `transform ${duration.normal} ${easing.easeOut}`,
} as const;

/**
 * Animation Presets
 * Keyframe-based animations for complex motion
 */
export const animation = {
  // Fade in
  fadeIn: {
    keyframes: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    duration: duration.normal,
    easing: easing.easeOut,
  },

  // Fade out
  fadeOut: {
    keyframes: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },
    duration: duration.normal,
    easing: easing.easeIn,
  },

  // Slide in from right
  slideInRight: {
    keyframes: {
      '0%': { transform: 'translateX(100%)' },
      '100%': { transform: 'translateX(0)' },
    },
    duration: duration.moderate,
    easing: easing.easeOut,
  },

  // Slide in from left
  slideInLeft: {
    keyframes: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(0)' },
    },
    duration: duration.moderate,
    easing: easing.easeOut,
  },

  // Slide in from top
  slideInTop: {
    keyframes: {
      '0%': { transform: 'translateY(-100%)' },
      '100%': { transform: 'translateY(0)' },
    },
    duration: duration.moderate,
    easing: easing.easeOut,
  },

  // Slide in from bottom
  slideInBottom: {
    keyframes: {
      '0%': { transform: 'translateY(100%)' },
      '100%': { transform: 'translateY(0)' },
    },
    duration: duration.moderate,
    easing: easing.easeOut,
  },

  // Scale in
  scaleIn: {
    keyframes: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    duration: duration.normal,
    easing: easing.easeOut,
  },

  // Scale out
  scaleOut: {
    keyframes: {
      '0%': { transform: 'scale(1)', opacity: '1' },
      '100%': { transform: 'scale(0.95)', opacity: '0' },
    },
    duration: duration.normal,
    easing: easing.easeIn,
  },

  // Zoom in
  zoomIn: {
    keyframes: {
      '0%': { transform: 'scale(0)', opacity: '0' },
      '50%': { opacity: '1' },
      '100%': { transform: 'scale(1)' },
    },
    duration: duration.moderate,
    easing: easing.easeOut,
  },

  // Spin (loading indicator)
  spin: {
    keyframes: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    duration: duration.slowest,
    easing: easing.linear,
    iterationCount: 'infinite',
  },

  // Pulse (attention grabber)
  pulse: {
    keyframes: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
    duration: duration.slower,
    easing: easing.easeInOut,
    iterationCount: 'infinite',
  },

  // Bounce (playful emphasis)
  bounce: {
    keyframes: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-25%)' },
    },
    duration: duration.slowest,
    easing: easing.bounce,
  },

  // Shake (error indication)
  shake: {
    keyframes: {
      '0%, 100%': { transform: 'translateX(0)' },
      '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
      '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
    },
    duration: duration.slow,
    easing: easing.linear,
  },

  // Ping (notification indicator)
  ping: {
    keyframes: {
      '0%': { transform: 'scale(1)', opacity: '1' },
      '75%, 100%': { transform: 'scale(2)', opacity: '0' },
    },
    duration: duration.slowest,
    easing: easing.easeOut,
    iterationCount: 'infinite',
  },
} as const;

/**
 * Component-Specific Motion
 * Pre-assigned motion values for specific components
 */
export const component = {
  // Button
  button: {
    transition: transition.button,
    duration: duration.fast,
    easing: easing.easeOut,
  },

  // Input
  input: {
    transition: transition.input,
    duration: duration.fast,
    easing: easing.easeOut,
  },

  // Card
  card: {
    transition: transition.card,
    duration: duration.normal,
    easing: easing.easeOut,
  },

  // Modal
  modal: {
    enter: animation.scaleIn,
    exit: animation.scaleOut,
    backdrop: animation.fadeIn,
  },

  // Drawer
  drawer: {
    enter: animation.slideInRight,
    exit: animation.slideInRight, // Reversed
    backdrop: animation.fadeIn,
  },

  // Dropdown
  dropdown: {
    enter: animation.scaleIn,
    exit: animation.scaleOut,
    duration: duration.fast,
  },

  // Tooltip
  tooltip: {
    enter: animation.fadeIn,
    exit: animation.fadeOut,
    duration: duration.fast,
  },

  // Toast
  toast: {
    enter: animation.slideInBottom,
    exit: animation.fadeOut,
    duration: duration.moderate,
  },

  // Sheet
  sheet: {
    enter: animation.slideInBottom,
    exit: animation.slideInBottom, // Reversed
    backdrop: animation.fadeIn,
  },

  // Accordion
  accordion: {
    transition: transition.all,
    duration: duration.normal,
    easing: easing.easeInOut,
  },

  // Tab
  tab: {
    transition: transition.colors,
    duration: duration.fast,
    easing: easing.easeOut,
  },

  // Loading
  loading: {
    animation: animation.spin,
  },

  // Skeleton
  skeleton: {
    animation: animation.pulse,
  },
} as const;

/**
 * Reduced Motion Support
 * Respect user preference for reduced motion
 */
export const reducedMotion = {
  // Disable animations
  disableAnimations: '@media (prefers-reduced-motion: reduce)',

  // Safe transition (only opacity, no movement)
  safeTransition: `opacity ${duration.fast} ${easing.linear}`,

  // Instant transition (no animation)
  instant: `all ${duration.instant}`,
} as const;

/**
 * Type Exports for TypeScript
 */
export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
export type Transition = keyof typeof transition;
export type Animation = keyof typeof animation;
export type ComponentMotion = keyof typeof component;

/**
 * Unified Motion Token Export
 */
export const motion = {
  duration,
  easing,
  transition,
  animation,
  component,
  reducedMotion,
} as const;

export type MotionTokens = typeof motion;

/**
 * Helper function to create custom transition
 */
export function createTransition(
  properties: string[],
  duration: string,
  easing: string
): string {
  return properties
    .map((prop) => `${prop} ${duration} ${easing}`)
    .join(', ');
}

/**
 * Motion Usage Guidelines
 *
 * 1. MICRO-INTERACTIONS (duration.fastest, duration.fast):
 *    - Button hover states
 *    - Input focus rings
 *    - Color changes
 *    - Border changes
 *    - Small property updates
 *
 * 2. STANDARD INTERACTIONS (duration.normal):
 *    - Card hover effects
 *    - Dropdown opening
 *    - Tooltip appearance
 *    - Tab switching
 *    - Most component transitions
 *
 * 3. MAJOR TRANSITIONS (duration.moderate, duration.slow):
 *    - Modal entrance/exit
 *    - Drawer slide in/out
 *    - Sheet appearance
 *    - Page transitions
 *    - Large component animations
 *
 * 4. LOADERS AND INDICATORS (duration.slowest):
 *    - Spinning loaders
 *    - Progress indicators
 *    - Pulsing elements
 *    - Infinite animations
 *
 * EASING SELECTION:
 *
 * - **Entering elements:** Use easeOut (starts fast, decelerates)
 *   Elements appear quickly then gently settle into place
 *
 * - **Exiting elements:** Use easeIn (starts slow, accelerates)
 *   Elements slowly start moving then quickly exit
 *
 * - **Bi-directional:** Use easeInOut (slow start and end)
 *   Elements that move back and forth or have complex paths
 *
 * - **Attention/Emphasis:** Use bounce or spring (playful)
 *   Use sparingly for delight or important notifications
 *
 * PERFORMANCE CONSIDERATIONS:
 *
 * 1. **Prefer transform and opacity** - GPU accelerated, smooth
 * 2. **Avoid animating:** width, height, top, left - causes reflow
 * 3. **Use will-change** for complex animations (but remove after)
 * 4. **Keep animations under 500ms** for most interactions
 * 5. **Test on lower-end devices** - reduce motion if laggy
 *
 * ACCESSIBILITY:
 *
 * 1. **Always respect prefers-reduced-motion**
 * 2. **Provide instant alternatives** for users who need them
 * 3. **Avoid flashing** animations (accessibility/seizure risk)
 * 4. **Don't rely solely on motion** to convey information
 * 5. **Keep essential animations brief** (under 300ms)
 *
 * IMPORTANT RULES:
 *
 * 1. NEVER use arbitrary animation values in components
 * 2. ALWAYS import from this token system
 * 3. ALWAYS add @media (prefers-reduced-motion: reduce) support
 * 4. Use easeOut for entering, easeIn for exiting
 * 5. Keep most animations under 500ms
 * 6. Prefer transform and opacity for performance
 * 7. Test animations on slower devices
 */
