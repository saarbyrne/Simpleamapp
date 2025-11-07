/**
 * Feedback Animations
 *
 * Visual feedback for user actions and system states with delightful animations.
 * All animations respect prefers-reduced-motion and integrate with design tokens.
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import {
  FeedbackToast,
  FeedbackIcon,
  FeedbackBanner,
  FeedbackBadge,
  FormFeedback,
  InputFeedback,
  ConfettiExplosion,
  SuccessCheckmark,
  ErrorXMark,
  type FeedbackVariant,
} from '@/components/ui/feedback'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'Foundation/Feedback Animations',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Feedback animations provide visual confirmation for user actions and system states. ' +
          'All animations respect `prefers-reduced-motion` for accessibility and use design system tokens for consistency.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

export const ToastNotifications: Story = {
  render: () => {
    const [activeToasts, setActiveToasts] = React.useState<Record<FeedbackVariant, boolean>>({
      success: false,
      error: false,
      warning: false,
      info: false,
    })

    const showToast = (variant: FeedbackVariant) => {
      setActiveToasts((prev) => ({ ...prev, [variant]: true }))
      setTimeout(() => {
        setActiveToasts((prev) => ({ ...prev, [variant]: false }))
      }, 4000)
    }

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Toast Notifications</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Animated toast notifications that slide in from the top. Auto-dismiss after 4 seconds.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => showToast('success')} variant="default">
              Show Success
            </Button>
            <Button onClick={() => showToast('error')} variant="destructive">
              Show Error
            </Button>
            <Button onClick={() => showToast('warning')} variant="outline">
              Show Warning
            </Button>
            <Button onClick={() => showToast('info')} variant="secondary">
              Show Info
            </Button>
          </div>
        </div>

        {/* Toast Container */}
        <div className="fixed top-4 right-4 z-50 space-y-3">
          <FeedbackToast
            variant="success"
            title="Success!"
            description="Your changes have been saved successfully."
            isVisible={activeToasts.success}
            onClose={() => setActiveToasts((prev) => ({ ...prev, success: false }))}
          />
          <FeedbackToast
            variant="error"
            title="Error"
            description="Failed to save changes. Please try again."
            isVisible={activeToasts.error}
            onClose={() => setActiveToasts((prev) => ({ ...prev, error: false }))}
          />
          <FeedbackToast
            variant="warning"
            title="Warning"
            description="You have unsaved changes that will be lost."
            isVisible={activeToasts.warning}
            onClose={() => setActiveToasts((prev) => ({ ...prev, warning: false }))}
          />
          <FeedbackToast
            variant="info"
            title="Info"
            description="A new version of this app is available."
            isVisible={activeToasts.info}
            onClose={() => setActiveToasts((prev) => ({ ...prev, info: false }))}
          />
        </div>
      </div>
    )
  },
}

// ============================================================================
// FEEDBACK ICONS
// ============================================================================

