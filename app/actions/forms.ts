'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'

export interface FormField {
  id: string
  type: 'text' | 'number' | 'rating' | 'select' | 'textarea' | 'checkbox' | 'date' | 'time'
  label: string
  placeholder?: string
  required?: boolean
  options?: string[] // For select/checkbox types
  min?: number // For number/rating
  max?: number // For number/rating
  conditional?: {
    fieldId: string
    operator: 'equals' | 'notEquals' | 'contains'
    value: any
  }
}

export interface CreateFormData {
  name: string
  description?: string
  category: string
  schema: FormField[]
  templateId?: string
  scheduleType?: 'one_time' | 'daily' | 'weekly' | 'monthly'
  scheduledAt?: string
  targetType?: 'all' | 'specific' | 'group'
  targetIds?: string[]
  isActive?: boolean
}

export interface UpdateFormData extends Partial<CreateFormData> {}

export interface FormWithDetails {
  id: string
  name: string
  description: string | null
  schema: any
  organizationId: string
  templateId: string | null
  scheduleType: string
  scheduledAt: Date | null
  recurringRule: any
  targetType: string
  targetIds: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    responses: number
  }
  organization: {
    id: string
    name: string
  }
  template: {
    id: string
    name: string
    category: string
  } | null
}

/**
 * Get all forms for the current user's organization
 */
export async function getForms(page: number = 0, pageSize: number = 20) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Not authenticated', forms: [], total: 0, page: 0, pageSize: 20 }
    }

    const dbUser = await ensureUserWithOrganization(user)

    const skip = page * pageSize

    // Get total count
    const total = await prisma.form.count({
      where: {
        organizationId: dbUser.organizationId,
      },
    })

    // Get paginated forms with response counts
    const forms = await prisma.form.findMany({
      where: {
        organizationId: dbUser.organizationId,
      },
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip,
      take: pageSize,
    })

    return { forms, total, page, pageSize }
  } catch (error) {
    console.error('Error fetching forms:', error)
    return { error: 'Failed to fetch forms', forms: [], total: 0, page: 0, pageSize: 20 }
  }
}

/**
 * Get a single form by ID with full details
 */
export async function getForm(formId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        organizationId: dbUser.organizationId,
      },
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    })

    if (!form) {
      return { error: 'Form not found' }
    }

    return { success: true, form }
  } catch (error) {
    console.error('Error fetching form:', error)
    return { error: 'Failed to fetch form' }
  }
}

/**
 * Create a new form
 */
export async function createForm(data: CreateFormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const form = await prisma.form.create({
      data: {
        name: data.name,
        description: data.description,
        schema: {
          fields: data.schema,
          category: data.category, // Store category in schema metadata
        } as any,
        organizationId: dbUser.organizationId,
        templateId: data.templateId,
        scheduleType: data.scheduleType || 'one_time',
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        targetType: data.targetType || 'all',
        targetIds: data.targetIds || [],
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
      },
    })

    revalidatePath('/dashboard/forms')
    return { success: true, form }
  } catch (error) {
    console.error('Error creating form:', error)
    return { error: 'Failed to create form' }
  }
}

/**
 * Update an existing form
 */
export async function updateForm(formId: string, data: UpdateFormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify form belongs to organization
    const existingForm = await prisma.form.findFirst({
      where: {
        id: formId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!existingForm) {
      return { error: 'Form not found' }
    }

    const form = await prisma.form.update({
      where: { id: formId },
      data: {
        name: data.name,
        description: data.description,
        schema: data.schema ? (data.schema as any) : undefined,
        templateId: data.templateId,
        scheduleType: data.scheduleType,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        targetType: data.targetType,
        targetIds: data.targetIds,
        isActive: data.isActive,
      },
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
      },
    })

    revalidatePath('/dashboard/forms')
    revalidatePath(`/dashboard/forms/${formId}`)
    return { success: true, form }
  } catch (error) {
    console.error('Error updating form:', error)
    return { error: 'Failed to update form' }
  }
}

/**
 * Delete a form
 */
