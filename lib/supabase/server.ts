import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = []
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  
  throw new Error(
    `Missing required Supabase environment variables: ${missing.join(', ')}\n` +
    'Please check your environment variables in Vercel (Settings > Environment Variables) or your .env file.'
  )
}

// Type assertion: after validation, these are guaranteed to be strings
const validatedSupabaseUrl: string = supabaseUrl
const validatedSupabaseAnonKey: string = supabaseAnonKey

export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseServerClient(
    validatedSupabaseUrl,
    validatedSupabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Export alias for backward compatibility
export const createClient = createServerClient
