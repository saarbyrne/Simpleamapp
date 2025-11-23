'use client'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FeatureToggleSwitchProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function FeatureToggleSwitch({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: FeatureToggleSwitchProps) {
  return (
    <div className={cn('flex items-center justify-between space-x-4', className)}>
      <div className="flex-1 space-y-1">
        <Label
          htmlFor={id}
          className={cn(
            'text-sm font-medium leading-none cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  )
}

