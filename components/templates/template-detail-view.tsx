'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Download, Heart, Share2, CheckCircle2 } from 'lucide-react'
import { formatDate } from '@/lib/date'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createReview } from '@/app/actions/templates'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type TemplateDetailProps = {
  template: {
    id: string
    name: string
    description: string
    longDescription: string | null
    type: string
    category: string
    sport: string
    tags: string[]
    features: string[]
    downloads: number
    rating: number | null
    reviewCount: number
    isOfficial: boolean
    isFeatured: boolean
    author?: {
      id: string
      name: string
      avatar: string | null
    } | null
    authorName?: string | null
    orgName?: string | null
    createdAt: Date
    publishedAt: Date | null
    reviews?: Array<{
      id: string
      rating: number
      content: string
      createdAt: Date
      user: {
        id: string
        name: string
        avatar: string | null
      }
      helpfulCount: number
    }>
  }
  currentUserId?: string
}

export function TemplateDetailView({ template, currentUserId }: TemplateDetailProps) {
  const router = useRouter()
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewContent, setReviewContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasUserReviewed = template.reviews?.some((r) => r.user.id === currentUserId)

  const handleSubmitReview = async () => {
    if (!reviewContent.trim()) {
      toast.error('Please write a review')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createReview(template.id, reviewRating, reviewContent)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Review submitted successfully')
        setIsReviewing(false)
        setReviewContent('')
        setReviewRating(5)
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  const ratingDistribution = template.reviews
    ? [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        count: template.reviews!.filter((r) => r.rating === stars).length,
        percentage:
          template.reviews!.length > 0
            ? (template.reviews!.filter((r) => r.rating === stars).length /
                template.reviews!.length) *
              100
            : 0,
      }))
    : []

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl">{template.name}</CardTitle>
              <CardDescription className="text-base mt-2">
                {template.description}
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-4">
                {template.isFeatured && (
                  <Badge variant="default" className="bg-primary">
                    ⭐ Featured
                  </Badge>
                )}
                {template.isOfficial && (
                  <Badge variant="default">✓ Official</Badge>
                )}
                <Badge variant="outline">
                  {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                </Badge>
                <Badge variant="outline">
                  {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                </Badge>
                <Badge variant="outline">
                  {template.sport.charAt(0).toUpperCase() + template.sport.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="lg">Use Template</Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Download className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{template.downloads.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </div>
            <div>
              <Star className="h-6 w-6 mx-auto mb-2 text-yellow-400 fill-yellow-400" />
              <div className="text-2xl font-bold">
                {template.rating ? template.rating.toFixed(1) : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">
                Rating ({template.reviewCount} reviews)
              </div>
            </div>
            <div>
              <div className="text-xl mb-2">📅</div>
              <div className="text-lg font-bold">
                {template.publishedAt ? formatDate(template.publishedAt) : 'Draft'}
              </div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      {template.longDescription && (
        <Card>
          <CardHeader>
            <CardTitle>About This Template</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {template.longDescription}
            </p>
          </CardContent>
        </Card>
      )}

      {/* What's Included */}
      {template.features && template.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>What&apos;s Included</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {template.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {template.tags && template.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Author */}
      <Card>
        <CardHeader>
          <CardTitle>Created By</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {template.isOfficial ? (
              <>
                <div className="text-3xl">🏆</div>
                <div>
                  <div className="font-semibold text-lg">SimpleAM</div>
                  <Badge variant="default" className="mt-1">
                    Official
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Professional templates from SimpleAM
                  </p>
                </div>
              </>
            ) : (
              <>
                <Avatar className="h-16 w-16">
                  {template.author?.avatar ? (
                    <AvatarImage src={template.author.avatar} alt={template.author.name} />
                  ) : (
                    <AvatarFallback className="text-xl">
                      {template.author?.name?.charAt(0) || template.authorName?.charAt(0) || '?'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-semibold text-lg">
                    {template.author?.name || template.authorName}
                  </div>
                  {template.orgName && (
                    <p className="text-sm text-muted-foreground">{template.orgName}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reviews ({template.reviewCount})</CardTitle>
            {currentUserId && !hasUserReviewed && !isReviewing && (
              <Button onClick={() => setIsReviewing(true)}>Write a Review</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Summary */}
          {template.rating && template.reviewCount > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold">{template.rating.toFixed(1)}</div>
                <div className="flex items-center justify-center gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(template.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {template.reviewCount} reviews
                </div>
              </div>
              <div className="space-y-2">
                {ratingDistribution.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-2">
                    <div className="text-sm w-8">{dist.stars} ★</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${dist.percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground w-12 text-right">
                      {dist.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Write Review Form */}
          {isReviewing && currentUserId && (
            <div className="space-y-4 border rounded-lg p-4">
              <div>
                <Label>Your Rating</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= reviewRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review">Your Review</Label>
                <Textarea
                  id="review"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Share your experience with this template..."
                  rows={4}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button variant="outline" onClick={() => setIsReviewing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Review List */}
          {template.reviews && template.reviews.length > 0 && (
            <div className="space-y-4">
              {template.reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      {review.user.avatar ? (
                        <AvatarImage src={review.user.avatar} alt={review.user.name} />
                      ) : (
                        <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{review.user.name}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                      <p className="mt-2 text-muted-foreground">{review.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(!template.reviews || template.reviews.length === 0) && !isReviewing && (
            <div className="text-center py-8 text-muted-foreground">
              No reviews yet. Be the first to review this template!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
