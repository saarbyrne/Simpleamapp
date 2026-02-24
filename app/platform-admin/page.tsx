import { PageHeader } from '@/components/platform-admin/page-header'
import { StatsCard } from '@/components/platform-admin/stats-card'
import { getPlatformStats, logPlatformAdminAction } from '@/lib/platform-admin'
import { prisma } from '@/lib/db'
import { Building2, Users, CreditCard, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function PlatformAdminPage() {
  // Log access
  await logPlatformAdminAction('view_dashboard', {})

  // Get platform statistics
  const stats = await getPlatformStats()

  // Get recent organizations
  const recentOrganizations = await prisma.organization.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { users: true }
      },
      subscriptions: true
    }
  })

  // Get recent users
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      organization: true
    }
  })

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Platform Overview"
        description="Monitor and manage your SaaS platform"
      />

      <div className="flex-1 space-y-6 p-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Organizations"
            value={stats.totalOrganizations}
            description="Customer teams"
            icon={Building2}
            trend={{
              value: stats.newOrgsLast30Days,
              label: 'new in last 30 days'
            }}
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            description="Across all organizations"
            icon={Users}
          />
          <StatsCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions}
            description="Paying customers"
            icon={CreditCard}
          />
          <StatsCard
            title="Conversion Rate"
            value={stats.totalOrganizations > 0
              ? `${Math.round((stats.activeSubscriptions / stats.totalOrganizations) * 100)}%`
              : '0%'}
            description="Free to paid"
            icon={TrendingUp}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Organizations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Organizations</CardTitle>
              <CardDescription>Latest customer sign-ups</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrganizations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No organizations yet</p>
              ) : (
                <div className="space-y-4">
                  {recentOrganizations.map((org) => (
                    <div key={org.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{org.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {org._count.users} users • {org.sport || 'Multi-sport'}
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="text-xs font-medium">
                          {org.subscriptions?.plan || 'Free'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(org.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest user sign-ups</CardDescription>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No users yet</p>
              ) : (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-end">
                        <p className="text-xs font-medium">{user.organization.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
