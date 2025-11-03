# SimpleAM Design System - Implementation Plan

## Executive Summary

A comprehensive design system following Atomic Design principles and IBM Carbon standards, built on shadcn/ui foundation. This will eliminate current issues (z-index conflicts, CSS inconsistencies, component unpredictability) and create a scalable, maintainable codebase.

---

## Design System Architecture

### Foundation Layer
```
Design Tokens (Primitives)
    ↓
Component Library (Atoms → Molecules → Organisms)
    ↓
Templates & Patterns
    ↓
Application Pages
```

---

## Phase 1: Design Tokens Foundation (Week 1)

### 1.1 Color System
**File:** `design-system/tokens/colors.ts`

Define semantic color tokens:

```typescript
// Base colors (primitives)
const primitives = {
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    // ... through 900
  },
  blue: { /* ... */ },
  red: { /* ... */ },
  green: { /* ... */ },
  amber: { /* ... */ },
}

// Semantic tokens (what they mean)
const semantic = {
  // Surfaces
  surface: {
    base: primitives.gray[50],        // Main background
    elevated: primitives.white,        // Cards, modals
    overlay: 'rgba(0, 0, 0, 0.8)',    // Modal backdrop
    inverse: primitives.gray[900],     // Dark surfaces
  },

  // Text
  text: {
    primary: primitives.gray[900],     // Main text
    secondary: primitives.gray[600],   // Supporting text
    tertiary: primitives.gray[400],    // Disabled text
    inverse: primitives.white,         // Text on dark bg
    link: primitives.blue[600],
    linkHover: primitives.blue[700],
  },

  // Borders
  border: {
    default: primitives.gray[200],
    hover: primitives.gray[300],
    focus: primitives.blue[500],
    error: primitives.red[500],
  },

  // Interactive states
  interactive: {
    primary: primitives.blue[600],
    primaryHover: primitives.blue[700],
    primaryActive: primitives.blue[800],
    primaryDisabled: primitives.gray[300],

    secondary: primitives.gray[100],
    secondaryHover: primitives.gray[200],

    destructive: primitives.red[600],
    destructiveHover: primitives.red[700],
  },

  // Feedback
  feedback: {
    success: primitives.green[600],
    successBg: primitives.green[50],
    warning: primitives.amber[600],
    warningBg: primitives.amber[50],
    error: primitives.red[600],
    errorBg: primitives.red[50],
    info: primitives.blue[600],
    infoBg: primitives.blue[50],
  }
}
```

**CSS Variables Generation:**
```typescript
// Auto-generate CSS variables from tokens
export function generateCSSVariables() {
  return Object.entries(semantic).map(([category, tokens]) => {
    // Creates: --ds-surface-base, --ds-text-primary, etc.
  })
}
```

### 1.2 Typography System
**File:** `design-system/tokens/typography.ts`

```typescript
const typography = {
  // Font families
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },

  // Type scale (using modular scale 1.25)
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    base: 1.5,
    relaxed: 1.75,
  },

  // Font weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.05em',
    wider: '0.1em',
  }
}

// Text styles (combinations)
const textStyles = {
  'display-lg': {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  'heading-1': {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
  },
  'body': {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.base,
  },
  'label': {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.base,
  },
  'caption': {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.base,
    color: 'var(--ds-text-secondary)',
  }
}
```

### 1.3 Spacing System
**File:** `design-system/tokens/spacing.ts`

```typescript
// 4px base unit
const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
}

// Semantic spacing
const semanticSpacing = {
  componentGap: spacing[4],        // Gap between related components
  sectionGap: spacing[8],          // Gap between sections
  layoutGap: spacing[12],          // Gap between major layout areas

  inputPadding: spacing[3],        // Input horizontal padding
  buttonPadding: spacing[4],       // Button horizontal padding
  cardPadding: spacing[6],         // Card internal padding
  modalPadding: spacing[6],        // Modal internal padding
}
```

