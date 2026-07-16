import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers'
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn }))

import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { bulkUpdatePlayers } from '@/app/actions/players'

describe('bulkUpdatePlayers tenant isolation', () => {
  beforeEach(() => resetActionMocks())

  it('only updates persons that belong to the caller org', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    // Only one of the two requested ids is in org_1
    ;(prisma.personOrganization.findMany as any) = vi.fn().mockResolvedValue([{ personId: 'ckmineid000000000000000000' }])
    ;(prisma.person.updateMany as any).mockResolvedValue({ count: 1 })
    ;(prisma.personOrganization.updateMany as any).mockResolvedValue({ count: 1 })

    await bulkUpdatePlayers(
      ['ckmineid000000000000000000', 'cktheirid00000000000000000'],
      { nationality: 'X', status: 'active' }
    )

    const call = (prisma.person.updateMany as any).mock.calls[0][0]
    expect(call.where.id.in).toEqual(['ckmineid000000000000000000'])
  })
})
