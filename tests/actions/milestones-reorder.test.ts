// tests/actions/milestones-reorder.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}))

import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { reorderMilestones } from '@/app/actions/milestones'

describe('reorderMilestones tenant isolation', () => {
  beforeEach(() => resetActionMocks())

  it('scopes each milestone update by id AND planId', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.plan.findFirst as any).mockResolvedValue({ id: 'plan_1', organizationId: 'org_1' })
    ;(prisma.milestone.updateMany as any).mockResolvedValue({ count: 1 })

    const res = await reorderMilestones('plan_1', ['m1', 'm2'])

    expect(prisma.milestone.updateMany).toHaveBeenCalledTimes(2)
    for (const call of (prisma.milestone.updateMany as any).mock.calls) {
      const [{ where }] = call
      expect(where.planId).toBe('plan_1')
      expect(where.id).toBeDefined()
    }
    expect(prisma.milestone.update).not.toHaveBeenCalled()
    expect((res as any).success).toBe(true)
  })
})
