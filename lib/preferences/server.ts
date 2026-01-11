"use server";

import { getCurrentUserProfile } from "@/app/actions/profile";

export interface UserPreferences {
  timezone: string | null;
  dateFormat: string | null;
  timeFormat: string | null;
  language: string | null;
  theme: string | null;
}

/**
 * Get current user preferences from the server
 * Use this in server components and server actions
 */
export async function getUserPreferences(): Promise<UserPreferences | null> {
  try {
    const result = await getCurrentUserProfile();
    if (result.success && result.data) {
      return {
        timezone: result.data.timezone,
        dateFormat: result.data.dateFormat,
        timeFormat: result.data.timeFormat,
        language: result.data.language,
        theme: result.data.theme,
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch user preferences:", error);
    return null;
  }
}