export const FeedbackIcons: Story = {
  render: () => {
    const [showIcons, setShowIcons] = React.useState(true)

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Feedback Icons</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Animated status icons with optional pulsing for persistent feedback.
          </p>

          <Button onClick={() => setShowIcons(!showIcons)} variant="outline">
            {showIcons ? 'Hide' : 'Show'} Icons
          </Button>
        </div>

        {showIcons && (
          <>
            {/* All Sizes */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Sizes (sm, md, lg, xl)</h4>
              <div className="flex items-end gap-8">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Small</p>
                  <FeedbackIcon variant="success" size="sm" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Medium</p>
                  <FeedbackIcon variant="success" size="md" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Large</p>
                  <FeedbackIcon variant="success" size="lg" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">XL</p>
                  <FeedbackIcon variant="success" size="xl" />
                </div>
              </div>
            </div>

            {/* All Variants */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Variants</h4>
              <div className="flex items-center gap-8">
                <div className="text-center space-y-2">
                  <FeedbackIcon variant="success" size="lg" />
                  <p className="text-xs text-muted-foreground">Success</p>
                </div>
                <div className="text-center space-y-2">
                  <FeedbackIcon variant="error" size="lg" />
                  <p className="text-xs text-muted-foreground">Error</p>
                </div>
                <div className="text-center space-y-2">
                  <FeedbackIcon variant="warning" size="lg" />
                  <p className="text-xs text-muted-foreground">Warning</p>
                </div>
                <div className="text-center space-y-2">
                  <FeedbackIcon variant="info" size="lg" />
                  <p className="text-xs text-muted-foreground">Info</p>
                </div>
              </div>
            </div>

            {/* With Pulse */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">With Pulse (for persistent feedback)</h4>
              <div className="flex items-center gap-8">
                <div className="text-center space-y-2">
                  <FeedbackIcon variant="success" size="lg" pulse />
                  <p className="text-xs text-muted-foreground">Success Pulse</p>
                </div>
                <div className="text-center space-y-2">
                  <FeedbackIcon variant="warning" size="lg" pulse />
                  <p className="text-xs text-muted-foreground">Warning Pulse</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  },
}

// ============================================================================
// FEEDBACK BANNERS
// ============================================================================

export const FeedbackBanners: Story = {
  render: () => {
    const [activeBanners, setActiveBanners] = React.useState<Record<FeedbackVariant, boolean>>({
      success: true,
      error: true,
      warning: true,
      info: true,
    })

    const toggleBanner = (variant: FeedbackVariant) => {
      setActiveBanners((prev) => ({ ...prev, [variant]: !prev[variant] }))
    }

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Feedback Banners</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Full-width banners for page-level feedback. Can include actions and close buttons.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => toggleBanner('success')} variant="outline" size="sm">
              Toggle Success
            </Button>
            <Button onClick={() => toggleBanner('error')} variant="outline" size="sm">
              Toggle Error
            </Button>
            <Button onClick={() => toggleBanner('warning')} variant="outline" size="sm">
              Toggle Warning
            </Button>
            <Button onClick={() => toggleBanner('info')} variant="outline" size="sm">
              Toggle Info
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <FeedbackBanner
            variant="success"
            message="Your payment has been processed successfully!"
            isVisible={activeBanners.success}
            onClose={() => toggleBanner('success')}
          />

          <FeedbackBanner
            variant="error"
            message="Failed to connect to the server. Please check your connection."
            action={{
              label: 'Retry',
              onClick: () => alert('Retrying...'),
            }}
            isVisible={activeBanners.error}
            onClose={() => toggleBanner('error')}
          />

          <FeedbackBanner
            variant="warning"
            message="Your subscription will expire in 3 days."
            action={{
              label: 'Renew',
              onClick: () => alert('Renewing...'),
            }}
            isVisible={activeBanners.warning}
            onClose={() => toggleBanner('warning')}
          />

          <FeedbackBanner
            variant="info"
            message="We've updated our privacy policy. Please review the changes."
            action={{
              label: 'Review',
              onClick: () => alert('Reviewing...'),
            }}
            isVisible={activeBanners.info}
            onClose={() => toggleBanner('info')}
          />
        </div>
      </div>
    )
  },
}

// ============================================================================
// FEEDBACK BADGES
// ============================================================================

export const FeedbackBadges: Story = {
  render: () => {
    const [showBadges, setShowBadges] = React.useState(true)

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Feedback Badges</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Small inline badges for status indicators. Animate on mount by default.
          </p>

          <Button onClick={() => setShowBadges(!showBadges)} variant="outline">
            {showBadges ? 'Hide' : 'Show'} Badges
          </Button>
        </div>

        {showBadges && (
          <>
            {/* All Sizes */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Sizes</h4>
              <div className="flex items-center gap-4">
                <FeedbackBadge variant="success" size="sm">
                  Small
                </FeedbackBadge>
                <FeedbackBadge variant="success" size="md">
                  Medium
                </FeedbackBadge>
                <FeedbackBadge variant="success" size="lg">
                  Large
                </FeedbackBadge>
              </div>
            </div>

            {/* All Variants */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Variants</h4>
              <div className="flex flex-wrap gap-3">
                <FeedbackBadge variant="success">Success</FeedbackBadge>
                <FeedbackBadge variant="error">Error</FeedbackBadge>
                <FeedbackBadge variant="warning">Warning</FeedbackBadge>
                <FeedbackBadge variant="info">Info</FeedbackBadge>
              </div>
            </div>

            {/* In Context */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">In Context</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Payment Status:</span>
                  <FeedbackBadge variant="success" size="sm">
                    Completed
                  </FeedbackBadge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">API Status:</span>
                  <FeedbackBadge variant="error" size="sm">
                    Failed
                  </FeedbackBadge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Database:</span>
                  <FeedbackBadge variant="warning" size="sm">
                    Degraded
                  </FeedbackBadge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Deployment:</span>
                  <FeedbackBadge variant="info" size="sm">
                    In Progress
                  </FeedbackBadge>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  },
}

// ============================================================================
// FORM FEEDBACK
// ============================================================================

export const FormValidation: Story = {
  render: () => {
    const [email, setEmail] = React.useState('')
    const [showValidation, setShowValidation] = React.useState(false)

    const isValid = email.includes('@') && email.includes('.')
    const hasAttempted = showValidation

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Form Validation Feedback</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Animated feedback messages for form fields with success and error states.
          </p>
        </div>

        <div className="max-w-md space-y-6">
          {/* Email Input with Validation */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <InputFeedback
              state={hasAttempted ? (isValid ? 'success' : 'error') : 'idle'}
              shakeOnError
            >
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setShowValidation(true)}
              />
            </InputFeedback>
            {hasAttempted && !isValid && (
              <FormFeedback variant="error" message="Please enter a valid email address" />
            )}
            {hasAttempted && isValid && (
              <FormFeedback variant="success" message="Email looks good!" />
            )}
          </div>

          {/* Simulated Form States */}
          <div className="space-y-2">
            <Label>Password</Label>
            <InputFeedback state="success">
              <Input type="password" placeholder="••••••••" defaultValue="password123" />
            </InputFeedback>
            <FormFeedback
              variant="success"
              message="Strong password with good security"
            />
          </div>

          <div className="space-y-2">
            <Label>Username</Label>
            <InputFeedback state="error" shakeOnError={false}>
              <Input type="text" placeholder="username" defaultValue="us" />
            </InputFeedback>
            <FormFeedback
              variant="error"
              message="Username must be at least 3 characters"
            />
          </div>
        </div>
      </div>
    )
  },
}

// ============================================================================
// SUCCESS CELEBRATIONS
// ============================================================================

export const SuccessCelebrations: Story = {
  render: () => {
    const [showConfetti, setShowConfetti] = React.useState(false)
    const [showCheckmark, setShowCheckmark] = React.useState(false)

    const celebrate = () => {
      setShowCheckmark(false)
      setShowConfetti(false)
      setTimeout(() => {
        setShowCheckmark(true)
        setShowConfetti(true)
      }, 50)
      setTimeout(() => {
        setShowConfetti(false)
      }, 2000)
    }

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Success Celebrations</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Delightful animations for celebrating successful actions. Includes confetti explosions
            and animated checkmarks.
          </p>

          <Button onClick={celebrate}>Celebrate Success! 🎉</Button>
        </div>

        {/* Celebration Display */}
        <div className="relative h-64 flex items-center justify-center bg-muted/30 rounded-lg">
          {showCheckmark && (
            <div className="space-y-4 text-center">
              <SuccessCheckmark size="xl" />
              <div>
                <h4 className="text-lg font-semibold text-green-600 dark:text-green-400">
                  Success!
                </h4>
                <p className="text-sm text-muted-foreground">Your payment was processed</p>
              </div>
            </div>
          )}
          <ConfettiExplosion isActive={showConfetti} particleCount={30} />
        </div>

        {/* All Checkmark Sizes */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Checkmark Sizes</h4>
          <div className="flex items-end gap-8">
            <div className="space-y-2">
              <SuccessCheckmark size="sm" />
              <p className="text-xs text-muted-foreground">Small</p>
            </div>
            <div className="space-y-2">
              <SuccessCheckmark size="md" />
              <p className="text-xs text-muted-foreground">Medium</p>
            </div>
            <div className="space-y-2">
              <SuccessCheckmark size="lg" />
              <p className="text-xs text-muted-foreground">Large</p>
            </div>
            <div className="space-y-2">
              <SuccessCheckmark size="xl" />
              <p className="text-xs text-muted-foreground">XL</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

// ============================================================================
// ERROR INDICATORS
// ============================================================================

export const ErrorIndicators: Story = {
  render: () => {
    const [showError, setShowError] = React.useState(false)

    const triggerError = () => {
      setShowError(false)
      setTimeout(() => {
        setShowError(true)
      }, 50)
    }

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Error Indicators</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Clear error indicators with animations to draw attention without being jarring.
          </p>

          <Button onClick={triggerError} variant="destructive">
            Show Error
          </Button>
        </div>

        {/* Error Display */}
        {showError && (
          <div className="space-y-4 text-center p-8 bg-muted/30 rounded-lg">
            <ErrorXMark size="xl" />
            <div>
              <h4 className="text-lg font-semibold text-red-600 dark:text-red-400">
                Payment Failed
              </h4>
              <p className="text-sm text-muted-foreground">
                Your card was declined. Please try a different payment method.
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowError(false)}>
              Try Again
            </Button>
          </div>
        )}

        {/* All X Mark Sizes */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">X Mark Sizes</h4>
          <div className="flex items-end gap-8">
            <div className="space-y-2">
              <ErrorXMark size="sm" />
              <p className="text-xs text-muted-foreground">Small</p>
            </div>
            <div className="space-y-2">
              <ErrorXMark size="md" />
              <p className="text-xs text-muted-foreground">Medium</p>
            </div>
            <div className="space-y-2">
              <ErrorXMark size="lg" />
              <p className="text-xs text-muted-foreground">Large</p>
            </div>
            <div className="space-y-2">
              <ErrorXMark size="xl" />
              <p className="text-xs text-muted-foreground">XL</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

// ============================================================================
// REAL-WORLD EXAMPLES
// ============================================================================

export const RealWorldExamples: Story = {
  render: () => {
    const [formState, setFormState] = React.useState<'idle' | 'loading' | 'success' | 'error'>(
      'idle'
    )
    const [showConfetti, setShowConfetti] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setFormState('loading')
      setShowConfetti(false)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Random success/error
      const success = Math.random() > 0.3
      if (success) {
        setFormState('success')
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 2000)
      } else {
        setFormState('error')
      }

      // Reset after delay
      setTimeout(() => {
        setFormState('idle')
      }, 4000)
    }

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Real-World Example: Form Submission</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Complete flow showing loading state, success celebration with confetti, or error
            feedback.
          </p>
        </div>

        <div className="relative max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-lg bg-card">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" type="email" placeholder="john@example.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Input id="message" placeholder="Tell us about your project..." required />
            </div>

            <Button type="submit" className="w-full" disabled={formState !== 'idle'}>
              {formState === 'loading' && 'Submitting...'}
              {formState === 'idle' && 'Submit Form'}
              {formState === 'success' && '✓ Submitted!'}
              {formState === 'error' && 'Try Again'}
            </Button>

            {/* Success State */}
            {formState === 'success' && (
              <div className="text-center space-y-3">
                <SuccessCheckmark size="lg" className="mx-auto" />
                <FormFeedback
                  variant="success"
                  message="Your form has been submitted successfully!"
                  showIcon={false}
                  className="justify-center"
                />
              </div>
            )}

            {/* Error State */}
            {formState === 'error' && (
              <div className="text-center space-y-3">
                <ErrorXMark size="md" className="mx-auto" />
                <FormFeedback
                  variant="error"
                  message="Failed to submit form. Please try again."
                  showIcon={false}
                  className="justify-center"
                />
              </div>
            )}
          </form>

          {/* Confetti */}
          <ConfettiExplosion isActive={showConfetti} particleCount={40} />
        </div>

        {/* Status Badges Example */}
        <div className="max-w-md mx-auto p-6 border rounded-lg bg-card space-y-4">
          <h4 className="text-sm font-semibold">System Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">API Server</span>
              <FeedbackBadge variant="success" size="sm">
                Operational
              </FeedbackBadge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <FeedbackBadge variant="warning" size="sm">
                Degraded
              </FeedbackBadge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">CDN</span>
              <FeedbackBadge variant="success" size="sm">
                Operational
              </FeedbackBadge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Service</span>
              <FeedbackBadge variant="error" size="sm">
                Down
              </FeedbackBadge>
            </div>
          </div>
        </div>
      </div>
    )
  },
}
