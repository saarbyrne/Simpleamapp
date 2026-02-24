"use client";

import { useEffect, useState, useRef } from "react";
import { getCurrentUserProfile } from "@/app/actions/profile";

export interface UserPreferences {
  timezone: string | null;
  dateFormat: string | null;
  timeFormat: string | null;
  language: string | null;
  theme: string | null;
  experimentalTheme: string | null;
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
        if (isMountedRef.current && result?.success && result.data) {
          const newPreferences: UserPreferences = {
            timezone: result.data.timezone,
            dateFormat: result.data.dateFormat,
            timeFormat: result.data.timeFormat,
            language: result.data.language,
            theme: result.data.theme,
            experimentalTheme: result.data.experimentalTheme ?? null,
          };

          setPreferences(newPreferences);
          // Store in localStorage for next time
          storePreferences(newPreferences);
        } else if (isMountedRef.current && result?.success === false) {
          // Server action returned an error, but we can still use localStorage
          // Don't log connection errors as they're expected in some scenarios
          if (!result.error?.includes("connection") && !result.error?.includes("refused")) {
            console.warn("Failed to fetch user preferences:", result.error);
          }
        }
      } catch (error) {
        // Handle network errors gracefully - these can happen when:
        // 1. Server isn't running
        // 2. Calling server action from a route that doesn't support POST
        // 3. Network connectivity issues
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isConnectionError = 
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("ERR_CONNECTION_REFUSED") ||
          errorMessage.includes("NetworkError") ||
          errorMessage.includes("fetch");
        
        // Only log non-connection errors
        if (!isConnectionError) {
          console.error("Failed to fetch user preferences:", error);
        }
        // Silently fall back to localStorage preferences
      } finally {
        // Only update loading state if component is still mounted
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    }

    fetchPreferences();

    // Listen for localStorage changes (when preferences are updated)
    function handleStorageChange(e: StorageEvent) {
      if (e.key === PREFERENCES_STORAGE_KEY && e.newValue && isMountedRef.current) {
        try {
          const newPrefs = JSON.parse(e.newValue);
          setPreferences(newPrefs);
        } catch (error) {
          console.error('Failed to parse localStorage change:', error);
        }
      }
    }

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (for same-tab updates)
    function handleCustomStorageChange() {
      if (isMountedRef.current) {
        const storedPrefs = getStoredPreferences();
        if (storedPrefs) {
          setPreferences(storedPrefs);
        }
      }
    }

    window.addEventListener('preferencesUpdated', handleCustomStorageChange);

    // Cleanup: mark as unmounted
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('preferencesUpdated', handleCustomStorageChange);
    };
  }, []);

  return { preferences, isLoading };
}

