# Rebuild Handover Document

**Date:** 2026-02-22
**Branch:** `claude/review-project-planning-OBVq1`
**Status:** Uncommitted changes — review before committing

---

## What Was Done

### Phase 1: Data Layer

#### 1.1 Prisma Schema Consolidation
- Renamed `orgId` to `organizationId` on `AIConversation`, `AIInsight`, `AISettings`, `AICostTracking`
- Added proper `Organization` relations with foreign keys on all four models
- Added relation for `DataChangeLog.spreadsheetId`
- Deleted dead `reportTemplates` model (was `@@ignore`d duplicate)
- Updated all queries in `app/api/ai/` and `app/actions/` referencing the old `orgId` field

#### 1.2 Unified Server Action Foundation
- **New file:** `lib/actions/safe-action.ts` — shared `createAction()` wrapper
  - Handles Supabase auth (cached), org resolution, Zod input validation
  - Returns consistent `{ success: true, data } | { success: false, error }` shape
  - Uses React `cache()` for auth deduplication
- **New file:** `types/actions.ts` — `ActionResult<T>` discriminated union type
- Added Zod validation schemas to all core server actions:
  - `app/actions/players.ts` — create/update/pagination schemas
  - `app/actions/events.ts` — create/update schemas, validates `endTime > startTime`
  - `app/actions/notes.ts` — create/update schemas
  - `app/actions/files.ts` — Zod schemas added
  - `app/actions/forms.ts` — Zod schemas added
  - `app/actions/spreadsheets.ts` — Zod schemas added

#### 1.3 Auth Consolidation
- Merged account-linking logic from `lib/auth/ensure-user.ts` into `lib/auth/cached-user.ts`
- `ensure-user.ts` now re-exports from `cached-user.ts` for backward compatibility
- Removed the `lastLoginAt` DB write from every read operation (was firing on every server action call)

#### 1.4 Data Fetching Performance
- **Notes:** Pushed privacy/search filtering from in-memory JavaScript into SQL WHERE clauses (`buildPrivacyWhere()` in `app/actions/notes.ts`)
- **Features:** Fixed N+1 query — `areFeaturesEnabled()` now fetches org features once then checks all requested features against the record (was doing one DB call per feature)
- **Reports:** Added `select` to limit fields in `getReportBuilderData` (was fetching all columns via `include: { person: true }`)

### Phase 2: Server Layer

#### 2.1 Sidebar Performance
- Moved feature loading from client-side `useEffect` (2 round-trips per navigation) to server component props
- `app/dashboard/layout.tsx` now fetches enabled features server-side and passes them down through `DashboardLayoutClient` to `AppSidebar`
- Features are fetched once at layout level, not on every page navigation

#### 2.2 Caching Strategy
- **Feature caching:** `getEnabledFeatures()` wrapped with `unstable_cache` (300s TTL, tag: `enabled-features`)
- **Tag-based invalidation:** Added `revalidateTag()` to all entity mutation functions:
  - `app/actions/events.ts` — `revalidateTag('events')` on create/update/delete
  - `app/actions/notes.ts` — `revalidateTag('notes')` on create/update/delete
  - `app/actions/forms.ts` — `revalidateTag('forms')` on create/update/delete
  - `app/actions/reports.ts` — `revalidateTag('reports')` on create/update/delete
  - `lib/permissions/feature-access.ts` — `revalidateTag('enabled-features')` on all 5 feature mutation functions
- **ISR caching:** Added `export const revalidate = 300` to reports pages, notes page, event detail page, reports builder

#### 2.3 Lazy Loading
- Converted `AddPlayerDialog`, `EventFormDialog`, `FormBuilderDialog`, `NoteEditorDialog` from static imports to `next/dynamic` with `ssr: false`
- Dialogs only load when actually opened (wrapped in conditional rendering)
- Removed env var gate on custom webpack `splitChunks` — now runs automatically in production builds
- **PostHog analytics:** Changed from static `import posthog from 'posthog-js'` to `await import('posthog-js')` — removes ~600KB from every page's initial bundle