export async function deleteForm(formId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify form belongs to organization
    const existingForm = await prisma.form.findFirst({
      where: {
        id: formId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!existingForm) {
      return { error: 'Form not found' }
    }

    await prisma.form.delete({
      where: { id: formId },
    })

    revalidatePath('/dashboard/forms')
    return { success: true }
  } catch (error) {
    console.error('Error deleting form:', error)
    return { error: 'Failed to delete form' }
  }
}

/**
 * Bulk update forms (for status, category, etc.)
 */
export async function bulkUpdateForms(
  formIds: string[],
  updates: {
    isActive?: boolean
    category?: string
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify all forms belong to organization
    const forms = await prisma.form.findMany({
      where: {
        id: { in: formIds },
        organizationId: dbUser.organizationId,
      },
    })

    if (forms.length !== formIds.length) {
      return { error: 'Some forms not found or not accessible' }
    }

    await prisma.form.updateMany({
      where: {
        id: { in: formIds },
        organizationId: dbUser.organizationId,
      },
      data: {
        isActive: updates.isActive,
        // Note: category is not a direct field, would need to update schema
        // For now, we'll handle this differently if needed
      },
    })

    revalidatePath('/dashboard/forms')
    return { success: true }
  } catch (error) {
    console.error('Error bulk updating forms:', error)
    return { error: 'Failed to bulk update forms' }
  }
}

/**
 * Get form responses for a specific form
 */
export async function getFormResponses(formId: string, page: number = 0, pageSize: number = 20) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify form belongs to organization
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!form) {
      return { error: 'Form not found' }
    }

    const skip = page * pageSize

    const total = await prisma.formResponse.count({
      where: { formId },
    })

    const responses = await prisma.formResponse.findMany({
      where: { formId },
      include: {
        personOrg: {
          include: {
            person: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                photo: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
      skip,
      take: pageSize,
    })

    return { success: true, responses, total, page, pageSize }
  } catch (error) {
    console.error('Error fetching form responses:', error)
    return { error: 'Failed to fetch form responses' }
  }
}

/**
 * Duplicate a form
 */
export async function duplicateForm(formId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Get the original form
    const originalForm = await prisma.form.findFirst({
      where: {
        id: formId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!originalForm) {
      return { error: 'Form not found' }
    }

    // Create a duplicate
    const duplicatedForm = await prisma.form.create({
      data: {
        name: `${originalForm.name} (Copy)`,
        description: originalForm.description,
        schema: originalForm.schema,
        organizationId: dbUser.organizationId,
        templateId: originalForm.templateId,
        scheduleType: originalForm.scheduleType,
        scheduledAt: originalForm.scheduledAt,
        recurringRule: originalForm.recurringRule,
        targetType: originalForm.targetType,
        targetIds: originalForm.targetIds,
        isActive: false, // Set to draft by default
      },
    })

    revalidatePath('/dashboard/forms')
    return { success: true, form: duplicatedForm }
  } catch (error) {
    console.error('Error duplicating form:', error)
    return { error: 'Failed to duplicate form' }
  }
}

/**
 * Submit a form response
 */
export async function submitFormResponse(
  formId: string,
  personOrgId: string,
  responses: Record<string, any>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify form belongs to organization
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!form) {
      return { error: 'Form not found' }
    }

    // Check if response already exists
    const existingResponse = await prisma.formResponse.findFirst({
      where: {
        formId,
        personOrgId,
      },
    })

    let response
    if (existingResponse) {
      // Update existing response
      response = await prisma.formResponse.update({
        where: { id: existingResponse.id },
        data: {
          responses: responses as any,
          submittedAt: new Date(),
          userId: user.id,
        },
      })
    } else {
      // Create new response
      response = await prisma.formResponse.create({
        data: {
          formId,
          personOrgId,
          responses: responses as any,
          userId: user.id,
        },
      })
    }

    revalidatePath(`/dashboard/forms/${formId}/responses`)
    return { success: true, response }
  } catch (error) {
    console.error('Error submitting form response:', error)
    return { error: 'Failed to submit form response' }
  }
}

