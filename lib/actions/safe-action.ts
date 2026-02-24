/**
 * Unified Server Action Wrapper
 *
 * Every server action should use createAction() or createPublicAction().
 * This handles auth, org resolution, Zod validation, and consistent error returns.
 *
 * Usage:
 *   export const createPlayer = createAction(CreatePlayerSchema, async (data, { user, organizationId }) => {
 *     const player = await prisma.person.create({ ... })
 *     return { player }
 *   })
 *
 *   export const getPublicTemplate = createPublicAction(GetTemplateSchema, async (data) => {
 *     return prisma.communityTemplate.findUnique({ ... })
 *   })
 */

import { z } from 'zod'
import { type ActionResult, ok, err } from '@/types/actions'
import { requireUser, type UserWithOrganization } from '@/lib/auth/cached-user'

export type ActionContext = {
  user: UserWithOrganization
  userId: string
  organizationId: string
}

/**
 * Create an authenticated server action with input validation.
 *
 * - Authenticates via cached Supabase user (no DB write on reads)
 * - Validates input with Zod
 * - Returns consistent ActionResult<T>
 * - Catches and logs errors
 */
export function createAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  handler: (input: TInput, ctx: ActionContext) => Promise<TOutput>
): (input: TInput) => Promise<ActionResult<TOutput>> {
  return async (rawInput: TInput): Promise<ActionResult<TOutput>> => {
    try {
      // Auth
      const user = await requireUser()

      // Validate
      const parseResult = schema.safeParse(rawInput)
      if (!parseResult.success) {
        const firstError = parseResult.error.issues[0]
        return err(firstError?.message ?? 'Invalid input')
      }

      // Execute
      const ctx: ActionContext = {
        user,
        userId: user.id,
        organizationId: user.organizationId,
      }

      const result = await handler(parseResult.data, ctx)
      return ok(result)
    } catch (error) {
      console.error('Action error:', error)
      if (error instanceof Error && error.message === 'Unauthorized: User must be authenticated') {
        return err('Not authenticated')
      }
      return err('An unexpected error occurred')
    }
  }
}

/**
 * Create an authenticated action that takes no input (just auth context).
 */
export function createAuthAction<TOutput>(
  handler: (ctx: ActionContext) => Promise<TOutput>
): () => Promise<ActionResult<TOutput>> {
  return async (): Promise<ActionResult<TOutput>> => {
    try {
      const user = await requireUser()
      const ctx: ActionContext = {
        user,
        userId: user.id,
        organizationId: user.organizationId,
      }
      const result = await handler(ctx)
      return ok(result)
    } catch (error) {
      console.error('Action error:', error)
      if (error instanceof Error && error.message === 'Unauthorized: User must be authenticated') {
        return err('Not authenticated')
      }
      return err('An unexpected error occurred')
    }
  }
}

/**
 * Create a public (unauthenticated) action with input validation.
 */
export function createPublicAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  handler: (input: TInput) => Promise<TOutput>
): (input: TInput) => Promise<ActionResult<TOutput>> {
  return async (rawInput: TInput): Promise<ActionResult<TOutput>> => {
    try {
      const parseResult = schema.safeParse(rawInput)
      if (!parseResult.success) {
        const firstError = parseResult.error.issues[0]
        return err(firstError?.message ?? 'Invalid input')
      }

      const result = await handler(parseResult.data)
      return ok(result)
    } catch (error) {
      console.error('Action error:', error)
      return err('An unexpected error occurred')
    }
  }
}
