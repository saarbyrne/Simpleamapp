# RTL Hardcoded Classes Scan Report

**Generated:** 2025-11-11T04:54:51.689Z

## Summary

- **Total Issues Found:** 230
- **High Priority:** 162
- **Medium Priority:** 68
- **Low Priority:** 0

## Pattern Summary

| Pattern | Count | Replacement |
|---------|-------|-------------|
| `margin-right` | 80 | `me-2` |
| `left-position` | 42 | `start-[50%]` |
| `right-position` | 26 | `end-2` |
| `padding-left` | 25 | `ps-8` |
| `margin-left` | 23 | `ms-auto` |
| `padding-right` | 18 | `pe-10` |
| `text-left` | 13 | `text-start` |
| `text-right` | 3 | `text-end` |

## Issues by File

### components/ui/sidebar.tsx

**16 issue(s)**

**Line 251:**
- 🟡 `left-0` → `start-0`
  ```tsx
  ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
  ```
- 🟡 `left-[calc(var(--sidebar-width)*-1)]` → `start-[calc(var(--sidebar-width)*-1)]`
  ```tsx
  ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
  ```

**Line 252:**
- 🟡 `right-0` → `end-0`
  ```tsx
  : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
  ```
- 🟡 `right-[calc(var(--sidebar-width)*-1)]` → `end-[calc(var(--sidebar-width)*-1)]`
  ```tsx
  : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
  ```

**Line 315:**
- 🟡 `right-4` → `end-4`
  ```tsx
  "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
  ```
- 🟡 `left-1` → `start-1`
  ```tsx
  "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
  ```
- 🟡 `left-0` → `start-0`
  ```tsx
  "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
  ```

**Line 319:**
- 🟡 `right-2` → `end-2`
  ```tsx
  "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
  ```

**Line 320:**
- 🟡 `left-2` → `start-2`
  ```tsx
  "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
  ```

**Line 338:**
- 🔴 `ml-2` → `ms-2`
  ```tsx
  "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
  ```
- 🔴 `ml-0` → `ms-0`
  ```tsx
  "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
  ```

**Line 475:**
- 🟡 `right-3` → `end-3`
  ```tsx
  "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
  ```

**Line 527:**
- 🔴 `pr-8` → `pe-8`
  ```tsx
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  ```
- 🔴 `text-left` → `text-start`
  ```tsx
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  ```

**Line 621:**
- 🟡 `right-1` → `end-1`
  ```tsx
  "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
  ```

**Line 646:**
- 🟡 `right-1` → `end-1`
  ```tsx
  "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
  ```


### components/ui/context-menu.tsx

**15 issue(s)**

**Line 29:**
- 🔴 `pl-8` → `ps-8`
  ```tsx
  inset && "pl-8",
  ```

**Line 35:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  <ChevronRight className="ml-auto h-4 w-4" />
  ```

**Line 47:**
- 🟡 `right-2` → `end-2`
  ```tsx
  "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-context-menu-content-transform-origin]",
  ```
- 🟡 `left-2` → `start-2`
  ```tsx
  "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-context-menu-content-transform-origin]",
  ```

**Line 63:**
- 🟡 `right-2` → `end-2`
  ```tsx
  "z-50 max-h-[--radix-context-menu-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-context-menu-content-transform-origin]",
  ```
- 🟡 `left-2` → `start-2`
  ```tsx
  "z-50 max-h-[--radix-context-menu-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-context-menu-content-transform-origin]",
  ```

**Line 82:**
- 🔴 `pl-8` → `ps-8`
  ```tsx
  inset && "pl-8",
  ```

**Line 97:**
- 🔴 `pr-2` → `pe-2`
  ```tsx
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```
- 🔴 `pl-8` → `ps-8`
  ```tsx
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```

**Line 103:**
- 🟡 `left-2` → `start-2`
  ```tsx
  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
  ```

**Line 121:**
- 🔴 `pr-2` → `pe-2`
  ```tsx
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```
- 🔴 `pl-8` → `ps-8`
  ```tsx
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```

**Line 126:**
- 🟡 `left-2` → `start-2`
  ```tsx
  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
  ```

**Line 146:**
- 🔴 `pl-8` → `ps-8`
  ```tsx
  inset && "pl-8",
  ```

**Line 173:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  "ml-auto text-xs tracking-widest text-muted-foreground",
  ```


