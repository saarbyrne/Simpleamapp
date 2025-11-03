# Design Tokens - Quick Reference

Quick lookup guide for the most commonly used design tokens.

## Colors

### Surface (Backgrounds)
```typescript
import { colors } from '@/design-system/tokens'

colors.surface.base              // Page background
colors.surface.elevated          // Cards, modals, dropdowns
colors.surface.sunken            // Input fields, wells
colors.surface.overlay           // Modal backdrops (80% black)
```

### Text
```typescript
colors.text.primary              // Main body text
colors.text.secondary            // Supporting text
colors.text.tertiary             // Less important text
colors.text.disabled             // Disabled state text
colors.text.inverse              // Text on dark backgrounds
colors.text.link                 // Links
colors.text.placeholder          // Input placeholder text
```

### Interactive (Buttons, Links)
```typescript
colors.interactive.primary       // Primary button
colors.interactive.primaryHover  // Primary button hover
colors.interactive.secondary     // Secondary button
colors.interactive.destructive   // Delete button
colors.interactive.ghost         // Ghost button
```

### Borders
```typescript
colors.border.default            // Standard borders
colors.border.focus              // Focus state borders
colors.border.subtle             // Light borders
```

### Feedback (Validation)
```typescript
colors.feedback.error            // Error states
colors.feedback.errorLight       // Error background
colors.feedback.success          // Success states
colors.feedback.warning          // Warning states
```

## Typography

### Font Sizes
```typescript
import { typography } from '@/design-system/tokens'

typography.fontSize.xs           // 10px - Tiny text
typography.fontSize.sm           // 12px - Small labels
typography.fontSize.base         // 14px - Secondary text
typography.fontSize.md           // 16px - Body text (default)
typography.fontSize.lg           // 18px - Emphasized text
typography.fontSize.xl           // 20px - Large text
typography.fontSize['2xl']       // 24px - H3
typography.fontSize['3xl']       // 30px - H2
typography.fontSize['4xl']       // 36px - H1
```

### Pre-composed Text Styles
```typescript
typography.heading.h1            // Page title
typography.heading.h2            // Section heading
typography.heading.h3            // Subsection heading
typography.body.md               // Default body text
typography.body.sm               // Small body text
typography.ui.button             // Button text
typography.ui.label              // Form label text
typography.ui.input              // Input text
```

## Spacing

### Base Scale
```typescript
import { spacingTokens } from '@/design-system/tokens'

spacingTokens.spacing.xs         // 6px
spacingTokens.spacing.sm         // 8px
spacingTokens.spacing.md         // 12px
spacingTokens.spacing.lg         // 16px - Default
spacingTokens.spacing.xl         // 20px
spacingTokens.spacing['2xl']     // 24px
spacingTokens.spacing['3xl']     // 32px
spacingTokens.spacing['4xl']     // 40px
```

### Semantic Spacing
```typescript
spacingTokens.component.cardPadding      // Card internal padding
spacingTokens.component.inputPadding     // Input padding
spacingTokens.component.modalPadding     // Modal padding
spacingTokens.gap.md                     // Grid/flex gap
spacingTokens.stack.normal               // Vertical spacing
```

## Z-Index

### Component Z-Index (MOST USED)
```typescript
import { zIndex } from '@/design-system/tokens'

zIndex.component.sidebar             // 200 - Sidebar
zIndex.component.sidebarInset        // 100 - Main content
zIndex.component.dialogOverlay       // 400 - Modal backdrop
zIndex.component.dialogContent       // 450 - Modal content
zIndex.component.selectContent       // 500 - Dropdowns
zIndex.component.popoverContent      // 550 - Popovers
zIndex.component.tooltipContent      // 560 - Tooltips
zIndex.component.toast               // 600 - Toasts
```

### Layer Z-Index (For Custom Components)
```typescript
zIndex.navigation.sidebar            // 200
zIndex.overlay.modalBackdrop         // 400
zIndex.modal.content                 // 450
zIndex.popup.dropdown                // 500
zIndex.notification.toast            // 600
```

## Elevation (Shadows)

### Basic Shadows
```typescript
import { elevation } from '@/design-system/tokens'

elevation.shadow.none            // No shadow
elevation.shadow.xs              // Subtle (hover states)
elevation.shadow.sm              // Small (cards)
elevation.shadow.md              // Medium (dropdowns)
elevation.shadow.lg              // Large (modals)
elevation.shadow.xl              // Extra large (drawers)
elevation.shadow['2xl']          // Maximum (critical modals)
```

### Component Shadows
```typescript
elevation.component.card         // Default card shadow
elevation.component.cardHover    // Card hover state
elevation.component.button       // Button shadow
elevation.component.modal        // Modal shadow
elevation.component.dropdown     // Dropdown shadow
elevation.component.tooltip      // Tooltip shadow
```

### Focus Rings
```typescript
elevation.coloredShadow.focus    // Blue focus ring
elevation.coloredShadow.error    // Red error ring
elevation.coloredShadow.success  // Green success ring
```

## Border Radius

### Base Scale
```typescript
import { borderRadius } from '@/design-system/tokens'

borderRadius.radius.none         // 0px - Sharp corners
borderRadius.radius.sm           // 2px - Minimal
borderRadius.radius.base         // 4px - Slight
borderRadius.radius.md           // 6px - Default
borderRadius.radius.lg           // 8px - Comfortable
borderRadius.radius.xl           // 12px - Pronounced
borderRadius.radius.full         // 9999px - Circles/pills
```

