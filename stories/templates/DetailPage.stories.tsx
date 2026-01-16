import type { Meta, StoryObj } from '@storybook/react'
import { PageCard } from '@/components/ui/page-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Edit, Mail, Phone, MapPin, Calendar, User, BarChart, FileText } from 'lucide-react'

const meta: Meta = {
  title: 'Templates/Detail Page',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Detail Page Template

A detail page layout pattern with header, tabs, and content sections.

## Pattern Structure
\`\`\`tsx
<PageCard
  title={<AvatarHeader />}
  description="Description or metadata"
  headerActions={<Button>Edit</Button>}
>
  <Tabs>
    <TabsList>
      <TabsTrigger>Overview</TabsTrigger>
      <TabsTrigger>Details</TabsTrigger>
      <TabsTrigger>History</TabsTrigger>
    </TabsList>
    <TabsContent>
      {/* Tab content */}
    </TabsContent>
  </Tabs>
</PageCard>
\`\`\`

## Usage
This pattern is used for player profiles, team details, report views, and other detail pages.

## Key Components
- **PageCard**: Container with title and actions
- **Avatar**: For profile pictures
- **Tabs**: Tab navigation for sections
- **Card**: Content cards within tabs
- **Badge**: Status indicators
- **Separator**: Visual dividers
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

const PlayerHeader = () => (
  <div className="flex items-center gap-4">
    <Avatar className="h-16 w-16">
      <AvatarImage src="https://i.pravatar.cc/150?img=1" />
      <AvatarFallback>MS</AvatarFallback>
    </Avatar>
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Marcus Silva</h1>
        <Badge className="bg-success text-success-foreground">Active</Badge>
      </div>
      <p className="text-sm text-muted-foreground">Forward • #10 • Brazil</p>
    </div>
  </div>
)

export const Default: Story = {
  render: () => (
    <PageCard
      title={<PlayerHeader />}
      headerActions={
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit Player
        </Button>
      }
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">24 years</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">marcus.silva@example.com</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">+1 234 567 8900</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">São Paulo, Brazil</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Player Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">Forward</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Jersey Number</p>
                  <p className="font-medium">#10</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Foot</p>
                  <p className="font-medium">Right</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Height / Weight</p>
                  <p className="font-medium">180 cm / 75 kg</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">January 15, 2023</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Season Summary</CardTitle>
              <CardDescription>2024/25 Season Performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Appearances</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Goals</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Assists</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Yellow Cards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+3 from last season</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Assists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+2 from last season</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pass Success</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">Above team average</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Shot Accuracy</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Dribble Success</span>
                  <span className="text-sm font-medium">82%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '82%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Pass Completion</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '87%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: '2 days ago', event: 'Scored 2 goals', team: 'vs Team B', badge: 'success' },
                  { date: '1 week ago', event: 'Provided assist', team: 'vs Team C', badge: 'success' },
                  { date: '2 weeks ago', event: 'Received yellow card', team: 'vs Team D', badge: 'warning' },
                  { date: '3 weeks ago', event: 'Man of the Match', team: 'vs Team E', badge: 'success' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-l-2 border-primary pl-4">
                    <div>
                      <p className="font-medium">{item.event}</p>
                      <p className="text-sm text-muted-foreground">{item.team}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{item.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageCard>
  ),
}

export const SimpleLayout: Story = {
  render: () => (
    <PageCard
      title="Report: Team Performance Analysis"
      description="Generated on January 15, 2025"
      headerActions={
        <div className="flex gap-2">
          <Button variant="outline">Download PDF</Button>
          <Button>Share</Button>
        </div>
      }
    >
      <Tabs defaultValue="summary" className="w-full">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The team has shown strong performance this season with 18 wins, 5 draws, and 3 losses.
                Key players have contributed significantly to the overall success.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Detailed performance metrics and analysis...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Visual data representations...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageCard>
  ),
}

export const WithIconTabs: Story = {
  render: () => (
    <PageCard
      title={<PlayerHeader />}
      headerActions={<Button>Edit Player</Button>}
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="gap-2">
            <User className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart className="h-4 w-4" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <FileText className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Player overview and key information...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Detailed performance statistics...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Player history and timeline...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageCard>
  ),
}
