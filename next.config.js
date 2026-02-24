const { withSentryConfig } = require('@sentry/nextjs')
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Linting: Fail build on ESLint errors (warnings won't fail, but errors will)
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. We run linting explicitly before build.
    ignoreDuringBuilds: false,
  },
  // TypeScript: Fail build on type errors
  typescript: {
    // Same as above - we run typecheck explicitly, but this provides double protection
    ignoreBuildErrors: false,
  },
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
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel-scripts.com https://*.posthog.com https://*.sentry.io https://*.googleapis.com https://apis.google.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https: blob:;
              font-src 'self' data:;
              connect-src 'self' https://*.supabase.co https://api.anthropic.com https://*.firebase.com https://*.firebaseio.com https://*.googleapis.com https://*.posthog.com https://*.sentry.io https://vercel.live https://va.vercel-scripts.com wss://*;
              frame-ancestors 'self';
              base-uri 'self';
              form-action 'self';
              frame-src 'self' https://vercel.live https://*.googleapis.com https://*.firebaseapp.com;
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

  // Performance: Enable SWC minification for better compression
  swcMinify: true,

  // Performance: Standalone output for deployment
  output: 'standalone',



  // Performance: Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hjzcimtmdxafilgrfeye.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
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
        : ['localhost:3000', '127.0.0.1:3000', 'localhost:3001', '127.0.0.1:3001'],
      bodySizeLimit: '2mb',
    },
    instrumentationHook: true,
    // Performance: Enable optimizePackageImports for better tree-shaking
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },

  // Enable React strict mode for better performance warnings
  reactStrictMode: true,
  webpack: (config, { isServer, dev }) => {
    // Suppress warnings from dependencies
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
    ]

    if (!isServer) {
      if (!dev) {
        // Optimize client-side bundle splitting (production only).
        // Next.js dev/HMR can request stale custom chunk names when these groups
        // are applied during local development.
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
            // PostHog analytics - lazily loaded, not needed on initial page
            posthog: {
              test: /[\\/]node_modules[\\/]posthog-js[\\/]/,
              name: 'posthog',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Sentry error tracking
            sentry: {
              test: /[\\/]node_modules[\\/]@sentry[\\/]/,
              name: 'sentry',
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
            // Common vendor chunk - everything else, with size limit
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
          hints: 'warning',
        }
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
