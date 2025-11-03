/**
 * Z-Index Token System
 *
 * CRITICAL: This token system solves the root cause of our modal/dialog issues.
 *
 * The Problem:
 * - Random z-index values throughout codebase (z-10, z-50, z-9999)
 * - No clear hierarchy or system
 * - Components fighting for visual priority
 * - Stacking context conflicts causing modals to appear beneath other elements
 *
 * The Solution:
 * - Structured z-index scale with clear purpose and hierarchy
 * - Named tokens that communicate intent
 * - Grouped by layer (base → content → navigation → overlays → popups)
 * - Guarantees correct visual stacking order
 *
 * Based on a 100-step scale for clear separation and room for edge cases.
 */

/**
 * Base Layer (0-99)
 * Default document flow and foundational elements
 */
export const base = {
  // Default z-index (document flow)
  default: 0,

  // Below default (background decorations)
  below: -1,

  // Slightly elevated (sticky table headers, subtle overlays)
  elevated: 10,
} as const;

/**
 * Content Layer (100-199)
 * Main content area elements that need elevation
 */
export const content = {
  // Sticky elements (sticky headers, breadcrumbs)
  sticky: 100,

  // Dropdown menus in content area
  dropdown: 150,

  // Popovers in content area
  popover: 160,

  // Tooltips in content area
  tooltip: 170,
} as const;

/**
 * Navigation Layer (200-299)
 * Primary navigation and sidebar elements
 */
export const navigation = {
  // Sidebar/drawer (off-canvas navigation)
  sidebar: 200,

  // Header/top navigation bar
  header: 250,

  // Mobile menu (when open)
  mobileMenu: 280,
} as const;

/**
 * Overlay Layer (300-399)
 * Full-screen or partial overlays that block interaction
 */
export const overlay = {
  // Sheet overlays (slide-out panels)
  sheet: 300,

  // Drawer overlays
  drawer: 350,

  // Modal backdrops
  modalBackdrop: 400,
} as const;

/**
 * Modal Layer (400-499)
 * Dialog modals and their content
 */
export const modal = {
  // Dialog content (sits above backdrop)
  content: 450,

  // Nested modal content (modals inside modals)
  nested: 460,

  // Modal close button and controls
  controls: 470,
} as const;

/**
 * Popup Layer (500-599)
 * Elements that appear above everything else
 */
export const popup = {
  // Dropdown menus (select, combobox)
  dropdown: 500,

  // Popover content
  popover: 550,

  // Tooltip content
  tooltip: 560,

  // Command palette
  commandPalette: 570,

  // Context menus (right-click menus)
  contextMenu: 580,
} as const;

/**
 * Notification Layer (600-699)
 * Temporary notifications and alerts
 */
export const notification = {
  // Toast notifications
  toast: 600,

  // Banner alerts (top of page)
  banner: 650,

  // Snackbar notifications
  snackbar: 660,
} as const;

/**
 * Maximum Layer (700+)
 * Absolutely critical elements that must appear above everything
 */
export const maximum = {
  // Loading overlays (full-screen loaders)
  loadingOverlay: 700,

  // System alerts (critical errors, warnings)
  systemAlert: 750,

  // Debug tools (developer overlays)
  debug: 800,

  // Browser-level UI (if needed)
  maximum: 999,
} as const;

/**
 * Legacy Z-Index Mapping
 * Maps old arbitrary values to new systematic values
 * Used for migration from old codebase
 */
export const legacy = {
  // Old: z-10 (sidebar) → New: z-[200]
  'z-10': navigation.sidebar,

  // Old: z-50 (dropdowns) → New: z-[500]
  'z-50': popup.dropdown,

  // Old: z-9999 (modal backdrop) → New: z-[400]
  'z-9999': overlay.modalBackdrop,

  // Old: z-10000 (modal content) → New: z-[450]
  'z-10000': modal.content,

  // Old: z-50000 (select dropdown) → New: z-[500]
  'z-50000': popup.dropdown,
} as const;

/**
 * Component-Specific Z-Index
 * Pre-assigned values for specific components
 * These are the values we'll use throughout the codebase
 */
