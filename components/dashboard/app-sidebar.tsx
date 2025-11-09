'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Calendar,
  CalendarCheck,
  Database,
  FileText,
  Folder,
  Palette,
  Settings,
  StickyNote,
  Table,
  Users,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const navItems = [
  { label: 'Players', href: '/dashboard/players', icon: Users },
  { label: 'Forms', href: '/dashboard/forms', icon: FileText },
  { label: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { label: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { label: 'Notes', href: '/dashboard/notes', icon: StickyNote },
  { label: 'Spreadsheets', href: '/dashboard/spreadsheets', icon: Table },
  { label: 'Canvas', href: '/dashboard/canvas', icon: Palette },
  { label: 'Files', href: '/dashboard/files', icon: Folder },
  { label: 'Planner', href: '/dashboard/planner', icon: CalendarCheck },
]

const settingsItems = [
  { label: 'Data Management', href: '/dashboard/data-management', icon: Database },
  { label: 'System Settings', href: '/dashboard/system-settings', icon: Settings },
]

type AppSidebarProps = {
  userName: string
  userEmail?: string | null
}

function LogoBadge() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold uppercase text-sidebar-primary-foreground">
        L
      </div>
      <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
        <span className="text-sm font-semibold">Logo</span>
        <span className="text-xs text-sidebar-foreground/70">Enterprise</span>
      </div>
    </Link>
  )
}

export function AppSidebar({ userName, userEmail }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <LogoBadge />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => {
                const isActive = pathname?.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {userName?.[0]?.toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userName}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {userEmail ?? 'Team member'}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
