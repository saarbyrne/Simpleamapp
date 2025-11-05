import * as Sentry from '@sentry/nextjs'

/**
 * Sentry configuration for server runtimes.
 * Balances observability while keeping within the Sentry free tier.
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Ensure event metadata is consistent across environments.
  environment: process.env.NODE_ENV,

  // Full error sampling while throttling performance traces to stay under limits.
  sampleRate: 1.0,
  tracesSampleRate: 0.05,

  // Only initialize when the DSN is present.
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capture relevant user context when available.
  sendDefaultPii: true,

  // Annotate releases for better traceability.
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Filter noise in production while allowing visibility locally.
  beforeSend(event, hint) {
    if (process.env.NODE_ENV === 'development') {
      return null
    }

    const error = hint?.originalException
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message).toLowerCase()

      if (
        message.includes('not found') && message.includes('404') ||
        message.includes('enoent')
      ) {
        return null
      }
    }

    return event
  },

  // Limit common network noise.
  ignoreErrors: ['ENOENT', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'],

  debug: false,
})