### 1.4 Elevation & Shadows
**File:** `design-system/tokens/elevation.ts`

```typescript
const elevation = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
}

// Semantic elevation (which components use what)
const componentElevation = {
  dropdown: elevation.md,
  modal: elevation['2xl'],
  popover: elevation.lg,
  tooltip: elevation.sm,
  card: elevation.base,
}
```

### 1.5 Z-Index System
**File:** `design-system/tokens/z-index.ts`

```typescript
// CRITICAL: Fixes your current z-index chaos
const zIndex = {
  // Base layers (0-99)
  base: 0,
  dropdown: 50,
  sticky: 100,

  // UI layers (100-999)
  sidebar: 200,
  header: 300,
  overlay: 400,

  // Modal layers (1000-9999)
  modalBackdrop: 1000,
  modalContent: 1001,

  // Critical overlays (10000+)
  popover: 10000,
  tooltip: 10001,
  toast: 10002,
}

// Usage documentation
const zIndexUsage = {
  // Regular content: z-index: 0 (or no z-index)
  // Dropdowns: z-index: var(--ds-z-dropdown)
  // Modals: z-index: var(--ds-z-modal-content)
  // Never use arbitrary numbers!
}
```

### 1.6 Border Radius
**File:** `design-system/tokens/radius.ts`

```typescript
const radius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',   // Pills/circles
}
```

### 1.7 Animation & Transitions
**File:** `design-system/tokens/motion.ts`

```typescript
const motion = {
  // Durations
  duration: {
    instant: '0ms',
    fast: '150ms',
    base: '250ms',
    slow: '350ms',
    slower: '500ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Common transitions
  transition: {
    base: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color, background-color, border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  }
}
```

---

## Phase 2: Component Audit & Migration (Week 2)

### 2.1 Audit Current Components
**File:** `design-system/audit/component-inventory.md`

Document all existing shadcn components:
- Current state (working/broken/inconsistent)
- Dependencies
- Used in which pages
- Issues to fix

### 2.2 Create Component Standards
**File:** `design-system/standards/component-requirements.md`

Every component must have:
1. **TypeScript Props Interface** - Fully typed
2. **Variants** - Using `cva` (class-variance-authority)
3. **Sizes** - sm, base, lg (minimum)
4. **States** - default, hover, active, focus, disabled, loading, error
5. **Accessibility** - ARIA labels, keyboard navigation, focus management
6. **Documentation** - JSDoc comments
7. **Storybook Story** - Visual documentation
8. **Tests** - Unit tests for logic

### 2.3 Component Architecture
```
design-system/
├── primitives/          # Atoms (pure, no dependencies)
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.module.css (if needed)
│   │   └── index.ts
│   ├── Input/
│   ├── Label/
│   └── ...
│
├── components/          # Molecules (composed primitives)
│   ├── FormField/       # Label + Input + Error
│   ├── Select/
│   ├── Dialog/
│   └── ...
│
├── patterns/            # Organisms (complex compositions)
│   ├── DataTable/
│   ├── Form/
│   ├── Modal/
│   └── ...
│
└── layouts/             # Templates
    ├── DashboardLayout/
    ├── AuthLayout/
    └── ...
```

---

## Phase 3: Core Components Rebuild (Week 3-4)

### Priority 1: Fix Critical Components

#### 3.1 Dialog Component (Modal)
**File:** `design-system/components/Dialog/Dialog.tsx`

