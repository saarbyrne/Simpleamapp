'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FeatureMetadata } from '@/lib/permissions/feature-metadata'
import { FeatureToggleSwitch } from './FeatureToggleSwitch'
import { SubFeatureToggle } from './SubFeatureToggle'
import { Badge } from '@/components/ui/badge'

interface FeatureToggleCardProps {
  feature: FeatureMetadata
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  subFeatureStates?: Record<string, boolean>
  onSubFeatureChange?: (subFeatureKey: string, checked: boolean) => void
}

export function FeatureToggleCard({
  feature,
  checked,
  onCheckedChange,
  subFeatureStates = {},
  onSubFeatureChange,
}: FeatureToggleCardProps) {
  const Icon = feature.icon
  const hasSubFeatures = feature.subFeatures.length > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {feature.label}
                {hasSubFeatures && (
                  <Badge variant="secondary" className="text-xs">
                    {feature.subFeatures.length} sub-features
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <FeatureToggleSwitch
          id={feature.key}
          label={`Enable ${feature.label}`}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />

        {hasSubFeatures && checked && (
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-muted-foreground">Sub-features</p>
            {feature.subFeatures.map((subFeature) => (
              <SubFeatureToggle
                key={subFeature.key}
                subFeature={subFeature}
                checked={subFeatureStates[subFeature.fieldName] ?? true}
                onCheckedChange={(checked) =>
                  onSubFeatureChange?.(subFeature.fieldName, checked)
                }
                disabled={!checked}
              />
            ))}
          </div>
        )}

        {hasSubFeatures && !checked && (
          <p className="text-sm text-muted-foreground italic">
            Enable this feature to configure sub-features
          </p>
        )}
      </CardContent>
    </Card>
  )
}

