/**
 * Supabase Setup Script
 *
 * This script sets up:
 * 1. Storage bucket for player photos
 * 2. Row-Level Security (RLS) policies
 *
 * Run with: npx tsx scripts/setup-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupStorageBucket() {
  console.log('\n📦 Setting up Storage Bucket...')

  // Check if bucket exists
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(b => b.name === 'player-photos')

  if (bucketExists) {
    console.log('✅ Bucket "player-photos" already exists')
    return
  }

  // Create bucket
  const { data, error } = await supabase.storage.createBucket('player-photos', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  })

  if (error) {
    console.error('❌ Failed to create bucket:', error.message)
    return
  }

  console.log('✅ Created bucket "player-photos"')
}

async function setupRLSPolicies() {
  console.log('\n🔒 Setting up RLS Policies...')

  const sqlFile = join(process.cwd(), 'documents', 'RLS_POLICIES.sql')
  let sql: string

  try {
    sql = readFileSync(sqlFile, 'utf-8')
  } catch (error) {
    console.error('❌ Failed to read RLS_POLICIES.sql:', error)
    return
  }

  // Split into individual statements and execute
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  let successCount = 0
  let errorCount = 0

  for (const statement of statements) {
    const { error } = await supabase.rpc('exec_sql', { sql: statement })

    if (error) {
      // Some errors are expected (e.g., policy already exists)
      if (error.message.includes('already exists')) {
        successCount++
      } else {
        console.error(`❌ Error executing statement: ${error.message}`)
        errorCount++
      }
    } else {
      successCount++
    }
  }

  console.log(`✅ Executed ${successCount} statements successfully`)
  if (errorCount > 0) {
    console.log(`⚠️  ${errorCount} statements had errors`)
  }
}

async function verifySetup() {
  console.log('\n🔍 Verifying Setup...')

  // Check storage bucket
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucket = buckets?.find(b => b.name === 'player-photos')

  if (bucket) {
    console.log('✅ Storage bucket verified')
  } else {
    console.log('❌ Storage bucket not found')
  }

  // Check RLS
  const { data, error } = await supabase
    .from('organizations')
    .select('id')
    .limit(1)

  if (error && error.message.includes('row-level security')) {
    console.log('✅ RLS is enabled (expected error for unauthenticated request)')
  } else if (!error) {
    console.log('⚠️  RLS might not be enabled (no error for unauthenticated request)')
  }
}

async function main() {
  console.log('🚀 Starting Supabase Setup...')
  console.log(`📍 URL: ${supabaseUrl}`)

  await setupStorageBucket()
  await setupRLSPolicies()
  await verifySetup()

  console.log('\n✅ Setup complete!')
  console.log('\nNext steps:')
  console.log('1. Verify storage bucket in Supabase Dashboard')
  console.log('2. Test file upload functionality')
  console.log('3. Test RLS policies with different user roles')
}

main().catch(console.error)
