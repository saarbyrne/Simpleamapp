'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type BreadcrumbContextType = {
  customLabels: Record<string, string>
  setCustomLabel: (key: string, label: string | null) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [customLabels, setCustomLabels] = useState<Record<string, string>>({})

  const setCustomLabel = useCallback((key: string, label: string | null) => {
    setCustomLabels((prev) => {
      if (label === null) {
        const { [key]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: label }
    })
  }, [])

  return (
    <BreadcrumbContext.Provider value={{ customLabels, setCustomLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext)
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider')
  }
  return context
}

