// tests/actions/events-attendees.test.ts
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
import { createEvent, updateEvent, updateAttendance } from '@/app/actions/events'

// resetActionMocks() calls vi.resetAllMocks(), which also wipes the
// mockResolvedValue set in the vi.mock('next-intl/server', ...) factory above
// (that factory only runs once, at module load). Re-establish it after every
// reset so `t('someKey')` keeps behaving as an identity function in every test.
function resetMocks() {
  resetActionMocks()
  ;(getTranslations as any).mockResolvedValue((key: string) => key)
}

describe('createEvent attendee tenant isolation', () => {
  beforeEach(() => resetMocks())

  it('refuses to attach an attendee whose personOrgId belongs to another organization', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    // Attacker (member of org_1) supplies a PersonOrganization id that actually
    // belongs to a different org (e.g. scraped from another tenant's UI).
    ;(prisma.personOrganization.findMany as any).mockResolvedValue([]) // none owned by org_1
    ;(prisma.event.create as any).mockResolvedValue({
      id: 'evt_1', title: 'Training', type: 'training', startTime: new Date(), endTime: new Date(),
    })

    const res: any = await createEvent({
      title: 'Training',
      type: 'training',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600_000).toISOString(),
      attendeeIds: ['po_victim_in_other_org'],
    })

    expect(res.error).toBeDefined()
    // The whole write must be rejected before any event or attendance row is created —
    // otherwise a partially-created event with no attendees (or worse, cross-tenant
    // attendance) would leak through.
    expect(prisma.event.create).not.toHaveBeenCalled()
    expect(prisma.eventAttendance.createMany).not.toHaveBeenCalled()
  })

  it('creates the event and attendance when the attendee belongs to the caller org', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.personOrganization.findMany as any).mockResolvedValue([{ id: 'po_1' }])
    ;(prisma.event.create as any).mockResolvedValue({
      id: 'evt_1', title: 'Training', type: 'training', startTime: new Date(), endTime: new Date(),
    })
    ;(prisma.eventAttendance.createMany as any).mockResolvedValue({ count: 1 })

    const res: any = await createEvent({
      title: 'Training',
      type: 'training',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600_000).toISOString(),
      attendeeIds: ['po_1'],
    })

    expect(res.success).toBe(true)
    expect(prisma.eventAttendance.createMany).toHaveBeenCalled()
  })
})

describe('updateEvent attendee tenant isolation', () => {
  beforeEach(() => resetMocks())

  it('refuses to overwrite attendees with a foreign personOrgId and leaves existing attendance untouched', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.event.findFirst as any).mockResolvedValue({
      id: 'evt_1', organizationId: 'org_1', title: 'Training', type: 'training',
    })
    ;(prisma.personOrganization.findMany as any).mockResolvedValue([]) // foreign id not owned by org_1

    const res: any = await updateEvent('evt_1', { attendeeIds: ['po_victim_in_other_org'] })

    expect(res.error).toBeDefined()
    expect(prisma.eventAttendance.deleteMany).not.toHaveBeenCalled()
    expect(prisma.eventAttendance.createMany).not.toHaveBeenCalled()
  })

  it('updates attendees when they all belong to the caller org', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.event.findFirst as any).mockResolvedValue({
      id: 'evt_1', organizationId: 'org_1', title: 'Training', type: 'training',
    })
    ;(prisma.personOrganization.findMany as any).mockResolvedValue([{ id: 'po_1' }])
    ;(prisma.eventAttendance.deleteMany as any).mockResolvedValue({ count: 0 })
    ;(prisma.eventAttendance.createMany as any).mockResolvedValue({ count: 1 })
    ;(prisma.event.update as any).mockResolvedValue({ id: 'evt_1', title: 'Training', type: 'training' })

    const res: any = await updateEvent('evt_1', { attendeeIds: ['po_1'] })

    expect(res.success).toBe(true)
    expect(prisma.eventAttendance.createMany).toHaveBeenCalled()
  })
})

describe('updateAttendance tenant isolation', () => {
  beforeEach(() => resetMocks())

  it('refuses to record attendance for a personOrgId outside the caller org', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.event.findFirst as any).mockResolvedValue({ id: 'evt_1', organizationId: 'org_1' })
    ;(prisma.personOrganization.findFirst as any).mockResolvedValue(null) // not in org_1

    const res: any = await updateAttendance('evt_1', 'po_victim_in_other_org', 'attending')

    expect(res.error).toBeDefined()
    expect(prisma.eventAttendance.upsert).not.toHaveBeenCalled()
  })

  it('records attendance for a personOrgId within the caller org', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.event.findFirst as any).mockResolvedValue({ id: 'evt_1', organizationId: 'org_1' })
    ;(prisma.personOrganization.findFirst as any).mockResolvedValue({ id: 'po_1' })
    ;(prisma.eventAttendance.upsert as any).mockResolvedValue({ id: 'att_1', status: 'attending' })

    const res: any = await updateAttendance('evt_1', 'po_1', 'attending')

    expect(res.success).toBe(true)
    expect(prisma.eventAttendance.upsert).toHaveBeenCalled()
  })
})
