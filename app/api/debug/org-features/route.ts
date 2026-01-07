import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'

/**
 * Debug endpoint to check organization features
 * GET /api/debug/org-features?orgId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    // Verify platform admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const orgId = searchParams.get('orgId')
    
    console.log('Debug API called with searchParams:', Object.fromEntries(searchParams.entries()))
    console.log('orgId:', orgId)

    if (!orgId) {
      return NextResponse.json({ 
        error: 'orgId required',
        receivedParams: Object.fromEntries(searchParams.entries())
      }, { status: 400 })
    }

    // Get organization with features
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        features: true,
        subscriptions: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    return NextResponse.json({
      organization: {
        id: org.id,
        name: org.name,
        tier: org.subscriptions[0]?.plan || 'free',
      },
      features: org.features,
      hasFeatures: !!org.features,
    })
  } catch (error) {
    console.error('Error in debug endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
