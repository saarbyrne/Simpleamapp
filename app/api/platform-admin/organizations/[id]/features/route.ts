import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePlatformAdmin } from '@/lib/platform-admin'
import { getOrganizationFeatures, updateOrganizationFeatures, getOrganizationTier } from '@/lib/permissions/feature-access'

/**
 * GET /api/platform-admin/organizations/[id]/features
 * Get organization details with features
 */
export async function GET(
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

    // Get organization
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { id: true, name: true },
    })

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Get features
    const features = await getOrganizationFeatures(orgId)
    if (!features) {
      return NextResponse.json({ error: 'Features not found' }, { status: 404 })
    }

    // Get tier
    const tier = await getOrganizationTier(orgId)

    return NextResponse.json({
      id: org.id,
      name: org.name,
      tier,
      features,
    })
  } catch (error) {
    console.error('Error fetching organization features:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/platform-admin/organizations/[id]/features
 * Update organization features
 */
export async function PATCH(
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
    const updates = await request.json()

    // Update features
    const updated = await updateOrganizationFeatures(orgId, updates)
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update features' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, features: updated })
  } catch (error) {
    console.error('Error updating organization features:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
