# Analytics Module

This directory contains the analytics integration for the SimpleAM application.

## Files

- **`providers.tsx`** - Main analytics providers component and hooks
- **`examples.ts`** - Code examples showing how to use analytics throughout the app
- **`README.md`** - This file

## Quick Start

### 1. Using Analytics in Components

```tsx
import { useAnalytics } from '@/lib/analytics/providers'

function MyComponent() {
  const analytics = useAnalytics()

  const handleAction = () => {
    analytics.track('action_performed', {
      actionType: 'button_click',
      buttonId: 'submit',
    })
  }

  return <button onClick={handleAction}>Submit</button>
}
```

### 2. Identifying Users

```tsx
import { useAnalytics } from '@/lib/analytics/providers'

function useAuthSession() {
  const analytics = useAnalytics()

  useEffect(() => {
    if (user) {
      analytics.identify(user.id, {
        email: user.email,
        role: user.role,
      })
    }
  }, [user])
}
```

### 3. Resetting User Session

```tsx
const analytics = useAnalytics()

const handleLogout = () => {
  analytics.reset() // Clear user identification
  // ... logout logic
}
```

## Available Methods

### `track(event: string, properties?: object)`

Track a custom event.

```tsx
analytics.track('athlete_created', {
  athleteId: '123',
  sport: 'basketball',
})
```

### `identify(userId: string, traits?: object)`

Identify a user and attach traits.

```tsx
analytics.identify('user_123', {
  email: 'user@example.com',
  role: 'coach',
})
```

### `reset()`

Clear user identification (call on logout).

```tsx
analytics.reset()
```

## What Gets Tracked Automatically

- **Page views** (Vercel Analytics + PostHog)
- **Performance metrics** (Vercel Speed Insights)
- **JavaScript errors** (Sentry)
- **Button clicks** (PostHog autocapture)
- **Form interactions** (PostHog autocapture)

## What You Should Track Manually

- Domain-specific events (athlete created, form submitted)
- User identification (on login)
- Custom performance metrics
- Feature usage
- Business metrics

## Configuration

All analytics services are configured in:
- `/sentry.client.config.ts` - Client-side error tracking
- `/sentry.server.config.ts` - Server-side error tracking
- `/sentry.edge.config.ts` - Edge runtime error tracking
- `/lib/analytics/providers.tsx` - PostHog and Vercel integrations

## Free Tier Limits

| Service | Limit |
|---------|-------|
| Vercel Analytics | Unlimited |
| Vercel Speed Insights | Unlimited |
| Sentry | 5,000 errors/month |
| PostHog | 1,000,000 events/month |

## More Information

See `/ANALYTICS.md` for complete documentation.
