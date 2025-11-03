# Component Migration Priority List

**Phase:** 3 - Core Component Rebuild
**Goal:** Migrate components from Tailwind classes to design token system
**Timeline:** 6-8 weeks total

## Priority Matrix

Components prioritized by:
1. **Impact** - How critical is this component?
2. **Issues** - Does it have known problems?
3. **Usage** - How frequently is it used?
4. **Dependencies** - Do other components depend on it?

## Week 1: Critical Foundation (22-28 hours)

### 🔴 P0: Critical - Blocks Everything

#### 1. Dialog Component
**File:** `components/ui/dialog.tsx`
**Status:** 🔴 BROKEN - Has z-index stacking issues
**Impact:** HIGH - Modals are essential UI pattern
**Estimated Time:** 4-6 hours

**Current Issues:**
- Z-index conflicts with sidebar
- Used hardcoded `bg-white` (changed to `bg-popover`)
- Manual portal container management
- Stacking context problems

**Migration Tasks:**
- [ ] Replace `z-[9999]` with `zIndex.component.dialogOverlay`
- [ ] Replace `z-[10000]` with `zIndex.component.dialogContent`
- [ ] Use `colors.surface.elevated` for background
- [ ] Use `colors.surface.overlay` for backdrop
- [ ] Use `borderRadius.component.modal` for corners
- [ ] Use `elevation.component.modal` for shadow
- [ ] Use `motion.component.modal` for animations
- [ ] Use `spacing.component.modalPadding` for padding
- [ ] Remove manual portal container prop
- [ ] Test z-index hierarchy thoroughly

**Success Criteria:**
- Modal appears above all other content
- Backdrop is visible and blocks interaction
- No z-index conflicts with sidebar or other components
- Proper enter/exit animations
- Keyboard navigation works (ESC to close)

**Blocks:**
- AddPlayerModal (depends on Dialog)
- All modal-based features

---

#### 2. Input Component
**File:** `components/ui/input.tsx`
**Status:** 🟡 ISSUES - Text visibility problems in modals
**Impact:** HIGH - Forms are critical
**Estimated Time:** 2-3 hours

**Current Issues:**
- Text color hardcoded as `text-gray-900` (was added to fix visibility)
- Background uses `bg-white`
- Border color hardcoded
- Sizing uses arbitrary values

**Migration Tasks:**
- [ ] Use `colors.surface.sunken` for background
- [ ] Use `colors.text.primary` for text
- [ ] Use `colors.border.default` for border
- [ ] Use `colors.border.focus` for focus state
- [ ] Use `spacing.component.inputPadding` for padding
- [ ] Use `typography.ui.input` for text styles
- [ ] Use `borderRadius.component.input` for corners
- [ ] Use `elevation.coloredShadow.focus` for focus ring
- [ ] Use `motion.component.input` for transitions

**Success Criteria:**
- Text is readable in all contexts (light backgrounds, modals, cards)
- Focus state is clear and accessible
- Sizing is consistent across all forms
- Placeholder text is visible but subtle

**Blocks:**
- AddPlayerModal (uses Input heavily)
- All form-based features

---

#### 3. Label Component
**File:** `components/ui/label.tsx`
**Status:** 🟡 ISSUES - Text visibility problems
**Impact:** HIGH - Affects all forms
**Estimated Time:** 1 hour

**Current Issues:**
- Font size hardcoded as `text-sm`
- Color hardcoded as `text-gray-900` (was added to fix visibility)

**Migration Tasks:**
- [ ] Use `typography.ui.label` for text styles
- [ ] Use `colors.text.primary` for label color
- [ ] Use `spacing.form.labelGap` for spacing to input

**Success Criteria:**
- Labels are readable in all contexts
- Consistent typography across all forms
- Proper spacing to associated inputs

**Blocks:**
- All form components

---

### 🟠 P1: High Priority - Actively Broken

#### 4. Select Component
**File:** `components/ui/select.tsx`
**Status:** 🔴 ISSUES - Dropdown z-index and transparency
**Impact:** HIGH - Dropdowns are common
**Estimated Time:** 3-4 hours

