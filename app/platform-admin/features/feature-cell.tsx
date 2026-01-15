'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FeatureKey } from '@/lib/permissions/feature-metadata'
import { featureStatusColors } from '@/design-system/tokens/status-colors'

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
        !isReleased && 'bg-warning/10',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && 'hover:bg-muted/50 cursor-pointer'
      )}
      title={!isReleased ? 'In Development' : undefined}
    >
      {isEnabled ? (
        <Check className={`h-4 w-4 ${featureStatusColors.enabled}`} />
      ) : (
        <X className={`h-4 w-4 ${featureStatusColors.disabled}`} />
      )}
    </button>
  )
}
