// tests/actions/drawing-templates-global.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers' // registers hoisted vi.mock('@/lib/db'), vi.mock('@/lib/auth/cached-user')

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/lib/platform-admin', () => ({ isPlatformAdmin: vi.fn() }))

import { prisma } from '@/lib/db'
import { resetActionMocks } from './_helpers'
import { createClient } from '@/lib/supabase/server'
import { isPlatformAdmin } from '@/lib/platform-admin'
import { createDrawingTemplate } from '@/app/actions/drawing-templates'

function mockSupabaseUser(email: string) {
  ;(createClient as any).mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { email } } }),
    },
  })
}

describe('createDrawingTemplate isGlobal authorization', () => {
  beforeEach(() => resetActionMocks())

  it('does not let a non-admin caller create a global (all-orgs) drawing template', async () => {
    mockSupabaseUser('coach@org1.test')
    ;(isPlatformAdmin as any).mockResolvedValue(false)
    ;(prisma.user.findUnique as any).mockResolvedValue({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.drawingTemplate.create as any).mockResolvedValue({ id: 'dt1' })

    await createDrawingTemplate({
      name: 'Evil global drawing',
      category: 'attacking',
      data: {},
      isGlobal: true,
    })

    expect(prisma.drawingTemplate.create).toHaveBeenCalled()
    const callArg = (prisma.drawingTemplate.create as any).mock.calls[0][0]
    expect(callArg.data.isGlobal).toBe(false)
    expect(callArg.data.organizationId).toBe('org_1')
  })

  it('allows a platform admin to create a global drawing template', async () => {
    mockSupabaseUser('admin@org1.test')
    ;(isPlatformAdmin as any).mockResolvedValue(true)
    ;(prisma.user.findUnique as any).mockResolvedValue({ id: 'admin_1', organizationId: 'org_1' })
    ;(prisma.drawingTemplate.create as any).mockResolvedValue({ id: 'dt2' })

    await createDrawingTemplate({
      name: 'Legit global drawing',
      category: 'attacking',
      data: {},
      isGlobal: true,
    })

    const callArg = (prisma.drawingTemplate.create as any).mock.calls[0][0]
    expect(callArg.data.isGlobal).toBe(true)
    expect(callArg.data.organizationId).toBeNull()
  })
})
