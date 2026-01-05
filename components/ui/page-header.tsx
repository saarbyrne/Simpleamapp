'use client'

import { ReactNode } from 'react'
import { CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: ReactNode
  description?: string
  headerActions?: ReactNode
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  variant?: 'default' | 'compact'
}

export function PageHeader({
  title,
  description,
  headerActions,
  className,
  titleClassName,
  descriptionClassName,
  variant = 'default',
}: PageHeaderProps) {
  const isCompact = variant === 'compact'

  return (
    <div className={cn(
      'flex items-center justify-between min-w-0',
      className
    )}>
      <div className="flex flex-col gap-1 min-w-0">
        <CardTitle className={cn('text-2xl', isCompact && 'text-xl', titleClassName)}>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className={descriptionClassName}>
            {description}
          </CardDescription>
        )}
      </div>
      {headerActions && (
        <div className="shrink-0">
          {headerActions}
        </div>
      )}
    </div>
  )
}