### components/ui/dropdown-menu.tsx

**15 issue(s)**

**Line 31:**
- 🔴 `pl-8` → `ps-8`
  ```tsx
  inset && "pl-8",
  ```

**Line 37:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  <ChevronRight className="ml-auto" />
  ```

**Line 50:**
- 🟡 `right-2` → `end-2`
  ```tsx
  "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
  ```
- 🟡 `left-2` → `start-2`
  ```tsx
  "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
  ```

**Line 68:**
- 🟡 `right-2` → `end-2`
  ```tsx
  "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
  ```
- 🟡 `left-2` → `start-2`
  ```tsx
  "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
  ```

**Line 87:**
- 🔴 `pl-8` → `ps-8`
  ```tsx
  inset && "pl-8",
  ```

**Line 102:**
- 🔴 `pr-2` → `pe-2`
  ```tsx
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```
- 🔴 `pl-8` → `ps-8`
  ```tsx
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```

**Line 108:**
- 🟡 `left-2` → `start-2`
  ```tsx
  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
  ```

**Line 126:**
- 🔴 `pr-2` → `pe-2`
  ```tsx
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```
- 🔴 `pl-8` → `ps-8`
  ```tsx
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```

**Line 131:**
- 🟡 `left-2` → `start-2`
  ```tsx
  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
  ```

**Line 151:**
- 🔴 `pl-8` → `ps-8`
  ```tsx
  inset && "pl-8",
  ```

**Line 177:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
  ```


### components/ui/menubar.tsx

**15 issue(s)**

**Line 77:**
- 🔴 `pl-8` → `ps-8`
  ```tsx
  inset && "pl-8",
  ```

**Line 83:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  <ChevronRight className="ml-auto h-4 w-4" />
  ```

**Line 95:**
- 🟡 `right-2` → `end-2`
  ```tsx
  "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
  ```
- 🟡 `left-2` → `start-2`
  ```tsx
  "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
  ```

**Line 118:**
- 🟡 `right-2` → `end-2`
  ```tsx
  "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
  ```
- 🟡 `left-2` → `start-2`
  ```tsx
  "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
  ```

**Line 138:**
- 🔴 `pl-8` → `ps-8`
  ```tsx
  inset && "pl-8",
  ```

**Line 153:**
- 🔴 `pr-2` → `pe-2`
  ```tsx
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```
- 🔴 `pl-8` → `ps-8`
  ```tsx
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```

**Line 159:**
- 🟡 `left-2` → `start-2`
  ```tsx
  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
  ```

**Line 176:**
- 🔴 `pr-2` → `pe-2`
  ```tsx
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```
- 🔴 `pl-8` → `ps-8`
  ```tsx
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```

**Line 181:**
- 🟡 `left-2` → `start-2`
  ```tsx
  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
  ```

**Line 201:**
- 🔴 `pl-8` → `ps-8`
  ```tsx
  inset && "pl-8",
  ```

**Line 228:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  "ml-auto text-xs tracking-widest text-muted-foreground",
  ```


### app/dashboard/calendar/events/[eventId]/page.tsx

**9 issue(s)**

**Line 213:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Edit className="mr-2 h-4 w-4" />
  ```

**Line 217:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Trash2 className="mr-2 h-4 w-4" />
  ```

**Line 230:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Users className="mr-2 h-4 w-4" />
  ```

**Line 234:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Table className="mr-2 h-4 w-4" />
  ```

**Line 238:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <FileText className="mr-2 h-4 w-4" />
  ```

**Line 242:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <PenTool className="mr-2 h-4 w-4" />
  ```

**Line 246:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <ClipboardList className="mr-2 h-4 w-4" />
  ```

**Line 250:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <FolderOpen className="mr-2 h-4 w-4" />
  ```

