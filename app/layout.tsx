import * as Sentry from '@sentry/nextjs'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import '@/app/globals.css'
import { ThemeProvider } from 'next-themes'
import { AnalyticsProviders } from '@/lib/analytics/providers'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600'], // Reduced from 5 to 2 weights for performance
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AnalyticsProviders>
            {children}
          </AnalyticsProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