### Component Radius
```typescript
borderRadius.component.button    // Button corners
borderRadius.component.input     // Input field corners
borderRadius.component.card      // Card corners
borderRadius.component.modal     // Modal corners
borderRadius.component.badge     // Badge (full - pill)
borderRadius.component.avatar    // Avatar (full - circle)
```

## Motion (Animations)

### Durations
```typescript
import { motion } from '@/design-system/tokens'

motion.duration.fast             // 150ms - Hover states
motion.duration.normal           // 250ms - Default
motion.duration.moderate         // 350ms - Larger elements
motion.duration.slow             // 500ms - Modals
```

### Transitions
```typescript
motion.transition.colors         // Color changes
motion.transition.opacity        // Fade in/out
motion.transition.transform      // Movement
motion.transition.shadow         // Elevation changes
motion.transition.button         // Complete button transition
motion.transition.input          // Complete input transition
```

### Component Animations
```typescript
motion.component.button          // Button transitions
motion.component.modal.enter     // Modal entrance
motion.component.dropdown.enter  // Dropdown entrance
motion.component.toast.enter     // Toast slide in
```

## Common Patterns

### Button
```typescript
{
  backgroundColor: colors.interactive.primary,
  color: colors.text.inverse,
  padding: `${spacingTokens.spacing.sm} ${spacingTokens.spacing.lg}`,
  borderRadius: borderRadius.component.button,
  boxShadow: elevation.component.button,
  transition: motion.transition.button,
  fontSize: typography.ui.button.fontSize,
  fontWeight: typography.ui.button.fontWeight,
}
```

### Card
```typescript
{
  backgroundColor: colors.surface.elevated,
  padding: spacingTokens.component.cardPadding,
  borderRadius: borderRadius.component.card,
  boxShadow: elevation.component.card,
  border: `1px solid ${colors.border.subtle}`,
}
```

### Input
```typescript
{
  backgroundColor: colors.surface.sunken,
  color: colors.text.primary,
  padding: spacingTokens.component.inputPadding,
  borderRadius: borderRadius.component.input,
  border: `1px solid ${colors.border.default}`,
  transition: motion.transition.input,
  fontSize: typography.ui.input.fontSize,
}

// Focus state
{
  borderColor: colors.border.focus,
  boxShadow: elevation.coloredShadow.focus,
}
```

### Modal
```typescript
// Overlay
{
  position: 'fixed',
  inset: 0,
  backgroundColor: colors.surface.overlay,
  zIndex: zIndex.component.dialogOverlay,
  animation: motion.component.modal.backdrop,
}

// Content
{
  backgroundColor: colors.surface.elevated,
  padding: spacingTokens.component.modalPadding,
  borderRadius: borderRadius.component.modal,
  boxShadow: elevation.component.modal,
  zIndex: zIndex.component.dialogContent,
  animation: motion.component.modal.enter,
}
```

### Dropdown
```typescript
{
  backgroundColor: colors.surface.elevated,
  padding: spacingTokens.spacing.sm,
  borderRadius: borderRadius.component.dropdown,
  boxShadow: elevation.component.dropdown,
  border: `1px solid ${colors.border.subtle}`,
  zIndex: zIndex.component.selectContent,
}
```

## Import Patterns

### Import Everything
```typescript
import { tokens } from '@/design-system/tokens'

tokens.colors.surface.elevated
tokens.spacing.spacing.lg
tokens.zIndex.component.dialogContent
```

### Import Specific Systems
```typescript
import { colors, typography, spacingTokens, zIndex, elevation, borderRadius, motion } from '@/design-system/tokens'

colors.surface.elevated
typography.heading.h1
spacingTokens.spacing.lg
zIndex.component.dialogContent
elevation.shadow.md
borderRadius.radius.lg
motion.transition.button
```

### Import Individual Categories
```typescript
import { surface, text, border } from '@/design-system/tokens'

surface.elevated
text.primary
border.default
```

## Tips

1. **Always use semantic tokens** - `colors.surface.elevated` not `primitives.white`
2. **Component tokens first** - Use `zIndex.component.dialogContent` when available
3. **Match shadow to z-index** - Higher z-index = stronger shadow
4. **Respect reduced motion** - Use `motion.reducedMotion` for accessibility
5. **Nest radius** - Inner elements use one size smaller radius
6. **Use transitions for feedback** - Users need to see state changes
7. **Stack vertically with stack.normal** - Use semantic spacing

## Migration Quick Start

### Replace Color
```typescript
// Before
className="bg-white text-gray-900"

// After
style={{
  backgroundColor: colors.surface.elevated,
  color: colors.text.primary,
}}
```

### Replace Z-Index
```typescript
// Before
className="z-10"

// After
style={{ zIndex: zIndex.component.sidebar }}
```

### Replace Spacing
```typescript
// Before
className="p-6 gap-4"

// After
style={{
  padding: spacingTokens.spacing['2xl'],
  gap: spacingTokens.gap.md,
}}
```

---

**For complete documentation, see:** [design-system/tokens/README.md](./README.md)
