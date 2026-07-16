import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/platform-admin', () => ({
  isPlatformAdmin: vi.fn(),
  logPlatformAdminAction: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/lib/db', () => ({
  prisma: {
    organization: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    organizationFeatures: {
      create: vi.fn(),
      updateMany: vi.fn().mockResolvedValue({ count: 3 }),
      update: vi.fn(),
    },
  },
}))

import { isPlatformAdmin } from '@/lib/platform-admin'
import { prisma } from '@/lib/db'
import { bulkEnableFeature, getOrganizationsWithFeatures } from '@/app/actions/feature-matrix'

describe('bulkEnableFeature authorization', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects a non-admin and does NOT run the bulk update', async () => {
    ;(isPlatformAdmin as any).mockResolvedValue(false)
    const res = await bulkEnableFeature(['org_a', 'org_b'], 'players')
    expect(res.success).toBe(false)
    expect(prisma.organizationFeatures.updateMany).not.toHaveBeenCalled()
  })

  it('allows a platform admin', async () => {
    ;(isPlatformAdmin as any).mockResolvedValue(true)
    const res = await bulkEnableFeature(['org_a', 'org_b'], 'players')
    expect(res.success).toBe(true)
    expect(prisma.organizationFeatures.updateMany).toHaveBeenCalled()
  })
})

describe('getOrganizationsWithFeatures authorization', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects a non-admin and does NOT read organizations', async () => {
    ;(isPlatformAdmin as any).mockResolvedValue(false)
    const res = await getOrganizationsWithFeatures()
    expect(res.success).toBe(false)
    expect(prisma.organization.findMany).not.toHaveBeenCalled()
  })

  it('allows a platform admin', async () => {
    ;(isPlatformAdmin as any).mockResolvedValue(true)
    const res = await getOrganizationsWithFeatures()
    expect(res.success).toBe(true)
    expect(prisma.organization.findMany).toHaveBeenCalled()
  })
})
