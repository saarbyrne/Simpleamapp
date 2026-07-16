// tests/actions/_helpers.ts
import { vi } from 'vitest'

// Hoisted mocks: registered here so any test file can simply
// `import './_helpers'` (before importing the action under test) to get a
// fully mocked `prisma` + `requireUser`, instead of re-declaring these
// factories per test file.
vi.mock('@/lib/db', () => {
  const mockPrisma: any = {
    person: { update: vi.fn(), delete: vi.fn(), updateMany: vi.fn(), findFirst: vi.fn() },
    personOrganization: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    note: { findFirst: vi.fn(), findUnique: vi.fn() },
    plan: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
    milestone: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
    spreadsheetFolder: { findUnique: vi.fn(), updateMany: vi.fn(), delete: vi.fn() },
    spreadsheet: { updateMany: vi.fn() },
    activity: { create: vi.fn() },
    user: { findUnique: vi.fn(), findFirst: vi.fn() },
    organization: { findUnique: vi.fn() },
    communityTemplate: { create: vi.fn(), update: vi.fn(), findUnique: vi.fn() },
    templateReview: { create: vi.fn(), findUnique: vi.fn(), findMany: vi.fn() },
    reportTemplate: { create: vi.fn() },
    drawingTemplate: { create: vi.fn(), update: vi.fn(), updateMany: vi.fn(), findFirst: vi.fn() },
    dataChangeLog: { create: vi.fn(), createMany: vi.fn() },
    event: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    eventAttendance: {
      findMany: vi.fn(),
      createMany: vi.fn(),
      deleteMany: vi.fn(),
      upsert: vi.fn(),
      count: vi.fn(),
    },
    form: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    formResponse: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
  }
  mockPrisma.$transaction = vi.fn(async (arg: any) =>
    Array.isArray(arg) ? Promise.all(arg) : arg(mockPrisma)
  )
  // Real @/lib/db exports `db` as an alias for `prisma` (`export const db = prisma`);
  // mirror that here so actions importing either name share the same mocked instance.
  return { prisma: mockPrisma, db: mockPrisma }
})
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
  ;(prisma.$transaction as any).mockImplementation(async (arg: any) =>
    Array.isArray(arg) ? Promise.all(arg) : arg(prisma)
  )
  // default: authenticated coach in org_1 unless a test overrides
  mockRequireUser()
  ;(prisma.activity.create as any).mockResolvedValue({})
}
