# Contributing to SimpleAM Design System

Thank you for your interest in contributing to our design system! This guide will help you get started.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Component Guidelines](#component-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Testing Requirements](#testing-requirements)
- [Submitting Changes](#submitting-changes)
- [Review Process](#review-process)
- [Community](#community)

---

## Code of Conduct

### Our Pledge

We're committed to providing a welcoming, inclusive environment for everyone. We expect all contributors to:

- **Be respectful** – Value diverse perspectives and experiences
- **Be collaborative** – Work together toward the best solutions
- **Be constructive** – Provide helpful feedback, not criticism
- **Be patient** – We're all learning and growing together

### Unacceptable Behavior

- Harassment or discrimination of any kind
- Trolling, insulting comments, or personal attacks
- Publishing others' private information
- Other conduct inappropriate in a professional setting

**Report issues:** Contact the design system team privately.

---

## How to Contribute

There are many ways to contribute beyond writing code:

### 💬 Feedback & Discussion

- Report bugs or issues
- Suggest new features or components
- Discuss design decisions
- Share use cases from your projects

### 📝 Documentation

- Fix typos or unclear instructions
- Add code examples
- Improve accessibility documentation
- Write tutorials or guides

### 🎨 Design

- Propose new components
- Suggest improvements to existing patterns
- Create Figma designs
- Contribute to design guidelines

### 💻 Code

- Fix bugs
- Implement new features
- Add tests
- Improve performance

### ✅ Testing

- Write unit tests
- Add accessibility tests
- Test browser compatibility
- Report edge cases

---

## Getting Started

### Prerequisites

**Required:**
- Node.js v18 or higher (check `.nvmrc`)
- npm or yarn
- Git

**Recommended:**
- VS Code or similar editor
- Basic React and TypeScript knowledge
- Familiarity with Next.js

### Installation

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Simpleamapp.git
   cd Simpleamapp
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development servers**
   ```bash
   # Start Next.js development server
   npm run dev

   # Start Storybook (in another terminal)
   npm run storybook
   ```

5. **Verify setup**
   - Next.js: http://localhost:3000
   - Storybook: http://localhost:6006

### Project Structure

```
Simpleamapp/
├── app/                          # Next.js app router
├── components/
│   ├── ui/                       # Design system components
│   │   ├── button.tsx
│   │   ├── button.stories.tsx
│   │   └── ...
│   ├── examples/                 # Usage examples
│   └── players/                  # Feature-specific components
├── design-system/
│   ├── tokens/                   # Design tokens
│   ├── migrations/               # Migration docs
│   ├── CONTENT_STYLE_GUIDE.md
│   ├── MICROCOPY_PATTERNS.md
│   └── ...
├── tests/
│   └── e2e/                      # Playwright E2E tests
└── ...
```

---

## Development Workflow

### 1. Create a Branch

Use descriptive branch names:

```bash
git checkout -b feature/add-pagination-component
git checkout -b fix/button-dark-mode-contrast
git checkout -b docs/improve-icon-guidelines
```

**Naming convention:**
- `feature/` – New features or components
- `fix/` – Bug fixes
- `docs/` – Documentation updates
- `refactor/` – Code refactoring
- `test/` – Adding or updating tests

### 2. Make Your Changes

Follow our coding standards:

- Use TypeScript
- Follow existing code style
- Use design tokens (not hardcoded values)
- Write semantic, accessible HTML
- Keep components focused and composable

### 3. Write Tests

Every component needs:

```tsx
// Component file
components/ui/example.tsx

// Storybook story
components/ui/example.stories.tsx

// E2E test (for complex components)
tests/e2e/example.spec.ts
```

### 4. Document Your Changes

Update or create:
- Component props documentation
- Usage examples in Storybook
- README sections if needed
- Migration guides for breaking changes

### 5. Test Locally

```bash
# Run type checking
npm run type-check

# Run linter
npm run lint

# Run tests
npm run test

# Build Storybook
npm run build-storybook

# Build Next.js
npm run build
```

---

## Component Guidelines

### Design Token Usage

**Always use design tokens** instead of hardcoded values.

✅ **Good:**
```tsx
<div
  style={{
    color: tokens.colors.text.primary,
    fontSize: tokens.typography.body.md.fontSize,
    padding: tokens.spacing.spacing.md,
  }}
>
```

❌ **Avoid:**
```tsx
<div className="text-gray-900 text-base p-4">
```

### Component Structure

Follow this pattern:

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { tokens } from '@/design-system/tokens'

// Define variants using CVA
const exampleVariants = cva(
  'base-classes', // base styles
  {
    variants: {
      variant: {
        default: 'default-styles',
        outline: 'outline-styles',
      },
      size: {
        sm: 'small-styles',
        md: 'medium-styles',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// Define props interface
export interface ExampleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof exampleVariants> {
  // Additional props
}

// Component implementation
export const Example = React.forwardRef<HTMLDivElement, ExampleProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(exampleVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)

Example.displayName = 'Example'
```

### Accessibility Requirements

Every component must:

1. **Be keyboard accessible**
   - Focusable with Tab
   - Operable with keyboard
   - Logical tab order

2. **Have proper ARIA attributes**
   ```tsx
   <button
     aria-label="Close dialog"
     aria-expanded={isOpen}
     aria-disabled={disabled}
   >
   ```

3. **Support screen readers**
   - Meaningful labels
   - Status updates announced
   - Error messages associated with fields

4. **Meet WCAG 2.1 AA**
   - 4.5:1 contrast for normal text
   - 3:1 contrast for large text
   - 3:1 contrast for interactive elements

5. **Handle focus management**
   - Visible focus indicators
   - Focus trapping in modals
   - Focus restoration after dialogs close

### Dark Mode Support

All components must work in both themes:

```tsx
// Use CSS variables that change with theme
<div className="bg-background text-foreground">
  {/* Content */}
</div>

// Or use design tokens
<div
  style={{
    backgroundColor: tokens.colors.surface.base,
    color: tokens.colors.text.primary,
  }}
>
```

---

## Documentation Guidelines

### Storybook Stories

Create comprehensive stories:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Example } from './example';

const meta: Meta<typeof Example> = {
  title: 'Components/Example',
  component: Example,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Example>;

// Default story
export const Default: Story = {
  args: {
    children: 'Example content',
  },
};

// Variant stories
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline variant',
  },
};

// Interactive story
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Example variant="default">Default</Example>
      <Example variant="outline">Outline</Example>
      <Example variant="ghost">Ghost</Example>
    </div>
  ),
};
```

### Component Documentation

Include in your component file or separate docs:

```tsx
/**
 * Example component for demonstrating patterns.
 *
 * @example
 * ```tsx
 * <Example variant="outline" size="lg">
 *   Hello world
 * </Example>
 * ```
 *
 * @see https://design-system.simpleam.com/components/example
 */
```

---

## Testing Requirements

### Unit Tests (Coming Soon)

When our testing infrastructure is ready:

```tsx
import { render, screen } from '@testing-library/react';
import { Example } from './example';

describe('Example', () => {
  it('renders with default props', () => {
    render(<Example>Test content</Example>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Example variant="outline">Test</Example>);
    // Assertions
  });
});
```

### E2E Tests (Playwright)

For complex interactive components:

```typescript
import { test, expect } from '@playwright/test';

test('example component renders correctly', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=components-example--default');

  const component = page.locator('[data-testid="example"]');
  await expect(component).toBeVisible();
});
```

### Accessibility Testing

```tsx
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<Example>Test</Example>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Submitting Changes

### Before You Submit

**Checklist:**

- [ ] Code follows our style guide
- [ ] Uses design tokens (no hardcoded values)
- [ ] Component is accessible (keyboard, screen reader, ARIA)
- [ ] Works in light and dark mode
- [ ] Storybook story created
- [ ] Documentation updated
- [ ] Tests added (when applicable)
- [ ] No linting errors (`npm run lint`)
- [ ] No type errors (`npm run type-check`)
- [ ] Builds successfully (`npm run build`)

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature or component
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(button): add loading state variant

Add a loading variant to the Button component with spinner animation.
Includes Storybook story and updated documentation.

Closes #123
```

```bash
fix(dialog): correct focus trap behavior

Dialog now properly traps focus and returns focus to trigger element
when closed, following ARIA authoring practices.

Fixes #456
```

```bash
docs(icons): add usage guidelines for icon sizing

Expand icon guidelines to include sizing recommendations for different
contexts (inline, button, navigation, empty states).
```

### Create a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a PR on GitHub**
   - Use a clear, descriptive title
   - Fill out the PR template completely
   - Link related issues
   - Add screenshots for UI changes
   - Request reviewers

3. **PR Description Template**

   ```markdown
   ## Description
   Brief description of changes.

   ## Type of Change
   - [ ] New feature
   - [ ] Bug fix
   - [ ] Documentation update
   - [ ] Breaking change

   ## Changes Made
   - Added X component
   - Fixed Y behavior
   - Updated Z documentation

   ## Testing
   - [ ] Tested in Chrome, Firefox, Safari
   - [ ] Tested with keyboard navigation
   - [ ] Tested with screen reader
   - [ ] Tested light and dark mode
   - [ ] Added/updated Storybook stories
   - [ ] Added/updated tests

   ## Screenshots
   (if applicable)

   ## Related Issues
   Closes #123
   ```

---

## Review Process

### What to Expect

1. **Initial Review** – Within 2-3 business days
2. **Feedback** – Reviewers may request changes
3. **Iteration** – You address feedback
4. **Approval** – Two approvals required
5. **Merge** – We'll merge your contribution

### Review Criteria

Reviewers will check:

- **Code quality** – Readable, maintainable, follows conventions
- **Design consistency** – Matches design system patterns
- **Accessibility** – Meets WCAG 2.1 AA standards
- **Performance** – No unnecessary re-renders or heavy operations
- **Documentation** – Clear examples and usage guidelines
- **Testing** – Adequate test coverage

### Addressing Feedback

- Respond to all comments
- Ask questions if anything is unclear
- Make requested changes in new commits
- Mark conversations as resolved when complete

### After Your PR is Merged

- Your contribution will be in the next release
- You'll be credited in the changelog
- Thank you for making our design system better!

---

## Community

### Get Help

- **Questions?** Open a GitHub Discussion
- **Found a bug?** Create an issue
- **Need clarification?** Ask in your PR or issue

### Stay Updated

- Watch the repository for updates
- Read our changelog for new releases
- Check the roadmap for upcoming features

### Recognition

We value all contributions! Contributors are:

- Credited in release notes
- Listed in our contributors file
- Acknowledged in documentation

---

## Development Tips

### Using Design Tokens

```tsx
// Import tokens
import { tokens } from '@/design-system/tokens';

// Use in styles
style={{
  color: tokens.colors.text.primary,
  fontSize: tokens.typography.body.md.fontSize,
  padding: tokens.spacing.spacing.md,
  borderRadius: tokens.radius.md,
}}
```

### Icon Usage

```tsx
import { Icon } from '@/components/ui/icon';
import { CheckIcon } from 'lucide-react';

// Use Icon wrapper for consistency
<Icon icon={CheckIcon} size="md" label="Success" />
```

### Testing Dark Mode in Storybook

Click the theme toggle in the Storybook toolbar to test both themes.

### Debugging

```tsx
// Use React DevTools
// Add data attributes for testing
<div data-testid="example-component" data-variant={variant}>
```

---

## Resources

### Documentation
- [Content Style Guide](./design-system/CONTENT_STYLE_GUIDE.md)
- [Microcopy Patterns](./design-system/MICROCOPY_PATTERNS.md)
- [Icon Guidelines](./design-system/ICON_GUIDELINES.md)
- [Component Template](./design-system/COMPONENT_TEMPLATE.md)

### External Resources
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Storybook Documentation](https://storybook.js.org/docs)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Questions?

- Open a [GitHub Discussion](https://github.com/your-repo/discussions)
- Check existing [issues](https://github.com/your-repo/issues)
- Review the [documentation](./design-system/)

Thank you for contributing to SimpleAM Design System! 🎉

---

**Last Updated:** November 5, 2024
**Version:** 1.0.0
