import * as Sentry from '@sentry/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { AnalyticsProviders } from '@/lib/analytics/providers'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en">
      <body className={inter.className}>
        <AnalyticsProviders>
          {children}
        </AnalyticsProviders>
      </body>
    </html>
  )
}
