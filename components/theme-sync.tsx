"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useUserPreferences } from "@/hooks/use-user-preferences";

interface ThemeSyncProps {
  children: React.ReactNode;
}

/**
 * Component that syncs the user's saved theme preference with next-themes
 * This ensures the theme is applied based on user preferences
 */
export function ThemeSync({ children }: ThemeSyncProps) {
  const { preferences, isLoading } = useUserPreferences();
  const savedTheme = preferences?.theme;
  const { theme: currentTheme, setTheme } = useTheme();

  useEffect(() => {
    // Wait for preferences to load
    if (isLoading) {
      return;
    }

    // Determine what theme to use
    const themeToSet = savedTheme || 'system';

    // Only update if theme has changed
    if (themeToSet !== currentTheme) {
      setTheme(themeToSet);
    }
  }, [savedTheme, currentTheme, setTheme, isLoading]);

  return <>{children}</>;
}