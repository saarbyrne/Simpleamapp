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
import { prisma } from '@/lib/db'
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

  // Regression: resetActionMocks() must reset mock *implementations*, not just call
  // history, so per-test mockResolvedValue()/mockImplementation() overrides don't leak
  // into later tests via the shared harness. Order matters: this test must run before
  // the one below (Vitest runs tests within a file in declaration order).
  it('sets a custom implementation on prisma.person.update (leak setup)', async () => {
    ;(prisma.person.update as any).mockResolvedValue({ id: 'leaked' })
    await expect((prisma.person.update as any)()).resolves.toEqual({ id: 'leaked' })
  })

  it('resetActionMocks clears implementations set by a previous test', () => {
    // vi.resetAllMocks() resets each mock to a bare vi.fn() with no implementation,
    // so calling it now returns undefined synchronously (not a resolved promise).
    expect((prisma.person.update as any)()).toBeUndefined()
  })

  it('resetActionMocks re-establishes the $transaction implementation', async () => {
    const result = await (prisma.$transaction as any)(async (tx: any) => tx)
    expect(result).toBe(prisma)
  })
})