```typescript
import * as RadixDialog from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { tokens } from '@/design-system/tokens'

const dialogOverlayVariants = cva(
  'fixed inset-0 bg-[var(--ds-surface-overlay)] backdrop-blur-sm',
  {
    variants: {
      animation: {
        fade: 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      }
    },
    defaultVariants: {
      animation: 'fade',
    }
  }
)

const dialogContentVariants = cva(
  'fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-[var(--ds-surface-elevated)] rounded-[var(--ds-radius-lg)] shadow-[var(--ds-elevation-modal)] focus:outline-none',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
      }
    },
    defaultVariants: {
      size: 'md',
    }
  }
)

interface DialogProps extends VariantProps<typeof dialogContentVariants> {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ size, open, onOpenChange, children }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={dialogOverlayVariants()}
          style={{ zIndex: tokens.zIndex.modalBackdrop }}
        />
        <RadixDialog.Content
          className={dialogContentVariants({ size })}
          style={{ zIndex: tokens.zIndex.modalContent }}
        >
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

// Sub-components
Dialog.Header = function DialogHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-[var(--ds-spacing-6)] pt-[var(--ds-spacing-6)] pb-[var(--ds-spacing-4)] border-b border-[var(--ds-border-default)]">
      {children}
    </div>
  )
}

Dialog.Title = RadixDialog.Title
Dialog.Description = RadixDialog.Description
Dialog.Close = RadixDialog.Close

Dialog.Footer = function DialogFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-[var(--ds-spacing-3)] justify-end px-[var(--ds-spacing-6)] pb-[var(--ds-spacing-6)] pt-[var(--ds-spacing-4)] border-t border-[var(--ds-border-default)]">
      {children}
    </div>
  )
}
```

**Key Features:**
- Uses design tokens exclusively (no magic numbers)
- Proper z-index from token system
- Variants for sizing
- Composable sub-components
- Full TypeScript typing

#### 3.2 Button Component
**File:** `design-system/primitives/Button/Button.tsx`

```typescript
const buttonVariants = cva(
  // Base styles (using tokens)
  'inline-flex items-center justify-center rounded-[var(--ds-radius-base)] font-[var(--ds-font-weight-medium)] transition-[var(--ds-transition-colors)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focus)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--ds-interactive-primary)] text-[var(--ds-text-inverse)] hover:bg-[var(--ds-interactive-primary-hover)]',
        secondary: 'bg-[var(--ds-interactive-secondary)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-interactive-secondary-hover)]',
        destructive: 'bg-[var(--ds-interactive-destructive)] text-[var(--ds-text-inverse)] hover:bg-[var(--ds-interactive-destructive-hover)]',
        outline: 'border border-[var(--ds-border-default)] bg-transparent hover:bg-[var(--ds-interactive-secondary)]',
        ghost: 'hover:bg-[var(--ds-interactive-secondary)] hover:text-[var(--ds-text-primary)]',
      },
      size: {
        sm: 'h-8 px-[var(--ds-spacing-3)] text-[var(--ds-font-size-sm)]',
        md: 'h-10 px-[var(--ds-spacing-4)] text-[var(--ds-font-size-base)]',
        lg: 'h-12 px-[var(--ds-spacing-6)] text-[var(--ds-font-size-lg)]',
        icon: 'h-10 w-10',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    }
  }
)
```

#### 3.3 Input Component
**File:** `design-system/primitives/Input/Input.tsx`

Similar pattern - uses only design tokens, proper variants, full typing

---

## Phase 4: Documentation System (Week 5)

### 4.1 Storybook Setup
**File:** `.storybook/main.ts`

```typescript
const config: StorybookConfig = {
  stories: ['../design-system/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/nextjs',
}
```

### 4.2 Component Documentation Template
Each component gets:

```typescript
/**
 * Button component for triggering actions
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 *
 * @see https://simpleam.design-system.com/button
 */
```

### 4.3 Design System Website
**Structure:**
```
docs/
├── getting-started/
│   ├── installation.md
│   ├── tokens.md
│   └── principles.md
├── foundations/
│   ├── colors.md
│   ├── typography.md
│   ├── spacing.md
│   └── elevation.md
├── components/
│   ├── button.md
│   ├── input.md
│   ├── dialog.md
│   └── ...
└── patterns/
    ├── forms.md
    ├── data-tables.md
    └── modals.md
```

