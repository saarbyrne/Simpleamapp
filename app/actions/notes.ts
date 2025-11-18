'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'

export type NoteVisibility = 'public' | 'medical' | 'mental_health' | 'coaches' | 'private'

export type NotePrivacyLevel = 'public' | 'medical' | 'mental_health' | 'coaches' | 'private'

export type NoteWithAuthor = {
  id: string
  title: string | null
  content: any // Tiptap JSON
  privacyLevel: string
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
  links?: Array<{
    id: string
    targetType: string
    targetId: string
  }>
}

/**
 * Check if user has permission to view a note based on visibility
 */
async function canViewNote(note: { privacyLevel: string; authorId: string }, userId: string, userRoles: string[]): Promise<boolean> {
  // Private notes - only author can view
  if (note.privacyLevel === 'private') {
    return note.authorId === userId
  }

  // Public notes - everyone can view
  if (note.privacyLevel === 'public') {
    return true
  }

  // Role-specific notes
  if (note.privacyLevel === 'medical') {
    return userRoles.includes('medical') || userRoles.includes('Medical Staff')
  }

  if (note.privacyLevel === 'mental_health') {
    return userRoles.includes('mental_health') || userRoles.includes('Mental Health')
  }

  if (note.privacyLevel === 'coaches') {
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

async function getSupabaseUser() {
  const supabase = await createClient()
  const userResponse = await supabase.auth.getUser()
  const user = userResponse?.data?.user ?? null
  return { supabase, user }
}

/**
 * Get all notes visible to the current user with optional filters
 */
export async function getNotes(filters?: {
  search?: string
  authorId?: string
  privacyLevel?: string
  linkedPersonId?: string
  linkedEventId?: string
  tags?: string[]
}) {
  try {
    const { user } = await getSupabaseUser()

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
        links: {
          select: {
            id: true,
            targetType: true,
            targetId: true,
          },
        },
      } as any, // Type assertion needed until NoteLink table is created
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
      filteredNotes = visibleNotes.filter((note: any) => {
        const titleMatch = note.title?.toLowerCase().includes(searchLower)
        const contentMatch = JSON.stringify(note.content).toLowerCase().includes(searchLower)
        const tagsMatch = note.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
        const authorMatch = note.author?.name?.toLowerCase().includes(searchLower)
        return titleMatch || contentMatch || tagsMatch || authorMatch
      })
    }

    // Apply privacyLevel filter if provided
    if (filters?.privacyLevel) {
      if (filters.privacyLevel === 'my_private') {
        filteredNotes = filteredNotes.filter(
          (note) => note.privacyLevel === 'private' && note.authorId === currentUser.id
        )
      } else if (filters.privacyLevel !== 'all') {
        filteredNotes = filteredNotes.filter((note) => note.privacyLevel === filters.privacyLevel)
      }
    }

    return {
      success: true,
      notes: filteredNotes as unknown as NoteWithAuthor[],
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
    const { user } = await getSupabaseUser()

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
        links: {
          select: {
            id: true,
            targetType: true,
            targetId: true,
          },
        },
      } as any, // Type assertion needed until NoteLink table is created
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
      note: note as unknown as NoteWithAuthor,
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
  privacyLevel: NotePrivacyLevel
  tags?: string[]
  linkedPersonId?: string
  linkedEventId?: string
}) {
  try {
    const { user } = await getSupabaseUser()

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
        privacyLevel: data.privacyLevel,
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
    privacyLevel?: NotePrivacyLevel
    tags?: string[]
  }
) {
  try {
    const { user } = await getSupabaseUser()

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
        privacyLevel: data.privacyLevel !== undefined ? data.privacyLevel : undefined,
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
    const { user } = await getSupabaseUser()

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
    const { user } = await getSupabaseUser()

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

/**
 * Bulk update notes
 */
export async function bulkUpdateNotes(
  noteIds: string[],
  updates: {
    privacyLevel?: NotePrivacyLevel
    tags?: string[]
  }
) {
  try {
    const { user } = await getSupabaseUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const currentUser = await db.user.findUnique({
      where: { email: user.email! },
    })

    if (!currentUser) {
      return { success: false, error: 'User not found' }
    }

    // Verify user has permission to update these notes (only author can update)
    const notes = await db.note.findMany({
      where: {
        id: { in: noteIds },
        organizationId: currentUser.organizationId,
        authorId: currentUser.id, // Only update own notes
      },
    })

    if (notes.length !== noteIds.length) {
      return { success: false, error: 'Some notes not found or unauthorized' }
    }

    // Prepare update data
    const updateData: any = {}
    if (updates.privacyLevel) {
      updateData.privacyLevel = updates.privacyLevel
    }
    if (updates.tags) {
      updateData.tags = updates.tags
    }

    // Perform bulk update
    await db.note.updateMany({
      where: {
        id: { in: noteIds },
        authorId: currentUser.id,
      },
      data: updateData,
    })

    revalidatePath('/dashboard/notes')

    return {
      success: true,
      message: `Updated ${noteIds.length} note(s)`,
    }
  } catch (error) {
    console.error('Error bulk updating notes:', error)
    return {
      success: false,
      error: 'Failed to bulk update notes',
    }
  }
}

/**
 * Bulk delete notes
 */
export async function bulkDeleteNotes(noteIds: string[]) {
  try {
    const { user } = await getSupabaseUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const currentUser = await db.user.findUnique({
      where: { email: user.email! },
    })

    if (!currentUser) {
      return { success: false, error: 'User not found' }
    }

    // Delete notes (only author can delete)
    await db.note.deleteMany({
      where: {
        id: { in: noteIds },
        organizationId: currentUser.organizationId,
        authorId: currentUser.id,
      },
    })

    revalidatePath('/dashboard/notes')

    return {
      success: true,
      message: `Deleted ${noteIds.length} note(s)`,
    }
  } catch (error) {
    console.error('Error bulk deleting notes:', error)
    return {
      success: false,
      error: 'Failed to bulk delete notes',
    }
  }
}

/**
 * Get players for entity picker (simplified, no pagination)
 */
export async function getPlayersForPicker() {
  try {
    const { user } = await getSupabaseUser()

    if (!user) {
      return { success: false, error: 'Unauthorized', players: [] }
    }

    const currentUser = await db.user.findUnique({
      where: { email: user.email! },
    })

    if (!currentUser) {
      return { success: false, error: 'User not found', players: [] }
    }

    const players = await db.person.findMany({
      where: {
        organizations: {
          some: {
            organizationId: currentUser.organizationId,
            role: 'player',
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        organizations: {
          where: {
            organizationId: currentUser.organizationId,
          },
          select: {
            position: true,
            jerseyNumber: true,
          },
        },
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' },
      ],
    })

    return {
      success: true,
      players: players.map((p) => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        position: p.organizations[0]?.position || null,
        jerseyNumber: p.organizations[0]?.jerseyNumber || null,
      })),
    }
  } catch (error) {
    console.error('Error fetching players for picker:', error)
    return {
      success: false,
      error: 'Failed to fetch players',
      players: [],
    }
  }
}

/**
 * Get events for entity picker (future events + recent past)
 */
export async function getEventsForPicker() {
  try {
    const { user } = await getSupabaseUser()

    if (!user) {
      return { success: false, error: 'Unauthorized', events: [] }
    }

    const currentUser = await db.user.findUnique({
      where: { email: user.email! },
    })

    if (!currentUser) {
      return { success: false, error: 'User not found', events: [] }
    }

    // Get events from 30 days ago onwards
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const events = await db.event.findMany({
      where: {
        organizationId: currentUser.organizationId,
        startTime: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        id: true,
        title: true,
        type: true,
        startTime: true,
        location: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    })

    return {
      success: true,
      events,
    }
  } catch (error) {
    console.error('Error fetching events for picker:', error)
    return {
      success: false,
      error: 'Failed to fetch events',
      events: [],
    }
  }
}

/**
 * Create/update note links
 */
export async function createNoteLinks(
  noteId: string,
  links: Array<{ targetType: string; targetId: string }>
) {
  try {
    const { user } = await getSupabaseUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const currentUser = await db.user.findUnique({
      where: { email: user.email! },
    })

    if (!currentUser) {
      return { success: false, error: 'User not found' }
    }

    // Verify user owns this note
    const note = await db.note.findFirst({
      where: {
        id: noteId,
        authorId: currentUser.id,
        organizationId: currentUser.organizationId,
      },
    })

    if (!note) {
      return { success: false, error: 'Note not found or unauthorized' }
    }

    // Use transaction to atomically delete old links and create new ones
    await db.$transaction(async (tx: any) => {
      // Delete existing links for this note
      await tx.noteLink.deleteMany({
        where: {
          noteId,
        },
      })

      // Create new links
      if (links.length > 0) {
        await tx.noteLink.createMany({
          data: links.map((link) => ({
            noteId,
            targetType: link.targetType,
            targetId: link.targetId,
          })),
        })
      }
    })

    revalidatePath('/dashboard/notes')

    return {
      success: true,
      message: 'Links updated successfully',
    }
  } catch (error) {
    console.error('Error creating note links:', error)
    return {
      success: false,
      error: 'Failed to create note links',
    }
  }
}
