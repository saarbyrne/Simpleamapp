'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Activity,
  Heart,
  AlertCircle,
  Trophy,
  Users,
  Zap,
  FileSpreadsheet,
} from 'lucide-react'
import { SpreadsheetTemplate, TEMPLATE_CATEGORIES } from '@/lib/types/spreadsheet'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface TemplateGalleryProps {
  templates: SpreadsheetTemplate[]
  onSelectTemplate: (template: SpreadsheetTemplate) => void
  onCreateBlank: () => void
}

const categoryIcons: Record<string, React.ElementType> = {
  performance: Activity,
  wellness: Heart,
  injury: AlertCircle,
  match: Trophy,
  attendance: Users,
  gps: Zap,
  custom: FileSpreadsheet,
}

const categoryColors: Record<string, string> = {
  performance: 'bg-primary/10 text-primary',
  wellness: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  injury: 'bg-destructive/10 text-destructive',
  match: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  attendance: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  gps: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
  custom: 'bg-muted text-muted-foreground',
}

export function TemplateGallery({
  templates,
  onSelectTemplate,
  onCreateBlank,
}: TemplateGalleryProps) {
  const t = useTranslations('spreadsheets.templates')
  const tSpreadsheets = useTranslations('spreadsheets')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = []
    }
    acc[template.category].push(template)
    return acc
  }, {} as Record<string, SpreadsheetTemplate[]>)

  const categories = Object.keys(templatesByCategory)

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templatesByCategory[selectedCategory] || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('chooseTemplate')}</h2>
        <p className="text-muted-foreground">
          {t('chooseTemplateDescription')}
        </p>
      </div>

      {/* Blank Spreadsheet Card */}
      <Card
        className="cursor-pointer transition-colors hover:bg-accent"
        onClick={onCreateBlank}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            {t('blankSpreadsheet')}
          </CardTitle>
          <CardDescription>
            {t('blankSpreadsheetDescription')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start flex-wrap h-auto">
          <TabsTrigger value="all">{t('allTemplates')}</TabsTrigger>
          {categories.map(category => {
            const Icon = categoryIcons[category] || FileSpreadsheet
            return (
              <TabsTrigger key={category} value={category} className="gap-2">
                <Icon className="h-4 w-4" />
                {t(`categories.${category}`) || TEMPLATE_CATEGORIES[category as keyof typeof TEMPLATE_CATEGORIES] || category}
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <ScrollArea className="h-[600px] pe-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => {
                const Icon = categoryIcons[template.category] || FileSpreadsheet
                const colorClass = categoryColors[template.category] || categoryColors.custom

                return (
                  <Card
                    key={template.id}
                    className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Icon className="h-8 w-8 text-muted-foreground" />
                        <Badge className={cn('text-xs', colorClass)} variant="secondary">
                          {t(`categories.${template.category}`) || TEMPLATE_CATEGORIES[template.category as keyof typeof TEMPLATE_CATEGORIES] || template.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {template.schema?.length || 0} {tSpreadsheets('columns')}
                        </span>
                        {template.isPublic && (
                          <Badge variant="outline" className="text-xs">
                            {t('public')}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">{t('noTemplatesFound')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('noTemplatesInCategory')}
                </p>
                <Button onClick={onCreateBlank}>{t('createBlankSpreadsheet')}</Button>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