**Line 275:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Edit className="mr-2 h-4 w-4" />
  ```


### app/dashboard/spreadsheets/page.tsx

**8 issue(s)**

**Line 168:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Sparkles className="h-4 w-4 mr-2" />
  ```

**Line 172:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Plus className="h-4 w-4 mr-2" />
  ```

**Line 189:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Sparkles className="h-4 w-4 mr-2" />
  ```

**Line 193:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Plus className="h-4 w-4 mr-2" />
  ```

**Line 224:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Edit className="h-4 w-4 mr-2" />
  ```

**Line 231:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Copy className="h-4 w-4 mr-2" />
  ```

**Line 242:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Trash2 className="h-4 w-4 mr-2" />
  ```

**Line 266:**
- 🔴 `mr-1` → `me-1`
  ```tsx
  <Clock className="h-3 w-3 mr-1" />
  ```


### components/ui/select.tsx

**8 issue(s)**

**Line 22:**
- 🔴 `text-left` → `text-start`
  ```tsx
  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:text-left [&>span]:flex-1 [&>span]:justify-start [&>span]:items-center [&>span]:flex",
  ```

**Line 78:**
- 🟡 `right-2` → `end-2`
  ```tsx
  "relative z-50 max-h-[200px] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
  ```
- 🟡 `left-2` → `start-2`
  ```tsx
  "relative z-50 max-h-[200px] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
  ```

**Line 108:**
- 🔴 `pr-2` → `pe-2`
  ```tsx
  className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
  ```
- 🔴 `pl-8` → `ps-8`
  ```tsx
  className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
  ```

**Line 121:**
- 🔴 `pr-2` → `pe-2`
  ```tsx
  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```
- 🔴 `pl-8` → `ps-8`
  ```tsx
  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```

**Line 126:**
- 🟡 `left-2` → `start-2`
  ```tsx
  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
  ```


### app/dashboard/players/[id]/page.tsx

**7 issue(s)**

**Line 143:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Edit className="mr-2 h-4 w-4" />
  ```

**Line 155:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <FileText className="mr-2 h-4 w-4" />
  ```

**Line 159:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Calendar className="mr-2 h-4 w-4" />
  ```

**Line 163:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <BarChart3 className="mr-2 h-4 w-4" />
  ```

**Line 167:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <StickyNote className="mr-2 h-4 w-4" />
  ```

**Line 171:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <FolderOpen className="mr-2 h-4 w-4" />
  ```

**Line 175:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Table className="mr-2 h-4 w-4" />
  ```


### components/calendar/event-detail-dialog.tsx

**7 issue(s)**

**Line 125:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Calendar className="mr-2 h-4 w-4" />
  ```

**Line 129:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Table className="mr-2 h-4 w-4" />
  ```

**Line 133:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <FileText className="mr-2 h-4 w-4" />
  ```

**Line 137:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <PenTool className="mr-2 h-4 w-4" />
  ```

**Line 141:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <ClipboardList className="mr-2 h-4 w-4" />
  ```

**Line 145:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <FolderOpen className="mr-2 h-4 w-4" />
  ```

**Line 149:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Users className="mr-2 h-4 w-4" />
  ```


### components/ui/navigation-menu.tsx

**7 issue(s)**

**Line 58:**
- 🔴 `ml-1` → `ms-1`
  ```tsx
  className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
  ```

**Line 72:**
- 🟡 `right-52` → `end-52`
  ```tsx
  "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
  ```
- 🟡 `right-52` → `end-52`
  ```tsx
  "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
  ```
- 🟡 `left-0` → `start-0`
  ```tsx
  "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
  ```
- 🟡 `left-52` → `start-52`
  ```tsx
  "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
  ```
- 🟡 `left-52` → `start-52`
  ```tsx
  "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
  ```

**Line 86:**
- 🟡 `left-0` → `start-0`
  ```tsx
  <div className={cn("absolute left-0 top-full flex justify-center")}>
  ```


### components/dashboard/forms-table.tsx

**6 issue(s)**

**Line 182:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Send className="mr-2 h-4 w-4" />
  ```

**Line 186:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Eye className="mr-2 h-4 w-4" />
  ```

