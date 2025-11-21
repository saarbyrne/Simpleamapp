const { withSentryConfig } = require('@sentry/nextjs')
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance: Enable gzip compression
  compress: true,

  // Performance: Remove X-Powered-By header
  poweredByHeader: false,

  // Security: Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.posthog.com https://*.sentry.io;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https: blob:;
              font-src 'self' data:;
              connect-src 'self' https://*.supabase.co https://api.anthropic.com https://*.firebase.com https://*.firebaseio.com https://*.googleapis.com https://*.posthog.com https://*.sentry.io https://vercel.live wss://*;
              frame-ancestors 'self';
              base-uri 'self';
              form-action 'self';
              frame-src 'self' https://vercel.live;
              object-src 'none';
              worker-src 'self' blob:;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ]
  },

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
      allowedOrigins: process.env.NODE_ENV === 'production'
        ? [process.env.NEXT_PUBLIC_APP_URL || 'simpleam.app', 'www.simpleam.app']
        : ['localhost:3000', '127.0.0.1:3000'],
      bodySizeLimit: '2mb',
    },
    instrumentationHook: true,
  },

  // Enable React strict mode for better performance warnings
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Suppress warnings from dependencies
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
    ]

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
        try {
          const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
          config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              reportFilename: './analyze.html',
              openAnalyzer: false,
            })
          )
          console.log('📊 Bundle analyzer enabled - report will be generated at .next/analyze.html')
        } catch (e) {
          console.warn('⚠️  webpack-bundle-analyzer not installed. Run: npm install --save-dev webpack-bundle-analyzer')
        }
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
