import { PageHeader } from '@/components/platform-admin/page-header'
import { logPlatformAdminAction } from '@/lib/platform-admin'
import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function UsersPage() {
  // Log access
  await logPlatformAdminAction('view_users', {})

  // Get all users across all organizations
  const users = await prisma.user.findMany({
    include: {
      organization: true,
      roles: {
        include: { role: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Users"
        description={`Managing ${users.length} users across all organizations`}
      />

      <div className="flex-1 p-8">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Auth Provider</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/platform-admin/organizations/${user.organization.id}`}
                        className="hover:underline"
                      >
                        {user.organization.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length === 0 ? (
                          <Badge variant="outline" className="text-xs">
                            No role
                          </Badge>
                        ) : (
                          user.roles.map((userRole) => (
                            <Badge key={userRole.id} variant="outline" className="text-xs">
                              {userRole.role.name}
                            </Badge>
                          ))
                        )}
                        {user.isPlatformAdmin && (
                          <Badge variant="destructive" className="text-xs">
                            Platform Admin
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {user.authProvider}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : <span className="text-muted-foreground">Never</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/platform-admin/users/${user.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Email Auth</p>
            <p className="text-2xl font-bold">
              {users.filter(u => u.authProvider === 'email').length}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Google Auth</p>
            <p className="text-2xl font-bold">
              {users.filter(u => u.authProvider === 'google').length}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Platform Admins</p>
            <p className="text-2xl font-bold">
              {users.filter(u => u.isPlatformAdmin).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
