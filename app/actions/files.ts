'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { getTranslations } from 'next-intl/server'
import { generateStoragePath, sanitizeFilename } from '@/lib/files'

export interface FileMetadata {
  description?: string
  tags?: string[]
  visibility?: 'public' | 'medical' | 'coaches' | 'private'
  linkedEntities?: Array<{ type: string; id: string }>
}

export interface UploadFileResult {
  success?: boolean
  file?: any
  error?: string
}

export interface FileListResult {
  files: any[]
  total: number
  error?: string
}

/**
 * Upload a file to Supabase Storage and create database record
 */
export async function uploadFile(
  formData: FormData
): Promise<UploadFileResult> {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)
    const file = formData.get('file') as File

    if (!file) {
      return { error: 'No file provided' }
    }

    // Get metadata
    const description = formData.get('description') as string | null
    const tagsStr = formData.get('tags') as string | null
    const tags = tagsStr ? JSON.parse(tagsStr) : []
    const visibility = (formData.get('visibility') as string) || 'public'
    const linkedEntitiesStr = formData.get('linkedEntities') as string | null
    const linkedEntities = linkedEntitiesStr ? JSON.parse(linkedEntitiesStr) : []

    // Generate storage path
    const storagePath = generateStoragePath(
      dbUser.organizationId,
      file.name,
      user.id
    )

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { error: `Failed to upload file: ${uploadError.message}` }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(storagePath)

    // Create database record
    const dbFile = await prisma.file.create({
      data: {
        name: sanitizeFilename(file.name),
        originalName: file.name,
        path: storagePath,
        bucket: 'files',
        size: file.size,
        mimeType: file.type,
        url: publicUrl,
        description: description || undefined,
        tags: tags,
        visibility: visibility,
        organizationId: dbUser.organizationId,
        uploadedById: user.id,
        // Create links
        links: linkedEntities.length > 0 ? {
          create: linkedEntities.map((entity: { type: string; id: string }) => ({
            targetType: entity.type,
            targetId: entity.id,
          })),
        } : undefined,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        links: true,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'file_uploaded',
        data: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        },
        userId: user.id,
      },
    })

    revalidatePath('/dashboard/files')

    return { success: true, file: dbFile }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { error: 'Failed to upload file' }
  }
}

/**
 * Get files list with filtering and pagination
 */
export async function getFiles(params?: {
  search?: string
  mimeType?: string
  category?: string
  visibility?: string
  linkedToType?: string
  linkedToId?: string
  uploadedBy?: string
  tags?: string[]
  page?: number
  pageSize?: number
}): Promise<FileListResult> {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { files: [], total: 0, error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const page = params?.page || 0
    const pageSize = params?.pageSize || 20
    const skip = page * pageSize

    // Build where clause
    const where: any = {
      organizationId: dbUser.organizationId,
    }

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { tags: { has: params.search } },
      ]
    }

    if (params?.mimeType) {
      where.mimeType = { contains: params.mimeType }
    }

    if (params?.visibility) {
      where.visibility = params.visibility
    }

    if (params?.uploadedBy) {
      where.uploadedById = params.uploadedBy
    }

    if (params?.tags && params.tags.length > 0) {
      where.tags = { hasSome: params.tags }
    }

    if (params?.linkedToType && params?.linkedToId) {
      where.links = {
        some: {
          targetType: params.linkedToType,
          targetId: params.linkedToId,
        },
      }
    }

    // Get total count
    const total = await prisma.file.count({ where })

    // Get files
    const files = await prisma.file.findMany({
      where,
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        links: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    })

    return { files, total }
  } catch (error) {
    console.error('Error fetching files:', error)
    return { files: [], total: 0, error: 'Failed to fetch files' }
  }
}

/**
 * Update file metadata
 */
export async function updateFile(
  fileId: string,
  updates: {
    name?: string
    description?: string
    tags?: string[]
    visibility?: string
    linkedEntities?: Array<{ type: string; id: string }>
  }
) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify file belongs to organization
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!file) {
      return { error: 'File not found' }
    }

    // Update file
    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: {
        name: updates.name ? sanitizeFilename(updates.name) : undefined,
        description: updates.description,
        tags: updates.tags,
        visibility: updates.visibility,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        links: true,
      },
    })

    // Update links if provided
    if (updates.linkedEntities) {
      // Delete existing links
      await prisma.fileLink.deleteMany({
        where: { fileId },
      })

      // Create new links
      if (updates.linkedEntities.length > 0) {
        await prisma.fileLink.createMany({
          data: updates.linkedEntities.map((entity) => ({
            fileId,
            targetType: entity.type,
            targetId: entity.id,
          })),
        })
      }
    }

    revalidatePath('/dashboard/files')

    return { success: true, file: updatedFile }
  } catch (error) {
    console.error('Error updating file:', error)
    return { error: 'Failed to update file' }
  }
}

/**
 * Delete a file from storage and database
 */
export async function deleteFile(fileId: string) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Get file details
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!file) {
      return { error: 'File not found' }
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(file.bucket)
      .remove([file.path])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
      // Continue with database deletion even if storage fails
    }

    // Delete from database (cascade will delete links)
    await prisma.file.delete({
      where: { id: fileId },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'file_deleted',
        data: {
          fileName: file.name,
          fileType: file.mimeType,
        },
        userId: user.id,
      },
    })

    revalidatePath('/dashboard/files')

    return { success: true }
  } catch (error) {
    console.error('Error deleting file:', error)
    return { error: 'Failed to delete file' }
  }
}

/**
 * Bulk delete files
 */
export async function bulkDeleteFiles(fileIds: string[]) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Get all files
    const files = await prisma.file.findMany({
      where: {
        id: { in: fileIds },
        organizationId: dbUser.organizationId,
      },
    })

    if (files.length === 0) {
      return { error: 'No files found' }
    }

    // Delete from storage
    const paths = files.map((f: { path: string }) => f.path)
    const { error: storageError } = await supabase.storage
      .from('files')
      .remove(paths)

    if (storageError) {
      console.error('Storage deletion error:', storageError)
    }

    // Delete from database
    await prisma.file.deleteMany({
      where: {
        id: { in: fileIds },
        organizationId: dbUser.organizationId,
      },
    })

    revalidatePath('/dashboard/files')

    return { success: true, count: files.length }
  } catch (error) {
    console.error('Error bulk deleting files:', error)
    return { error: 'Failed to delete files' }
  }
}

/**
 * Get a signed URL for downloading a file
 */
export async function getFileDownloadUrl(fileId: string) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Get file details
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!file) {
      return { error: 'File not found' }
    }

    // Get signed URL (expires in 1 hour)
    const { data, error } = await supabase.storage
      .from(file.bucket)
      .createSignedUrl(file.path, 3600)

    if (error) {
      console.error('Error creating signed URL:', error)
      return { error: 'Failed to generate download URL' }
    }

    return { success: true, url: data.signedUrl, filename: file.name }
  } catch (error) {
    console.error('Error getting download URL:', error)
    return { error: 'Failed to generate download URL' }
  }
}
