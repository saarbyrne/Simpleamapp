import { PageHeader } from '@/components/platform-admin/page-header'
import { logPlatformAdminAction } from '@/lib/platform-admin'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type UserDetailsPageProps = {
  params: Promise<{ id: string }>
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = await params

  // Get user with full details
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      organization: true,
      roles: {
        include: { role: true }
      },
      activities: {
        take: 20,
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: {
          notes: true,
          files: true,
          formResponses: true,
        }
      }
    }
  })

  if (!user) {
    notFound()
  }

  // Log access
  await logPlatformAdminAction('view_user_details', {
    userId: id,
    userEmail: user.email
  })

  return (
    <div className="flex flex-col">
      <PageHeader
        title={user.name}
        description="User details and activity"
      >
        <Button variant="outline" size="sm" asChild>
          <Link href="/platform-admin/users">
            <ArrowLeft className="me-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </PageHeader>

      <div className="flex-1 space-y-6 p-8">
        {/* User Info */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-sm">{user.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Auth Provider</p>
                <Badge variant="secondary">{user.authProvider}</Badge>
              </div>
              {user.isPlatformAdmin && (
                <div>
                  <Badge variant="destructive">Platform Admin</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <Link
                  href={`/platform-admin/organizations/${user.organization.id}`}
                  className="text-sm hover:underline"
                >
                  {user.organization.name}
                </Link>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Roles</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {user.roles.length === 0 ? (
                    <Badge variant="outline" className="text-xs">
                      No role assigned
                    </Badge>
                  ) : (
                    user.roles.map((userRole) => (
                      <Badge key={userRole.id} variant="outline" className="text-xs">
                        {userRole.role.name}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Permissions</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {user.roles.flatMap(r => r.role.permissions).slice(0, 3).map((perm, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                  {user.roles.flatMap(r => r.role.permissions).length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{user.roles.flatMap(r => r.role.permissions).length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Joined</p>
                <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                <p className="text-sm">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
              <div className="pt-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Notes</span>
                  <span className="text-sm font-medium">{user._count.notes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Files</span>
                  <span className="text-sm font-medium">{user._count.files}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Form Responses</span>
                  <span className="text-sm font-medium">{user._count.formResponses}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Last 20 actions performed by this user</CardDescription>
          </CardHeader>
          <CardContent>
            {user.activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity recorded</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <Badge variant="outline">{activity.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                        {JSON.stringify(activity.data)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(activity.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
