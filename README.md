# SimpleAM

An archived, pre-release sports management platform. Built from November 2025 to August 2026, never released, never used by a single person. It is published as a portfolio piece: the code and the audit are the point, not the product.

**Read the audit first: [`docs/audit/2026-07-AUDIT.md`](docs/audit/2026-07-AUDIT.md).** It is a 600-line review of this codebase written after the project was set down, with file-and-line evidence for every claim. The plan that follows from it is [`docs/audit/REMEDIATION-PLAN.md`](docs/audit/REMEDIATION-PLAN.md).

## Status

- **Archived and unsupported.** No maintenance, no support, no guarantees.
- **Pre-release.** Never had a user, a customer, or a production deployment.
- **Does not run.** The services it needed — Supabase, Vercel, Firebase, Sentry, PostHog — are deleted. The code is here to be read, not started.
- **Signup was broken at the point of archiving.** The auth callback created a Supabase session but never wrote the matching database rows, so every dashboard page then threw `Unauthorized`. See audit §1.1. It was never fixed.
- **No licence.** All rights reserved. Read it, fork it if you want, but there is no warranty and no support.

## What this is

SimpleAM was an attempt to replace the stack of separate tools a sports team uses with one product: athlete profiles, wellness and RPE forms, a calendar with attendance, a tactical whiteboard, reports, and an AI workspace that generated those things from a prompt.

It was built by one person, a designer, working almost entirely through coding agents. That is the part worth looking at. The repository is a record of what an agent-driven build looks like at this scale, including the failure modes, because the audit is honest about them.

## Stack in the code

| Area | Technology |
|---|---|
| Framework | Next.js 14.2.35 (App Router), React 18 |
| Language | TypeScript 5.6 |
| Styling | Tailwind CSS 3.4 |
| UI | shadcn/ui (65 components) on Radix primitives |
| Data | PostgreSQL via Prisma 6 |
| Auth and storage | Supabase |
| Chat | Firebase Firestore |
| AI | Anthropic SDK |
| Other | TanStack Table, Excalidraw, Tiptap, Recharts, react-big-calendar, next-intl |
| Tests | Vitest, Playwright |

The old README claimed four things that are not in the code and never were: Zustand, React Query, Storybook, and a working `npm run test:coverage`. They are listed here so the claim is not repeated.

## What works and what does not

Taken from the audit, which checked each claim against the code. This is not an endorsement of the product; it is a map of the repository.

**Solid, and worth reading as examples**

- `components/ui/` — 65 files, 54 of them stock shadcn plus 11 additions, with zero direct Radix imports outside the folder.
- Security headers and server-action origin pinning in `next.config.js`.
- Bundle discipline: Excalidraw, jsPDF, PostHog and Firebase are all dynamically imported.
- `firestore.rules` — organisation-claim checks and an explicit `deny all` default.
- The `DataTable` abstraction is used by all five feature tables.
- Mobile-first is followed, with no desktop-first breakpoint overrides.

**Broken or unfinished**

- Signup (§1.1) and a dormant account-takeover bug in account linking (§1.2).
- About 154 UI elements rendering with no colour, because the Tailwind 3.4 config pointed at `oklch()` values it cannot parse (§1.3).
- Second user in an organisation cannot save AI settings (§1.4).
- Recurring event creation silently rolls back on large series (§1.5).
- Spreadsheet history readable across permission boundaries (§1.6).
- Coverage thresholds declared at 80%, never enforced, real coverage around 8% (§2, §8.1).
- Migrations gitignored against a 48-model schema (§5.1).

## How the build went

The audit is the honest record, and the git history is the raw one. Numbers from the audit, taken at the time:

- 87,025 lines across 524 TypeScript files.
- 48 Prisma models, 59 routes, 190 server actions.
- Roughly 8% test coverage against a claimed 80%.
- 425 commits on `main`.

The agent workflow is still visible: `.claude/` holds commands, hooks and skills, and `.cursor/` holds rules. They are kept because they are evidence of how the thing was built.

## Where things are

| Path | Contents |
|---|---|
| `app/` | Next.js routes, server actions, API routes |
| `components/` | UI, including the shadcn layer in `components/ui/` |
| `lib/` | Auth, database, permissions, AI, Supabase clients |
| `hooks/` | Client hooks, including the Firestore chat listeners |
| `prisma/schema.prisma` | The data model |
| `docs/audit/` | The audit and the remediation plan |
| `docs/` | Everything else, much of it dated reports from the build |

## Documentation

The docs are uneven because they were written during the build, not after it. The two worth reading are the audit and the remediation plan. `docs/architecture/ARCHITECTURE.md` and `docs/design-system/DESIGN_SYSTEM.md` have been corrected to match the code they describe. Older dated reports live in `docs/archive/`.

---

Built by [Saar Byrne](https://saarbyrne.com).
