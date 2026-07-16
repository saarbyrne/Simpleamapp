// tests/actions/milestones-org-scope.test.ts
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
import { createMilestone, updateMilestone } from '@/app/actions/milestones'

// resetActionMocks() calls vi.resetAllMocks(), which also wipes the
// mockResolvedValue set in the vi.mock('next-intl/server', ...) factory above
// (that factory only runs once, at module load). Re-establish it after every
// reset so `t('someKey')` keeps behaving as an identity function in every test.
function resetMocks() {
  resetActionMocks()
  ;(getTranslations as any).mockResolvedValue((key: string) => key)
}

describe('createMilestone assignedTo cross-org protection', () => {
  beforeEach(() => resetMocks())

  it('rejects an assignedTo belonging to a user in another organization', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.plan.findFirst as any).mockResolvedValue({ id: 'plan_1', organizationId: 'org_1' })
    ;(prisma.user.findFirst as any).mockResolvedValue(null)

    const res = await createMilestone({
      planId: 'plan_1',
      title: 'Milestone 1',
      assignedTo: 'foreign_user',
    })

    expect(prisma.milestone.create).not.toHaveBeenCalled()
    expect((res as any).error).toBeTruthy()
  })

  it('allows an assignedTo belonging to a user in the caller org', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.plan.findFirst as any).mockResolvedValue({ id: 'plan_1', organizationId: 'org_1' })
    ;(prisma.user.findFirst as any).mockResolvedValue({ id: 'user_2', organizationId: 'org_1' })
    ;(prisma.milestone.findFirst as any).mockResolvedValue(null)
    ;(prisma.milestone.create as any).mockResolvedValue({ id: 'm_1', planId: 'plan_1' })

    const res = await createMilestone({
      planId: 'plan_1',
      title: 'Milestone 1',
      assignedTo: 'user_2',
    })

    expect(prisma.milestone.create).toHaveBeenCalled()
    const callArg = (prisma.milestone.create as any).mock.calls[0][0]
    expect(callArg.data.assignedTo).toBe('user_2')
    expect((res as any).success).toBe(true)
  })
})

describe('updateMilestone assignedTo cross-org protection', () => {
  beforeEach(() => resetMocks())

  it('rejects reassigning assignedTo to a user outside the caller org', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.milestone.findFirst as any).mockResolvedValue({
      id: 'm_1',
      planId: 'plan_1',
      plan: { organizationId: 'org_1' },
    })
    ;(prisma.user.findFirst as any).mockResolvedValue(null)

    const res = await updateMilestone('m_1', { assignedTo: 'foreign_user' })

    expect(prisma.milestone.update).not.toHaveBeenCalled()
    expect((res as any).error).toBeTruthy()
  })
})
