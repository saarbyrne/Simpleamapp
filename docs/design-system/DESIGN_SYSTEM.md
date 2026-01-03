# SimpleAM Design System

## Introduction & Philosophy

The SimpleAM design system provides a comprehensive set of design tokens, components, and patterns to ensure consistency, accessibility, and maintainability across the platform. Built on top of [shadcn/ui](https://ui.shadcn.com) and [Radix UI](https://www.radix-ui.com) primitives, it follows a mobile-first, accessibility-first approach.

### Core Principles

1. **Accessibility First**: All components meet WCAG 2.1 AA standards
2. **Consistency**: Design tokens ensure visual and functional consistency
3. **Composability**: Components are built to be combined and extended
4. **Performance**: Optimized for fast rendering and minimal bundle size
5. **Dark Mode**: Full support for light and dark themes

### Technology Stack

- **UI Framework**: shadcn/ui (64+ components)
- **Primitives**: Radix UI (accessible, unstyled components)
- **Styling**: Tailwind CSS v4 (utility-first CSS)
- **Theme System**: CSS custom properties (CSS variables)
- **Tables**: TanStack Table (React Table v8)

## Design Tokens

Design tokens are the foundational values that define our visual language. All tokens are defined as CSS custom properties in `app/globals.css` and mapped to Tailwind utilities in `tailwind.config.js`.

### Colors

Colors use the OKLCH color space for better perceptual uniformity and wide gamut support. All colors are defined as CSS variables and support both light and dark modes.

#### Semantic Colors

**Primary Colors**
- `--primary`: Main brand color (oklch format)
- `--primary-foreground`: Text color on primary backgrounds

**Secondary Colors**
- `--secondary`: Secondary actions and backgrounds
- `--secondary-foreground`: Text color on secondary backgrounds

**Destructive Colors**
- `--destructive`: Error states, destructive actions
- `--destructive-foreground`: Text color on destructive backgrounds

**Muted Colors**
- `--muted`: Subtle backgrounds and borders
- `--muted-foreground`: Secondary text color

**Accent Colors**
- `--accent`: Accent highlights and interactive elements
- `--accent-foreground`: Text color on accent backgrounds

#### Background Colors

- `--background`: Main page background
- `--foreground`: Main text color
- `--card`: Card component background
- `--card-foreground`: Card text color
- `--popover`: Popover/dropdown background
- `--popover-foreground`: Popover text color
- `--page-background`: Page-level background
- `--nav-background`: Navigation background

#### Border & Input Colors

- `--border`: Border color for dividers and outlines
- `--input`: Input field border color
- `--ring`: Focus ring color

#### Sidebar Colors

- `--sidebar`: Sidebar background
- `--sidebar-foreground`: Sidebar text
- `--sidebar-primary`: Primary sidebar accent
- `--sidebar-primary-foreground`: Text on primary sidebar accent
- `--sidebar-accent`: Sidebar accent background
- `--sidebar-accent-foreground`: Text on sidebar accent
- `--sidebar-border`: Sidebar border color
- `--sidebar-ring`: Sidebar focus ring

#### Chart Colors

- `--chart-1` through `--chart-5`: Data visualization colors

#### Usage in Code

```tsx
// Use Tailwind classes (recommended)
<div className="bg-primary text-primary-foreground">
  Primary content
</div>

<div className="bg-card text-card-foreground border border-border">
  Card content
</div>

// Direct CSS variable access (when needed)
<div style={{ backgroundColor: 'var(--primary)' }}>
  Custom usage
</div>
```

### Spacing

Spacing follows Tailwind's default scale (0.25rem increments) with additional custom values:

- `0`: 0px
- `0.5`: 0.125rem (2px)
- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `3`: 0.75rem (12px)
- `4`: 1rem (16px)
- `5`: 1.25rem (20px)
- `6`: 1.5rem (24px)
- `8`: 2rem (32px)
- `10`: 2.5rem (40px)
- `12`: 3rem (48px)
- `16`: 4rem (64px)
- `20`: 5rem (80px)
- `24`: 6rem (96px)

#### Usage

```tsx
// Padding
<div className="p-4">Padding all sides</div>
<div className="px-4 py-2">Horizontal and vertical padding</div>

// Margin
<div className="m-4">Margin all sides</div>
<div className="mx-auto">Center horizontally</div>

// Gap (for flexbox/grid)
<div className="flex gap-4">Items with gap</div>
```

### Typography

#### Font Families

- `--font-sans`: Primary sans-serif font (Plus Jakarta Sans, system fallbacks)
- `--font-mono`: Monospace font for code (system monospace)

#### Font Sizes

Tailwind's default type scale:
- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px) - default
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)
- `text-4xl`: 2.25rem (36px)

