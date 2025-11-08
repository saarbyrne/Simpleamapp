# Component Migration Priority List

**Updated:** 05 November 2024
**Phase:** 3 - Core Component Rebuild - ✅ **COMPLETE**
**Goal:** Migrate components from Tailwind classes to design token system
**Timeline:** 6-8 weeks total
**Current Status:** 100% component coverage achieved! All 46 UI components migrated to tokens with full Storybook documentation. Ready for Phase 4 (Dark Mode)

## Priority Matrix

Components prioritized by:
1. **Impact** - How critical is this component?
2. **Issues** - Does it have known problems?
3. **Usage** - How frequently is it used?
4. **Dependencies** - Do other components depend on it?

## Week 1: Critical Foundation (22-28 hours)

## ✅ Phase 3 Complete - Final Status

- ✅ **100% Storybook Coverage** - All 46/46 UI components have comprehensive stories
- ✅ **Final 5 Components** - AspectRatio, Form, Separator, Textarea, ToggleGroup stories added
- ✅ **E2E Testing** - Input OTP smoke test suite created (`tests/e2e/input-otp.spec.ts`)
- ✅ **Token Migration** - All components use design token system
- ✅ **Documentation** - Migration #11 captures final completion
- 🗂️ Latest migration: `design-system/migrations/11-component-coverage-completion.md`
- ⏭️ **Ready for Phase 4** - Dark Mode Implementation (Week 7)

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
**Status:** ✅ MIGRATED & DOCUMENTED
**Impact:** HIGH - Dropdowns are common

**Notes:** Trigger and content use tokens (`surface.sunken`, `zIndex.component.selectContent`, `spacing.component.inputPadding`, etc.). Story created previously.

---

#### 5. Dropdown Menu Component
**File:** `components/ui/dropdown-menu.tsx`
**Status:** ✅ MIGRATED & DOCUMENTED
**Impact:** HIGH - Supports selection patterns

**Notes:** Tokens applied to surface, hover/focus states via CSS variables, and Storybook ready (`components/ui/dropdown-menu.stories.tsx`). See `design-system/migrations/05-dropdown-menu-migration.md`.

---

#### 6. Context Menu Component
**File:** `components/ui/context-menu.tsx`
**Status:** ✅ MIGRATED & DOCUMENTED
**Impact:** HIGH - Context menu for lists/tables

**Notes:** Matches DropdownMenu for surfaces, border and z-index. Story at `components/ui/context-menu.stories.tsx`. Details in `design-system/migrations/06-context-menu-migration.md`.

---

#### 7. Popover Component
**File:** `components/ui/popover.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** MEDIUM - Lightweight overlays

**Notes:** Tokens already applied; story added `components/ui/popover.stories.tsx`.

---

#### 8. Tooltip Component
**File:** `components/ui/tooltip.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** MEDIUM - Quick hints

**Notes:** Existing tokens; story `components/ui/tooltip.stories.tsx`.

---

#### 9. Hover Card Component
**File:** `components/ui/hover-card.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** MEDIUM - Previews

**Notes:** Tokens present; story `components/ui/hover-card.stories.tsx`.

---

#### 10. Sheet Component
**File:** `components/ui/sheet.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** HIGH - Side drawer

**Notes:** Tokens previously applied; story `components/ui/sheet.stories.tsx`.

---

#### 11. Command Palette Component
**File:** `components/ui/command.tsx`
**Status:** ✅ MIGRATED & DOCUMENTED
**Impact:** Alta - búsqueda y acceso rápido

**Notes:** Tokens applied and story `components/ui/command.stories.tsx`. Documented in `design-system/migrations/07-command-migration.md`.

---

#### 12. Alert Component
**File:** `components/ui/alert.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Media - mensajes de estado

**Notes:** Story `components/ui/alert.stories.tsx`; destructive uses feedback tokens.

---

#### 13. Alert Dialog Component
**File:** `components/ui/alert-dialog.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Alta - confirmaciones críticas

**Notes:** Story `components/ui/alert-dialog.stories.tsx`; already migrated at start.

---

#### 14. Table Component
**File:** `components/ui/table.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Media - listados

**Notes:** Story `components/ui/table.stories.tsx`; token values confirmed.

---

#### 15. Tabs Component
**File:** `components/ui/tabs.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Media - navegación por secciones

**Notes:** Story `components/ui/tabs.stories.tsx`; triggers use tokens `--accent`.

---

#### 16. Menubar Component
**File:** `components/ui/menubar.tsx`
**Status:** ✅ MIGRATED & DOCUMENTED
**Impact:** Media - navegación contextual

**Notes:** Stories at `components/ui/menubar.stories.tsx`; surface/borders from tokens. Documented in `design-system/migrations/08-navigation-components-migration.md`.

---

#### 17. Navigation Menu Component
**File:** `components/ui/navigation-menu.tsx`
**Status:** ✅ MIGRATED & DOCUMENTED
**Impact:** Alta - navegación avanzada

