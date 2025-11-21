import { z } from 'zod'

/**
 * API Request Validation Schemas
 *
 * Security: All API routes should validate input using these schemas
 * to prevent injection attacks, type confusion, and malformed data.
 */

// ============================================
// AI ENDPOINTS
// ============================================

export const AISettingsSchema = z.object({
  injuryRiskAlerts: z.boolean(),
  wellnessAlerts: z.boolean(),
  loadAlerts: z.boolean(),
  formCompletionAlerts: z.boolean(),
  alertFrequency: z.enum(['real_time', 'daily', 'weekly']),
  dataAccess: z.object({
    playerWellness: z.boolean(),
    loadData: z.boolean(),
    medicalNotes: z.boolean(),
    formResponses: z.boolean(),
    eventAttendance: z.boolean(),
    privateNotes: z.boolean()
  }),
  monthlyTokenLimit: z.number().int().min(0).max(10_000_000)
})

export const AIChatMessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(50000) // 50KB max per message
  })).min(1).max(100), // Max 100 messages in history
  conversationId: z.string().cuid().optional()
})

export const AIInsightActionSchema = z.object({
  insightId: z.string().cuid(),
  action: z.enum(['dismiss', 'act_on'])
})

// ============================================
// COMMON TYPES
// ============================================

export const CuidSchema = z.string().cuid()
export const EmailSchema = z.string().email().max(255)
export const UrlSchema = z.string().url().max(2048)

// ============================================
// VALIDATION HELPER
// ============================================

/**
 * Validate request body against schema
 * @returns Validated data or throws ZodError
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

/**
 * Validate request body and return safe result
 * @returns { success: true, data } or { success: false, error }
 */
export function safeValidateRequest<T>(schema: z.ZodSchema<T>, data: unknown):
  | { success: true; data: T }
  | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error }
}
