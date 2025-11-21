import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // SECURITY: Validate redirect URL to prevent open redirect vulnerability
  const allowedPaths = [
    '/dashboard',
    '/players',
    '/profile',
    '/calendar',
    '/forms',
    '/files',
    '/chat',
    '/ai',
    '/canvas',
    '/reports',
    '/planner',
    '/templates',
    '/data-management',
    '/system-settings',
    '/setup'
  ]

  // Check if the path is allowed
  const isAllowedPath = allowedPaths.some(path => next.startsWith(path))
  // Ensure it's a relative path and doesn't try to escape to another domain
  const isRelativePath = next.startsWith('/') && !next.startsWith('//')

  const sanitizedNext = (isAllowedPath && isRelativePath)
    ? next
    : '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${sanitizedNext}`)
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}
