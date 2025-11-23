'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserEnabledFeatures } from '@/app/actions/user-features'
import { FeatureKey } from '@/lib/permissions/feature-metadata'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface FeatureGuardProps {
  feature: FeatureKey
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Component that guards content based on feature access
 * Redirects to dashboard if feature is disabled
 */
export function FeatureGuard({ feature, children, fallback }: FeatureGuardProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      const result = await getUserEnabledFeatures()
      
      if (result.success && result.features) {
        const enabled = result.features.includes(feature)
        setHasAccess(enabled)
        
        if (!enabled) {
          toast.error('This feature is not available for your organization')
          // Optionally redirect after a delay
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
      } else {
        // On error, allow access (fail open)
        setHasAccess(true)
      }
      
      setIsChecking(false)
    }

    checkAccess()
  }, [feature, router])

  if (isChecking) {
    return fallback || (
      <div className="flex flex-col gap-4 p-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Feature Not Available</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          This feature is not enabled for your organization. Please contact your administrator.
        </p>
        <Button asChild>
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    )
  }

  return <>{children}</>
}

