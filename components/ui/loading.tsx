/**
 * Loading Components
 *
 * Pre-built loading indicators using Framer Motion animations.
 * All components respect prefers-reduced-motion.
 */

'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  spin,
  spinFast,
  bounceLoaderContainer,
  bounceLoaderDot,
  dotsLoaderContainer,
  dotsLoaderDot,
  waveLoaderContainer,
  waveLoaderBar,
  pulse,
  progressBarIndeterminate,
  circularProgress,
  circularProgressIndeterminate,
  buttonSpinner,
} from '@/lib/loading-animations'

/**
 * Spinner
 * Classic rotating spinner
 */
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  }

  return (
    <motion.div
      animate={spin.animate}
      className={cn(
        'rounded-full border-current border-t-transparent',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

/**
 * Spinner Fast
 * Faster rotating spinner for quick operations
 */
export function SpinnerFast({ size = 'sm', className }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  }

  return (
    <motion.div
      animate={spinFast.animate}
      className={cn(
        'rounded-full border-current border-t-transparent',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

/**
 * Bounce Loader
 * Three bouncing dots
 */
interface BounceLoaderProps {
  className?: string
  dotClassName?: string
}

export function BounceLoader({ className, dotClassName }: BounceLoaderProps) {
  return (
    <motion.div
      variants={bounceLoaderContainer}
      animate="animate"
      className={cn('flex gap-2', className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          variants={bounceLoaderDot}
          className={cn('w-3 h-3 rounded-full bg-current', dotClassName)}
        />
      ))}
    </motion.div>
  )
}

/**
 * Dots Loader
 * Three pulsing dots
 */
export function DotsLoader({ className, dotClassName }: BounceLoaderProps) {
  return (
    <motion.div
      variants={dotsLoaderContainer}
      animate="animate"
      className={cn('flex gap-2', className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          variants={dotsLoaderDot}
          className={cn('w-2 h-2 rounded-full bg-current', dotClassName)}
        />
      ))}
    </motion.div>
  )
}

/**
 * Wave Loader
 * Vertical bars creating wave effect
 */
export function WaveLoader({ className }: { className?: string }) {
  return (
    <motion.div
      variants={waveLoaderContainer}
      animate="animate"
      className={cn('flex gap-1 items-center', className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          variants={waveLoaderBar}
          className="w-1 h-6 bg-current rounded-full origin-center"
        />
      ))}
    </motion.div>
  )
}

/**
 * Progress Bar
 * Linear progress indicator
 */
interface ProgressBarProps {
  progress?: number
  indeterminate?: boolean
  className?: string
}

export function ProgressBar({
  progress = 0,
  indeterminate = false,
  className,
}: ProgressBarProps) {
  return (
    <div
      className={cn('w-full h-2 bg-muted rounded-full overflow-hidden', className)}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {indeterminate ? (
        <motion.div
          variants={progressBarIndeterminate}
          animate="animate"
          className="h-full w-1/3 bg-primary rounded-full"
        />
      ) : (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full bg-primary rounded-full"
        />
      )}
    </div>
  )
}

/**
 * Circular Progress
 * Circular progress indicator
 */
interface CircularProgressProps {
  progress?: number
  indeterminate?: boolean
  size?: number
  strokeWidth?: number
  className?: string
}

export function CircularProgress({
  progress = 0,
  indeterminate = false,
  size = 40,
  strokeWidth = 4,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  return (
    <div className={cn('relative', className)} role="progressbar">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        {/* Progress circle */}
        {indeterminate ? (
          <motion.circle
            variants={circularProgressIndeterminate}
            animate="animate"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
            className="text-primary origin-center"
          />
        ) : (
          <motion.circle
            variants={circularProgress(progress)}
            initial="initial"
            animate="animate"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            className="text-primary"
          />
        )}
      </svg>
      {!indeterminate && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  )
}

/**
 * Skeleton
 * Loading placeholder with pulse animation
 */
interface SkeletonProps {
  className?: string
  shimmer?: boolean
}

export function Skeleton({ className, shimmer = false }: SkeletonProps) {
  return (
    <motion.div
      variants={pulse}
      animate="animate"
      className={cn(
        'rounded-md bg-muted',
        shimmer &&
          'bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]',
        className
      )}
      style={
        shimmer
          ? {
              backgroundImage:
                'linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted) / 0.5) 50%, hsl(var(--muted)) 100%)',
            }
          : undefined
      }
    />
  )
}

/**
 * Loading Overlay
 * Full-screen or container loading overlay
 */
interface LoadingOverlayProps {
  loading: boolean
  children?: React.ReactNode
  className?: string
  loaderType?: 'spinner' | 'dots' | 'bounce' | 'wave'
}

export function LoadingOverlay({
  loading,
  children,
  className,
  loaderType = 'spinner',
}: LoadingOverlayProps) {
  const loaders = {
    spinner: <Spinner className="text-primary" />,
    dots: <DotsLoader className="text-primary" />,
    bounce: <BounceLoader className="text-primary" />,
    wave: <WaveLoader className="text-primary" />,
  }

  return (
    <div className={cn('relative', className)}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          {loaders[loaderType]}
        </div>
      )}
    </div>
  )
}

/**
 * Button with Loading State
 * Button that shows spinner when loading
 */
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
}

export function LoadingButton({
  loading = false,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn('relative', className)}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={buttonSpinner.animate}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        </span>
      )}
      <span className={cn(loading && 'invisible')}>{children}</span>
    </button>
  )
}
