// Configuration for LuvFutbol app
// This handles environment variables in a way that works in both browser and server contexts

interface AppConfig {
  supabase: {
    url: string
    anonKey: string
  }
  isDevelopment: boolean
  isDemo: boolean
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Configuration with fallbacks for demo environment
export const config: AppConfig = {
  supabase: {
    url: isBrowser 
      ? 'https://demo.supabase.co' 
      : (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || 'https://demo.supabase.co',
    anonKey: isBrowser 
      ? 'demo-anon-key' 
      : (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) || 'demo-anon-key'
  },
  isDevelopment: isBrowser ? true : (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'),
  isDemo: true // Set to true for demo purposes
}

// Demo mode detection
export const isDemoMode = config.isDemo || config.supabase.url.includes('demo') || config.supabase.anonKey.includes('demo')

// Export individual config values for convenience
export const { supabase: supabaseConfig } = config