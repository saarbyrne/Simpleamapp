'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'

export type NoteVisibility = 'public' | 'medical' | 'mental_health' | 'coaches' | 'private'

export type NoteWithAuthor = {
  id: string
  title: string | null
  content: any // Tiptap JSON
  visibility: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  linkedPersonId: string | null
  linkedEventId: string | null
  author: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
  linkedPerson?: {
    id: string
    firstName: string
    lastName: string
  } | null
  linkedEvent?: {
    id: string
    title: string
  } | null
}

/**
 * Check if user has permission to view a note based on visibility
 */
async function canViewNote(note: { visibility: string; authorId: string }, userId: string, userRoles: string[]): Promise<boolean> {
  // Private notes - only author can view
  if (note.visibility === 'private') {
    return note.authorId === userId
  }

  // Public notes - everyone can view
  if (note.visibility === 'public') {
    return true
  }

  // Role-specific notes
  if (note.visibility === 'medical') {
    return userRoles.includes('medical') || userRoles.includes('Medical Staff')
  }

  if (note.visibility === 'mental_health') {
    return userRoles.includes('mental_health') || userRoles.includes('Mental Health')
  }

  if (note.visibility === 'coaches') {
    return userRoles.includes('coach') || userRoles.includes('Coach')
  }

  return false
}

/**
 * Get user roles for permission checking
 */
async function getUserRoles(userId: string): Promise<string[]> {
  const userRoles = await db.userRole.findMany({
    where: { userId },
    include: {
      role: true,
    },
  })

  return userRoles.map((ur) => ur.role.name)
}

/**
 * Get all notes visible to the current user with optional filters
 */
export async function getNotes(filters?: {
  search?: string
  authorId?: string
  visibility?: string
  linkedPersonId?: string
  linkedEventId?: string
  tags?: string[]
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get current user details
    const currentUser = await db.user.findUnique({
      where: { email: user.email! },
    })

    if (!currentUser) {
      return { success: false, error: 'User not found' }
    }

    // Get user roles for permission checking
    const userRoles = await getUserRoles(currentUser.id)

    // Build where clause
    const where: any = {
      organizationId: currentUser.organizationId,
    }

    if (filters?.authorId) {
      where.authorId = filters.authorId
    }

    if (filters?.linkedPersonId) {
      where.linkedPersonId = filters.linkedPersonId
    }

    if (filters?.linkedEventId) {
      where.linkedEventId = filters.linkedEventId
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags,
      }
    }

    // Fetch notes
    const allNotes = await db.note.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        linkedPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        linkedEvent: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Filter notes based on permissions
    const visibleNotes = allNotes.filter((note) =>
      canViewNote(note, currentUser.id, userRoles)
    )

    // Apply search filter if provided
    let filteredNotes = visibleNotes
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredNotes = visibleNotes.filter((note) => {
        const titleMatch = note.title?.toLowerCase().includes(searchLower)
        const contentMatch = JSON.stringify(note.content).toLowerCase().includes(searchLower)
        const tagsMatch = note.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        const authorMatch = note.author.name.toLowerCase().includes(searchLower)
        return titleMatch || contentMatch || tagsMatch || authorMatch
      })
    }

    // Apply visibility filter if provided
    if (filters?.visibility) {
      if (filters.visibility === 'my_private') {
        filteredNotes = filteredNotes.filter(
          (note) => note.visibility === 'private' && note.authorId === currentUser.id
        )
      } else if (filters.visibility !== 'all') {
        filteredNotes = filteredNotes.filter((note) => note.visibility === filters.visibility)
      }
    }

    return {
      success: true,
      notes: filteredNotes as NoteWithAuthor[],
    }
  } catch (error) {
    console.error('Error fetching notes:', error)
    return {
      success: false,
      error: 'Failed to fetch notes',
    }
  }
}

/**
 * Get a single note by ID
 */
export async function getNote(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const currentUser = await db.user.findUnique({
      where: { email: user.email! },
    })

    if (!currentUser) {
      return { success: false, error: 'User not found' }
    }

    const note = await db.note.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        linkedPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        linkedEvent: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!note) {
      return { success: false, error: 'Note not found' }
    }

    // Check permissions
    const userRoles = await getUserRoles(currentUser.id)
    const canView = await canViewNote(note, currentUser.id, userRoles)

    if (!canView) {
      return { success: false, error: 'Permission denied' }
    }

    return {
      success: true,
      note: note as NoteWithAuthor,
    }
  } catch (error) {
    console.error('Error fetching note:', error)
    return {
      success: false,
      error: 'Failed to fetch note',
    }
  }
}

