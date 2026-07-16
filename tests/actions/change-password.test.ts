import { describe, it, expect, beforeEach, vi } from 'vitest'

const getUser = vi.fn()
const signInWithPassword = vi.fn()
const updateUser = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(async () => ({
    auth: { getUser, signInWithPassword, updateUser },
  })),
  createClient: vi.fn(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
// `app/actions/profile.ts` imports `@/lib/db` at module scope, which
// instantiates PrismaClient and throws without a DATABASE_URL in the test
// env. changePassword doesn't touch prisma, so a bare mock is enough.
vi.mock('@/lib/db', () => ({ prisma: {}, db: {} }))
vi.mock('@/lib/auth/cached-user', () => ({ requireUser: vi.fn() }))

import { changePassword } from '@/app/actions/profile'

describe('changePassword current-password verification', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects when the current password is wrong and does NOT update', async () => {
    getUser.mockResolvedValue({ data: { user: { email: 'me@test.com' } } })
    signInWithPassword.mockResolvedValue({ error: { message: 'Invalid login credentials' } })

    const res = await changePassword({
      currentPassword: 'wrong-Password1',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    } as any)

    expect(res.success).toBe(false)
    expect(updateUser).not.toHaveBeenCalled()
  })

  it('updates the password when the current password is correct', async () => {
    getUser.mockResolvedValue({ data: { user: { email: 'me@test.com' } } })
    signInWithPassword.mockResolvedValue({ error: null })
    updateUser.mockResolvedValue({ error: null })

    const res = await changePassword({
      currentPassword: 'correct-Password1',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    } as any)

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'me@test.com',
      password: 'correct-Password1',
    })
    expect(updateUser).toHaveBeenCalledWith({ password: 'NewPassword123!' })
    expect(res.success).toBe(true)
  })
})
