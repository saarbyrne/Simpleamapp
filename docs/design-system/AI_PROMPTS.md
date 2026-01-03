# AI Assistant Prompts for Design System

Reusable prompts for AI coding assistants (Claude, Codex, etc.) to ensure design system compliance.

## Component Creation

```
Create a new [component name] component following the SimpleAM design system:

Requirements:
- Use shadcn/ui components from @/components/ui
- Use design tokens from @/design-system/tokens
- Support dark mode with semantic color classes
- Mobile-first responsive design
- WCAG 2.1 AA accessibility compliance
- Include proper TypeScript types

Reference: docs/design-system/DESIGN_SYSTEM.md
```

## Table Implementation

```
Create a data table for [data type] using TanStack Table:

Requirements:
- Use DataTable component from @/components/data-table
- Follow the pattern in app/dashboard/players/page.tsx
- Include sorting, filtering, and pagination
- Responsive design for mobile devices
- Proper column definitions with TypeScript types

Reference: app/dashboard/players/page.tsx
```

## Styling Updates

```
Update the styling for [component/page] to follow design system:

Requirements:
- Replace hardcoded colors with semantic classes (bg-primary, text-foreground)
- Replace hardcoded spacing with Tailwind scale (p-4, m-2, gap-6)
- Ensure dark mode support
- Mobile-first responsive breakpoints
- Use design tokens for animations

Check: Run `npm run design:lint` to validate
```

## Accessibility Fixes

```
Fix accessibility issues in [component/page]:

Requirements:
- Add alt text to all images
- Add aria-label to icon-only buttons
- Ensure proper label associations for form inputs
- Verify keyboard navigation works
- Check color contrast meets WCAG AA standards
- Add focus indicators

Validate: Run `npm run test:a11y`
```

## Token Usage

```
Update [component] to use design tokens instead of hardcoded values:

Import tokens:
import { motion, colors, spacing, typography } from '@/design-system/tokens'

Replace:
- Colors: Use semantic classes or colors.* tokens
- Spacing: Use Tailwind scale or spacing.* tokens
- Typography: Use Tailwind text classes or typography.* tokens
- Motion: Use motion.duration.* and motion.easing.*
```

## Component Migration

```
Migrate [component] to use design system:

1. Replace custom styling with shadcn/ui components
2. Use design tokens for all values
3. Add dark mode support
4. Ensure accessibility compliance
5. Add responsive breakpoints
6. Update TypeScript types

Reference: docs/design-system/DESIGN_SYSTEM.md
```

## Design System Validation

```
Validate that [file/component] follows the design system:

Check for:
- No hardcoded colors, spacing, or typography
- Proper use of shadcn/ui components
- Dark mode support
- Accessibility attributes
- Mobile-first responsive design
- Design token usage

Run: npm run design:lint
```

## Common Patterns

### Button with Icon
```
Create a button with icon following design system:

<Button variant="default" size="default">
  <Icon className="h-4 w-4 mr-2" />
  Button Text
</Button>

For icon-only buttons, add aria-label:
<Button variant="ghost" size="icon" aria-label="Action description">
  <Icon className="h-4 w-4" />
</Button>
```

### Form with Validation
```
Create a form following design system:

<form className="space-y-4">
  <div>
    <Label htmlFor="field">Field Label</Label>
    <Input id="field" type="text" />
  </div>
  <Button type="submit">Submit</Button>
</form>
```

### Card Layout
```
Create a card layout following design system:

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    Content here
  </CardContent>
</Card>
```

### Responsive Grid
```
Create a responsive grid following design system:

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id}>...</Card>
  ))}
</div>
```

## Testing Prompts

```
Add tests for [component] following design system patterns:

1. Unit tests using Vitest and Testing Library
2. Accessibility tests using @axe-core/playwright
3. Visual regression tests (if applicable)
4. Test design token usage
5. Test dark mode support

Reference: tests/design-system/
```

## Documentation Prompts

```
Document [component] following design system standards:

Include:
- Usage examples with code snippets
- Props documentation
- Design token usage
- Accessibility notes
- Responsive behavior
- Dark mode support

Format: Follow docs/design-system/DESIGN_SYSTEM.md style
```
