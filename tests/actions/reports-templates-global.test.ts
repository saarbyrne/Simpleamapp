// tests/actions/reports-templates-global.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers' // registers hoisted vi.mock('@/lib/db'), vi.mock('@/lib/auth/cached-user')

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))
vi.mock('@/lib/platform-admin', () => ({ isPlatformAdmin: vi.fn() }))

import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { isPlatformAdmin } from '@/lib/platform-admin'
import { createReportTemplate } from '@/app/actions/reports'

describe('createReportTemplate isGlobal authorization', () => {
  beforeEach(() => resetActionMocks())

  it('does not let a non-admin caller create a global (all-orgs) template', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(isPlatformAdmin as any).mockResolvedValue(false)
    ;(prisma.reportTemplate.create as any).mockResolvedValue({ id: 'rt1' })

    await createReportTemplate({
      name: 'Evil global template',
      description: 'desc',
      category: 'team',
      config: {} as any,
      isGlobal: true,
    })

    expect(prisma.reportTemplate.create).toHaveBeenCalled()
    const callArg = (prisma.reportTemplate.create as any).mock.calls[0][0]
    expect(callArg.data.isGlobal).toBe(false)
    expect(callArg.data.organizationId).toBe('org_1')
  })

  it('allows a platform admin to create a global template', async () => {
    mockRequireUser({ id: 'admin_1', organizationId: 'org_1' })
    ;(isPlatformAdmin as any).mockResolvedValue(true)
    ;(prisma.reportTemplate.create as any).mockResolvedValue({ id: 'rt2' })

    await createReportTemplate({
      name: 'Legit global template',
      description: 'desc',
      category: 'team',
      config: {} as any,
      isGlobal: true,
    })

    const callArg = (prisma.reportTemplate.create as any).mock.calls[0][0]
    expect(callArg.data.isGlobal).toBe(true)
    expect(callArg.data.organizationId).toBeNull()
  })
})
