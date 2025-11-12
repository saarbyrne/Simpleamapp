'use client'

import { createContext, useContext, useEffect, useState, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

type LocaleContextType = {
  locale: string
  setLocale: (locale: string) => Promise<void>
  isLoading: boolean
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const currentLocale = useLocale()
  const [locale, setLocaleState] = useState(currentLocale)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setLocaleState(currentLocale)
  }, [currentLocale])

  const setLocale = async (newLocale: string) => {
    // Update state immediately for instant UI feedback
    setLocaleState(newLocale)
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('user-language', newLocale)
      } catch (error) {
        console.error('Failed to store language in localStorage:', error)
      }
    }

    // Update in database (this happens in the background)
    // The router.refresh() will pick up the new locale on next navigation
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isLoading: isPending }}>
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
