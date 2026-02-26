---
name: design-system
description: "Design system reference for SimpleAM — component usage examples, design tokens, responsive patterns, skeleton wrappers, and accessibility rules. Use when building or modifying UI components, pages, or layouts."
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
---

# SimpleAM Design System Reference

Full documentation: @docs/design-system/DESIGN_SYSTEM.md
AI prompt templates: @docs/design-system/AI_PROMPTS.md

## Component Import Patterns

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

### Tables — ALWAYS use TanStack Table
```tsx
import { DataTable } from '@/components/data-table'
import { useReactTable } from '@tanstack/react-table'
```
Reference implementation: `app/dashboard/players/page.tsx`
Never use native HTML `<table>` elements for data tables.

### Loading States — Skeleton Wrappers
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

**Skeleton rules:**
- Always use skeleton wrappers from `@/components/ui/skeleton-wrappers`, never create inline skeletons
- Skeletons must match the final content structure (no extra padding)
- No horizontal padding (rely on PageFrame's global p-4)
- Use plain divs with bg-card inside skeletons, not Card components
- Prefer partial Suspense boundaries (header → filters → content) over full-page loading

## Design Tokens

### Colors
- Use semantic classes: `bg-primary`, `text-foreground`, `border-border`
- Never use: `bg-blue-500`, `text-gray-900`, hardcoded hex/rgb values
- Import: `import { colors } from '@/design-system/tokens'`

### Spacing
- Use Tailwind spacing scale: `p-4`, `m-2`, `gap-6`
- Never use: `padding: 13px`, arbitrary values like `p-[13px]`
- Import: `import { spacingPatterns } from '@/design-system/tokens'`

### Typography
- Use Tailwind text classes: `text-base`, `text-lg`, `font-semibold`
- Never use: `fontSize: '14px'`, hardcoded font sizes
- Import: `import { typographyScale } from '@/design-system/tokens'`

### Motion
- Import: `import { motion } from '@/design-system/tokens/motion'`
- Always respect `prefers-reduced-motion`
- Use durations: `motion.duration.normal`, `motion.duration.fast`

## Responsive Patterns

```tsx
// ✅ Good: Mobile-first
<div className="p-4 md:p-6 lg:p-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ Bad: Desktop-first
<div className="lg:p-4 md:p-6 p-8">
```

## Good vs Bad Examples

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

**Why it's bad**: Hardcoded colors, inline styles, raw HTML button instead of shadcn/ui, no aria-label, no dark mode support.
