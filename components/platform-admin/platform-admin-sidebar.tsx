'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  FileText,
  Settings,
  ArrowLeft,
} from 'lucide-react'

const navigation = [
  {
    name: 'Overview',
    href: '/platform-admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Organizations',
    href: '/platform-admin/organizations',
    icon: Building2,
  },
  {
    name: 'Users',
    href: '/platform-admin/users',
    icon: Users,
  },
  {
    name: 'Billing',
    href: '/platform-admin/billing',
    icon: CreditCard,
  },
  {
    name: 'Templates',
    href: '/platform-admin/templates',
    icon: FileText,
    badge: 'Soon',
  },
  {
    name: 'Settings',
    href: '/platform-admin/settings',
    icon: Settings,
    badge: 'Soon',
  },
]

type PlatformAdminSidebarProps = {
  adminName: string
  adminEmail: string
}

export function PlatformAdminSidebar({ adminName, adminEmail }: PlatformAdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/10">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Settings className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Platform Admin</span>
            <span className="text-xs text-muted-foreground">SaaS Management</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
                          (item.href !== '/platform-admin' && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Back to Main App */}
      <div className="border-t p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Main App</span>
        </Link>
      </div>

      {/* Admin Info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{adminName}</p>
            <p className="truncate text-xs text-muted-foreground">{adminEmail}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
