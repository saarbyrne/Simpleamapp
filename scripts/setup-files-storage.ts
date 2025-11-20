/**
 * Files Storage Setup Script
 *
 * This script sets up RLS policies for the files storage bucket.
 *
 * Run with: npx tsx scripts/setup-files-storage.ts
 */

import { createClient } from '@supabase/supabase-js'

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

async function setupFilesStoragePolicies() {
  console.log('\n📁 Setting up Files Storage RLS Policies...')

  // SQL to set up RLS policies for the files bucket
  const policiesSQL = `
    -- Enable RLS on storage.objects (if not already enabled)
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "files_authenticated_upload" ON storage.objects;
    DROP POLICY IF EXISTS "files_authenticated_select" ON storage.objects;
    DROP POLICY IF EXISTS "files_authenticated_update" ON storage.objects;
    DROP POLICY IF EXISTS "files_authenticated_delete" ON storage.objects;

    -- Policy: Allow authenticated users to upload files to the files bucket
    CREATE POLICY "files_authenticated_upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'files');

    -- Policy: Allow authenticated users to view files in the files bucket
    CREATE POLICY "files_authenticated_select" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'files');

    -- Policy: Allow authenticated users to update files in the files bucket
    CREATE POLICY "files_authenticated_update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'files');

    -- Policy: Allow authenticated users to delete files in the files bucket
    CREATE POLICY "files_authenticated_delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'files');
  `

  try {
    // Execute the SQL using the service role client
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: policiesSQL
    })

    if (error) {
      console.error('❌ Failed to execute RLS policies:', error.message)
      console.log('\n💡 Alternative: Run this SQL manually in Supabase SQL Editor:')

      // Split the SQL and show each statement
      const statements = policiesSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      statements.forEach((statement, index) => {
        console.log(`\n${index + 1}. ${statement};`)
      })

      return false
    }

    console.log('✅ Files storage RLS policies created successfully')
    return true
  } catch (error) {
    console.error('❌ Error setting up RLS policies:', error)
    return false
  }
}

async function verifyFilesBucket() {
  console.log('\n🔍 Verifying Files Bucket...')

  try {
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message)
      return false
    }

    const bucket = buckets?.find(b => b.name === 'files')

    if (!bucket) {
      console.log('❌ Files bucket not found')
      console.log('💡 Please create the files bucket in Supabase Dashboard first')
      return false
    }

    console.log('✅ Files bucket exists:', {
      name: bucket.name,
      public: bucket.public,
      file_size_limit: bucket.file_size_limit,
      allowed_mime_types: bucket.allowed_mime_types
    })

    return true
  } catch (error) {
    console.error('❌ Error verifying bucket:', error)
    return false
  }
}

async function main() {
  console.log('🚀 Setting up Files Storage...')

  // Verify bucket exists
  const bucketExists = await verifyFilesBucket()
  if (!bucketExists) {
    console.log('\n❌ Please create the files bucket first, then run this script again.')
    process.exit(1)
  }

  // Setup RLS policies
  const policiesSuccess = await setupFilesStoragePolicies()

  if (policiesSuccess) {
    console.log('\n✅ Files storage setup complete!')
    console.log('\n🧪 Test the file upload functionality:')
    console.log('1. Start the dev server: npm run dev')
    console.log('2. Navigate to /dashboard/files')
    console.log('3. Try uploading a file')
  } else {
    console.log('\n⚠️  RLS policies setup failed. You may need to run the SQL manually.')
  }
}

main().catch(console.error)