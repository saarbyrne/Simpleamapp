'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function createOrganizationForUser(
  organizationName: string,
  userName: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    // Check if user already has an organization
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email! },
      include: { organization: true }
    })

    if (existingUser) {
      return { success: true, organizationId: existingUser.organizationId }
    }

    // Create organization and user in a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create organization
      const org = await tx.organization.create({
        data: {
          name: organizationName,
          slug: slugify(organizationName),
        }
      })

      // Create default roles
      const adminRole = await tx.organizationRole.create({
        data: {
          name: 'Admin',
          organizationId: org.id,
          permissions: [
            'manage_organization',
            'manage_users',
            'manage_players',
            'create_forms',
            'view_all_responses',
            'manage_events',
            'create_notes',
            'view_medical_notes',
            'manage_files',
          ]
        }
      })

      await tx.organizationRole.create({
        data: {
          name: 'Coach',
          organizationId: org.id,
          permissions: [
            'manage_players',
            'create_forms',
            'view_all_responses',
            'manage_events',
            'create_notes',
            'manage_files',
          ]
        }
      })

      await tx.organizationRole.create({
        data: {
          name: 'Medical Staff',
          organizationId: org.id,
          permissions: [
            'view_players',
            'create_forms',
            'view_all_responses',
            'create_notes',
            'view_medical_notes',
            'manage_files',
          ]
        }
      })

      await tx.organizationRole.create({
        data: {
          name: 'Viewer',
          organizationId: org.id,
          permissions: [
            'view_players',
            'view_events',
          ]
        }
      })

      // Create user
      const newUser = await tx.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: userName,
          organizationId: org.id,
          authProvider: user.app_metadata.provider || 'email',
        }
      })

      // Assign admin role
      await tx.userRole.create({
        data: {
          userId: newUser.id,
          roleId: adminRole.id,
        }
      })

      // Log activity
      await tx.activity.create({
        data: {
          type: 'organization_created',
          data: { organizationName: org.name },
          userId: newUser.id,
        }
      })

      return { org, user: newUser }
    })

    revalidatePath('/dashboard')

    return { success: true, organizationId: result.org.id }
  } catch (error) {
    console.error('Error creating organization:', error)
    return { error: 'Failed to create organization' }
  }
}