**Current Issues:**
- Z-index changed to `z-[50000]` (should use token)
- Background changed to `bg-popover` (good, but needs token)
- Hardcoded colors throughout

**Migration Tasks:**
- [ ] Use `zIndex.component.selectContent` for dropdown z-index
- [ ] Use `colors.surface.elevated` for dropdown background
- [ ] Use `colors.text.primary` for text
- [ ] Use `colors.border.default` for borders
- [ ] Use `spacing.component.inputPadding` for trigger padding
- [ ] Use `typography.ui.input` for text styles
- [ ] Use `borderRadius.component.select` for corners
- [ ] Use `elevation.component.dropdown` for shadow
- [ ] Use `motion.component.dropdown` for animations

**Success Criteria:**
- Dropdown appears above all content except modals/tooltips
- Background is solid and readable
- Animations are smooth
- No transparency issues

**Blocks:**
- AddPlayerModal (uses Select for position, nationality, status)

---

#### 5. Button Component
**File:** `components/ui/button.tsx`
**Status:** 🟢 STABLE - Well structured
**Impact:** CRITICAL - Most used interactive element
**Estimated Time:** 2-3 hours

**Current Approach:**
- Already uses CVA for variants (good)
- Uses semantic CSS variables (good pattern)
- Well structured

**Migration Tasks:**
- [ ] Use `colors.interactive.primary` for primary variant
- [ ] Use `colors.interactive.secondary` for secondary variant
- [ ] Use `colors.interactive.destructive` for destructive variant
- [ ] Use `colors.interactive.ghost` for ghost variant
- [ ] Use `spacing.component.inputPadding` for default size
- [ ] Use `typography.ui.button` for text styles
- [ ] Use `borderRadius.component.button` for corners
- [ ] Use `elevation.component.button` for shadow
- [ ] Use `elevation.component.buttonHover` for hover shadow
- [ ] Use `motion.component.button` for transitions
- [ ] Use `elevation.coloredShadow.focus` for focus ring

**Success Criteria:**
- All variants look consistent
- Hover/focus/active states are clear
- Sizing is predictable
- Transitions are smooth

**Blocks:**
- Every feature uses buttons
- Quick win with high impact

---

## Week 2: Supporting Components (18-22 hours)

### 🟡 P2: Medium Priority - Widely Used

#### 6. Card Component
**File:** `components/ui/card.tsx`
**Status:** 🟢 STABLE - Well structured
**Impact:** MEDIUM - Layout component
**Estimated Time:** 2-3 hours

**Migration Tasks:**
- [ ] Use `colors.surface.elevated` for background
- [ ] Use `colors.border.subtle` for border
- [ ] Use `spacing.component.cardPadding` for padding
- [ ] Use `borderRadius.component.card` for corners
- [ ] Use `elevation.component.card` for shadow
- [ ] Use `elevation.component.cardHover` for hover state
- [ ] Use `typography.heading.h5` for CardTitle
- [ ] Use `typography.body.sm` for CardDescription

**Success Criteria:**
- Consistent spacing across all card instances
- Proper elevation hierarchy
- Hover states work smoothly

---

#### 7. Sidebar Component
**File:** `components/ui/sidebar.tsx`
**Status:** 🟡 PARTIALLY FIXED - Z-index updated
**Impact:** CRITICAL - Main navigation
**Estimated Time:** 4-5 hours

**Current State:**
- Z-index changed from `z-10` to `z-[40]` (needs token)
- SidebarInset uses `z-[100]` (needs token)
- Many hardcoded spacing values

**Migration Tasks:**
- [ ] Use `zIndex.component.sidebar` for sidebar z-index
- [ ] Use `zIndex.component.sidebarInset` for content area
- [ ] Use `colors.surface.sidebar` for background
- [ ] Use `colors.surface.sidebarHover` for hover states
- [ ] Use `colors.surface.sidebarActive` for active states
- [ ] Use `spacing.component.listItemPadding` for menu items
- [ ] Use `typography.ui.nav` for navigation text
- [ ] Use `elevation.component.sidebar` for shadow

