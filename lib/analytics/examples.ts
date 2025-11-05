/**
 * Analytics Integration Examples
 *
 * This file demonstrates how to integrate analytics tracking
 * throughout your application using the free tier analytics stack.
 */

import { useAnalytics } from './providers'

/**
 * Example 1: Track User Actions
 *
 * Track when users perform important actions like creating athletes,
 * submitting forms, or uploading files.
 */
export function ExampleAthleteCreation() {
  const analytics = useAnalytics()

  const handleCreateAthlete = async (athleteData: any) => {
    // ... your creation logic

    // Track the event
    analytics.track('athlete_created', {
      athleteId: athleteData.id,
      sport: athleteData.sport,
      position: athleteData.position,
      timestamp: new Date().toISOString(),
    })
  }

  return null // Your component JSX
}

/**
 * Example 2: Track Form Submissions
 *
 * Monitor form completion rates and identify problematic forms.
 */
export function ExampleFormTracking() {
  const analytics = useAnalytics()

  const onFormStart = (formId: string) => {
    analytics.track('form_started', {
      formId,
      formType: 'wellness_check',
    })
  }

  const onFormSubmit = (formId: string, data: any) => {
    analytics.track('form_submitted', {
      formId,
      formType: 'wellness_check',
      fieldCount: Object.keys(data).length,
      completionTime: '2m 30s', // Calculate actual time
    })
  }

  const onFormAbandoned = (formId: string, fieldsFilled: number) => {
    analytics.track('form_abandoned', {
      formId,
      formType: 'wellness_check',
      fieldsFilled,
    })
  }

  return null
}

/**
 * Example 3: Track User Identification
 *
 * Identify users when they log in to track their journey.
 */
export function ExampleUserIdentification() {
  const analytics = useAnalytics()

  const onUserLogin = (user: any) => {
    // Identify the user
    analytics.identify(user.id, {
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      organizationType: user.organization?.type,
      signupDate: user.createdAt,
    })

    // Track the login event
    analytics.track('user_logged_in', {
      userId: user.id,
      loginMethod: 'email',
    })
  }

  const onUserLogout = () => {
    analytics.track('user_logged_out')
    analytics.reset() // Clear user identification
  }

  return null
}

/**
 * Example 4: Track Feature Usage
 *
 * Monitor which features are being used most.
 */
export function ExampleFeatureTracking() {
  const analytics = useAnalytics()

  const trackFeatureUsage = (feature: string) => {
    analytics.track('feature_used', {
      feature,
      timestamp: new Date().toISOString(),
    })
  }

  // Examples of features to track:
  // trackFeatureUsage('calendar_view_opened')
  // trackFeatureUsage('report_generated')
  // trackFeatureUsage('bulk_import_started')
  // trackFeatureUsage('notification_sent')

  return null
}

/**
 * Example 5: Track Performance Metrics
 *
 * Track custom performance metrics that matter to your app.
 */
export function ExamplePerformanceTracking() {
  const analytics = useAnalytics()

  const trackDataLoadTime = (dataType: string, loadTime: number) => {
    analytics.track('data_load_time', {
      dataType, // 'athletes_list', 'form_responses', etc.
      loadTimeMs: loadTime,
      wasSlowLoad: loadTime > 2000,
    })
  }

  const trackExportGeneration = (exportType: string, duration: number) => {
    analytics.track('export_generated', {
      exportType, // 'pdf', 'csv', 'xlsx'
      durationMs: duration,
      status: 'success',
    })
  }

  return null
}

/**
 * Example 6: Track Errors (Custom)
 *
 * Track application-specific errors that aren't caught by Sentry.
 */
export function ExampleErrorTracking() {
  const analytics = useAnalytics()

  const trackValidationError = (formField: string, errorType: string) => {
    analytics.track('validation_error', {
      formField,
      errorType,
      formType: 'athlete_profile',
    })
  }

  const trackApiError = (endpoint: string, statusCode: number) => {
    analytics.track('api_error', {
      endpoint,
      statusCode,
      errorType: 'api_failure',
    })
  }

  return null
}

/**
 * Example 7: Track Business Metrics
 *
 * Track important business events for your product.
 */
export function ExampleBusinessMetrics() {
  const analytics = useAnalytics()

  const onInviteSent = (role: string) => {
    analytics.track('team_member_invited', {
      role,
      inviteMethod: 'email',
    })
  }

  const onSubscriptionChange = (newPlan: string, oldPlan: string) => {
    analytics.track('subscription_changed', {
      newPlan,
      oldPlan,
      direction: newPlan > oldPlan ? 'upgrade' : 'downgrade',
    })
  }

  const onTrialStarted = () => {
    analytics.track('trial_started', {
      trialDuration: '14_days',
    })
  }

  return null
}

/**
 * Example 8: Track User Engagement
 *
 * Measure how engaged users are with your platform.
 */
export function ExampleEngagementTracking() {
  const analytics = useAnalytics()

  const trackDailyActiveUser = () => {
    analytics.track('daily_active_user', {
      date: new Date().toISOString().split('T')[0],
    })
  }

  const trackSessionDuration = (durationMinutes: number) => {
    analytics.track('session_ended', {
      durationMinutes,
      engagementLevel:
        durationMinutes > 30 ? 'high' : durationMinutes > 10 ? 'medium' : 'low',
    })
  }

  return null
}

/**
 * Best Practices for Analytics Tracking
 *
 * 1. Be Consistent: Use consistent event naming (e.g., snake_case)
 * 2. Be Specific: Include relevant context in event properties
 * 3. Be Mindful: Don't track PII (personally identifiable information)
 * 4. Be Strategic: Only track events that help you make decisions
 * 5. Be Efficient: Batch related events when possible
 * 6. Be Privacy-Conscious: Respect user preferences and regulations
 *
 * Event Naming Convention:
 * - Use snake_case: "user_logged_in", not "User Logged In"
 * - Use past tense: "form_submitted", not "form_submit"
 * - Be descriptive: "athlete_profile_updated", not "update"
 * - Group related events: "form_*", "athlete_*", "user_*"
 */
