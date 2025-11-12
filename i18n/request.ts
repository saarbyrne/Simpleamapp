import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { getCurrentUserProfile } from '@/app/actions/profile';

export default getRequestConfig(async ({ requestLocale }) => {
  // Try to get locale from user preferences first
  let locale: string | undefined;
  
  try {
    const profileResult = await getCurrentUserProfile();
    if (profileResult.success && profileResult.data?.language) {
      locale = profileResult.data.language;
    }
  } catch (error) {
    // If we can't get user profile, fall back to request locale
    console.error('Failed to get user locale from profile:', error);
  }

  // Fall back to request locale (from URL or headers) if no user preference
  if (!locale) {
    locale = await requestLocale;
  }

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
