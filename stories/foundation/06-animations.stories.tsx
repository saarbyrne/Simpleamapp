import type { Meta, StoryObj } from '@storybook/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  fadeIn,
  fadeInFast,
  slideInFromRight,
  slideInFromLeft,
  slideInFromTop,
  slideInFromBottom,
  slideUpSmall,
  slideDownSmall,
  scaleIn,
  zoomIn,
  pop,
  staggerContainer,
  staggerItem,
  modalBackdrop,
  modalContent,
  drawerRight,
  dropdown,
  toastRight,
  shake,
} from '@/lib/animations'

/**
 * # Animations
 *
 * Pre-built Framer Motion animations that integrate with our design token motion system.
 * These animations respect `prefers-reduced-motion` for accessibility.
 *
 * ## Animation Principles
 *
 * - **Purposeful** - Every animation should have a reason
 * - **Performant** - Use transform and opacity (GPU accelerated)
 * - **Quick** - Most animations under 500ms
 * - **Accessible** - Respect prefers-reduced-motion
 * - **Consistent** - Use design tokens, not arbitrary values
 *
 * ## Performance Tips
 *
 * 1. Animate `transform` and `opacity` (GPU accelerated)
 * 2. Avoid animating width, height, top, left (causes reflow)
 * 3. Keep most animations under 300-500ms
 * 4. Use `will-change` sparingly (remove after animation)
 * 5. Test on lower-end devices
 */
const meta: Meta = {
  title: 'Foundation/Animations',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Framer Motion animation presets integrated with our design token system.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const AnimationDemo = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title: string
  description?: string
}) => (
  <Card className="border-2">
    <CardHeader className="pb-4">
      <CardTitle className="text-lg">{title}</CardTitle>
      {description && <CardDescription className="mt-2">{description}</CardDescription>}
    </CardHeader>
    <CardContent className="pt-4">{children}</CardContent>
  </Card>
)

/**
 * Fade animations are the most subtle and versatile.
 * Use for content that appears/disappears without drawing attention.
 */
export const FadeAnimations: Story = {
  render: () => {
    const [show1, setShow1] = useState(true)
    const [show2, setShow2] = useState(true)

    return (
      <div className="max-w-4xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Fade Animations</h2>
          <p className="text-lg text-muted-foreground">
            Subtle entrance and exit animations using opacity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimationDemo title="Fade In" description="Standard fade in animation (250ms)">
            <div className="space-y-4">
              <Button onClick={() => setShow1(!show1)}>Toggle</Button>
              <div className="h-32 border-2 rounded-lg bg-muted/30 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {show1 && (
                    <motion.div
                      key="fade-in"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold"
                    >
                      Hello! I fade in
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </AnimationDemo>

          <AnimationDemo title="Fade In Fast" description="Quick fade in (150ms)">
            <div className="space-y-4">
              <Button onClick={() => setShow2(!show2)}>Toggle</Button>
              <div className="h-32 border-2 rounded-lg bg-muted/30 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {show2 && (
                    <motion.div
                      key="fade-in-fast"
                      variants={fadeInFast}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="px-6 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold"
                    >
                      Quick fade!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </AnimationDemo>
        </div>
      </div>
    )
  },
}

/**
 * Slide animations draw attention to direction.
 * Use for panels, drawers, and directional content.
 */
