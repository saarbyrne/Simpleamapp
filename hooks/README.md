# Hooks Directory

Custom React hooks for reusable stateful logic.

## Available Hooks

### Chat Hooks
Real-time chat functionality:
- **`useChats(userId)`** - Subscribe to user's chat list
- **`useMessages(chatId)`** - Subscribe to chat messages
- **`useChatParticipants(chatId)`** - Get chat participants
- **`useUnreadCount(userId)`** - Track unread message count

### UI Hooks
User interface interactions:
- **`useMediaQuery(query)`** - Responsive breakpoint detection
- **`useDebounce(value, delay)`** - Debounce state values
- **`useThrottle(value, delay)`** - Throttle state values
- **`useLocalStorage(key, initial)`** - Sync state with localStorage
- **`useClickOutside(ref, handler)`** - Detect clicks outside element

### Data Hooks
Data fetching and management (if implemented):
- **`useQuery(key, fetcher)`** - Data fetching with caching
- **`useMutation(mutationFn)`** - Data mutations
- **`useInfiniteScroll()`** - Infinite scroll pagination

## Usage Examples

### Chat Hooks

```typescript
'use client';

import { useChats, useMessages } from '@/hooks/useChats';

export function ChatComponent({ userId, chatId }: Props) {
  // Subscribe to all chats for this user
  const { chats, loading } = useChats(userId);

  // Subscribe to messages for a specific chat
  const { messages, loading: messagesLoading } = useMessages(chatId);

  return (
    <div>
      {loading ? <Spinner /> : <ChatList chats={chats} />}
    </div>
  );
}
```

### Media Query

```typescript
'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

export function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div>
      {isMobile && <MobileView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

### Debounce

```typescript
'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  // Use debouncedSearch for API calls
  useEffect(() => {
    if (debouncedSearch) {
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

### Local Storage

```typescript
'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';

export function PreferencesComponent() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');

  return (
    <div>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => setLanguage('es')}>Español</button>
    </div>
  );
}
```

## Hook Patterns

### Basic Hook Structure

```typescript
import { useState, useEffect } from 'react';

export function useCustomHook(param: string) {
  const [state, setState] = useState<Type>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Hook logic
    setLoading(false);
  }, [param]);

  return { state, loading, error };
}
```

### Cleanup

Always cleanup subscriptions and timers:

```typescript
export function useSubscription(id: string) {
  const [data, setData] = useState();

  useEffect(() => {
    const subscription = subscribe(id, setData);

    // Cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

  return data;
}
```

### Memoization

Use useMemo and useCallback appropriately:

```typescript
export function useExpensiveCalculation(data: Data[]) {
  const result = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);

  const handleUpdate = useCallback((newData: Data) => {
    updateData(newData);
  }, []);

  return { result, handleUpdate };
}
```

## Best Practices

1. **Naming** - Prefix with "use" (e.g., `useAuth`, `useData`)
2. **Dependencies** - Always specify dependency arrays
3. **Cleanup** - Return cleanup functions from useEffect
4. **Error Handling** - Include error states and handling
5. **Loading States** - Provide loading indicators
6. **TypeScript** - Fully typed hooks and returns
7. **Composition** - Build complex hooks from simple ones
8. **Testing** - Use @testing-library/react-hooks

## Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from './useCounter';

test('increments counter', () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

## Related Documentation

- React Hooks Documentation: https://react.dev/reference/react
- Chat System: `/lib/chat/README.md`
- Component Patterns: `/components/README.md`
