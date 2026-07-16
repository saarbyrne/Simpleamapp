// tests/actions/notes-get.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))

import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { getNote } from '@/app/actions/notes'

describe('getNote tenant isolation', () => {
  beforeEach(() => resetActionMocks())

  it('queries scoped by organizationId', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.note.findFirst as any).mockResolvedValue(null)

    const res = await getNote('cknoteid000000000000000000')

    expect(prisma.note.findFirst).toHaveBeenCalled()
    const call = (prisma.note.findFirst as any).mock.calls[0][0]
    expect(call.where.id).toBe('cknoteid000000000000000000')
    expect(call.where.organizationId).toBe('org_1')
    expect(res).toEqual({ success: false, error: 'Note not found' })
  })
})
