'use server'

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { createServerClient } from "@/lib/supabase/server"
import { ensureUserWithOrganization } from "@/lib/auth/ensure-user"

const updateBrandingSchema = z.object({
  logo: z.string().url().optional().nullable(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be valid hex color").optional().nullable(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be valid hex color").optional().nullable(),
})

export async function getOrganization() {
  try {
    const supabase = await createServerClient()
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return { success: false, error: "Authentication required" }
    }

    const dbUser = await ensureUserWithOrganization(authUser)

    const organization = await prisma.organization.findUnique({
      where: { id: dbUser.organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        primaryColor: true,
        secondaryColor: true,
      },
    })

    return { success: true, data: organization }
  } catch (error) {
    console.error("Error fetching organization:", error)
    return { success: false, error: "Failed to fetch organization" }
  }
}

export async function updateOrganizationBranding(data: z.infer<typeof updateBrandingSchema>) {
  try {
    const validation = updateBrandingSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message }
    }

    const supabase = await createServerClient()
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return { success: false, error: "Authentication required" }
    }

    const dbUser = await ensureUserWithOrganization(authUser)

    const updatedOrg = await prisma.organization.update({
      where: { id: dbUser.organizationId },
      data: {
        logo: validation.data.logo,
        primaryColor: validation.data.primaryColor,
        secondaryColor: validation.data.secondaryColor,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/dashboard/system-settings")

    return { success: true, data: updatedOrg }
  } catch (error) {
    console.error("Error updating organization branding:", error)
    return { success: false, error: "Failed to update branding" }
  }
}
