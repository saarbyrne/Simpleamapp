# Internationalization (i18n) Implementation - Issue #45

## Summary
This document outlines the i18n system implementation that enables multi-language support for the SimpleAM application.

## Implementation Status

### ✅ Phase 1: Setup & Configuration (COMPLETED)
- ✅ Installed `next-intl` package
- ✅ Created `messages/` directory with translation files for all 6 supported languages:
  - English (en.json)
  - Spanish (es.json)
  - French (fr.json)
  - German (de.json)
  - Portuguese (pt.json)
  - Italian (it.json)
- ✅ Created i18n configuration files:
  - `i18n/routing.ts` - Locale routing configuration
  - `i18n/request.ts` - Request config that reads locale from user preferences
- ✅ Updated `next.config.js` to include next-intl plugin
- ✅ Updated root `app/layout.tsx` to include NextIntlClientProvider

### ✅ Phase 2: Core Components (COMPLETED)
- ✅ Root layout updated to support locale
- ✅ Locale detection reads from user preferences (database)
- ✅ Falls back to browser locale if no preference set
- ✅ Translation hook (`useTranslations`) available in client components

### ✅ Phase 3: Navigation & Sidebar (COMPLETED)
- ✅ Sidebar navigation items translated
- ✅ Sidebar settings items translated
- ✅ User menu items translated
- ✅ Breadcrumbs translated

### 🔄 Phase 4: Profile Pages (IN PROGRESS)
- ⏳ Profile tab labels - Ready for translation
- ⏳ Profile form labels - Ready for translation
- ⏳ Preferences tab - Ready for translation
- ⏳ Notifications tab - Ready for translation
- ⏳ Security tab - Ready for translation

### 🔄 Phase 5-7: Main Features & UI Components (READY FOR IMPLEMENTATION)
- Translation keys defined in message files
- Components can be updated to use `useTranslations()` hook
- Server components can use `getTranslations()` from 'next-intl/server'

## Technical Implementation

### Locale Detection Strategy
The system reads locale from user preferences in the following order:
1. User's language preference from database (`users.language`)
2. Browser locale (if no preference set)
3. Default locale (English)

### Translation File Structure
```
messages/
  en.json - English (default)
  es.json - Spanish
  fr.json - French
  de.json - German
  pt.json - Portuguese
  it.json - Italian
```

### Usage Examples

#### Client Components
```tsx
'use client'
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations()
  return <h1>{t('nav.players')}</h1>
}
```

#### Server Components
```tsx
import { getTranslations } from 'next-intl/server'

export default async function MyPage() {
  const t = await getTranslations()
  return <h1>{t('nav.players')}</h1>
}
```

### Key Features
- ✅ No page reload needed when language preference changes
- ✅ Locale read from user preferences automatically
- ✅ Fallback to browser locale
- ✅ Type-safe translation keys (can be enhanced with TypeScript)
- ✅ Supports all 6 languages specified in requirements

## Next Steps

1. **Update Profile Pages** - Translate all profile-related components
2. **Update Main Feature Pages** - Translate players, forms, calendar, etc.
3. **Update UI Components** - Translate buttons, form labels, error messages
4. **Add More Translation Keys** - As new features are added
5. **Testing** - Test language switching and verify all translations

## Files Modified

- `package.json` - Added next-intl dependency
- `next.config.js` - Added next-intl plugin
- `middleware.ts` - Kept simple (no URL-based locale routing)
- `app/layout.tsx` - Added NextIntlClientProvider
- `i18n/routing.ts` - Locale configuration
- `i18n/request.ts` - Locale detection from user preferences
- `messages/*.json` - Translation files for all languages
- `components/dashboard/app-sidebar.tsx` - Updated to use translations
- `components/dashboard/dashboard-layout-client.tsx` - Updated breadcrumbs to use translations

## Testing Checklist

- [ ] Test language switching updates UI immediately
- [ ] Test all pages render correctly in each language
- [ ] Test fallback to browser locale when no preference set
- [ ] Test sidebar navigation translations
- [ ] Test breadcrumb translations
- [ ] Verify user preference is read correctly from database

## Notes

- The system uses next-intl without URL-based locale segments
- Locale is determined from user preferences, not URL
- This allows for seamless language switching without page reloads
- Future enhancement: Add organization-level default language
- Future enhancement: Add TypeScript types for translation keys
