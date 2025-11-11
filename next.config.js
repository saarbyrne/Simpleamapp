const { withSentryConfig } = require('@sentry/nextjs')
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'api.dicebear.com',
      'hjzcimtmdxafilgrfeye.supabase.co',
      'images.unsplash.com',
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    instrumentationHook: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize client-side bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Calendar library chunk
          calendar: {
            test: /[\\/]node_modules[\\/]react-big-calendar[\\/]/,
            name: 'calendar',
            priority: 20,
            reuseExistingChunk: true,
          },
          // Table library chunk
          table: {
            test: /[\\/]node_modules[\\/]@tanstack[\\/]react-table[\\/]/,
            name: 'table',
            priority: 20,
            reuseExistingChunk: true,
          },
          // Date utilities chunk
          dateUtils: {
            test: /[\\/]node_modules[\\/]date-fns[\\/]/,
            name: 'date-utils',
            priority: 15,
            reuseExistingChunk: true,
          },
          // Common vendor chunk
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      }
    }
    return config
  },
}

const shouldEnableSentryWebpackPlugin =
  Boolean(
    process.env.NEXT_PUBLIC_SENTRY_DSN &&
      process.env.SENTRY_AUTH_TOKEN &&
      process.env.SENTRY_ORG &&
      process.env.SENTRY_PROJECT,
  )

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
  // Upload a larger set of source maps for clearer stack traces
  widenClientFileUpload: true,
  // Reduce console noise and bundle size
  disableLogger: true,
  automaticVercelMonitors: true,
}

let config = withNextIntl(nextConfig)

module.exports = shouldEnableSentryWebpackPlugin
  ? withSentryConfig(config, sentryWebpackPluginOptions)
  : config
