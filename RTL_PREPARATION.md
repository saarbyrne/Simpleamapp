# RTL (Right-to-Left) Preparation Checklist

## Current Status
✅ Basic RTL support added:
- `dir="rtl"` attribute set on `<html>` element for Arabic
- Tailwind CSS v4 handles most RTL automatically

## What Needs to Be Done for Full RTL Support

### 1. Replace Hardcoded Directional Classes ⚠️ HIGH PRIORITY

These classes need to be replaced with RTL-aware alternatives:

#### Found Issues:
- `ml-auto` → Use `ms-auto` (margin-start) or conditional logic
- `mr-2` → Use `me-2` (margin-end) or conditional logic  
- `text-left` → Use `text-start` or conditional logic
- `text-right` → Use `text-end` or conditional logic
- `-ml-1` → Use `-ms-1` or conditional logic

#### Files to Update:
1. `components/dashboard/dashboard-layout-client.tsx`
   - Line 175: `className="-ml-1 shrink-0"` → `className="-ms-1 shrink-0"`
   - Line 176: `className="mr-2 h-4 shrink-0"` → `className="me-2 h-4 shrink-0"`
   - Line 182: `className="ml-auto shrink-0"` → `className="ms-auto shrink-0"`

2. `components/dashboard/app-sidebar.tsx`
   - Line 172: `text-left` → `text-start`
   - Line 178: `ml-auto` → `ms-auto`
   - Line 198: `mr-2` → `me-2`
   - Line 207: `mr-2` → `me-2`

3. `components/ui/data-table.tsx`
   - Line 64: `text-right` → `text-end`
   - Line 114: `right-0` → `end-0`
   - Line 173: `text-right` → `text-end`

4. `components/ui/date-picker.tsx`
   - Line 57: `text-left` → `text-start`
   - Line 63: `mr-2` → `me-2`

### 2. Icon Direction Flipping 🔄 MEDIUM PRIORITY

Icons that have directional meaning need to flip in RTL:

#### Icons to Check:
- `ChevronsUpDown` - May need conditional rendering
- `ChevronLeft` / `ChevronRight` - Should swap in RTL
- `ArrowLeft` / `ArrowRight` - Should swap in RTL
- Any navigation arrows

#### Solution:
```tsx
import { useLocale } from 'next-intl'

const isRTL = useLocale() === 'ar'
const ChevronIcon = isRTL ? ChevronRight : ChevronLeft
```

### 3. Component-Specific RTL Adjustments 🔧 MEDIUM PRIORITY

#### Sidebar
- Check sidebar positioning (should be on right in RTL)
- Verify menu item alignment
- Test collapsible behavior

#### Dropdowns/Menus
- Check dropdown positioning (should open left in RTL)
- Verify menu item alignment
- Test nested menus

#### Tables
- Column alignment (actions column should be on left in RTL)
- Sort indicators
- Resize handles

#### Forms
- Label positioning
- Input alignment
- Error message positioning
- Button groups

#### Calendar
- Day/week/month navigation arrows
- Event positioning
- Time slots alignment

### 4. CSS Custom Properties for RTL 🎨 LOW PRIORITY

Create RTL-aware CSS variables if needed:

```css
:root[dir="rtl"] {
  --sidebar-position: right;
  --dropdown-align: left;
  /* etc */
}
```

### 5. Testing Checklist ✅

- [ ] Test sidebar in RTL mode
- [ ] Test all dropdowns/menus
- [ ] Test tables and data grids
- [ ] Test forms and inputs
- [ ] Test calendar component
- [ ] Test date pickers
- [ ] Test modals/dialogs
- [ ] Test tooltips
- [ ] Test breadcrumbs
- [ ] Test navigation flows
- [ ] Test responsive breakpoints in RTL

### 6. Utility Function for RTL-Aware Classes 🛠️

Create a utility to help with RTL:

```tsx
// lib/i18n/rtl-utils.ts
import { useLocale } from 'next-intl'

export function useRTL() {
  const locale = useLocale()
  return locale === 'ar' || locale === 'he' || locale === 'fa' || locale === 'ur'
}

export function rtlClass(ltr: string, rtl: string) {
  // Could be enhanced to detect RTL from context
  return ltr // Placeholder
}
```

## Recommended Approach

### Phase 1: Quick Wins (1-2 hours)
1. Replace all `ml-*`, `mr-*`, `pl-*`, `pr-*` with `ms-*`, `me-*`, `ps-*`, `pe-*`
2. Replace `text-left`/`text-right` with `text-start`/`text-end`
3. Replace `left-*`/`right-*` with `start-*`/`end-*`

### Phase 2: Component Testing (2-3 hours)
1. Test each major component in RTL mode
2. Fix any visual issues found
3. Flip directional icons where needed

### Phase 3: Polish (1-2 hours)
1. Fine-tune spacing and alignment
2. Test edge cases
3. Document RTL considerations for future development

## Tailwind CSS v4 RTL Support

Tailwind v4 has built-in RTL support through logical properties:
- `ms-*` = margin-start (left in LTR, right in RTL)
- `me-*` = margin-end (right in LTR, left in RTL)
- `ps-*` = padding-start
- `pe-*` = padding-end
- `start-*` = left in LTR, right in RTL
- `end-*` = right in LTR, left in RTL
- `text-start` = left-aligned in LTR, right-aligned in RTL
- `text-end` = right-aligned in LTR, left-aligned in RTL

These automatically flip based on the `dir` attribute!
