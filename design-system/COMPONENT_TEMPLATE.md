# Component Starter Template

Use this template when creating new components for the design system.

---

## Quick Start

1. Copy the templates below
2. Replace `ComponentName` with your component name (PascalCase)
3. Replace `component-name` with kebab-case version
4. Implement your component logic
5. Create Storybook stories
6. Add E2E tests (for complex components)
7. Document usage

---

## File Structure

```
components/ui/
├── component-name.tsx           # Component implementation
├── component-name.stories.tsx   # Storybook documentation
└── (tests/e2e/component-name.spec.ts)  # E2E tests (if needed)
```

---

## Component Template

**File:** `components/ui/component-name.tsx`

```tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { tokens } from '@/design-system/tokens'

/**
 * ComponentName - Brief description of what this component does
 *
 * @example
 * ```tsx
 * <ComponentName variant="default" size="md">
 *   Content here
 * </ComponentName>
 * ```
 *
 * @see https://design-system.simpleam.com/components/component-name
 */

// Define variants using class-variance-authority
const componentNameVariants = cva(
  // Base styles that apply to all variants
  [
    'inline-flex items-center justify-center',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90',
        ].join(' '),
        secondary: [
          'bg-secondary text-secondary-foreground',
          'hover:bg-secondary/80',
        ].join(' '),
        outline: [
          'border border-input bg-background',
          'hover:bg-accent hover:text-accent-foreground',
        ].join(' '),
        ghost: [
          'hover:bg-accent hover:text-accent-foreground',
        ].join(' '),
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// Props interface
export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentNameVariants> {
  /**
   * Render as a different element using Radix Slot
   */
  asChild?: boolean
  /**
   * Whether the component is disabled
   */
  disabled?: boolean
  // Add other specific props here
}

// Component implementation
export const ComponentName = React.forwardRef<
  HTMLDivElement,
  ComponentNameProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'div'

    return (
      <Comp
        ref={ref}
        className={cn(
          componentNameVariants({ variant, size }),
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

ComponentName.displayName = 'ComponentName'
```

---

## Storybook Story Template

**File:** `components/ui/component-name.stories.tsx`

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './component-name'

/**
 * ComponentName provides [brief description].
 *
 * ## When to use
 * - [Use case 1]
 * - [Use case 2]
 * - [Use case 3]
 *
 * ## When not to use
 * - [Anti-pattern 1] - Use [Alternative] instead
 * - [Anti-pattern 2] - Use [Alternative] instead
 */
const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Detailed component description goes here.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    asChild: {
      control: false,
      description: 'Render as child element',
    },
  },
}

export default meta
type Story = StoryObj<typeof ComponentName>

/**
 * Default variant with medium size
 */
export const Default: Story = {
  args: {
    children: 'Component content',
    variant: 'default',
    size: 'md',
  },
}

/**
 * All available variants
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ComponentName variant="default">Default variant</ComponentName>
      <ComponentName variant="secondary">Secondary variant</ComponentName>
      <ComponentName variant="outline">Outline variant</ComponentName>
      <ComponentName variant="ghost">Ghost variant</ComponentName>
    </div>
  ),
}

/**
 * Available sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
}

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled component',
    disabled: true,
  },
}

/**
 * Interactive example showing common usage patterns
 */
export const Interactive: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Basic usage</h3>
        <ComponentName>Basic example</ComponentName>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">With custom styling</h3>
        <ComponentName className="custom-class">Custom styled</ComponentName>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Real-world example</h3>
        {/* Add realistic usage example */}
      </div>
    </div>
  ),
}

/**
 * Accessibility features demonstration
 */
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Try navigating with Tab key
        </p>
        <ComponentName>Keyboard accessible</ComponentName>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Screen reader friendly
        </p>
        <ComponentName aria-label="Descriptive label">
          With ARIA label
        </ComponentName>
      </div>
    </div>
  ),
}

/**
 * Dark mode support
 */
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="dark">
      <div className="space-y-4">
        <ComponentName variant="default">Default in dark</ComponentName>
        <ComponentName variant="secondary">Secondary in dark</ComponentName>
        <ComponentName variant="outline">Outline in dark</ComponentName>
        <ComponentName variant="ghost">Ghost in dark</ComponentName>
      </div>
    </div>
  ),
}
```

---

## E2E Test Template

**File:** `tests/e2e/component-name.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

const STORYBOOK_URL = 'http://localhost:6006/iframe.html'

