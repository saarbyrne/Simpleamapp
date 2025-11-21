import { PageHeader } from '@/components/platform-admin/page-header'
import { logPlatformAdminAction } from '@/lib/platform-admin'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function OrganizationsPage() {
  // Log access
  await logPlatformAdminAction('view_organizations', {})

  // Get all organizations with stats
  const organizations = await prisma.organization.findMany({
    include: {
      _count: {
        select: {
          users: true,
          persons: true,
          forms: true,
          events: true,
        }
      },
      subscriptions: {
        take: 1,
        orderBy: { createdAt: 'desc' }
      },
      users: {
        take: 1,
        orderBy: { createdAt: 'asc' },
        select: {
          email: true,
          createdAt: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Organizations"
        description={`Managing ${organizations.length} customer organizations`}
      />

      <div className="flex-1 p-8">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No organizations found
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map((org) => {
                  const subscription = org.subscriptions[0]
                  const isActive = subscription?.status === 'active'
                  const isPaid = subscription?.plan !== 'free' && isActive

                  return (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {org.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {org.sport || 'Multi-sport'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{org._count.users} users</div>
                          <div className="text-xs text-muted-foreground">
                            {org._count.persons} persons
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{org._count.forms} forms</div>
                          <div className="text-xs text-muted-foreground">
                            {org._count.events} events
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={isPaid ? 'default' : 'secondary'}>
                            {subscription?.plan || 'Free'}
                          </Badge>
                          {subscription && (
                            <Badge
                              variant={isActive ? 'default' : 'destructive'}
                              className={isActive ? 'bg-green-500' : ''}
                            >
                              {subscription.status}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(org.createdAt).toLocaleDateString()}</div>
                          {org.users[0] && (
                            <div className="text-xs text-muted-foreground">
                              by {org.users[0].email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/platform-admin/organizations/${org.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
