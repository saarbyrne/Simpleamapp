# Library Directory

Shared utilities, helpers, and business logic.

## Structure

```
/lib
├── animations/          # Animation utilities (Framer Motion)
├── chat/                # Chat utilities and operations
├── date/                # Date formatting and parsing
├── platform-admin/      # Platform admin utilities
├── ai/                  # AI integration (tools, prompts)
├── analytics/           # Analytics tracking
├── permissions/         # Permission checking
├── supabase/            # Supabase client configuration
├── utils.ts             # General utility functions
└── ...                  # Other utility modules
```

## Module Organization

### Animations `/animations`
Framer Motion animation variants and utilities:
- Core animations (fadeIn, slideIn, etc.)
- Loading animations (spinners, skeletons)
- Feedback animations (success, error)
- Page transitions

**Import:** `import { fadeIn, spinner } from '@/lib/animations'`

### Chat `/chat`
Firebase chat functionality:
- Chat operations (create, send, mark as read)
- Chat utilities (formatting, validation)
- Chat context for state management

**Import:** `import { sendMessage, formatTimestamp } from '@/lib/chat'`

### Date `/date`
Date formatting and parsing:
- Date formatting for display
- Date input utilities for forms
- Timezone handling
- Relative time formatting

**Import:** `import { formatDate, parseDate } from '@/lib/date'`

### Platform Admin `/platform-admin`
Platform administration utilities:
- Permission checks
- Admin configuration
- Action validation

**Import:** `import { checkPlatformAdmin, PLATFORM_ADMIN_CONFIG } from '@/lib/platform-admin'`

### AI `/ai`
AI integration tools and utilities:
- AI tools for function calling
- Prompt templates
- AI response parsing

### Analytics `/analytics`
Analytics and tracking:
- Event tracking
- User analytics
- Performance monitoring

### Permissions `/permissions`
Authorization and permission checking:
- Role-based access control
- Resource permissions
- Feature flags

### Supabase `/supabase`
Supabase client configuration:
- Database client
- Auth client
- Storage client
- Real-time subscriptions

## Utility Conventions

### Pure Functions
Utilities should be pure functions when possible:
```typescript
// ✅ Pure function
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// ❌ Side effects
export function updateCurrency(amount: number) {
  document.title = `$${amount}`;
}
```

### Type Safety
Always provide TypeScript types:
```typescript
export function calculate(a: number, b: number): number {
  return a + b;
}
```

### Error Handling
Handle errors gracefully:
```typescript
export function parseJSON<T>(json: string): T | null {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
```

## Common Utilities

### `utils.ts`
General utility functions:
- `cn()` - Tailwind class merging
- `formatBytes()` - File size formatting
- `slugify()` - String to URL slug
- `debounce()` - Debounce function calls
- `throttle()` - Throttle function calls

### Database Helpers
- Connection pooling
- Query builders
- Transaction helpers
- Migration utilities

### Validation
- Form validation
- Data sanitization
- Type guards
- Schema validation (Zod)

## Best Practices

1. **Single Responsibility** - One function, one purpose
2. **No Side Effects** - Keep functions pure when possible
3. **Proper Typing** - Full TypeScript coverage
4. **Error Handling** - Always handle potential errors
5. **Documentation** - JSDoc comments for public APIs
6. **Testing** - Unit tests for complex logic
7. **Tree Shaking** - Export individual functions, not default exports

## Module Index Files

Each subdirectory has an `index.ts` for convenient imports:

```typescript
// Instead of:
import { formatDate } from '@/lib/date/date-utils';
import { parseDate } from '@/lib/date/date-input-utils';

// Use:
import { formatDate, parseDate } from '@/lib/date';
```

## Testing

Utility tests should be colocated or in `/tests`:
```typescript
// lib/date/date-utils.test.ts
import { formatDate } from './date-utils';

test('formats date correctly', () => {
  expect(formatDate(new Date('2024-01-01'))).toBe('Jan 1, 2024');
});
```

## Related Documentation

- Animation utilities: `/lib/animations/README.md`
- Chat utilities: `/lib/chat/README.md`
- Date utilities: `/lib/date/README.md`
- Platform admin: `/lib/platform-admin/README.md`
