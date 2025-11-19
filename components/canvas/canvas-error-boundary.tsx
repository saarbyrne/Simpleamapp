'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class CanvasErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is the specific parentNode error from Excalidraw + React 18
    const isParentNodeError = error.message.includes('Cannot read properties of null (reading \'parentNode\')') ||
                              error.message.includes('parentNode')

    if (isParentNodeError) {
      console.warn('Excalidraw parentNode error detected (known React 18 compatibility issue), allowing recovery:', error)
      // Don't set error state for this specific error, allowing the component to recover
      return { hasError: false, error: null }
    }

    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Check if this is the specific parentNode error from Excalidraw + React 18
    const isParentNodeError = error.message.includes('Cannot read properties of null (reading \'parentNode\')') ||
                              error.message.includes('parentNode')

    if (isParentNodeError) {
      console.warn('Excalidraw parentNode error detected (known React 18 compatibility issue):', error)
      // Don't re-render with error state for this specific error, as it's often recoverable
      return
    }

    console.error('Canvas error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-background p-8">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="flex justify-center">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Canvas Error</h2>
              <p className="text-muted-foreground">
                The drawing canvas encountered an error and could not load properly.
              </p>
              {this.state.error && (
                <details className="mt-4 text-start">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Technical details
                  </summary>
                  <pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-auto max-h-40">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="default"
              >
                Reload Page
              </Button>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
