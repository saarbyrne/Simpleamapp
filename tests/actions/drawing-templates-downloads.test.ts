// tests/actions/drawing-templates-downloads.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers' // registers hoisted vi.mock('@/lib/db'), vi.mock('@/lib/auth/cached-user')

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))

import { prisma } from '@/lib/db'
import { resetActionMocks } from './_helpers'
import { createClient } from '@/lib/supabase/server'
import { incrementTemplateDownloads } from '@/app/actions/drawing-templates'

function mockSupabaseUser(email: string) {
  ;(createClient as any).mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { email } }, error: null }),
    },
  })
}

describe('incrementTemplateDownloads authorization', () => {
  beforeEach(() => resetActionMocks())

  it('does not increment a private template belonging to another organization', async () => {
    mockSupabaseUser('coach@org1.test')
    ;(prisma.user.findUnique as any).mockResolvedValue({ id: 'user_1', organizationId: 'org_1' })
    // Simulate the DB enforcing the scoping guard: an updateMany whose `where`
    // does not match (wrong org, not global) affects zero rows.
    ;(prisma.drawingTemplate.updateMany as any).mockResolvedValue({ count: 0 })
    ;(prisma.drawingTemplate.update as any).mockResolvedValue({ id: 'dt_other_org' })

    const result = await incrementTemplateDownloads('dt_other_org')

    // The unscoped `update({ where: { id } })` call must not be used at all —
    // it would unconditionally mutate another org's template.
    expect(prisma.drawingTemplate.update).not.toHaveBeenCalled()

    // The scoped call must have been attempted with an org/global guard.
    expect(prisma.drawingTemplate.updateMany).toHaveBeenCalled()
    const callArg = (prisma.drawingTemplate.updateMany as any).mock.calls[0][0]
    expect(callArg.where.id).toBe('dt_other_org')
    expect(callArg.where.OR).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ isGlobal: true }),
        expect.objectContaining({ organizationId: 'org_1' }),
      ])
    )

    expect(result.error).toBeDefined()
  })

  it('increments a template that belongs to the caller org', async () => {
    mockSupabaseUser('coach@org1.test')
    ;(prisma.user.findUnique as any).mockResolvedValue({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.drawingTemplate.updateMany as any).mockResolvedValue({ count: 1 })

    const result = await incrementTemplateDownloads('dt_own_org')

    expect(result.success).toBe(true)
    expect(prisma.drawingTemplate.update).not.toHaveBeenCalled()
    const callArg = (prisma.drawingTemplate.updateMany as any).mock.calls[0][0]
    expect(callArg.where.id).toBe('dt_own_org')
  })
})
