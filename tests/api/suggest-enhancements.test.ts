import { describe, it, expect, beforeEach, vi } from 'vitest'

const { createMock, checkRateLimitMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  checkRateLimitMock: vi.fn(),
}))
vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = { create: createMock }
  },
}))
vi.mock('@/lib/auth/cached-user', () => ({ getCachedUserWithOrganization: vi.fn() }))

vi.mock('@/lib/rate-limit', async () => {
  const actual = await vi.importActual<typeof import('@/lib/rate-limit')>('@/lib/rate-limit')
  return {
    ...actual,
    checkRateLimit: checkRateLimitMock,
  }
})

import { getCachedUserWithOrganization } from '@/lib/auth/cached-user'
import { POST } from '@/app/api/ai-workspace/suggest-enhancements/route'

function req() {
  return new Request('http://localhost/api/ai-workspace/suggest-enhancements', {
    method: 'POST',
    body: JSON.stringify({ prompt: 'x', artifactType: 'reports' }),
  }) as any
}

describe('suggest-enhancements auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    checkRateLimitMock.mockReturnValue({ success: true, remaining: 19, resetTime: Date.now(), limit: 20 })
  })

  it('returns 401 and never calls Anthropic when unauthenticated', async () => {
    ;(getCachedUserWithOrganization as any).mockResolvedValue(null)
    const res = await POST(req())
    expect(res.status).toBe(401)
    expect(createMock).not.toHaveBeenCalled()
  })

  it('returns 429 when authenticated but rate-limited', async () => {
    ;(getCachedUserWithOrganization as any).mockResolvedValue({ id: 'user-1', organizationId: 'org-1' })
    checkRateLimitMock.mockReturnValue({ success: false, remaining: 0, resetTime: Date.now(), limit: 20 })

    const res = await POST(req())
    expect(res.status).toBe(429)
    expect(createMock).not.toHaveBeenCalled()
  })
})
