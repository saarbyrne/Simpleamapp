/**
 * Framer Motion Animation Utilities
 *
 * Pre-built animation variants using our design token motion system.
 * These variants work seamlessly with Framer Motion's animation prop.
 *
 * Usage:
 * import { fadeIn, slideIn } from '@/lib/animations'
 * <motion.div variants={fadeIn} initial="hidden" animate="visible" />
 */

import { motion } from '@/design-system/tokens/motion'

/**
 * Fade Animations
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.normal) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

export const fadeOut = {
  visible: { opacity: 1 },
  hidden: {
    opacity: 0,
    transition: {
      duration: parseFloat(motion.duration.normal) / 1000,
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

export const fadeInFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.fast) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

/**
 * Slide Animations
 */
export const slideInFromRight = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

export const slideInFromLeft = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

export const slideInFromTop = {
  hidden: { y: '-100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

export const slideInFromBottom = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

export const slideUpSmall = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.normal) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

export const slideDownSmall = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.normal) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

/**
 * Scale Animations
 */
export const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.normal) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

export const scaleOut = {
  visible: { scale: 1, opacity: 1 },
  hidden: {
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: parseFloat(motion.duration.normal) / 1000,
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

export const zoomIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

export const zoomOut = {
  visible: { scale: 1, opacity: 1 },
  hidden: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

/**
 * Pop Animation (subtle scale with bounce)
 */
export const pop = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
      duration: parseFloat(motion.duration.moderate) / 1000,
    },
  },
}

/**
 * Container Animations (for stagger children)
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
}

export const staggerItem = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.normal) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

/**
 * Modal/Dialog Animations
 */
export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.fast) / 1000,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: parseFloat(motion.duration.fast) / 1000,
    },
  },
}

export const modalContent = {
  hidden: { scale: 0.95, opacity: 0, y: 20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: 20,
    transition: {
      duration: parseFloat(motion.duration.fast) / 1000,
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

/**
 * Drawer Animations
 */
export const drawerRight = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

export const drawerLeft = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    x: '-100%',
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

export const drawerTop = {
  hidden: { y: '-100%' },
  visible: {
    y: 0,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    y: '-100%',
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

export const drawerBottom = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    y: '100%',
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

/**
 * Tooltip/Popover Animations
 */
export const tooltip = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: parseFloat(motion.duration.fast) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: parseFloat(motion.duration.fast) / 1000,
    },
  },
}

/**
 * Dropdown Animations
 */
export const dropdown = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: parseFloat(motion.duration.fast) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: parseFloat(motion.duration.fast) / 1000,
    },
  },
}

/**
 * Notification/Toast Animations
 */
export const toastRight = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: parseFloat(motion.duration.fast) / 1000,
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

export const toastTop = {
  hidden: { y: '-100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    y: '-100%',
    opacity: 0,
    transition: {
      duration: parseFloat(motion.duration.fast) / 1000,
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

export const toastBottom = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: parseFloat(motion.duration.moderate) / 1000,
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: parseFloat(motion.duration.fast) / 1000,
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

/**
 * Shake Animation (for errors)
 */
export const shake = {
  shake: {
    x: [-4, 4, -4, 4, -4, 4, 0],
    transition: {
      duration: parseFloat(motion.duration.slow) / 1000,
      ease: 'linear',
    },
  },
}

/**
 * Utility Functions
 */

/**
 * Convert CSS cubic-bezier to Framer Motion array format
 */
function cubicBezierToArray(bezier: string): number[] {
  const match = bezier.match(/cubic-bezier\(([\d.,\s]+)\)/)
  if (match) {
    return match[1].split(',').map((n) => parseFloat(n.trim()))
  }
  // Fallback to easeOut
  return [0, 0, 0.2, 1]
}

/**
 * Get transition config from motion tokens
 */
export function getTransitionConfig(speed: 'fast' | 'normal' | 'moderate' | 'slow' = 'normal') {
  return {
    duration: parseFloat(motion.duration[speed]) / 1000,
    ease: cubicBezierToArray(motion.easing.easeOut),
  }
}

/**
 * Respects prefers-reduced-motion
 * Usage: shouldReduceMotion() ? { duration: 0 } : normalTransition
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get safe animation variant (respects reduced motion)
 * Returns instant fade if user prefers reduced motion
 */
export function getSafeVariant(variant: any) {
  if (shouldReduceMotion()) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0 } },
    }
  }
  return variant
}
