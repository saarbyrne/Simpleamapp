'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FeatureKey } from '@/lib/permissions/feature-metadata'

interface FeatureCellProps {
  orgId: string
  feature: FeatureKey
  isEnabled: boolean
  isReleased: boolean
  onToggle: (orgId: string, feature: FeatureKey, enabled: boolean) => void
  disabled?: boolean
}

export function FeatureCell({
  orgId,
  feature,
  isEnabled,
  isReleased,
  onToggle,
  disabled = false,
}: FeatureCellProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent row selection
    if (!disabled) {
      onToggle(orgId, feature, !isEnabled)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      type="button"
      className={cn(
        'flex h-10 w-full items-center justify-center rounded transition-colors',
        !isReleased && 'bg-amber-50 dark:bg-amber-950',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && 'hover:bg-muted/50 cursor-pointer'
      )}
      title={!isReleased ? 'In Development' : undefined}
    >
      {isEnabled ? (
        <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-600 dark:text-red-500" />
      )}
    </button>
  )
}
