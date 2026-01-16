import type { Meta, StoryObj } from '@storybook/react'
import { PageCard } from '@/components/ui/page-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Star, Download, FileText, Calendar, BarChart } from 'lucide-react'
import Link from 'next/link'

const meta: Meta = {
  title: 'Templates/Card Grid',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Card Grid Template

A responsive card grid layout pattern for displaying collections of items (reports, templates, documents).

## Pattern Structure
\`\`\`tsx
<PageCard
  title="Page Title"
  description="Page description"
  headerActions={<Button>Add Item</Button>}
  toolbar={
    <div className="flex gap-2">
      <Input placeholder="Search..." />
      <Select>...</Select>
    </div>
  }
>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {items.map(item => <Card>...</Card>)}
  </div>
</PageCard>
\`\`\`

## Responsive Grid
- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 3 columns
- Wide (xl): 4 columns

## Usage
This pattern is used for reports, templates, documents, and other card-based collections.

## Key Components
- **PageCard**: Container with title and toolbar
- **Card**: Individual item cards
- **Badge**: Status/category indicators
- **Input/Select**: Filtering controls
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Mock data
type Report = {
  id: string
  title: string
  description: string
  type: string
  category: string
  status: 'draft' | 'published' | 'archived'
  downloads: number
  rating?: number
  lastUpdated: string
  icon: React.ReactNode
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Player Performance Report',
    description: 'Comprehensive analysis of player stats and performance metrics',
    type: 'Analytics',
    category: 'Performance',
    status: 'published',
    downloads: 234,
    rating: 4.5,
    lastUpdated: '2 days ago',
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    id: '2',
    title: 'Team Statistics Summary',
    description: 'Weekly summary of team performance and key statistics',
    type: 'Summary',
    category: 'Team',
    status: 'published',
    downloads: 567,
    rating: 4.8,
    lastUpdated: '5 hours ago',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: '3',
    title: 'Match Day Report',
    description: 'Detailed breakdown of match events and player contributions',
    type: 'Match',
    category: 'Games',
    status: 'draft',
    downloads: 89,
    lastUpdated: '1 day ago',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    id: '4',
    title: 'Training Session Log',
    description: 'Attendance and performance tracking for training sessions',
    type: 'Training',
    category: 'Development',
    status: 'published',
    downloads: 145,
    rating: 4.2,
    lastUpdated: '3 days ago',
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    id: '5',
    title: 'Injury Report',
    description: 'Current injury status and recovery timelines for all players',
    type: 'Medical',
    category: 'Health',
    status: 'published',
    downloads: 423,
    rating: 4.7,
    lastUpdated: '6 hours ago',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: '6',
    title: 'Season Progress Report',
    description: 'Overview of season goals and achievement progress',
    type: 'Summary',
    category: 'Season',
    status: 'archived',
    downloads: 789,
    rating: 4.9,
    lastUpdated: '2 weeks ago',
    icon: <BarChart className="h-5 w-5" />,
  },
]

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  published: 'bg-success text-success-foreground',
  archived: 'bg-secondary text-secondary-foreground',
}

export const Default: Story = {
  render: () => (
    <PageCard
      title="Reports"
      description="Browse and manage your reports"
      headerActions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Report
        </Button>
      }
      toolbar={
        <div className="flex flex-col sm:flex-row gap-2">
          <Input placeholder="Search reports..." className="sm:w-64" />
          <Select defaultValue="all">
            <SelectTrigger className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="summary">Summary</SelectItem>
              <SelectItem value="match">Match</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="published">
            <SelectTrigger className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockReports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    {report.icon}
                  </div>
                </div>
                <Badge className={statusColors[report.status]}>
                  {report.status}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-2">{report.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {report.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">{report.type}</Badge>
                <Badge variant="outline">{report.category}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  {report.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{report.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{report.downloads}</span>
                  </div>
                </div>
                <span>{report.lastUpdated}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageCard>
  ),
}

export const TwoColumns: Story = {
  render: () => (
    <PageCard
      title="Reports"
      description="Browse and manage your reports"
      headerActions={<Button>Create Report</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockReports.slice(0, 4).map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    {report.icon}
                  </div>
                </div>
                <Badge className={statusColors[report.status]}>
                  {report.status}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-2">{report.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {report.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">{report.type}</Badge>
                <Badge variant="outline">{report.category}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  {report.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{report.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{report.downloads}</span>
                  </div>
                </div>
                <span>{report.lastUpdated}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageCard>
  ),
}

export const FourColumns: Story = {
  render: () => (
    <PageCard
      title="Reports"
      description="Browse and manage your reports"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockReports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  {report.icon}
                </div>
                <Badge className={statusColors[report.status]} className="text-xs">
                  {report.status}
                </Badge>
              </div>
              <CardTitle className="text-base">{report.title}</CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                {report.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  <span>{report.downloads}</span>
                </div>
                {report.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{report.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageCard>
  ),
}

export const EmptyState: Story = {
  render: () => (
    <PageCard
      title="Reports"
      description="Browse and manage your reports"
      headerActions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Report
        </Button>
      }
    >
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No reports yet</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          Create your first report to start tracking team performance and statistics
        </p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Report
        </Button>
      </div>
    </PageCard>
  ),
}

export const WithFeaturedSection: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Featured Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockReports.slice(0, 3).map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer border-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      {report.icon}
                    </div>
                  </div>
                  <Badge className="bg-primary">⭐ Featured</Badge>
                </div>
                <CardTitle className="text-lg mt-2">{report.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    {report.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{report.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{report.downloads}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <PageCard
        title="All Reports"
        description="Browse all available reports"
        toolbar={
          <Input placeholder="Search reports..." className="max-w-sm" />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      {report.icon}
                    </div>
                  </div>
                  <Badge className={statusColors[report.status]}>
                    {report.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-2">{report.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{report.lastUpdated}</span>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{report.downloads}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageCard>
    </div>
  ),
}
