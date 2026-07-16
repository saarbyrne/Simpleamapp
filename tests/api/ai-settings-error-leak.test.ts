import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    user: { findUnique: vi.fn() },
    aISettings: { findUnique: vi.fn(), create: vi.fn(), upsert: vi.fn() },
  },
}))

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { POST } from '@/app/api/ai/settings/route'

function req(body: unknown) {
  return new Request('http://localhost/api/ai/settings', {
    method: 'POST',
    body: JSON.stringify(body),
  }) as any
}

describe('POST /api/ai/settings - error detail leakage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'u1', email: 'user@example.com' } },
          error: null,
        }),
      },
    })
    ;(db.user.findUnique as any).mockResolvedValue({ id: 'user-1', organizationId: 'org-1' })
  })

  it('does not leak the raw ZodError object in the 400 response', async () => {
    // Missing all required fields -> triggers ZodError in AISettingsSchema.parse
    const res = await POST(req({}))
    expect(res.status).toBe(400)

    const json = await res.json()

    // The raw ZodError object has an `issues` array of objects and a `name` field.
    // A sanitized response must not surface the raw error's internal shape.
    expect(json).not.toHaveProperty('details.name')
    expect(json).not.toHaveProperty('details.stack')

    if (json.details !== undefined) {
      expect(Array.isArray(json.details)).toBe(true)
      for (const item of json.details) {
        const keys = Object.keys(item).sort()
        expect(keys).toEqual(['message', 'path'])
      }
    }
  })
})
