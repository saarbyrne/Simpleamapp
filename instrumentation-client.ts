import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  sampleRate: 1.0,
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 0,
  replaysSessionSampleRate: 0,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: true,
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  debug: false,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],
  beforeSend(event, hint) {
    if (process.env.NODE_ENV === 'development') {
      return null
    }
    const error = hint.originalException
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message).toLowerCase()
      if (
        message.includes('network request failed') ||
        message.includes('failed to fetch') ||
        message.includes('networkerror')
      ) {
        return null
      }
      if (message.includes('extension')) {
        return null
      }
    }
    return event
  },
  tracePropagationTargets: ['localhost', /^https:\/\/[^/]*\.vercel\.app/],
  ignoreErrors: [
    'top.GLOBALS',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'atomicFindClose',
    'ComboSearch is not defined',
    'fb_xd_fragment',
    'Non-Error promise rejection captured',
    'Network request failed',
    'NetworkError',
    'Failed to fetch',
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
