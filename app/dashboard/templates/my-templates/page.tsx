import { Suspense } from 'react'
import { getUserTemplates } from '@/app/actions/templates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Star, Download, Eye, Edit, Trash2 } from 'lucide-react'
import { PageCard } from '@/components/ui/page-card'
import { formatDate } from '@/lib/date-utils'

async function MyTemplatesData() {
  const result = await getUserTemplates()

  if (result.error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{result.error}</p>
      </div>
    )
  }

  const { templates } = result

  if (templates.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-6xl">📋</div>
        <div>
          <h3 className="text-lg font-semibold">No templates yet</h3>
          <p className="text-muted-foreground">
            Share your first template with the community
          </p>
        </div>
        <Link href="/dashboard/templates">
          <Button>Browse Templates</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                    {template.isFeatured && (
                      <Badge variant="default" className="bg-primary">
                        ⭐ Featured
                      </Badge>
                    )}
                    {template.isOfficial && (
                      <Badge variant="default">✓ Official</Badge>
                    )}
                  </div>
                  <CardDescription className="mt-1">
                    {template.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline">
                      {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      {template.sport.charAt(0).toUpperCase() + template.sport.slice(1)}
                    </Badge>
                    <Badge
                      variant={
                        template.status === 'published'
                          ? 'default'
                          : template.status === 'draft'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/templates/${template.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>Downloads</span>
                  </div>
                  <div className="text-lg font-semibold mt-1">
                    {template.downloads.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span>Rating</span>
                  </div>
                  <div className="text-lg font-semibold mt-1">
                    {template.rating ? template.rating.toFixed(1) : 'N/A'}
                    {template.reviewCount > 0 && (
                      <span className="text-sm text-muted-foreground ml-1">
                        ({template.reviewCount})
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Created</div>
                  <div className="text-sm font-medium mt-1">
                    {formatDate(template.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Published</div>
                  <div className="text-sm font-medium mt-1">
                    {template.publishedAt ? formatDate(template.publishedAt) : 'Not published'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function MyTemplatesLoading() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
            <div className="flex gap-2 mt-3">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function MyTemplatesPage() {
  return (
    <PageCard
      title="My Templates"
      description="Manage your published templates and track their performance"
      headerActions={
        <Link href="/dashboard/templates">
          <Button variant="outline">Browse All Templates</Button>
        </Link>
      }
    >
      <Suspense fallback={<MyTemplatesLoading />}>
        <MyTemplatesData />
      </Suspense>
    </PageCard>
  )
}
