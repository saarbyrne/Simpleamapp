'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth/cached-user'

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


/**
 * Build privacy-aware WHERE conditions for notes queries.
 * Pushes privacy filtering into SQL instead of fetching all and filtering in JS.
 */
function buildPrivacyWhere(userId: string, userRoles: string[]): any {
  const visiblePrivacyLevels: string[] = ['public']

  if (userRoles.includes('medical') || userRoles.includes('Medical Staff')) {
    visiblePrivacyLevels.push('medical')
  }
  if (userRoles.includes('mental_health') || userRoles.includes('Mental Health')) {
    visiblePrivacyLevels.push('mental_health')
  }
  if (userRoles.includes('coach') || userRoles.includes('Coach')) {
    visiblePrivacyLevels.push('coaches')
  }

  return {
    OR: [
      // Notes with privacy levels the user's roles grant access to
      { privacyLevel: { in: visiblePrivacyLevels } },
      // Private notes: only if user is the author
      { privacyLevel: 'private', authorId: userId },
    ],
  }
}

/**
 * Get all notes visible to the current user with optional filters.
 * Privacy, search, and privacy-level filters are pushed into the SQL query.
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
    const currentUser = await requireUser()

    // Get user roles for permission checking
    const userRoles = await getUserRoles(currentUser.id)

    // Build where clause with privacy pushed into SQL
    const privacyWhere = buildPrivacyWhere(currentUser.id, userRoles)

    const where: any = {
      organizationId: currentUser.organizationId,
      AND: [privacyWhere],
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

    // Push privacy level filter into SQL
    if (filters?.privacyLevel) {
      if (filters.privacyLevel === 'my_private') {
        where.AND.push({
          privacyLevel: 'private',
          authorId: currentUser.id,
        })
      } else if (filters.privacyLevel !== 'all') {
        where.AND.push({
          privacyLevel: filters.privacyLevel,
        })
      }
    }

    // Push search into SQL where possible (title, tags, author name)
    // Content search uses ILIKE on title + tags as a pragmatic approach
    if (filters?.search) {
      const search = filters.search
      where.AND.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { tags: { hasSome: [search] } },
          { author: { name: { contains: search, mode: 'insensitive' } } },
        ],
      })
    }

    // Fetch notes — privacy already filtered in SQL
    const notes = await db.note.findMany({
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

    return {
      success: true,
      notes: notes as unknown as NoteWithAuthor[],
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
    const currentUser = await requireUser()

    const note = await db.note.findFirst({
      where: { id, organizationId: currentUser.organizationId },
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
    const currentUser = await requireUser()

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
    revalidateTag('notes')
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
    const currentUser = await requireUser()

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
    revalidateTag('notes')
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
    const currentUser = await requireUser()

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
    revalidateTag('notes')
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
    const currentUser = await requireUser()

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
    const currentUser = await requireUser()

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
    revalidateTag('notes')

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
    const currentUser = await requireUser()

    // Delete notes (only author can delete)
    await db.note.deleteMany({
      where: {
        id: { in: noteIds },
        organizationId: currentUser.organizationId,
        authorId: currentUser.id,
      },
    })

    revalidatePath('/dashboard/notes')
    revalidateTag('notes')

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
    const currentUser = await requireUser()

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
    const currentUser = await requireUser()

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
    const currentUser = await requireUser()

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
    revalidateTag('notes')

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