**Success Criteria:**
- Proper z-index hierarchy
- Consistent spacing
- Clear active/hover states

---

#### 8. Badge Component
**File:** `components/ui/badge.tsx`
**Status:** 🟢 STABLE - Simple component
**Impact:** LOW - Visual indicator
**Estimated Time:** 1 hour

**Migration Tasks:**
- [ ] Use `colors.interactive.primary` for default variant
- [ ] Use `colors.interactive.secondary` for secondary variant
- [ ] Use `colors.interactive.destructive` for destructive variant
- [ ] Use `borderRadius.component.badge` for corners (pill shape)
- [ ] Use `typography.ui.badge` for text styles
- [ ] Use `spacing.spacing.xs` for internal padding

**Success Criteria:**
- Consistent pill shape
- Proper sizing
- Clear variants

**Note:** Good candidate for PROOF OF CONCEPT migration

---

## Week 3-4: Remaining Core UI (30-40 hours)

### 🟢 P3: Lower Priority - Stable Components

#### Tier 1: Interactive Components (15-20 hours)
9. Checkbox (1-2h)
10. Radio Group (1-2h)
11. Switch (1-2h)
12. Slider (2-3h)
13. Toggle (1h)
14. Toggle Group (2h)
15. Textarea (2h)

#### Tier 2: Overlay Components (10-15 hours)
16. Popover (3h)
17. Tooltip (2h)
18. Sheet (3h)
19. Drawer (3h)
20. Alert Dialog (2h)
21. Hover Card (2h)
22. Context Menu (3h)
23. Dropdown Menu (3h)

#### Tier 3: Navigation & Layout (8-10 hours)
24. Tabs (2-3h)
25. Accordion (2-3h)
26. Breadcrumb (1h)
27. Navigation Menu (3h)
28. Menubar (2h)
29. Pagination (2h)
30. Separator (30min)

#### Tier 4: Display Components (6-8 hours)
31. Alert (1h)
32. Avatar (1h)
33. Table (3-4h)
34. Progress (1h)
35. Skeleton (1h)
36. Aspect Ratio (30min)
37. Scroll Area (2h)

#### Tier 5: Complex Components (10-12 hours)
38. Calendar (4h)
39. Carousel (3h)
40. Chart (3h)
41. Command (3h)
42. Form (2h)
43. Input OTP (2h)
44. Resizable (2h)
45. Sonner (Toast) (2h)

---

## Week 5-6: Feature Components (12-16 hours)

### Players Module Migration

#### 46. AddPlayerModal
**File:** `components/players/add-player-modal.tsx`
**Status:** 🔴 WAS BROKEN - Depends on core components
**Impact:** CRITICAL - Core feature
**Estimated Time:** 3-4 hours

**Dependencies:**
- Dialog (P0 - must be done first)
- Input (P0 - must be done first)
- Label (P0 - must be done first)
- Select (P1 - must be done first)
- Button (P1 - must be done first)

**Migration Tasks:**
- [ ] Verify all dependency components use tokens
- [ ] Use token spacing for form layout
- [ ] Use token colors for error states
- [ ] Test modal thoroughly after dependency migrations

**Success Criteria:**
- Modal opens reliably
- All form fields are readable
- Dropdowns work correctly
- No z-index issues
- Proper validation states

---

#### 47-52. Other Players Components
**Estimated Time:** 8-12 hours total

47. AddPlayerDialog (2h) - Investigate if duplicate
48. PlayersTableClient (3-4h)
49. PlayerProfile (2-3h)
50. ImportPlayersCSV (2-3h)
51. PlayersTableWrapper (1h)
52. PlayersTable (2h)

---

## Week 7: Utility Components (4-6 hours)

#### 53-57. Utility & Legacy Components

53. ErrorBoundary (1h)
54. ImageWithFallback (figma) (1h)
55-57. Any remaining components (2-4h)

---

## Migration Workflow

### For Each Component:

