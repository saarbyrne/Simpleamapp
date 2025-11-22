# Date Utilities

Date formatting, parsing, and input handling utilities.

## File Structure

- **`date-utils.ts`** - Core date formatting and parsing functions
- **`date-input-utils.ts`** - Date input field utilities for forms
- **`date-utils.test.ts`** - Unit tests for date utilities
- **`index.ts`** - Centralized exports

## Usage

```typescript
import { formatDate, parseDate, formatTimeInput } from '@/lib/date';
```

## Core Utilities (`date-utils.ts`)

Date formatting and manipulation functions for display and data processing.

### Common Functions
- `formatDate()` - Format dates for display
- `parseDate()` - Parse date strings
- `isValidDate()` - Validate date values
- `getRelativeTime()` - Get relative time strings (e.g., "2 hours ago")

## Input Utilities (`date-input-utils.ts`)

Utilities for handling date and time inputs in forms.

### Form Input Helpers
- `formatTimeInput()` - Format time for input fields
- `parseTimeInput()` - Parse time input values
- `validateDateInput()` - Validate user-entered dates
- `normalizeDateInput()` - Normalize various date formats

## Best Practices

1. **Timezone Handling** - Be explicit about timezones, use UTC for storage
2. **Validation** - Always validate user input before processing
3. **Formatting** - Use consistent date formats across the app
4. **Localization** - Consider user locale for display formats
5. **Edge Cases** - Handle invalid dates, leap years, DST transitions

## Testing

Unit tests are located in `date-utils.test.ts`. Run with:

```bash
npm test lib/date/date-utils.test.ts
```
