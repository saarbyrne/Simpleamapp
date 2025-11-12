# RTL Hardcoded Classes Audit Report

## Summary
Found **272+ instances** of hardcoded directional classes that need to be updated for RTL support.

## Priority Breakdown

### 🔴 HIGH PRIORITY - User-Facing Components (60 instances)
These directly affect the user experience and should be fixed first.

#### Dashboard Components
1. **components/dashboard/dashboard-layout-client.tsx** (3 instances)
   - Line 175: `-ml-1` → `-ms-1`
   - Line 176: `mr-2` → `me-2`
   - Line 182: `ml-auto` → `ms-auto`

2. **components/dashboard/app-sidebar.tsx** (4 instances)
   - Line 172: `text-left` → `text-start`
   - Line 178: `ml-auto` → `ms-auto`
   - Line 198: `mr-2` → `me-2`
   - Line 207: `mr-2` → `me-2`

3. **components/dashboard/players-table-new.tsx** (2 instances)
   - Line 151: `text-left` → `text-start`
   - Line 1019: `mr-2` → `me-2`

4. **components/dashboard/forms-table.tsx** (6 instances)
   - Lines 182, 186, 190, 194, 198: `mr-2` → `me-2`
   - Line 766: `mr-2` → `me-2`

5. **components/dashboard/form-responses-table.tsx** (2 instances)
   - Line 104: `text-right` → `text-end`
   - Line 116: `mr-2` → `me-2`

6. **components/dashboard/quick-actions-toolbar.tsx** (1 instance)
   - Line 74: `mr-2` → `me-2`

7. **components/dashboard/form-renderer.tsx** (1 instance)
   - Line 269: `ml-1` → `ms-1`

#### Spreadsheet Components
8. **components/spreadsheets/spreadsheet-grid.tsx** (6 instances)
   - Lines 160, 170, 178, 185, 194, 211: `mr-2` → `me-2`

9. **components/spreadsheets/cells/date-cell.tsx** (2 instances)
   - Line 28: `text-left` → `text-start`
   - Line 33: `mr-2` → `me-2`

10. **components/spreadsheets/cells/person-cell.tsx** (2 instances)
    - Line 46: `ml-2` → `ms-2`
    - Line 65: `mr-2` → `me-2`

11. **components/spreadsheets/csv-import-dialog.tsx** (2 instances)
    - Line 108: `mr-2` → `me-2`
    - Line 177: `text-left` → `text-start`

12. **components/spreadsheets/ai-assistant-dialog.tsx** (2 instances)
    - Lines 167, 172: `mr-2` → `me-2`

13. **components/spreadsheets/template-gallery.tsx** (1 instance)
    - Line 110: `pr-4` → `pe-4`

#### Calendar Components
14. **components/calendar/event-quick-view.tsx** (2 instances)
    - Line 81: `right-4` → `end-4` (close button)
    - Line 160: `mr-2` → `me-2`

15. **components/calendar/attendance-manager.tsx** (1 instance)
    - Line 276: `mr-2` → `me-2`

16. **app/dashboard/calendar/calendar-client.tsx** (1 instance)
    - Line 339: `mr-2` → `me-2`

#### Profile Pages
17. **app/dashboard/profile/tabs/preferences-tab.tsx** (1 instance)
    - Line 271: `mr-2` → `me-2`

18. **app/dashboard/profile/tabs/profile-tab.tsx** (3 instances)
    - Lines 178, 183, 260: `mr-2` → `me-2`
    - Line 311: `pl-4` → `ps-4`

19. **app/dashboard/profile/tabs/notifications-tab.tsx** (1 instance)
    - Line 309: `mr-2` → `me-2`

20. **app/dashboard/profile/tabs/security-tab.tsx** (1 instance)
    - Line 202: `mr-2` → `me-2`

#### Other Dashboard Pages
21. **app/dashboard/players/[id]/page.tsx** (7 instances)
    - Lines 143, 155, 159, 163, 167, 171, 175: `mr-2` → `me-2`

22. **app/dashboard/calendar/events/[eventId]/page.tsx** (10 instances)
    - Lines 213, 217, 230, 234, 238, 242, 246, 250, 275: `mr-2` → `me-2`

23. **app/dashboard/spreadsheets/[id]/page.tsx** (3 instances)
    - Line 223: `mr-2` → `me-2` (ArrowLeft icon - may need conditional flip)
    - Lines 273, 294: `mr-2` → `me-2`, `mr-1` → `me-1`

24. **app/dashboard/spreadsheets/page.tsx** (6 instances)
    - Lines 168, 172, 189, 193, 224, 231, 242, 266: `mr-2` → `me-2`, `mr-1` → `me-1`

