# How to Adjust Styling in the Design System

## Quick Answer: YES - All padding/spacing can be fixed by changing token values!

This design system is built on **shadcn/ui** (React components using Radix UI) + **design tokens** (centralized styling values).

---

## Architecture

```
shadcn/ui Components (base functionality)
         ↓
Design Tokens (centralized styling)
         ↓
Your App (consistent, beautiful UI)
```

**What we're doing:**
- ✅ Using shadcn/ui for solid, accessible React components
- ✅ Adding design tokens so ALL styling comes from one place
- ✅ Enhancing with more variants, states, and features

**What we're NOT doing:**
- ❌ Building components from scratch (shadcn already did that)
- ❌ Hardcoding styles (everything uses tokens)

---

## How to Fix Padding/Spacing Issues

### Option 1: Global Changes (Recommended)

**File:** `/design-system/tokens/spacing.ts`

```typescript
export const spacingTokens = {
  // Base spacing scale (affects everything)
  spacing: {
    xs: '4px',    // Currently 4px
    sm: '8px',    // Currently 8px  ← Change these!
    md: '12px',   // Currently 12px
    lg: '16px',   // Currently 16px
    xl: '24px',   // Currently 24px
    '2xl': '32px', // Currently 32px
    // ...
  },

  // Component-specific padding
  component: {
    inputPadding: '12px',      // ← All inputs
    buttonPadding: '16px 24px', // ← All buttons
    modalPadding: '24px',      // ← All modals
    cardPadding: '16px',       // ← All cards
  }
}
```

**To fix padding:**
1. Open `/design-system/tokens/spacing.ts`
2. Change the value (e.g., `inputPadding: '12px'` → `inputPadding: '16px'`)
3. Save
4. **EVERY input in your app updates automatically!**

### Option 2: Component-Specific Changes

**File:** `/components/ui/input.tsx`

Find this section (around line 211-240):

```typescript
const sizeConfig = {
  sm: {
    height: "32px",
    paddingY: tokens.spacing.spacing.xs,  // ← References token
    paddingX: tokens.spacing.spacing.sm,  // ← References token
  },
  md: {
    height: tokens.spacing.spacing['2xl'],
    paddingY: tokens.spacing.spacing.sm,
    paddingX: tokens.spacing.component.inputPadding, // ← Component token
  },
  lg: {
    height: "48px",
    paddingY: tokens.spacing.spacing.md,
    paddingX: tokens.spacing.spacing.lg,
  },
}
```

You can override individual size configs here if needed.

---

## Common Adjustments

### Input Fields Too Cramped?

**File:** `/design-system/tokens/spacing.ts`

```typescript
component: {
  inputPadding: '12px', // ← Change to '16px' or '20px'
}
```

### Buttons Too Small?

**File:** `/design-system/tokens/spacing.ts`

```typescript
component: {
  buttonPadding: '16px 24px', // ← Change to '20px 32px'
}
```

### Modals Too Tight?

**File:** `/design-system/tokens/spacing.ts`

```typescript
component: {
  modalPadding: '24px', // ← Change to '32px' or '40px'
}
```

### All Spacing Too Small?

**File:** `/design-system/tokens/spacing.ts`

```typescript
spacing: {
  xs: '4px',   // → '6px'
  sm: '8px',   // → '12px'
  md: '12px',  // → '16px'
  lg: '16px',  // → '24px'
  xl: '24px',  // → '32px'
  '2xl': '32px', // → '40px'
}
```

This multiplies the effect across your entire app!

---

## What shadcn Gives Us

**Free from shadcn/ui:**
- ✅ Accessible React components (ARIA labels, keyboard nav)
- ✅ Radix UI primitives (Dialog, Select, etc.)
- ✅ Battle-tested code
- ✅ Copy/paste into our codebase (we own it)

**What shadcn DOESN'T give us:**
- ❌ Design tokens (we added this)
- ❌ Size variants (sm/md/lg)
- ❌ Validation states (error/success/warning)
- ❌ Advanced features (loading, icons, character counter)
- ❌ Comprehensive documentation

---

## Phase 5: Why Are We "Rebuilding"?

We're **NOT** rebuilding from scratch. We're **enhancing** shadcn components:

### Before Phase 5 (shadcn):
```tsx
<Input placeholder="Email" />
```

### After Phase 5 (enhanced):
```tsx
<Input
  size="lg"                    // ← New: size variants
  variant="error"              // ← New: validation states
  leftIcon={<MailIcon />}      // ← New: icon support
  clearable                    // ← New: clear button
  maxLength={100}              // ← Enhanced
  showCharacterCount           // ← New: character counter
  placeholder="Email"
/>
```

Same shadcn foundation, way more features!

---

## Current Token Values

All defined in `/design-system/tokens/`:

- **colors.ts** - All colors (text, backgrounds, borders)
- **spacing.ts** - All padding, margins, gaps
- **typography.ts** - All font sizes, weights, line heights
- **radius.ts** - All border radius values
- **elevation.ts** - All shadows
- **z-index.ts** - All layering
- **motion.ts** - All animations/transitions

**Change a token = changes everywhere that uses it!**

---

## How to Test Changes

1. Edit token file (e.g., `/design-system/tokens/spacing.ts`)
2. Save
3. Refresh your app/Storybook
4. All components update automatically!

No need to touch 46 individual component files. That's the power of design tokens!

---

## Need Help?

**Padding looks wrong?** → Adjust `/design-system/tokens/spacing.ts`
**Colors look bad?** → Adjust `/design-system/tokens/colors.ts`
**Text too small?** → Adjust `/design-system/tokens/typography.ts`
**Shadows too heavy?** → Adjust `/design-system/tokens/elevation.ts`

Everything is centralized and easy to change!