export const SlideAnimations: Story = {
  render: () => {
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    const [show3, setShow3] = useState(false)
    const [show4, setShow4] = useState(false)

    return (
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Slide Animations</h2>
          <p className="text-lg text-muted-foreground">
            Directional animations that slide content into view
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimationDemo
            title="Slide from Right"
            description="For side panels and drawers (350ms)"
          >
            <div className="space-y-4">
              <Button onClick={() => setShow1(!show1)}>Toggle</Button>
              <div className="h-32 border-2 rounded-lg bg-muted/30 overflow-hidden relative">
                <AnimatePresence>
                  {show1 && (
                    <motion.div
                      variants={slideInFromRight}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute inset-0 bg-primary text-primary-foreground flex items-center justify-center font-semibold"
                    >
                      Slide from right →
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </AnimationDemo>

          <AnimationDemo
            title="Slide from Left"
            description="Alternative direction for panels"
          >
            <div className="space-y-4">
              <Button onClick={() => setShow2(!show2)}>Toggle</Button>
              <div className="h-32 border-2 rounded-lg bg-muted/30 overflow-hidden relative">
                <AnimatePresence>
                  {show2 && (
                    <motion.div
                      variants={slideInFromLeft}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute inset-0 bg-secondary text-secondary-foreground flex items-center justify-center font-semibold"
                    >
                      ← Slide from left
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </AnimationDemo>

          <AnimationDemo
            title="Slide from Top"
            description="For notifications and banners"
          >
            <div className="space-y-4">
              <Button onClick={() => setShow3(!show3)}>Toggle</Button>
              <div className="h-32 border-2 rounded-lg bg-muted/30 overflow-hidden relative">
                <AnimatePresence>
                  {show3 && (
                    <motion.div
                      variants={slideInFromTop}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute inset-0 bg-accent text-accent-foreground flex items-center justify-center font-semibold"
                    >
                      ↓ Slide from top
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </AnimationDemo>

          <AnimationDemo
            title="Slide from Bottom"
            description="For bottom sheets and toasts"
          >
            <div className="space-y-4">
              <Button onClick={() => setShow4(!show4)}>Toggle</Button>
              <div className="h-32 border-2 rounded-lg bg-muted/30 overflow-hidden relative">
                <AnimatePresence>
                  {show4 && (
                    <motion.div
                      variants={slideInFromBottom}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute inset-0 bg-muted text-foreground flex items-center justify-center font-semibold border-2"
                    >
                      ↑ Slide from bottom
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </AnimationDemo>
        </div>
      </div>
    )
  },
}

/**
 * Scale animations add emphasis and draw attention.
 * Use for modals, popovers, and important content.
 */
export const ScaleAnimations: Story = {
  render: () => {
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    const [show3, setShow3] = useState(false)

    return (
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Scale Animations</h2>
          <p className="text-lg text-muted-foreground">
            Animations that scale elements to draw attention
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimationDemo title="Scale In" description="Subtle scale (95% to 100%)">
            <div className="space-y-4">
              <Button onClick={() => setShow1(!show1)}>Toggle</Button>
              <div className="h-32 border-2 rounded-lg bg-muted/30 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {show1 && (
                    <motion.div
                      variants={scaleIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold"
                    >
                      Scale in
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </AnimationDemo>

          <AnimationDemo title="Zoom In" description="Dramatic scale (0% to 100%)">
            <div className="space-y-4">
              <Button onClick={() => setShow2(!show2)}>Toggle</Button>
              <div className="h-32 border-2 rounded-lg bg-muted/30 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {show2 && (
                    <motion.div
                      variants={zoomIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="px-6 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold"
                    >
                      Zoom!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </AnimationDemo>

          <AnimationDemo title="Pop" description="Spring animation with bounce">
            <div className="space-y-4">
              <Button onClick={() => setShow3(!show3)}>Toggle</Button>
              <div className="h-32 border-2 rounded-lg bg-muted/30 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {show3 && (
                    <motion.div
                      variants={pop}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="px-6 py-4 bg-accent text-accent-foreground rounded-lg font-semibold"
                    >
                      Pop! 🎉
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </AnimationDemo>
        </div>
      </div>
    )
  },
}

/**
 * Stagger animations create visual rhythm.
 * Use for lists, grids, and sequential content.
 */
export const StaggerAnimations: Story = {
  render: () => {
    const [show, setShow] = useState(true)
    const items = ['First', 'Second', 'Third', 'Fourth', 'Fifth']

    return (
      <div className="max-w-4xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Stagger Animations</h2>
          <p className="text-lg text-muted-foreground">
            Sequential animations that create visual rhythm
          </p>
        </div>

        <AnimationDemo
          title="Stagger Children"
          description="Items animate one after another (100ms delay)"
        >
          <div className="space-y-4">
            <Button onClick={() => setShow(!show)}>Toggle List</Button>
            <AnimatePresence mode="wait">
              {show && (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {items.map((item, i) => (
                    <motion.div
                      key={i}
                      variants={staggerItem}
                      className="p-4 bg-primary text-primary-foreground rounded-lg font-semibold"
                    >
                      {item} item
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnimationDemo>
      </div>
    )
  },
}

/**
 * Component-specific animations for common UI patterns.
 * These combine multiple animation techniques.
 */
export const ComponentAnimations: Story = {
  render: () => {
    const [showModal, setShowModal] = useState(false)
    const [showDrawer, setShowDrawer] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [showToast, setShowToast] = useState(false)

    return (
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Component Animations</h2>
          <p className="text-lg text-muted-foreground">
            Pre-built animations for common UI components
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimationDemo
            title="Modal/Dialog"
            description="Backdrop fade + content scale"
          >
            <Button onClick={() => setShowModal(!showModal)}>Show Modal</Button>
            <AnimatePresence>
              {showModal && (
                <>
                  <motion.div
                    variants={modalBackdrop}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={() => setShowModal(false)}
                    className="fixed inset-0 bg-black/50 z-50"
                  />
                  <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <motion.div
                      variants={modalContent}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="bg-background border-2 rounded-lg shadow-lg max-w-md w-full p-6 pointer-events-auto"
                    >
                      <h3 className="text-xl font-bold mb-2">Modal Title</h3>
                      <p className="text-muted-foreground mb-4">
                        This modal uses our scale + fade animation.
                      </p>
                      <Button onClick={() => setShowModal(false)}>Close</Button>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>
          </AnimationDemo>

          <AnimationDemo title="Drawer" description="Slide in from right">
            <Button onClick={() => setShowDrawer(!showDrawer)}>Show Drawer</Button>
            <AnimatePresence>
              {showDrawer && (
                <>
                  <motion.div
                    variants={modalBackdrop}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={() => setShowDrawer(false)}
                    className="fixed inset-0 bg-black/50 z-50"
                  />
                  <motion.div
                    variants={drawerRight}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed right-0 top-0 bottom-0 w-80 bg-background border-l-2 shadow-lg z-50 p-6"
                  >
                    <h3 className="text-xl font-bold mb-2">Drawer Title</h3>
                    <p className="text-muted-foreground mb-4">
                      This drawer slides in from the right.
                    </p>
                    <Button onClick={() => setShowDrawer(false)}>Close</Button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </AnimationDemo>

          <AnimationDemo title="Dropdown" description="Scale + slide down">
            <div className="relative">
              <Button onClick={() => setShowDropdown(!showDropdown)}>
                Toggle Dropdown
              </Button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    variants={dropdown}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full left-0 mt-2 w-64 bg-background border-2 rounded-lg shadow-lg p-4 z-50"
                  >
                    <div className="space-y-2">
                      <div className="px-2 py-1 hover:bg-accent rounded">Item 1</div>
                      <div className="px-2 py-1 hover:bg-accent rounded">Item 2</div>
                      <div className="px-2 py-1 hover:bg-accent rounded">Item 3</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimationDemo>

          <AnimationDemo title="Toast" description="Slide in from right">
            <Button onClick={() => setShowToast(true)}>Show Toast</Button>
            <AnimatePresence>
              {showToast && (
                <motion.div
                  variants={toastRight}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onAnimationComplete={() => {
                    if (showToast) {
                      setTimeout(() => setShowToast(false), 2000)
                    }
                  }}
                  className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-6 py-4 rounded-lg shadow-lg z-50"
                >
                  Toast notification!
                </motion.div>
              )}
            </AnimatePresence>
          </AnimationDemo>
        </div>
      </div>
    )
  },
}

/**
 * Specialized animations for feedback and attention.
 */
export const FeedbackAnimations: Story = {
  render: () => {
    const [isShaking, setIsShaking] = useState(false)

    const triggerShake = () => {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 600)
    }

    return (
      <div className="max-w-4xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Feedback Animations</h2>
          <p className="text-lg text-muted-foreground">
            Animations for user feedback and attention
          </p>
        </div>

        <AnimationDemo
          title="Shake (Error)"
          description="Use for form validation errors"
        >
          <div className="space-y-4">
            <Button onClick={triggerShake}>Trigger Error Shake</Button>
            <motion.div
              animate={isShaking ? 'shake' : ''}
              variants={shake}
              className="p-4 bg-destructive text-destructive-foreground rounded-lg font-semibold"
            >
              Error: Please check your input
            </motion.div>
          </div>
        </AnimationDemo>
      </div>
    )
  },
}

/**
 * Micro-interactions add polish to the interface.
 * Use for hover, focus, and click feedback.
 */
export const MicroInteractions: Story = {
  render: () => {
    return (
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Micro-Interactions</h2>
          <p className="text-lg text-muted-foreground">
            Subtle animations for hover, tap, and focus states
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimationDemo title="Hover Scale" description="Subtle scale on hover">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-6 bg-primary text-primary-foreground rounded-lg font-semibold cursor-pointer text-center"
            >
              Hover me
            </motion.div>
          </AnimationDemo>

          <AnimationDemo title="Lift on Hover" description="Elevate with shadow">
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 bg-secondary text-secondary-foreground rounded-lg font-semibold cursor-pointer text-center shadow-md"
            >
              Lift up
            </motion.div>
          </AnimationDemo>

          <AnimationDemo title="Tap Scale" description="Press down effect">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="p-6 bg-accent text-accent-foreground rounded-lg font-semibold cursor-pointer text-center"
            >
              Click me
            </motion.div>
          </AnimationDemo>
        </div>
      </div>
    )
  },
}
