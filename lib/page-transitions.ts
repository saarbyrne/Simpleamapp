/**
 * Page Transition Utilities
 *
 * Animations for route changes, layout shifts, and page-level transitions.
 * These work with Next.js App Router and Framer Motion's AnimatePresence.
 *
 * Usage with Next.js App Router:
 *
 * // In your layout.tsx or template.tsx:
 * import { PageTransition } from '@/components/ui/page-transition'
 *
 * export default function Template({ children }) {
 *   return <PageTransition>{children}</PageTransition>
 * }
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
 * Page Fade Transition
 * Simple fade in/out between pages
 */
export const pageFade = {
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
 * Page Slide Transition
 * Slide out old page, slide in new page
 */
export const pageSlideRight = {
  initial: { x: -20, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.moderate),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: {
      duration: parseDuration(motion.duration.fast),
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

export const pageSlideLeft = {
  initial: { x: 20, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.moderate),
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
 * Page Scale Transition
 * Scale + fade for dramatic effect
 */
export const pageScale = {
  initial: { scale: 0.96, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.moderate),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    scale: 1.04,
    opacity: 0,
    transition: {
      duration: parseDuration(motion.duration.fast),
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

/**
 * Page Slide Up Transition
 * New page slides up from bottom
 */
export const pageSlideUp = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.moderate),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
      duration: parseDuration(motion.duration.fast),
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

/**
 * Layout Shift Animation
 * For when layout changes (e.g., sidebar toggle)
 */
export const layoutShift = {
  layout: true,
  transition: {
    layout: {
      duration: parseDuration(motion.duration.normal),
      ease: cubicBezierToArray(motion.easing.easeInOut),
    },
  },
}

/**
 * Shared Element Transition Config
 * For morphing between elements across pages
 */
export const sharedElement = {
  layoutId: '', // Set this to a unique ID shared between pages
  transition: {
    duration: parseDuration(motion.duration.moderate),
    ease: cubicBezierToArray(motion.easing.easeInOut),
  },
}

/**
 * Stagger Page Content
 * Content appears with stagger effect after page loads
 */
export const pageContentStagger = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const pageContentItem = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.normal),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

/**
 * Hero Section Animation
 * Dramatic entrance for hero sections
 */
export const heroAnimation = {
  initial: { scale: 0.95, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.slow),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

/**
 * Card Grid Stagger
 * For animating grids of cards
 */
export const cardGrid = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const cardGridItem = {
  initial: { y: 30, opacity: 0, scale: 0.95 },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: parseDuration(motion.duration.normal),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

/**
 * List Stagger Animation
 * For animating lists of items
 */
export const listStagger = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

export const listItem = {
  initial: { x: -20, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.normal),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

/**
 * Reveal from Bottom
 * Element slides up and fades in when scrolled into view
 */
export const revealFromBottom = {
  initial: { y: 60, opacity: 0 },
  whileInView: {
    y: 0,
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.moderate),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  viewport: { once: true, amount: 0.3 },
}

/**
 * Reveal from Left
 * Element slides from left when scrolled into view
 */
export const revealFromLeft = {
  initial: { x: -60, opacity: 0 },
  whileInView: {
    x: 0,
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.moderate),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  viewport: { once: true, amount: 0.3 },
}

/**
 * Reveal from Right
 * Element slides from right when scrolled into view
 */
export const revealFromRight = {
  initial: { x: 60, opacity: 0 },
  whileInView: {
    x: 0,
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.moderate),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  viewport: { once: true, amount: 0.3 },
}

/**
 * Scale Reveal
 * Element scales up when scrolled into view
 */
export const scaleReveal = {
  initial: { scale: 0.8, opacity: 0 },
  whileInView: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: parseDuration(motion.duration.moderate),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  viewport: { once: true, amount: 0.3 },
}

/**
 * Parallax Scroll Effect
 * Element moves slower than scroll for depth
 */
export const parallax = (speed: number = 0.5) => ({
  initial: { y: 0 },
  whileInView: {
    y: [-20, 20],
    transition: {
      duration: 1,
      ease: 'linear',
    },
  },
  viewport: { once: false },
})

/**
 * Tab Switch Animation
 * For tab panel content
 */
export const tabPanel = {
  initial: { opacity: 0, x: -10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: parseDuration(motion.duration.fast),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: {
      duration: parseDuration(motion.duration.fast),
      ease: cubicBezierToArray(motion.easing.easeIn),
    },
  },
}

/**
 * Accordion Panel
 * For expanding/collapsing content
 */
export const accordionPanel = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: parseDuration(motion.duration.normal),
        ease: cubicBezierToArray(motion.easing.easeOut),
      },
      opacity: {
        duration: parseDuration(motion.duration.fast),
        ease: cubicBezierToArray(motion.easing.easeOut),
        delay: 0.1,
      },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: parseDuration(motion.duration.normal),
        ease: cubicBezierToArray(motion.easing.easeIn),
      },
      opacity: {
        duration: parseDuration(motion.duration.fast),
        ease: cubicBezierToArray(motion.easing.easeIn),
      },
    },
  },
}

/**
 * Counter Animation
 * Animates number changes
 */
export const counterAnimation = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: parseDuration(motion.duration.fast),
      ease: cubicBezierToArray(motion.easing.easeOut),
    },
  },
}

/**
 * Notification Badge
 * Pulsing badge animation
 */
export const notificationBadge = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
    },
  },
  exit: {
    scale: 0,
    transition: {
      duration: parseDuration(motion.duration.fast),
    },
  },
}

/**
 * Page Transition Presets
 * Common combinations for different page types
 */
export const pageTransitions = {
  default: pageFade,
  slide: pageSlideRight,
  scale: pageScale,
  slideUp: pageSlideUp,
  minimal: pageFade, // Alias for accessibility
}

/**
 * Get appropriate transition based on user preferences
 */
export function getPageTransition(
  type: keyof typeof pageTransitions = 'default',
  respectReducedMotion: boolean = true
) {
  if (respectReducedMotion && typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // Return instant transition
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0 } },
        exit: { opacity: 0, transition: { duration: 0 } },
      }
    }
  }
  return pageTransitions[type]
}