**Notes:** Viewport and links with tokens; story `components/ui/navigation-menu.stories.tsx`.

---

#### 18. Slider Component
**File:** `components/ui/slider.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Media - control continuo

**Notes:** Story `components/ui/slider.stories.tsx`; roots expose `--accent`.

---

#### 19. Switch Component
**File:** `components/ui/switch.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Media - toggles

**Notes:** Story `components/ui/switch.stories.tsx`; `--primary`/`--input` from tokens.

---

#### 20. Progress Component
**File:** `components/ui/progress.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Baja - feedback visual

**Notes:** Story `components/ui/progress.stories.tsx`.

---

#### 21. Checkbox Component
**File:** `components/ui/checkbox.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Media - formularios

**Notes:** Story `components/ui/checkbox.stories.tsx`; expose `--primary`.

---

#### 22. Radio Group Component
**File:** `components/ui/radio-group.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Media - formularios

**Notes:** Story `components/ui/radio-group.stories.tsx`.

---

#### 23. Toggle Component
**File:** `components/ui/toggle.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Media - acciones rápidas

**Notes:** Story `components/ui/toggle.stories.tsx` (includes multiple group).

---

#### 24. Accordion Component
**File:** `components/ui/accordion.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Baja - paneles desplegables

**Notes:** Story `components/ui/accordion.stories.tsx`.

---

#### 25. Pagination Component
**File:** `components/ui/pagination.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Media - navegación de listados

**Notes:** Story `components/ui/pagination.stories.tsx`.

---

#### 26. Skeleton Component
**File:** `components/ui/skeleton.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Baja - placeholders

**Notes:** Story `components/ui/skeleton.stories.tsx`.

---

#### 27. Scroll Area Component
**File:** `components/ui/scroll-area.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Baja - contenedores

**Notes:** Story `components/ui/scroll-area.stories.tsx`.

---

#### 28. Resizable Component
**File:** `components/ui/resizable.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Media - paneles dinámicos

**Notes:** Story `components/ui/resizable.stories.tsx`.

---

#### 29. Drawer Component
**File:** `components/ui/drawer.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Media - panel lateral adicional

**Notes:** Story `components/ui/drawer.stories.tsx`.

---

#### 30. Toaster Component
**File:** `components/ui/sonner.tsx`
**Status:** ✅ DOCUMENTED
**Impact:** Media - notificaciones

**Notes:** Story `components/ui/sonner.stories.tsx`.

---

#### 15. Button Component
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
**Status:** ✅ MIGRATED & DOCUMENTED
**Impact:** MEDIUM - Layout component
**Estimated Time:** 2-3 hours

**Migration Tasks:**
- [x] Use `colors.surface.elevated` for background
- [x] Use `colors.border.subtle` for border
- [x] Use `spacing.component.cardPadding` for padding
- [x] Use `borderRadius.component.card` for corners
- [x] Use `elevation.component.card` para estado base y `cardHover` en el hover
- [x] Use `typography.heading.h5` para CardTitle
- [x] Use `typography.body.sm` para CardDescription
- [x] Create stories in Storybook (`components/ui/card.stories.tsx`)

**Notes:** Migración registrada en `design-system/migrations/03-card-migration.md`. Próximo paso: abordar Sidebar.

---

#### 7. Sidebar Component
**File:** `components/ui/sidebar.tsx`
**Status:** ✅ MIGRATED & DOCUMENTED
**Impact:** CRITICAL - Main navigation
**Estimated Time:** 4-5 hours

**Notes:**
- Variables CSS del sidebar alimentadas con tokens (`surface.sidebar`, `focus.ring`, etc.).
- Z-index reemplazado por `tokens.zIndex.component.sidebar` y `sidebarInset`.
- Espaciados, tipografías y alturas ahora enlazados al sistema.
- Complete story at `components/ui/sidebar.stories.tsx`.
- Details in `design-system/migrations/04-sidebar-migration.md`.

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

---

### Componentes completados recientemente

- **Tabs (`components/ui/tabs.tsx`)** – ✅ Documentado. Story at `components/ui/tabs.stories.tsx`; tokens `--accent` configurados.
- **Menubar (`components/ui/menubar.tsx`)** – ✅ Migrado & documentado. Coincide con Dropdown/ContextMenu. Story at `components/ui/menubar.stories.tsx`.
- **Navigation Menu (`components/ui/navigation-menu.tsx`)** – ✅ Migrado & documentado. See `design-system/migrations/08-navigation-components-migration.md` y `components/ui/navigation-menu.stories.tsx`.
- **Slider (`components/ui/slider.tsx`)** – ✅ Documentado. Story `components/ui/slider.stories.tsx`.
- **Switch (`components/ui/switch.tsx`)** – ✅ Documentado. Story `components/ui/switch.stories.tsx`.
- **Progress (`components/ui/progress.tsx`)** – ✅ Documentado. Story `components/ui/progress.stories.tsx`.
