'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { NATIONALITIES } from '@/lib/nationalities'
import { cn } from '@/components/ui/utils'

export interface NationalitySelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function NationalitySelect({
  value,
  onValueChange,
  placeholder = 'Select nationality',
  className,
  disabled = false,
}: NationalitySelectProps) {
  return (
    <Select value={value || ''} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {NATIONALITIES.map((nationality) => (
          <SelectItem key={nationality.code} value={nationality.name}>
            <span className="flex items-center gap-2">
              <span>{nationality.flag}</span>
              <span>{nationality.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