#### 2.4 Error Boundaries
- **New:** `app/dashboard/error.tsx` — scoped dashboard error boundary with retry
- **New:** `app/dashboard/calendar/events/[eventId]/error.tsx` — event detail error boundary
- **New:** `app/dashboard/reports/[id]/error.tsx` — report detail error boundary

#### 2.5 Server Component Conversions
Converted 4 pages from `'use client'` with `useEffect` data fetching to server component shells:
- **Notes:** `app/dashboard/notes/page.tsx` — fetches userId server-side, passes to `_components/notes-page-client.tsx`
- **Event detail:** `app/dashboard/calendar/events/[eventId]/page.tsx` — fetches event + userId in parallel, redirects on error, delegates to `_components/event-detail-client.tsx`
- **Reports builder:** `app/dashboard/reports/builder/page.tsx` — reads searchParams, fetches builder data + optional edit report, delegates to `_components/report-builder-client.tsx`
- **Reports detail:** `app/dashboard/reports/[id]/page.tsx` — fetches report config + data in parallel, delegates to `_components/report-view-client.tsx`

Pattern: server component calls action → passes data as props → client component handles interactivity.

**Intentionally skipped:** Data management `[id]` — spreadsheet editor with heavy mutable state where conversion provides minimal benefit.

#### 2.6 Loading States
- **New:** `app/dashboard/calendar/loading.tsx`
- **New:** `app/dashboard/notes/loading.tsx`
- **New:** `app/dashboard/forms/loading.tsx`
- **New:** `app/dashboard/canvas/loading.tsx`
- **New:** `app/dashboard/chat/loading.tsx`
- **New:** `app/dashboard/data-management/loading.tsx`
- **New:** `app/dashboard/planner/loading.tsx`

### Phase 3: UI

#### 3.1 Native Dialogs Replaced
- Replaced `alert()` calls with `toast.error()` from sonner across player, spreadsheet, and planner pages
- Replaced all 11 `confirm()` calls with `AlertDialog` from shadcn/ui across 11 files
- **New:** `components/ui/confirm-dialog.tsx` — `useConfirmDialog()` hook for imperative async confirms

#### 3.2 Hardcoded Colors Fixed
- Replaced ~75 hardcoded color classes with semantic design tokens across ~30 files
- Files updated: `note-card.tsx`, `prompt-suggestions.tsx`, `workspace-top-bar.tsx`, `players-table-new.tsx`, `plans-table.tsx`, `row-history.tsx`, `security-tab.tsx`, `template-gallery.tsx`, `templates-table.tsx`, `ai-insights.tsx`, `ai-settings.tsx`, `event-detail-dialog.tsx`, `milestones-list.tsx`, `plan-timeline.tsx`, `template-selector-dialog.tsx`, `data-management-client.tsx`, `file-upload-dialog.tsx`, `login/page.tsx`, `signup/page.tsx`, `form-builder-dialog.tsx`, `subscription-tiers.ts`

#### 3.3 Sidebar Reorganized
- Grouped 14+ flat nav items into 5 sections: Team, Workflow, Analysis, Tools, AI
- Each group has a label and only shows if it has visible items
- Sidebar uses `SidebarGroup` / `SidebarGroupLabel` components

#### 3.4 Calendar CSS Fixed
- Extracted ~190 lines of `<style jsx global>` from `event-calendar.tsx` into `components/calendar/calendar-overrides.css`
- Imported as a static CSS file alongside the base react-big-calendar styles
- Eliminates per-render style injection and CSS specificity battles
- All styles already use semantic design tokens (`var(--card)`, `var(--border)`, etc.)

#### 3.5 Fixed Viewport Height Calculations
- Replaced `h-[calc(100vh-*)]` with `h-full` or `flex-1` in chat, AI, spreadsheet pages

### Phase 4: Cleanup

#### 4.1 Ghost Dependencies Removed
- Removed `zustand`, `@tanstack/react-query`, all 6 `@storybook/*` packages from `package.json`
- These had zero usage in the codebase

#### 4.3 Feature Defaults Updated
- Changed `formsEnabled`, `reportsEnabled`, `dataManagementEnabled` from `@default(false)` to `@default(true)` in Prisma schema
- New organizations now get forms, reports, and data management enabled by default

