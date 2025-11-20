import { Suspense } from 'react'
import { TemplatesHubWrapper } from '@/components/templates/templates-hub-wrapper'
import { type TemplateRow } from '@/components/templates/templates-table'
import { getTemplates, getFeaturedTemplates } from '@/app/actions/templates'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Star, Download } from 'lucide-react'

type TemplatesPageProps = {
  searchParams: {
    type?: string
    category?: string
    sport?: string
    search?: string
    sort?: 'popular' | 'rating' | 'newest'
    page?: string
    pageSize?: string
  }
}

async function FeaturedTemplates() {
  const { templates } = await getFeaturedTemplates()

  if (!templates || templates.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Featured Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.slice(0, 6).map((template) => (
          <Link key={template.id} href={`/dashboard/templates/${template.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="default" className="bg-primary">
                    ⭐ Featured
                  </Badge>
                  {template.isOfficial && (
                    <Badge variant="default">✓ Official</Badge>
                  )}
                  <Badge variant="outline">
                    {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    {template.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{template.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{template.downloads}</span>
                    </div>
                  </div>
                  {template.isOfficial ? (
                    <span className="font-semibold text-primary">SimpleAM</span>
                  ) : (
                    <span>{template.author?.name}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

async function TemplatesData({ searchParams }: TemplatesPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 0
  const pageSize = searchParams.pageSize ? parseInt(searchParams.pageSize, 10) : 20

  const result = await getTemplates({
    type: searchParams.type,
    category: searchParams.category,
    sport: searchParams.sport,
    search: searchParams.search,
    sort: searchParams.sort,
    page,
    pageSize,
  })

  if (result.error) {
    console.error('Error fetching templates:', result.error)
  }

  const { templates = [], total = 0 } = result

  const templateRows: TemplateRow[] = templates.map((template) => ({
    id: template.id,
    name: template.name,
    description: template.description,
    type: template.type,
    category: template.category,
    sport: template.sport,
    tags: template.tags,
    downloads: template.downloads,
    rating: template.rating,
    reviewCount: template.reviewCount,
    isOfficial: template.isOfficial,
    isFeatured: template.isFeatured,
    author: template.author,
    authorName: template.authorName,
    orgName: template.orgName,
    createdAt: template.createdAt,
    publishedAt: template.publishedAt,
  }))

  return (
    <div className="space-y-6">
      <FeaturedTemplates />
      <TemplatesHubWrapper templates={templateRows} total={total} />
    </div>
  )
}

function TemplatesLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Featured Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default async function TemplatesPage({ searchParams }: TemplatesPageProps) {
  return (
    <Suspense fallback={<TemplatesLoading />}>
      <TemplatesData searchParams={searchParams} />
    </Suspense>
  )
}
