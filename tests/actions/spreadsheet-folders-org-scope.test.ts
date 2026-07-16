// tests/actions/spreadsheet-folders-org-scope.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))

import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { deleteSpreadsheetFolder } from '@/app/actions/spreadsheet-folders'

describe('deleteSpreadsheetFolder cross-org moveToFolderId protection', () => {
  beforeEach(() => resetActionMocks())

  it('rejects a moveToFolderId that belongs to another organization and does not reparent', async () => {
    mockRequireUser({ organizationId: 'org_1' })

    // The folder being deleted belongs to the caller's org.
    ;(prisma.spreadsheetFolder.findUnique as any).mockImplementation(({ where }: any) => {
      if (where.id === 'folder_1') {
        return Promise.resolve({
          id: 'folder_1',
          organizationId: 'org_1',
          _count: { spreadsheets: 1, subfolders: 1 },
        })
      }
      if (where.id === 'foreign_folder') {
        // moveToFolderId target belongs to a DIFFERENT org.
        return Promise.resolve({ id: 'foreign_folder', organizationId: 'org_evil' })
      }
      return Promise.resolve(null)
    })

    const res = await deleteSpreadsheetFolder('folder_1', 'foreign_folder')

    // The vulnerability: spreadsheets/subfolders get reparented into another
    // org's folder because moveToFolderId is never checked against the
    // caller's organizationId.
    expect(prisma.spreadsheet.updateMany).not.toHaveBeenCalled()
    expect(prisma.spreadsheetFolder.updateMany).not.toHaveBeenCalled()
    expect(prisma.spreadsheetFolder.delete).not.toHaveBeenCalled()
    expect((res as any).error).toBeTruthy()
  })

  it('allows a moveToFolderId that belongs to the caller org', async () => {
    mockRequireUser({ organizationId: 'org_1' })

    ;(prisma.spreadsheetFolder.findUnique as any).mockImplementation(({ where }: any) => {
      if (where.id === 'folder_1') {
        return Promise.resolve({
          id: 'folder_1',
          organizationId: 'org_1',
          _count: { spreadsheets: 1, subfolders: 0 },
        })
      }
      if (where.id === 'good_folder') {
        return Promise.resolve({ id: 'good_folder', organizationId: 'org_1' })
      }
      return Promise.resolve(null)
    })
    ;(prisma.spreadsheet.updateMany as any).mockResolvedValue({ count: 1 })
    ;(prisma.spreadsheetFolder.delete as any).mockResolvedValue({ id: 'folder_1' })

    const res = await deleteSpreadsheetFolder('folder_1', 'good_folder')

    expect(prisma.spreadsheet.updateMany).toHaveBeenCalledWith({
      where: { folderId: 'folder_1' },
      data: { folderId: 'good_folder' },
    })
    expect((res as any).success).toBe(true)
  })
})
