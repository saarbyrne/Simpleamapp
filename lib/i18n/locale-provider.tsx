'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { useRouter, usePathname } from 'next/navigation'

type LocaleContextType = {
  locale: string
  setLocale: (locale: string) => void
  isLoading: boolean
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const defaultLocale = useLocale()
  const { preferences, isLoading: prefsLoading } = useUserPreferences()
  const [locale, setLocaleState] = useState(defaultLocale)
  const [isLoading, setIsLoading] = useState(true)

  // Update locale when user preferences change
  useEffect(() => {
    if (!prefsLoading && preferences?.language) {
      const userLocale = preferences.language
      if (userLocale !== locale && ['en', 'es', 'fr', 'de', 'pt', 'it'].includes(userLocale)) {
        setLocaleState(userLocale)
        // Note: In a full implementation, you might want to update the URL or reload
        // For now, we'll just update the state and let next-intl handle it via the provider
      }
    }
    setIsLoading(prefsLoading)
  }, [preferences?.language, prefsLoading, locale])

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale)
    // In a future enhancement, you could update user preferences here
    // For now, the preference is managed in the profile settings
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isLoading }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocaleContext() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocaleContext must be used within a LocaleProvider')
  }
  return context
}
