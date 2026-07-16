import { NextRequest, NextResponse } from 'next/server'
import { applyPackageDefaultsToOrganization } from '@/lib/permissions/feature-access'
import { requirePlatformAdmin, logPlatformAdminAction } from '@/lib/platform-admin'

/**
 * POST /api/platform-admin/organizations/[id]/features/apply-package
 * Apply package defaults to an organization
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify platform admin
    try {
      await requirePlatformAdmin()
    } catch {
      return NextResponse.json({ error: 'Platform admin access required' }, { status: 403 })
    }

    const orgId = params.id

    // Apply package defaults
    const updated = await applyPackageDefaultsToOrganization(orgId)
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to apply package defaults' },
        { status: 500 }
      )
    }

    await logPlatformAdminAction('apply_package_defaults', {
      organizationId: orgId,
    })

    return NextResponse.json({ success: true, features: updated })
  } catch (error) {
    console.error('Error applying package defaults:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
