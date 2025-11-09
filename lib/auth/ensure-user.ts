"use server"

import type { User } from "@supabase/supabase-js"

import { prisma } from "@/lib/db"
import { slugify } from "@/lib/utils"

function buildDefaultName(user: User): string {
  const metadata = user.user_metadata ?? {}
  return (
    metadata.full_name ||
    metadata.name ||
    metadata.preferred_username ||
    user.email?.split("@")[0] ||
    "New Member"
  )
}

async function ensureOrganizationForUser(user: User, displayName: string) {
  const baseName = `${displayName}'s Team`.trim()
  const baseSlug = slugify(baseName) || "team"

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

export async function ensureUserWithOrganization(user: User) {
  try {
    const existing = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (existing?.organizationId) {
      return existing
    }

    const displayName = buildDefaultName(user)
    const organization =
      existing?.organizationId
        ? await prisma.organization.findUnique({
            where: { id: existing.organizationId },
          })
        : await ensureOrganizationForUser(user, displayName)

    const organizationId = organization?.id

    if (!organizationId) {
      throw new Error("Failed to resolve organization for user.")
    }

    if (existing) {
      return prisma.user.update({
        where: { id: user.id },
        data: {
          organizationId,
          name: existing.name || displayName,
          email: existing.email || user.email || `${user.id}@placeholder.local`,
        },
      })
    }

    return prisma.user.create({
      data: {
        id: user.id,
        email: user.email || `${user.id}@placeholder.local`,
        name: displayName,
        avatar: user.user_metadata?.avatar_url ?? null,
        authProvider: user.app_metadata?.provider ?? "email",
        authProviderId: user.user_metadata?.provider_id ?? null,
        organizationId,
      },
    })
  } catch (error) {
    console.error("Error in ensureUserWithOrganization:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      throw error; // Re-throw to be caught by caller
    }
    throw new Error("Unknown error in ensureUserWithOrganization");
  }
}
