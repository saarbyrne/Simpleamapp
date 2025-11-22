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

    const response = NextResponse.json({ settings })

    // Cache for 5 minutes - settings change infrequently
    response.headers.set('Cache-Control', 'private, max-age=300, stale-while-revalidate=900')

    return response
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

    // SECURITY: Validate input with Zod schema
    const body = await request.json()
    const { AISettingsSchema } = await import('@/lib/api-validation')
    const validatedData = AISettingsSchema.parse(body)

    const settings = await db.aISettings.upsert({
      where: { userId: dbUser.id },
      update: {
        injuryRiskAlerts: validatedData.injuryRiskAlerts,
        wellnessAlerts: validatedData.wellnessAlerts,
        loadAlerts: validatedData.loadAlerts,
        formCompletionAlerts: validatedData.formCompletionAlerts,
        alertFrequency: validatedData.alertFrequency,
        dataAccess: validatedData.dataAccess,
        monthlyTokenLimit: validatedData.monthlyTokenLimit
      },
      create: {
        orgId: dbUser.organizationId,
        userId: dbUser.id,
        injuryRiskAlerts: validatedData.injuryRiskAlerts,
        wellnessAlerts: validatedData.wellnessAlerts,
        loadAlerts: validatedData.loadAlerts,
        formCompletionAlerts: validatedData.formCompletionAlerts,
        alertFrequency: validatedData.alertFrequency,
        dataAccess: validatedData.dataAccess,
        monthlyTokenLimit: validatedData.monthlyTokenLimit,
        tokensUsedThisMonth: 0
      }
    })

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error },
        { status: 400 }
      )
    }

    console.error('Error saving AI settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
