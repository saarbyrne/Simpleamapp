import * as Sentry from '@sentry/nextjs'

/**
 * Sentry Client Configuration
 *
 * FREE TIER LIMITS:
 * - 5,000 errors per month
 * - 10,000 performance units per month
 * - 1 project
 * - 30 days of data retention
 *
 * This configuration ensures we stay within free tier limits.
 */

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set environment
  environment: process.env.NODE_ENV,

  // FREE TIER SAFEGUARD: Sample rate for errors
  // 1.0 = 100% of errors captured (adjust if you hit limits)
  sampleRate: 1.0,

  // FREE TIER SAFEGUARD: Performance monitoring
  // Start with 10% sampling to stay under 10k performance units/month
  tracesSampleRate: 0.1,

  // FREE TIER SAFEGUARD: Replay sampling
  // Session replay is NOT included in free tier, so we keep it minimal
  replaysOnErrorSampleRate: 0, // Set to 0.1 to capture 10% of errors with replay
  replaysSessionSampleRate: 0, // Set to 0.01 for 1% of sessions if needed

  // Only initialize if DSN is provided
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Filter out non-critical errors to save quota
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null
    }

    // Filter out common non-critical errors
    const error = hint.originalException
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message).toLowerCase()

      // Ignore network errors that are usually not actionable
      if (
        message.includes('network request failed') ||
        message.includes('failed to fetch') ||
        message.includes('networkerror')
      ) {
        return null
      }

      // Ignore browser extension errors
      if (message.includes('extension')) {
        return null
      }
    }

    return event
  },

  // Set traces to ignore common non-actionable requests
  tracePropagationTargets: ['localhost', /^https:\/\/[^/]*\.vercel\.app/],

  // Add release information if available
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Debug mode (only in development)
  debug: false,

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'atomicFindClose',
    // Network errors
    'Network request failed',
    'NetworkError',
    'Failed to fetch',
    // Random plugins/extensions
    'Can\'t find variable: ZiteReader',
    'jigsaw is not defined',
    'ComboSearch is not defined',
    // Facebook
    'fb_xd_fragment',
    // Other
    'Non-Error promise rejection captured',
  ],
})
