'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/platform-admin/page-header'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { FeatureToggleCard } from '@/components/platform-admin/FeatureToggleCard'
import { BulkFeatureActions } from '@/components/platform-admin/BulkFeatureActions'
import { getAllFeatures } from '@/lib/permissions/feature-metadata'
import {
  getOrganizationFeaturesAction,
  updateOrganizationFeaturesAction,
  enableAllFeaturesAction,
  disableAllFeaturesAction,
  resetOrganizationFeaturesAction,
} from '@/app/actions/organization-features'
import { OrganizationFeatures } from '@prisma/client'
import { Skeleton } from '@/components/ui/skeleton'

export default function OrganizationFeaturesPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.id as string

  const [features, setFeatures] = useState<OrganizationFeatures | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [localFeatures, setLocalFeatures] = useState<Partial<OrganizationFeatures>>({})

  const allFeatures = getAllFeatures()

  // Load features on mount
  useEffect(() => {
    loadFeatures()
  }, [orgId])

  async function loadFeatures() {
    setIsLoading(true)
    const result = await getOrganizationFeaturesAction(orgId)
    
    if (result.success && result.features) {
      setFeatures(result.features)
      setLocalFeatures(result.features)
    } else {
      toast.error(result.error || 'Failed to load features')
    }
    
    setIsLoading(false)
  }

  function handleFeatureToggle(fieldName: string, checked: boolean) {
    setLocalFeatures((prev) => ({
      ...prev,
      [fieldName]: checked,
    }))
    setHasChanges(true)
  }

  async function handleSave() {
    if (!hasChanges) return

    setIsSaving(true)
    const result = await updateOrganizationFeaturesAction(orgId, localFeatures)
    
    if (result.success && result.features) {
      setFeatures(result.features)
      setLocalFeatures(result.features)
      setHasChanges(false)
      toast.success('Features updated successfully')
    } else {
      toast.error(result.error || 'Failed to update features')
    }
    
    setIsSaving(false)
  }

  async function handleEnableAll() {
    setIsSaving(true)
    const result = await enableAllFeaturesAction(orgId)
    
    if (result.success && result.features) {
      setFeatures(result.features)
      setLocalFeatures(result.features)
      setHasChanges(false)
      toast.success('All features enabled')
    } else {
      toast.error(result.error || 'Failed to enable all features')
    }
    
    setIsSaving(false)
  }

  async function handleDisableAll() {
    setIsSaving(true)
    const result = await disableAllFeaturesAction(orgId)
    
    if (result.success && result.features) {
      setFeatures(result.features)
      setLocalFeatures(result.features)
      setHasChanges(false)
      toast.success('All features disabled')
    } else {
      toast.error(result.error || 'Failed to disable all features')
    }
    
    setIsSaving(false)
  }

  async function handleReset() {
    setIsSaving(true)
    const result = await resetOrganizationFeaturesAction(orgId)
    
    if (result.success && result.features) {
      setFeatures(result.features)
      setLocalFeatures(result.features)
      setHasChanges(false)
      toast.success('Features reset to defaults')
    } else {
      toast.error(result.error || 'Failed to reset features')
    }
    
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <PageHeader
          title="Feature Management"
          description="Loading..."
        >
          <Button variant="outline" size="sm" asChild>
            <Link href={`/platform-admin/organizations/${orgId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </PageHeader>

        <div className="flex-1 space-y-6 p-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Feature Management"
        description="Control which features are available for this organization"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/platform-admin/organizations/${orgId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          {hasChanges && (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </PageHeader>

      <div className="flex-1 space-y-6 p-8">
        {/* Bulk Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">
              Apply changes to all features at once
            </p>
          </div>
          <BulkFeatureActions
            onEnableAll={handleEnableAll}
            onDisableAll={handleDisableAll}
            onReset={handleReset}
            isLoading={isSaving}
          />
        </div>

        {/* Feature Cards */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Main Features</h3>
            <div className="grid gap-4">
              {allFeatures.map((feature) => {
                const mainFeatureChecked = localFeatures[feature.fieldName as keyof OrganizationFeatures] as boolean ?? true
                
                // Build sub-feature states
                const subFeatureStates: Record<string, boolean> = {}
                feature.subFeatures.forEach((sf) => {
                  subFeatureStates[sf.fieldName] = localFeatures[sf.fieldName as keyof OrganizationFeatures] as boolean ?? true
                })

                return (
                  <FeatureToggleCard
                    key={feature.key}
                    feature={feature}
                    checked={mainFeatureChecked}
                    onCheckedChange={(checked) =>
                      handleFeatureToggle(feature.fieldName, checked)
                    }
                    subFeatureStates={subFeatureStates}
                    onSubFeatureChange={(subFeatureKey, checked) =>
                      handleFeatureToggle(subFeatureKey, checked)
                    }
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Save Button at Bottom */}
        {hasChanges && (
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

