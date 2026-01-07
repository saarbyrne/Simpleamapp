'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/platform-admin/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, Package, Info } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { getAllFeatures, FeatureKey } from '@/lib/permissions/feature-metadata'
import { TIER_DISPLAY_INFO, SubscriptionTier } from '@/lib/permissions/subscription-tiers'
import { OrganizationFeatures } from '@prisma/client'
import { cn } from '@/lib/utils'

// Server actions
async function getOrganizationDetails(orgId: string) {
  const response = await fetch(`/api/platform-admin/organizations/${orgId}/features`)
  if (!response.ok) throw new Error('Failed to fetch organization')
  return response.json()
}

async function updateFeatures(orgId: string, updates: Partial<OrganizationFeatures>) {
  const response = await fetch(`/api/platform-admin/organizations/${orgId}/features`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!response.ok) throw new Error('Failed to update features')
  return response.json()
}

async function applyPackage(orgId: string) {
  const response = await fetch(`/api/platform-admin/organizations/${orgId}/features/apply-package`, {
    method: 'POST',
  })
  if (!response.ok) throw new Error('Failed to apply package')
  return response.json()
}

type OrgData = {
  id: string
  name: string
  tier: SubscriptionTier
  features: OrganizationFeatures
}

export default function OrganizationFeaturesPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.id as string

  const [org, setOrg] = useState<OrgData | null>(null)
  const [localFeatures, setLocalFeatures] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isApplyingPackage, setIsApplyingPackage] = useState(false)

  const allFeatures = getAllFeatures()

  // Load organization data
  useEffect(() => {
    loadOrg()
  }, [orgId])

  async function loadOrg() {
    try {
      setIsLoading(true)
      const data = await getOrganizationDetails(orgId)
      setOrg(data)
      
      // Initialize local state
      const initial: Record<string, boolean> = {}
      for (const feature of allFeatures) {
        initial[feature.fieldName] = data.features[feature.fieldName] ?? false
      }
      setLocalFeatures(initial)
    } catch (error) {
      toast.error('Failed to load organization')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle feature
  function toggleFeature(fieldName: string) {
    setLocalFeatures(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }))
  }

  // Check if there are unsaved changes
  const hasChanges = org
    ? allFeatures.some(feature => {
        const current = localFeatures[feature.fieldName]
        const original = org.features[feature.fieldName as keyof OrganizationFeatures]
        return current !== original
      })
    : false

  // Save changes
  async function handleSave() {
    if (!org) return

    try {
      setIsSaving(true)
      
      // Build updates object
      const updates: Record<string, boolean> = {}
      for (const feature of allFeatures) {
        if (localFeatures[feature.fieldName] !== org.features[feature.fieldName as keyof OrganizationFeatures]) {
          updates[feature.fieldName] = localFeatures[feature.fieldName]
        }
      }

      await updateFeatures(orgId, updates)
      toast.success('Features updated successfully')
      await loadOrg() // Reload to sync
    } catch (error) {
      toast.error('Failed to save changes')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  // Apply package defaults
  async function handleApplyPackage() {
    if (!org) return

    try {
      setIsApplyingPackage(true)
      await applyPackage(orgId)
      toast.success(`Applied ${org.tier} package defaults`)
      await loadOrg() // Reload to show new values
    } catch (error) {
      toast.error('Failed to apply package')
      console.error(error)
    } finally {
      setIsApplyingPackage(false)
    }
  }

  // Reset changes
  function handleReset() {
    if (!org) return
    
    const reset: Record<string, boolean> = {}
    for (const feature of allFeatures) {
      reset[feature.fieldName] = org.features[feature.fieldName as keyof OrganizationFeatures] as boolean
    }
    setLocalFeatures(reset)
    toast.info('Changes discarded')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-muted-foreground">Organization not found</div>
        <Button asChild variant="outline">
          <Link href="/platform-admin/organizations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Organizations
          </Link>
        </Button>
      </div>
    )
  }

  const tierInfo = TIER_DISPLAY_INFO[org.tier]

  const headerActions = (
    <Button
      variant="outline"
      onClick={handleApplyPackage}
      disabled={isApplyingPackage || isSaving}
    >
      <Package className="mr-2 h-4 w-4" />
      Apply {tierInfo.label} Package
    </Button>
  )

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={`Features: ${org.name}`}
        description="Manage feature access for this organization"
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/platform-admin/organizations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Organizations
          </Link>
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-auto p-8 space-y-6">
        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Toggle features on or off for this organization. Click "Apply {tierInfo.label} Package" to reset all features to the tier's default configuration.
          </AlertDescription>
        </Alert>

        {/* Unsaved Changes Banner */}
        {hasChanges && (
          <div className="flex items-center gap-3 rounded-lg border bg-amber-50 dark:bg-amber-950 p-4">
            <span className="text-sm font-medium flex-1">You have unsaved changes</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isSaving}
            >
              Discard
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}

        {/* Features Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Features</CardTitle>
                <CardDescription className="mt-2">
                  Subscription Tier:{' '}
                  <Badge className={tierInfo.color}>
                    {tierInfo.label}
                  </Badge>
                </CardDescription>
              </div>
              {headerActions}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {allFeatures.map((feature, index) => {
              const isEnabled = localFeatures[feature.fieldName]
              
              return (
                <div key={feature.key}>
                  {index > 0 && <Separator className="my-4" />}
                  <div
                    className={cn(
                      'flex items-center justify-between gap-4 rounded-lg p-4 transition-colors',
                      !feature.released && 'bg-amber-50 dark:bg-amber-950',
                      isEnabled && 'bg-muted/50'
                    )}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={feature.key}
                          className="text-base font-medium cursor-pointer"
                        >
                          {feature.label}
                        </Label>
                        {!feature.released && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-amber-100 dark:bg-amber-900"
                          >
                            In Development
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <Switch
                      id={feature.key}
                      checked={isEnabled}
                      onCheckedChange={() => toggleFeature(feature.fieldName)}
                      disabled={isSaving || isApplyingPackage}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Bottom Save Button */}
        {hasChanges && (
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
            >
              Discard Changes
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
