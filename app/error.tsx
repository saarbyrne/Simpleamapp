"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import * as Sentry from '@sentry/nextjs'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to Sentry error tracking
    console.error('Application error:', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={AlertCircle} size="md" color="error" label="Error" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            We encountered an unexpected error. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.message && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-mono text-muted-foreground">
                {error.message}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full">
              <Icon icon={RefreshCw} size="sm" decorative className="mr-2" />
              Try Again
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard">
                <Icon icon={Home} size="sm" decorative className="mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
