import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await db.user.findUnique({
      where: { email: user.email! },
      select: { organizationId: true }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const insights = await db.aIInsight.findMany({
      where: {
        orgId: dbUser.organizationId,
        status: 'active'
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 20
    })

    const response = NextResponse.json({ insights })

    // Cache for 2 minutes - insights don't change frequently
    response.headers.set('Cache-Control', 'private, max-age=120, stale-while-revalidate=600')

    return response
  } catch (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await db.user.findUnique({
      where: { email: user.email! },
      select: { organizationId: true }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { insightId, action } = await request.json()

    if (!insightId || !action) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // SECURITY: Verify insight belongs to user's organization before updating
    const insight = await db.aIInsight.findFirst({
      where: {
        id: insightId,
        orgId: dbUser.organizationId // Authorization check
      }
    })

    if (!insight) {
      return NextResponse.json(
        { error: 'Insight not found or access denied' },
        { status: 404 }
      )
    }

    // Now update the insight
    if (action === 'dismiss') {
      await db.aIInsight.update({
        where: { id: insightId },
        data: {
          status: 'dismissed',
          dismissedAt: new Date()
        }
      })
    } else if (action === 'act_on') {
      await db.aIInsight.update({
        where: { id: insightId },
        data: {
          status: 'acted_on'
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating insight:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
