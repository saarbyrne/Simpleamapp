# Design System Tokens

**Version:** 1.0.0
**Status:** Foundation Complete
**Last Updated:** January 2025

## Overview

This directory contains the foundational design tokens for the SimpleAM design system. Design tokens are the single source of truth for all design decisions in the application, providing consistency, maintainability, and scalability.

## Philosophy

Our token system follows these principles:

1. **Two-Tier Architecture**: Primitive values + Semantic meaning
2. **Type Safety**: Full TypeScript support with autocomplete
3. **CSS Variable Generation**: Automatic conversion to CSS custom properties
4. **Semantic Naming**: Tokens describe purpose, not appearance
5. **Scalability**: Easy to extend and maintain
6. **Documentation**: Self-documenting with inline comments

## Token Categories

### 1. Colors (`colors.ts`)

**Purpose:** Complete color system with primitive palette and semantic tokens

**Structure:**
- **Primitives**: Base color values (gray, blue, red, green, amber scales)
- **Semantic Tokens**: Purpose-driven colors (surface, text, border, interactive, feedback)
- **Dark Mode**: Future dark theme support

**Key Features:**
- 11-step color scales for each hue
- Accessibility-focused contrast ratios
- Clear semantic meaning (what colors represent)
- Support for both light and dark modes

**Usage Example:**
```typescript
import { colors } from '@/design-system/tokens'

// Use semantic tokens
const backgroundColor = colors.surface.elevated // '#ffffff'
const textColor = colors.text.primary // '#18181b'
const borderColor = colors.border.default // '#d4d4d8'
```

### 2. Typography (`typography.ts`)

**Purpose:** Complete type system for consistent text rendering

**Structure:**
- **Font Families**: Sans, mono, display
- **Font Sizes**: Modular scale (1.25 ratio) from 10px to 72px
- **Line Heights**: Optimized for readability
- **Font Weights**: Light to bold
- **Text Styles**: Complete compositions (display, heading, body, ui, code)

**Key Features:**
- Modular scale for mathematical harmony
- Pre-composed text styles for common use cases
- Separate scales for different content types
- Responsive typography support

**Usage Example:**
```typescript
import { typography } from '@/design-system/tokens'

// Use complete text styles
const headingStyle = typography.heading.h1
// { fontSize: '1.875rem', lineHeight: '1.4', fontWeight: '600', letterSpacing: '-0.01em' }

// Or use individual tokens
const fontSize = typography.fontSize.lg // '1.125rem'
```

### 3. Spacing (`spacing.ts`)

**Purpose:** Consistent spatial system based on 8px grid

**Structure:**
- **Base Scale**: 0px to 128px in 8px increments
- **Semantic Spacing**: Component, layout, stack, inline, gap, inset
- **Special Patterns**: Squish and stretch spacing

**Key Features:**
- 8px base unit for visual rhythm
- T-shirt sizing for intuitive naming
- Purpose-driven semantic tokens
- Support for asymmetric spacing

**Usage Example:**
```typescript
import { spacingTokens } from '@/design-system/tokens'

// Use semantic spacing
const padding = spacingTokens.component.cardPadding // '1.25rem'
const gap = spacingTokens.gap.md // '1rem'

// Or use base scale
const margin = spacingTokens.spacing.xl // '1.25rem'
```

### 4. Z-Index (`z-index.ts`)

**Purpose:** Structured layering system to prevent stacking conflicts

**Structure:**
- **Base Layer**: 0-99 (default flow, elevated content)
- **Content Layer**: 100-199 (sticky elements, dropdowns in content)
- **Navigation Layer**: 200-299 (sidebar, header)
- **Overlay Layer**: 300-399 (sheets, drawers, modal backdrops)
- **Modal Layer**: 400-499 (dialog content)
- **Popup Layer**: 500-599 (dropdowns, popovers, tooltips)
- **Notification Layer**: 600-699 (toasts, alerts)
- **Maximum Layer**: 700+ (critical overlays)

**Key Features:**
- Solves modal/dialog stacking issues
- Component-specific assignments
- Clear visual hierarchy
- 100-step increments for separation

**Usage Example:**
```typescript
import { zIndex } from '@/design-system/tokens'

// Use component-specific z-index
const modalZIndex = zIndex.component.dialogContent // 450
const dropdownZIndex = zIndex.component.selectContent // 500

// Or use layer z-index
const sidebarZIndex = zIndex.navigation.sidebar // 200
```

**CRITICAL:** This token system **solves the root cause** of our modal visibility issues. Always use these values instead of arbitrary z-index numbers.

