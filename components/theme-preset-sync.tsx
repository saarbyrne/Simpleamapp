"use client"

import { useEffect } from "react"
import { useUserPreferences } from "@/hooks/use-user-preferences"

export function ThemePresetSync() {
  const { preferences, isLoading } = useUserPreferences()

  useEffect(() => {
    if (isLoading) return

    const preset = preferences?.experimentalTheme || 'default'
    const htmlElement = document.documentElement

    // Remove all preset classes
    htmlElement.classList.remove('theme-default', 'theme-liquid-glass', 'theme-flat')

    // Add current preset
    htmlElement.classList.add(`theme-${preset}`)
  }, [preferences?.experimentalTheme, isLoading])

  return null
}
