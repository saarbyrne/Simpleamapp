import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Users, 
  SquarePlay, 
  Calendar, 
  LogOut,
  Trophy,
  Brain,
  NotebookPen,
  User,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../auth/auth-provider'
import { PlayerManagement } from '../players/player-management'
import { TacticalBoardList } from '../tactical-board/tactical-board-list'
import { TacticalBoardEditor } from '../tactical-board/tactical-board-editor'
import { MatchPlanner } from '../tactical-board/match-planner'
import { NotesDashboard, AIInsightsDashboard } from '../notes/notes-dashboard'
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
  SidebarTrigger,
} from '../ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '../ui/breadcrumb'
import { Separator } from '../ui/separator'

interface TacticalBoard {
  id: string
  title: string
  formation: string
  phase_of_play?: string
  created_at: string
  objectives?: string[]
}

export function CoachDashboard() {
  const { signOut, user } = useAuth()
  const [activeSection, setActiveSection] = useState('games')
  const [activeTab, setActiveTab] = useState('boards')
  const [editingBoard, setEditingBoard] = useState<TacticalBoard | null>(null)
  const [planningMatch, setPlanningMatch] = useState<any>(null)

  const menuItems = [
    { id: 'games', label: 'Game Tactics', icon: Trophy },
    { id: 'training', label: 'Training', icon: Users },
    { id: 'players', label: 'Players', icon: User },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'strategy', label: 'Strategy', icon: Brain },
    { id: 'notes', label: 'Notes', icon: NotebookPen },
  ]

  const getBreadcrumbItems = () => {
    const section = menuItems.find(item => item.id === activeSection)
    return [
      { label: 'Dashboard', href: '/' },
      { label: section?.label || 'Unknown', current: true }
    ]
  }

  if (editingBoard) {
    return (
      <TacticalBoardEditor 
        board={editingBoard}
        onBack={() => setEditingBoard(null)}
        onSave={() => {
          // Handle save
          setEditingBoard(null)
        }}
      />
    )
  }

  if (planningMatch) {
    return (
      <MatchPlanner 
        match={planningMatch}
        onBack={() => setPlanningMatch(null)}
        onSave={() => {
          // Handle save
          setPlanningMatch(null)
        }}
      />
    )
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Trophy className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">LuvFutbol</span>
              <span className="truncate text-xs">Coach Platform</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeSection === item.id}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <Icon className="size-4" />
                        <span>{item.label}</span>
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
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {user?.email?.[0]?.toUpperCase() || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Coach</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    <ChevronRight className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {getBreadcrumbItems().map((item, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                    {item.current ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbItem>
                        <BreadcrumbLink href={item.href}>
                          {item.label}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    )}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {activeSection === 'games' && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" defaultValue="boards">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="boards">Tactics</TabsTrigger>
                <TabsTrigger value="fixtures">Games</TabsTrigger>
              </TabsList>

              <TabsContent value="boards" className="space-y-4">
                <TacticalBoardList 
                  onEditBoard={setEditingBoard}
                  onPlanMatch={setPlanningMatch}
                />
              </TabsContent>

              <TabsContent value="fixtures" className="space-y-4">
                {/* Game Scenarios */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Game Scenarios
                    </CardTitle>
                    <CardDescription>
                      Model real-life game situations using your tactics and players
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { 
                          scenario: 'High Press vs Low Block', 
                          formation: '4-3-3 vs 5-4-1', 
                          phase: 'Attacking Third', 
                          status: 'Active',
                          tactical_boards: 3
                        },
                        { 
                          scenario: 'Counter-Attack Training', 
                          formation: '4-4-2 vs 4-3-3', 
                          phase: 'Transition', 
                          status: 'Draft',
                          tactical_boards: 2
                        },
                        { 
                          scenario: 'Set Piece Defense', 
                          formation: '4-2-3-1 vs 4-4-2', 
                          phase: 'Defensive', 
                          status: 'Complete',
                          tactical_boards: 1
                        }
                      ].map((scenario, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                        >
                          <div>
                            <div className="font-medium">{scenario.scenario}</div>
                            <div className="text-sm text-muted-foreground">
                              {scenario.formation} • {scenario.phase}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={scenario.status === 'Active' ? 'default' : scenario.status === 'Draft' ? 'secondary' : 'outline'} className="text-xs">
                              {scenario.status}
                            </Badge>
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                              {scenario.tactical_boards}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tactical Sandbox */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Tactical Sandbox
                    </CardTitle>
                    <CardDescription>
                      Create hypothetical scenarios to test different tactical approaches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <SquarePlay className="h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Interactive game modeling coming soon</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                          Build dynamic scenarios with your players and tactics. Test different approaches, formations, and strategies in a risk-free environment.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center mt-3 text-xs text-muted-foreground">
                          <Badge variant="outline">Player Assignment</Badge>
                          <Badge variant="outline">Formation Testing</Badge>
                          <Badge variant="outline">Scenario Builder</Badge>
                          <Badge variant="outline">Tactical Analysis</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Match Preparation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Match Preparation
                    </CardTitle>
                    <CardDescription>
                      Link your game scenarios to upcoming fixtures
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { opponent: 'City FC', date: '2024-01-20', time: '15:00', venue: 'Home', competition: 'League', scenarios: 2 },
                        { opponent: 'United FC', date: '2024-01-27', time: '14:30', venue: 'Away', competition: 'Cup', scenarios: 1 },
                        { opponent: 'Rangers FC', date: '2024-02-03', time: '16:00', venue: 'Home', competition: 'League', scenarios: 0 }
                      ].map((match, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                        >
                          <div>
                            <div className="font-medium">vs {match.opponent}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(match.date).toLocaleDateString()} • {match.time}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {match.venue}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {match.competition}
                            </Badge>
                            {match.scenarios > 0 ? (
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                                {match.scenarios}
                              </div>
                            ) : (
                              <Button size="sm" variant="ghost" className="text-xs h-6">
                                Link Scenario
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {activeSection === 'training' && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" defaultValue="sessions">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="drills">Drill Library</TabsTrigger>
                <TabsTrigger value="planning">Planning</TabsTrigger>
              </TabsList>

              <TabsContent value="sessions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Training Sessions</CardTitle>
                    <CardDescription>
                      Build and manage training sessions with tactical focus
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <SquarePlay className="h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No training sessions</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                          Training session builder coming soon. Create structured sessions linked to your tactics.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="drills" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Drill Library</CardTitle>
                    <CardDescription>
                      Curated collection of professional drills and exercises
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <Users className="h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Drill library loading</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                          Professional drill library coming soon. Access proven exercises from top coaches.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="planning" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Training Planning</CardTitle>
                    <CardDescription>
                      Periodization and long-term training program development
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <Calendar className="h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Planning tools loading</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                          Periodization planning tools coming soon. Structure your long-term development programs.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {activeSection === 'players' && (
            <PlayerManagement />
          )}

          {activeSection === 'calendar' && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" defaultValue="schedule">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="periodization">Periodization</TabsTrigger>
              </TabsList>

              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar & Schedule</CardTitle>
                    <CardDescription>
                      Weekly and monthly view of training and matches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <Calendar className="h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Calendar view loading</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                          Interactive calendar coming soon. Visualize your training and match schedule.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="periodization" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Periodization Planning</CardTitle>
                    <CardDescription>
                      Macro, meso, and microcycle tactical and workload planning
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <Brain className="h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Periodization tools loading</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                          Advanced periodization planning coming soon. Plan your seasonal development cycles.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {activeSection === 'strategy' && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" defaultValue="philosophy">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="philosophy">Philosophy</TabsTrigger>
                <TabsTrigger value="principles">Principles</TabsTrigger>
                <TabsTrigger value="phases">Phases of Play</TabsTrigger>
              </TabsList>

              <TabsContent value="philosophy" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Philosophy of Play</CardTitle>
                    <CardDescription>
                      Define your team's high-level identity and core values
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <Brain className="h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Philosophy builder loading</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                          Philosophy development tools coming soon. Define your unique coaching identity.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="principles" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Principles of Play</CardTitle>
                    <CardDescription>
                      Set behavioral rules and tactical concepts for all phases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <Trophy className="h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Principles management loading</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                          Principles management coming soon. Define and organize your tactical concepts.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="phases" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Phases of Play</CardTitle>
                    <CardDescription>
                      Build-up, attacking, defensive and transition phases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <SquarePlay className="h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Phase analysis loading</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                          Phase analysis tools coming soon. Break down your tactics by game phases.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {activeSection === 'notes' && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" defaultValue="notebook">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notebook">Notebook</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="notebook" className="space-y-4">
                <NotesDashboard />
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <AIInsightsDashboard />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}