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
      select: { id: true, organizationId: true }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let settings = await db.aISettings.findUnique({
      where: { userId: dbUser.id }
    })

    // Create default settings if they don't exist
    if (!settings) {
      settings = await db.aISettings.create({
        data: {
          orgId: dbUser.organizationId,
          userId: dbUser.id,
          injuryRiskAlerts: true,
          wellnessAlerts: true,
          loadAlerts: true,
          formCompletionAlerts: true,
          alertFrequency: 'real_time',
          dataAccess: {
            playerWellness: true,
            loadData: true,
            medicalNotes: false,
            formResponses: true,
            eventAttendance: true,
            privateNotes: false
          },
          monthlyTokenLimit: 1000000,
          tokensUsedThisMonth: 0
        }
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching AI settings:', error)
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
      select: { id: true, organizationId: true }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()

    const settings = await db.aISettings.upsert({
      where: { userId: dbUser.id },
      update: {
        injuryRiskAlerts: body.injuryRiskAlerts,
        wellnessAlerts: body.wellnessAlerts,
        loadAlerts: body.loadAlerts,
        formCompletionAlerts: body.formCompletionAlerts,
        alertFrequency: body.alertFrequency,
        dataAccess: body.dataAccess,
        monthlyTokenLimit: body.monthlyTokenLimit
      },
      create: {
        orgId: dbUser.organizationId,
        userId: dbUser.id,
        injuryRiskAlerts: body.injuryRiskAlerts,
        wellnessAlerts: body.wellnessAlerts,
        loadAlerts: body.loadAlerts,
        formCompletionAlerts: body.formCompletionAlerts,
        alertFrequency: body.alertFrequency,
        dataAccess: body.dataAccess,
        monthlyTokenLimit: body.monthlyTokenLimit,
        tokensUsedThisMonth: 0
      }
    })

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Error saving AI settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
