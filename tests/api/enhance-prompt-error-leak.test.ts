import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/auth/cached-user', () => ({ getCachedUserWithOrganization: vi.fn() }))

vi.mock('@/lib/ai-workspace/knowledge-base', () => ({
  knowledgeBase: {
    glossary: {},
    catalog: {},
    examples: { intent_classification: [] },
  },
}))

vi.mock('@/lib/ai-workspace/context', () => ({
  getOrgContext: vi.fn().mockRejectedValue(new Error('internal failure: unexpected null at handler.internal.ts:42')),
}))

import { getCachedUserWithOrganization } from '@/lib/auth/cached-user'
import { POST } from '@/app/api/ai-workspace/enhance-prompt/route'

function req(body: unknown) {
  return new Request('http://localhost/api/ai-workspace/enhance-prompt', {
    method: 'POST',
    body: JSON.stringify(body),
  }) as any
}

describe('POST /api/ai-workspace/enhance-prompt - error detail leakage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(getCachedUserWithOrganization as any).mockResolvedValue({ id: 'user-1', organizationId: 'org-1' })
  })

  it('does not leak internal error message/stack in the 500 response', async () => {
    const res = await POST(req({ prompt: 'hello' }))
    expect(res.status).toBe(500)

    const json = await res.json()

    expect(json).not.toHaveProperty('details')
    expect(json).toEqual({ error: 'Internal Server Error' })
  })
})
