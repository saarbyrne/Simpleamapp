// tests/actions/plans-org-scope.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}))

import { prisma } from '@/lib/db'
import { getTranslations } from 'next-intl/server'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { createPlan, updatePlan } from '@/app/actions/plans'

// resetActionMocks() calls vi.resetAllMocks(), which also wipes the
// mockResolvedValue set in the vi.mock('next-intl/server', ...) factory above
// (that factory only runs once, at module load). Re-establish it after every
// reset so `t('someKey')` keeps behaving as an identity function in every test.
function resetMocks() {
  resetActionMocks()
  ;(getTranslations as any).mockResolvedValue((key: string) => key)
}

describe('createPlan ownerId cross-org protection', () => {
  beforeEach(() => resetMocks())

  it('rejects an ownerId belonging to a user in another organization', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    // ownerId points at a user who exists, but in a different org.
    ;(prisma.user.findFirst as any).mockResolvedValue(null)

    const res = await createPlan({
      name: 'Season Plan',
      type: 'season',
      startDate: '2026-01-01',
      endDate: '2026-06-01',
      ownerId: 'foreign_user',
    })

    expect(prisma.plan.create).not.toHaveBeenCalled()
    expect((res as any).error).toBeTruthy()
  })

  it('allows an ownerId belonging to a user in the caller org', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.user.findFirst as any).mockResolvedValue({ id: 'user_2', organizationId: 'org_1' })
    ;(prisma.plan.create as any).mockResolvedValue({ id: 'plan_1', name: 'Season Plan', type: 'season' })
    ;(prisma.activity.create as any).mockResolvedValue({})

    const res = await createPlan({
      name: 'Season Plan',
      type: 'season',
      startDate: '2026-01-01',
      endDate: '2026-06-01',
      ownerId: 'user_2',
    })

    expect(prisma.plan.create).toHaveBeenCalled()
    const callArg = (prisma.plan.create as any).mock.calls[0][0]
    expect(callArg.data.ownerId).toBe('user_2')
    expect((res as any).success).toBe(true)
  })
})

describe('updatePlan ownerId cross-org protection', () => {
  beforeEach(() => resetMocks())

  it('rejects reassigning ownerId to a user outside the caller org', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.plan.findFirst as any).mockResolvedValue({ id: 'plan_1', organizationId: 'org_1' })
    ;(prisma.user.findFirst as any).mockResolvedValue(null)

    const res = await updatePlan('plan_1', { ownerId: 'foreign_user' })

    expect(prisma.plan.update).not.toHaveBeenCalled()
    expect((res as any).error).toBeTruthy()
  })
})