**Line 190:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Copy className="mr-2 h-4 w-4" />
  ```

**Line 194:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <FileText className="mr-2 h-4 w-4" />
  ```

**Line 198:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Edit className="mr-2 h-4 w-4" />
  ```

**Line 766:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Plus className="mr-2 h-4 w-4" />
  ```


### components/spreadsheets/spreadsheet-grid.tsx

**6 issue(s)**

**Line 160:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Plus className="h-4 w-4 mr-2" />
  ```

**Line 170:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Trash2 className="h-4 w-4 mr-2" />
  ```

**Line 178:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Upload className="h-4 w-4 mr-2" />
  ```

**Line 185:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Download className="h-4 w-4 mr-2" />
  ```

**Line 194:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Sparkles className="h-4 w-4 mr-2" />
  ```

**Line 211:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Save className="h-4 w-4 mr-2" />
  ```


### components/ui/carousel.tsx

**6 issue(s)**

**Line 163:**
- 🔴 `ml-4` → `ms-4`
  ```tsx
  orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
  ```

**Line 186:**
- 🔴 `pl-4` → `ps-4`
  ```tsx
  orientation === "horizontal" ? "pl-4" : "pt-4",
  ```

**Line 209:**
- 🟡 `left-12` → `start-12`
  ```tsx
  ? "-left-12 top-1/2 -translate-y-1/2"
  ```

**Line 210:**
- 🟡 `left-1` → `start-1`
  ```tsx
  : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
  ```

**Line 238:**
- 🟡 `right-12` → `end-12`
  ```tsx
  ? "-right-12 top-1/2 -translate-y-1/2"
  ```

**Line 239:**
- 🟡 `left-1` → `start-1`
  ```tsx
  : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
  ```


### components/ui/dialog.tsx

**5 issue(s)**

**Line 41:**
- 🟡 `left-[50%]` → `start-[50%]`
  ```tsx
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  ```
- 🟡 `left-1` → `start-1`
  ```tsx
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  ```
- 🟡 `left-1` → `start-1`
  ```tsx
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  ```

**Line 47:**
- 🟡 `right-4` → `end-4`
  ```tsx
  <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
  ```

**Line 62:**
- 🔴 `text-left` → `text-start`
  ```tsx
  "flex flex-col space-y-1.5 text-center sm:text-left",
  ```


### app/dashboard/profile/tabs/profile-tab.tsx

**4 issue(s)**

**Line 178:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  ```

**Line 183:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Upload className="mr-2 h-4 w-4" />
  ```

**Line 260:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  ```

**Line 311:**
- 🔴 `pl-4` → `ps-4`
  ```tsx
  <ul className="mt-2 space-y-1 pl-4">
  ```


### components/dashboard/app-sidebar.tsx

**4 issue(s)**

**Line 172:**
- 🔴 `text-left` → `text-start`
  ```tsx
  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
  ```

**Line 178:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  <ChevronsUpDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
  ```

**Line 198:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <UserCircle className="mr-2 h-4 w-4" />
  ```

**Line 207:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <LogOut className="mr-2 h-4 w-4" />
  ```


### components/ui/alert-dialog.tsx

**4 issue(s)**

**Line 37:**
- 🟡 `left-[50%]` → `start-[50%]`
  ```tsx
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  ```
- 🟡 `left-1` → `start-1`
  ```tsx
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  ```
- 🟡 `left-1` → `start-1`
  ```tsx
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  ```

**Line 52:**
- 🔴 `text-left` → `text-start`
  ```tsx
  "flex flex-col space-y-2 text-center sm:text-left",
  ```


### components/ui/input-group.tsx

**4 issue(s)**

**Line 19:**
- 🔴 `pl-2` → `ps-2`
  ```tsx
  "has-[>[data-align=inline-start]]:[&>input]:pl-2",
  ```

**Line 20:**
- 🔴 `pr-2` → `pe-2`
  ```tsx
  "has-[>[data-align=inline-end]]:[&>input]:pr-2",
  ```

**Line 43:**
- 🔴 `pl-3` → `ps-3`
  ```tsx
  "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
  ```

