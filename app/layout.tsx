import * as Sentry from '@sentry/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import '@/app/design-system.css'
import { AnalyticsProviders } from '@/lib/analytics/providers'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SimpleAM - Athlete Management Platform',
  description: 'Low-cost, high-quality athlete management for sports teams',
}

// Include Sentry trace data in the metadata for request correlation.
export function generateMetadata(): Metadata {
  return {
    ...metadata,
    other: {
      ...Sentry.getTraceData(),
      ...(metadata.other ?? {}),
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
      <body className={inter.className}>
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
