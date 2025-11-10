'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2, Lightbulb } from 'lucide-react'
import { ColumnDefinition, SpreadsheetRow } from '@/lib/types/spreadsheet'

interface AIAssistantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (data: {
    schema?: ColumnDefinition[]
    data?: SpreadsheetRow[]
    suggestion?: string
  }) => void
  currentSchema?: ColumnDefinition[]
  currentData?: SpreadsheetRow[]
}

const SUGGESTIONS = [
  'Create a load tracking sheet for all first team players for this week',
  'Add a weekly average column to my data',
  'Clean up this data and fix any inconsistencies',
  'Generate a wellness tracking sheet with standard metrics',
  'Add calculated columns for total load and workload ratio',
]

export function AIAssistantDialog({
  open,
  onOpenChange,
  onApply,
  currentSchema,
  currentData,
}: AIAssistantDialogProps) {
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    setIsProcessing(true)

    // TODO: Integrate with actual AI service (OpenAI, Anthropic, etc.)
    // For now, this is a placeholder that demonstrates the UI

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock response based on prompt keywords
      let result: {
        schema?: ColumnDefinition[]
        data?: SpreadsheetRow[]
        suggestion?: string
      } = {}

      if (prompt.toLowerCase().includes('column') || prompt.toLowerCase().includes('add')) {
        result.suggestion = 'AI would suggest new columns or modifications here'
      } else if (prompt.toLowerCase().includes('clean') || prompt.toLowerCase().includes('fix')) {
        result.suggestion = 'AI would clean and optimize your data here'
      } else if (prompt.toLowerCase().includes('create') || prompt.toLowerCase().includes('generate')) {
        result.suggestion = 'AI would generate a new spreadsheet structure here'
      } else {
        result.suggestion = 'AI analysis and suggestions would appear here'
      }

      onApply(result)
      setPrompt('')
    } catch (error) {
      console.error('AI processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Assistant
          </DialogTitle>
          <DialogDescription>
            Describe what you want to do with your spreadsheet, and AI will help you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">What would you like help with?</Label>
            <Textarea
              id="ai-prompt"
              placeholder="e.g., Create a load tracking sheet for all players, add weekly averages, clean up data..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={isProcessing}
            />
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Suggestions:</Label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setPrompt(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Info Alert */}
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-semibold">AI can help you:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Generate spreadsheets with pre-populated data</li>
                  <li>Add calculated columns and formulas</li>
                  <li>Clean and optimize existing data</li>
                  <li>Suggest improvements and best practices</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Current Context */}
          {(currentSchema || currentData) && (
            <div className="text-sm text-muted-foreground">
              <div className="font-medium mb-1">Current spreadsheet:</div>
              <div className="flex gap-4">
                {currentSchema && <span>{currentSchema.length} columns</span>}
                {currentData && <span>{currentData.length} rows</span>}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!prompt.trim() || isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Apply AI Suggestion
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
