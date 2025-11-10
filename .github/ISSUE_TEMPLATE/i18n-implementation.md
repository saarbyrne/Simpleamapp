# 🌐 Implement Internationalization (i18n) System

## Summary

The application currently has a language preference setting in user profiles that saves to the database, but there is no internationalization system implemented to actually translate the UI. Users can select Spanish (or other languages) in their preferences, but the interface remains in English.

## Current State

✅ **What Works:**
- Language preference is saved to database (`users.language` field)
- User can select language in Profile → Preferences tab
- Language options available: English, Spanish, French, German, Portuguese, Italian

❌ **What's Missing:**
- No i18n library installed
- No translation files exist
- All UI text is hardcoded in English
- No translation function/hook available
- No locale routing or context

## Requirements

### 1. Install i18n Library

**Recommended:** `next-intl` (best for Next.js 14+ App Router)

```bash
npm install next-intl
```

**Alternative options:**
- `react-intl` (Format.js)
- `i18next` with `react-i18next`
- `next-i18next` (for Pages Router)

### 2. Project Structure

Create translation files for each supported language:

```
messages/
  en.json
  es.json
  fr.json
  de.json
  pt.json
  it.json
```

### 3. Translation File Structure

Example structure for `messages/en.json`:

```json
{
  "nav": {
    "players": "Players",
    "forms": "Forms",
    "reports": "Reports",
    "calendar": "Calendar",
    "notes": "Notes",
    "spreadsheets": "Spreadsheets",
    "canvas": "Canvas",
    "files": "Files",
    "planner": "Planner"
  },
  "settings": {
    "profile": "Profile",
    "dataManagement": "Data Management",
    "systemSettings": "System Settings"
  },
  "profile": {
    "title": "Profile Settings",
    "personalInfo": "Personal Information",
    "preferences": "Preferences",
    "notifications": "Notifications",
    "security": "Security"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "search": "Search"
  }
}
```

### 4. Implementation Tasks

#### Phase 1: Setup & Configuration
- [ ] Install `next-intl` package
- [ ] Create `messages/` directory with translation files
- [ ] Set up Next.js middleware for locale handling
- [ ] Create i18n configuration file
- [ ] Create translation hook/utility function

#### Phase 2: Core Components
- [ ] Update root layout to support locale
- [ ] Create language context/provider that reads user preference
- [ ] Create `useTranslation` hook
- [ ] Update dashboard layout to use translations

#### Phase 3: Navigation & Sidebar
- [ ] Translate sidebar navigation items
- [ ] Translate sidebar settings items
- [ ] Translate user menu items
- [ ] Translate breadcrumbs

#### Phase 4: Profile Pages
- [ ] Translate profile tab labels
- [ ] Translate profile form labels and descriptions
- [ ] Translate preferences tab
- [ ] Translate notifications tab
- [ ] Translate security tab

#### Phase 5: Main Features
- [ ] Translate players pages
- [ ] Translate forms pages
- [ ] Translate calendar pages
- [ ] Translate reports pages
- [ ] Translate notes pages
- [ ] Translate other feature pages

#### Phase 6: UI Components
- [ ] Translate button labels
- [ ] Translate form labels
- [ ] Translate error messages
- [ ] Translate toast notifications
- [ ] Translate dialog titles and content

#### Phase 7: Dynamic Content
- [ ] Translate date/time formats based on user preference
- [ ] Translate number formats
- [ ] Handle pluralization
- [ ] Handle date/time localization

### 5. Technical Considerations

#### User Preference Integration
The system should:
- Read `user.language` from database on page load
- Apply language preference immediately (no page reload needed)
- Fall back to browser locale if no preference set
- Allow organization-level default language

#### Server vs Client Components
- Server components: Use `getTranslations()` from next-intl
- Client components: Use `useTranslations()` hook
- Server actions: May need locale passed as parameter

#### Date/Time Formatting
- Use user's `dateFormat` and `timeFormat` preferences
- Use user's `timezone` preference
- Integrate with `date-fns` or similar library

### 6. Example Implementation

```tsx
// lib/i18n.ts
import { getTranslations } from 'next-intl/server';
import { createTranslator } from 'next-intl';

export async function getServerTranslations(locale: string) {
  return await getTranslations({ locale });
}

// hooks/use-user-locale.ts
'use client';
import { use } from 'react';
import { getCurrentUserProfile } from '@/app/actions/profile';

export function useUserLocale() {
  const profile = use(getCurrentUserProfile());
  return profile.data?.language || 'en';
}

// components/dashboard/app-sidebar.tsx
'use client';
import { useTranslations } from 'next-intl';
import { useUserLocale } from '@/hooks/use-user-locale';

export function AppSidebar() {
  const locale = useUserLocale();
  const t = useTranslations({ locale });
  
  return (
    <nav>
      <Link href="/dashboard/players">{t('nav.players')}</Link>
      {/* ... */}
    </nav>
  );
}
```

## Testing Requirements

- [ ] Test language switching updates UI immediately
- [ ] Test all pages render correctly in each language
- [ ] Test date/time formatting respects user preferences
- [ ] Test fallback to browser locale when no preference set
- [ ] Test organization default language override
- [ ] Test RTL languages (if needed in future)

## Documentation

- [ ] Document translation key naming conventions
- [ ] Create guide for adding new translations
- [ ] Document how to add new languages
- [ ] Update README with i18n information

## Estimated Effort

- **Phase 1 (Setup):** 1-2 days
- **Phase 2 (Core):** 1 day
- **Phase 3 (Navigation):** 1 day
- **Phase 4 (Profile):** 1 day
- **Phase 5 (Features):** 3-4 days
- **Phase 6 (UI Components):** 2-3 days
- **Phase 7 (Dynamic Content):** 1-2 days
- **Testing & Polish:** 1-2 days

**Total Estimated Time:** 11-16 days

## Priority

**Medium-High** - Feature is partially implemented (preference saving works), but incomplete without actual translations.

## Labels

- `enhancement`
- `i18n`
- `translation`
- `feature-request`
- `good-first-issue` (for Phase 1-2)
- `help-wanted`

## Related Issues

- Profile preferences save language preference correctly
- User can select language in Profile → Preferences tab

## Notes

- Consider using a translation management service (e.g., Crowdin, Lokalise) for easier collaboration
- May want to extract all hardcoded strings first to understand scope
- Consider using TypeScript types for translation keys for better DX
- May need to handle dynamic content (e.g., player names, event titles) separately
