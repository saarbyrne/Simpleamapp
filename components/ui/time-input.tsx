"use client";

import { Input } from "@/components/ui/input";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { dateToTimeInput, timeInputToDate } from "@/lib/date-input-utils";
import { forwardRef, useEffect, useState } from "react";

interface TimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  value?: Date | string;
  onChange?: (date: Date) => void;
  onTimeChange?: (timeString: string) => void;
}

/**
 * TimeInput component that automatically respects user preferences
 * - Converts times to/from user's timezone
 * - Always uses 24-hour format for HTML5 time input (browser standard)
 * - Displays time in user's timezone
 */
export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  ({ value, onChange, onTimeChange, ...props }, ref) => {
    const { preferences } = useUserPreferences();
    const [timeString, setTimeString] = useState<string>("");

    // Convert Date to time string when value changes
    useEffect(() => {
      if (value) {
        const date = typeof value === "string" ? new Date(value) : value;
        if (!isNaN(date.getTime())) {
          const time = dateToTimeInput(date, preferences || undefined);
          setTimeString(time);
        }
      } else {
        setTimeString("");
      }
    }, [value, preferences]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTimeString = e.target.value;
      setTimeString(newTimeString);

      // Call onTimeChange if provided (for string-based forms)
      if (onTimeChange) {
        onTimeChange(newTimeString);
      }

      // Convert to Date and call onChange if provided
      if (onChange && newTimeString && value) {
        const baseDate = typeof value === "string" ? new Date(value) : value;
        const newDate = timeInputToDate(newTimeString, baseDate, preferences || undefined);
        onChange(newDate);
      }
    };

    return (
      <Input
        ref={ref}
        type="time"
        value={timeString}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

TimeInput.displayName = "TimeInput";

