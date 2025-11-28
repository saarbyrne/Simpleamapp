'use client'

import { useState, useRef, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { cn } from '@/components/ui/utils'

export interface Variable {
    id: string
    label: string
    type: 'text' | 'number' | 'date' | 'select' | 'multi-select'
    value: any
    options?: string[]
}

interface VariableChipProps {
    variable: Variable
    onChange: (value: any) => void
}

export function VariableChip({ variable, onChange }: VariableChipProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [tempValue, setTempValue] = useState(variable.value)

    // Reset temp value when popover opens
    useEffect(() => {
        if (isOpen) {
            setTempValue(variable.value)
        }
    }, [isOpen, variable.value])

    const handleSave = () => {
        onChange(tempValue)
        setIsOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave()
        }
    }

    const renderContent = () => {
        switch (variable.type) {
            case 'select':
                return (
                    <Command>
                        <CommandInput placeholder={`Search ${variable.label?.toLowerCase() || 'options'}...`} />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {variable.options?.map((option) => (
                                    <CommandItem
                                        key={option}
                                        value={option}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue)
                                            setIsOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                variable.value === option ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                )

            case 'multi-select':
                return (
                    <Command>
                        <CommandInput placeholder={`Search ${variable.label?.toLowerCase() || 'options'}...`} />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {variable.options?.map((option) => {
                                    const isSelected = Array.isArray(variable.value) && variable.value.includes(option)
                                    return (
                                        <CommandItem
                                            key={option}
                                            value={option}
                                            onSelect={() => {
                                                const current = Array.isArray(variable.value) ? variable.value : []
                                                const next = isSelected
                                                    ? current.filter((v: string) => v !== option)
                                                    : [...current, option]
                                                onChange(next)
                                                // Don't close for multi-select
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {option}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                )

            default: // text, number, date
                return (
                    <div className="flex items-center gap-2 p-2">
                        <Input
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            type={variable.type === 'number' ? 'number' : 'text'}
                            className="h-8"
                            autoFocus
                        />
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
                            <Check className="h-4 w-4" />
                        </Button>
                    </div>
                )
        }
    }

    const getDisplayValue = () => {
        if (Array.isArray(variable.value)) {
            if (variable.value.length === 0) return 'None'
            if (variable.value.length === 1) return variable.value[0]
            return `${variable.value.length} selected`
        }
        return variable.value || 'Empty'
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 px-1.5 py-0.5 mx-0.5 text-xs font-medium transition-colors border border-primary/20 text-primary"
                >
                    {getDisplayValue()}
                </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                {renderContent()}
            </PopoverContent>
        </Popover>
    )
}
