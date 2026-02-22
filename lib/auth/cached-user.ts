/**
 * Cached User Session Utilities
 *
 * This is the SINGLE source of truth for auth in server actions and components.
 * Uses React's cache() to deduplicate auth calls within the same request.
 *
 * For read operations: use getCachedUserWithOrganization() or requireUser()
 * For write operations that may need user creation: use ensureUserWithOrganization()
 *
 * IMPORTANT: lastLoginAt is NOT updated on every action call.
 * It is only updated when ensureUserWithOrganization() is called
 * during actual login/signup flows.
 */

import { cache } from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { User, Organization } from '@prisma/client'

export type UserWithOrganization = User & {
  organization: Organization
}

/**
 * Get the current authenticated Supabase user (cached per request)
 */
export const getCachedSupabaseUser = cache(async (): Promise<SupabaseUser | null> => {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
})

/**
 * Get the current user with organization (cached per request)
 * Returns null if not authenticated or user doesn't exist in DB yet.
 */
export const getCachedUserWithOrganization = cache(async (): Promise<UserWithOrganization | null> => {
  const supabaseUser = await getCachedSupabaseUser()

  if (!supabaseUser) {
    return null
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: supabaseUser.id },
    include: { organization: true },
  })

  if (!dbUser?.organization) {
    return null
  }

  return dbUser as UserWithOrganization
})

/**
 * Require authenticated user. Throws if not authenticated.
 * Use this in server actions via the createAction() wrapper.
 */
export async function requireUser(): Promise<UserWithOrganization> {
  const user = await getCachedUserWithOrganization()

  if (!user) {
    throw new Error('Unauthorized: User must be authenticated')
  }

  return user
}

// ============================================
// User Creation & Account Linking
// (Only called during login/signup flows)
// ============================================

function buildDefaultName(user: SupabaseUser): string {
  const metadata = user.user_metadata ?? {}
  return (
    metadata.full_name ||
    metadata.name ||
    metadata.preferred_username ||
    user.email?.split('@')[0] ||
    'New Member'
  )
}

async function ensureOrganizationForUser(displayName: string) {
  const baseName = `${displayName}'s Team`.trim()
  const baseSlug = slugify(baseName) || 'team'

  let slugCandidate = baseSlug
  let suffix = 1

  while (
    await prisma.organization.findUnique({
      where: { slug: slugCandidate },
    })
  ) {
    slugCandidate = `${baseSlug}-${suffix}`
    suffix += 1
  }

  return prisma.organization.create({
    data: {
      name: baseName,
      slug: slugCandidate,
    },
  })
}

/**
 * Ensure user exists with organization, creating if needed.
 * Handles account-linking when a user signs up with a different provider
 * but same email address.
 *
 * NOTE: This should only be called from login/auth callback flows,
 * NOT from every server action. Server actions should use requireUser().
 */
export async function ensureUserWithOrganization(user: SupabaseUser): Promise<UserWithOrganization> {
  // Check for existing user by Supabase ID
  const existing = await prisma.user.findUnique({
    where: { id: user.id },
    include: { organization: true },
  })

  if (existing?.organization) {
    // User exists with organization — update auth info and last login
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        authProvider: user.app_metadata?.provider ?? existing.authProvider,
      },
      include: { organization: true },
    })
    return updated as UserWithOrganization
  }

  // Check for account-linking scenario (same email, different Supabase ID)
  const existingByEmail = await prisma.user.findUnique({
    where: { email: user.email || '' },
    include: { organization: true },
  })

  if (existingByEmail && existingByEmail.id !== user.id) {
    // Account linking: update existing user with new Supabase ID
    const updated = await prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        id: user.id,
        lastLoginAt: new Date(),
        authProvider: user.app_metadata?.provider ?? existingByEmail.authProvider,
      },
      include: { organization: true },
    })
    return updated as UserWithOrganization
  }

  // New user — create org and user
  const displayName = buildDefaultName(user)
  const organization = existing?.organizationId
    ? await prisma.organization.findUniqueOrThrow({
        where: { id: existing.organizationId },
      })
    : await ensureOrganizationForUser(displayName)

  if (existing) {
    // User exists but without org — link them
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        organizationId: organization.id,
        name: existing.name || displayName,
        lastLoginAt: new Date(),
      },
      include: { organization: true },
    })
    return updated as UserWithOrganization
  }

  // Brand new user
  const newUser = await prisma.user.create({
    data: {
      id: user.id,
      email: user.email || `${user.id}@placeholder.local`,
      name: displayName,
      avatar: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
      authProvider: user.app_metadata?.provider ?? 'email',
      authProviderId: user.user_metadata?.provider_id ?? null,
      organizationId: organization.id,
      lastLoginAt: new Date(),
    },
    include: { organization: true },
  })

  return newUser as UserWithOrganization
}
