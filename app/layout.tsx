import * as Sentry from '@sentry/nextjs'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import '@/app/globals.css'
import '@/app/design-system.css'
import { AnalyticsProviders } from '@/lib/analytics/providers'
import { ThemeProvider } from '@/components/theme-provider'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
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
    <html lang="en" suppressHydrationWarning>
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