#### Font Weights

- `font-normal`: 400
- `font-medium`: 500
- `font-semibold`: 600
- `font-bold`: 700

#### Line Heights

Automatically calculated based on font size for optimal readability.

#### Usage

```tsx
<h1 className="text-3xl font-bold">Heading</h1>
<p className="text-base text-foreground">Body text</p>
<code className="font-mono text-sm">Code snippet</code>
```

### Border Radius

Border radius values are calculated from a base `--radius` variable (0.65rem):

- `rounded-sm`: `calc(var(--radius) - 4px)`
- `rounded-md`: `calc(var(--radius) - 2px)`
- `rounded-lg`: `var(--radius)` (0.65rem)

#### Usage

```tsx
<div className="rounded-lg">Rounded corners</div>
<button className="rounded-md">Button</button>
```

### Motion & Animation

Motion tokens are defined in `design-system/tokens/motion.ts`:

#### Durations

- `fast`: 150ms
- `moderate`: 250ms
- `normal`: 300ms
- `slow`: 500ms
- `slower`: 700ms
- `slowest`: 1000ms

#### Easing Functions

- `easeIn`: `cubic-bezier(0.4, 0, 1, 1)`
- `easeOut`: `cubic-bezier(0, 0, 0.2, 1)`
- `easeInOut`: `cubic-bezier(0.4, 0, 0.2, 1)`

#### Usage

```tsx
import { motion } from '@/design-system/tokens/motion'

// In CSS/animations
const transition = `all ${motion.duration.normal}ms ${motion.easing.easeInOut}`

// Always respect reduced motion
@media (prefers-reduced-motion: reduce) {
  transition: none;
}
```

## Component Patterns

### Component Library

SimpleAM uses shadcn/ui components located in `components/ui/`. All components are:

- **Accessible**: Built on Radix UI primitives with ARIA support
- **Customizable**: Styled with Tailwind, easy to override
- **Composable**: Can be combined to create complex interfaces
- **Type-safe**: Full TypeScript support

### Common Patterns

#### Buttons

```tsx
import { Button } from '@/components/ui/button'

// Primary action
<Button>Click me</Button>

// Variants
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

#### Cards

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content
  </CardContent>
</Card>
```

#### Forms

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

<form className="space-y-4">
  <div>
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" />
  </div>
  <Button type="submit">Submit</Button>
</form>
```

#### Data Tables (TanStack Table)

Reference implementation: `app/dashboard/players/page.tsx`

```tsx
import { DataTable } from '@/components/data-table'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

// Define columns
const columns: ColumnDef<Data>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  // ... more columns
]

// Use DataTable component
<DataTable
  data={data}
  columns={columns}
  // ... other props
/>
```

Key features:
- Sorting, filtering, pagination
- Column visibility and ordering
- Row selection
- Export functionality
- Responsive design

### Responsive Design

Follow mobile-first approach:

```tsx
// Mobile-first: base styles for mobile, then larger breakpoints
<div className="
  p-4           // Mobile: 16px padding
  md:p-6        // Tablet: 24px padding
  lg:p-8        // Desktop: 32px padding
">
  Content
</div>

// Grid layouts
<div className="
  grid
  grid-cols-1      // Mobile: 1 column
  md:grid-cols-2   // Tablet: 2 columns
  lg:grid-cols-3   // Desktop: 3 columns
  gap-4
