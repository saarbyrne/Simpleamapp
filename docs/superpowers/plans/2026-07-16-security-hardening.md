# Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the critical broken-access-control and cross-tenant IDOR holes found in the security review, using TDD so each fix ships with a regression test that would have caught the bug.

**Architecture:** All fixes live in `app/actions/**` and `app/api/**`. Tenant isolation is enforced *only* by app-code `where: { organizationId }` clauses (Prisma runs as Supabase superuser — RLS is not enforced), so every fix either (a) adds a real authorization check or (b) adds an org-scope to a Prisma query. We introduce a `vitest` mock harness for server actions (none exists today) and drive every fix test-first.

**Tech Stack:** Next.js 14 App Router, TypeScript, Prisma, Supabase Auth, Vitest + `@testing-library/jest-dom`, Zod.

## Global Constraints

- Use npm — not yarn/pnpm/bun.
- Server actions authenticate via `requireUser()` (`@/lib/auth/cached-user`) which returns `UserWithOrganization` (has `.id`, `.organizationId`) and throws `Error('Unauthorized: User must be authenticated')` when unauthenticated.
- Platform-admin authorization: `requirePlatformAdmin()` (throws) and `isPlatformAdmin(): Promise<boolean>` both live in `@/lib/platform-admin` (re-exported from `lib/platform-admin/platform-admin.ts`).
- Never introduce raw SQL. All data access via Prisma with parameterized `where`.
- Test files live under `tests/`; runner config `vitest.config.ts` includes `tests/**/*.test.ts`. Run a single file with `npx vitest run tests/path/file.test.ts`.
- Commit format: `<type>(<scope>): <description>`. One logical fix per commit.
- Branch off `main`; draft PR per issue; never commit to `main`.
- Do NOT weaken the existing `{ success, error }` / `{ error }` return shapes callers depend on — add checks *inside* the existing try/catch.

---

## Task 0: Server-action test harness

**Files:**
- Create: `tests/actions/_helpers.ts`
- Test: `tests/actions/harness.test.ts`

**Interfaces:**
- Produces: `mockRequireUser(overrides?)`, `mockUnauthenticated()`, `resetActionMocks()` — helpers that configure the shared `vi.mock` of `@/lib/db` and `@/lib/auth/cached-user` used by every action test.
- Produces (module mocks, hoisted): `vi.mock('@/lib/db', ...)` exposing `prisma` with `vi.fn()` methods; `vi.mock('@/lib/auth/cached-user', ...)` exposing `requireUser`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/actions/harness.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    person: { update: vi.fn(), delete: vi.fn(), updateMany: vi.fn(), findFirst: vi.fn() },
    personOrganization: { findFirst: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn() },
    note: { findFirst: vi.fn(), findUnique: vi.fn() },
    activity: { create: vi.fn() },
    $transaction: vi.fn(async (fn: any) => fn((await import('@/lib/db')).prisma)),
  },
}))
vi.mock('@/lib/auth/cached-user', () => ({ requireUser: vi.fn() }))

import { requireUser } from '@/lib/auth/cached-user'
import { mockRequireUser, mockUnauthenticated, resetActionMocks } from './_helpers'

