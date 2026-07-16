// tests/actions/templates-review.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers' // registers hoisted vi.mock('@/lib/db'), vi.mock('@/lib/auth/cached-user')

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))

import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { createReview } from '@/app/actions/templates'

describe('createReview rating bounds', () => {
  beforeEach(() => resetActionMocks())

  it('rejects an out-of-range rating and does not write it anywhere', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.templateReview.findUnique as any).mockResolvedValue(null)

    const result = await createReview('template_1', 5000, 'x')

    expect(result).toHaveProperty('error')
    expect(prisma.templateReview.create).not.toHaveBeenCalled()
    expect(prisma.communityTemplate.update).not.toHaveBeenCalled()
  })

  it('rejects a non-integer rating', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.templateReview.findUnique as any).mockResolvedValue(null)

    const result = await createReview('template_1', 3.5, 'x')

    expect(result).toHaveProperty('error')
    expect(prisma.templateReview.create).not.toHaveBeenCalled()
    expect(prisma.communityTemplate.update).not.toHaveBeenCalled()
  })

  it('rejects a rating below 1', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.templateReview.findUnique as any).mockResolvedValue(null)

    const result = await createReview('template_1', 0, 'x')

    expect(result).toHaveProperty('error')
    expect(prisma.templateReview.create).not.toHaveBeenCalled()
    expect(prisma.communityTemplate.update).not.toHaveBeenCalled()
  })

  it('accepts a valid in-range rating', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.templateReview.findUnique as any).mockResolvedValue(null)
    ;(prisma.templateReview.create as any).mockResolvedValue({ id: 'review_1', templateId: 'template_1', rating: 4 })
    ;(prisma.templateReview.findMany as any).mockResolvedValue([{ rating: 4 }])
    ;(prisma.communityTemplate.update as any).mockResolvedValue({ id: 'template_1' })

    const result = await createReview('template_1', 4, 'great template')

    expect(result).not.toHaveProperty('error')
    expect(prisma.templateReview.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ rating: 4 }) })
    )
    expect(prisma.communityTemplate.update).toHaveBeenCalled()
  })
})
