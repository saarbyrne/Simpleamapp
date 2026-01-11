import * as Sentry from '@sentry/nextjs'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import '@/app/globals.css'
import { ThemeProvider } from 'next-themes'
import { AnalyticsProviders } from '@/lib/analytics/providers'
import { ErrorBoundary } from '@/components/error-boundary'
import { ThemeSync } from '@/components/theme-sync'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '800'], // Supported weights for marketing site
  variable: '--font-plus-jakarta-sans',
  display: 'swap', // Prevent invisible text during load
  preload: true,
  adjustFontFallback: true,
})

// Include Sentry trace data in the metadata for request correlation.
export function generateMetadata(): Metadata {
  return {
    title: 'SimpleAM - Athlete Management Platform',
    description: 'Low-cost, high-quality athlete management for sports teams',
    other: {
      ...Sentry.getTraceData(),
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get locale and messages using next-intl's server functions
  // These will use the request config which reads from user preferences
  const locale = await getLocale()
  const messages = await getMessages()

  // RTL languages
  const rtlLocales = ['ar', 'he', 'fa', 'ur']
  const isRTL = rtlLocales.includes(locale)

  return (
    <html
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={plusJakartaSans.variable}
    >
      <head>
        {/* Performance: Preconnect to external API origins */}
        <link rel="preconnect" href="https://hjzcimtmdxafilgrfeye.supabase.co" />
        <link rel="dns-prefetch" href="https://api.anthropic.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://app.posthog.com" />
      </head>
      <body className={plusJakartaSans.className}>
        <ErrorBoundary>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider
              attribute="class"
              enableSystem
              disableTransitionOnChange={false}
            >
              <ThemeSync>
                <AnalyticsProviders>
                  {children}
                </AnalyticsProviders>
              </ThemeSync>
            </ThemeProvider>
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
