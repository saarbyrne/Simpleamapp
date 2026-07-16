import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers'
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn }))

import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { deletePlayer } from '@/app/actions/players'

describe('deletePlayer tenant isolation', () => {
  beforeEach(() => resetActionMocks())

  it('does NOT globally delete a person outside the caller org', async () => {
    mockRequireUser({ organizationId: 'org_attacker' })
    ;(prisma.personOrganization.findFirst as any).mockResolvedValue(null)
    const res = await deletePlayer('ckvictimpersonid0000000000')
    expect(res).toEqual({ error: 'Player not found' })
    expect(prisma.person.delete).not.toHaveBeenCalled()
  })
})
