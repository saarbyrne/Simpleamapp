"use client";

import { useUserPreferences } from "@/hooks/use-user-preferences";
import { formatDate, formatTime, formatDateTime, formatDateRange, type UserPreferences } from "@/lib/date-utils";
import { useTranslations } from "next-intl";

interface FormattedDateProps {
  date: Date | string;
  preferences?: UserPreferences | null;
  fallback?: string;
}

/**
 * Component that automatically formats a date using user preferences
 * Use this in client components for automatic preference-aware date formatting
 */
export function FormattedDate({ date, preferences: providedPreferences, fallback = "—" }: FormattedDateProps) {
  const { preferences: hookPreferences } = useUserPreferences();
  const t = useTranslations();
  const preferences = providedPreferences || hookPreferences;
  
  if (!date) return <span>{fallback}</span>;
  
  try {
    return <span>{formatDate(date, preferences || undefined)}</span>;
  } catch (error) {
    console.error(t('common.errorFormattingDate'), error);
    return <span>{fallback}</span>;
  }
}

interface FormattedTimeProps {
  date: Date | string;
  preferences?: UserPreferences | null;
  fallback?: string;
}

/**
 * Component that automatically formats a time using user preferences
 */
export function FormattedTime({ date, preferences: providedPreferences, fallback = "—" }: FormattedTimeProps) {
  const { preferences: hookPreferences } = useUserPreferences();
  const t = useTranslations();
  const preferences = providedPreferences || hookPreferences;
  
  if (!date) return <span>{fallback}</span>;
  
  try {
    return <span>{formatTime(date, preferences || undefined)}</span>;
  } catch (error) {
    console.error(t('common.errorFormattingTime'), error);
    return <span>{fallback}</span>;
  }
}

interface FormattedDateTimeProps {
  date: Date | string;
  preferences?: UserPreferences | null;
  fallback?: string;
}

/**
 * Component that automatically formats both date and time using user preferences
 */
export function FormattedDateTime({ date, preferences: providedPreferences, fallback = "—" }: FormattedDateTimeProps) {
  const { preferences: hookPreferences } = useUserPreferences();
  const t = useTranslations();
  const preferences = providedPreferences || hookPreferences;
  
  if (!date) return <span>{fallback}</span>;
  
  try {
    return <span>{formatDateTime(date, preferences || undefined)}</span>;
  } catch (error) {
    console.error(t('common.errorFormattingDateTime'), error);
    return <span>{fallback}</span>;
  }
}

interface FormattedDateRangeProps {
  startDate: Date | string;
  endDate: Date | string;
  preferences?: UserPreferences | null;
  fallback?: string;
}

/**
 * Component that automatically formats a date range using user preferences
 */
export function FormattedDateRange({ 
  startDate, 
  endDate, 
  preferences: providedPreferences, 
  fallback = "—" 
}: FormattedDateRangeProps) {
  const { preferences: hookPreferences } = useUserPreferences();
  const t = useTranslations();
  const preferences = providedPreferences || hookPreferences;
  
  if (!startDate || !endDate) return <span>{fallback}</span>;
  
  try {
    return <span>{formatDateRange(startDate, endDate, preferences || undefined)}</span>;
  } catch (error) {
    console.error(t('common.errorFormattingDateRange'), error);
    return <span>{fallback}</span>;
  }
}

