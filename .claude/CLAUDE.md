# SimpleAM Design System Rules

Always follow the SimpleAM design system when writing code. Reference the full documentation at `docs/design-system/DESIGN_SYSTEM.md`.

## Core Principles

1. **Use Design Tokens**: Never hardcode colors, spacing, or typography values. Always use design tokens from `@/design-system/tokens` or Tailwind semantic classes.

2. **Use shadcn/ui Components**: Import components from `@/components/ui` instead of creating custom implementations or importing directly from Radix UI.

3. **Mobile-First Responsive**: Always write mobile styles first, then add larger breakpoints (sm:, md:, lg:).

4. **Accessibility First**: All components must meet WCAG 2.1 AA standards. Include proper ARIA labels, keyboard navigation, and focus indicators.

5. **Dark Mode Support**: Use semantic color classes (bg-background, text-foreground) that automatically adapt to dark mode.

## Design Tokens

### Colors
- Use semantic classes: `bg-primary`, `text-foreground`, `border-border`
- Never use: `bg-blue-500`, `text-gray-900`, hardcoded hex/rgb values
- Import tokens: `import { colors } from '@/design-system/tokens'`

### Spacing
- Use Tailwind spacing scale: `p-4`, `m-2`, `gap-6`
- Never use: `padding: 13px`, arbitrary values like `p-[13px]`
- Import patterns: `import { spacingPatterns } from '@/design-system/tokens'`

### Typography
- Use Tailwind text classes: `text-base`, `text-lg`, `font-semibold`
- Never use: `fontSize: '14px'`, hardcoded font sizes
- Import scale: `import { typographyScale } from '@/design-system/tokens'`

### Motion
- Use motion tokens: `import { motion } from '@/design-system/tokens/motion'`
- Always respect `prefers-reduced-motion`
- Use durations: `motion.duration.normal`, `motion.duration.fast`

## Component Usage

### Tables
- **Always use TanStack Table** via `DataTable` component from `@/components/data-table`
- Reference implementation: `app/dashboard/players/page.tsx`
- Never use native HTML `<table>` elements for data tables
- Use `@tanstack/react-table` for sorting, filtering, pagination

### Buttons
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
```

### Forms
```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

### Cards
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

## Responsive Patterns

```tsx
// ✅ Good: Mobile-first
<div className="p-4 md:p-6 lg:p-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ Bad: Desktop-first
<div className="lg:p-4 md:p-6 p-8">
```

## Accessibility Requirements

1. **Images**: Always include `alt` text (or `alt=""` for decorative images)
2. **Icon Buttons**: Must have `aria-label` attribute
3. **Form Inputs**: Must have associated `<Label>` with `htmlFor` matching input `id`
4. **Focus States**: Visible focus indicators using `ring` utilities
5. **Keyboard Navigation**: All interactive elements must be keyboard accessible

## Examples

### ✅ Good
```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

<Card>
  <CardContent className="p-4 space-y-4">
    <Button variant="primary" aria-label="Submit form">
      Submit
    </Button>
  </CardContent>
</Card>
```

### ❌ Bad
```tsx
<div style={{ padding: '16px', backgroundColor: '#3b82f6' }}>
  <button className="px-4 py-2 bg-blue-500">
    Submit
  </button>
</div>
```

## Reference Files

- Design System Docs: `docs/design-system/DESIGN_SYSTEM.md`
- Token Definitions: `design-system/tokens/`
- Reference Implementation: `app/dashboard/players/page.tsx`
- Component Library: `components/ui/`

## Component Usage Quick Reference

### Tables - use DataTable
```tsx
import { DataTable } from '@/components/data-table'
import { useReactTable } from '@tanstack/react-table'
```

### Buttons
```tsx
import { Button } from '@/components/ui/button'
```

### Forms
```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
```

### Cards
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
```

### Loading States - use Skeleton Wrappers
```tsx
import { TablePageSkeleton, CardListSkeleton, CardGridSkeleton } from '@/components/ui/skeleton-wrappers'
import { Suspense } from 'react'

// For table pages
<Suspense fallback={<TablePageSkeleton rows={10} />}>
  <DataTable />
</Suspense>

// For card lists
<Suspense fallback={<CardListSkeleton count={3} showFilters={true} />}>
  <NotesList />
</Suspense>

// For card grids
<Suspense fallback={<CardGridSkeleton count={6} columns={3} />}>
  <ReportsList />
</Suspense>
```

**Rules:**
- Always use skeleton wrappers from `@/components/ui/skeleton-wrappers`, never create inline skeletons
- Skeletons must match the final content structure (no extra padding)
- No horizontal padding (rely on PageFrame's global p-4)
- Use plain divs with bg-card inside skeletons, not Card components
- Prefer partial Suspense boundaries (header → filters → content) over full-page loading

## Coding Standards

- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused
- Use TypeScript for all components
- Follow Next.js App Router patterns (Server Components by default)
- Use server actions for data mutations

## Workflow Guidelines

- All new features must follow the design system
- Run `npm run design:lint` before committing
- Review reference implementation: `app/dashboard/players/page.tsx`
- Test accessibility with keyboard navigation
- Verify dark mode support

## Security Rules (MANDATORY)

- **NEVER** hardcode API keys, tokens, passwords, or secrets in code or workflow files
- **ALWAYS** load secrets from environment variables (`process.env.VARIABLE_NAME`)
- **ALWAYS** use GitHub Actions secrets (`${{ secrets.NAME }}`) in workflow files — never inline values
- **ALWAYS** check that `.env` is in `.gitignore` before creating it
- **NEVER** log secrets — not even in debug mode
- **NEVER** include secrets in error messages or API responses
- If you discover a hardcoded secret, treat it as compromised: it must be revoked and rotated immediately
- Never store passwords in plain text — use bcrypt or argon2
- Return the same error for "user not found" and "wrong password"
- Validate all user input at the API boundary
- Use ORM queries (Prisma) — never concatenate user input into SQL
- Sanitise user content before rendering in HTML — never use `dangerouslySetInnerHTML` with user data
- Run `/security-review` before merging PRs that touch auth, API integrations, or environment config

## Git Workflow Rules (REQUIRED)

All work MUST follow: **branch → draft PR → review → merge**

- **NEVER** commit directly to `main`
- **NEVER** merge without CI passing and user approval
- **NEVER** force push
- **ALWAYS** create draft PRs first: `gh pr create --draft`
- Keep PRs under 300 lines where possible

Branch naming conventions:
- `feature/` — new functionality
- `fix/` — bug fixes
- `chore/` — maintenance, deps, config, tooling
- `docs/` — documentation only
- `security/` — security fixes (prioritise for review)

Commit message format: `<type>(<scope>): <description>`

## Testing Rules

- Every new feature must include at least one unit test covering the core logic path
- Bug fixes must include a regression test that would have caught the bug
- The 80% coverage threshold (configured in `vitest.config.ts`) is a floor, not a target
- Use Vitest for unit tests: `npm run test:unit`
- Use Playwright for E2E tests: `npm run test:e2e`
- Before opening a PR for review, confirm `npm run test:unit` passes locally
- Do not disable or skip tests without a comment explaining why and a linked issue to fix it
