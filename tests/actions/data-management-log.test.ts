// tests/actions/data-management-log.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers' // registers hoisted vi.mock('@/lib/db'), vi.mock('@/lib/auth/cached-user')

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))

import { prisma } from '@/lib/db'
import { mockRequireUser, mockUnauthenticated, resetActionMocks } from './_helpers'
import { logDataChange, logBatchDataChanges } from '@/app/actions/data-management'

describe('logDataChange authorization', () => {
  beforeEach(() => resetActionMocks())

  it('does not write an audit-trail entry when the caller is unauthenticated', async () => {
    mockUnauthenticated()

    await logDataChange({
      spreadsheetId: 'sheet_1',
      rowId: 'row_1',
      userId: 'victim_user',
      organizationId: 'victim_org',
      action: 'update',
    })

    expect(prisma.dataChangeLog.create).not.toHaveBeenCalled()
  })

  it('derives userId/organizationId from the authenticated session, not from caller-supplied input', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.dataChangeLog.create as any).mockResolvedValue({ id: 'log_1' })

    await logDataChange({
      spreadsheetId: 'sheet_1',
      rowId: 'row_1',
      userId: 'forged_user',
      organizationId: 'forged_org',
      action: 'update',
    })

    expect(prisma.dataChangeLog.create).toHaveBeenCalled()
    const callArg = (prisma.dataChangeLog.create as any).mock.calls[0][0]
    expect(callArg.data.userId).toBe('user_1')
    expect(callArg.data.organizationId).toBe('org_1')
    expect(callArg.data.userId).not.toBe('forged_user')
    expect(callArg.data.organizationId).not.toBe('forged_org')
  })
})

describe('logBatchDataChanges authorization', () => {
  beforeEach(() => resetActionMocks())

  it('does not write audit-trail entries when the caller is unauthenticated', async () => {
    mockUnauthenticated()

    await logBatchDataChanges([
      {
        spreadsheetId: 'sheet_1',
        rowId: 'row_1',
        userId: 'victim_user',
        organizationId: 'victim_org',
        action: 'update',
      },
    ])

    expect(prisma.dataChangeLog.createMany).not.toHaveBeenCalled()
  })

  it('derives userId/organizationId from the authenticated session for every item in the batch', async () => {
    mockRequireUser({ id: 'user_1', organizationId: 'org_1' })
    ;(prisma.dataChangeLog.createMany as any).mockResolvedValue({ count: 2 })

    await logBatchDataChanges([
      {
        spreadsheetId: 'sheet_1',
        rowId: 'row_1',
        userId: 'forged_user',
        organizationId: 'forged_org',
        action: 'update',
      },
      {
        spreadsheetId: 'sheet_1',
        rowId: 'row_2',
        userId: 'other_forged_user',
        organizationId: 'other_forged_org',
        action: 'update',
      },
    ])

    expect(prisma.dataChangeLog.createMany).toHaveBeenCalled()
    const callArg = (prisma.dataChangeLog.createMany as any).mock.calls[0][0]
    for (const row of callArg.data) {
      expect(row.userId).toBe('user_1')
      expect(row.organizationId).toBe('org_1')
    }
  })
})
