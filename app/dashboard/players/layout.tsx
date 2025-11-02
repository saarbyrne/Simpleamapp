'use client'

import { useState } from "react"
import {
  Users,
  FileText,
  BarChart,
  Calendar,
  StickyNote,
  Table,
  Palette,
  Folder,
  ListTodo,
  Database,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type PageId =
  | "players"
  | "forms"
  | "reports"
  | "calendar"
  | "notes"
  | "spreadsheets"
  | "canvas"
  | "files"
  | "planner"
  | "data-management"
  | "system-settings"

interface NavItem {
  id: PageId
  title: string
  icon: React.ElementType
  href: string
}

const navItems: NavItem[] = [
  { id: "players", title: "Players", icon: Users, href: "/dashboard/players" },
  { id: "forms", title: "Forms", icon: FileText, href: "/dashboard/forms" },
  { id: "reports", title: "Reports", icon: BarChart, href: "/dashboard/reports" },
  { id: "calendar", title: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
  { id: "notes", title: "Notes", icon: StickyNote, href: "/dashboard/notes" },
  { id: "spreadsheets", title: "Spreadsheets", icon: Table, href: "/dashboard/spreadsheets" },
  { id: "canvas", title: "Canvas", icon: Palette, href: "/dashboard/canvas" },
  { id: "files", title: "Files", icon: Folder, href: "/dashboard/files" },
  { id: "planner", title: "Planner", icon: ListTodo, href: "/dashboard/planner" },
  { id: "data-management", title: "Data Management", icon: Database, href: "/dashboard/data" },
  { id: "system-settings", title: "System Settings", icon: Settings, href: "/dashboard/settings" },
]

function AppSidebar({ currentPage }: { currentPage: PageId }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-primary-foreground">S</span>
                </div>
                <div className="grid flex-1 text-left">
                  <span className="truncate">SimpleAM</span>
                  <span className="truncate text-xs text-muted-foreground">Pro</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    tooltip={item.title}
                    asChild
                  >
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard/profile">
                <Avatar className="size-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left">
                  <span className="truncate">John Doe</span>
                  <span className="truncate text-xs text-muted-foreground">john@example.com</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default function PlayersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar currentPage="players" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-[rgb(255,255,255)]">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Players</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
