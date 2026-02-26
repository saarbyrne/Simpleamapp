<!-- Keep under 120 lines. Move detailed examples to .claude/skills/ -->
# SimpleAM

Sports team management platform. Next.js 14 App Router, TypeScript, Prisma + Supabase, shadcn/ui, Tailwind CSS.

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Lint + fix | `npm run lint:fix` |
| Type check | `npm run typecheck` |
| Unit tests | `npm run test:unit` |
| E2E tests | `npm run test:e2e` |
| Design lint | `npm run design:lint` |
| QA prep | `npm run qa:prep` |
| Full QA | `npm run qa:full` |
| DB migrate | `npm run db:migrate` |
| Prisma studio | `npm run db:studio` |
| Storybook | `npm run storybook` |

## Architecture Rules

- Server Components by default; add `"use client"` only when needed
- Use server actions for data mutations
- Functional components with hooks; prefer composition over inheritance
- TypeScript everywhere; no `any` without justification
- Use npm — not yarn, pnpm, or bun

## Design System

See @docs/design-system/DESIGN_SYSTEM.md for full reference. Component examples are in the `design-system` skill.

- **NEVER** hardcode colors, spacing, or typography — use design tokens from `@/design-system/tokens`
- Use shadcn/ui components from `@/components/ui` — never raw HTML or direct Radix imports
- Tables: **ALWAYS** use TanStack Table via `DataTable` from `@/components/data-table`
- Loading states: use skeleton wrappers from `@/components/ui/skeleton-wrappers`
- Mobile-first responsive: `p-4 md:p-6 lg:p-8` — never desktop-first
- Dark mode: use semantic classes (`bg-background`, `text-foreground`)
- Reference implementation: `app/dashboard/players/page.tsx`
- Run `npm run design:lint` before committing UI changes

## Accessibility (WCAG 2.1 AA)

- Images: always include `alt` text (or `alt=""` for decorative)
- Icon buttons: must have `aria-label`
- Form inputs: must have `<Label>` with `htmlFor` matching input `id`
- Focus states: visible ring indicators
- Keyboard navigation: all interactive elements must be accessible

## Security Rules (MANDATORY)

- **NEVER** hardcode API keys, tokens, passwords, or secrets in code or workflow files
- **ALWAYS** load secrets from `process.env.VARIABLE_NAME`
- **ALWAYS** use GitHub Actions secrets (`${{ secrets.NAME }}`) in workflows
- **ALWAYS** check `.env` is in `.gitignore` before creating it
- **NEVER** log secrets — not even in debug mode
- **NEVER** include secrets in error messages or API responses
- If you discover a hardcoded secret: treat as compromised, revoke immediately
- Use bcrypt or argon2 for passwords — never plain text
- Return identical errors for "user not found" and "wrong password"
- Validate all user input at the API boundary
- Use Prisma ORM — never concatenate user input into SQL
- Sanitise user content — never `dangerouslySetInnerHTML` with user data
- Run `/security-review` before merging PRs touching auth, API, or env config

## Git Workflow (REQUIRED)

All work MUST follow: **branch → draft PR → review → merge**

- **NEVER** commit directly to `main`
- **NEVER** merge without CI passing and user approval
- **NEVER** force push
- **ALWAYS** create draft PRs first: `gh pr create --draft`
- Keep PRs under 300 lines where possible

Branch names: `feature/`, `fix/`, `chore/`, `docs/`, `security/`
Commit format: `<type>(<scope>): <description>`

## Testing Rules

- Every new feature: at least one unit test on the core logic path
- Bug fixes: include a regression test that would have caught the bug
- 80% coverage threshold (`vitest.config.ts`) is a floor, not a target
- Run `npm run test:unit` before opening a PR
- Never skip tests without a comment explaining why and a linked issue
