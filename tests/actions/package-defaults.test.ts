import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/platform-admin', () => ({
  isPlatformAdmin: vi.fn(),
  logPlatformAdminAction: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/lib/db', () => ({
  prisma: {
    packageDefaults: {
      findMany: vi.fn().mockResolvedValue([]),
      upsert: vi.fn().mockResolvedValue({}),
    },
  },
}))

import { isPlatformAdmin } from '@/lib/platform-admin'
import { prisma } from '@/lib/db'
import { getAllPackageDefaults, updatePackageDefaults } from '@/app/actions/package-defaults'

describe('updatePackageDefaults authorization', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects a non-admin and does NOT persist changes', async () => {
    ;(isPlatformAdmin as any).mockResolvedValue(false)
    const res = await updatePackageDefaults('pro', ['players'])
    expect(res.success).toBe(false)
    expect(prisma.packageDefaults.upsert).not.toHaveBeenCalled()
  })

  it('allows a platform admin', async () => {
    ;(isPlatformAdmin as any).mockResolvedValue(true)
    const res = await updatePackageDefaults('pro', ['players'])
    expect(res.success).toBe(true)
    expect(prisma.packageDefaults.upsert).toHaveBeenCalled()
  })
})

describe('getAllPackageDefaults authorization', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects a non-admin and does NOT read package defaults', async () => {
    ;(isPlatformAdmin as any).mockResolvedValue(false)
    const res = await getAllPackageDefaults()
    expect(res.success).toBe(false)
    expect(prisma.packageDefaults.findMany).not.toHaveBeenCalled()
  })

  it('allows a platform admin', async () => {
    ;(isPlatformAdmin as any).mockResolvedValue(true)
    const res = await getAllPackageDefaults()
    expect(res.success).toBe(true)
    expect(prisma.packageDefaults.findMany).toHaveBeenCalled()
  })
})
