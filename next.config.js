const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.dicebear.com', 'hjzcimtmdxafilgrfeye.supabase.co'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    instrumentationHook: true,
  },
}

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // Only upload source maps if SENTRY_AUTH_TOKEN is set (prevents errors)
  silent: !process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Automatically annotate React components to show their full name in errors
  reactComponentAnnotation: {
    enabled: true,
  },

  // Suppress all Webpack plugin logs
  hideSourceMaps: true,

  // Disable source map upload in development
  disableLogger: true,
}

// Export the config wrapped with Sentry
module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig
