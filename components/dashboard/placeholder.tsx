import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type DashboardPlaceholderProps = {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function DashboardPlaceholder({
  title,
  description,
  actionLabel = 'Back to Players',
  actionHref = '/dashboard/players',
}: DashboardPlaceholderProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            This workspace will follow the same shadcn-based shell as the players roster.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
