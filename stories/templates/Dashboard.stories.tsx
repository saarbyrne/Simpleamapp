import type { Meta, StoryObj } from '@storybook/react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Users, TrendingUp, Calendar, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const meta: Meta = {
  title: 'Templates/Dashboard',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Dashboard Template

A dashboard layout pattern with stats cards, charts, and activity sections.

## Pattern Structure
\`\`\`tsx
<div className="space-y-6">
  <PageHeader title="Dashboard" />

  {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardHeader>
        <CardTitle>Metric</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">Value</div>
      </CardContent>
    </Card>
  </div>

  {/* Charts & Details */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <Card>Chart</Card>
    <Card>Activity</Card>
  </div>
</div>
\`\`\`

## Responsive Grid
- **Stats**: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)
- **Charts**: 1 col (mobile) → 2 cols (desktop)

## Usage
This pattern is used for dashboard overviews, analytics pages, and summary views.

## Key Components
- **PageHeader**: Page title and description
- **Card**: Stats and content containers
- **Badge**: Status indicators
- **Progress**: Progress bars
- **Icons**: lucide-react icons for visual hierarchy
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your team's performance and activity"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +12% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-muted-foreground">No change</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Games</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Next game in 3 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +8% from last month
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Season Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Season Progress</CardTitle>
            <CardDescription>Track your team's performance this season</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Games Played</span>
                <span className="text-sm text-muted-foreground">18 / 38</span>
              </div>
              <Progress value={47} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Win Rate</span>
                <span className="text-sm text-muted-foreground">67%</span>
              </div>
              <Progress value={67} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Goal Completion</span>
                <span className="text-sm text-muted-foreground">42 / 60</span>
              </div>
              <Progress value={70} />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '2 hours ago', activity: 'New player added', details: 'Marcus Silva joined the team' },
                { time: '5 hours ago', activity: 'Game scheduled', details: 'vs Team B on Jan 20' },
                { time: '1 day ago', activity: 'Report published', details: 'Weekly Performance Report' },
                { time: '2 days ago', activity: 'Training completed', details: '24 players attended' },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.activity}</p>
                      <p className="text-xs text-muted-foreground">{item.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                    </div>
                  </div>
                  {index < 3 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Overview</CardTitle>
              <CardDescription>Key statistics and performance metrics</CardDescription>
            </div>
            <Button variant="outline" size="sm">View Details</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Wins</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Draws</p>
              <p className="text-2xl font-bold">4</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Losses</p>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">67%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
}

export const WithAlerts: Story = {
  render: () => (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your team's performance" />

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="text-warning flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              3 reports are due in the next 48 hours
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Users className="h-5 w-5" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              5 players need medical clearance
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Review Players
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">No change</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Games</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Next game in 3 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
}

export const SimpleDashboard: Story = {
  render: () => (
    <div className="space-y-6">
      <PageHeader title="Team Dashboard" />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">248</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">67%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
}
