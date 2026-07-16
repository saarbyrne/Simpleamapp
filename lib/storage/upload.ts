'use server'

import { createClient } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

export async function uploadPlayerPhoto(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const file = formData.get('file') as File
  if (!file) {
    return { error: 'No file provided' }
  }

  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' }
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { error: 'File too large. Maximum size is 5MB.' }
  }

  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${randomUUID()}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('people-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Storage upload error:', error)
      return { error: 'Failed to upload file' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('people-photos')
      .getPublicUrl(data.path)

    return { url: publicUrl, path: data.path }
  } catch (error) {
    console.error('Upload error:', error)
    return { error: 'Failed to upload file' }
  }
}

export async function deletePlayerPhoto(path: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Uploads are namespaced under `${user.id}/...` (see uploadPlayerPhoto
  // above). Enforce the same namespace on delete so a caller cannot remove
  // another tenant's file by passing an arbitrary path.
  if (!path.startsWith(`${user.id}/`)) {
    return { error: 'Not authorized to delete this file' }
  }

  try {
    const { error } = await supabase.storage
      .from('people-photos')
      .remove([path])

    if (error) {
      console.error('Storage delete error:', error)
      return { error: 'Failed to delete file' }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { error: 'Failed to delete file' }
  }
}
