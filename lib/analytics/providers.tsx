'use client'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { useEffect } from 'react'
import posthog from 'posthog-js'

/**
 * Analytics Providers Component
 *
 * Integrates multiple analytics services with FREE tier safeguards:
 * - Vercel Analytics (FREE - unlimited)
 * - Vercel Speed Insights (FREE - unlimited)
 * - PostHog (FREE - 1M events/month)
 */

export function AnalyticsProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize PostHog if API key is provided
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',

        // FREE TIER SAFEGUARDS
        // Capture only 100% of events initially - we'll adjust if needed
        capture_pageview: true,
        capture_pageleave: true,

        // Session recording (disabled by default to save quota)
        session_recording: {
          recordCrossOriginIframes: false,
        },

        // Performance monitoring (be conservative)
        capture_performance: false, // Can enable later if needed

        // Respect user privacy
        opt_out_capturing_by_default: false,
        respect_dnt: true,

        // Advanced settings for cost control
        autocapture: true, // Auto-capture clicks, form submissions

        // Disable features that consume quota quickly
        disable_session_recording: true, // Can enable selectively later
        disable_surveys: true,

        // Load settings
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('PostHog initialized')
          }
        },
      })
    }
  }, [])

  return (
    <>
      {children}
      {/* Vercel Analytics - Always FREE */}
      <Analytics />
      {/* Vercel Speed Insights - Always FREE */}
      <SpeedInsights />
    </>
  )
}

/**
 * PostHog Analytics Hook
 * Use this to track custom events
 *
 * @example
 * const analytics = useAnalytics()
 * analytics.track('athlete_created', { athleteId: '123' })
 */
export function useAnalytics() {
  return {
    track: (event: string, properties?: Record<string, any>) => {
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.capture(event, properties)
      }
    },
    identify: (userId: string, traits?: Record<string, any>) => {
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.identify(userId, traits)
      }
    },
    reset: () => {
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.reset()
      }
    },
  }
}
