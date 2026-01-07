'use client'

import { useState, useEffect, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageCard } from '@/components/ui/page-card'
import { OrganizationFeatures } from '@prisma/client'
import { getAllFeatures, FeatureKey, FEATURE_METADATA } from '@/lib/permissions/feature-metadata'
import { SubscriptionTier, TIER_DISPLAY_INFO } from '@/lib/permissions/subscription-tiers'
import {
  getOrganizationsWithFeatures,
  bulkApplyPackageDefaults,
  bulkEnableFeature,
  bulkDisableFeature,
  toggleFeature,
} from '@/app/actions/feature-matrix'
import { FeatureCell } from './feature-cell'
import { FeatureBulkActions } from './feature-bulk-actions'
import { DataTable } from '@/components/data-table/data-table'

type OrgWithFeatures = {
  id: string
  name: string
  tier: SubscriptionTier
  features: OrganizationFeatures
}

export function OrganizationsFeaturesTable() {
  const [data, setData] = useState<OrgWithFeatures[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [rowSelection, setRowSelection] = useState({})
  const [isBulkProcessing, setIsBulkProcessing] = useState(false)

  const allFeatures = getAllFeatures()

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    const result = await getOrganizationsWithFeatures()
    if (result.success && result.data) {
      setData(result.data)
    }
    setIsLoading(false)
  }

  // Handle feature toggle
  async function handleToggle(orgId: string, feature: FeatureKey, enabled: boolean) {
    try {
      // Optimistic update for instant UI feedback
      setData(prev =>
        prev.map(org =>
          org.id === orgId
            ? {
                ...org,
                features: {
                  ...org.features,
                  [`${FEATURE_METADATA[feature].fieldName}`]: enabled,
                },
              }
            : org
        )
      )
      
      // Save to database
      const result = await toggleFeature(orgId, feature, enabled)
      
      if (!result.success) {
        // Revert optimistic update on error
        await loadData()
      }
    } catch (error) {
      console.error('Error toggling feature:', error)
      // Revert on error
      await loadData()
    }
  }

  // Bulk actions
  async function handleBulkApplyPackage(tier: SubscriptionTier) {
    const selectedIds = Object.keys(rowSelection).map(index => data[parseInt(index)].id)
    
    if (selectedIds.length === 0) return

    setIsBulkProcessing(true)
    const result = await bulkApplyPackageDefaults(selectedIds, tier)
    
    if (result.success) {
      await loadData()
      setRowSelection({})
    }
    setIsBulkProcessing(false)
  }

  async function handleBulkEnable(feature: FeatureKey) {
    const selectedIds = Object.keys(rowSelection).map(index => data[parseInt(index)].id)
    
    if (selectedIds.length === 0) return

    setIsBulkProcessing(true)
    await bulkEnableFeature(selectedIds, feature)
    await loadData()
    setIsBulkProcessing(false)
  }

  async function handleBulkDisable(feature: FeatureKey) {
    const selectedIds = Object.keys(rowSelection).map(index => data[parseInt(index)].id)
    
    if (selectedIds.length === 0) return

    setIsBulkProcessing(true)
    await bulkDisableFeature(selectedIds, feature)
    await loadData()
    setIsBulkProcessing(false)
  }

  // Table columns
  const columns = useMemo<ColumnDef<OrgWithFeatures>[]>(() => {
    const baseColumns: ColumnDef<OrgWithFeatures>[] = [
      {
        accessorKey: 'name',
        header: 'Organization',
        size: 250,
        cell: ({ row }) => (
          <div className="font-medium">{row.original.name}</div>
        ),
      },
      {
        accessorKey: 'tier',
        header: 'Tier',
        size: 120,
        cell: ({ row }) => {
          const tier = row.original.tier
          const tierInfo = TIER_DISPLAY_INFO[tier]
          return (
            <Badge className={tierInfo.color}>
              {tierInfo.label}
            </Badge>
          )
        },
      },
    ]

    // Add feature columns
    const featureColumns: ColumnDef<OrgWithFeatures>[] = allFeatures.map(feature => ({
      id: feature.key,
      header: feature.label,
      size: 120,
      enableSorting: false,
      cell: ({ row }) => {
        const isEnabled = row.original.features[
          feature.fieldName as keyof OrganizationFeatures
        ] as boolean
        
        return (
          <FeatureCell
            orgId={row.original.id}
            feature={feature.key}
            isEnabled={isEnabled}
            isReleased={feature.released}
            onToggle={handleToggle}
            disabled={isBulkProcessing}
          />
        )
      },
    }))

    return [...baseColumns, ...featureColumns]
  }, [allFeatures, isBulkProcessing])

  const selectedCount = Object.keys(rowSelection).length

  if (isLoading) {
    return (
      <PageCard
        title="Feature Management"
        description="Manage features across all organizations"
        variant="table"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading organizations...</div>
        </div>
      </PageCard>
    )
  }

  return (
    <PageCard
      title="Feature Management"
      description="Manage features across all organizations"
      variant="table"
    >
      {/* Custom Bulk Actions Bar */}
      <FeatureBulkActions
        selectedCount={selectedCount}
        onApplyPackage={handleBulkApplyPackage}
        onEnableFeature={handleBulkEnable}
        onDisableFeature={handleBulkDisable}
        onClear={() => setRowSelection({})}
        isLoading={isBulkProcessing}
      />

      <DataTable
        data={data}
        columns={columns}
        enableRowSelection={true}
        enableBulkActions={false} // Disable built-in bulk actions, using custom
        enableExport={false}
        enableColumnVisibility={true}
        enableColumnReordering={false}
        enableColumnResizing={true}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        emptyMessage="No organizations found."
      />
    </PageCard>
  )
}