### 5. Elevation (`elevation.ts`)

**Purpose:** Shadow system for creating depth and hierarchy

**Structure:**
- **Shadow Scale**: none, xs, sm, md, lg, xl, 2xl
- **Inner Shadows**: Inset effects
- **Colored Shadows**: Focus rings and validation states
- **Component Shadows**: Pre-assigned values
- **Interaction Shadows**: State-specific shadows
- **Layered Shadows**: Multi-layer realistic depth

**Key Features:**
- Multiple shadow layers for realism
- Matches z-index hierarchy (higher z = stronger shadow)
- Accessibility-focused (focus rings)
- Performance-optimized

**Usage Example:**
```typescript
import { elevation } from '@/design-system/tokens'

// Use component shadows
const cardShadow = elevation.component.card // '0 1px 3px 0 rgb(0 0 0 / 0.1), ...'
const modalShadow = elevation.component.modal // '0 25px 50px -12px rgb(0 0 0 / 0.25)'

// Use interaction shadows
const hoverShadow = elevation.interaction.hover
```

### 6. Border Radius (`radius.ts`)

**Purpose:** Consistent corner rounding across components

**Structure:**
- **Base Scale**: 0px to 24px + full rounding
- **Component Radius**: Pre-assigned values
- **Special Patterns**: Top-only, bottom-only, pill, circle

**Key Features:**
- Incremental scale for precise control
- Component-specific assignments
- Support for asymmetric rounding
- Nesting guidelines (inner elements slightly less rounded)

**Usage Example:**
```typescript
import { borderRadius } from '@/design-system/tokens'

// Use component radius
const buttonRadius = borderRadius.component.button // '0.5rem'
const cardRadius = borderRadius.component.card // '0.75rem'

// Use special patterns
const pillRadius = borderRadius.special.pill // '9999px'
```

### 7. Motion (`motion.ts`)

**Purpose:** Consistent animation and transition timing

**Structure:**
- **Duration**: 0ms to 1000ms scale
- **Easing**: Natural motion curves
- **Transitions**: Pre-composed transition strings
- **Animations**: Keyframe-based animations
- **Reduced Motion**: Accessibility support

**Key Features:**
- Natural easing functions (Material Design)
- Component-specific animations
- Performance-optimized (transform + opacity)
- Respects prefers-reduced-motion

**Usage Example:**
```typescript
import { motion } from '@/design-system/tokens'

// Use component motion
const buttonTransition = motion.component.button.transition
const modalAnimation = motion.component.modal.enter

// Use basic transitions
const fadeTransition = motion.transition.fade // 'opacity 250ms cubic-bezier(0, 0, 0.2, 1)'
```

## Token Usage

### Importing Tokens

```typescript
// Import all tokens
import { tokens } from '@/design-system/tokens'

// Import specific token systems
import { colors } from '@/design-system/tokens'
import { typography } from '@/design-system/tokens'
import { spacingTokens } from '@/design-system/tokens'
```

### Using Tokens in Components

```typescript
import { tokens } from '@/design-system/tokens'

export function MyComponent() {
  return (
    <div
      style={{
        backgroundColor: tokens.surface.elevated,
        color: tokens.text.primary,
        padding: tokens.spacing.spacing.lg,
        borderRadius: tokens.radius.radius.md,
        boxShadow: tokens.elevation.shadow.sm,
      }}
    >
      Content
    </div>
  )
}
```

### Using with Tailwind CSS

Tokens can be integrated into `tailwind.config.ts` to create custom utility classes:

```typescript
import { tokens } from './design-system/tokens'

export default {
  theme: {
    extend: {
      colors: {
        'surface-base': tokens.surface.base,
        'text-primary': tokens.text.primary,
        // ... more colors
      },
      spacing: tokens.spacing.spacing,
      boxShadow: tokens.elevation.shadow,
      borderRadius: tokens.radius.radius,
    },
  },
}
```

### Generating CSS Variables

```typescript
import { generateAllCSSVariables, cssString } from '@/design-system/tokens'

// Get all CSS variables as object
const cssVars = generateAllCSSVariables()

// Get CSS string for injection
const css = cssString
// :root {
//   --ds-surface-base: #fafafa;
//   --ds-text-primary: #18181b;
//   ...
// }
```

## Migration Guide

### Step 1: Replace Hardcoded Colors

**Before:**
```typescript
<div className="bg-white text-gray-900 border-gray-300">
```

