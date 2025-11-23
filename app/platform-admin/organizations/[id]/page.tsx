import { PageHeader } from '@/components/platform-admin/page-header'
import { logPlatformAdminAction } from '@/lib/platform-admin'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Settings } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getFeatureCounts } from '@/lib/permissions/feature-access'

type OrganizationDetailsPageProps = {
  params: Promise<{ id: string }>
}

export default async function OrganizationDetailsPage({ params }: OrganizationDetailsPageProps) {
  const { id } = await params

  // Get organization with full details
  const organization = await prisma.organization.findUnique({
    where: { id },
    include: {
      users: {
        include: {
          roles: {
            include: { role: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      },
      subscriptions: {
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: {
          persons: true,
          forms: true,
          events: true,
          notes: true,
          files: true,
          spreadsheets: true,
          drawings: true,
        }
      }
    }
  })

  if (!organization) {
    notFound()
  }

  // Log access
  await logPlatformAdminAction('view_organization_details', {
    organizationId: id,
    organizationName: organization.name
  })

  const currentSubscription = organization.subscriptions[0]
  
  // Get feature counts
  const featureCounts = await getFeatureCounts(id)

  return (
    <div className="flex flex-col">
      <PageHeader
        title={organization.name}
        description={`Organization details and management`}
      >
        <Button variant="outline" size="sm" asChild>
          <Link href="/platform-admin/organizations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Organizations
          </Link>
        </Button>
      </PageHeader>

      <div className="flex-1 space-y-6 p-8">
        {/* Organization Info */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                <p className="text-sm">{organization.slug}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sport</p>
                <p className="text-sm">{organization.sport || 'Multi-sport'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{new Date(organization.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentSubscription ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Plan</p>
                    <Badge>{currentSubscription.plan}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}>
                      {currentSubscription.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Period End</p>
                    <p className="text-sm">
                      {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No active subscription</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Users</span>
                <span className="text-sm font-medium">{organization.users.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Persons</span>
                <span className="text-sm font-medium">{organization._count.persons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Forms</span>
                <span className="text-sm font-medium">{organization._count.forms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Events</span>
                <span className="text-sm font-medium">{organization._count.events}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Notes</span>
                <span className="text-sm font-medium">{organization._count.notes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Files</span>
                <span className="text-sm font-medium">{organization._count.files}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Enabled</span>
                  <span className="text-sm font-medium text-green-600">{featureCounts.enabled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Disabled</span>
                  <span className="text-sm font-medium text-red-600">{featureCounts.disabled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-sm font-medium">{featureCounts.total}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/platform-admin/organizations/${id}/features`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Features
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Team members in this organization</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organization.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.roles.map((userRole) => (
                          <Badge key={userRole.id} variant="outline" className="text-xs">
                            {userRole.role.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
