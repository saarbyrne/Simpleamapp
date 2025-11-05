# Icon System Guidelines

**Updated:** 2024-11-05
**Status:** Phase 4 - Week 8 Complete
**Icon Library:** Lucide React

## Overview

The design system uses a comprehensive icon system built on **Lucide React**, providing over 1,000+ consistent, well-crafted icons. Our Icon component wrapper applies design tokens for consistent sizing, spacing, colors, and accessibility.

---

## Quick Start

### Basic Usage

```typescript
import { Icon } from '@/components/ui/icon'
import { CheckIcon } from 'lucide-react'

// Simple icon
<Icon icon={CheckIcon} decorative />

// Icon with accessibility label
<Icon icon={InfoIcon} label="More information" />

// Colored icon with custom size
<Icon icon={AlertIcon} size="lg" color="error" label="Error occurred" />
```

### Helper Components

```typescript
import { IconButton, IconInline, IconNav, IconEmptyState } from '@/components/ui/icon'

// Button icon (with spacing)
<IconButton icon={SaveIcon} label="Save" />

// Inline with text
<IconInline icon={InfoIcon} />

// Navigation icon
<IconNav icon={HomeIcon} label="Home" />

// Empty state icon
<IconEmptyState icon={PackageIcon} label="No items" />
```

---

## Icon Sizes

We provide 6 standardized sizes that align with our typography scale:

| Size | Pixels | Use Case |
|------|--------|----------|
| `xs` | 12px | Inline with small text, badges |
| `sm` | 16px | Inline with body text, compact UIs |
| `md` | 20px | **Default** - Buttons, most UI elements |
| `lg` | 24px | Headings, emphasized actions |
| `xl` | 32px | Page headers, featured content |
| `2xl` | 48px | Empty states, hero sections |

**Examples:**

```typescript
<Icon icon={CheckIcon} size="xs" decorative />  // 12px
<Icon icon={CheckIcon} size="sm" decorative />  // 16px
<Icon icon={CheckIcon} size="md" decorative />  // 20px (default)
<Icon icon={CheckIcon} size="lg" decorative />  // 24px
<Icon icon={CheckIcon} size="xl" decorative />  // 32px
<Icon icon={CheckIcon} size="2xl" decorative /> // 48px
```

---

## Icon Colors

Icons can use semantic color tokens that automatically support dark mode:

| Color | Use Case |
|-------|----------|
| `inherit` | **Default** - Inherits from parent text color |
| `primary` | Brand/accent color, primary actions |
| `secondary` | Less emphasis, secondary information |
| `tertiary` | Least emphasis, metadata |
| `success` | Positive feedback, confirmations |
| `error` | Errors, destructive actions |
| `warning` | Warnings, cautions |
| `info` | Informational messages |
| `disabled` | Disabled state |
| `inverse` | On dark backgrounds |

**Examples:**

```typescript
<Icon icon={CheckIcon} color="success" label="Success" />
<Icon icon={AlertIcon} color="error" label="Error" />
<Icon icon={InfoIcon} color="info" label="Information" />
<Icon icon={UserIcon} color="primary" decorative />
```

**Best Practice:** Let icons inherit color from context when possible:

```typescript
// Good - icon matches text color automatically
<p className="text-red-600">
  <Icon icon={AlertIcon} decorative />
  Error message
</p>

// Also good - explicit color for clarity
<Icon icon={AlertIcon} color="error" label="Error" />
```

---

## Stroke Weights

Control icon line thickness for visual hierarchy:

| Weight | Stroke | Use Case |
|--------|--------|----------|
| `thin` | 1px | Decorative, low emphasis |
| `regular` | 1.5px | **Default** - Most icons |
| `medium` | 2px | Slightly bolder, buttons |
| `bold` | 2.5px | Strong emphasis, badges |

**Examples:**

```typescript
<Icon icon={CheckIcon} strokeWidth="thin" />
<Icon icon={CheckIcon} strokeWidth="regular" />  // default
<Icon icon={CheckIcon} strokeWidth="medium" />
<Icon icon={CheckIcon} strokeWidth="bold" />
```

---

## Accessibility

### Decorative vs. Semantic Icons

**Decorative Icons** - Purely visual, no meaning:
- Icons in buttons where text provides meaning
- Icons that duplicate adjacent text
- Pure decoration/visual balance

```typescript
// Decorative - button text is "Save"
<button>
  <Icon icon={CheckIcon} decorative />
  Save
</button>

// Decorative - icon duplicates text
<p>
  <Icon icon={InfoIcon} decorative />
  Information about this feature
</p>
```

