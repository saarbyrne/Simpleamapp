import { createBrowserClient } from '@supabase/ssr'

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

export function createClient() {
  return createBrowserClient(validatedSupabaseUrl, validatedSupabaseAnonKey)
}
