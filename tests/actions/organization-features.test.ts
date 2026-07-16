import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/platform-admin', () => ({
  isPlatformAdmin: vi.fn(),
  logPlatformAdminAction: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/lib/permissions/feature-access', () => ({
  updateOrganizationFeatures: vi.fn().mockResolvedValue({ id: 'f1' }),
  getOrganizationFeatures: vi.fn(),
  resetOrganizationFeatures: vi.fn(),
  enableAllFeatures: vi.fn(),
  disableAllFeatures: vi.fn(),
  getFeatureCounts: vi.fn(),
  getEnabledFeatures: vi.fn(),
  getFeatureStatusDetails: vi.fn(),
  getOrganizationTier: vi.fn(),
  setFeatureOverride: vi.fn(),
}))

import { isPlatformAdmin } from '@/lib/platform-admin'
import { updateOrganizationFeatures, getEnabledFeatures } from '@/lib/permissions/feature-access'
import { updateOrganizationFeaturesAction, getEnabledFeaturesAction } from '@/app/actions/organization-features'

describe('updateOrganizationFeaturesAction authorization', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects a non-admin and does NOT mutate features', async () => {
    ;(isPlatformAdmin as any).mockResolvedValue(false)
    const res = await updateOrganizationFeaturesAction('org_victim', { trainingModule: true } as any)
    expect(res.success).toBe(false)
    expect(updateOrganizationFeatures).not.toHaveBeenCalled()
  })

  it('allows a platform admin', async () => {
    ;(isPlatformAdmin as any).mockResolvedValue(true)
    const res = await updateOrganizationFeaturesAction('org_1', { trainingModule: true } as any)
    expect(res.success).toBe(true)
    expect(updateOrganizationFeatures).toHaveBeenCalledWith('org_1', { trainingModule: true })
  })
})

describe('getEnabledFeaturesAction authorization', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects a non-admin and does NOT read features', async () => {
    ;(isPlatformAdmin as any).mockResolvedValue(false)
    const res = await getEnabledFeaturesAction('org_victim')
    expect(res.success).toBe(false)
    expect(getEnabledFeatures).not.toHaveBeenCalled()
  })

  it('allows a platform admin', async () => {
    ;(isPlatformAdmin as any).mockResolvedValue(true)
    ;(getEnabledFeatures as any).mockResolvedValue(['featureA'])
    const res = await getEnabledFeaturesAction('org_1')
    expect(res.success).toBe(true)
    expect(getEnabledFeatures).toHaveBeenCalledWith('org_1')
  })
})
