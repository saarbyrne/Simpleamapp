"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { formatTime } from "@/lib/date-utils";
import { dateToTimeInput } from "@/lib/date-input-utils";

export interface TimePickerProps {
  time?: Date | string; // Date object or time string (HH:mm)
  onSelect?: (timeString: string) => void; // Returns time string (HH:mm) for form compatibility
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Centralized TimePicker component
 * - Allows manual typing in HH:mm format
 * - Has a picker popover for visual selection
 * - Respects user timezone and time format preferences
 * - Consistent styling across the application
 * - No language handling (uses default English)
 * - Handles SSR safely
 * - Returns time string (HH:mm) for form compatibility
 */
export function TimePicker({
  time,
  onSelect,
  placeholder = "Pick a time",
  disabled = false,
  className,
}: TimePickerProps) {
  const { preferences } = useUserPreferences();
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(true);

  // Parse time to HH:mm string
  const getTimeString = useCallback((timeValue?: Date | string): string => {
    if (!timeValue) return "";
    
    if (typeof timeValue === "string") {
      // If it's already a time string (HH:mm), return it
      if (timeValue.match(/^\d{2}:\d{2}$/)) {
        return timeValue;
      }
      // Try to parse as date
      const date = new Date(timeValue);
      if (!isNaN(date.getTime())) {
        return dateToTimeInput(date, preferences || undefined);
      }
    } else {
      // Date object
      if (!isNaN(timeValue.getTime())) {
        return dateToTimeInput(timeValue, preferences || undefined);
      }
    }
    
    return "";
  }, [preferences]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update input value when time prop changes
  useEffect(() => {
    const timeString = getTimeString(time);
    setInputValue(timeString);
    setIsValid(true);
  }, [time, getTimeString]);

  // Validate time format (HH:mm)
  const validateTime = (value: string): boolean => {
    if (!value) return true; // Empty is valid (will be handled by form validation)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Allow typing and auto-format as user types
    // Remove any non-digit characters except colon
    value = value.replace(/[^\d:]/g, "");
    
    // Auto-insert colon after 2 digits
    if (value.length === 2 && !value.includes(":")) {
      value = value + ":";
    }
    
    // Limit to HH:mm format (5 characters max)
    if (value.length > 5) {
      value = value.slice(0, 5);
    }
    
    setInputValue(value);
    
    // Validate format (allows partial input like "9:" or "09:3")
    const valid = !value || validateTime(value) || !!value.match(/^\d{1,2}:?\d{0,2}$/);
    setIsValid(valid);
    
    // Only call onSelect if it's a complete valid format (HH:mm)
    if (valid && value.match(/^\d{2}:\d{2}$/)) {
      onSelect?.(value);
    }
  };

  const handleInputBlur = () => {
    // On blur, normalize the input to HH:mm format
    if (inputValue && !inputValue.match(/^\d{2}:\d{2}$/)) {
      // Try to fix common formats
      const parts = inputValue.split(":");
      if (parts.length === 2) {
        let hour = parts[0].padStart(2, "0").slice(0, 2);
        let minute = parts[1].padStart(2, "0").slice(0, 2);
        
        // Validate ranges
        const hourNum = parseInt(hour, 10);
        const minuteNum = parseInt(minute, 10);
        
        if (hourNum > 23) hour = "23";
        if (minuteNum > 59) minute = "59";
        
        const normalized = `${hour}:${minute}`;
        if (validateTime(normalized)) {
          setInputValue(normalized);
          setIsValid(true);
          onSelect?.(normalized);
          return;
        }
      } else if (inputValue.match(/^\d{1,4}$/)) {
        // User typed digits without colon, try to parse
        const digits = inputValue.padStart(4, "0");
        const hour = digits.slice(0, 2);
        const minute = digits.slice(2, 4);
        const normalized = `${hour}:${minute}`;
        if (validateTime(normalized)) {
          setInputValue(normalized);
          setIsValid(true);
          onSelect?.(normalized);
          return;
        }
      }
      
      // If we can't normalize, mark as invalid
      setIsValid(false);
    } else if (inputValue && validateTime(inputValue)) {
      // Already valid, ensure it's normalized
      onSelect?.(inputValue);
    }
  };

  // Parse time to hours and minutes for picker
  const getTimeParts = useCallback((timeValue?: Date | string): { hour: string; minute: string } => {
    const timeString = getTimeString(timeValue);
    if (!timeString) return { hour: "", minute: "" };
    const [hour, minute] = timeString.split(":");
    return { hour: hour || "", minute: minute || "" };
  }, [getTimeString]);

  const { hour: selectedHour, minute: selectedMinute } = getTimeParts(time || inputValue);

  const handleHourChange = (hour: string) => {
    const currentMinute = selectedMinute || "00";
    const timeString = `${hour}:${currentMinute}`;
    setInputValue(timeString);
    setIsValid(true);
    onSelect?.(timeString);
  };

  const handleMinuteChange = (minute: string) => {
    const currentHour = selectedHour || "00";
    const timeString = `${currentHour}:${minute}`;
    setInputValue(timeString);
    setIsValid(true);
    onSelect?.(timeString);
  };

  // Generate hour options (00-23 for 24-hour format)
  const hours = Array.from({ length: 24 }, (_, i) => 
    String(i).padStart(2, "0")
  );

  // Generate minute options (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => 
    String(i).padStart(2, "0")
  );

  // Display text for input placeholder/format hint
  const displayPlaceholder = isMounted && time && preferences
    ? formatTime(time, preferences)
    : placeholder;

  return (
    <div className="relative flex items-center">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder={displayPlaceholder}
        disabled={disabled}
        className={cn(
          "w-full pr-10",
          !isValid && "border-destructive focus-visible:ring-destructive",
          className
        )}
        pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 h-full px-3 hover:bg-transparent"
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              setOpen(!open);
            }}
          >
            <Clock className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="end">
          <div className="flex items-center gap-2">
            <Select value={selectedHour} onValueChange={handleHourChange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-lg font-semibold">:</span>
            <Select value={selectedMinute} onValueChange={handleMinuteChange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {minutes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
