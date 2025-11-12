# Date Formatting System - Implementation Guide

## Overview

This document describes the comprehensive date/time formatting system that ensures all dates throughout the application respect user preferences:
- **Timezone** - Converts dates/times to user's selected timezone
- **Date Format** - DD/MM/YYYY, MM/DD/YYYY, or YYYY-MM-DD
- **Time Format** - 12-hour (AM/PM) or 24-hour format
- **Language** - Formats dates/times in user's selected language (en, es, fr, de, pt, it)

## Architecture

### 1. Core Utilities (`lib/date-utils.ts`)
- `formatDate()` - Formats dates according to user preferences
- `formatTime()` - Formats times according to user preferences  
- `formatDateTime()` - Formats both date and time
- `formatDateRange()` - Formats date ranges

### 2. Server-Side Access (`lib/preferences/server.ts`)
- `getUserPreferences()` - Server function to fetch user preferences
- Use in server components and server actions

### 3. Client-Side Access (`hooks/use-user-preferences.ts`)
- `useUserPreferences()` - React hook to fetch user preferences
- Use in client components

### 4. React Components (`components/formatted-date.tsx`)
- `<FormattedDate />` - Component that automatically formats dates
- `<FormattedTime />` - Component that automatically formats times
- `<FormattedDateTime />` - Component that automatically formats date+time
- `<FormattedDateRange />` - Component that automatically formats ranges

### 5. Tests (`lib/date-utils.test.ts`)
- Comprehensive test suite ensuring formatting works correctly
- Tests for all formats, timezones, and edge cases

## Usage Examples

### In Client Components

```tsx
// Option 1: Use the hook directly
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { formatDate, formatTime } from '@/lib/date-utils'

function MyComponent() {
  const { preferences } = useUserPreferences()
  
  return (
    <div>
      <p>Date: {formatDate(someDate, preferences || undefined)}</p>
      <p>Time: {formatTime(someDate, preferences || undefined)}</p>
    </div>
  )
}

// Option 2: Use the components (automatic preference fetching)
import { FormattedDate, FormattedTime } from '@/components/formatted-date'

function MyComponent() {
  return (
    <div>
      <p>Date: <FormattedDate date={someDate} /></p>
      <p>Time: <FormattedTime date={someDate} /></p>
    </div>
  )
}
```

### In Server Components

```tsx
import { getUserPreferences } from '@/lib/preferences/server'
import { formatDate } from '@/lib/date-utils'

export default async function MyServerComponent() {
  const preferences = await getUserPreferences()
  
  return (
    <div>
      <p>Date: {formatDate(someDate, preferences || undefined)}</p>
    </div>
  )
}
```

## Migration Checklist

When adding new date displays, ensure you:

1. ✅ Use `formatDate()`, `formatTime()`, or `formatDateTime()` instead of:
   - `toLocaleDateString()`
   - `toLocaleString()`
   - `date-fns format()` (unless for calendar pickers)
   - Hardcoded date strings

2. ✅ Pass user preferences to formatting functions:
   - Client components: Use `useUserPreferences()` hook
   - Server components: Use `getUserPreferences()` function

3. ✅ For calendar pickers and form inputs:
   - Keep using `date-fns` for internal formatting
   - But display selected dates using preference-aware formatters

4. ✅ Test with different preferences:
   - Different date formats (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
   - Different time formats (12-hour, 24-hour)
   - Different timezones (America/New_York, Europe/London, etc.)
   - Different languages (English, Spanish, French, German, Portuguese, Italian)

## Files Updated

- ✅ `components/dashboard/players-table-new.tsx` - Player list dates
- ✅ `components/calendar/event-quick-view.tsx` - Event quick view
- ✅ `components/calendar/event-detail-dialog.tsx` - Event detail dialog
- ✅ `app/dashboard/calendar/events/[eventId]/page.tsx` - Event detail page
- ✅ `app/dashboard/players/[id]/page.tsx` - Player profile page

## Files Still Using date-fns (Calendar Pickers)

These files use `date-fns` for calendar picker formatting, which is acceptable:
- `components/calendar/event-form-dialog.tsx` - Form date pickers
- `components/calendar/event-calendar.tsx` - Calendar grid formatting

**Note:** The calendar picker itself can use date-fns, but when displaying selected dates in the UI, use the preference-aware formatters.

## Testing

Run the test suite:
```bash
npm test lib/date-utils.test.ts
```

The tests verify:
- All date formats work correctly
- Timezone conversion works
- 12-hour vs 24-hour format
- Edge cases (invalid dates, null values)
- Consistency across multiple calls

## Best Practices

1. **Always use the utilities** - Never hardcode date formatting
2. **Pass preferences** - Always pass user preferences to formatting functions
3. **Use components when possible** - The `<FormattedDate />` components automatically fetch preferences
4. **Test with different preferences** - Ensure your UI works with all preference combinations
5. **Handle null/undefined** - Always provide fallbacks for missing dates

