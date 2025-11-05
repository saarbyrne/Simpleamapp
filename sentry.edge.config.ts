import * as Sentry from '@sentry/nextjs'

/**
 * Sentry Edge Configuration (for middleware)
 *
 * FREE TIER LIMITS:
 * - 5,000 errors per month
 * - 10,000 performance units per month
 */

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set environment
  environment: process.env.NODE_ENV,

  // FREE TIER SAFEGUARD: Conservative sampling for edge
  sampleRate: 1.0,
  tracesSampleRate: 0.05, // Only 5% of traces

  // Only initialize if DSN is provided
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capture relevant user context when available.
  sendDefaultPii: true,

  // Add release information
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Debug mode
  debug: false,
})
