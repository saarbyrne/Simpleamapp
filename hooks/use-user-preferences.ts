"use client";

import { useEffect, useState, useRef } from "react";
import { getCurrentUserProfile } from "@/app/actions/profile";

export interface UserPreferences {
  timezone: string | null;
  dateFormat: string | null;
  timeFormat: string | null;
  language: string | null;
}

const PREFERENCES_STORAGE_KEY = "user-preferences";

/**
 * Read preferences from localStorage synchronously
 * This ensures preferences are available immediately on mount
 */
function getStoredPreferences(): UserPreferences | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to read preferences from localStorage:", error);
  }
  return null;
}

/**
 * Store preferences in localStorage
 */
function storePreferences(preferences: UserPreferences) {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to store preferences in localStorage:", error);
  }
}

/**
 * Hook to get current user preferences
 * - Reads from localStorage after mount (prevents hydration mismatch)
 * - Fetches from server to ensure latest values
 * - Updates localStorage when preferences change
 * - Handles SSR safely
 */
export function useUserPreferences() {
  // Start with null to ensure server and client render the same initially
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(false);

  useEffect(() => {
    // Mark as mounted
    isMountedRef.current = true;

    // First, try to read from localStorage (fast, synchronous)
    const storedPrefs = getStoredPreferences();
    if (storedPrefs && isMountedRef.current) {
      setPreferences(storedPrefs);
      setIsLoading(false);
    }

    // Then fetch from server to ensure we have the latest values
    async function fetchPreferences() {
      try {
        const result = await getCurrentUserProfile();
        // Only update state if component is still mounted
        if (isMountedRef.current && result.success && result.data) {
          const newPreferences = {
            timezone: result.data.timezone,
            dateFormat: result.data.dateFormat,
            timeFormat: result.data.timeFormat,
            language: result.data.language,
          };
          
          setPreferences(newPreferences);
          // Store in localStorage for next time
          storePreferences(newPreferences);
        }
      } catch (error) {
        console.error("Failed to fetch user preferences:", error);
      } finally {
        // Only update loading state if component is still mounted
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    }

    fetchPreferences();

    // Cleanup: mark as unmounted
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { preferences, isLoading };
}