export const component = {
  // Sidebar component
  sidebar: navigation.sidebar,
  sidebarInset: content.sticky,

  // Dialog/Modal component
  dialogOverlay: overlay.modalBackdrop,
  dialogContent: modal.content,
  dialogClose: modal.controls,

  // Sheet component (slide-out panels)
  sheetOverlay: overlay.sheet,
  sheetContent: overlay.sheet + 10,

  // Drawer component
  drawerOverlay: overlay.drawer,
  drawerContent: overlay.drawer + 10,

  // Select component
  selectTrigger: base.default,
  selectContent: popup.dropdown,

  // Dropdown component
  dropdownTrigger: base.default,
  dropdownContent: popup.dropdown,

  // Popover component
  popoverTrigger: base.default,
  popoverContent: popup.popover,

  // Tooltip component
  tooltipTrigger: base.default,
  tooltipContent: popup.tooltip,

  // Toast component
  toast: notification.toast,

  // Command palette
  commandPalette: popup.commandPalette,
  commandPaletteOverlay: overlay.modalBackdrop - 50,

  // Context menu
  contextMenu: popup.contextMenu,

  // Header navigation
  header: navigation.header,
  headerDropdown: navigation.header + 10,

  // Sticky elements
  stickyHeader: content.sticky,
  stickyFooter: content.sticky,
} as const;

/**
 * Type Exports for TypeScript
 */
export type BaseZIndex = keyof typeof base;
export type ContentZIndex = keyof typeof content;
export type NavigationZIndex = keyof typeof navigation;
export type OverlayZIndex = keyof typeof overlay;
export type ModalZIndex = keyof typeof modal;
export type PopupZIndex = keyof typeof popup;
export type NotificationZIndex = keyof typeof notification;
export type MaximumZIndex = keyof typeof maximum;
export type ComponentZIndex = keyof typeof component;

/**
 * Unified Z-Index Token Export
 */
export const zIndex = {
  base,
  content,
  navigation,
  overlay,
  modal,
  popup,
  notification,
  maximum,
  component,
  legacy,
} as const;

export type ZIndexTokens = typeof zIndex;

/**
 * Helper function to get z-index value
 * Provides type-safe access to z-index tokens
 */
export function getZIndex(layer: keyof typeof component): number {
  return component[layer];
}

/**
 * Documentation: Z-Index Hierarchy
 *
 * Visual representation of stacking order (bottom to top):
 *
 * ┌─────────────────────────────────────────┐
 * │ 999: Browser-level UI (maximum)         │
 * ├─────────────────────────────────────────┤
 * │ 800: Debug tools                        │
 * │ 750: System alerts                      │
 * │ 700: Loading overlays                   │
 * ├─────────────────────────────────────────┤
 * │ 660: Snackbar notifications             │
 * │ 650: Banner alerts                      │
 * │ 600: Toast notifications                │
 * ├─────────────────────────────────────────┤
 * │ 580: Context menus                      │
 * │ 570: Command palette                    │
 * │ 560: Tooltips                           │
 * │ 550: Popovers                           │
 * │ 500: Dropdowns (select, combobox)      │
 * ├─────────────────────────────────────────┤
 * │ 470: Modal controls                     │
 * │ 460: Nested modals                      │
 * │ 450: Modal content                      │
 * │ 400: Modal backdrop                     │
 * ├─────────────────────────────────────────┤
 * │ 350: Drawer overlay                     │
 * │ 300: Sheet overlay                      │
 * ├─────────────────────────────────────────┤
 * │ 280: Mobile menu                        │
 * │ 250: Header navigation                  │
 * │ 200: Sidebar                            │
 * ├─────────────────────────────────────────┤
 * │ 170: Content tooltips                   │
 * │ 160: Content popovers                   │
 * │ 150: Content dropdowns                  │
 * │ 100: Sticky elements                    │
 * ├─────────────────────────────────────────┤
 * │  10: Elevated content                   │
 * │   0: Default (document flow)            │
 * │  -1: Below default (backgrounds)        │
 * └─────────────────────────────────────────┘
 *
 * CRITICAL RULES:
 *
 * 1. NEVER use arbitrary z-index values in components
 * 2. ALWAYS import from this token system
 * 3. If you need a new z-index, ADD IT HERE first
 * 4. Modal backdrops must be lower than modal content
 * 5. Tooltips/popovers must be higher than modals
 * 6. Navigation must be lower than overlays
 * 7. Toast notifications should be above everything except system alerts
 *
 * MIGRATION PLAN:
 *
 * 1. Replace all `z-10` with `z-[${zIndex.component.sidebar}]`
 * 2. Replace all `z-50` with `z-[${zIndex.component.selectContent}]`
 * 3. Replace all `z-9999` with `z-[${zIndex.component.dialogOverlay}]`
 * 4. Replace all `z-10000` with `z-[${zIndex.component.dialogContent}]`
 * 5. Replace all `z-50000` with `z-[${zIndex.component.selectContent}]`
 */