### Feature Release System
- All features marked `released: true` in `lib/permissions/feature-metadata.ts`
- Sidebar visibility is now controlled entirely by per-org DB flags in `OrganizationFeatures`
- To show/hide features for an org, toggle the `*Enabled` fields in the `OrganizationFeatures` table

### Bundle Optimization
- PostHog dynamically imported (saves ~600KB from initial bundle)
- Sentry split into its own chunk
- PostHog split into its own chunk
- All heavy dependencies (Excalidraw, Firebase, TipTap, Recharts, Calendar) properly lazy-loaded via `next/dynamic`

---

## Known Issues / Bugs Fixed During Testing

1. **Players page: Zod pageSize validation** — `getPlayers(0, 1000)` was rejected because `PaginationSchema` had `max(100)`. Fixed to `max(1000)`.

2. **Sidebar empty when features fail to load** — Fallback used `??` which doesn't trigger for empty arrays `[]`. Fixed to check `.length`.

3. **Chunk splitting 404s in dev** — Stale `.next` cache from config changes. Run `rm -rf .next && npm run dev` to clear.

---

## What Was NOT Done

These items from the plan were deferred:

### Phase 3
- **3.7 Break up monolithic components** — Large components (tactical-board 1538 lines, players-table 1063 lines, forms-table 917 lines, event-form-dialog 759 lines) not split into directories

### Phase 4
- **4.2 Trim i18n** — Still has 8 locale files, only English is used
- **4.4 Foundation tests** — No tests added

### Performance
- **Vendor bundle is still 5.84MB** — Contains React, Radix UI, next-intl, Supabase client, and dozens of other shared dependencies. This is largely a Next.js 14 framework limitation — all shared `node_modules` get bundled into one chunk. Upgrading to Next.js 15 with its improved tree-shaking would help. Individual heavy deps are already properly split out.

---

## How to Enable Features for an Organization

The sidebar shows features based on two conditions:
1. `released: true` in `lib/permissions/feature-metadata.ts` (all features are now released)
2. The org's `OrganizationFeatures` DB record has the feature enabled

**Features enabled by default for new orgs:** players, calendar, notes, spreadsheets, files, forms, reports, dataManagement

**Features disabled by default (must be enabled per org):** messages (chat), canvas, planner, templates, ai, aiWorkspace

To enable features for an existing org, either:
- Use the `enableAllFeatures(orgId)` function from `lib/permissions/feature-access.ts`
- Run SQL: `UPDATE "OrganizationFeatures" SET "formsEnabled" = true, "reportsEnabled" = true WHERE "organizationId" = 'your-org-id';`
- Wire the existing `FeatureToggleCard` / `FeatureToggleSwitch` components from `components/platform-admin/` into the system settings page

**Platform admins** (`isPlatformAdmin: true` on the User record) bypass all feature checks and see everything.

---

## How to Test

```bash
# Clear stale build cache first
rm -rf .next

# Start dev server
npm run dev

# Verify:
# 1. Players page loads data (no Zod errors in console)
# 2. Sidebar shows grouped navigation sections
# 3. No 404 errors for JS chunks in browser console
# 4. Dialogs (add player, create event) load on click, not on page load
# 5. Dark mode works on all pages (no white/blue hardcoded elements)
# 6. No native alert()/confirm() dialogs anywhere
```

---

## File Change Summary

| Area | Files Changed | Files Added |
|------|--------------|-------------|
| Server Actions | 16 files | 2 (safe-action.ts, types/actions.ts) |
| Auth | 2 files | — |
| Permissions | 2 files | — |
| Dashboard Layout | 3 files | — |
| Error Boundaries | — | 3 files |
| Loading States | — | 7 files |
| Server Component Conversions | 4 page files | 4 client components |
| Color Fixes | ~30 files | — |
| Confirm Dialogs | 11 files | 1 (confirm-dialog.tsx) |
| Calendar CSS | 1 file | 1 (calendar-overrides.css) |
| Caching | 5 files | — |
| Analytics | 1 file | — |
| Config | 2 files (next.config.js, package.json) | — |
| Prisma | 1 file | — |