### 🟡 MEDIUM PRIORITY - UI Components (150+ instances)
These are reusable components that affect multiple pages.

#### Data Table
25. **components/ui/data-table.tsx** (3 instances)
    - Line 64: `text-right` → `text-end`
    - Line 114: `right-0` → `end-0`
    - Line 173: `text-right` → `text-end`

#### Date/Time Pickers
26. **components/ui/date-picker.tsx** (2 instances)
    - Line 57: `text-left` → `text-start`
    - Line 63: `mr-2` → `me-2`

27. **components/ui/time-picker.tsx** (2 instances)
    - Line 224: `pr-10` → `pe-10`
    - Line 236: `right-0` → `end-0`

#### Dialogs & Modals
28. **components/ui/dialog.tsx** (3 instances)
    - Line 41: `left-[50%]` → `start-[50%]` (centering - may need special handling)
    - Line 47: `right-4` → `end-4`
    - Line 62: `text-left` → `text-start`

29. **components/ui/alert-dialog.tsx** (2 instances)
    - Line 37: `left-[50%]` → `start-[50%]` (centering)
    - Line 52: `text-left` → `text-start`

#### Dropdowns & Menus
30. **components/ui/dropdown-menu.tsx** (6 instances)
    - Line 31: `pl-8` → `ps-8`
    - Line 37: `ml-auto` → `ms-auto` (ChevronRight - may need conditional flip)
    - Line 50: Animation classes with `left`/`right` (Radix handles this)
    - Line 87: `pl-8` → `ps-8`
    - Line 102: `pl-8 pr-2` → `ps-8 pe-2`
    - Line 108: `left-2` → `start-2`
    - Line 126: `pl-8 pr-2` → `ps-8 pe-2`
    - Line 131: `left-2` → `start-2`
    - Line 151: `pl-8` → `ps-8`
    - Line 177: `ml-auto` → `ms-auto`

31. **components/ui/context-menu.tsx** (8 instances)
    - Similar pattern to dropdown-menu.tsx
    - Line 35: `ml-auto` → `ms-auto` (ChevronRight - needs conditional flip)

32. **components/ui/menubar.tsx** (8 instances)
    - Similar pattern to dropdown-menu.tsx
    - Line 83: `ml-auto` → `ms-auto` (ChevronRight - needs conditional flip)

#### Sidebar Component
33. **components/ui/sidebar.tsx** (15+ instances)
    - Lines 251-252: `left-0`/`right-0` → `start-0`/`end-0` (sidebar positioning)
    - Line 315: `left-1/2`, `-right-4`, `left-0` → `start-1/2`, `-end-4`, `start-0`
    - Line 318: `left-full` → `start-full`
    - Line 319: `-right-2` → `-end-2`
    - Line 320: `-left-2` → `-start-2`
    - Line 338: `ml-2`, `ml-0` → `ms-2`, `ms-0`
    - Line 475: `right-3` → `end-3`
    - Line 527: `text-left`, `pr-8` → `text-start`, `pe-8`
    - Line 621: `right-1` → `end-1`
    - Line 646: `right-1` → `end-1`

#### Other UI Components
34. **components/ui/table.tsx** (2 instances)
    - Line 76: `text-left`, `pr-0` → `text-start`, `pe-0`
    - Line 99: `pr-0` → `pe-0`

35. **components/ui/table-filters.tsx** (1 instance)
    - Line 68: `text-left` → `text-start`

36. **components/ui/alert.tsx** (1 instance)
    - Line 7: `pl-7`, `left-4` → `ps-7`, `start-4`

37. **components/ui/bulk-actions-bar.tsx** (3 instances)
    - Line 151: `ml-auto` → `ms-auto`
    - Lines 158, 168: `mr-2` → `me-2`

38. **components/ui/carousel.tsx** (6 instances)
    - Lines 163, 186: `-ml-4`, `pl-4` → `-ms-4`, `ps-4`
    - Lines 209-210, 238-239: `-left-12`, `left-1/2`, `-right-12` → `-start-12`, `start-1/2`, `-end-12`

39. **components/ui/pagination.tsx** (2 instances)
    - Line 72: `pl-2.5` → `ps-2.5`
    - Line 88: `pr-2.5` → `pe-2.5`

40. **components/ui/navigation-menu.tsx** (3 instances)
    - Line 58: `ml-1` → `ms-1`
    - Line 72: Animation classes (Radix handles)
    - Line 86: `left-0` → `start-0`

