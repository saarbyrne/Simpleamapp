# Analytics Setup Documentation

## Overview

This application uses a **completely free** analytics stack with no hidden costs. All services are configured to stay within their free tier limits.

## 📊 Analytics Stack

| Service | Purpose | Free Tier Limit | Cost |
|---------|---------|----------------|------|
| **Vercel Analytics** | Web traffic & page views | Unlimited | $0 |
| **Vercel Speed Insights** | Performance monitoring | Unlimited | $0 |
| **Sentry** | Error tracking | 5,000 errors/month | $0 |
| **PostHog** | Product analytics | 1,000,000 events/month | $0 |

**Total Monthly Cost: $0**

## 🚀 Quick Start

### 1. Vercel Analytics & Speed Insights

**No configuration needed!** These work automatically when deployed to Vercel.

- In production: Full analytics tracking
- In development: No data sent (privacy-friendly)

### 2. Sentry (Error Tracking)

**Setup Steps:**

1. Create a free account at [sentry.io](https://sentry.io)
2. Create a new project (select "Next.js")
3. Copy your DSN from the project settings
4. Add to your `.env.local`:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-key@your-org.ingest.sentry.io/your-project-id
```

**Optional: Enable source map uploads for better error tracking**

```bash
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token
```

### 3. PostHog (Product Analytics)

**Setup Steps:**

1. Create a free account at [posthog.com](https://posthog.com)
2. Choose "PostHog Cloud" (US or EU region)
3. Copy your Project API Key from Project Settings
4. Add to your `.env.local`:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## 🛡️ Free Tier Safeguards

### Sentry Configuration

Our setup includes automatic safeguards to prevent overages:

- **Error Sampling**: 100% of errors captured (adjust if needed)
- **Performance Sampling**: 10% of transactions (conserves quota)
- **Replay Sampling**: Disabled by default (not included in free tier)
- **Error Filtering**: Ignores browser extensions, network errors, and noise
- **Development Mode**: No errors sent in development

**Located in:**
- `sentry.client.config.ts` - Client-side errors
- `sentry.server.config.ts` - Server-side errors
- `sentry.edge.config.ts` - Middleware errors

### PostHog Configuration

Configured to maximize value within free tier:

- **Event Capture**: 100% of user interactions
- **Session Recording**: Disabled by default (costs quota)
- **Performance Monitoring**: Disabled (can enable selectively)
- **Autocapture**: Enabled (clicks, form submissions)
- **Privacy**: Respects Do Not Track (DNT) settings

**Located in:** `lib/analytics/providers.tsx`

## 📈 What You Can Track

### Automatic Tracking (No Code Required)

✅ **Web Analytics** (Vercel)
- Page views
- Unique visitors
- Referrers
- Geographic data
- Device types

✅ **Performance** (Vercel Speed Insights)
- Core Web Vitals (LCP, FID, CLS)
- Real user monitoring (RUM)
- Geographic performance
- Page load times

✅ **Errors** (Sentry)
- JavaScript errors with stack traces
- API failures
- Unhandled promise rejections
- Component errors (with React Error Boundaries)

✅ **User Behavior** (PostHog)
- Page views
- Button clicks
- Form submissions
- Navigation patterns

### Custom Event Tracking

Use the `useAnalytics` hook for domain-specific events:

```tsx
import { useAnalytics } from '@/lib/analytics/providers'

function AthleteForm() {
  const analytics = useAnalytics()

  const handleSubmit = async (data) => {
    await createAthlete(data)

    // Track custom event
    analytics.track('athlete_created', {
      athleteId: data.id,
      sport: data.sport,
      timestamp: new Date().toISOString(),
    })
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

**Common Events to Track:**
- `athlete_created`
- `form_submitted`
- `event_scheduled`
- `file_uploaded`
- `report_generated`
- `user_invited`

### User Identification

Track user sessions and behavior:

```tsx
import { useAnalytics } from '@/lib/analytics/providers'

function useAuthSession() {
  const analytics = useAnalytics()

  useEffect(() => {
    if (user) {
      analytics.identify(user.id, {
        email: user.email,
        role: user.role,
        organization: user.organizationId,
      })
    }
  }, [user])
}
```

## 🚨 Monitoring Your Usage

### Sentry

Check your usage at: `https://sentry.io/settings/[org]/teams/[team]/stats/`

**What to watch:**
- Errors accepted vs. limit (5,000/month)
- Performance units vs. limit (10,000/month)

**If approaching limits:**
1. Increase error filtering in `sentry.*.config.ts`
2. Reduce `sampleRate` to 0.7 (70% sampling)
3. Reduce `tracesSampleRate` to 0.05 (5% sampling)

### PostHog

Check your usage at: `https://app.posthog.com/organization/billing`

**What to watch:**
- Events this month vs. 1M limit
- Event trend (is usage accelerating?)

**If approaching limits:**
1. Disable session recording (if enabled)
2. Reduce autocapture scope
3. Filter out high-frequency events
4. Consider sampling high-volume events

## 🔒 Privacy & Compliance

### GDPR Compliance

- **Vercel Analytics**: Privacy-friendly, no cookies, no PII
- **Sentry**: Scrubs PII by default, can add custom scrubbers
- **PostHog**: Supports user opt-out, respects DNT

### Cookie Banner Requirements

- **Vercel Analytics**: NO cookie banner needed (no cookies)
- **Sentry**: NO cookie banner needed (no cookies)
- **PostHog**: MAY need banner depending on region (sets localStorage)

### User Opt-Out

To allow users to opt out of PostHog:

```tsx
import posthog from 'posthog-js'

function PrivacySettings() {
  const handleOptOut = () => {
    posthog.opt_out_capturing()
  }

  return (
    <button onClick={handleOptOut}>
      Opt out of analytics
    </button>
  )
}
```

## 📊 Dashboard Access

After setup, access your dashboards:

- **Vercel Analytics**: https://vercel.com/[team]/[project]/analytics
- **Vercel Speed Insights**: https://vercel.com/[team]/[project]/speed-insights
- **Sentry**: https://sentry.io/organizations/[org]/issues/
- **PostHog**: https://app.posthog.com/insights

## 🔧 Troubleshooting

### Vercel Analytics Not Working

- **Issue**: No data in dashboard
- **Solution**: Must be deployed to Vercel. Does not work with `next dev`.

### Sentry Not Capturing Errors

- **Issue**: Errors not appearing in Sentry
- **Check**:
  1. Is `NEXT_PUBLIC_SENTRY_DSN` set?
  2. Are you in development mode? (Sentry is disabled in dev)
  3. Is the error being filtered? (Check `beforeSend` in config)

### PostHog Not Loading

- **Issue**: PostHog not initializing
- **Check**:
  1. Is `NEXT_PUBLIC_POSTHOG_KEY` set?
  2. Is the correct host set? (US vs EU)
  3. Check browser console for errors

## 📚 Additional Resources

- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [Vercel Speed Insights Docs](https://vercel.com/docs/speed-insights)
- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [PostHog Next.js Docs](https://posthog.com/docs/libraries/next-js)

## 💡 Best Practices

1. **Track meaningful events**: Don't track everything, focus on user actions that matter
2. **Monitor your quotas**: Check usage weekly, especially in the first month
3. **Filter noise**: Configure error filtering to exclude non-actionable errors
4. **Privacy first**: Only track what you need, respect user preferences
5. **Test in production**: Analytics don't run in development mode

## 🔄 Upgrading Later

If your app grows and you need more:

| Service | Next Tier | Cost |
|---------|-----------|------|
| Sentry | Team | $26/month (50K errors) |
| PostHog | Growth | $0 for 1M events, then $0.00031/event |
| Vercel | N/A | Always free |

**Current setup handles:**
- ~150 errors/day (Sentry)
- ~33,000 events/day (PostHog)
- Unlimited page views (Vercel)

This is sufficient for most small-to-medium applications.

---

## 📞 Support

If you encounter issues:
1. Check this documentation
2. Review the service-specific docs (links above)
3. Check GitHub issues for the respective library
4. Reach out to the service's support (all have free tier support)

**Remember: All services are FREE with no credit card required for signup!**