**Semantic Icons** - Convey information:
- Icon-only buttons
- Icons that add meaning not provided by text
- Status indicators

```typescript
// Semantic - icon conveys "close" action
<button>
  <Icon icon={XIcon} label="Close dialog" />
</button>

// Semantic - icon shows notification state
<Icon icon={BellIcon} label="3 new notifications" />

// Semantic - status indicator
<Icon icon={AlertIcon} color="error" label="Error occurred" />
```

### WCAG Guidelines

1. **Decorative icons** must have `aria-hidden="true"`
2. **Semantic icons** must have descriptive `aria-label`
3. **Icon buttons** need clear labels (visual or aria-label)
4. **Color alone** should not convey meaning
5. **Minimum size** of 16px for touch targets

**Our Icon component handles this automatically:**

```typescript
// Decorative - sets aria-hidden="true"
<Icon icon={StarIcon} decorative />

// Semantic - sets role="img" and aria-label
<Icon icon={InfoIcon} label="More information" />
```

**Development Warning:**

The Icon component will warn you in development if you forget to provide a label for semantic icons:

```
Icon: Semantic icons should have a label for accessibility.
Either provide a `label` prop or set `decorative={true}`.
```

---

## Common Patterns

### Buttons with Icons

```typescript
// Icon + text (icon is decorative)
<button>
  <Icon icon={CheckIcon} size="sm" decorative className="mr-2" />
  Save Changes
</button>

// Icon-only button (icon is semantic)
<button>
  <Icon icon={XIcon} label="Close" />
</button>

// Helper component for buttons
<button>
  <IconButton icon={SaveIcon} label="Save" />
  Save Changes
</button>
```

### Input Fields

```typescript
// Leading icon
<div className="relative">
  <Icon
    icon={SearchIcon}
    decorative
    className="absolute left-3 top-1/2 -translate-y-1/2"
  />
  <input className="pl-10" placeholder="Search..." />
</div>

// Trailing icon
<div className="relative">
  <input className="pr-10" placeholder="Enter email" />
  <Icon
    icon={MailIcon}
    decorative
    className="absolute right-3 top-1/2 -translate-y-1/2"
  />
</div>
```

### Navigation

```typescript
// Navigation menu
<nav>
  <a href="/dashboard">
    <IconNav icon={HomeIcon} label="Dashboard" />
    Dashboard
  </a>
  <a href="/settings">
    <IconNav icon={SettingsIcon} label="Settings" />
    Settings
  </a>
</nav>

// Sidebar
<aside>
  {menuItems.map(item => (
    <div key={item.id}>
      <Icon icon={item.icon} size="md" decorative className="mr-3" />
      {item.label}
    </div>
  ))}
</aside>
```

### Alerts & Notifications

```typescript
// Success alert
<div className="flex gap-3 p-4 bg-green-50 border-green-200">
  <Icon icon={CheckIcon} color="success" label="Success" />
  <div>
    <p className="font-medium">Success!</p>
    <p>Your changes have been saved.</p>
  </div>
</div>

// Error alert
<div className="flex gap-3 p-4 bg-red-50 border-red-200">
  <Icon icon={AlertCircleIcon} color="error" label="Error" />
  <div>
    <p className="font-medium">Error</p>
    <p>Something went wrong.</p>
  </div>
</div>
```

### Empty States

```typescript
<div className="text-center p-12">
  <IconEmptyState icon={PackageIcon} label="No items" />
  <p className="mt-4 text-muted-foreground">
    No items found. Create your first item to get started.
  </p>
  <button className="mt-4">
    <Icon icon={PlusIcon} size="sm" decorative className="mr-2" />
    Create Item
  </button>
</div>
```

### Cards & Stats

```typescript
<div className="grid grid-cols-3 gap-4">
  <div className="p-4 rounded-lg border">
    <Icon icon={TrendingUpIcon} size="lg" color="success" decorative />
    <p className="text-2xl font-bold mt-2">$12,345</p>
    <p className="text-sm text-muted-foreground">Revenue</p>
  </div>
  <div className="p-4 rounded-lg border">
    <Icon icon={UserIcon} size="lg" color="primary" decorative />
    <p className="text-2xl font-bold mt-2">1,234</p>
    <p className="text-sm text-muted-foreground">Users</p>
  </div>
</div>
```

---

## Icon Library

We use **Lucide React** which provides:
- 1,000+ high-quality icons
- Consistent design language
- Regular updates
- TypeScript support
- Tree-shakeable imports

