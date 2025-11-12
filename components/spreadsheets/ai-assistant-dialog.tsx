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
import { useTranslations } from 'next-intl'

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

export function AIAssistantDialog({
  open,
  onOpenChange,
  onApply,
  currentSchema,
  currentData,
}: AIAssistantDialogProps) {
  const t = useTranslations('spreadsheets.aiAssistant')
  const tCommon = useTranslations('common')
  const tSpreadsheets = useTranslations('spreadsheets')
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const suggestions = [
    t('suggestion1'),
    t('suggestion2'),
    t('suggestion3'),
    t('suggestion4'),
    t('suggestion5'),
  ]

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
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">{t('whatWouldYouLikeHelp')}</Label>
            <Textarea
              id="ai-prompt"
              placeholder={t('placeholder')}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={isProcessing}
            />
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">{t('suggestions')}</Label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
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
                <div className="font-semibold">{t('aiCanHelp')}</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>{t('generateSpreadsheets')}</li>
                  <li>{t('addCalculatedColumns')}</li>
                  <li>{t('cleanOptimizeData')}</li>
                  <li>{t('suggestImprovements')}</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Current Context */}
          {(currentSchema || currentData) && (
            <div className="text-sm text-muted-foreground">
              <div className="font-medium mb-1">{t('currentSpreadsheet')}</div>
              <div className="flex gap-4">
                {currentSchema && <span>{currentSchema.length} {tSpreadsheets('columns')}</span>}
                {currentData && <span>{currentData.length} {tSpreadsheets('rows')}</span>}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            {tCommon('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!prompt.trim() || isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 me-2 animate-spin" />
                {t('processing')}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 me-2" />
                {t('applyAiSuggestion')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
