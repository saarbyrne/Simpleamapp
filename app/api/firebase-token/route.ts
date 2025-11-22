import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import admin from 'firebase-admin'
import { db } from '@/lib/db'

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  // Use service account credentials from environment
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated Supabase user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user organization from database
    const dbUser = await db.user.findUnique({
      where: { email: user.email! },
      select: { organizationId: true, permissions: true, isPlatformAdmin: true }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create custom token with organization context
    const customToken = await admin.auth().createCustomToken(user.id, {
      organizationId: dbUser.organizationId,
      permissions: dbUser.permissions || [],
      isPlatformAdmin: dbUser.isPlatformAdmin || false,
      email: user.email,
    })

    return NextResponse.json({ token: customToken })
  } catch (error) {
    console.error('Firebase token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate authentication token' },
      { status: 500 }
    )
  }
}
