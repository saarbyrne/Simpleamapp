# Simpleam Quality Strategy (Designer + AI, Zero Budget)

This plan assumes there is no engineer or QA hire, no software budget, and quality work must be orchestrated by a designer with help from free tooling and AI assistance. Every step is optimized for copy‑paste reproducibility and leverages Codex/AI to author code changes when needed.

---

## 1. Experience Charter (Week 0)
- Run a short workshop (designer + stakeholders) to capture:
  - Top 10 user journeys that must stay healthy.
  - Accessibility, visual, and tone expectations.
  - AI guardrails: when to trust AI output, when to escalate for human review.
- Save the charter to `documents/experience-charter.md`. Each future test, script, or manual checklist references this document.
- Convert each journey into a manual checklist the designer can follow post-release (no code required). Store in `documents/manual-test-checklists.md`.

## 2. Free Tooling Baseline (Week 1)
- Use GitHub Actions (free for public repos; limited minutes for private—track usage) for CI automation.
- Install only open-source dependencies:
  - Vitest + Testing Library for unit/component tests.
  - Playwright for end-to-end + visual snapshots.
  - axe-core for accessibility checks.
  - Lighthouse CI for performance budgets.
- Add npm scripts (`lint`, `typecheck`, `test:unit`, `test:e2e`, `test:visual`, `test:a11y`, `test:perf`) so every automated task is a single command.
- Configure Husky pre-push hook that runs `lint` + `typecheck` locally; designer triggers via `npm run qa:prep` script that Codex can maintain.

## 3. AI-Orchestrated Automation (Week 1–2)
- Document a “Testing with AI” playbook (`documents/ai-testing-playbook.md`) that includes:
  - Prompts for generating or updating Vitest specs.
  - Prompts for scaffolding Playwright flows.
  - Instructions for asking Codex to run/test/apply merges.
- When coverage is needed, the designer requests Codex (or another AI assistant) to generate or update tests; the AI writes code and runs the commands.
- CI becomes the reviewer: if tests fail, the designer re-invokes the AI with failure logs so it can patch.

## 4. Unit & Component Coverage (Weeks 2–3)
- Prioritize components in `design-system/` and `components/` based on Experience Charter journeys.
- For each component, ask AI to:
  1. Create Vitest + Testing Library tests covering render, props, interaction.
  2. Add Storybook stories (free, open-source) aligned with charter scenarios.
- Enforce 70–80% coverage via Vitest thresholds (AI configures `vitest.config.ts`). When coverage drops, designer triggers AI to fill gaps using prepared prompts.

## 5. End-to-End & Visual Regression (Weeks 3–5)
- Use Playwright (open-source) with GitHub Actions to run:
  - Critical journey flows (desktop + mobile viewport).
  - Visual snapshot comparisons using `expect(page).toHaveScreenshot()` (no paid service).
  - Inline axe accessibility assertions.
- Store baseline screenshots in the repo; Playwright handles diffing within CI. When visual diffs appear, the designer reviews PNG artifacts attaching commentary to the PR.
- Schedule nightly Playwright runs via GitHub Actions on `main` to catch regressions even when no PR is open.

## 6. Data & Environment Stability (Weeks 3–4)
- Ask Codex to script Prisma seed data for tests using open-source tooling (`prisma db seed`).
- Configure Supabase branch-based environments using free tier (if available); otherwise, run Playwright against local mocks using MSW to stay zero-cost.
- Document simple commands (`npm run db:reset:test`) the designer can run when asked by AI; the AI handles writing the scripts.
- Use `.env.example` to track required variables. Store real secrets only in GitHub repository secrets (free) and in the designer’s local `.env`.

## 7. Non-Functional Automation (Weeks 4–6)
- Lighthouse CI (open-source) runs in GitHub Actions to monitor LCP/CLS/INP; budget breaches fail the workflow.
- npm audit + OSSIndex (free) run weekly via scheduled GitHub Action for dependency security.
- Utilize Playwright’s network shaping (no extra cost) to simulate slow conditions and ensure graceful degradation.
- Add pseudo-localization by configuring Storybook add-ons and AI-authored scripts (all free).

## 8. Manual Designer Loop
- After each deployment to production/staging:
  1. Run the manual checklist derived from the charter.
  2. Capture Loom videos/screenshots for any UX issues.
  3. File issues in the tracker with reproduction steps.
- Use Vercel’s free analytics and Supabase dashboard insights to monitor live performance and error trends without paid tooling.
- Keep a “release journal” in `documents/release-notes.md` noting manual findings and how automation responded.

## 9. Continuous Governance
- Weekly async review (15 min):
  - Check GitHub Action results for flakes or failures.
  - Update charter, prompt library, and manual checklists as product evolves.
  - Re-run critical Playwright specs locally if something feels off (AI can run the command and report results).
- Monthly resilience drill:
  - Ask AI to simulate a failing dependency (e.g., mock Supabase outage) in Playwright to ensure app handles errors gracefully.
- Maintain a time tracker of GitHub Action minutes to stay within free tier; if hitting limits, batch runs (e.g., nightly only, PR merges only).

---

### Immediate Next Steps
1. Schedule a short session to create `experience-charter.md` and manual checklists that capture the most critical flows.
2. Request Codex to add base testing dependencies, npm scripts, and GitHub Action workflows (all open-source) tied to the plan.
3. Build the AI testing playbook so the designer can reliably instruct AI to generate and maintain tests without hands-on coding.
