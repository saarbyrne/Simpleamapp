// tests/actions/_helpers.ts
import { vi } from 'vitest'

// Hoisted mocks: registered here so any test file can simply
// `import './_helpers'` (before importing the action under test) to get a
// fully mocked `prisma` + `requireUser`, instead of re-declaring these
// factories per test file.
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

type UserOverrides = Partial<{ id: string; organizationId: string; email: string }>

export function mockRequireUser(overrides: UserOverrides = {}) {
  const user = {
    id: 'user_1',
    organizationId: 'org_1',
    email: 'coach@org1.test',
    ...overrides,
  }
  ;(requireUser as any).mockResolvedValue(user)
  return user
}

export function mockUnauthenticated() {
  ;(requireUser as any).mockRejectedValue(
    new Error('Unauthorized: User must be authenticated')
  )
}

export function resetActionMocks() {
  vi.resetAllMocks()
  // vi.resetAllMocks() wipes mock implementations, including the $transaction
  // implementation set up in the hoisted `vi.mock('@/lib/db', ...)` factory. Re-establish
  // it so `prisma.$transaction(cb)` continues to invoke the callback with `prisma`.
  ;(prisma.$transaction as any).mockImplementation(async (fn: any) => fn(prisma))
  // default: authenticated coach in org_1 unless a test overrides
  mockRequireUser()
  ;(prisma.activity.create as any).mockResolvedValue({})
}
