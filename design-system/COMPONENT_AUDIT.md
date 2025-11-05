# Component Audit - Phase 2

**Updated:** 20 May 2024  
**Status:** Phase 3 – Advanced navigation & visualization components migrated  
**Purpose:** Inventory all components and track token migration rollout

## Progress Snapshot

- ✅ Calendar, Chart, Carousel, Collapsible, Breadcrumb, Avatar, and Input OTP now consume the design token system with Storybook coverage.
- ✅ Stories in `components/ui/*` provide usage examples for every migrated component batch.
- ⚠️ Next focus: dark mode token inversion and range-state QA for Calendar.
- 📄 Reference migration note: `design-system/migrations/10-advanced-navigation-and-visualization.md`.

## Executive Summary

**Total Components:** 57 files
- **UI Components:** 47 (shadcn/ui based)
- **Feature Components:** 6 (players module)
- **Utility Components:** 4 (figma, error handling)

**Current State:**
- ✅ All components use Tailwind CSS classes
- ✅ CVA (class-variance-authority) for variant management
- ✅ Radix UI primitives for accessibility
- ⚠️ Using CSS variables (bg-card, text-foreground, etc.)
- ❌ No design token integration
- ❌ Hardcoded z-index values in some components
- ❌ Inconsistent color usage (mix of semantic and hardcoded)

## Component Inventory

### Critical Components (High Priority)

These components have known issues or are frequently used:

#### 1. Dialog (`components/ui/dialog.tsx`)
**Status:** 🔴 ISSUES - Modal z-index conflicts
**Lines:** ~100
**Styling Approach:** Radix Dialog + Tailwind classes
**Current Issues:**
- Was using `z-[9999]` and `z-[10000]` (now fixed to proper values)
- Used hardcoded `bg-white` (changed to `bg-popover`)
- Manual portal container management

**Hardcoded Values:**
- ~~`bg-white`~~ → Changed to `bg-popover`
- `z-[9999]`, `z-[10000]` → Should use token system
- Fixed positioning and transforms

**Migration Priority:** 🔴 CRITICAL - Needs token-based rebuild

#### 2. Select (`components/ui/select.tsx`)
**Status:** 🔴 ISSUES - Dropdown transparency
**Lines:** 190
**Styling Approach:** Radix Select + Tailwind classes
**Current Issues:**
- Dropdown had transparency issues (now fixed)
- Was using `bg-white` (changed to `bg-popover`)
- Z-index conflicts with modals

**Hardcoded Values:**
- ~~`bg-white`~~ → Changed to `bg-popover`
- ~~`z-50`~~ → Changed to `z-[50000]` (should use token)
- Hardcoded colors: `text-gray-900`, `border-gray-200`

**Migration Priority:** 🔴 HIGH - Frequently used, had issues

#### 3. Sidebar (`components/ui/sidebar.tsx`)
**Status:** 🟡 PARTIALLY FIXED - Z-index updated
**Lines:** ~400
**Styling Approach:** Complex layout component
**Current Issues:**
- Was using `z-10` (changed to `z-[40]`)
- Created stacking context conflicts
- SidebarInset needed `z-[100]`

**Hardcoded Values:**
- ~~`z-10`~~ → Changed to `z-[40]` (should use `zIndex.component.sidebar`)
- SidebarInset uses `z-[100]` (should use token)
- Many hardcoded spacing values

**Migration Priority:** 🟡 MEDIUM - Partially fixed, needs token migration

#### 4. Button (`components/ui/button.tsx`)
**Status:** 🟢 STABLE - Well structured
**Lines:** 58
**Styling Approach:** CVA variants + Radix Slot
**Current Approach:**
- Uses CVA for variant management (good pattern)
- Semantic CSS variables (`bg-primary`, `text-primary-foreground`)
- Multiple size variants
- Accessibility features (focus-visible, aria-invalid)

**Hardcoded Values:**
- Hardcoded sizing: `h-9`, `h-8`, `h-10`
- Hardcoded spacing: `px-4`, `py-2`, `px-3`
- Hardcoded radius: `rounded-md`
- Focus ring: `ring-[3px]`

**Migration Priority:** 🟡 MEDIUM - Good structure, straightforward migration

#### 5. Input (`components/ui/input.tsx`)
**Status:** 🟡 NEEDS REVIEW
**Lines:** ~50
**Styling Approach:** Tailwind classes
**Current Issues:**
- Multiple hardcoded values
- Text color issues in modals (was fixed with `text-gray-900`)