">
  Items
</div>
```

### Dark Mode

Dark mode is automatically handled via CSS variables. Components automatically adapt when the `dark` class is applied to the root element.

```tsx
// No special code needed - colors adapt automatically
<div className="bg-background text-foreground">
  Automatically adapts to light/dark mode
</div>

// Manual dark mode toggle (if needed)
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Toggle theme
</button>
```

### Accessibility

All components follow WCAG 2.1 AA standards:

1. **Keyboard Navigation**: All interactive elements are keyboard accessible
2. **Focus Management**: Visible focus indicators using `--ring` color
3. **ARIA Labels**: Proper ARIA attributes for screen readers
4. **Color Contrast**: All text meets contrast requirements
5. **Reduced Motion**: Animations respect `prefers-reduced-motion`

#### Accessibility Checklist

- [ ] All images have `alt` text (or `alt=""` for decorative)
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have associated `Label` components
- [ ] Focus states are visible
- [ ] Color is not the only indicator of state
- [ ] Animations respect `prefers-reduced-motion`

## Usage Examples

### Do's ✅

```tsx
// Use semantic color classes
<div className="bg-primary text-primary-foreground">Good</div>

// Use spacing scale
<div className="p-4 gap-4">Good</div>

// Use design tokens for animations
import { motion } from '@/design-system/tokens/motion'
const duration = motion.duration.normal

// Use components from ui/
import { Button } from '@/components/ui/button'
<Button>Good</Button>

// Mobile-first responsive
<div className="p-4 md:p-6 lg:p-8">Good</div>
```

### Don'ts ❌

```tsx
// Don't use hardcoded colors
<div style={{ backgroundColor: '#3b82f6' }}>Bad</div>
<div className="bg-[#3b82f6]">Bad</div>

// Don't use arbitrary spacing
<div className="p-[13px]">Bad</div>

// Don't bypass the component library
<button className="px-4 py-2 bg-blue-500">Bad</button>

// Don't use desktop-first responsive
<div className="lg:p-4 md:p-6 p-8">Bad</div>
```

### Migration Guide

If you have existing code with hardcoded values:

1. **Colors**: Replace hex/rgb values with semantic classes
   ```tsx
   // Before
   <div className="bg-blue-500">
   
   // After
   <div className="bg-primary">
   ```

2. **Spacing**: Use Tailwind spacing scale
   ```tsx
   // Before
   <div style={{ padding: '13px' }}>
   
   // After
   <div className="p-3">
   ```

3. **Components**: Replace custom implementations with shadcn/ui components
   ```tsx
   // Before
   <button className="px-4 py-2 rounded bg-blue-500">
   
   // After
   <Button>Click me</Button>
   ```

## Reference Implementation

### Players Table

The players list page (`app/dashboard/players/page.tsx`) serves as the reference implementation for:

- **TanStack Table**: Complete data table implementation
- **Component Composition**: How to combine multiple UI components
- **Server Components**: Next.js App Router patterns
- **Data Fetching**: Server actions and data flow
- **Responsive Design**: Mobile-first table layout

Key patterns to follow:
- Use `DataTable` component from `@/components/data-table`
- Define columns with `ColumnDef` type
- Use server actions for data mutations
- Implement proper loading and error states

## Tools & Scripts

### Design Linting

```bash
npm run design:lint
```

Validates components against design system rules:
- No hardcoded colors
- No hardcoded spacing
- Proper accessibility attributes
- Component naming conventions
- Responsive design patterns

### Token Validation

```bash
npm run design:validate-tokens
```

Checks that components use design tokens instead of hardcoded values.

### Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Visual regression
npm run test:visual

# Accessibility
npm run test:a11y
```

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TanStack Table Documentation](https://tanstack.com/table)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Getting Help

- Check component examples in `components/ui/`
- Review reference implementation: `app/dashboard/players/page.tsx`
- See design token definitions: `app/globals.css` and `design-system/tokens/`
- Run design linting to catch violations: `npm run design:lint`