**Line 45:**
- 🔴 `pr-3` → `pe-3`
  ```tsx
  "order-last pr-3 has-[>button]:mr-[-0.4rem] has-[>kbd]:mr-[-0.35rem]",
  ```


### app/dashboard/spreadsheets/[id]/page.tsx

**3 issue(s)**

**Line 223:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <ArrowLeft className="h-4 w-4 mr-2" />
  ```

**Line 273:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <History className="h-4 w-4 mr-2" />
  ```

**Line 294:**
- 🔴 `mr-1` → `me-1`
  ```tsx
  <Clock className="h-3 w-3 inline mr-1" />
  ```


### components/calendar/event-quick-view.tsx

**3 issue(s)**

**Line 76:**
- 🟡 `left-[50%]` → `start-[50%]`
  ```tsx
  "fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] border bg-background shadow-lg sm:rounded-lg p-0",
  ```

**Line 81:**
- 🟡 `right-4` → `end-4`
  ```tsx
  <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
  ```

**Line 160:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <ExternalLink className="mr-2 h-4 w-4" />
  ```


### components/calendar/template-selector-dialog.tsx

**3 issue(s)**

**Line 130:**
- 🔴 `pr-4` → `pe-4`
  ```tsx
  <ScrollArea className="max-h-[400px] pr-4">
  ```

**Line 143:**
- 🔴 `text-left` → `text-start`
  ```tsx
  'group relative flex items-start gap-4 rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50',
  ```

**Line 189:**
- 🔴 `mr-1` → `me-1`
  ```tsx
  <Sparkles className="mr-1 h-3 w-3" />
  ```


### components/dashboard/dashboard-layout-client.tsx

**3 issue(s)**

**Line 175:**
- 🔴 `ml-1` → `ms-1`
  ```tsx
  <SidebarTrigger className="-ml-1 shrink-0" />
  ```

**Line 176:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Separator orientation="vertical" className="mr-2 h-4 shrink-0" />
  ```

**Line 182:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  className="ml-auto shrink-0"
  ```


### components/data-table/data-table-bulk-actions.tsx

**3 issue(s)**

**Line 89:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  <div className="flex items-center gap-2 ml-auto">
  ```

**Line 95:**
- 🔴 `ml-2` → `ms-2`
  ```tsx
  <MoreHorizontal className="ml-2 h-4 w-4" />
  ```

**Line 117:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  {action.icon && <span className="mr-2">{action.icon}</span>}
  ```


### components/data-table/data-table-export.tsx

**3 issue(s)**

**Line 109:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <FileText className="mr-2 h-4 w-4" />
  ```

**Line 113:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <FileJson className="mr-2 h-4 w-4" />
  ```

**Line 117:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <FileDown className="mr-2 h-4 w-4" />
  ```


### components/ui/bulk-actions-bar.tsx

**3 issue(s)**

**Line 151:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  <div className="flex items-center gap-2 ml-auto">
  ```

**Line 158:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Save className="h-4 w-4 mr-2" />
  ```

**Line 168:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <X className="h-4 w-4 mr-2" />
  ```


### components/ui/data-table.tsx

**3 issue(s)**

**Line 64:**
- 🔴 `text-right` → `text-end`
  ```tsx
  header.column.id === 'actions' && 'text-right',
  ```

**Line 114:**
- 🟡 `right-0` → `end-0`
  ```tsx
  'absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none bg-border hover:bg-primary/50',
  ```

**Line 173:**
- 🔴 `text-right` → `text-end`
  ```tsx
  cell.column.id === 'actions' && 'text-right',
  ```


### components/ui/sheet.tsx

**3 issue(s)**

**Line 63:**
- 🟡 `right-0` → `end-0`
  ```tsx
  "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
  ```

**Line 65:**
- 🟡 `left-0` → `start-0`
  ```tsx
  "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
  ```

**Line 75:**
- 🟡 `right-4` → `end-4`
  ```tsx
  <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
  ```


### components/ui/table.tsx

**3 issue(s)**

**Line 76:**
- 🔴 `pr-0` → `pe-0`
  ```tsx
  "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 border-l-0 border-r-0",
  ```
- 🔴 `text-left` → `text-start`
  ```tsx
  "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 border-l-0 border-r-0",
  ```

**Line 99:**
- 🔴 `pr-0` → `pe-0`
  ```tsx
  className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
  ```


### app/error.tsx

**2 issue(s)**

**Line 45:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
  ```