**Hardcoded Values:**
- Colors: `bg-white`, `text-gray-900`, `border-gray-300`
- Sizing: `h-9`, `px-3`, `py-1`
- Radius: `rounded-md`
- Focus ring styling

**Migration Priority:** 🔴 HIGH - Forms are critical, had readability issues

#### 6. Label (`components/ui/label.tsx`)
**Status:** 🟡 NEEDS REVIEW
**Lines:** ~30
**Styling Approach:** Radix Label + Tailwind
**Current Issues:**
- Text visibility issues in modals (fixed with `text-gray-900`)

**Hardcoded Values:**
- Font size: `text-sm`
- Color: `text-gray-900` (was added to fix visibility)
- Spacing: `gap-2`

**Migration Priority:** 🟡 MEDIUM - Simple component, quick win

### Standard UI Components (Medium Priority)

#### 7. Card (`components/ui/card.tsx`)
**Status:** 🟢 STABLE
**Lines:** 93
**Styling Approach:** Semantic CSS variables
**Current Approach:**
- Uses `bg-card`, `text-card-foreground` (good)
- Radius: `rounded-xl`
- Flexible sub-components (Header, Content, Footer, etc.)

**Hardcoded Values:**
- Spacing: `gap-6`, `px-6`, `pt-6`, `pb-6`
- Radius: `rounded-xl`

**Migration Priority:** 🟢 LOW - Well structured, low urgency

#### 8. Badge (`components/ui/badge.tsx`)
**Status:** 🟢 STABLE
**Lines:** 47
**Styling Approach:** CVA variants
**Current Approach:**
- Good variant system
- Uses semantic colors
- Proper accessibility

**Hardcoded Values:**
- Sizing: `px-2`, `py-0.5`, `text-xs`
- Radius: `rounded-md`
- Focus ring: `ring-[3px]`

**Migration Priority:** 🟢 LOW - Well structured

#### 9-47. Other shadcn/ui Components
Full list available in `components/ui/`:
- Accordion, Alert, AlertDialog, AspectRatio, Avatar
- Breadcrumb, Calendar, Carousel, Chart, Checkbox
- Collapsible, Command, ContextMenu, Drawer, DropdownMenu
- Form, HoverCard, InputOTP, Menubar, NavigationMenu
- Pagination, Popover, Progress, RadioGroup, Resizable
- ScrollArea, Separator, Sheet, Skeleton, Slider
- Sonner (Toast), Switch, Table, Tabs, Textarea
- Toggle, ToggleGroup, Tooltip

**Status:** 🟢 MOSTLY STABLE
**Migration Priority:** 🟢 LOW - Migrate after core components

### Feature Components (Custom)

#### Players Module Components

##### 1. AddPlayerModal (`components/players/add-player-modal.tsx`)
**Status:** 🔴 CRITICAL ISSUES
**Lines:** 372
**Current Issues:**
- This was the component with all the modal problems
- Multiple rewrites attempted
- Uses Dialog component (which has issues)

**Dependencies:**
- Dialog (has z-index issues)
- Input (had text visibility issues)
- Label (had text visibility issues)
- Select (had dropdown issues)
- Button (stable)

**Migration Priority:** 🔴 CRITICAL - Once Dialog is rebuilt

##### 2. AddPlayerDialog (`components/players/add-player-dialog.tsx`)
**Status:** 🟡 UNKNOWN - Duplicate?
**Note:** Seems to be a duplicate of AddPlayerModal
**Migration Priority:** 🟡 NEEDS INVESTIGATION

##### 3. PlayersTableClient (`components/players/players-table-client.tsx`)
**Status:** 🟢 LIKELY STABLE
**Migration Priority:** 🟢 LOW - Complex but not broken

##### 4. PlayerProfile (`components/players/player-profile.tsx`)
**Status:** 🟢 LIKELY STABLE
**Migration Priority:** 🟢 LOW

##### 5. ImportPlayersCSV (`components/players/import-players-csv.tsx`)
**Status:** 🟢 LIKELY STABLE
**Migration Priority:** 🟢 LOW

##### 6. PlayersTableWrapper (`components/players/players-table-wrapper.tsx`)
**Status:** 🟢 LIKELY STABLE
**Migration Priority:** 🟢 LOW

## Styling Patterns Analysis

### Current Patterns

#### 1. CSS Variable Pattern (Most Common)
```typescript
className="bg-primary text-primary-foreground"
```
**Pros:** Semantic, themeable
**Cons:** Inconsistent with token system, no type safety