#### 1. Preparation (15 mins)
- [ ] Read current component code
- [ ] Identify all hardcoded values
- [ ] List required tokens
- [ ] Check dependencies

#### 2. Migration (Main work)
- [ ] Create new version or update in place
- [ ] Replace colors with tokens
- [ ] Replace spacing with tokens
- [ ] Replace z-index with tokens (if applicable)
- [ ] Replace shadows with tokens
- [ ] Replace border radius with tokens
- [ ] Replace transitions with tokens
- [ ] Update TypeScript types
- [ ] Preserve CVA structure
- [ ] Add inline styles for tokens that can't be Tailwind classes

#### 3. Testing (30 mins)
- [ ] Visual inspection in Storybook (when available)
- [ ] Test all variants
- [ ] Test all sizes
- [ ] Test hover/focus/active states
- [ ] Test in different contexts (modal, card, page)
- [ ] Test responsive behavior
- [ ] Test keyboard navigation
- [ ] Check accessibility

#### 4. Documentation (15 mins)
- [ ] Add component to migration tracker
- [ ] Document any issues encountered
- [ ] Note any tokens that were missing
- [ ] Update component usage examples

---

## Risk Assessment

### High Risk Components
These need extra care during migration:

1. **Dialog** - Core issue, affects many features
2. **Sidebar** - Complex layout, many dependencies
3. **Select** - Had transparency issues
4. **Table** - Complex structure, lots of styling
5. **Calendar** - Complex component, many states
6. **Chart** - Custom styling, data visualization
7. **Command** - Complex keyboard interaction

### Low Risk Components
These should be straightforward:

1. **Badge** - Simple, good for proof of concept
2. **Avatar** - Simple display component
3. **Separator** - Minimal styling
4. **Skeleton** - Simple animation
5. **Progress** - Simple visual indicator

---

## Success Metrics

### Per-Component Checklist

Each migrated component must:
- [ ] Use tokens for 100% of colors
- [ ] Use tokens for 100% of spacing
- [ ] Use tokens for z-index (if applicable)
- [ ] Use tokens for shadows
- [ ] Use tokens for border radius
- [ ] Use tokens for motion/transitions
- [ ] Pass TypeScript compilation
- [ ] Preserve all existing functionality
- [ ] Maintain accessibility features
- [ ] Match original visual design
- [ ] Work in all contexts (modal, card, page)
- [ ] Have updated documentation

### Phase 3 Completion Criteria

- [ ] All P0 components migrated (5 components)
- [ ] All P1 components migrated (2 components)
- [ ] All P2 components migrated (2 components)
- [ ] All P3 components migrated (39 components)
- [ ] All feature components migrated (10 components)
- [ ] All utility components migrated (5 components)
- [ ] Total: 57 components migrated
- [ ] No hardcoded design values remain
- [ ] All components use token system
- [ ] Visual regression testing complete
- [ ] Accessibility testing complete
- [ ] Documentation updated

---

## Timeline Summary

| Week | Focus | Components | Hours |
|------|-------|------------|-------|
| 1 | Critical Foundation | 5 | 22-28 |
| 2 | Supporting Components | 3 | 18-22 |
| 3-4 | Remaining Core UI | 39 | 30-40 |
| 5-6 | Feature Components | 10 | 12-16 |
| 7 | Utility Components | 5 | 4-6 |
| **Total** | **All Components** | **57** | **86-112** |

**Estimated Timeline:** 6-8 weeks at 15-20 hours/week
**Estimated Total:** 86-112 hours

---

## Next Actions

### Immediate (This Week)
1. ✅ Complete component audit
2. ✅ Create priority list
3. ⏳ **Proof of Concept:** Migrate Badge component
4. ⏳ Document migration process
5. ⏳ Create migration template

### Next Week (Week 1 Start)
1. ⏳ Start Dialog migration
2. ⏳ Start Input migration
3. ⏳ Start Label migration
4. ⏳ Test in AddPlayerModal context

---

**Status:** Phase 2 - Complete
**Next:** Create proof of concept migration (Badge component)