**Line 50:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Home className="mr-2 h-4 w-4" aria-hidden="true" />
  ```


### components/dashboard/form-responses-table.tsx

**2 issue(s)**

**Line 104:**
- 🔴 `text-right` → `text-end`
  ```tsx
  <div className="text-right">
  ```

**Line 116:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Mail className="mr-2 h-4 w-4" />
  ```


### components/dashboard/players-table-new.tsx

**2 issue(s)**

**Line 151:**
- 🔴 `text-left` → `text-start`
  ```tsx
  className="font-medium text-foreground hover:text-primary hover:underline text-left"
  ```

**Line 1019:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <UserPlus className="mr-2 h-4 w-4" />
  ```


### components/search-form.tsx

**2 issue(s)**

**Line 21:**
- 🔴 `pl-8` → `ps-8`
  ```tsx
  className="pl-8"
  ```

**Line 23:**
- 🟡 `left-2` → `start-2`
  ```tsx
  <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
  ```


### components/spreadsheets/ai-assistant-dialog.tsx

**2 issue(s)**

**Line 167:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
  ```

**Line 172:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Sparkles className="h-4 w-4 mr-2" />
  ```


### components/spreadsheets/cells/date-cell.tsx

**2 issue(s)**

**Line 28:**
- 🔴 `text-left` → `text-start`
  ```tsx
  'h-full w-full justify-start text-left font-normal px-2 hover:bg-transparent',
  ```

**Line 33:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <CalendarIcon className="mr-2 h-4 w-4" />
  ```


### components/spreadsheets/cells/person-cell.tsx

**2 issue(s)**

**Line 46:**
- 🔴 `ml-2` → `ms-2`
  ```tsx
  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
  ```

**Line 65:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  'mr-2 h-4 w-4',
  ```


### components/spreadsheets/csv-import-dialog.tsx

**2 issue(s)**

**Line 108:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Upload className="h-4 w-4 mr-2" />
  ```

**Line 177:**
- 🔴 `text-left` → `text-start`
  ```tsx
  <th key={typeof col === 'string' ? col : col.id} className="p-2 text-left font-medium">
  ```


### components/ui/alert.tsx

**2 issue(s)**

**Line 7:**
- 🔴 `pl-7` → `ps-7`
  ```tsx
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  ```
- 🟡 `left-4` → `start-4`
  ```tsx
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  ```


### components/ui/calendar.tsx

**2 issue(s)**

**Line 84:**
- 🔴 `pr-1` → `pe-1`
  ```tsx
  : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
  ```
- 🔴 `pl-2` → `ps-2`
  ```tsx
  : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
  ```


### components/ui/command.tsx

**2 issue(s)**

**Line 44:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
  ```

**Line 135:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  "ml-auto text-xs tracking-widest text-muted-foreground",
  ```


### components/ui/date-picker.tsx

**2 issue(s)**

**Line 57:**
- 🔴 `text-left` → `text-start`
  ```tsx
  "w-full justify-start text-left font-normal",
  ```

