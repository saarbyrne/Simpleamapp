import * as Sentry from '@sentry/nextjs'

/**
 * Sentry Server Configuration
 *
 * FREE TIER LIMITS:
 * - 5,000 errors per month
 * - 10,000 performance units per month
 *
 * This configuration ensures we stay within free tier limits.
 */

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set environment
  environment: process.env.NODE_ENV,

  // FREE TIER SAFEGUARD: Sample rate for errors
  sampleRate: 1.0,

  // FREE TIER SAFEGUARD: Performance monitoring
  // Start with 5% sampling for server-side to stay under limits
  tracesSampleRate: 0.05,

  // Only initialize if DSN is provided
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Filter out non-critical errors
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null
    }

    // Log errors in production but filter out noise
    const error = hint.originalException
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message).toLowerCase()

      // Ignore expected errors
      if (
        message.includes('not found') && message.includes('404') ||
        message.includes('enoent')
      ) {
        return null
      }
    }

    return event
  },

  // Add release information
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Debug mode
  debug: false,

  // Ignore specific errors
  ignoreErrors: [
    'ENOENT',
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
  ],
})
