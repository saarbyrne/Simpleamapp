'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

/**
 * Global error boundary for the root layout.
 * Includes a reset action and reports errors to Sentry.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global application error:', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md text-center flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-foreground">
              Something went wrong!
            </h2>
            <p className="text-muted-foreground">
              We&apos;ve been notified and will look into it.
            </p>
            {error.message && (
              <p className="text-sm text-muted-foreground/80">
                Error: {error.message}
              </p>
            )}
            <button
              onClick={reset}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background border-none cursor-pointer hover:opacity-90"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
