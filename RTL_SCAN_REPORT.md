# RTL Hardcoded Classes Scan Report

**Generated:** 2025-11-11T06:12:14.527Z

## Summary

- **Total Issues Found:** 6
- **High Priority:** 0
- **Medium Priority:** 6
- **Low Priority:** 0

## Pattern Summary

| Pattern | Count | Replacement |
|---------|-------|-------------|
| `left-position` | 5 | `start-[50%]` |
| `right-position` | 1 | `end-[calc(var(--sidebar-width)*-1)]` |

## Issues by File

### components/ui/sidebar.tsx

**2 issue(s)**

**Line 251:**
- 🟡 `left-[calc(var(--sidebar-width)*-1)]` → `start-[calc(var(--sidebar-width)*-1)]`
  ```tsx
  ? "start-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
  ```

**Line 252:**
- 🟡 `right-[calc(var(--sidebar-width)*-1)]` → `end-[calc(var(--sidebar-width)*-1)]`
  ```tsx
  : "end-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
  ```


### components/calendar/event-quick-view.tsx

**1 issue(s)**

**Line 76:**
- 🟡 `left-[50%]` → `start-[50%]`
  ```tsx
  "fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] border bg-background shadow-lg sm:rounded-lg p-0",
  ```


### components/ui/alert-dialog.tsx

**1 issue(s)**

**Line 37:**
- 🟡 `left-[50%]` → `start-[50%]`
  ```tsx
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-start-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-start-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  ```


### components/ui/dialog.tsx

**1 issue(s)**

**Line 41:**
- 🟡 `left-[50%]` → `start-[50%]`
  ```tsx
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-start-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-start-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  ```


### scripts/validate-tokens.js

**1 issue(s)**

**Line 33:**
- 🟡 `left-[50%]` → `start-[50%]`
  ```tsx
  'top-[1px]', 'top-[60%]', 'top-[50%]', 'left-[50%]', // Positioning values
  ```