---

## Phase 5: Migration Strategy (Week 6-8)

### 5.1 Migration Process (Per Component)

1. **Create new component in design-system/**
2. **Add Storybook stories**
3. **Write tests**
4. **Update documentation**
5. **Create migration guide**
6. **Replace old component usage**
7. **Delete old component**
8. **Update tests**

### 5.2 Migration Priority Order

**Week 6:**
- [ ] Dialog/Modal (fixes your current issue)
- [ ] Button
- [ ] Input
- [ ] Label
- [ ] Select

**Week 7:**
- [ ] Form components
- [ ] Card
- [ ] Table
- [ ] Dropdown

**Week 8:**
- [ ] Navigation components
- [ ] Layout components
- [ ] Feedback components (Toast, Alert)

---

## Phase 6: Governance & Maintenance (Ongoing)

### 6.1 Design System Team
**Roles:**
- Design System Lead (owns system)
- Component Developer (builds components)
- Documentation Writer (maintains docs)
- QA Tester (ensures quality)

### 6.2 Contribution Guidelines
**File:** `design-system/CONTRIBUTING.md`

Rules for adding/changing components:
1. Must follow token system
2. Must have Storybook story
3. Must have tests
4. Must have documentation
5. Must pass accessibility audit
6. Must get design system team approval

### 6.3 Version Control
Use semantic versioning:
- Major: Breaking changes (v1.0.0 → v2.0.0)
- Minor: New components/features (v1.0.0 → v1.1.0)
- Patch: Bug fixes (v1.0.0 → v1.0.1)

### 6.4 Changelog
**File:** `design-system/CHANGELOG.md`

Document all changes:
```markdown
## [1.1.0] - 2025-01-15
### Added
- New DatePicker component
- Dialog size variants

### Fixed
- Button disabled state contrast
- Input focus ring color

### Changed
- Modal z-index from 9999 to token-based system
```

---

## Tools & Infrastructure

### Required Dependencies
```json
{
  "dependencies": {
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "@storybook/react": "latest",
    "@storybook/addon-a11y": "latest",
    "@testing-library/react": "latest",
    "chromatic": "latest"
  }
}
```

### Build Process
```bash
# Generate CSS from tokens
npm run tokens:build

# Build component library
npm run components:build

# Generate documentation
npm run docs:build

# Run visual regression tests
npm run chromatic
```

---

## Success Metrics

### Technical Metrics
- [ ] 100% of components use design tokens (no magic values)
- [ ] 100% component test coverage
- [ ] 100% Storybook coverage
- [ ] 0 z-index conflicts
- [ ] 0 color inconsistencies
- [ ] < 50ms component render time
- [ ] AAA accessibility score

### Developer Experience Metrics
- [ ] < 5 min to find component documentation
- [ ] < 10 min to implement new component
- [ ] < 2 hours to onboard new developer
- [ ] 90% developer satisfaction score

### Business Metrics
- [ ] 50% reduction in UI bugs
- [ ] 30% faster feature development
- [ ] 100% design-dev consistency
- [ ] 0 accessibility lawsuits

---

## Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1. Tokens | 1 week | Complete token system |
| 2. Audit | 1 week | Component inventory & standards |
| 3. Components | 2 weeks | Core components rebuilt |
| 4. Documentation | 1 week | Storybook + docs site |
| 5. Migration | 3 weeks | All components migrated |
| 6. Governance | Ongoing | Maintenance processes |

**Total:** 8 weeks to complete design system

---

## Next Steps

1. **Review this plan** - Adjust timeline/scope as needed
2. **Set up project structure** - Create design-system/ directory
3. **Start Phase 1** - Begin with color tokens
4. **Weekly checkpoints** - Review progress, adjust plan

This is a proper, enterprise-grade design system that will eliminate your current issues permanently and scale with your product.