/**
 * Create a new note
 */
export async function createNote(data: {
  title?: string
  content: any
  visibility: NoteVisibility
  tags?: string[]
  linkedPersonId?: string
  linkedEventId?: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const currentUser = await db.user.findUnique({
      where: { email: user.email! },
    })

    if (!currentUser) {
      return { success: false, error: 'User not found' }
    }

    const note = await db.note.create({
      data: {
        title: data.title || null,
        content: data.content,
        visibility: data.visibility,
        tags: data.tags || [],
        linkedPersonId: data.linkedPersonId || null,
        linkedEventId: data.linkedEventId || null,
        organizationId: currentUser.organizationId,
        authorId: currentUser.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        linkedPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        linkedEvent: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    revalidatePath('/dashboard/notes')
    if (data.linkedPersonId) {
      revalidatePath(`/dashboard/players/${data.linkedPersonId}`)
    }
    if (data.linkedEventId) {
      revalidatePath(`/dashboard/calendar/events/${data.linkedEventId}`)
    }

    return {
      success: true,
      note: note as NoteWithAuthor,
    }
  } catch (error) {
    console.error('Error creating note:', error)
    return {
      success: false,
      error: 'Failed to create note',
    }
  }
}

/**
 * Update an existing note
 */
export async function updateNote(
  id: string,
  data: {
    title?: string
    content?: any
    visibility?: NoteVisibility
    tags?: string[]
  }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const currentUser = await db.user.findUnique({
      where: { email: user.email! },
    })

    if (!currentUser) {
      return { success: false, error: 'User not found' }
    }

    // Check if note exists and user is the author
    const existingNote = await db.note.findUnique({
      where: { id },
    })

    if (!existingNote) {
      return { success: false, error: 'Note not found' }
    }

    if (existingNote.authorId !== currentUser.id) {
      return { success: false, error: 'Only the author can edit this note' }
    }

    const note = await db.note.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        content: data.content !== undefined ? data.content : undefined,
        visibility: data.visibility !== undefined ? data.visibility : undefined,
        tags: data.tags !== undefined ? data.tags : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        linkedPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        linkedEvent: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    revalidatePath('/dashboard/notes')
    if (existingNote.linkedPersonId) {
      revalidatePath(`/dashboard/players/${existingNote.linkedPersonId}`)
    }
    if (existingNote.linkedEventId) {
      revalidatePath(`/dashboard/calendar/events/${existingNote.linkedEventId}`)
    }

    return {
      success: true,
      note: note as NoteWithAuthor,
    }
  } catch (error) {
    console.error('Error updating note:', error)
    return {
      success: false,
      error: 'Failed to update note',
    }
  }
}

/**
 * Delete a note
 */
export async function deleteNote(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const currentUser = await db.user.findUnique({
      where: { email: user.email! },
    })

    if (!currentUser) {
      return { success: false, error: 'User not found' }
    }

    // Check if note exists and user is the author
    const existingNote = await db.note.findUnique({
      where: { id },
    })

    if (!existingNote) {
      return { success: false, error: 'Note not found' }
    }

    if (existingNote.authorId !== currentUser.id) {
      return { success: false, error: 'Only the author can delete this note' }
    }

    await db.note.delete({
      where: { id },
    })

    revalidatePath('/dashboard/notes')
    if (existingNote.linkedPersonId) {
      revalidatePath(`/dashboard/players/${existingNote.linkedPersonId}`)
    }
    if (existingNote.linkedEventId) {
      revalidatePath(`/dashboard/calendar/events/${existingNote.linkedEventId}`)
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting note:', error)
    return {
      success: false,
      error: 'Failed to delete note',
    }
  }
}

/**
 * Get all unique tags from notes in the organization
 */
export async function getNoteTags() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const currentUser = await db.user.findUnique({
      where: { email: user.email! },
    })

    if (!currentUser) {
      return { success: false, error: 'User not found' }
    }

    const notes = await db.note.findMany({
      where: {
        organizationId: currentUser.organizationId,
      },
      select: {
        tags: true,
      },
    })

    // Flatten and deduplicate tags
    const allTags = notes.flatMap((note) => note.tags)
    const uniqueTags = Array.from(new Set(allTags)).sort()

    return {
      success: true,
      tags: uniqueTags,
    }
  } catch (error) {
    console.error('Error fetching tags:', error)
    return {
      success: false,
      error: 'Failed to fetch tags',
    }
  }
}
