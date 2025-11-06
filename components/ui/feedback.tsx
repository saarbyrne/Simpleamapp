/**
 * Feedback Components
 *
 * Animated feedback components for success, error, warning, and info states.
 * These provide visual feedback for user actions and system states.
 *
 * Components:
 * - FeedbackToast: Toast notification with animation
 * - FeedbackIcon: Animated status icon
 * - FeedbackBanner: Full-width banner for page-level feedback
 * - FeedbackBadge: Small inline badge
 * - FormFeedback: Feedback message for form fields
 * - ConfettiExplosion: Celebration confetti effect
 *
 * All components respect prefers-reduced-motion and use design tokens.
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  successCheckmark,
  successBounce,
  successPulse,
  successToast,
  errorShake,
  errorXMark,
  errorToast,
  warningPulse,
  warningIcon,
  warningToast,
  infoFade,
  infoIcon,
  infoToast,
  confettiParticle,
  inputError,
  inputSuccess,
  getSafeFeedbackVariant,
} from '@/lib/feedback-animations'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Check,
} from 'lucide-react'

export type FeedbackVariant = 'success' | 'error' | 'warning' | 'info'

// ============================================================================
// FEEDBACK TOAST
// ============================================================================

export interface FeedbackToastProps {
  /**
   * Variant determines color and icon
   */
  variant: FeedbackVariant
  /**
   * Toast title
   */
  title: string
  /**
   * Optional description
   */
  description?: string
  /**
   * Whether the toast is visible
   */
  isVisible: boolean
  /**
   * Callback when close button is clicked
   */
  onClose?: () => void
  /**
   * Custom className
   */
  className?: string
  /**
   * Auto-dismiss duration in ms (0 = no auto-dismiss)
   */
  duration?: number
}

const toastVariants = {
  success: successToast,
  error: errorToast,
  warning: warningToast,
  info: infoToast,
}

const toastColors = {
  success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100',
  error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100',
  info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
}

const toastIcons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

export function FeedbackToast({
  variant,
  title,
  description,
  isVisible,
  onClose,
  className,
  duration = 0,
}: FeedbackToastProps) {
  React.useEffect(() => {
    if (duration > 0 && isVisible) {
      const timer = setTimeout(() => {
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, isVisible, onClose])

  const Icon = toastIcons[variant]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={getSafeFeedbackVariant(toastVariants[variant], variant)}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md',
            toastColors[variant],
            className
          )}
          role="alert"
          aria-live={variant === 'error' ? 'assertive' : 'polite'}
        >
          <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{title}</p>
            {description && (
              <p className="text-sm opacity-90 mt-1">{description}</p>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// FEEDBACK ICON
// ============================================================================

export interface FeedbackIconProps {
  /**
   * Variant determines which icon and animation
   */
  variant: FeedbackVariant
  /**
   * Icon size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Whether to show pulsing animation (for persistent feedback)
   */
  pulse?: boolean
  /**
   * Custom className
   */
  className?: string
}

const iconVariants = {
  success: successCheckmark,
  error: errorXMark,
  warning: warningIcon,
  info: infoIcon,
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

const iconColors = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400',
}

export function FeedbackIcon({
  variant,
  size = 'md',
  pulse = false,
  className,
}: FeedbackIconProps) {
  const Icon = toastIcons[variant]
  const pulseVariants = {
    success: successPulse,
    error: { animate: {} }, // No pulse for error by default
    warning: warningPulse,
    info: { animate: {} }, // No pulse for info by default
  }

  return (
    <motion.div
      variants={getSafeFeedbackVariant(iconVariants[variant], variant)}
      initial="initial"
      animate={pulse ? pulseVariants[variant].animate : 'animate'}
      exit="exit"
      className={cn(iconSizes[size], iconColors[variant], className)}
      role="img"
      aria-label={`${variant} icon`}
    >
      <Icon className="w-full h-full" />
    </motion.div>
  )
}

// ============================================================================
// FEEDBACK BANNER
// ============================================================================

export interface FeedbackBannerProps {
  /**
   * Variant determines color and icon
   */
  variant: FeedbackVariant
  /**
   * Banner message
   */
  message: string
  /**
   * Optional action button
   */
  action?: {
    label: string
    onClick: () => void
  }
  /**
   * Whether the banner is visible
   */
  isVisible: boolean
  /**
   * Callback when close button is clicked
   */
  onClose?: () => void
  /**
   * Custom className
   */
  className?: string
}

const bannerColors = {
  success: 'bg-green-100 border-green-300 text-green-900 dark:bg-green-950 dark:border-green-700 dark:text-green-100',
  error: 'bg-red-100 border-red-300 text-red-900 dark:bg-red-950 dark:border-red-700 dark:text-red-100',
  warning: 'bg-yellow-100 border-yellow-300 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-700 dark:text-yellow-100',
  info: 'bg-blue-100 border-blue-300 text-blue-900 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-100',
}

export function FeedbackBanner({
  variant,
  message,
  action,
  isVisible,
  onClose,
  className,
}: FeedbackBannerProps) {
  const Icon = toastIcons[variant]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={getSafeFeedbackVariant(infoFade, variant)}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            'flex items-center gap-3 p-4 border-l-4',
            bannerColors[variant],
            className
          )}
          role="alert"
          aria-live={variant === 'error' ? 'assertive' : 'polite'}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <p className="flex-1 text-sm font-medium">{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="px-3 py-1 text-sm font-medium rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {action.label}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// FEEDBACK BADGE
// ============================================================================

export interface FeedbackBadgeProps {
  /**
   * Variant determines color
   */
  variant: FeedbackVariant
  /**
   * Badge text
   */
  children: React.ReactNode
  /**
   * Badge size
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Whether to animate on mount
   */
  animate?: boolean
  /**
   * Custom className
   */
  className?: string
}

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

const badgeColors = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
}

export function FeedbackBadge({
  variant,
  children,
  size = 'md',
  animate = true,
  className,
}: FeedbackBadgeProps) {
  const MotionComponent = animate ? motion.span : 'span'
  const props = animate
    ? {
        variants: getSafeFeedbackVariant(successBounce, variant),
        initial: 'initial',
        animate: 'animate',
      }
    : {}

  return (
    <MotionComponent
      {...props}
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        badgeSizes[size],
        badgeColors[variant],
        className
      )}
    >
      {children}
    </MotionComponent>
  )
}

// ============================================================================
// FORM FEEDBACK
// ============================================================================

export interface FormFeedbackProps {
  /**
   * Variant determines color and icon
   */
  variant: 'success' | 'error'
  /**
   * Feedback message
   */
  message: string
  /**
   * Whether to show icon
   */
  showIcon?: boolean
  /**
   * Custom className
   */
  className?: string
}

export function FormFeedback({
  variant,
  message,
  showIcon = true,
  className,
}: FormFeedbackProps) {
  const colors = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
  }

  const Icon = variant === 'success' ? Check : XCircle

  return (
    <motion.div
      variants={getSafeFeedbackVariant(infoFade, variant === 'success' ? 'success' : 'error')}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn('flex items-center gap-2 mt-1.5', colors[variant], className)}
      role="alert"
    >
      {showIcon && <Icon className="w-4 h-4 flex-shrink-0" />}
      <p className="text-sm">{message}</p>
    </motion.div>
  )
}