#### 2. Hardcoded Tailwind Pattern
```typescript
className="bg-white text-gray-900 border-gray-300"
```
**Pros:** Explicit, predictable
**Cons:** Not themeable, causes issues (transparency in modals)

#### 3. CVA Variant Pattern (Best Structured)
```typescript
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: { ... },
      size: { ... }
    }
  }
)
```
**Pros:** Type-safe, composable, well-organized
**Cons:** Still uses Tailwind classes underneath

### Identified Issues

#### 1. Z-Index Issues ✅ PARTIALLY FIXED
**Problem:** Random z-index values causing stacking conflicts
**Examples:**
- Sidebar: `z-10` → Changed to `z-[40]`
- Dialog: `z-9999`, `z-10000` → Needs token system
- Select: `z-50` → Changed to `z-[50000]`

**Solution:** Use token system z-index values

#### 2. Color Inconsistency ✅ PARTIALLY FIXED
**Problem:** Mix of `bg-white`, `bg-popover`, semantic variables
**Examples:**
- Dialog: Was `bg-white` → Changed to `bg-popover`
- Select: Was `bg-white` → Changed to `bg-popover`
- Input: Still uses `bg-white`, `text-gray-900`

**Solution:** Standardize on token system colors

#### 3. Spacing Inconsistency
**Problem:** Random spacing values throughout
**Examples:**
- `px-6`, `py-2`, `gap-4`, `p-4`, etc.
- No systematic approach

**Solution:** Use token spacing scale

#### 4. No Type Safety
**Problem:** Tailwind classes are strings, no compile-time checks
**Solution:** Token system provides TypeScript types

## Migration Strategy

### Phase 1: Foundation (COMPLETE) ✅
- [x] Create design token system
- [x] Document all tokens
- [x] Prepare migration guides

### Phase 2: Audit (CURRENT) 🔄
- [x] Inventory all components
- [ ] Document styling approaches
- [ ] Identify all hardcoded values
- [ ] Create priority list
- [ ] Define component standards

### Phase 3: Core Component Rebuild (NEXT)

#### Priority 1: Critical Path (Week 3)
These components block other work or have known issues:

1. **Dialog** 🔴 CRITICAL
   - Rebuild using token z-index system
   - Fix stacking context issues permanently
   - Use token colors, spacing, shadows
   - **Estimated:** 4-6 hours

2. **Input** 🔴 HIGH
   - Fix text visibility issues with tokens
   - Standardize sizing with token spacing
   - Use token colors for all states
   - **Estimated:** 2-3 hours

3. **Label** 🔴 HIGH
   - Simple but affects all forms
   - Use token typography and colors
   - **Estimated:** 1 hour

4. **Select** 🔴 HIGH
   - Fix dropdown z-index with tokens
   - Standardize colors and spacing
   - **Estimated:** 3-4 hours

5. **Button** 🟡 MEDIUM
   - Well structured, straightforward migration
   - Convert CVA variants to use tokens
   - **Estimated:** 2-3 hours

#### Priority 2: Layout & Structure (Week 4)

6. **Sidebar** 🟡 MEDIUM
   - Already partially fixed
   - Complete token migration
   - **Estimated:** 4-5 hours

7. **Card** 🟢 LOW
   - Well structured
   - Straightforward migration
   - **Estimated:** 2 hours

8. **Badge** 🟢 LOW
   - Small, simple component
   - Quick win
   - **Estimated:** 1 hour

#### Priority 3: Remaining shadcn Components (Weeks 5-6)
- 39 remaining components
- Most are well-structured
- Systematic migration approach
- **Estimated:** 20-30 hours total

#### Priority 4: Feature Components (Week 7)

9. **AddPlayerModal** 🔴 CRITICAL
   - Depends on Dialog, Input, Label, Select
   - Migrate after dependencies are complete
   - **Estimated:** 3-4 hours

10. **Other Players Components** 🟢 LOW
    - Migrate after AddPlayerModal
    - **Estimated:** 8-10 hours total

## Component Standards

### Standard Component Structure

Every rebuilt component should follow this pattern:

```typescript
/**
 * Component Name
 * Description of what it does
 *
 * @example
 * <Component variant="default" size="md">Content</Component>
 */

import { tokens } from '@/design-system/tokens'
import { cva, type VariantProps } from 'class-variance-authority'

// Define variants using tokens
const componentVariants = cva(
  // Base styles using tokens
  "",
  {
    variants: {
      variant: {
        default: "", // Use tokens here
        secondary: "",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// Component definition with types
export function Component({
  variant,
  size,
  className,
  ...props
}: ComponentProps) {
  return (
    <element
      className={cn(componentVariants({ variant, size }), className)}
      style={{
        // Use tokens for values that can't be expressed in Tailwind
        zIndex: tokens.zIndex.component.xyz,
        boxShadow: tokens.elevation.component.xyz,
      }}
      {...props}
    />
  )
}

// Export types
export type { ComponentProps }
export { componentVariants }
```

