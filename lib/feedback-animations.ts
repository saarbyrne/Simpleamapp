/**
 * Feedback Animation Utilities
 *
 * Animations for success, error, warning, and info states.
 * These provide visual feedback for user actions and system states.
 *
 * Features:
 * - Success animations (checkmark, confetti, celebration)
 * - Error animations (shake, bounce, pulse)
 * - Warning animations (pulse, glow, attention)
 * - Info animations (fade, slide, gentle pulse)
 * - All respect prefers-reduced-motion
 * - Integrate with design system tokens
 */

import { motion } from '@/design-system/tokens/motion'

/**
 * Convert cubic-bezier to array for Framer Motion
 */
function cubicBezierToArray(bezier: string): number[] {
  const match = bezier.match(/cubic-bezier\(([\d.,\s]+)\)/)
  if (match) {
    return match[1].split(',').map((n) => parseFloat(n.trim()))
  }
  return [0, 0, 0.2, 1]
}

/**
 * Parse duration from string (e.g., "250ms" -> 0.25)
 */
function parseDuration(duration: string): number {
  return parseFloat(duration) / 1000
}

/**
 * Check if user prefers reduced motion
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ============================================================================
// SUCCESS ANIMATIONS
// ============================================================================

/**
 * Success Checkmark Animation
 * Animates a checkmark icon with scale and rotation
 */
export const successCheckmark = {
  initial: { scale: 0, rotate: -45, opacity: 0 },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      duration: parseDuration(motion.duration.moderate),
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: parseDuration(motion.duration.fast),
    },
  },
}

/**
 * Success Bounce
 * Playful bounce for success states
 */
export const successBounce = {
  initial: { scale: 0, y: -20 },
  animate: {
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
      duration: parseDuration(motion.duration.moderate),
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: parseDuration(motion.duration.fast),
    },
  },
}

/**
 * Success Pulse
 * Gentle pulsing glow for success states
 */
export const successPulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: parseDuration(motion.duration.slow),
      ease: 'easeInOut',
      repeat: 2,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Success Glow
 * Growing glow effect for success
 */
export const successGlow = {
  animate: {
    boxShadow: [
      '0 0 0px rgba(34, 197, 94, 0)',
      '0 0 20px rgba(34, 197, 94, 0.6)',
      '0 0 40px rgba(34, 197, 94, 0.4)',
      '0 0 20px rgba(34, 197, 94, 0.6)',
      '0 0 0px rgba(34, 197, 94, 0)',
    ],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      times: [0, 0.25, 0.5, 0.75, 1],
    },
  },
}

/**
 * Success Toast
 * Slide in from top or bottom for toast notifications
 */
export const successToast = {
  initial: { y: -100, opacity: 0, scale: 0.95 },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      duration: parseDuration(motion.duration.moderate),
    },
  },
  exit: {
    y: -100,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: parseDuration(motion.duration.fast),
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

/**
 * Confetti Particle
 * Individual confetti piece animation
 */
export const confettiParticle = (index: number) => ({
  initial: {
    y: 0,
    x: 0,
    rotate: 0,
    opacity: 1,
  },
  animate: {
    y: [0, -50, 100],
    x: [(index % 2 === 0 ? -1 : 1) * (20 + index * 10), (index % 2 === 0 ? 1 : -1) * (10 + index * 5), 0],
    rotate: [0, 180 + index * 30, 360 + index * 45],
    opacity: [1, 1, 0],
    transition: {
      duration: 1.5 + index * 0.1,
      ease: 'easeOut',
      times: [0, 0.4, 1],
    },
  },
})

// ============================================================================
// ERROR ANIMATIONS
// ============================================================================

/**
 * Error Shake
 * Horizontal shake for errors
 */
export const errorShake = {
  animate: {
    x: [-10, 10, -10, 10, -5, 5, 0],
    transition: {
      duration: parseDuration(motion.duration.moderate),
      ease: 'easeInOut',
      times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
    },
  },
}

/**
 * Error Bounce
 * Bouncy rejection animation
 */
export const errorBounce = {
  animate: {
    y: [0, -10, 0, -5, 0],
    transition: {
      duration: parseDuration(motion.duration.moderate),
      ease: 'easeOut',
      times: [0, 0.25, 0.5, 0.75, 1],
    },
  },
}

/**
 * Error Pulse
 * Pulsing for persistent errors
 */
export const errorPulse = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [1, 0.9, 1],
    transition: {
      duration: parseDuration(motion.duration.normal),
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Error X Mark
 * Animated X for errors
 */
export const errorXMark = {
  initial: { scale: 0, rotate: 90, opacity: 0 },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
      duration: parseDuration(motion.duration.moderate),
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: parseDuration(motion.duration.fast),
    },
  },
}

