// tests/actions/players-update.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers' // registers the hoisted vi.mock calls (@/lib/db, @/lib/auth/cached-user)

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))

import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { updatePlayer } from '@/app/actions/players'

describe('updatePlayer tenant isolation', () => {
  beforeEach(() => resetActionMocks())

  it('refuses to update a person that is not in the caller org', async () => {
    mockRequireUser({ organizationId: 'org_attacker' })
    ;(prisma.personOrganization.findFirst as any).mockResolvedValue(null) // victim not in attacker org
    const res = await updatePlayer('ckvictimpersonid0000000000', { firstName: 'Hacked' })
    expect(res).toEqual({ error: 'Player not found' })
    expect(prisma.person.update).not.toHaveBeenCalled()
  })

  it('updates a person that IS in the caller org', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.personOrganization.findFirst as any).mockResolvedValue({ id: 'po_1' })
    ;(prisma.person.update as any).mockResolvedValue({ id: 'p1', firstName: 'Ok', lastName: 'Name' })
    const res = await updatePlayer('ckownpersonid00000000000000', { firstName: 'Ok' })
    expect((res as any).success).toBe(true)
    expect(prisma.person.update).toHaveBeenCalled()
  })
})