**Line 63:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <CalendarIcon className="mr-2 h-4 w-4" />
  ```


### components/ui/hover-card.tsx

**2 issue(s)**

**Line 19:**
- 🟡 `right-2` → `end-2`
  ```tsx
  "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-hover-card-content-transform-origin]",
  ```
- 🟡 `left-2` → `start-2`
  ```tsx
  "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-hover-card-content-transform-origin]",
  ```


### components/ui/pagination.tsx

**2 issue(s)**

**Line 72:**
- 🔴 `pl-2` → `ps-2`
  ```tsx
  className={cn("gap-1 pl-2.5", className)}
  ```

**Line 88:**
- 🔴 `pr-2` → `pe-2`
  ```tsx
  className={cn("gap-1 pr-2.5", className)}
  ```


### components/ui/popover.tsx

**2 issue(s)**

**Line 20:**
- 🟡 `right-2` → `end-2`
  ```tsx
  "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",
  ```
- 🟡 `left-2` → `start-2`
  ```tsx
  "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",
  ```


### components/ui/resizable.tsx

**2 issue(s)**

**Line 32:**
- 🟡 `left-1` → `start-1`
  ```tsx
  "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
  ```
- 🟡 `left-0` → `start-0`
  ```tsx
  "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
  ```


### components/ui/time-picker.tsx

**2 issue(s)**

**Line 224:**
- 🔴 `pr-10` → `pe-10`
  ```tsx
  "w-full pr-10",
  ```

**Line 236:**
- 🟡 `right-0` → `end-0`
  ```tsx
  className="absolute right-0 h-full px-3 hover:bg-transparent"
  ```


### components/ui/tooltip.tsx

**2 issue(s)**

**Line 47:**
- 🟡 `right-2` → `end-2`
  ```tsx
  "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
  ```
- 🟡 `left-2` → `start-2`
  ```tsx
  "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
  ```


### components/version-switcher.tsx

**2 issue(s)**

**Line 41:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  <ChevronsUpDown className="ml-auto" />
  ```

**Line 54:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  {version === selectedVersion && <Check className="ml-auto" />}
  ```


### app/(auth)/login/page.tsx

**1 issue(s)**

**Line 104:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
  ```


### app/dashboard/calendar/calendar-client.tsx

**1 issue(s)**

**Line 339:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Plus className="mr-2 h-4 w-4" />
  ```


### app/dashboard/profile/tabs/notifications-tab.tsx

**1 issue(s)**

**Line 309:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  ```


### app/dashboard/profile/tabs/preferences-tab.tsx

**1 issue(s)**

**Line 271:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  ```


### app/dashboard/profile/tabs/security-tab.tsx

**1 issue(s)**

**Line 202:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  ```


### components/calendar/attendance-manager.tsx

**1 issue(s)**

**Line 276:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  ```


### components/calendar/event-form-dialog.tsx

**1 issue(s)**

**Line 722:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  ```


### components/dashboard/form-renderer.tsx

**1 issue(s)**

**Line 269:**
- 🔴 `ml-1` → `ms-1`
  ```tsx
  {field.required && <span className="text-destructive ml-1">*</span>}
  ```


### components/dashboard/quick-actions-toolbar.tsx

**1 issue(s)**

**Line 74:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Icon className="mr-2 h-4 w-4" />
  ```


### components/data-table/data-table-column-manager.tsx

**1 issue(s)**

**Line 183:**
- 🔴 `mr-2` → `me-2`
  ```tsx
  <Check className="mr-2 h-4 w-4" />
  ```


### components/login-form.tsx

**1 issue(s)**

**Line 28:**
- 🔴 `ml-auto` → `ms-auto`
  ```tsx
  className="ml-auto text-sm underline-offset-4 hover:underline"
  ```


### components/spreadsheets/template-gallery.tsx

**1 issue(s)**

**Line 110:**
- 🔴 `pr-4` → `pe-4`
  ```tsx
  <ScrollArea className="h-[600px] pr-4">
  ```


### components/ui/drawer.tsx

**1 issue(s)**

**Line 61:**
- 🔴 `text-left` → `text-start`
  ```tsx
  className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
  ```


### components/ui/field.tsx

**1 issue(s)**

**Line 208:**
- 🔴 `ml-4` → `ms-4`
  ```tsx
  <ul className="ml-4 flex list-disc flex-col gap-1">
  ```


### components/ui/table-filters.tsx

**1 issue(s)**

**Line 68:**
- 🔴 `text-left` → `text-start`
  ```tsx
  <SelectTrigger className={cn('h-10 shrink-0 [&>span]:text-left [&>span]:justify-start', width)}>
  ```


### scripts/validate-tokens.js

**1 issue(s)**

**Line 33:**
- 🟡 `left-[50%]` → `start-[50%]`
  ```tsx
  'top-[1px]', 'top-[60%]', 'top-[50%]', 'left-[50%]', // Positioning values
  ```


