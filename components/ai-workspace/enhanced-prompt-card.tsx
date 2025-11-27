'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, RefreshCw, Edit2 } from 'lucide-react'
import { VariableChip, Variable } from './variable-chip'
import { Badge } from '@/components/ui/badge'

interface EnhancedPromptCardProps {
    originalPrompt: string
    enhancedPromptTemplate: string
    variables: Variable[]
    artifactType: string
    confidence: number
    onAccept: (finalPrompt: string, variables: Record<string, any>) => void
    onEdit: () => void
    onRegenerate: () => void
}

export function EnhancedPromptCard({
    originalPrompt,
    enhancedPromptTemplate,
    variables: initialVariables,
    artifactType,
    confidence,
    onAccept,
    onEdit,
    onRegenerate
}: EnhancedPromptCardProps) {
    const [variables, setVariables] = useState<Variable[]>(initialVariables)

    const handleVariableChange = (id: string, newValue: any) => {
        setVariables(prev => prev.map(v =>
            v.id === id ? { ...v, value: newValue } : v
        ))
    }

    const handleAccept = () => {
        // Construct the final prompt by replacing variables in the template
        let finalPrompt = enhancedPromptTemplate
        const variablesMap: Record<string, any> = {}

        variables.forEach(v => {
            variablesMap[v.id] = v.value
            // We don't strictly need to replace in the template if we send both, 
            // but for the final string representation it's useful.
            // The template uses {variableId} syntax.
            // For arrays, we join with commas.
            const stringValue = Array.isArray(v.value) ? v.value.join(', ') : String(v.value)
            finalPrompt = finalPrompt.replace(new RegExp(`{${v.id}}`, 'g'), stringValue)
        })

        onAccept(finalPrompt, variablesMap)
    }

    // Parse the template to render text and chips
    const renderTemplate = () => {
        const parts = enhancedPromptTemplate.split(/({[^}]+})/g)

        return (
            <p className="text-lg leading-relaxed text-foreground">
                {parts.map((part, index) => {
                    if (part.startsWith('{') && part.endsWith('}')) {
                        const varId = part.slice(1, -1)
                        const variable = variables.find(v => v.id === varId)

                        if (variable) {
                            return (
                                <VariableChip
                                    key={index}
                                    variable={variable}
                                    onChange={(val) => handleVariableChange(varId, val)}
                                />
                            )
                        }
                    }
                    return <span key={index}>{part}</span>
                })}
            </p>
        )
    }

    return (
        <Card className="w-full border-primary/20 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-base font-medium">
                            I've refined your request
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-normal">
                            {artifactType}
                        </Badge>
                        {confidence < 0.8 && (
                            <Badge variant="secondary" className="text-xs font-normal text-amber-600 bg-amber-50 border-amber-200">
                                Low Confidence
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-background border shadow-sm">
                    {renderTemplate()}
                </div>

                <div className="text-xs text-muted-foreground flex items-center gap-2 px-1">
                    <span>Original: "{originalPrompt}"</span>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-2">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={onEdit} className="text-muted-foreground hover:text-foreground">
                        <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                        Edit Manually
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onRegenerate} className="text-muted-foreground hover:text-foreground">
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                        Try Again
                    </Button>
                </div>
                <Button onClick={handleAccept} className="gap-2">
                    Generate {artifactType}
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