**Browse all icons:** [lucide.dev](https://lucide.dev)

### Most Commonly Used Icons

**Navigation & UI:**
- Home, Settings, User, Menu, Search, X (close)
- ChevronLeft, ChevronRight, ChevronUp, ChevronDown
- ArrowLeft, ArrowRight, ArrowUp, ArrowDown
- MoreVertical (⋮), MoreHorizontal (···)

**Actions:**
- Plus (add), Minus (remove), Edit, Trash (delete)
- Save, Download, Upload, Share, Copy
- Check (confirm), X (cancel)

**Communication:**
- Mail, MessageSquare, Phone, Bell (notifications)
- Send, Inbox, Archive

**Files & Media:**
- File, Folder, Image, Video, Music
- FileText, FilePlus, FileCheck

**Feedback & Status:**
- CheckCircle (success), AlertCircle (warning)
- Info, HelpCircle, AlertTriangle
- Loader (spinner)

**Business & Commerce:**
- ShoppingCart, CreditCard, DollarSign
- Package, TrendingUp, BarChart

---

## Do's and Don'ts

### ✅ DO

- Use consistent icon sizes within the same context
- Pair icons with text for clarity
- Use semantic colors (success, error, warning, info)
- Provide labels for semantic icons
- Let icons inherit color when appropriate
- Use helper components for common patterns

### ❌ DON'T

- Mix different icon libraries in the same interface
- Use arbitrary custom sizes (use design tokens)
- Use color alone to convey meaning
- Forget accessibility labels for semantic icons
- Make icons too small for touch targets (min 16px)
- Use decorative icons that confuse meaning

---

## Migration from Direct Lucide Imports

If you have existing code using Lucide directly:

**Before:**
```typescript
import { CheckIcon } from 'lucide-react'

<CheckIcon className="w-5 h-5 text-green-500" />
```

**After:**
```typescript
import { Icon } from '@/components/ui/icon'
import { CheckIcon } from 'lucide-react'

<Icon icon={CheckIcon} size="md" color="success" decorative />
```

**Benefits:**
- Consistent sizing across the app
- Automatic dark mode support
- Built-in accessibility
- Type-safe token usage

---

## Performance

### Tree Shaking

Lucide React is fully tree-shakeable. Only imported icons are included in your bundle:

```typescript
// Good - only CheckIcon is bundled
import { CheckIcon } from 'lucide-react'

// Bad - entire library is bundled
import * as Icons from 'lucide-react'
```

### Bundle Size

- Base Lucide package: ~1KB
- Each icon: ~0.5-1KB
- Icon wrapper component: ~2KB
- **Typical usage: ~5-10KB total**

---

## Design Tokens Reference

All icon tokens are available via:

```typescript
import { tokens } from '@/design-system/tokens'

tokens.icons.size.md         // '1.25rem' (20px)
tokens.icons.color.primary   // 'var(--ds-interactive-primary)'
tokens.icons.strokeWidth.regular  // 1.5
tokens.icons.spacing.sm      // '0.5rem'
```

**Use cases** provide pre-configured combinations:

```typescript
tokens.icons.useCase.button     // { size, spacing, strokeWidth }
tokens.icons.useCase.navigation // Optimized for nav menus
tokens.icons.useCase.emptyState // Large icons for empty states
```

---

## Browser Support

Lucide React and our Icon component support:
- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ iOS Safari (latest 2 versions)
- ✅ Android Chrome (latest 2 versions)

**Note:** SVG icons have excellent browser support (IE9+)

---

## Contributing

### Adding New Icons

If you need an icon that's not in Lucide:

1. Check if similar icon exists: [lucide.dev](https://lucide.dev)
2. Request icon from Lucide: [GitHub Issues](https://github.com/lucide-icons/lucide/issues)
3. For custom icons, contribute to our icon library

### Reporting Issues

- Icon rendering issues
- Accessibility problems
- Performance concerns
- Token inconsistencies

Report at: [GitHub Issues](https://github.com/saarbyrne/Simpleamapp/issues)

---

## Related Documentation

- **Design Tokens**: `design-system/tokens/README.md`
- **Accessibility**: `design-system/ACCESSIBILITY.md`
- **Component Guidelines**: `design-system/COMPONENT_GUIDELINES.md`
- **Dark Mode**: `design-system/migrations/12-dark-mode-implementation.md`

---

**Last Updated:** November 5, 2024
**Next Review:** December 2024
**Maintained By:** Design System Guild
