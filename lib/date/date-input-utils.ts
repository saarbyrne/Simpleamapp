/**
 * Utilities for date/time picker inputs that respect user preferences
 */

import { type UserPreferences } from "./date-utils";

/**
 * Converts a Date to a time string (HH:mm) in the user's timezone
 * Used for time input fields (type="time")
 * @param date - The date/time to convert
 * @param preferences - User preferences
 * @returns Time string in HH:mm format (always 24-hour for HTML5 time inputs)
 */
export function dateToTimeInput(
  date: Date | string,
  preferences?: UserPreferences
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return "00:00";
  }

  const timezone = preferences?.timezone || undefined;

  // HTML5 time inputs always use 24-hour format (always English locale)
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(dateObj);
}

/**
 * Converts a time input string (HH:mm) to a Date in the user's timezone
 * Used when reading from time input fields
 * @param timeString - Time string in HH:mm format
 * @param baseDate - Base date to attach the time to
 * @param preferences - User preferences
 * @returns Date object with the time set in user's timezone
 */
export function timeInputToDate(
  timeString: string,
  baseDate: Date,
  preferences?: UserPreferences
): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  
  // Create date in user's timezone
  const timezone = preferences?.timezone || undefined;
  
  // Get the date string in the user's timezone (always English locale)
  const dateInTimezone = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(baseDate);

  // Parse the date parts
  const parts = dateInTimezone.match(/(\d{4})-(\d{2})-(\d{2}),?\s*(\d{2}):(\d{2})/) ||
                dateInTimezone.match(/(\d{2})\/(\d{2})\/(\d{4}),?\s*(\d{2}):(\d{2})/);
  
  if (parts) {
    // Create date string with new time
    const year = parts.length === 6 ? parts[1] : parts[3];
    const month = parts.length === 6 ? parts[2] : parts[1];
    const day = parts.length === 6 ? parts[3] : parts[2];
    
    // Create date string in format that can be parsed
    const dateString = `${year}-${month}-${day}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
    
    // If timezone is specified, we need to account for it
    // For now, we'll create a date assuming local timezone and let the formatter handle conversion
    const localDate = new Date(`${year}-${month}-${day}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
    
    return localDate;
  }
  
  // Fallback: set time directly on base date
  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Formats a date for display in date picker buttons
 * Uses user preferences for formatting
 * @param date - The date to format
 * @param preferences - User preferences
 * @returns Formatted date string
 */
export function formatDateForPicker(
  date: Date | string,
  preferences?: UserPreferences
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return "Pick a date";
  }

  const dateFormat = preferences?.dateFormat || "DD/MM/YYYY";
  const timezone = preferences?.timezone || undefined;

  // Use a readable format similar to date-fns 'PPP' format but respecting user preferences
  // Format: "Month Day, Year" (e.g., "December 25, 2024") - always English
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formatter.format(dateObj);
}

/**
 * Converts a Date to YYYY-MM-DD format for HTML5 date inputs
 * Respects user timezone
 * @param date - The date to convert
 * @param preferences - User preferences
 * @returns Date string in YYYY-MM-DD format
 */
export function dateToDateInput(
  date: Date | string,
  preferences?: UserPreferences
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return "";
  }

  const timezone = preferences?.timezone || undefined;

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(dateObj);
  const year = parts.find(p => p.type === "year")?.value || "";
  const month = parts.find(p => p.type === "month")?.value || "";
  const day = parts.find(p => p.type === "day")?.value || "";

  return `${year}-${month}-${day}`;
}

/**
 * Converts a date input string (YYYY-MM-DD) to a Date
 * @param dateString - Date string in YYYY-MM-DD format
 * @param preferences - User preferences (for timezone context)
 * @returns Date object
 */
export function dateInputToDate(
  dateString: string,
  preferences?: UserPreferences
): Date {
  if (!dateString) {
    return new Date();
  }

  // Parse YYYY-MM-DD format
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

