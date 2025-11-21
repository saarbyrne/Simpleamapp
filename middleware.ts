import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Check request body size for POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentLength = request.headers.get('content-length')
    if (contentLength) {
      const sizeInBytes = parseInt(contentLength, 10)
      const maxSize = 10 * 1024 * 1024 // 10MB limit

      if (sizeInBytes > maxSize) {
        return new NextResponse(
          JSON.stringify({ error: 'Request payload too large. Maximum size is 10MB.' }),
          {
            status: 413,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
    }
  }

  // Handle Supabase session
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
