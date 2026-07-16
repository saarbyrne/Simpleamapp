// tests/actions/_helpers.ts
import { vi } from 'vitest'
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
  vi.clearAllMocks()
  // default: authenticated coach in org_1 unless a test overrides
  mockRequireUser()
  ;(prisma.activity.create as any).mockResolvedValue({})
}
