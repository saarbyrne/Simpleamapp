'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  UserCircle,
  LogOut,
  ChevronsUpDown,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/app/actions/profile'
import { toast } from 'sonner'

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
  { label: 'Profile', href: '/dashboard/profile', icon: UserCircle },
  { label: 'Data Management', href: '/dashboard/data-management', icon: Database },
  { label: 'System Settings', href: '/dashboard/system-settings', icon: Settings },
]

type AppSidebarProps = {
  userName: string
  userEmail?: string | null
  userAvatar?: string | null
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

export function AppSidebar({ userName, userEmail, userAvatar }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const result = await signOut()
    if (result.success) {
      toast.success('Signed out successfully')
      router.push('/login')
    } else {
      toast.error(result.error || 'Failed to sign out')
    }
  }

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={userName}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userAvatar || undefined} alt={userName} />
                    <AvatarFallback className="rounded-lg">
                      {userName?.[0]?.toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{userName}</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {userEmail ?? 'Team member'}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
                side="top"
                sideOffset={8}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
