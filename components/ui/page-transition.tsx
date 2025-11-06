/**
 * Page Transition Component
 *
 * Wrap your page content with this component to add smooth transitions
 * between route changes in Next.js App Router.
 *
 * Usage in app/template.tsx:
 *
 * import { PageTransition } from '@/components/ui/page-transition'
 *
 * export default function Template({ children }: { children: React.ReactNode }) {
 *   return <PageTransition>{children}</PageTransition>
 * }
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { pageTransitions, getPageTransition } from '@/lib/page-transitions'

interface PageTransitionProps {
  children: React.ReactNode
  /**
   * Type of transition to use
   * @default 'default'
   */
  type?: keyof typeof pageTransitions
  /**
   * Whether to respect prefers-reduced-motion
   * @default true
   */
  respectReducedMotion?: boolean
  /**
   * Custom className for the wrapper
   */
  className?: string
}

export function PageTransition({
  children,
  type = 'default',
  respectReducedMotion = true,
  className,
}: PageTransitionProps) {
  const pathname = usePathname()
  const transition = getPageTransition(type, respectReducedMotion)

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={transition.initial}
        animate={transition.animate}
        exit={transition.exit}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Minimal variant - just opacity fade
 */
export function PageTransitionMinimal({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition type="minimal" respectReducedMotion={true}>
      {children}
    </PageTransition>
  )
}

/**
 * Slide variant - slides left/right
 */
export function PageTransitionSlide({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition type="slide" respectReducedMotion={true}>
      {children}
    </PageTransition>
  )
}

/**
 * Scale variant - subtle zoom effect
 */
export function PageTransitionScale({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition type="scale" respectReducedMotion={true}>
      {children}
    </PageTransition>
  )
}

/**
 * Slide up variant - slides from bottom
 */
export function PageTransitionSlideUp({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition type="slideUp" respectReducedMotion={true}>
      {children}
    </PageTransition>
  )
}
