'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'

interface AiAssistantProps {
  drawingData: any
  drawingType?: string
}

interface Suggestion {
  title: string
  description: string
  category: 'tactical' | 'positioning' | 'movement' | 'general'
}

export function AiAssistant({ drawingData, drawingType }: AiAssistantProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)

  const generateSuggestions = async () => {
    setLoading(true)
    try {
      // Simulate AI analysis - in production, this would call an AI API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate mock suggestions based on drawing type
      const mockSuggestions: Suggestion[] = []

      if (drawingType === 'formation') {
        mockSuggestions.push(
          {
            title: 'Compress defensive line',
            description:
              'Your defensive line appears deep. Consider pushing higher to reduce space between lines and enable better pressing.',
            category: 'positioning',
          },
          {
            title: 'Balance width',
            description:
              'Ensure wingers provide width in attack while midfielders control central areas. Current positioning seems narrow.',
            category: 'tactical',
          },
          {
            title: 'Cover counter-attack vulnerability',
            description:
              'With both fullbacks high, consider dropping a midfielder to cover potential counter-attacks.',
            category: 'tactical',
          }
        )
      } else if (drawingType === 'drill') {
        mockSuggestions.push(
          {
            title: 'Add progression',
            description:
              'Consider adding a progression phase to increase complexity after players master the basic pattern.',
            category: 'general',
          },
          {
            title: 'Optimize spacing',
            description:
              'Station spacing could be adjusted to better simulate match conditions and passing distances.',
            category: 'positioning',
          }
        )
      } else {
        mockSuggestions.push(
          {
            title: 'Consider player movements',
            description:
              'Add arrows to show player movement patterns and make the tactical plan clearer.',
            category: 'movement',
          },
          {
            title: 'Label key positions',
            description:
              'Adding labels to key positions will help players understand their roles better.',
            category: 'general',
          },
          {
            title: 'Define pressing triggers',
            description:
              'Mark specific zones or actions that trigger pressing to create coordinated team movement.',
            category: 'tactical',
          }
        )
      }

      setSuggestions(mockSuggestions)
      toast.success('AI analysis complete')
    } catch (error) {
      console.error('Error generating suggestions:', error)
      toast.error('Failed to generate suggestions')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: Suggestion['category']) => {
    switch (category) {
      case 'tactical':
        return 'bg-blue-500/10 text-blue-500'
      case 'positioning':
        return 'bg-green-500/10 text-green-500'
      case 'movement':
        return 'bg-purple-500/10 text-purple-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <CardTitle>AI Assistant</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            Beta
          </Badge>
        </div>
        <CardDescription>
          Get tactical suggestions and insights for your drawing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={generateSuggestions}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Suggestions
            </>
          )}
        </Button>

        {suggestions.length > 0 && (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3 pr-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">
                          {suggestion.title}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getCategoryColor(
                            suggestion.category
                          )}`}
                        >
                          {suggestion.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {suggestions.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              Click the button above to get AI-powered suggestions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
