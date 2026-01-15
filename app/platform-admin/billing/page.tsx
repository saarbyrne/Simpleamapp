import { PageHeader } from '@/components/platform-admin/page-header'
import { StatsCard } from '@/components/platform-admin/stats-card'
import { logPlatformAdminAction } from '@/lib/platform-admin'
import { billingStatusColors } from '@/design-system/tokens/status-colors'
import { PLAN_PRICING } from '@/lib/platform-admin'
import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function BillingPage() {
  // Log access
  await logPlatformAdminAction('view_billing', {})

  // Get all subscriptions with organization details
  const subscriptions = await prisma.subscription.findMany({
    include: {
      organization: {
        include: {
          _count: {
            select: { users: true }
          }
        }
      }
    },
    orderBy: { currentPeriodEnd: 'asc' }
  })

  // Calculate metrics
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
  const paidSubscriptions = activeSubscriptions.filter(s => s.plan !== 'free')

  // Calculate MRR (Monthly Recurring Revenue)
  const mrr = paidSubscriptions.reduce((sum, sub) => {
    const price = PLAN_PRICING[sub.plan as keyof typeof PLAN_PRICING] || 0
    return sum + price
  }, 0)

  // Calculate ARR (Annual Recurring Revenue)
  const arr = mrr * 12

  // Count by plan
  const planCounts = {
    free: subscriptions.filter(s => s.plan === 'free' && s.status === 'active').length,
    pro: subscriptions.filter(s => s.plan === 'pro' && s.status === 'active').length,
    enterprise: subscriptions.filter(s => s.plan === 'enterprise' && s.status === 'active').length,
  }

  // Subscriptions expiring soon (next 7 days)
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

  const expiringSoon = subscriptions.filter(
    s => s.status === 'active' &&
         new Date(s.currentPeriodEnd) <= sevenDaysFromNow &&
         s.plan !== 'free'
  )

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Billing & Subscriptions"
        description="Revenue metrics and subscription management"
      />

      <div className="flex-1 space-y-6 p-8">
        {/* Revenue Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Monthly Recurring Revenue"
            value={`$${mrr.toLocaleString()}`}
            description="Active paid subscriptions"
            icon={DollarSign}
          />
          <StatsCard
            title="Annual Recurring Revenue"
            value={`$${arr.toLocaleString()}`}
            description="Projected annual revenue"
            icon={TrendingUp}
          />
          <StatsCard
            title="Paid Customers"
            value={paidSubscriptions.length}
            description={`${planCounts.pro} Pro, ${planCounts.enterprise} Enterprise`}
            icon={Users}
          />
          <StatsCard
            title="Active Subscriptions"
            value={activeSubscriptions.length}
            description={`${subscriptions.length} total (${planCounts.free} free)`}
            icon={CreditCard}
          />
        </div>

        {/* Plan Breakdown */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Free Plan</h3>
            <p className="mt-2 text-3xl font-bold">{planCounts.free}</p>
            <p className="mt-1 text-sm text-muted-foreground">organizations</p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Pro Plan</h3>
            <p className="mt-2 text-3xl font-bold">{planCounts.pro}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ${(planCounts.pro * PLAN_PRICING.pro).toLocaleString()}/mo revenue
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Enterprise Plan</h3>
            <p className="mt-2 text-3xl font-bold">{planCounts.enterprise}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ${(planCounts.enterprise * PLAN_PRICING.enterprise).toLocaleString()}/mo revenue
            </p>
          </div>
        </div>

        {/* Expiring Soon Alert */}
        {expiringSoon.length > 0 && (
          <div className={`rounded-lg border p-4 ${billingStatusColors.warning}`}>
            <h3 className="font-medium">
              {expiringSoon.length} subscription{expiringSoon.length > 1 ? 's' : ''} expiring in the next 7 days
            </h3>
            <p className="mt-1 text-sm">
              Review these subscriptions to ensure renewal
            </p>
          </div>
        )}

        {/* Subscriptions Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Period End</TableHead>
                <TableHead>Stripe</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No subscriptions found
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((subscription) => {
                  const isExpiringSoon = expiringSoon.some(s => s.id === subscription.id)
                  const monthlyRevenue = PLAN_PRICING[subscription.plan as keyof typeof PLAN_PRICING] || 0

                  return (
                    <TableRow key={subscription.id} className={isExpiringSoon ? 'bg-warning/10' : ''}>
                      <TableCell>
                        <Link
                          href={`/platform-admin/organizations/${subscription.organization.id}`}
                          className="font-medium hover:underline"
                        >
                          {subscription.organization.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            subscription.plan === 'enterprise' ? 'default' :
                            subscription.plan === 'pro' ? 'secondary' :
                            'outline'
                          }
                        >
                          {subscription.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            subscription.status === 'active' ? 'default' :
                            subscription.status === 'past_due' ? 'destructive' :
                            'secondary'
                          }
                          className={subscription.status === 'active' ? 'bg-success' : ''}
                        >
                          {subscription.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {subscription.organization._count.users}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${monthlyRevenue}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {subscription.stripeSubscriptionId ? (
                          <a
                            href={`https://dashboard.stripe.com/subscriptions/${subscription.stripeSubscriptionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View in Stripe
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/platform-admin/organizations/${subscription.organization.id}`}>
                            View
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
