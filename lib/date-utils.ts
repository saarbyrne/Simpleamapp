/**
 * Date and time formatting utilities that respect user preferences
 */

export interface UserPreferences {
  timezone?: string | null;
  dateFormat?: string | null; // "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD"
  timeFormat?: string | null; // "12" | "24"
}

/**
 * Formats a date according to user preferences
 * @param date - The date to format
 * @param preferences - User preferences (timezone, dateFormat)
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  preferences?: UserPreferences
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  const dateFormat = preferences?.dateFormat || "DD/MM/YYYY";
  const timezone = preferences?.timezone || undefined;

  // Use Intl.DateTimeFormat for proper timezone handling (always English locale)
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

  switch (dateFormat) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD/MM/YYYY":
    default:
      return `${day}/${month}/${year}`;
  }
}

/**
 * Formats a time according to user preferences
 * @param date - The date/time to format
 * @param preferences - User preferences (timezone, timeFormat)
 * @returns Formatted time string
 */
export function formatTime(
  date: Date | string,
  preferences?: UserPreferences
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return "Invalid Time";
  }

  const timeFormat = preferences?.timeFormat || "24";
  const timezone = preferences?.timezone || undefined;

  // Use Intl.DateTimeFormat for proper timezone handling (always English locale)
  if (timeFormat === "12") {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return formatter.format(dateObj);
  } else {
    // 24-hour format
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return formatter.format(dateObj);
  }
}

/**
 * Formats both date and time according to user preferences
 * @param date - The date/time to format
 * @param preferences - User preferences
 * @returns Formatted date and time string
 */
export function formatDateTime(
  date: Date | string,
  preferences?: UserPreferences
): string {
  return `${formatDate(date, preferences)} ${formatTime(date, preferences)}`;
}

/**
 * Formats a date range according to user preferences
 * @param startDate - Start date
 * @param endDate - End date
 * @param preferences - User preferences
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate: Date | string,
  endDate: Date | string,
  preferences?: UserPreferences
): string {
  const start = formatDate(startDate, preferences);
  const end = formatDate(endDate, preferences);
  
  // If same date, just show date once with time range
  const startObj = typeof startDate === "string" ? new Date(startDate) : startDate;
  const endObj = typeof endDate === "string" ? new Date(endDate) : endDate;
  
  if (
    startObj.toDateString() === endObj.toDateString()
  ) {
    return `${start} ${formatTime(startDate, preferences)} - ${formatTime(endDate, preferences)}`;
  }
  
  return `${start} ${formatTime(startDate, preferences)} - ${end} ${formatTime(endDate, preferences)}`;
}

/**
 * Converts a date to the user's timezone
 * Note: This returns a Date object, but Date objects are always in UTC internally.
 * Use formatDate/formatTime to display dates in the user's timezone.
 * @param date - The date to convert
 * @param timezone - User's timezone preference
 * @returns Date object (always UTC internally, use formatters to display)
 */
export function toUserTimezone(
  date: Date | string,
  timezone?: string | null
): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  // Date objects are always stored in UTC internally
  // The timezone conversion happens during formatting
  return dateObj;
}