41. **components/ui/command.tsx** (2 instances)
    - Line 44: `mr-2` → `me-2`
    - Line 135: `ml-auto` → `ms-auto`

42. **components/ui/calendar.tsx** (1 instance)
    - Line 84: `pl-2 pr-1` → `ps-2 pe-1`

### 🟢 LOW PRIORITY - Auth & Misc (20+ instances)

43. **components/login-form.tsx** (1 instance)
    - Line 28: `ml-auto` → `ms-auto`

44. **components/search-form.tsx** (2 instances)
    - Line 21: `pl-8` → `ps-8`
    - Line 23: `left-2` → `start-2`

45. **app/(auth)/login/page.tsx** (1 instance)
    - Line 104: `mr-2` → `me-2`

46. **app/error.tsx** (2 instances)
    - Lines 45, 50: `mr-2` → `me-2`

47. **components/data-table/data-table-bulk-actions.tsx** (3 instances)
    - Line 89: `ml-auto` → `ms-auto`
    - Line 95: `ml-2` → `ms-2`
    - Line 117: `mr-2` → `me-2`

48. **components/data-table/data-table-column-manager.tsx** (1 instance)
    - Line 183: `mr-2` → `me-2`

49. **components/data-table/data-table-export.tsx** (3 instances)
    - Lines 109, 113, 117: `mr-2` → `me-2`

50. **components/version-switcher.tsx** (2 instances)
    - Line 41: `ml-auto` → `ms-auto`
    - Line 54: `ml-auto` → `ms-auto`

51. **components/dashboard/form-builder-dialog.tsx** (1 instance)
    - Line 274: `mr-2` → `me-2`

## Special Cases Requiring Conditional Logic

### Icons That Need Flipping in RTL
These icons have directional meaning and should flip in RTL:

1. **ChevronRight** → Should become ChevronLeft in RTL
   - `components/ui/dropdown-menu.tsx:37`
   - `components/ui/context-menu.tsx:35`
   - `components/ui/menubar.tsx:83`

2. **ArrowLeft** → Should become ArrowRight in RTL
   - `app/dashboard/spreadsheets/[id]/page.tsx:223`

3. **ChevronsUpDown** → May need adjustment
   - `components/dashboard/app-sidebar.tsx:178`
   - `components/spreadsheets/cells/person-cell.tsx:46`
   - `components/version-switcher.tsx:41`

### Centering Logic
These use `left-[50%]` for centering - may need special handling:
- `components/ui/dialog.tsx:41`
- `components/ui/alert-dialog.tsx:37`

### Sidebar Positioning
The sidebar component has complex positioning logic that may need RTL-aware adjustments:
- `components/ui/sidebar.tsx` - Multiple instances of `left-0`/`right-0` for sidebar placement

## Animation Classes
Many Radix UI components have animation classes with `left`/`right` in the names. These are handled by Radix and should work automatically with RTL, but should be tested:
- `data-[side=left]:slide-in-from-right-2`
- `data-[side=right]:slide-in-from-left-2`

## CSS File
The `app/globals.css` file contains many Tailwind utility classes. These are generated by Tailwind and should automatically support RTL when using logical properties, but the hardcoded instances in components need to be updated.

## Estimated Effort

### Quick Wins (High Priority - User Facing)
- **60 instances** × ~30 seconds each = **~30 minutes**
- Focus on dashboard and main feature components

### Medium Priority (UI Components)
- **150+ instances** × ~30 seconds each = **~1.5-2 hours**
- Reusable components that affect multiple pages

### Low Priority (Misc)
- **20+ instances** × ~30 seconds each = **~10 minutes**
- Auth pages and utility components

### Special Cases (Icons & Complex Logic)
- **~10 instances** × ~5 minutes each = **~50 minutes**
- Conditional icon flipping and complex positioning

### Testing
- **~2-3 hours** to test all components in RTL mode

## Total Estimated Time: **5-6 hours**

## Recommended Approach

1. **Phase 1** (30 min): Fix high-priority dashboard components
2. **Phase 2** (2 hours): Fix UI components (reusable)
3. **Phase 3** (1 hour): Fix special cases (icons, centering)
4. **Phase 4** (2-3 hours): Test and polish

## Automated Fix Script Potential

Many of these could be fixed with a find/replace script:
- `mr-2` → `me-2` (with context checking)
- `ml-auto` → `ms-auto`
- `text-left` → `text-start`
- `text-right` → `text-end`
- `left-0` → `start-0`
- `right-0` → `end-0`
- etc.

However, manual review is recommended for:
- Icon components (need conditional logic)
- Centering logic (may need special handling)
- Sidebar positioning (complex logic)