test.describe('ComponentName', () => {
  test('renders without errors', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}?id=components-componentname--default`)

    const component = page.locator('[data-component="component-name"]')
    await expect(component).toBeVisible({ timeout: 5000 })
  })

  test('handles keyboard navigation', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}?id=components-componentname--default`)

    const component = page.locator('[data-component="component-name"]')

    // Press Tab to focus
    await page.keyboard.press('Tab')
    await expect(component).toBeFocused()

    // Press Enter/Space to activate (if interactive)
    await page.keyboard.press('Enter')
    // Add assertions for expected behavior
  })

  test('supports all variants', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}?id=components-componentname--variants`)

    const defaultVariant = page.locator('[data-variant="default"]')
    const outlineVariant = page.locator('[data-variant="outline"]')

    await expect(defaultVariant).toBeVisible()
    await expect(outlineVariant).toBeVisible()
  })

  test('respects disabled state', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}?id=components-componentname--disabled`)

    const component = page.locator('[data-component="component-name"]')
    await expect(component).toHaveAttribute('aria-disabled', 'true')

    // Should not be clickable when disabled
    await component.click({ force: true })
    // Assert that no action occurred
  })

  test('works in dark mode', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}?id=components-componentname--dark-mode`)

    // Add dark mode specific assertions
    const component = page.locator('[data-component="component-name"]')
    await expect(component).toBeVisible()

    // Check computed styles if needed
    const bgColor = await component.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    )
    expect(bgColor).toBeTruthy()
  })
})
```

---

## Checklist

Before submitting your component, ensure:

### Code Quality

- [ ] Component uses TypeScript with proper types
- [ ] Component follows existing code patterns
- [ ] Component uses design tokens (no hardcoded values)
- [ ] Component supports `ref` forwarding
- [ ] Component supports `className` for custom styling
- [ ] Component uses CVA for variant management
- [ ] Variants are clearly defined and documented

### Accessibility

- [ ] Component is keyboard navigable (Tab, Enter, Escape, etc.)
- [ ] Component has proper ARIA attributes
- [ ] Component has visible focus indicators
- [ ] Component works with screen readers
- [ ] Component meets WCAG 2.1 AA contrast requirements
- [ ] Component handles disabled state properly
- [ ] Interactive elements have accessible labels

### Theming

- [ ] Component works in light mode
- [ ] Component works in dark mode
- [ ] Component uses CSS variables for colors
- [ ] Component respects system theme preferences
- [ ] Transitions are smooth between themes

### Documentation

- [ ] JSDoc comments added to component
- [ ] Props are documented with descriptions
- [ ] Usage examples included
- [ ] Storybook stories created for all variants
- [ ] "When to use" and "When not to use" documented
- [ ] Accessibility features documented
- [ ] Code examples are complete and correct

### Testing

- [ ] Component renders without errors
- [ ] All variants render correctly
- [ ] Keyboard navigation works
- [ ] Disabled state works
- [ ] Dark mode tested
- [ ] E2E tests added (for complex components)
- [ ] Accessibility tested

### Performance

- [ ] No unnecessary re-renders
- [ ] No console warnings or errors
- [ ] Bundle size impact is reasonable
- [ ] Lazy loading considered (if applicable)

---

## Common Patterns

### Using Design Tokens

```tsx
import { tokens } from '@/design-system/tokens'

// In styles
style={{
  color: tokens.colors.text.primary,
  fontSize: tokens.typography.body.md.fontSize,
  padding: tokens.spacing.spacing.md,
  borderRadius: tokens.radius.md,
}}
```

### Icon Integration

```tsx
import { Icon } from '@/components/ui/icon'
import { CheckIcon } from 'lucide-react'

<ComponentName>
  <Icon icon={CheckIcon} size="sm" decorative />
  <span>With icon</span>
</ComponentName>
```

### Compound Components

```tsx
export const ComponentName = ({ children }: ComponentNameProps) => {
  return <div className="component-name">{children}</div>
}

export const ComponentNameHeader = ({ children }: HeaderProps) => {
  return <div className="component-name-header">{children}</div>
}

export const ComponentNameContent = ({ children }: ContentProps) => {
  return <div className="component-name-content">{children}</div>
}

// Usage
<ComponentName>
  <ComponentNameHeader>Header</ComponentNameHeader>
  <ComponentNameContent>Content</ComponentNameContent>
</ComponentName>
```

### Controlled vs Uncontrolled

```tsx
export const ComponentName = ({
  value: controlledValue,
  defaultValue,
  onChange,
}: ComponentNameProps) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue)
    }
    onChange?.(newValue)
  }

  // Use value and handleChange in component
}
```

---

## Examples

### Simple Component

```tsx
export const Badge = ({ children, variant = 'default' }: BadgeProps) => {
  return (
    <span className={cn(badgeVariants({ variant }))}>
      {children}
    </span>
  )
}
```

### Complex Component with State

```tsx
export const Accordion = ({ items }: AccordionProps) => {
  const [openItems, setOpenItems] = React.useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="accordion">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          {...item}
          isOpen={openItems.includes(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  )
}
```

---

## Resources

- [Component Guidelines](./CONTRIBUTING.md#component-guidelines)
- [Accessibility Requirements](./CONTRIBUTING.md#accessibility-requirements)
- [Testing Guide](./CONTRIBUTING.md#testing-requirements)
- [Storybook Documentation](https://storybook.js.org/docs)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## Questions?

If you're unsure about any aspect of component development:

1. Check existing components for patterns
2. Review the contribution guidelines
3. Ask in a GitHub Discussion
4. Open a draft PR for early feedback

---

**Last Updated:** November 5, 2024
**Version:** 1.0.0
