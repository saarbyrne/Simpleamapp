'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth/cached-user'

// Get all folders for the organization
export async function getSpreadsheetFolders() {

  try {
    const user = await requireUser()

    const folders = await prisma.spreadsheetFolder.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        _count: {
          select: {
            spreadsheets: {
              where: {
                isDeleted: false,
              },
            },
          },
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    })

    // Transform to include spreadsheet count
    const foldersWithCount = folders.map(folder => ({
      ...folder,
      spreadsheetCount: folder._count.spreadsheets,
    }))

    return { success: true, folders: foldersWithCount }
  } catch (error) {
    console.error('Error fetching folders:', error)
    return { error: 'Failed to fetch folders' }
  }
}

// Create a new folder
export async function createSpreadsheetFolder(data: {
  name: string
  description?: string
  icon?: string
  color?: string
  parentId?: string
}) {

  try {
    const user = await requireUser()

    // If parentId provided, verify it exists and belongs to the org
    if (data.parentId) {
      const parent = await prisma.spreadsheetFolder.findUnique({
        where: { id: data.parentId },
      })

      if (!parent || parent.organizationId !== user.organizationId) {
        return { error: 'Parent folder not found' }
      }
    }

    const folder = await prisma.spreadsheetFolder.create({
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
        parentId: data.parentId,
        organizationId: user.organizationId,
        sortOrder: 0,
      },
    })

    revalidatePath('/dashboard/spreadsheets')

    return { success: true, folder }
  } catch (error) {
    console.error('Error creating folder:', error)
    return { error: 'Failed to create folder' }
  }
}

// Update a folder
export async function updateSpreadsheetFolder(
  folderId: string,
  data: {
    name?: string
    description?: string
    icon?: string
    color?: string
    parentId?: string
    sortOrder?: number
  }
) {

  try {
    const user = await requireUser()

    // Verify folder exists and belongs to org
    const folder = await prisma.spreadsheetFolder.findUnique({
      where: { id: folderId },
    })

    if (!folder || folder.organizationId !== user.organizationId) {
      return { error: 'Folder not found or access denied' }
    }

    // If changing parent, verify new parent exists
    if (data.parentId) {
      // Prevent circular references
      if (data.parentId === folderId) {
        return { error: 'Cannot set folder as its own parent' }
      }

      const parent = await prisma.spreadsheetFolder.findUnique({
        where: { id: data.parentId },
      })

      if (!parent || parent.organizationId !== user.organizationId) {
        return { error: 'Parent folder not found' }
      }
    }

    const updatedFolder = await prisma.spreadsheetFolder.update({
      where: { id: folderId },
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
        parentId: data.parentId,
        sortOrder: data.sortOrder,
      },
    })

    revalidatePath('/dashboard/spreadsheets')

    return { success: true, folder: updatedFolder }
  } catch (error) {
    console.error('Error updating folder:', error)
    return { error: 'Failed to update folder' }
  }
}

// Delete a folder
export async function deleteSpreadsheetFolder(folderId: string, moveToFolderId?: string) {

  try {
    const user = await requireUser()

    // Verify folder exists and belongs to org
    const folder = await prisma.spreadsheetFolder.findUnique({
      where: { id: folderId },
      include: {
        _count: {
          select: {
            spreadsheets: true,
            subfolders: true,
          },
        },
      },
    })

    if (!folder || folder.organizationId !== user.organizationId) {
      return { error: 'Folder not found or access denied' }
    }

    // If there are spreadsheets, move them
    if (folder._count.spreadsheets > 0) {
      await prisma.spreadsheet.updateMany({
        where: { folderId },
        data: { folderId: moveToFolderId || null },
      })
    }

    // If there are subfolders, move them
    if (folder._count.subfolders > 0) {
      await prisma.spreadsheetFolder.updateMany({
        where: { parentId: folderId },
        data: { parentId: moveToFolderId || null },
      })
    }

    // Delete the folder
    await prisma.spreadsheetFolder.delete({
      where: { id: folderId },
    })

    revalidatePath('/dashboard/spreadsheets')

    return { success: true }
  } catch (error) {
    console.error('Error deleting folder:', error)
    return { error: 'Failed to delete folder' }
  }
}

// Move spreadsheet to folder
export async function moveSpreadsheetToFolder(spreadsheetId: string, folderId: string | null) {

  try {
    const user = await requireUser()

    // Verify spreadsheet exists and belongs to org
    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
    })

    if (!spreadsheet || spreadsheet.organizationId !== user.organizationId) {
      return { error: 'Spreadsheet not found or access denied' }
    }

    // If folderId provided, verify it exists
    if (folderId) {
      const folder = await prisma.spreadsheetFolder.findUnique({
        where: { id: folderId },
      })

      if (!folder || folder.organizationId !== user.organizationId) {
        return { error: 'Folder not found' }
      }
    }

    await prisma.spreadsheet.update({
      where: { id: spreadsheetId },
      data: { folderId },
    })

    revalidatePath('/dashboard/spreadsheets')

    return { success: true }
  } catch (error) {
    console.error('Error moving spreadsheet:', error)
    return { error: 'Failed to move spreadsheet' }
  }
}
