// tests/actions/forms-submit.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers' // registers hoisted vi.mock('@/lib/db'), vi.mock('@/lib/auth/cached-user')

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}))

import { prisma } from '@/lib/db'
import { getTranslations } from 'next-intl/server'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { submitFormResponse } from '@/app/actions/forms'

// resetActionMocks() calls vi.resetAllMocks(), which also wipes the
// mockResolvedValue set in the vi.mock('next-intl/server', ...) factory above
// (that factory only runs once, at module load). Re-establish it after every
// reset so `t('someKey')` keeps behaving as an identity function in every test.
function resetMocks() {
  resetActionMocks()
  ;(getTranslations as any).mockResolvedValue((key: string) => key)
}

describe('submitFormResponse tenant isolation', () => {
  beforeEach(() => resetMocks())

  it('refuses to write a response for a personOrgId outside the caller org', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.form.findFirst as any).mockResolvedValue({ id: 'form_1', organizationId: 'org_1' })
    // Attacker supplies a PersonOrganization id belonging to a different org — without
    // an org check this writes (and later reads) another tenant's person data.
    ;(prisma.personOrganization.findFirst as any).mockResolvedValue(null)

    const res: any = await submitFormResponse('form_1', 'po_victim_in_other_org', { q1: 'a' })

    expect(res.error).toBeDefined()
    expect(prisma.formResponse.create).not.toHaveBeenCalled()
    expect(prisma.formResponse.update).not.toHaveBeenCalled()
  })

  it('allows submitting a response for a personOrgId within the caller org', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.form.findFirst as any).mockResolvedValue({ id: 'form_1', organizationId: 'org_1' })
    ;(prisma.personOrganization.findFirst as any).mockResolvedValue({ id: 'po_1' })
    ;(prisma.formResponse.findFirst as any).mockResolvedValue(null)
    ;(prisma.formResponse.create as any).mockResolvedValue({ id: 'resp_1' })

    const res: any = await submitFormResponse('form_1', 'po_1', { q1: 'a' })

    expect(res.success).toBe(true)
    expect(prisma.formResponse.create).toHaveBeenCalled()
  })
})
