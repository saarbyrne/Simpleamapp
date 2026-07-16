// tests/actions/data-tables-save.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))

import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { savePlayersData } from '@/app/actions/data-tables'

describe('savePlayersData tenant isolation', () => {
  beforeEach(() => resetActionMocks())

  it('skips a row whose PersonOrganization belongs to another org', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.personOrganization.findUnique as any).mockResolvedValue({
      personId: 'ckvictimpersonid0000000000',
      organizationId: 'org_attacker',
    })

    const res = await savePlayersData([
      { id: 'ckvictimpersonorgid000000', firstName: 'Hacked' } as any,
    ])

    expect(prisma.person.update).not.toHaveBeenCalled()
    expect(prisma.personOrganization.update).not.toHaveBeenCalled()
    expect((res as any).success).toBe(true)
  })

  it('updates a row whose PersonOrganization belongs to the caller org', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.personOrganization.findUnique as any).mockResolvedValue({
      personId: 'ckmypersonid0000000000000',
      organizationId: 'org_1',
    })
    ;(prisma.person.update as any).mockResolvedValue({ id: 'ckmypersonid0000000000000' })
    ;(prisma.personOrganization.update as any).mockResolvedValue({ id: 'ckmypersonorgid0000000000' })

    const res = await savePlayersData([
      { id: 'ckmypersonorgid0000000000', firstName: 'Ok' } as any,
    ])

    expect(prisma.person.update).toHaveBeenCalled()
    expect((res as any).success).toBe(true)
  })
})
