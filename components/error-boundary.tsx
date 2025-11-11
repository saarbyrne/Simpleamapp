'use client'

import { Component, ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

// Error display component that uses translations
function ErrorDisplay({ error, onReload }: { error: Error | null; onReload: () => void }) {
  // Note: This is a client component, but we can't use hooks in class components
  // So we'll use a wrapper component
  return <ErrorDisplayInner error={error} onReload={onReload} />
}

function ErrorDisplayInner({ error, onReload }: { error: Error | null; onReload: () => void }) {
  const t = useTranslations()
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="flex justify-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">{t('common.anUnexpectedError')}</h2>
        <p className="text-muted-foreground">
          {error?.message || t('common.anUnexpectedError')}
        </p>
        <Button onClick={onReload}>
          {t('common.refresh')}
        </Button>
      </div>
    </div>
  )
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorDisplay
          error={this.state.error}
          onReload={() => {
            this.setState({ hasError: false, error: null })
            window.location.reload()
          }}
        />
      )
    }

    return this.props.children
  }
}
