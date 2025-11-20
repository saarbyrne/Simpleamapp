'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, TrendingDown, TrendingUp, X, CheckCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface AIInsight {
  id: string
  type: string
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  data: any
  playerIds: string[]
  status: string
  createdAt: string
}

const priorityConfig = {
  high: {
    color: 'bg-destructive text-white hover:bg-destructive/90',
    icon: AlertTriangle,
    label: 'High Priority'
  },
  medium: {
    color: 'bg-orange-600 text-white hover:bg-orange-700',
    icon: TrendingDown,
    label: 'Medium Priority'
  },
  low: {
    color: 'bg-blue-600 text-white hover:bg-blue-700',
    icon: TrendingUp,
    label: 'Low Priority'
  }
}

const typeIcons: Record<string, any> = {
  injury_risk: AlertTriangle,
  wellness_decline: TrendingDown,
  load_spike: TrendingUp,
  form_completion: CheckCircle
}

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInsights()
  }, [])

  const loadInsights = async () => {
    try {
      const response = await fetch('/api/ai/insights')
      if (response.ok) {
        const data = await response.json()
        setInsights(data.insights)
      }
    } catch (error) {
      console.error('Failed to load insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = async (insightId: string) => {
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          insightId,
          action: 'dismiss'
        })
      })

      if (response.ok) {
        setInsights(prev => prev.filter(i => i.id !== insightId))
      }
    } catch (error) {
      console.error('Failed to dismiss insight:', error)
    }
  }

  const handleActOn = async (insightId: string) => {
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          insightId,
          action: 'act_on'
        })
      })

      if (response.ok) {
        setInsights(prev => prev.filter(i => i.id !== insightId))
      }
    } catch (error) {
      console.error('Failed to act on insight:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Loading insights...
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Active Insights</h3>
        <p className="text-sm text-muted-foreground">
          The AI is monitoring your data and will alert you to important patterns
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Insights</h3>
        <Badge variant="outline">{insights.length} active</Badge>
      </div>

      {insights.map((insight) => {
        const config = priorityConfig[insight.priority]
        const TypeIcon = typeIcons[insight.type] || AlertTriangle

        return (
          <Card key={insight.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <TypeIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-semibold">{insight.title}</h4>
                    <Badge className={config.color} variant="secondary">
                      {config.label}
                    </Badge>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDismiss(insight.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {insight.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true })}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleActOn(insight.id)}
                    >
                      Take Action
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