describe('action harness', () => {
  beforeEach(() => resetActionMocks())

  it('mockRequireUser makes requireUser resolve a user with organizationId', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    const user = await (requireUser as any)()
    expect(user.organizationId).toBe('org_1')
  })

  it('mockUnauthenticated makes requireUser throw the unauthorized error', async () => {
    mockUnauthenticated()
    await expect((requireUser as any)()).rejects.toThrow('Unauthorized: User must be authenticated')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/actions/harness.test.ts`
Expected: FAIL — `Cannot find module './_helpers'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// tests/actions/_helpers.ts
import { vi } from 'vitest'
import { requireUser } from '@/lib/auth/cached-user'
import { prisma } from '@/lib/db'

type UserOverrides = Partial<{ id: string; organizationId: string; email: string }>

export function mockRequireUser(overrides: UserOverrides = {}) {
  const user = {
    id: 'user_1',
    organizationId: 'org_1',
    email: 'coach@org1.test',
    ...overrides,
  }
  ;(requireUser as any).mockResolvedValue(user)
  return user
}

export function mockUnauthenticated() {
  ;(requireUser as any).mockRejectedValue(
    new Error('Unauthorized: User must be authenticated')
  )
}

export function resetActionMocks() {
  vi.clearAllMocks()
  // default: authenticated coach in org_1 unless a test overrides
  mockRequireUser()
  ;(prisma.activity.create as any).mockResolvedValue({})
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/actions/harness.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/actions/_helpers.ts tests/actions/harness.test.ts
git commit -m "test(actions): add server-action vitest mock harness"
```

---

## Task 1: Real platform-admin gate — `organization-features.ts`

**Files:**
- Modify: `app/actions/organization-features.ts:31-48` (the stub `verifyPlatformAdmin`)
- Test: `tests/actions/organization-features.test.ts`

**Interfaces:**
- Consumes: `isPlatformAdmin` from `@/lib/platform-admin`.
- Produces: `verifyPlatformAdmin()` now returns `{ success: false, error: 'Platform admin access required' }` when the caller is not a platform admin, and `{ success: true }` only when `isPlatformAdmin()` resolves `true`. All exported actions in the file gate on this, so this one change secures `updateOrganizationFeaturesAction`, `resetOrganizationFeaturesAction`, `enableAllFeaturesAction`, `disableAllFeaturesAction`, `setFeatureOverrideAction`, `getOrganizationFeaturesAction`, `getEnabledFeaturesAction`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/actions/organization-features.test.ts
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
import { updateOrganizationFeatures } from '@/lib/permissions/feature-access'
import { updateOrganizationFeaturesAction } from '@/app/actions/organization-features'

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/actions/organization-features.test.ts`
Expected: FAIL — first test fails: `updateOrganizationFeatures` IS called and `res.success` is `true`, because the stub returns `{ success: true }` for everyone.

- [ ] **Step 3: Write minimal implementation**

Replace the stub body (`app/actions/organization-features.ts:31-48`). Add `isPlatformAdmin` to the existing `@/lib/platform-admin` import on line 25.

```ts
// line 25 becomes:
import { isPlatformAdmin, logPlatformAdminAction } from '@/lib/platform-admin'
```

```ts
// replace lines 28-48:
/**
 * Check if the current user is a platform admin
 */
async function verifyPlatformAdmin(): Promise<{ success: boolean; error?: string }> {
  try {
    const ok = await isPlatformAdmin()
    if (!ok) {
      return { success: false, error: 'Platform admin access required' }
    }
    return { success: true }
  } catch (error) {
    console.error('Error verifying platform admin:', error)
    return { success: false, error: 'Authentication error' }
  }
}
```

Remove the now-unused `import { createClient } from '@/lib/supabase/server'` (line 26) if nothing else in the file uses it.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/actions/organization-features.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add app/actions/organization-features.ts tests/actions/organization-features.test.ts
git commit -m "fix(security): enforce real platform-admin check in organization-features actions"
```

---

## Task 2: Real platform-admin gate — `feature-matrix.ts` and `package-defaults.ts`

**Files:**
- Modify: `app/actions/feature-matrix.ts:19-33` (stub)
- Modify: `app/actions/package-defaults.ts:16-30` (stub)
- Test: `tests/actions/feature-matrix.test.ts`
- Test: `tests/actions/package-defaults.test.ts`

**Interfaces:**
- Consumes: `isPlatformAdmin` from `@/lib/platform-admin`.
- Produces: both files' `verifyPlatformAdmin()` now delegate to `isPlatformAdmin()`. Secures bulk ops `bulkApplyPackageDefaults`, `bulkEnableFeature`, `bulkDisableFeature`, `toggleFeature`, `getOrganizationsWithFeatures`, and `updatePackageDefaults`.

- [ ] **Step 1: Write the failing test (feature-matrix)**

```ts
// tests/actions/feature-matrix.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/platform-admin', () => ({
  isPlatformAdmin: vi.fn(),
  logPlatformAdminAction: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/lib/permissions/feature-access', () => ({
  bulkEnableFeature: vi.fn().mockResolvedValue({ count: 3 }),
  bulkDisableFeature: vi.fn(),
  bulkApplyPackageDefaults: vi.fn(),
  toggleFeature: vi.fn(),
  getOrganizationsWithFeatures: vi.fn().mockResolvedValue([]),
}))

import { isPlatformAdmin } from '@/lib/platform-admin'
import { bulkEnableFeature } from '@/lib/permissions/feature-access'
import { bulkEnableFeature as bulkEnableFeatureAction } from '@/app/actions/feature-matrix'

describe('feature-matrix bulk authorization', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects a non-admin and does NOT run the bulk update', async () => {
    ;(isPlatformAdmin as any).mockResolvedValue(false)
    const res = await bulkEnableFeatureAction(['org_a', 'org_b'], 'trainingModule' as any)
    expect(res.success).toBe(false)
    expect(bulkEnableFeature).not.toHaveBeenCalled()
  })
})
```

> NOTE: Confirm the exact exported action name and signature in `app/actions/feature-matrix.ts` before finalizing (the file exports the platform-wide bulk ops). Adjust the import/args to match; keep the assertion "non-admin ⇒ `success:false` AND underlying lib fn not called".

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/actions/feature-matrix.test.ts`
Expected: FAIL — `bulkEnableFeature` IS called (stub authorizes everyone).

