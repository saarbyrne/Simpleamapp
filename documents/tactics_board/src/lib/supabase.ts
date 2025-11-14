import { createClient } from '@supabase/supabase-js'
import { supabaseConfig, isDemoMode } from './config'

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          role: 'coach' | 'player' | 'guest' | 'admin'
          team_id?: string
          club_id?: string
          created_at: string
          updated_at?: string
        }
        Insert: {
          id: string
          email: string
          role: 'coach' | 'player' | 'guest' | 'admin'
          team_id?: string
          club_id?: string
          created_at: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'coach' | 'player' | 'guest' | 'admin'
          team_id?: string
          club_id?: string
          updated_at?: string
        }
      }
      players: {
        Row: {
          id: string
          name: string
          jersey_number?: number
          position: string
          team_id: string
          coach_id: string
          age?: number
          status: 'active' | 'injured' | 'suspended' | 'inactive'
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          name: string
          jersey_number?: number
          position: string
          team_id: string
          coach_id: string
          age?: number
          status?: 'active' | 'injured' | 'suspended' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          jersey_number?: number
          position?: string
          team_id?: string
          coach_id?: string
          age?: number
          status?: 'active' | 'injured' | 'suspended' | 'inactive'
          updated_at?: string
        }
      }
      tactical_boards: {
        Row: {
          id: string
          title: string
          description?: string
          formation: string
          phase_of_play?: string
          board_data: any
          coach_id: string
          team_id?: string
          is_template: boolean
          tags: string[]
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          formation: string
          phase_of_play?: string
          board_data: any
          coach_id: string
          team_id?: string
          is_template?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          formation?: string
          phase_of_play?: string
          board_data?: any
          coach_id?: string
          team_id?: string
          is_template?: boolean
          tags?: string[]
          updated_at?: string
        }
      }
    }
  }
}

// Mock data storage for demo mode
class MockSupabaseClient {
  private storage = {
    users: new Map<string, any>(),
    players: new Map<string, any>(),
    tacticalBoards: new Map<string, any>(),
    userProfiles: new Map<string, any>(),
  }

  private currentUser: any = null

  auth = {
    getSession: async () => {
      return { data: { session: this.currentUser ? { user: this.currentUser } : null } }
    },
    
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Mock successful authentication for demo
      this.currentUser = {
        id: 'demo-coach-' + Math.random().toString(36).substr(2, 9),
        email,
        created_at: new Date().toISOString(),
      }
      
      // Create user profile
      this.storage.userProfiles.set(this.currentUser.id, {
        id: this.currentUser.id,
        email,
        role: 'coach',
        created_at: new Date().toISOString(),
      })
      
      return { data: { user: this.currentUser }, error: null }
    },
    
    signUp: async ({ email, password }: { email: string; password: string }) => {
      this.currentUser = {
        id: 'demo-user-' + Math.random().toString(36).substr(2, 9),
        email,
        created_at: new Date().toISOString(),
      }
      return { data: { user: this.currentUser }, error: null }
    },
    
    signOut: async () => {
      this.currentUser = null
      return { error: null }
    },
    
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simulate auth state change
      setTimeout(() => {
        callback('SIGNED_IN', this.currentUser ? { user: this.currentUser } : null)
      }, 100)
      
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        } 
      }
    },
  }
  
  from = (table: string) => {
    const storage = this.storage as any
    const tableStorage = storage[this.camelCase(table)] || new Map()
    
    return {
      select: (columns = '*') => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            if (table === 'user_profiles' && column === 'id') {
              const profile = this.storage.userProfiles.get(value)
              return { data: profile || null, error: profile ? null : new Error('Not found') }
            }
            
            const items = Array.from(tableStorage.values()).filter((item: any) => item[column] === value)
            return { data: items[0] || null, error: null }
          },
          order: (orderColumn: string, options?: any) => ({
            then: async (resolve: any) => {
              const items = Array.from(tableStorage.values()).filter((item: any) => item[column] === value)
              resolve({ data: items, error: null })
            }
          })
        }),
        order: (orderColumn: string, options?: any) => ({
          then: async (resolve: any) => {
            const items = Array.from(tableStorage.values())
            resolve({ data: items, error: null })
          }
        })
      }),
      
      insert: (data: any | any[]) => ({
        select: () => ({
          single: async () => {
            const records = Array.isArray(data) ? data : [data]
            const newRecord = {
              id: 'mock-' + Math.random().toString(36).substr(2, 9),
              ...records[0],
              created_at: new Date().toISOString(),
            }
            tableStorage.set(newRecord.id, newRecord)
            return { data: newRecord, error: null }
          }
        })
      }),
      
      update: (updates: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: async () => {
              const existing = Array.from(tableStorage.values()).find((item: any) => item[column] === value)
              if (existing) {
                const updated = {
                  ...existing,
                  ...updates,
                  updated_at: new Date().toISOString(),
                }
                tableStorage.set(existing.id, updated)
                return { data: updated, error: null }
              }
              return { data: null, error: new Error('Not found') }
            }
          })
        })
      }),
      
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async (resolve: any) => {
            const items = Array.from(tableStorage.entries())
            const itemToDelete = items.find(([id, item]: [string, any]) => item[column] === value)
            if (itemToDelete) {
              tableStorage.delete(itemToDelete[0])
            }
            resolve({ error: null })
          }
        })
      })
    }
  }
  
  private camelCase(str: string): string {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
  }
}

// Create the appropriate client based on mode
function createSupabaseClient() {
  if (isDemoMode) {
    return new MockSupabaseClient()
  }
  
  return createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Single export point
export const supabase = createSupabaseClient()
export default supabase