### Token Usage Rules

1. **Colors:** Always use semantic tokens
   - ✅ `colors.surface.elevated`
   - ❌ `primitives.white`

2. **Spacing:** Use semantic or base scale
   - ✅ `spacing.component.cardPadding`
   - ✅ `spacing.spacing.lg`
   - ❌ `24px` or `1.5rem`

3. **Z-Index:** Always use component-specific tokens
   - ✅ `zIndex.component.dialogContent`
   - ❌ Arbitrary numbers like `9999`

4. **Shadows:** Use component-specific tokens
   - ✅ `elevation.component.modal`
   - ❌ Hardcoded box-shadow values

5. **Border Radius:** Use component or base tokens
   - ✅ `borderRadius.component.button`
   - ✅ `borderRadius.radius.md`
   - ❌ `rounded-md` without token backing

6. **Motion:** Use component or transition tokens
   - ✅ `motion.component.button.transition`
   - ✅ `motion.transition.colors`
   - ❌ Hardcoded transition strings

### CVA + Token Integration

We'll keep CVA for variant management but use tokens for values:

```typescript
const buttonVariants = cva(
  // Base using Tailwind + inline styles for tokens
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        // Use Tailwind for what works, inline styles for tokens
        primary: "", // bg handled by inline style
        secondary: "",
      },
    },
  }
)

// Apply token values via inline styles
<Button
  style={{
    backgroundColor: tokens.interactive.primary,
    padding: `${tokens.spacing.spacing.sm} ${tokens.spacing.spacing.lg}`,
  }}
/>
```

### Hybrid Approach: Tailwind + Tokens

**Strategy:**
- Use Tailwind for layout, flexbox, grid (works well)
- Use tokens via inline styles for design decisions (colors, spacing, shadows)
- Integrate tokens into tailwind.config.ts for best of both worlds

## Success Metrics

### Component Quality Checklist

Each migrated component must have:

- [ ] Uses tokens for all colors
- [ ] Uses tokens for all spacing
- [ ] Uses tokens for z-index (if applicable)
- [ ] Uses tokens for shadows
- [ ] Uses tokens for border radius
- [ ] Uses tokens for animations/transitions
- [ ] Full TypeScript types
- [ ] CVA variants (if applicable)
- [ ] Accessibility features preserved
- [ ] Documentation/examples
- [ ] Tested in light mode (dark mode later)

### Phase 2 Completion Criteria

- [x] All components inventoried
- [ ] Styling approaches documented
- [ ] Hardcoded values identified
- [ ] Migration priority list created
- [ ] Component standards defined
- [ ] Example migration completed

### Next Steps

1. ✅ **Component Inventory** - COMPLETE
2. 🔄 **Styling Analysis** - IN PROGRESS
3. ⏳ **Create Priority List** - TODO
4. ⏳ **Define Standards** - IN PROGRESS (this document)
5. ⏳ **Example Migration** - TODO (pick one simple component as proof of concept)

## Recommendations

### Immediate Actions

1. **Complete Phase 2 Audit** (This Week)
   - Finish documenting all components
   - Create detailed priority list
   - Define migration templates

2. **Proof of Concept** (This Week)
   - Migrate Badge component as example
   - Document the process
   - Create migration template

3. **Start Phase 3** (Next Week)
   - Begin with Dialog (most critical)
   - Then Input, Label, Select
   - Finally Button

### Long-term Strategy

1. **Tailwind Integration**
   - Add tokens to `tailwind.config.ts`
   - Create custom utility classes
   - Enable token usage in className strings

2. **Storybook Setup**
   - Document each migrated component
   - Show all variants
   - Provide usage examples

3. **Testing Strategy**
   - Visual regression tests
   - Accessibility tests
   - Cross-browser testing

## Conclusion

We have 57 components total, with 5-8 critical components that need immediate attention. The token system is ready, and we have a clear migration path.

**Estimated Timeline:**
- Phase 2 Completion: 2-3 days
- Phase 3 Core Components: 2 weeks
- Phase 3 Remaining Components: 3-4 weeks
- Phase 4 Feature Components: 1 week

**Total: 6-8 weeks for complete migration**

---

**Status:** Phase 2 - In Progress
**Next:** Create detailed priority list and example migration
