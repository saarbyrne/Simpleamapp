'use client'

import { SubFeatureMetadata } from '@/lib/permissions/feature-metadata'
import { FeatureToggleSwitch } from './FeatureToggleSwitch'

interface SubFeatureToggleProps {
  subFeature: SubFeatureMetadata
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function SubFeatureToggle({
  subFeature,
  checked,
  onCheckedChange,
  disabled = false,
}: SubFeatureToggleProps) {
  return (
    <div className="ms-6 py-3 border-l-2 border-muted ps-4">
      <FeatureToggleSwitch
        id={subFeature.key}
        label={subFeature.label}
        description={subFeature.description}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  )
}