// ============================================================================
// INPUT FEEDBACK WRAPPER
// ============================================================================

export interface InputFeedbackProps {
  /**
   * Input element
   */
  children: React.ReactElement
  /**
   * Validation state
   */
  state?: 'idle' | 'success' | 'error'
  /**
   * Whether to shake on error
   */
  shakeOnError?: boolean
}

export function InputFeedback({
  children,
  state = 'idle',
  shakeOnError = true,
}: InputFeedbackProps) {
  const [shouldShake, setShouldShake] = React.useState(false)

  React.useEffect(() => {
    if (state === 'error' && shakeOnError) {
      setShouldShake(true)
      const timer = setTimeout(() => setShouldShake(false), 400)
      return () => clearTimeout(timer)
    }
  }, [state, shakeOnError])

  const getBorderColor = () => {
    if (state === 'success') return 'ring-2 ring-green-500 border-green-500'
    if (state === 'error') return 'ring-2 ring-red-500 border-red-500'
    return ''
  }

  return (
    <motion.div
      animate={shouldShake ? errorShake.animate : {}}
      className="relative"
    >
      {React.cloneElement(children, {
        className: cn(children.props.className, getBorderColor()),
      })}
      <AnimatePresence>
        {state === 'success' && (
          <motion.div
            variants={getSafeFeedbackVariant(inputSuccess, 'success')}
            initial="initial"
            animate="animate"
            exit={{ scale: 0, opacity: 0 }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Check className="w-5 h-5 text-green-600" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================================================
// CONFETTI EXPLOSION
// ============================================================================

export interface ConfettiExplosionProps {
  /**
   * Number of confetti pieces
   */
  particleCount?: number
  /**
   * Whether the confetti is active
   */
  isActive: boolean
  /**
   * Colors for confetti pieces
   */
  colors?: string[]
  /**
   * Custom className for positioning
   */
  className?: string
}

export function ConfettiExplosion({
  particleCount = 20,
  isActive,
  colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
  className,
}: ConfettiExplosionProps) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      <AnimatePresence>
        {isActive && (
          <>
            {Array.from({ length: particleCount }).map((_, index) => (
              <motion.div
                key={index}
                variants={confettiParticle(index)}
                initial="initial"
                animate="animate"
                className="absolute left-1/2 top-1/2 w-2 h-2 rounded-sm"
                style={{
                  backgroundColor: colors[index % colors.length],
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// SUCCESS CHECKMARK CIRCLE
// ============================================================================

export interface SuccessCheckmarkProps {
  /**
   * Size of the checkmark
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Custom className
   */
  className?: string
}

export function SuccessCheckmark({ size = 'lg', className }: SuccessCheckmarkProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }

  return (
    <motion.div
      variants={getSafeFeedbackVariant(successCheckmark, 'success')}
      initial="initial"
      animate="animate"
      className={cn(
        'flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900',
        sizes[size],
        className
      )}
    >
      <Check className="w-1/2 h-1/2 text-green-600 dark:text-green-400 stroke-[3]" />
    </motion.div>
  )
}

// ============================================================================
// ERROR X CIRCLE
// ============================================================================

export interface ErrorXMarkProps {
  /**
   * Size of the X mark
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Custom className
   */
  className?: string
}

export function ErrorXMark({ size = 'lg', className }: ErrorXMarkProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }

  return (
    <motion.div
      variants={getSafeFeedbackVariant(errorXMark, 'error')}
      initial="initial"
      animate="animate"
      className={cn(
        'flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900',
        sizes[size],
        className
      )}
    >
      <X className="w-1/2 h-1/2 text-red-600 dark:text-red-400 stroke-[3]" />
    </motion.div>
  )
}
