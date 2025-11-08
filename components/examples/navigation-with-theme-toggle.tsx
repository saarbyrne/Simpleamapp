/**
 * Example: Navigation with Theme Toggle
 *
 * This example demonstrates how to integrate the ThemeToggle component
 * into your navigation bar or sidebar. Copy and adapt this pattern for
 * your application's navigation structure.
 */

import { ThemeToggle, ThemeToggleSimple } from '@/components/ui/theme-toggle';
import { Icon } from '@/components/ui/icon';
import { HomeIcon, SettingsIcon, UserIcon, BellIcon } from 'lucide-react';

/**
 * Example 1: Header Navigation with Dropdown Theme Toggle
 * Best for: Main application header
 */
export function HeaderWithThemeToggle() {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold">SimpleAM</h1>

          {/* Main Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <a href="/dashboard" className="text-sm hover:text-primary">
              Dashboard
            </a>
            <a href="/players" className="text-sm hover:text-primary">
              Players
            </a>
            <a href="/reports" className="text-sm hover:text-primary">
              Reports
            </a>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <button className="rounded-md p-2 hover:bg-accent">
            <Icon icon={BellIcon} size="md" label="Notifications" />
          </button>

          {/* Theme Toggle - Dropdown variant */}
          <ThemeToggle />

          <button className="rounded-md p-2 hover:bg-accent">
            <Icon icon={UserIcon} size="md" label="User menu" />
          </button>
        </div>
      </div>
    </header>
  );
}

/**
 * Example 2: Sidebar Navigation with Simple Theme Toggle
 * Best for: Sidebar or collapsed navigation
 */
export function SidebarWithThemeToggle() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-semibold">SimpleAM</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-4">
        <a
          href="/dashboard"
          className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
        >
          <Icon icon={HomeIcon} size="md" decorative />
          <span className="text-sm">Dashboard</span>
        </a>
        <a
          href="/players"
          className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
        >
          <Icon icon={UserIcon} size="md" decorative />
          <span className="text-sm">Players</span>
        </a>
        <a
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
        >
          <Icon icon={SettingsIcon} size="md" decorative />
          <span className="text-sm">Settings</span>
        </a>
      </nav>

      {/* Sidebar Footer with Theme Toggle */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Theme</span>

          {/* Theme Toggle - Simple variant for sidebar */}
          <ThemeToggleSimple />
        </div>
      </div>
    </aside>
  );
}

/**
 * Example 3: Mobile Navigation with Theme Toggle
 * Best for: Mobile menu drawer
 */
export function MobileNavWithThemeToggle() {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <h1 className="text-lg font-semibold">SimpleAM</h1>
        <button className="rounded-md p-2">
          <span className="sr-only">Close menu</span>
          ✕
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <a
          href="/dashboard"
          className="flex items-center gap-3 rounded-md px-4 py-3 text-base hover:bg-accent"
        >
          <Icon icon={HomeIcon} size="md" decorative />
          <span>Dashboard</span>
        </a>
        <a
          href="/players"
          className="flex items-center gap-3 rounded-md px-4 py-3 text-base hover:bg-accent"
        >
          <Icon icon={UserIcon} size="md" decorative />
          <span>Players</span>
        </a>
        <a
          href="/settings"
          className="flex items-center gap-3 rounded-md px-4 py-3 text-base hover:bg-accent"
        >
          <Icon icon={SettingsIcon} size="md" decorative />
          <span>Settings</span>
        </a>
      </nav>

      {/* Mobile Footer with Theme Toggle */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between rounded-md bg-muted p-4">
          <div>
            <p className="text-sm font-medium">Appearance</p>
            <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

/**
 * Example 4: Settings Page with Theme Toggle
 * Best for: Settings/preferences page
 */
export function SettingsWithThemeToggle() {
  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>

      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Appearance</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Choose how SimpleAM looks to you. Select a single theme, or sync with your system.
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Other Settings... */}
      </div>
    </div>
  );
}

/**
 * Example 5: Compact Navigation Bar
 * Best for: Minimal header designs
 */
export function CompactNavWithThemeToggle() {
  return (
    <nav className="border-b bg-background">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <span className="font-semibold">SimpleAM</span>
          <div className="flex items-center gap-6 text-sm">
            <a href="/dashboard" className="hover:text-primary">Dashboard</a>
            <a href="/players" className="hover:text-primary">Players</a>
          </div>
        </div>

        {/* Minimal right side with just theme toggle */}
        <ThemeToggleSimple />
      </div>
    </nav>
  );
}

/**
 * How to use these examples:
 *
 * 1. Choose the navigation pattern that matches your app
 * 2. Copy the example component
 * 3. Adapt the navigation items to your routes
 * 4. Import in your layout or page
 *
 * Example in app/dashboard/layout.tsx:
 *
 * ```typescript
 * import { HeaderWithThemeToggle } from '@/components/examples/navigation-with-theme-toggle'
 *
 * export default function DashboardLayout({ children }) {
 *   return (
 *     <div>
 *       <HeaderWithThemeToggle />
 *       <main>{children}</main>
 *     </div>
 *   )
 * }
 * ```
 */
