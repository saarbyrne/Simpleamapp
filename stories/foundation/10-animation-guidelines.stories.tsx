/**
 * Animation Guidelines
 *
 * Comprehensive guidelines for using animations in the design system.
 * Learn when to use animations, performance best practices, and accessibility considerations.
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, XCircle, AlertTriangle, Info, Zap, Gauge, Eye } from 'lucide-react'

const meta = {
  title: 'Foundation/Animation Guidelines',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Guidelines and best practices for using animations effectively in the design system. ' +
          'Learn about timing, easing, performance optimization, and accessibility.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// WHEN TO USE ANIMATIONS
// ============================================================================

export const WhenToUseAnimations: Story = {
  render: () => {
    return (
      <div className="space-y-8 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold mb-4">When to Use Animations</h2>
          <p className="text-muted-foreground mb-6">
            Animations should serve a purpose, not just decoration. Use them to guide attention,
            provide feedback, and create smooth transitions.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Good Use Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Good Use Cases
              </CardTitle>
              <CardDescription>When animations add value to the user experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="default" className="mt-0.5">
                    Feedback
                  </Badge>
                  <div>
                    <p className="font-medium">Confirming User Actions</p>
                    <p className="text-sm text-muted-foreground">
                      Animate success checkmarks, error shakes, and button states to confirm actions
                      were received.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="default" className="mt-0.5">
                    Context
                  </Badge>
                  <div>
                    <p className="font-medium">Maintaining Spatial Relationships</p>
                    <p className="text-sm text-muted-foreground">
                      Use slide/fade animations when opening modals or sidebars to show where they
                      came from.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="default" className="mt-0.5">
                    Attention
                  </Badge>
                  <div>
                    <p className="font-medium">Drawing Focus</p>
                    <p className="text-sm text-muted-foreground">
                      Animate new notifications or important changes to guide user attention.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="default" className="mt-0.5">
                    Loading
                  </Badge>
                  <div>
                    <p className="font-medium">Indicating Progress</p>
                    <p className="text-sm text-muted-foreground">
                      Show spinners, progress bars, or skeleton screens during async operations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="default" className="mt-0.5">
                    Transitions
                  </Badge>
                  <div>
                    <p className="font-medium">Smoothing State Changes</p>
                    <p className="text-sm text-muted-foreground">
                      Animate tab switches, accordion opens, and route changes to prevent jarring jumps.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bad Use Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                When to Avoid Animations
              </CardTitle>
              <CardDescription>Situations where animations can hurt the experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="destructive" className="mt-0.5">
                    Avoid
                  </Badge>
                  <div>
                    <p className="font-medium">Purely Decorative Animations</p>
                    <p className="text-sm text-muted-foreground">
                      Don't animate just to "add polish." Every animation should serve a purpose.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="destructive" className="mt-0.5">
                    Avoid
                  </Badge>
                  <div>
                    <p className="font-medium">Long or Slow Animations</p>
                    <p className="text-sm text-muted-foreground">
                      Animations over 500ms can make the UI feel sluggish. Keep them snappy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="destructive" className="mt-0.5">
                    Avoid
                  </Badge>
                  <div>
                    <p className="font-medium">Animating on Every Interaction</p>
                    <p className="text-sm text-muted-foreground">
                      Too many animations create visual noise. Reserve them for important moments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="destructive" className="mt-0.5">
                    Avoid
                  </Badge>
                  <div>
                    <p className="font-medium">Blocking Critical Actions</p>
                    <p className="text-sm text-muted-foreground">
                      Don't make users wait for animations to complete before they can proceed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="destructive" className="mt-0.5">
                    Avoid
                  </Badge>
                  <div>
                    <p className="font-medium">Excessive Motion</p>
                    <p className="text-sm text-muted-foreground">
                      Large movements, spinning, or bouncing can trigger motion sickness.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
}

// ============================================================================
// TIMING AND DURATION
// ============================================================================

export const TimingAndDuration: Story = {
  render: () => {
    const [showDemo, setShowDemo] = React.useState(false)

    const durations = [
      { name: 'Instant', value: 0, use: 'Reduced motion, instant feedback', example: '0ms' },
      { name: 'Fast', value: 150, use: 'Micro-interactions, hover states', example: '150ms' },
      { name: 'Normal', value: 250, use: 'Most UI animations, tooltips', example: '250ms' },
      { name: 'Moderate', value: 350, use: 'Modals, drawers, page elements', example: '350ms' },
      { name: 'Slow', value: 500, use: 'Major state changes, page transitions', example: '500ms' },
    ]

    return (
      <div className="space-y-8 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold mb-4">Timing & Duration</h2>
          <p className="text-muted-foreground mb-6">
            Animation duration has a huge impact on perceived performance. Too fast feels jarring,
            too slow feels sluggish.
          </p>
        </div>

        {/* Duration Scale */}
        <Card>
          <CardHeader>
            <CardTitle>Duration Scale</CardTitle>
            <CardDescription>Standard durations from the design system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {durations.map((duration) => (
                <div key={duration.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{duration.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">{duration.example}</span>
                    </div>
                    <Badge variant="outline">{duration.use}</Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: showDemo ? '100%' : 0 }}
                      transition={{ duration: duration.value / 1000, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => setShowDemo(!showDemo)} className="mt-6 w-full" variant="outline">
              {showDemo ? 'Reset' : 'See Durations in Action'}
            </Button>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Duration Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>
                <strong>Smaller elements = faster animations.</strong> Small components like buttons
                should animate at 150-250ms.
              </li>
              <li>
                <strong>Larger elements = slightly longer.</strong> Full-screen modals can use
                300-400ms.
              </li>
              <li>
                <strong>Exit animations should be faster than entrance.</strong> Use 150ms for exits
                vs 250ms for entrances.
              </li>
              <li>
                <strong>Never exceed 500ms.</strong> Anything longer feels sluggish and blocks the UI.
              </li>
              <li>
                <strong>Test on slower devices.</strong> Animations can lag on mobile or older
                hardware.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  },
}

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

export const EasingFunctions: Story = {
  render: () => {
    const [playing, setPlaying] = React.useState(false)

    const easings = [
      {
        name: 'Linear',
        value: 'linear',
        use: 'Spinners, continuous animations',
        curve: [0, 0, 1, 1],
      },
      {
        name: 'Ease Out',
        value: 'easeOut',
        use: 'Entrances, appearing elements',
        curve: [0, 0, 0.2, 1],
      },
      {
        name: 'Ease In',
        value: 'easeIn',
        use: 'Exits, disappearing elements',
        curve: [0.4, 0, 1, 1],
      },
      {
        name: 'Ease In Out',
        value: 'easeInOut',
        use: 'Smooth state changes',
        curve: [0.4, 0, 0.2, 1],
      },
    ]

    const startAnimation = () => {
      setPlaying(false)
      setTimeout(() => setPlaying(true), 50)
    }

    return (
      <div className="space-y-8 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold mb-4">Easing Functions</h2>
          <p className="text-muted-foreground mb-6">
            Easing functions control the acceleration curve of animations, making them feel natural
            and purposeful.
          </p>
        </div>

        {/* Easing Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Easing Comparison</CardTitle>
            <CardDescription>Watch how different easing functions affect motion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {easings.map((easing) => (
                <div key={easing.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{easing.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        cubic-bezier({easing.curve.join(', ')})
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {easing.use}
                    </Badge>
                  </div>
                  <div className="relative h-12 bg-muted rounded-lg">
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-lg"
                      animate={playing ? { x: 'calc(100vw - 700px)' } : { x: 0 }}
                      transition={{
                        duration: 1,
                        ease: easing.curve as any,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={startAnimation} className="mt-6 w-full" variant="outline">
              Play Animation
            </Button>
          </CardContent>
        </Card>

        {/* Easing Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>When to Use Each Easing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-1">Ease Out (Default) ✨</p>
                <p className="text-sm text-muted-foreground">
                  Use for elements entering the screen. Starts fast and slows down, creating a
                  natural deceleration effect. This is your default choice for most animations.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Ease In (Exits)</p>
                <p className="text-sm text-muted-foreground">
                  Use for elements leaving the screen. Starts slow and speeds up, making exits feel
                  quick and intentional.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Ease In Out (Smooth Transitions)</p>
                <p className="text-sm text-muted-foreground">
                  Use for elements moving between positions. Accelerates at the start and
                  decelerates at the end for smooth motion.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Linear (Mechanical)</p>
                <p className="text-sm text-muted-foreground">
                  Use sparingly for spinners, progress bars, or continuous loops. Linear motion
                  feels mechanical and unnatural for most UI interactions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
}

// ============================================================================
// PERFORMANCE BEST PRACTICES
// ============================================================================

export const PerformanceBestPractices: Story = {
  render: () => {
    return (
      <div className="space-y-8 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold mb-4">Performance Best Practices</h2>
          <p className="text-muted-foreground mb-6">
            Poorly optimized animations can cause jank, lag, and battery drain. Follow these
            practices to keep animations smooth.
          </p>
        </div>

        {/* GPU Accelerated Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-green-600" />
              GPU-Accelerated Properties (Fast ⚡)
            </CardTitle>
            <CardDescription>
              These properties are hardware-accelerated and perform at 60fps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-green-600 mb-2">✓ Always Use</p>
                <ul className="space-y-1 text-sm">
                  <li>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">transform</code> (x, y,
                    scale, rotate)
                  </li>
                  <li>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">opacity</code>
                  </li>
                  <li>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">filter</code> (blur,
                    brightness)
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-red-600 mb-2">✗ Avoid</p>
                <ul className="space-y-1 text-sm">
                  <li>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">width</code> / height
                    (causes reflow)
                  </li>
                  <li>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">top</code> / left /
                    right / bottom
                  </li>
                  <li>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">margin</code> / padding
                  </li>
                  <li>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">border</code>
                  </li>
                </ul>
              </div>
            </div>

            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Key Rule:</strong> Only animate <code>transform</code> and{' '}
                <code>opacity</code> for smooth 60fps animations. Other properties trigger expensive
                layout recalculations.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Performance Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Performance Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Use will-change Sparingly</p>
                  <p className="text-sm text-muted-foreground">
                    Framer Motion adds will-change automatically. Don't add it manually unless
                    absolutely needed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Limit Simultaneous Animations</p>
                  <p className="text-sm text-muted-foreground">
                    Animating too many elements at once can cause jank. Use stagger with delays
                    instead.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Test on Low-End Devices</p>
                  <p className="text-sm text-muted-foreground">
                    Animations that run smoothly on desktop may lag on mobile. Always test on real
                    devices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Use AnimatePresence for Exit Animations</p>
                  <p className="text-sm text-muted-foreground">
                    Framer Motion needs AnimatePresence to detect when elements unmount and play exit
                    animations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Reduce Motion Query</p>
                  <p className="text-sm text-muted-foreground">
                    Always check prefers-reduced-motion and disable/simplify animations for users who
                    need it.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Measure with Chrome DevTools</p>
                  <p className="text-sm text-muted-foreground">
                    Use the Performance tab to profile animations and identify bottlenecks. Aim for
                    60fps (16ms per frame).
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Good vs Bad Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-sm">Good: Use transform</span>
                </div>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`<motion.div
  animate={{ x: 100, opacity: 1 }}
  transition={{ duration: 0.3 }}
/>`}
                </pre>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-sm">Bad: Animate width/height</span>
                </div>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`<motion.div
  animate={{ width: 200, marginLeft: 50 }}
  transition={{ duration: 0.3 }}
/>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
}

// ============================================================================
// ACCESSIBILITY
// ============================================================================

export const AccessibilityGuidelines: Story = {
  render: () => {
    const [reducedMotion, setReducedMotion] = React.useState(false)

    return (
      <div className="space-y-8 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold mb-4">Accessibility Guidelines</h2>
          <p className="text-muted-foreground mb-6">
            Animations can cause discomfort, nausea, or seizures for some users. Always respect
            accessibility preferences.
          </p>
        </div>

        {/* Reduced Motion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Respecting prefers-reduced-motion
            </CardTitle>
            <CardDescription>
              Users with vestibular disorders may enable reduced motion in their OS settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                All animations in this design system respect{' '}
                <code className="text-xs">prefers-reduced-motion</code> by default. When enabled,
                animations are either removed or simplified to instant fades.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Simulate Reduced Motion</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle to see how animations change
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReducedMotion(!reducedMotion)}
                >
                  {reducedMotion ? 'Disable' : 'Enable'}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-3">Normal Motion</p>
                  <motion.div
                    className="h-16 bg-primary rounded"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  />
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-3">Reduced Motion</p>
                  <motion.div
                    className="h-16 bg-primary rounded"
                    animate={reducedMotion ? {} : { scale: [1, 1.05, 1] }}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { duration: 0.5, repeat: Infinity, repeatDelay: 1 }
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">1. Use Our Helper Functions</p>
                <p className="text-sm text-muted-foreground mb-2">
                  All animation utilities include <code>getSafeVariant()</code> functions that
                  automatically respect reduced motion:
                </p>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`import { getSafeFeedbackVariant } from '@/lib/feedback-animations'

<motion.div
  variants={getSafeFeedbackVariant(successBounce, 'success')}
  initial="initial"
  animate="animate"
/>`}
                </pre>
              </div>

              <div>
                <p className="font-medium mb-2">2. Manual Implementation</p>
                <p className="text-sm text-muted-foreground mb-2">
                  If building custom animations, check the media query:
                </p>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

const animation = prefersReducedMotion
  ? { opacity: [0, 1], transition: { duration: 0 } }
  : { y: [-20, 0], opacity: [0, 1], transition: { duration: 0.3 } }`}
                </pre>
              </div>

              <div>
                <p className="font-medium mb-2">3. Testing</p>
                <p className="text-sm text-muted-foreground mb-2">Enable reduced motion in your OS:</p>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>
                    <strong>macOS:</strong> System Preferences → Accessibility → Display → Reduce
                    motion
                  </li>
                  <li>
                    <strong>Windows:</strong> Settings → Ease of Access → Display → Show animations
                  </li>
                  <li>
                    <strong>Chrome DevTools:</strong> Cmd+Shift+P → "Emulate CSS
                    prefers-reduced-motion"
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Other Accessibility Considerations */}
        <Card>
          <CardHeader>
            <CardTitle>Other Accessibility Considerations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Avoid Flashing Animations</p>
                  <p className="text-sm text-muted-foreground">
                    Never flash more than 3 times per second. This can trigger seizures in
                    photosensitive users.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Provide Alternative Feedback</p>
                  <p className="text-sm text-muted-foreground">
                    Don't rely solely on animation. Also provide text, color, and ARIA attributes for
                    screen readers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Don't Hide Critical Content</p>
                  <p className="text-sm text-muted-foreground">
                    Important information shouldn't require animation to be visible. Use animations to
                    enhance, not gate, content.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Keyboard Navigation</p>
                  <p className="text-sm text-muted-foreground">
                    Ensure animated elements are still accessible via keyboard. Focus states should be
                    visible during animations.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
}

// ============================================================================
// COMMON PATTERNS
// ============================================================================

export const CommonPatterns: Story = {
  render: () => {
    const [activePattern, setActivePattern] = React.useState<string | null>(null)

    const patterns = [
      {
        id: 'stagger',
        name: 'Stagger Children',
        description: 'Animate list items sequentially',
        code: `<motion.ul variants={staggerContainer} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li key={item} variants={staggerItem}>
      {item}
    </motion.li>
  ))}
</motion.ul>`,
      },
      {
        id: 'modal',
        name: 'Modal Entry',
        description: 'Backdrop fade + content scale',
        code: `<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="backdrop"
      />
      <motion.div
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {content}
      </motion.div>
    </>
  )}
</AnimatePresence>`,
      },
      {
        id: 'scroll',
        name: 'Scroll Reveal',
        description: 'Animate when scrolling into view',
        code: `<motion.div
  initial={{ y: 60, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6 }}
>
  {content}
</motion.div>`,
      },
      {
        id: 'hover',
        name: 'Hover Lift',
        description: 'Lift cards on hover',
        code: `<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
>
  {content}
</motion.div>`,
      },
    ]

    return (
      <div className="space-y-8 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold mb-4">Common Animation Patterns</h2>
          <p className="text-muted-foreground mb-6">
            Reusable animation patterns for common UI scenarios. Click to see code examples.
          </p>
        </div>

        <div className="grid gap-4">
          {patterns.map((pattern) => (
            <Card
              key={pattern.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() =>
                setActivePattern(activePattern === pattern.id ? null : pattern.id)
              }
            >
              <CardHeader>
                <CardTitle className="text-base">{pattern.name}</CardTitle>
                <CardDescription>{pattern.description}</CardDescription>
              </CardHeader>
              {activePattern === pattern.id && (
                <CardContent>
                  <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
                    {pattern.code}
                  </pre>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
            <CardDescription>Essential imports and utilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Pre-built Animation Utilities</p>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`import { fadeIn, slideInFromRight, scaleIn } from '@/lib/animations'
import { successToast, errorShake } from '@/lib/feedback-animations'
import { pageFade, revealFromBottom } from '@/lib/page-transitions'
import { shimmer, spin, pulse } from '@/lib/loading-animations'`}
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Pre-built Components</p>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`import { FeedbackToast, FeedbackIcon } from '@/components/ui/feedback'
import { Spinner, ProgressBar, Skeleton } from '@/components/ui/loading'
import { PageTransition } from '@/components/ui/page-transition'`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
}
