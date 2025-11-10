const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance: Enable gzip compression
  compress: true,

  // Performance: Remove X-Powered-By header
  poweredByHeader: false,

  // Performance: Modern JavaScript optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Performance: Image optimization
  images: {
    domains: [
      'api.dicebear.com',
      'hjzcimtmdxafilgrfeye.supabase.co',
      'images.unsplash.com',
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  // Performance: Modularize imports for better tree-shaking
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    instrumentationHook: true,
  },

  // Enable React strict mode for better performance warnings
  reactStrictMode: true,
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

      // Performance budgets - warn if bundles get too large
      config.performance = {
        maxAssetSize: 244000, // 244KB
        maxEntrypointSize: 244000,
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
      }

      // Bundle analyzer (only when ANALYZE=true)
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './analyze.html',
            openAnalyzer: false,
          })
        )
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

module.exports = shouldEnableSentryWebpackPlugin
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig
