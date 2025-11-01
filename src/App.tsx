import { useState } from "react";
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
  UserPlus,
} from "lucide-react@0.487.0";
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
} from "./components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
import { Separator } from "./components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { PlayersTable } from "./components/players-table";

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
  | "user-profile";

interface NavItem {
  id: PageId;
  title: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: "players", title: "Players", icon: Users },
  { id: "forms", title: "Forms", icon: FileText },
  { id: "reports", title: "Reports", icon: BarChart },
  { id: "calendar", title: "Calendar", icon: Calendar },
  { id: "notes", title: "Notes", icon: StickyNote },
  { id: "spreadsheets", title: "Spreadsheets", icon: Table },
  { id: "canvas", title: "Canvas", icon: Palette },
  { id: "files", title: "Files", icon: Folder },
  { id: "planner", title: "Planner", icon: ListTodo },
  { id: "data-management", title: "Data Management", icon: Database },
  { id: "system-settings", title: "System Settings", icon: Settings },
];

function AppSidebar({ currentPage, onPageChange }: { currentPage: PageId; onPageChange: (page: PageId) => void }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-primary-foreground">L</span>
                </div>
                <div className="grid flex-1 text-left">
                  <span className="truncate">Logo</span>
                  <span className="truncate text-xs text-muted-foreground">Enterprise</span>
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
                    onClick={() => onPageChange(item.id)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
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
            <SidebarMenuButton
              size="lg"
              isActive={currentPage === "user-profile"}
              onClick={() => onPageChange("user-profile")}
            >
              <Avatar className="size-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left">
                <span className="truncate">John Doe</span>
                <span className="truncate text-xs text-muted-foreground">john@example.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

interface PageHeaderProps {
  currentPage: PageId;
  selectedPlayer?: { id: string; name: string } | null;
  onNavigateBack?: () => void;
}

function PageHeader({ currentPage, selectedPlayer, onNavigateBack }: PageHeaderProps) {
  const currentItem = navItems.find((item) => item.id === currentPage);
  const pageTitle = currentPage === "user-profile" ? "User Profile" : currentItem?.title || "Dashboard";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-[rgb(255,255,255)]">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {selectedPlayer ? (
              <BreadcrumbLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateBack?.();
                }}
              >
                {pageTitle}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {selectedPlayer && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{selectedPlayer.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>("players");
  const [selectedPlayer, setSelectedPlayer] = useState<{ id: string; name: string } | null>(null);

  const handlePageChange = (page: PageId) => {
    setCurrentPage(page);
    setSelectedPlayer(null);
  };

  const handlePlayerClick = (playerId: string, playerName: string) => {
    setSelectedPlayer({ id: playerId, name: playerName });
  };

  const handleNavigateBack = () => {
    setSelectedPlayer(null);
  };

  return (
    <SidebarProvider>
      <AppSidebar currentPage={currentPage} onPageChange={handlePageChange} />
      <SidebarInset>
        <PageHeader
          currentPage={currentPage}
          selectedPlayer={selectedPlayer}
          onNavigateBack={handleNavigateBack}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
          {currentPage === "players" && !selectedPlayer && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Players</CardTitle>
                    <CardDescription>
                      Manage your team roster and player information.
                    </CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Player
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <PlayersTable onPlayerClick={handlePlayerClick} />
              </CardContent>
            </Card>
          )}
          {currentPage === "players" && selectedPlayer && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedPlayer.name}</CardTitle>
                <CardDescription>Player profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Player profile content will go here...
                </p>
              </CardContent>
            </Card>
          )}
          {currentPage !== "players" && (
            <Card>
              <CardHeader>
                <CardTitle>{navItems.find((item) => item.id === currentPage)?.title || currentPage}</CardTitle>
                <CardDescription>Page content coming soon...</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This page is under construction.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
