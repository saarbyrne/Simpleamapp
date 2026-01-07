import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { applyPackageDefaultsToOrganization } from '@/lib/permissions/feature-access'
import { logPlatformAdminAction } from '@/lib/platform-admin'

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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
