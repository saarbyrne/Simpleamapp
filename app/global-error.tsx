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
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Something went wrong!
            </h2>
            <p style={{ color: '#666' }}>
              We've been notified and will look into it.
            </p>
            {error.message && (
              <p style={{ fontSize: '14px', color: '#888' }}>
                Error: {error.message}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                borderRadius: '6px',
                backgroundColor: '#000',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