- [ ] **Step 3: Write minimal implementation**

In `app/actions/feature-matrix.ts`, replace the stub `verifyPlatformAdmin` (lines 19-33) with the same delegating implementation as Task 1 Step 3, and import `isPlatformAdmin` from `@/lib/platform-admin`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/actions/feature-matrix.test.ts`
Expected: PASS.

- [ ] **Step 5: Repeat for `package-defaults.ts`**

Write `tests/actions/package-defaults.test.ts` mirroring Step 1 for `updatePackageDefaults` (non-admin ⇒ `success:false`, underlying `updatePackageDefaults`/persistence not called). Run it, watch it fail, replace the stub in `app/actions/package-defaults.ts:16-30` the same way, run it green.

Run: `npx vitest run tests/actions/package-defaults.test.ts`
Expected: PASS.

- [ ] **Step 6: Typecheck + commit**

```bash
npm run typecheck
git add app/actions/feature-matrix.ts app/actions/package-defaults.ts tests/actions/feature-matrix.test.ts tests/actions/package-defaults.test.ts
git commit -m "fix(security): enforce real platform-admin check in feature-matrix and package-defaults actions"
```

---

## Task 3: Platform-admin + debug API routes — require admin, not just auth

**Files:**
- Modify: `app/api/platform-admin/organizations/[id]/features/route.ts` (GET `:17`, PATCH `:68`)
- Modify: `app/api/platform-admin/organizations/[id]/features/apply-package/route.ts` (POST `:17`)
- Delete: `app/api/debug/org-features/route.ts`
- Test: `tests/api/platform-admin-features.test.ts`

**Interfaces:**
- Consumes: `requirePlatformAdmin()` from `@/lib/platform-admin` (throws `Error('Platform admin access required')` / `Error('Not authenticated')`).
- Produces: each handler calls `requirePlatformAdmin()` inside try/catch; on throw returns `403` (admin required) — never runs the mutation/read.

- [ ] **Step 1: Write the failing test**

```ts
// tests/api/platform-admin-features.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/platform-admin', () => ({ requirePlatformAdmin: vi.fn() }))
vi.mock('@/lib/permissions/feature-access', () => ({
  getOrganizationFeatures: vi.fn().mockResolvedValue({ id: 'f1' }),
  updateOrganizationFeatures: vi.fn().mockResolvedValue({ id: 'f1' }),
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
```

> NOTE: Match the handler's real `params` shape (Next 14 route handler signature `(request, { params })`). If the route reads Supabase directly, add `vi.mock('@/lib/supabase/server', ...)` too. Adjust import paths for the actual exported members.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/api/platform-admin-features.test.ts`
Expected: FAIL — non-admin gets `200` and `updateOrganizationFeatures` is called (route only checks `if (!user)`).

- [ ] **Step 3: Write minimal implementation (PATCH)**

At the top of the PATCH handler, replace the `supabase.auth.getUser()` + `if (!user)` block with:

```ts
import { requirePlatformAdmin } from '@/lib/platform-admin'

// inside PATCH, first lines of the try:
try {
  await requirePlatformAdmin()
} catch {
  return NextResponse.json({ error: 'Platform admin access required' }, { status: 403 })
}
```

Apply the same guard to the GET handler (`:17`) and to the POST handler in `apply-package/route.ts` (`:17`), placing the check *before* any read/mutation and before `logPlatformAdminAction`.

- [ ] **Step 4: Delete the debug route**

```bash
git rm app/api/debug/org-features/route.ts
```

Verify nothing imports it:

Run: `grep -rn "debug/org-features" app components lib --include=*.ts --include=*.tsx`
Expected: no matches.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/api/platform-admin-features.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Typecheck + commit**

```bash
npm run typecheck
git add app/api/platform-admin tests/api/platform-admin-features.test.ts
git commit -m "fix(security): require platform admin on org-features API routes; remove debug endpoint"
```

---

## Task 4: Cross-tenant IDOR — `updatePlayer`

**Files:**
- Modify: `app/actions/players.ts:114-125` (`updatePlayer` unscoped `person.update`)
- Test: `tests/actions/players-update.test.ts`

**Interfaces:**
- Consumes: harness from Task 0; `requireUser()` returns `{ organizationId }`.
- Produces: `updatePlayer` verifies the person belongs to the caller's org (via `personOrganization`) BEFORE mutating `person`. Returns `{ error: 'Player not found' }` when the person is not in the caller's org.

- [ ] **Step 1: Write the failing test**

```ts
// tests/actions/players-update.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers' // registers the vi.mock calls (hoisted) — see note below

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn,
}))

import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { updatePlayer } from '@/app/actions/players'

describe('updatePlayer tenant isolation', () => {
  beforeEach(() => resetActionMocks())

  it('refuses to update a person that is not in the caller org', async () => {
    mockRequireUser({ organizationId: 'org_attacker' })
    ;(prisma.personOrganization.findFirst as any).mockResolvedValue(null) // victim not in attacker org
    const res = await updatePlayer('ckvictimpersonid0000000000', { firstName: 'Hacked' })
    expect(res).toEqual({ error: 'Player not found' })
    expect(prisma.person.update).not.toHaveBeenCalled()
  })

  it('updates a person that IS in the caller org', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.personOrganization.findFirst as any).mockResolvedValue({ id: 'po_1' })
    ;(prisma.person.update as any).mockResolvedValue({ id: 'p1', firstName: 'Ok', lastName: 'Name' })
    const res = await updatePlayer('ckownpersonid00000000000000', { firstName: 'Ok' })
    expect((res as any).success).toBe(true)
    expect(prisma.person.update).toHaveBeenCalled()
  })
})
```

> NOTE: `_helpers.ts` must contain the hoisted `vi.mock('@/lib/db', ...)` and `vi.mock('@/lib/auth/cached-user', ...)` from Task 0, and its `prisma.personOrganization` mock must include `findFirst: vi.fn()`. Import `_helpers` at the very top so the mocks register before `players` is imported. Use CUID-shaped ids so the existing `z.string().cuid().parse(personId)` passes.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/actions/players-update.test.ts`
Expected: FAIL — first test: `person.update` IS called and no `Player not found` guard exists.

- [ ] **Step 3: Write minimal implementation**

In `updatePlayer`, inside the `$transaction` callback, add an ownership check before `tx.person.update` (`players.ts:115`):

```ts
const result = await prisma.$transaction(async (tx) => {
  const membership = await tx.personOrganization.findFirst({
    where: { personId, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!membership) {
    throw new Error('PLAYER_NOT_IN_ORG')
  }

  const person = await tx.person.update({
    where: { id: personId },
    // ...unchanged
```

Add to the `catch` block (after the ZodError check):

```ts
if (error instanceof Error && error.message === 'PLAYER_NOT_IN_ORG') {
  return { error: 'Player not found' }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/actions/players-update.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add app/actions/players.ts tests/actions/players-update.test.ts
git commit -m "fix(security): scope updatePlayer person write to caller organization"
```

---

## Task 5: Cross-tenant IDOR — `deletePlayer` and `bulkUpdatePlayers`

**Files:**
- Modify: `app/actions/players.ts:169-207` (`deletePlayer` unscoped `person.delete`)
- Modify: `app/actions/players.ts:209-266` (`bulkUpdatePlayers` unscoped `person.updateMany`)
- Test: `tests/actions/players-delete.test.ts`
- Test: `tests/actions/players-bulk.test.ts`

**Interfaces:**
- Consumes: harness (Task 0).
- Produces: `deletePlayer` removes only the caller-org membership (or verifies membership before any global delete). `bulkUpdatePlayers` resolves `personIds` to those in the caller org before the `person.updateMany`.

- [ ] **Step 1: Write the failing test (delete)**

```ts
// tests/actions/players-delete.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers'
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn }))

import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { deletePlayer } from '@/app/actions/players'

describe('deletePlayer tenant isolation', () => {
  beforeEach(() => resetActionMocks())

  it('does NOT globally delete a person outside the caller org', async () => {
    mockRequireUser({ organizationId: 'org_attacker' })
    ;(prisma.personOrganization.findFirst as any).mockResolvedValue(null)
    const res = await deletePlayer('ckvictimpersonid0000000000')
    expect(res).toEqual({ error: 'Player not found' })
    expect(prisma.person.delete).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/actions/players-delete.test.ts`
Expected: FAIL — `person.delete` called unconditionally.

- [ ] **Step 3: Write minimal implementation (delete)**

Replace the body of `deletePlayer` after auth/validation:

```ts
const membership = await prisma.personOrganization.findFirst({
  where: { personId, organizationId: user.organizationId },
  select: { id: true, person: { select: { firstName: true, lastName: true } } },
})
if (!membership) {
  return { error: 'Player not found' }
}

// Remove only THIS org's membership; do not delete the shared Person globally.
await prisma.personOrganization.deleteMany({
  where: { personId, organizationId: user.organizationId },
})

await prisma.activity.create({
  data: {
    type: 'player_deleted',
    data: { playerName: `${membership.person.firstName} ${membership.person.lastName}` },
    userId: user.id,
  },
})
```

> NOTE: If product intent is a hard delete of the Person when it has no remaining memberships, add that as a follow-up; the tenant-safe behavior is to detach the caller's membership only.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/actions/players-delete.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing test (bulk)**

```ts
// tests/actions/players-bulk.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers'
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: any) => fn }))

import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { bulkUpdatePlayers } from '@/app/actions/players'

describe('bulkUpdatePlayers tenant isolation', () => {
  beforeEach(() => resetActionMocks())

  it('only updates persons that belong to the caller org', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    // Only one of the two requested ids is in org_1
    ;(prisma.personOrganization.findMany as any) = vi.fn().mockResolvedValue([{ personId: 'ckmineid000000000000000000' }])
    ;(prisma.person.updateMany as any).mockResolvedValue({ count: 1 })
    ;(prisma.personOrganization.updateMany as any).mockResolvedValue({ count: 1 })

    await bulkUpdatePlayers(
      ['ckmineid000000000000000000', 'cktheirid00000000000000000'],
      { nationality: 'X', status: 'active' }
    )

    const call = (prisma.person.updateMany as any).mock.calls[0][0]
    expect(call.where.id.in).toEqual(['ckmineid000000000000000000'])
  })
})
```

- [ ] **Step 6: Run it, watch it fail, implement**

Run: `npx vitest run tests/actions/players-bulk.test.ts` → FAIL (updateMany uses the raw requested ids).

In `bulkUpdatePlayers`, before the `person.updateMany`, resolve owned ids:

```ts
const owned = await tx.personOrganization.findMany({
  where: { personId: { in: validated.personIds }, organizationId: user.organizationId },
  select: { personId: true },
})
const ownedIds = owned.map((o) => o.personId)

if (validated.updates.nationality !== undefined) {
  const personUpdate = await tx.person.updateMany({
    where: { id: { in: ownedIds } },
    data: { nationality: validated.updates.nationality || null },
  })
  updatedCount.person = personUpdate.count
}
```

(Ensure the `personOrganization` mock in `_helpers.ts` includes `findMany: vi.fn()`.)

Run: `npx vitest run tests/actions/players-bulk.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add app/actions/players.ts tests/actions/players-delete.test.ts tests/actions/players-bulk.test.ts
git commit -m "fix(security): scope deletePlayer and bulkUpdatePlayers to caller organization"
```

---

## Task 6: Cross-tenant IDOR — `getNote`, `savePlayersData`, `reorderMilestones`

**Files:**
- Modify: `app/actions/notes.ts:236` (`getNote` unscoped `findUnique`)
- Modify: `app/actions/data-tables.ts:205` (`savePlayersData` unscoped person/personOrg write)
- Modify: `app/actions/milestones.ts:203` (`reorderMilestones` unscoped `milestone.update`)
- Test: `tests/actions/notes-get.test.ts`
- Test: `tests/actions/data-tables-save.test.ts`
- Test: `tests/actions/milestones-reorder.test.ts`

**Interfaces:**
- Produces: all three queries filtered by the caller's `organizationId` (directly on the row, or via the parent relation for milestones→plan→org).

- [ ] **Step 1: getNote — failing test**

```ts
// tests/actions/notes-get.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './_helpers'
import { prisma } from '@/lib/db'
import { mockRequireUser, resetActionMocks } from './_helpers'
import { getNote } from '@/app/actions/notes'

describe('getNote tenant isolation', () => {
  beforeEach(() => resetActionMocks())

  it('queries scoped by organizationId', async () => {
    mockRequireUser({ organizationId: 'org_1' })
    ;(prisma.note.findFirst as any).mockResolvedValue(null)
    await getNote('cknoteid000000000000000000')
    const call = (prisma.note.findFirst as any).mock.calls[0][0]
    expect(call.where.organizationId).toBe('org_1')
  })
})
```

> NOTE: `getNote` currently uses `db.note.findUnique({ where: { id } })`. `findUnique` cannot take a non-unique `organizationId` filter — switch to `findFirst`. Ensure the `note` mock in `_helpers.ts` exposes both `findUnique` and `findFirst`.

- [ ] **Step 2: Run → fail, implement**

Run: `npx vitest run tests/actions/notes-get.test.ts` → FAIL (`findUnique` called, no org filter).

Change `getNote` (`notes.ts:238`) from `db.note.findUnique({ where: { id }, include: {...} })` to:

```ts
const note = await db.note.findFirst({
  where: { id, organizationId: currentUser.organizationId },
  include: { /* unchanged include block */ },
})
```

Run: `npx vitest run tests/actions/notes-get.test.ts` → PASS.

- [ ] **Step 3: savePlayersData — failing test → implement**

Write `tests/actions/data-tables-save.test.ts`: mock a `personOrganization.findFirst` returning a row whose `organizationId !== caller.organizationId`, call `savePlayersData` with that row id, assert the person/personOrg `update` is NOT called and an error/skip is returned. Run → fail.

In `data-tables.ts:205`, after `personOrganization.findUnique({ where: { id: row.id } })`, add:

```ts
if (!membership || membership.organizationId !== user.organizationId) {
  // skip rows that don't belong to the caller org
  continue
}
```

(Adjust to the actual loop/variable names in the function.) Run → PASS.

- [ ] **Step 4: reorderMilestones — failing test → implement**

Write `tests/actions/milestones-reorder.test.ts`: the plan is verified for the caller org, but assert each `milestone.update` is scoped `where: { id, planId }`. Run → fail.

In `milestones.ts:203`, change each per-milestone update to:

```ts
await tx.milestone.update({
  where: { id: milestoneId, planId },
  data: { order: index },
})
```

If Prisma rejects the compound non-unique `where`, use `updateMany({ where: { id: milestoneId, planId }, data: { order: index } })` instead. Run → PASS.

- [ ] **Step 5: Typecheck + commit**

```bash
npm run typecheck
git add app/actions/notes.ts app/actions/data-tables.ts app/actions/milestones.ts tests/actions/notes-get.test.ts tests/actions/data-tables-save.test.ts tests/actions/milestones-reorder.test.ts
git commit -m "fix(security): org-scope getNote, savePlayersData, and reorderMilestones queries"
```

---

## Task 7: Unauthenticated AI endpoint — auth + rate limit

**Files:**
- Modify: `app/api/ai-workspace/suggest-enhancements/route.ts`
- Test: `tests/api/suggest-enhancements.test.ts`

**Interfaces:**
- Consumes: `getCachedUserWithOrganization()` from `@/lib/auth/cached-user`; `checkRateLimit` + `RATE_LIMITS` from `@/lib/rate-limit`.
- Produces: route returns `401` when unauthenticated (never constructs `Anthropic` / calls the API), `429` when over the per-user limit.

- [ ] **Step 1: Write the failing test**

```ts
// tests/api/suggest-enhancements.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

const createMock = vi.fn()
vi.mock('@anthropic-ai/sdk', () => ({
  default: class { messages = { create: createMock } },
}))
vi.mock('@/lib/auth/cached-user', () => ({ getCachedUserWithOrganization: vi.fn() }))

import { getCachedUserWithOrganization } from '@/lib/auth/cached-user'
import { POST } from '@/app/api/ai-workspace/suggest-enhancements/route'

function req() {
  return new Request('http://localhost/api/ai-workspace/suggest-enhancements', {
    method: 'POST',
    body: JSON.stringify({ prompt: 'x', artifactType: 'reports' }),
  }) as any
}

describe('suggest-enhancements auth', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 and never calls Anthropic when unauthenticated', async () => {
    ;(getCachedUserWithOrganization as any).mockResolvedValue(null)
    const res = await POST(req())
    expect(res.status).toBe(401)
    expect(createMock).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/api/suggest-enhancements.test.ts`
Expected: FAIL — route has no auth; it tries to build the Anthropic client and returns 200/500, and `getCachedUserWithOrganization` is never consulted.

- [ ] **Step 3: Write minimal implementation**

At the top of `POST`, before reading the body:

```ts
import { getCachedUserWithOrganization } from '@/lib/auth/cached-user'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const user = await getCachedUserWithOrganization()
  if (!user) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const limit = checkRateLimit(`suggest-${user.id}`, RATE_LIMITS.AI_CHAT)
  if (!limit.success) {
    return Response.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 })
  }

  try {
    const { prompt, artifactType } = await req.json()
    // ...unchanged
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/api/suggest-enhancements.test.ts`
Expected: PASS.

- [ ] **Step 5: Typecheck + commit**

```bash
npm run typecheck
git add app/api/ai-workspace/suggest-enhancements/route.ts tests/api/suggest-enhancements.test.ts
git commit -m "fix(security): require auth and rate-limit the suggest-enhancements AI endpoint"
```

---

## Task 8: `changePassword` must verify the current password

**Files:**
- Modify: `app/actions/profile.ts` (`changePassword`)
- Test: `tests/actions/change-password.test.ts`

**Interfaces:**
- Consumes: `createServerClient()` from `@/lib/supabase/server` — uses `getUser()` (to get the email) and `signInWithPassword({ email, password: currentPassword })` to re-authenticate before `updateUser({ password })`.
- Produces: returns `{ success: false, error: 'Current password is incorrect' }` when re-auth fails; only then does it call `updateUser`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/actions/change-password.test.ts
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
})
```

> NOTE: Match the field names of `changePasswordSchema` in `profile.ts` (it may not require `confirmPassword`). Read the schema and adjust the payload so the zod parse passes and the assertion isolates the re-auth check.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/actions/change-password.test.ts`
Expected: FAIL — `updateUser` IS called; current password is never verified.

- [ ] **Step 3: Write minimal implementation**

In `changePassword`, after the zod parse and `const supabase = await createServerClient()`:

```ts
const { data: { user } } = await supabase.auth.getUser()
if (!user?.email) {
  return { success: false, error: 'Not authenticated' }
}

const { error: reauthError } = await supabase.auth.signInWithPassword({
  email: user.email,
  password: validation.data.currentPassword,
})
if (reauthError) {
  return { success: false, error: 'Current password is incorrect' }
}

const { error } = await supabase.auth.updateUser({
  password: validation.data.newPassword,
})
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/actions/change-password.test.ts`
Expected: PASS.

- [ ] **Step 5: Typecheck + commit**

```bash
npm run typecheck
git add app/actions/profile.ts tests/actions/change-password.test.ts
git commit -m "fix(security): verify current password before changePassword update"
```

---

## Task 9: Full suite green

- [ ] **Step 1: Run the whole unit suite**

Run: `npm run test:unit`
Expected: all pre-existing 65 tests PASS plus the new security tests; 0 failures.

- [ ] **Step 2: Typecheck + lint**

Run: `npm run typecheck && npm run lint`
Expected: typecheck clean; lint reports only the pre-existing warnings (no new errors).

- [ ] **Step 3: Push branch and open draft PR per issue**

```bash
git push -u origin HEAD
GH_HOST=github.com gh pr create --draft -R saarbyrne/Simpleamapp --base main \
  --title "security: fix broken access control and cross-tenant IDOR" \
  --body "Closes the CRITICAL/HIGH findings. See docs/superpowers/plans/2026-07-16-security-hardening.md"
```

---

## Out of scope for this plan (tracked as separate issues)

- **Secret rotation + history purge** (ops, not code): rotate the leaked Supabase password (`docs/setup/DATABASE_SETUP.md:295`), purge `backups/backup.sql` from git history (`git filter-repo`), gitignore `backups/`, scrub doc placeholders. No TDD — manual runbook.
- **`npm audit fix`** for the 6 critical / 33 high advisories.
- **Defense-in-depth: Supabase RLS** with a non-superuser Prisma role, so app-code scoping stops being the only tenant barrier. Larger architectural change — its own plan.
- **Remaining MED/LOW scoping/mass-assignment gaps**: `deletePlayerPhoto` path ownership, `templates`/`reports`/`drawing-templates` `isGlobal`/`isOfficial` mass-assignment, `logDataChange` missing auth, attendee/form `personOrgId` validation, folder reparenting. Each follows a pattern already demonstrated above (add org scope / whitelist fields / add `requireUser`).

## Self-Review notes

- Coverage: Tasks 1–3 cover Group A (fake admin gate) + debug route; Tasks 4–6 cover Group B (IDOR); Task 7 covers Group C (unauth AI); Task 8 covers the HIGH changePassword bug. Secrets/RLS/audit-fix are explicitly deferred with rationale.
- Type consistency: `requireUser()` → `.organizationId`/`.id`; `isPlatformAdmin()` → `boolean`; `requirePlatformAdmin()` → throws. Test ids are CUID-shaped to satisfy existing `z.string().cuid()` guards.
- Placeholder scan: every code step shows real code; per-site NOTEs flag the two places (`feature-matrix` export name, `changePasswordSchema` fields) where the implementer must confirm exact names against the file before finalizing — these are verification instructions, not missing content.
