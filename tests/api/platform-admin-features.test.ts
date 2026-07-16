// tests/api/platform-admin-features.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/platform-admin', () => ({ requirePlatformAdmin: vi.fn() }))
vi.mock('@/lib/permissions/feature-access', () => ({
  getOrganizationFeatures: vi.fn().mockResolvedValue({ id: 'f1' }),
  updateOrganizationFeatures: vi.fn().mockResolvedValue({ id: 'f1' }),
  getOrganizationTier: vi.fn().mockResolvedValue('free'),
}))
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/lib/db', () => ({
  prisma: {
    organization: {
      findUnique: vi.fn().mockResolvedValue({ id: 'org_1', name: 'Org One' }),
    },
  },
}))

import { requirePlatformAdmin } from '@/lib/platform-admin'
import { updateOrganizationFeatures } from '@/lib/permissions/feature-access'
import { PATCH } from '@/app/api/platform-admin/organizations/[id]/features/route'

function req(body: unknown) {
  return new Request('http://localhost/api/platform-admin/organizations/org_victim/features', {
    method: 'PATCH',
    body: JSON.stringify(body),
  }) as any
}

describe('PATCH platform-admin features authorization', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 403 for a non-admin and does NOT mutate', async () => {
    ;(requirePlatformAdmin as any).mockRejectedValue(new Error('Platform admin access required'))
    const res = await PATCH(req({ trainingModule: true }), { params: { id: 'org_victim' } } as any)
    expect(res.status).toBe(403)
    expect(updateOrganizationFeatures).not.toHaveBeenCalled()
  })

  it('proceeds for an admin', async () => {
    ;(requirePlatformAdmin as any).mockResolvedValue({ id: 'admin_1', isPlatformAdmin: true })
    const res = await PATCH(req({ trainingModule: true }), { params: { id: 'org_1' } } as any)
    expect(res.status).toBe(200)
    expect(updateOrganizationFeatures).toHaveBeenCalled()
  })
})
