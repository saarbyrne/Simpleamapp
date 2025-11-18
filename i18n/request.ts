import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { getCurrentUserProfile } from '@/app/actions/profile';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from request (URL or headers) - skip database call for now
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
