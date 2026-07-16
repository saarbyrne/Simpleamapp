// tests/actions/harness.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    person: { update: vi.fn(), delete: vi.fn(), updateMany: vi.fn(), findFirst: vi.fn() },
    personOrganization: { findFirst: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn() },
    note: { findFirst: vi.fn(), findUnique: vi.fn() },
    activity: { create: vi.fn() },
    $transaction: vi.fn(async (fn: any) => fn((await import('@/lib/db')).prisma)),
  },
}))
vi.mock('@/lib/auth/cached-user', () => ({ requireUser: vi.fn() }))

import { requireUser } from '@/lib/auth/cached-user'
import { mockRequireUser, mockUnauthenticated, resetActionMocks } from './_helpers'

describe('action harness', () => {
  beforeEach(() => resetActionMocks())

  it('mockRequireUser makes requireUser resolve a user with organizationId', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    const user = await (requireUser as any)()
    expect(user.organizationId).toBe('org_1')
  })

  it('mockUnauthenticated makes requireUser throw the unauthorized error', async () => {
    mockUnauthenticated()
    await expect((requireUser as any)()).rejects.toThrow('Unauthorized: User must be authenticated')
  })
})
