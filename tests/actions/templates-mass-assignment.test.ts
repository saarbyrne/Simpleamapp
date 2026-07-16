// tests/actions/templates-mass-assignment.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers' // registers hoisted vi.mock('@/lib/db'), vi.mock('@/lib/auth/cached-user')

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))

import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { createTemplate, updateTemplate } from '@/app/actions/templates'

describe('createTemplate mass-assignment protection', () => {
  beforeEach(() => resetActionMocks())

  it('does not let a caller forge trust/marketplace fields via mass assignment', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.organization.findUnique as any).mockResolvedValue({ name: 'Org 1' })
    ;(prisma.communityTemplate.create as any).mockResolvedValue({ id: 't1' })

    await createTemplate({
      type: 'drill',
      name: 'Evil Template',
      description: 'desc',
      category: 'cat',
      sport: 'football',
      tags: [],
      features: [],
      config: {},
      // attacker-injected trust/privilege fields not in CreateTemplateInput's public type,
      // but reachable at runtime since the server action performs no whitelist/validation
      isOfficial: true,
      isFeatured: true,
      downloads: 999999,
      rating: 5,
    } as any)

    expect(prisma.communityTemplate.create).toHaveBeenCalled()
    const callArg = (prisma.communityTemplate.create as any).mock.calls[0][0]
    expect(callArg.data.isOfficial).not.toBe(true)
    expect(callArg.data.isFeatured).not.toBe(true)
    expect(callArg.data.downloads).not.toBe(999999)
    expect(callArg.data.rating).not.toBe(5)
  })
})

describe('updateTemplate mass-assignment protection', () => {
  beforeEach(() => resetActionMocks())

  it('does not let the owner set trust/marketplace fields on update', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.communityTemplate.findUnique as any).mockResolvedValue({ authorId: 'user_1' })
    ;(prisma.communityTemplate.update as any).mockResolvedValue({ id: 't1' })

    await updateTemplate('t1', {
      isOfficial: true,
      isFeatured: true,
      status: 'published',
    } as any)

    expect(prisma.communityTemplate.update).toHaveBeenCalled()
    const callArg = (prisma.communityTemplate.update as any).mock.calls[0][0]
    expect(callArg.data.isOfficial).not.toBe(true)
    expect(callArg.data.isFeatured).not.toBe(true)
  })
})
