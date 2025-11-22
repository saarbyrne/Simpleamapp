"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { formatDate } from "@/lib/date";

export interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Centralized DatePicker component
 * - Uses shadcn Calendar component
 * - Respects user timezone and date format preferences
 * - Consistent styling across the application
 * - No language handling (uses default English)
 * - Handles SSR safely
 */
export function DatePicker({
  date,
  onSelect,
  placeholder = "Pick a date",
  disabled = false,
  className,
}: DatePickerProps) {
  const { preferences } = useUserPreferences();

  // Use preferences immediately (from localStorage after mount)
  // suppressHydrationWarning prevents warnings when format differs between server/client
  // Server renders with null preferences (default format), client renders with localStorage preferences
  const displayText = date && preferences
    ? formatDate(date, preferences)
    : date
    ? formatDate(date) // Fallback without preferences
    : placeholder;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-start font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="me-2 h-4 w-4" />
          <span suppressHydrationWarning>{displayText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
