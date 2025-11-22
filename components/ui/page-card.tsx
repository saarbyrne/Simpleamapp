'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface PageCardProps {
  title: ReactNode
  description?: string
  headerActions?: ReactNode
  toolbar?: ReactNode
  children: ReactNode
  className?: string
  headerClassName?: string
  toolbarClassName?: string
  contentClassName?: string
  variant?: 'default' | 'compact'
}

export function PageCard({
  title,
  description,
  headerActions,
  toolbar,
  children,
  className,
  headerClassName,
  toolbarClassName,
  contentClassName,
  variant = 'default',
}: PageCardProps) {
  const isCompact = variant === 'compact'

  return (
    <Card className={cn('w-full max-w-full min-w-0 rounded-2xl border', className)}>
      {/* Header Section */}
      <div className={cn(
        'flex items-center justify-between p-6 min-w-0',
        isCompact && 'p-4',
        !description && !toolbar && 'pb-4',
        description && !toolbar && 'pb-4',
        headerClassName
      )}>
        <div className="flex flex-col gap-1 min-w-0">
          <CardTitle className={cn('text-2xl', isCompact && 'text-xl')}>
            {title}
          </CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </div>
        {headerActions && (
          <div className="shrink-0">
            {headerActions}
          </div>
        )}
      </div>

      {/* Toolbar Section (filters, actions, etc.) */}
      {toolbar && (
        <CardHeader className={cn('space-y-4 pt-0 min-w-0 overflow-x-hidden', toolbarClassName)}>
          {toolbar}
        </CardHeader>
      )}

      {/* Content Section */}
      <CardContent className={cn('space-y-4 min-w-0 overflow-x-hidden', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}

