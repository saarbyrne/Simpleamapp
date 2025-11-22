const { withSentryConfig } = require('@sentry/nextjs')
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

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

  // Performance: Enable SWC minification for better compression
  swcMinify: true,

  // Performance: Standalone output for deployment
  output: 'standalone',



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
    // Performance: Enable optimizePackageImports for better tree-shaking
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
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
          // Excalidraw chunk - only loads on canvas pages
          excalidraw: {
            test: /[\\/]node_modules[\\/]@excalidraw[\\/]/,
            name: 'excalidraw',
            priority: 30,
            reuseExistingChunk: true,
          },
          // Firebase chunk - only loads when chat is used
          firebase: {
            test: /[\\/]node_modules[\\/]firebase[\\/]/,
            name: 'firebase',
            priority: 25,
            reuseExistingChunk: true,
          },
          // TipTap chunk - only loads when rich text editing is used
          tiptap: {
            test: /[\\/]node_modules[\\/]@tiptap[\\/]/,
            name: 'tiptap',
            priority: 25,
            reuseExistingChunk: true,
          },
          // Recharts chunk - only loads on reports/analytics pages
          recharts: {
            test: /[\\/]node_modules[\\/]recharts[\\/]/,
            name: 'recharts',
            priority: 25,
            reuseExistingChunk: true,
          },
          // Radix UI components - split major ones
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix-ui',
            priority: 20,
            reuseExistingChunk: true,
          },
          // PDF generation libraries - only loads when needed
          pdf: {
            test: /[\\/]node_modules[\\/](jspdf|html2canvas)[\\/]/,
            name: 'pdf-libs',
            priority: 20,
            reuseExistingChunk: true,
          },
          // Anthropic AI SDK - only loads for AI features
          ai: {
            test: /[\\/]node_modules[\\/]@anthropic-ai[\\/]/,
            name: 'anthropic-ai',
            priority: 20,
            reuseExistingChunk: true,
          },
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
          // Common vendor chunk - everything else
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