/**
 * Error Toast
 * Slide in from top for error notifications
 */
export const errorToast = {
  initial: { y: -100, opacity: 0, scale: 0.95 },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    y: -100,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: parseDuration(motion.duration.fast),
    },
  },
}

// ============================================================================
// WARNING ANIMATIONS
// ============================================================================

/**
 * Warning Pulse
 * Gentle pulsing for warnings
 */
export const warningPulse = {
  animate: {
    scale: [1, 1.03, 1],
    opacity: [1, 0.85, 1],
    transition: {
      duration: parseDuration(motion.duration.slow),
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Warning Glow
 * Pulsing glow effect
 */
export const warningGlow = {
  animate: {
    boxShadow: [
      '0 0 0px rgba(234, 179, 8, 0)',
      '0 0 20px rgba(234, 179, 8, 0.6)',
      '0 0 0px rgba(234, 179, 8, 0)',
    ],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Warning Bounce
 * Attention-grabbing bounce
 */
export const warningBounce = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: parseDuration(motion.duration.normal),
      ease: 'easeOut',
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
}

/**
 * Warning Icon
 * Animated warning triangle/icon
 */
export const warningIcon = {
  initial: { scale: 0, rotate: -180, opacity: 0 },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 20,
      duration: parseDuration(motion.duration.moderate),
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: parseDuration(motion.duration.fast),
    },
  },
}

/**
 * Warning Toast
 * Slide in for warning notifications
 */
export const warningToast = {
  initial: { y: -100, opacity: 0, scale: 0.95 },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    y: -100,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: parseDuration(motion.duration.fast),
    },
  },
}

// ============================================================================
// INFO ANIMATIONS
// ============================================================================

/**
 * Info Fade
 * Simple fade in for info messages
 */
export const infoFade = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.normal),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: parseDuration(motion.duration.fast),
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

/**
 * Info Slide
 * Slide in from left for info messages
 */
export const infoSlide = {
  initial: { x: -20, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.normal),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    x: -20,
    opacity: 0,
    transition: {
      duration: parseDuration(motion.duration.fast),
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

/**
 * Info Pulse
 * Subtle pulsing for persistent info
 */
export const infoPulse = {
  animate: {
    opacity: [1, 0.7, 1],
    transition: {
      duration: parseDuration(motion.duration.slower),
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Info Icon
 * Animated info icon (i or circle)
 */
export const infoIcon = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      duration: parseDuration(motion.duration.normal),
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: parseDuration(motion.duration.fast),
    },
  },
}

/**
 * Info Toast
 * Slide in for info notifications
 */
export const infoToast = {
  initial: { x: 100, opacity: 0, scale: 0.95 },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    x: 100,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: parseDuration(motion.duration.fast),
    },
  },
}

// ============================================================================
// FORM FEEDBACK ANIMATIONS
// ============================================================================

/**
 * Input Error
 * Animation for invalid input fields
 */
export const inputError = {
  animate: {
    x: [-5, 5, -5, 5, 0],
    transition: {
      duration: parseDuration(motion.duration.fast),
      ease: 'easeInOut',
    },
  },
}

/**
 * Input Success
 * Animation for valid input fields
 */
export const inputSuccess = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 20,
    },
  },
}

/**
 * Field Highlight
 * Highlight animation for focusing on specific fields
 */
export const fieldHighlight = {
  animate: {
    boxShadow: [
      '0 0 0px rgba(59, 130, 246, 0)',
      '0 0 0px rgba(59, 130, 246, 0.5)',
      '0 0 8px rgba(59, 130, 246, 0.5)',
      '0 0 0px rgba(59, 130, 246, 0)',
    ],
    transition: {
      duration: 1.2,
      ease: 'easeInOut',
      times: [0, 0.3, 0.6, 1],
    },
  },
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get safe variant that respects reduced motion
 */
export function getSafeFeedbackVariant(
  variant: any,
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
) {
  if (shouldReduceMotion()) {
    // Return minimal animation for reduced motion
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.15 } },
      exit: { opacity: 0, transition: { duration: 0.15 } },
    }
  }
  return variant
}

/**
 * Toast Presets
 * Ready-to-use toast configurations
 */
export const toastPresets = {
  success: successToast,
  error: errorToast,
  warning: warningToast,
  info: infoToast,
}

/**
 * Icon Presets
 * Ready-to-use icon animations
 */
export const iconPresets = {
  success: successCheckmark,
  error: errorXMark,
  warning: warningIcon,
  info: infoIcon,
}

/**
 * Pulse Presets
 * Ready-to-use pulse animations
 */
export const pulsePresets = {
  success: successPulse,
  error: errorPulse,
  warning: warningPulse,
  info: infoPulse,
}
