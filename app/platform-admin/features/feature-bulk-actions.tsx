'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Package } from 'lucide-react'
import { FeatureKey, getAllFeatures } from '@/lib/permissions/feature-metadata'
import { SubscriptionTier } from '@/lib/permissions/subscription-tiers'

interface FeatureBulkActionsProps {
  selectedCount: number
  onApplyPackage: (tier: SubscriptionTier) => void
  onEnableFeature: (featureKey: FeatureKey) => void
  onDisableFeature: (featureKey: FeatureKey) => void
  onClear: () => void
  isLoading?: boolean
}

export function FeatureBulkActions({
  selectedCount,
  onApplyPackage,
  onEnableFeature,
  onDisableFeature,
  onClear,
  isLoading = false,
}: FeatureBulkActionsProps) {
  const allFeatures = getAllFeatures()

  if (selectedCount === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b">
      <span className="text-sm text-muted-foreground">
        {selectedCount} {selectedCount === 1 ? 'organization' : 'organizations'} selected
      </span>
      
      <div className="flex items-center gap-2 ms-auto">
        {/* Apply Package Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isLoading}>
              <Package className="me-2 h-4 w-4" />
              Apply Package
              <ChevronDown className="ms-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Select Package</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onApplyPackage('free')}>
              Free
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onApplyPackage('pro')}>
              Pro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onApplyPackage('enterprise')}>
              Enterprise
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Enable Feature Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isLoading}>
              Enable Feature
              <ChevronDown className="ms-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-96 overflow-y-auto">
            <DropdownMenuLabel>Select Feature</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allFeatures.map(feature => (
              <DropdownMenuItem
                key={feature.key}
                onClick={() => onEnableFeature(feature.key)}
              >
                {feature.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Disable Feature Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isLoading}>
              Disable Feature
              <ChevronDown className="ms-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-96 overflow-y-auto">
            <DropdownMenuLabel>Select Feature</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allFeatures.map(feature => (
              <DropdownMenuItem
                key={feature.key}
                onClick={() => onDisableFeature(feature.key)}
              >
                {feature.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Selection */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={isLoading}
        >
          Clear selection
        </Button>
      </div>
    </div>
  )
}
