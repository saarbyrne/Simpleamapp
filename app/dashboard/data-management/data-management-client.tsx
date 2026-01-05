'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  UserCog,
  Calendar,
  FileText,
  Table,
  Archive,
  Plus,
  Database,
  TrendingUp,
} from 'lucide-react'
import { PageCard } from '@/components/ui/page-card'

interface DataSummary {
  players: number
  staff: number
  events: number
  forms: number
  customTables: number
}

interface DataManagementClientProps {
  dataSummary?: DataSummary
}

interface DataTable {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  count: number
  route: string
  color: string
  features: string[]
}

export function DataManagementClient({ dataSummary }: DataManagementClientProps) {
  const router = useRouter()

  // Provide default values if dataSummary is undefined
  const summary = dataSummary || {
    players: 0,
    staff: 0,
    events: 0,
    forms: 0,
    customTables: 0,
  }

  const dataTables: DataTable[] = [
    {
      id: 'players',
      name: 'Players',
      description: 'Manage player profiles, performance data, and history',
      icon: <Users className="h-6 w-6" />,
      count: summary.players,
      route: '/dashboard/data-management/players',
      color: 'text-blue-600 dark:text-blue-400',
      features: ['Profiles', 'Performance', 'Medical', 'History'],
    },
    {
      id: 'staff',
      name: 'Staff',
      description: 'Coaches, medical staff, and administrative personnel',
      icon: <UserCog className="h-6 w-6" />,
      count: summary.staff,
      route: '/dashboard/data-management/staff',
      color: 'text-purple-600 dark:text-purple-400',
      features: ['Roles', 'Responsibilities', 'Schedules'],
    },
    {
      id: 'events',
      name: 'Events',
      description: 'Training sessions, matches, and organizational events',
      icon: <Calendar className="h-6 w-6" />,
      count: summary.events,
      route: '/dashboard/data-management/events',
      color: 'text-green-600 dark:text-green-400',
      features: ['Training', 'Matches', 'Attendance'],
    },
    {
      id: 'forms',
      name: 'Forms & Responses',
      description: 'Data collection forms and submitted responses',
      icon: <FileText className="h-6 w-6" />,
      count: summary.forms,
      route: '/dashboard/forms',
      color: 'text-orange-600 dark:text-orange-400',
      features: ['Custom Fields', 'Responses', 'Analytics'],
    },
    {
      id: 'custom',
      name: 'Custom Data Tables',
      description: 'User-defined spreadsheets for any additional data',
      icon: <Table className="h-6 w-6" />,
      count: summary.customTables,
      route: '/dashboard/data-management/custom-tables',
      color: 'text-cyan-600 dark:text-cyan-400',
      features: ['Flexible Schema', 'Version Control', 'Permissions'],
    },
  ]

  return (
    <div className="container mx-auto pb-8">
      <PageCard
        variant="table"
        title="Data Management"
        description="View and manage all your organization's data. Every change is tracked, versioned, and recoverable."
        headerActions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/dashboard/trash')}>
              <Archive className="h-4 w-4 me-2" />
              Trash
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/data-management/analytics')}
            >
              <TrendingUp className="h-4 w-4 me-2" />
              Analytics
            </Button>
          </div>
        }
      >
        {/* Data Tables Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dataTables.map((table) => (
            <Card
              key={table.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
              onClick={() => router.push(table.route)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-muted ${table.color}`}>
                    {table.icon}
                  </div>
                  <Badge variant="secondary" className="text-lg font-semibold">
                    {table.count.toLocaleString()}
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-4">{table.name}</CardTitle>
                <CardDescription>{table.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {table.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-start"
              onClick={() => router.push('/dashboard/players?action=new')}
            >
              <Plus className="h-5 w-5 mb-2" />
              <span className="font-semibold">Add Player</span>
              <span className="text-xs text-muted-foreground">Create new player profile</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-start"
              onClick={() => router.push('/dashboard/events?action=new')}
            >
              <Plus className="h-5 w-5 mb-2" />
              <span className="font-semibold">Schedule Event</span>
              <span className="text-xs text-muted-foreground">Training or match</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-start"
              onClick={() => router.push('/dashboard/forms?action=new')}
            >
              <Plus className="h-5 w-5 mb-2" />
              <span className="font-semibold">Create Form</span>
              <span className="text-xs text-muted-foreground">Collect custom data</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-start"
              onClick={() => router.push('/dashboard/data-management/custom-tables?action=new')}
            >
              <Plus className="h-5 w-5 mb-2" />
              <span className="font-semibold">Custom Table</span>
              <span className="text-xs text-muted-foreground">For any other data</span>
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-muted rounded-lg border">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Complete Data Control</h4>
              <p className="text-sm text-muted-foreground">
                All changes to your data are tracked and can be restored. Use Custom Data Tables
                for flexible data that doesn't fit into standard categories. Set granular
                permissions to control who can view and edit each table.
              </p>
            </div>
          </div>
        </div>
      </PageCard>
    </div>
  )
}