**After:**
```typescript
import { colors } from '@/design-system/tokens'

<div style={{
  backgroundColor: colors.surface.elevated,
  color: colors.text.primary,
  borderColor: colors.border.default,
}}>
```

### Step 2: Replace Arbitrary Z-Index

**Before:**
```typescript
<div className="z-10">
<div className="z-9999">
```

**After:**
```typescript
import { zIndex } from '@/design-system/tokens'

<div style={{ zIndex: zIndex.component.sidebar }}>
<div style={{ zIndex: zIndex.component.dialogContent }}>
```

### Step 3: Replace Hardcoded Spacing

**Before:**
```typescript
<div className="p-6 gap-4">
```

**After:**
```typescript
import { spacingTokens } from '@/design-system/tokens'

<div style={{
  padding: spacingTokens.spacing['2xl'],
  gap: spacingTokens.gap.md,
}}>
```

## Best Practices

### DO ✅

1. **Always use semantic tokens** - Use `colors.surface.elevated` not `primitives.white`
2. **Import from token system** - Never hardcode values in components
3. **Use component-specific tokens** - Use `zIndex.component.dialogContent` when available
4. **Follow naming conventions** - Tokens describe purpose, not appearance
5. **Respect accessibility** - Use `motion.reducedMotion` for animations
6. **Document token usage** - Add comments explaining why specific tokens are used

### DON'T ❌

1. **Don't use primitive tokens directly** - They're building blocks, not for direct use
2. **Don't create arbitrary values** - If you need a new value, add it to the token system
3. **Don't mix token systems** - Stick to our tokens, don't mix with Tailwind's default values
4. **Don't ignore z-index hierarchy** - Always respect the layering system
5. **Don't hardcode animations** - Use motion tokens for consistency
6. **Don't skip reduced motion** - Always support accessibility preferences

## Token Naming Conventions

### Format

```
{category}.{subcategory}.{name}[.variant]
```

### Examples

- `colors.surface.elevated` - Color token for elevated surfaces
- `typography.heading.h1` - Text style for H1 headings
- `spacing.component.cardPadding` - Spacing for card padding
- `zIndex.component.dialogContent` - Z-index for dialog content
- `elevation.component.modal` - Shadow for modal components
- `borderRadius.component.button` - Radius for buttons
- `motion.component.button.transition` - Transition for buttons

### Semantic Over Descriptive

**Good:**
- `colors.surface.elevated` (describes purpose)
- `spacing.component.cardPadding` (describes use)
- `zIndex.navigation.sidebar` (describes layer)

**Bad:**
- `colors.white` (describes appearance)
- `spacing.24px` (describes value)
- `zIndex.200` (describes number)

## File Structure

```
design-system/
└── tokens/
    ├── colors.ts           # Color system
    ├── typography.ts       # Type system
    ├── spacing.ts          # Spacing system
    ├── z-index.ts          # Z-index hierarchy
    ├── elevation.ts        # Shadow system
    ├── radius.ts           # Border radius system
    ├── motion.ts           # Animation/transition system
    ├── index.ts            # Main export & CSS generation
    └── README.md           # This file
```

## Next Steps

### Phase 2: Component Audit (Week 2)

1. Inventory all existing components
2. Document current styling approaches
3. Identify components using hardcoded values
4. Create migration priority list
5. Document component standards

### Phase 3: Core Component Rebuild (Weeks 3-4)

1. Rebuild Dialog component using tokens
2. Rebuild Button component using tokens
3. Rebuild Input component using tokens
4. Rebuild Select component using tokens
5. Rebuild Card component using tokens

### Phase 4: Documentation (Week 5)

1. Set up Storybook
2. Create component documentation
3. Build design system website
4. Write usage guidelines
5. Create example patterns

### Phase 5: Migration (Weeks 6-8)

1. Migrate existing components to token system
2. Replace hardcoded values throughout app
3. Update all component imports
4. Test thoroughly
5. Remove old styling patterns

## Support & Feedback

This is the foundation of our design system. As we build and migrate components, we'll discover gaps and opportunities for improvement.

**Questions or suggestions?**
- Review the inline documentation in token files
- Check the design system plan: [documents/DESIGN_SYSTEM_PLAN.md](../../documents/DESIGN_SYSTEM_PLAN.md)
- Propose new tokens via pull request

## Version History

### 1.0.0 (January 2025)
- Initial token system foundation
- All 7 token categories complete
- CSS variable generation
- TypeScript types and utilities
- Comprehensive documentation

---

**Remember:** Tokens are the single source of truth. When in doubt, add to the token system rather than creating one-off values in components.
