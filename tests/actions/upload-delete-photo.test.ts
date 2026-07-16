// tests/actions/upload-delete-photo.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))

import { createClient } from '@/lib/supabase/server'
import { deletePlayerPhoto } from '@/lib/storage/upload'

function mockSupabaseUser(id: string) {
  const remove = vi.fn().mockResolvedValue({ error: null })
  ;(createClient as any).mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id } } }),
    },
    storage: {
      from: vi.fn().mockReturnValue({ remove }),
    },
  })
  return remove
}

describe('deletePlayerPhoto authorization', () => {
  beforeEach(() => vi.resetAllMocks())

  it('rejects deleting a path outside the caller\'s own namespace and does not call storage.remove', async () => {
    const remove = mockSupabaseUser('user_1')

    const result = await deletePlayerPhoto('user_2/some-other-players-photo.png')

    expect(remove).not.toHaveBeenCalled()
    expect(result.error).toBeDefined()
  })

  it('allows deleting a path within the caller\'s own namespace', async () => {
    const remove = mockSupabaseUser('user_1')

    const result = await deletePlayerPhoto('user_1/my-photo.png')

    expect(remove).toHaveBeenCalledWith(['user_1/my-photo.png'])
    expect(result.success).toBe(true)
  })
})
