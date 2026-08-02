# SimpleAM Remediation Plan

**Companion to:** [`2026-07-AUDIT.md`](2026-07-AUDIT.md) — the evidence. This document is the **plan**.
**Tracking issue:** #200 — the live version, with checkboxes.
**Created:** 2026-07-28 · **Status:** Phase 0 in progress · **Last updated:** 2026-08-02

> **Progress:** #164 ✅ (#202) · #149 ✅ (#205) · #199 in review (#206) · #169 partly done
> (#210, #211) · #165 partly done (#211). Everything else below is still open.
>
> **Two corrections learned since this was written:**
>
> 1. **CI had two stacked causes.** Every QA run from 2026-07-24 failed in ~3 seconds with zero
>    steps recorded — the **GitHub Actions spending limit**, not code. The monthly allowance reset
>    on 2026-08-01 and jobs dispatch again. Diagnosing this from the run page is impossible; the
>    reason only appears via
>    `gh api repos/:owner/:repo/check-runs/<job_id>/annotations`. Expect it to recur near the end of
>    each billing month.
> 2. **#199 affects three jobs, not four.** Lighthouse Budgets is not Storybook-dependent — the
>    `performance` job builds the app and runs `lhci autorun`, and its failure is a genuine
>    bundle-size breach (`app/error`, 6.03 MiB) that needs its own issue. Note also that the
>    Storybook coupling lives in the **specs** (`tests/e2e/a11y-components.spec.ts`,
>    `tests/e2e/input-otp.spec.ts` hard-code `localhost:6006`), not in the workflow YAML — grepping
>    `.github/workflows/` for "storybook" returns nothing and makes #199 look obsolete when it is not.

---

## The one-paragraph version

SimpleAM is pre-release with no users. A full audit found that the codebase is not uniformly poor — several parts are genuinely good — but that **the right abstractions were built and then never adopted, and the safety nets report success without checking anything.** The plan therefore does not start by writing code. It starts by *subtracting* ~9,000 lines that being pre-release makes free to delete, then by making CI signals honest so nothing can regress, and only then fixes the two foundations (database migrations, design tokens) that gate everything else.

---

## Why the order is what it is

Four items genuinely gate large amounts of downstream work. Doing them out of order wastes effort or actively causes harm.

| Gate | Blocks | Why |
|---|---|---|
| **Delete first** (#164) | the ratchet baselines (#155) | Baselining quality metrics before deleting 5,700 dead lines bakes dead code into every number, permanently. |
| **Token fix** (#149) | all UI work (#190, #186, #187) | A codemod replacing `bg-orange-500` with `bg-primary` while `hsl(oklch())` is broken swaps a colour that *renders* for one that *doesn't*. It would make the product worse. |
| **Migration history** (#170) | all schema work (#171–#174) | RLS policies cannot be expressed in `schema.prisma`; they must ship as migration SQL. This is why issue #132 read as actionable and wasn't. |
| **Action wrapper** (#181, #182) | #180, #183, #153 | Uniform returns, Zod validation, error scrubbing, Sentry and canonical auth are all *properties of the wrapper*. Adopting it delivers five workstreams at once instead of five passes over the same 30 files. |
| **Next 15** (#212) | #169, and all of Phase 4 | #169 cannot pass its own acceptance criterion on Next 14 — `postcss` is vendored *inside* `node_modules/next/`, so no override or lockfile refresh reaches it. And the Phase 4 sweeps touch accessibility and i18n on essentially every page; running them against Next 14 and then upgrading means re-touching all of it. |

And one hard interlock: **#148 must fix signup and account-linking in a single PR.** The fix for the signup dead-end is to call `ensureUserWithOrganization()` — the exact function containing an account-takeover bug. Fixing signup alone converts a dormant vulnerability into a live one.

One sequencing rule for the surface sweeps: **accessibility before i18n, per directory.** `aria-label` additions and `t()` wrapping collide on the same JSX lines. Never run them as parallel lanes.

---

## Decisions already made

| Decision | Choice | Why |
|---|---|---|
| **Tailwind** | Stay on **v3**; fix the token format, delete the pasted v4 stylesheet | Preserves the exact palette and keeps 64 `bg-primary/*` opacity modifiers working. v4 revisited once visual regression tests exist to prove a migration succeeded. |
| **Next.js** | **Upgrade to 15** (#212), in Phase 2 | The mirror image of the Tailwind decision, and worth stating explicitly because the reasoning inverts. Tailwind v3 is a supported version to *stay on*; Next 14 is not. `14.2.35` is the last 14.2.x release that will ever ship, so all 21 open advisories against `next` — including SSRF in Server Actions and XSS in the App Router — have no patch path. Not Phase 0: a framework major before the signals are honest is precisely what this plan exists to prevent. |
| **Locales** | Cut to **`en` + `es`**, archive six | Only `es` is genuinely translated (1% English vs 66–84% for the rest). Two locales makes "CI fails on any missing key" enforceable for the first time. |
| **Firebase** | **Remove entirely** | Chat carries a second, independent authorization model that no test exercises and that must be hand-synchronised forever. No users means no data to migrate. |
| **Chat** | **Deferred past release** (#197); #165 leaves a stub | Not needed for launch, but the requirement is captured so it survives the Firebase removal. |
| **Storybook** | **Kept and built properly** (#120); CI unblocked now (#199) | A core need. But the installed packages are the wrong framework for Next.js and two majors stale, so building starts by replacing them regardless. |
| **Pace** | No feature freeze; strict dependency order | Nothing to freeze against, no timeline pressure. The ratchets are what make it safe to work alongside. |

---

## The phases

### Phase 0 — Subtract *(~1 week)*

Deleting is the highest value-per-risk work available and it will never be cheaper. Nothing here has users depending on it.

| Issue | | Notes |
|---|---|---|
| #199 | Stop the Storybook-dependent jobs failing | In review (#206). **Three** jobs, not four — see the corrections above. #206 grew well past this scope — see "The QA pipeline was the cost" below. |
| #164 | ✅ Delete ~5,700 unreferenced lines | **Done** (#202) — 5,721 lines. All six zero-importer claims independently verified. |
| #165 | Remove Firebase/Firestore | Leaves a `/dashboard/chat` stub — see #197. The `functions/` slice is **done** (#211) — it was 32 lines with zero exports carrying a 355 KB lockfile and 68 alerts, so it came out early. The rest is unchanged in size. |
| #166 | Cut locales to `en` + `es` | Archive, don't delete. |
| #129 | Purge committed secrets, rotate credentials | Ops task; needs history rewrite. |
| #168 | Archive stale docs | 17 dated reports + a 486KB dump. |
| #159 | Pin `clsx` / `tailwind-merge` | Currently `"*"` — unpinned majors behind `cn()`. |
| #169 | Resolve npm advisories | **Premise changed.** The real figure was **226 open Dependabot alerts**, not 85 — `npm audit` collapses many advisories per package into one node, so it undercounts by ~2.4×. 173 are now cleared: a lockfile refresh took 95 (#210), deleting `functions/` took 68 (#211), and `jspdf` v3→v4 took 10. **Its acceptance criterion is blocked on #212** — `npm audit --omit=dev --audit-level=high` cannot exit 0 while Next 14 vendors a vulnerable `postcss`. Root cause of the backlog was that `.github/dependabot.yml` never existed; it does now. Supersedes #130. |

### Phase 1 — Make the signals honest *(~3 days)*

The load-bearing phase. It is what lets everything else proceed without a freeze: **the numbers can no longer get worse.**

| Issue | | Notes |
|---|---|---|
| #155 | Ratchet job + baselines | Baseline **after** Phase 0. ~15 counters. |
| #156 | ✅ Dedicated build job | **Done in #206.** The build now runs as its own step with a credential-free dummy `DATABASE_URL`. It was failing — `Failed to collect page data for /api/ai-workspace/accept-intent`, because Prisma parses `DATABASE_URL` at module load and Next evaluates route modules during `next build`. Nothing had ever proved the app compiles. |
| #157 | Enforce coverage, honest thresholds | Partly addressed in #206: the four unevaluated 80% thresholds are **removed** from `vitest.config.ts` so they stop reading as a guarantee. Setting a real floor and passing `--coverage` is still open. |
| #158 | gitleaks on every PR | Blocks the *next* leak, independent of #129. |
| #160 | jsx-a11y with `--max-warnings` | `next lint` no longer runs inside `npm run build` (#206 removed that), so this need not be `warn`-only. |
| #161 | Give translation-audit teeth | **Premise changed.** #206 deleted both translation workflows — they were permanently red (3,449 missing keys across 8 locales), i.e. zero signal. This is now "add parity checking back to `qa.yml`", still gated on #166. |
| #162 | Visual regression baseline | **Must land before #175.** #206 deleted `design-system-visual.spec.ts` — 6 tests, all `test.skip()`, every `goto` commented out. There is no baseline to preserve; start clean. |
| #163 | ✅ Rename the "Placeholder" jobs | **Done in #206** — by deleting them. Both ran zero real tests. |

#### The QA pipeline was the cost

The audit blamed a permanently-red CI for hiding everything. The measurement that closed the loop:
QA billed **~52 minutes of runner time per run** (E2E 21m25s, accessibility 18m12s, Lighthouse
4m28s, visual 3m46s, lint 2m03s, unit 2m09s) and fired on every push, every PR **and** a daily
cron. The free allowance is 2,000 min/month — about 38 runs. **The pipeline exhausted the account's
Actions budget, which is what turned CI dark on 2026-07-24.**

Almost none of it measured anything. `test:visual` and `test:a11y` were `--grep` subsets of
`test:e2e`, so two jobs re-ran 292 tests E2E Smoke had already run, each paying its own `npm ci` and
four-browser Playwright install. E2E Smoke ran 336 tests whose one real assertion hit an endpoint
returning a hardcoded literal. Every `@visual` test was skipped. `design-system-accessibility.spec.ts`
had 7 tests, 7 `page.setContent` and 0 `page.goto` — one named *"Icon-only buttons should have
aria-labels"*, passing on its own fixture while the app carries 51 unlabelled icon buttons (#186).

#206 replaces all six jobs with a single `Verify` job — lint, typecheck, unit, build — at ~5
minutes. **Add checks back only with tests that fail when the code is wrong.**

### Phase 2 — Foundations *(~1–2 weeks, strictly serial)*

Three independent tracks; each gates a large amount of downstream work.

**Database** — being pre-release, this is one clean baseline migration rather than six risky incremental ones.

| Issue | | |
|---|---|---|
| #170 | Track migrations, baseline the schema | **Gates everything below.** |
| #171 | Missing `organizationId` indexes | Incl. the app's #1 query. |
| #172 | Replace `String` columns with enums | Breaking type change — lands alone. |
| #173 | Missing `@relation` on 13 columns | |
| #151 | `AISettings` unique constraints | Live bug. |
| #174 | RLS with a non-superuser role | Supersedes #132. |

**Design system**

| Issue | | |
|---|---|---|
| #149 | ✅ Fix the token format | **Done** (#205). Fixed via `color-mix()` rather than the bare-channel approach the issue proposed — ~200 rules in `globals.css` consume the tokens directly as `var(--x)` and need a complete colour. Also declared `--destructive-foreground`, which was referenced but defined nowhere. |
| #175 | Delete the pasted v4 stylesheet | Needs #162 first. |
| #176 | Single source of truth for tokens | |
| #177 | Correct `DESIGN_SYSTEM.md` + AI prompt | |

**Framework** — the one upgrade that cannot be deferred to Post-release, because the version in use no longer receives security patches at all.

| Issue | | |
|---|---|---|
| #212 | Upgrade Next 14 → 15 | Needs #162 first, to prove rendering is unchanged. **Unblocks #169; gates all of Phase 4.** Async `cookies()`/`headers()`/`params` is the bulk of the work; caching defaults invert. Decide the React 19 question in the same PR. |

### Phase 3 — Spines *(~3–4 weeks)*

**Authorization**

| Issue | | |
|---|---|---|
| #148 | Signup + account-linking | **One PR — hard interlock.** Closes #136. |
| #178 | Middleware enforces auth | |
| #179 | Route feature-gating: real or deleted | Recommend deleted. |
| #180 | Collapse three auth patterns | Needs #148. |
| #152 | Spreadsheet history permission check | Live leak. |
| #135 | Complete deferred relation-id scoping | |

**Server actions**

| Issue | | |
|---|---|---|
| #181 | Harden the wrapper | **Do first in this track.** |
| #182 | Adopt `createAction` across 30 modules | ~12 PRs, one per domain. |
| #183 | Durable rate limiting | Needs #178. |
| #184 | Bound 56 unbounded `findMany` | |
| #185 | Batch the N+1 write loop | |
| #150 | Recurring event transaction | Live bug. |
| #153 | Error message leaks | Live bug. |

### Phase 4 — Surface sweeps *(~3–4 weeks)*

Run **per top-level directory**, not per concern. Within a directory: accessibility → then i18n.

| Issue | | |
|---|---|---|
| #186 | Icon button accessible names | Start with `components/ui/`. |
| #187 | Form control labels | |
| #188 | Keyboard semantics | Incl. every DataTable row. |
| #189 | `not-found` / `loading` / `error` states | Safe to parallelise — new files only. |
| #190 | Semantic tokens for hardcoded palette | Needs #149 + #175. |
| #191 | Extract `useDataTableState` | |
| #192 | 100% `en`/`es` key parity | |
| #193 | Extract ~1,172 hardcoded strings | **After #186/#187 on the same directory.** |
| #154 | Remove developer strings from locales | |

### Phase 5 — Prove it *(~2–3 weeks)*

| Issue | | |
|---|---|---|
| #194 | Cover security-critical modules | Needs #143/#144 stable. |
| #195 | Real e2e against a production build | Needs #148. |
| #120 | Build Storybook properly | Needs #149 + #175 or it renders broken colours. |
| #196 | Rewrite README + ARCHITECTURE | **Last** — documenting a moving target is waste. |

### Post-release

| Issue | | |
|---|---|---|
| #197 | Rebuild chat on Postgres + Supabase Realtime | Off the critical path. |

---

## Definition of "healthy"

Exit criteria — all **enforced in CI**, not documented:

- `prisma migrate diff` reports zero drift; a PR touching `schema.prisma` without a migration fails.
- `middleware.ts` redirects unauthenticated `/dashboard/*` and `/api/*`, proven by e2e. RLS returns zero rows for a query missing `where: { organizationId }`.
- 100% of server actions go through `createAction` with Zod validation and `ActionResult` returns. Zero unbounded `findMany`. Every catch path reaches Sentry.
- Every semantic Tailwind utility resolves to a real colour **in a production build**, asserted by computed style.
- Ratchets at zero: hardcoded palette classes, hex literals, dark-mode orphans, unlabelled icon buttons, unlabelled form controls, clickable non-interactive elements, hardcoded JSX strings. axe-core: zero serious/critical violations on the top 10 routes.
- `en` and `es` key sets identical; CI fails on divergence.
- Coverage enforced at ≥60% overall, ≥90% on `lib/permissions/**`, `lib/auth/**`, `app/actions/**`. Zero `test.skip()`. Zero CI job named "Placeholder". E2E runs against a production build.
- Every command in `README.md` executes on a clean clone.

**Single summary metric:** the ratchet total. It starts around **3,400**. Healthy is **under 100**, and it has never gone up.

---

## Known risk to the whole plan

**Branch protection cannot be configured on the current GitHub plan** — the API returns `403 — Upgrade to GitHub Pro or make this repository public`.

So "NEVER commit directly to `main`" and "NEVER merge without CI passing" in `CLAUDE.md` are **convention enforced by nothing**, and every gate this plan adds (#155, #156, #158, #170's parity check) is advisory until that changes. Worth deciding early, because Phase 1 assumes enforceability.
