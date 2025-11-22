/**
 * Loading State Animations
 *
 * Pre-built animations for loading states, spinners, progress indicators,
 * and skeleton screens. All animations respect design tokens and reduced motion.
 *
 * Usage:
 * import { shimmer, spinner, progressBar } from '@/lib/loading-animations'
 * <motion.div animate={shimmer} />
 */

import { motion } from '@/design-system/tokens/motion'

/**
 * Parse duration from string (e.g., "250ms" -> 0.25)
 */
function parseDuration(duration: string): number {
  return parseFloat(duration) / 1000
}

/**
 * Shimmer Effect
 * Elegant loading animation for skeleton screens
 */
export const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Pulse Animation
 * Subtle breathing effect for loading states
 */
export const pulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: parseDuration(motion.duration.slower),
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Pulse Scale
 * Combines opacity and scale for more noticeable loading
 */
export const pulseScale = {
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [0.98, 1, 0.98],
    transition: {
      duration: parseDuration(motion.duration.slower),
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Spinner Animations
 */

// Basic spin
export const spin = {
  animate: {
    rotate: 360,
    transition: {
      duration: parseDuration(motion.duration.slowest),
      ease: 'linear',
      repeat: Infinity,
    },
  },
}

// Faster spin for smaller loaders
export const spinFast = {
  animate: {
    rotate: 360,
    transition: {
      duration: parseDuration(motion.duration.slow),
      ease: 'linear',
      repeat: Infinity,
    },
  },
}

// Reverse spin
export const spinReverse = {
  animate: {
    rotate: -360,
    transition: {
      duration: parseDuration(motion.duration.slowest),
      ease: 'linear',
      repeat: Infinity,
    },
  },
}

/**
 * Bounce Loader
 * Three dots bouncing animation
 */
export const bounceLoader = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

// Staggered bounce for multiple dots
export const bounceLoaderContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const bounceLoaderDot = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Progress Bar Animations
 */

// Determinate progress (0 to 100%)
export const progressBar = (progress: number) => ({
  initial: { width: '0%' },
  animate: {
    width: `${progress}%`,
    transition: {
      duration: parseDuration(motion.duration.normal),
      ease: 'easeOut',
    },
  },
})

// Indeterminate progress (animated loop)
export const progressBarIndeterminate = {
  animate: {
    x: ['-100%', '200%'],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

// Circular progress
export const circularProgress = (progress: number) => ({
  initial: { pathLength: 0 },
  animate: {
    pathLength: progress / 100,
    transition: {
      duration: parseDuration(motion.duration.normal),
      ease: 'easeOut',
    },
  },
})

// Indeterminate circular progress
export const circularProgressIndeterminate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
}

/**
 * Skeleton Screen Patterns
 */

// Text line skeleton
export const skeletonLine = {
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: parseDuration(motion.duration.slower),
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

// Avatar skeleton (circular)
export const skeletonAvatar = {
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: parseDuration(motion.duration.slower),
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

// Card skeleton
export const skeletonCard = {
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: parseDuration(motion.duration.slower),
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Dots Loader
 * Classic three dots animation
 */
export const dotsLoaderContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export const dotsLoaderDot = {
  animate: {
    opacity: [0.3, 1, 0.3],
    scale: [0.8, 1, 0.8],
    transition: {
      duration: 1,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Wave Loader
 * Bars of different heights creating wave effect
 */
export const waveLoaderContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const waveLoaderBar = {
  animate: {
    scaleY: [0.4, 1, 0.4],
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Ping Animation
 * Expanding circle effect (like notifications)
 */
export const ping = {
  animate: {
    scale: [1, 2],
    opacity: [1, 0],
    transition: {
      duration: parseDuration(motion.duration.slowest),
      ease: 'easeOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Pulse Ring
 * Multiple expanding rings
 */
export const pulseRing = {
  animate: {
    scale: [1, 1.5],
    opacity: [0.8, 0],
    transition: {
      duration: 1.5,
      ease: 'easeOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Skeleton Shimmer (Wave effect)
 * More sophisticated shimmer for skeleton screens
 */
export const skeletonShimmer = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Loading Bar (Top of page)
 * Thin bar that progresses across top
 */
export const loadingBarIndeterminate = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      duration: 1,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
}

/**
 * Fade In Content After Load
 * Content fades in after loading completes
 */
export const fadeInAfterLoad = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.normal),
      ease: 'easeOut',
    },
  },
}

/**
 * Slide In After Load
 * Content slides up after loading
 */
export const slideInAfterLoad = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: parseDuration(motion.duration.moderate),
      ease: 'easeOut',
    },
  },
}

/**
 * Stagger In After Load
 * Multiple items appear with stagger
 */
export const staggerInAfterLoad = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const staggerInAfterLoadItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: parseDuration(motion.duration.normal),
      ease: 'easeOut',
    },
  },
}

/**
 * Button Loading State
 * Spinner inside button
 */
export const buttonSpinner = {
  animate: {
    rotate: 360,
    transition: {
      duration: 0.8,
      ease: 'linear',
      repeat: Infinity,
    },
  },
}

/**
 * Utility: Get loading animation based on type
 */
export function getLoadingAnimation(
  type: 'shimmer' | 'pulse' | 'spin' | 'bounce' | 'dots' | 'wave' = 'pulse'
) {
  const animations = {
    shimmer: shimmer,
    pulse: pulse,
    spin: spin,
    bounce: bounceLoader,
    dots: dotsLoaderDot,
    wave: waveLoaderBar,
  }
  return animations[type]
}

/**
 * Utility: Check if reduced motion is preferred
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Utility: Get safe loading animation (respects reduced motion)
 */
export function getSafeLoadingAnimation(animation: any) {
  if (shouldReduceMotion()) {
    // Return simple opacity pulse for reduced motion
    return {
      animate: {
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop' as const,
        },
      },
    }
  }
  return animation
}
