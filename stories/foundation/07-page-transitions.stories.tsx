import type { Meta, StoryObj } from '@storybook/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  pageFade,
  pageSlideRight,
  pageSlideLeft,
  pageScale,
  pageSlideUp,
  pageContentStagger,
  pageContentItem,
  heroAnimation,
  cardGrid,
  cardGridItem,
  listStagger,
  listItem,
  revealFromBottom,
  revealFromLeft,
  revealFromRight,
  scaleReveal,
  tabPanel,
  accordionPanel,
  notificationBadge,
} from '@/lib/page-transitions'

/**
 * # Page Transitions
 *
 * Animations for route changes, layout shifts, and page-level content.
 * These transitions work with Next.js App Router and provide smooth UX.
 *
 * ## Usage with Next.js
 *
 * ```tsx
 * // In app/template.tsx
 * import { PageTransition } from '@/components/ui/page-transition'
 *
 * export default function Template({ children }) {
 *   return <PageTransition type="slide">{children}</PageTransition>
 * }
 * ```
 *
 * ## Best Practices
 *
 * - Keep page transitions under 500ms
 * - Always respect prefers-reduced-motion
 * - Use subtle effects for frequent navigation
 * - Save dramatic effects for important moments
 * - Test on slower devices
 */
const meta: Meta = {
  title: 'Foundation/Page Transitions',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page-level animations for route changes, content reveals, and layout shifts.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const DemoPage = ({ title, color }: { title: string; color: string }) => (
  <div
    className={`min-h-[400px] flex items-center justify-center ${color}`}
  >
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground">This is a demo page</p>
    </div>
  </div>
)

/**
 * Basic page transition types
 */
export const PageTransitionTypes: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(0)
    const [transitionType, setTransitionType] = useState<
      'fade' | 'slideRight' | 'slideLeft' | 'scale' | 'slideUp'
    >('fade')

    const pages = [
      { title: 'Page 1', color: 'bg-blue-50 dark:bg-blue-950' },
      { title: 'Page 2', color: 'bg-green-50 dark:bg-green-950' },
      { title: 'Page 3', color: 'bg-purple-50 dark:bg-purple-950' },
    ]

    const transitions = {
      fade: pageFade,
      slideRight: pageSlideRight,
      slideLeft: pageSlideLeft,
      scale: pageScale,
      slideUp: pageSlideUp,
    }

    return (
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Page Transition Types</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Different animation styles for page changes
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Select Transition Type</CardTitle>
            <CardDescription>Choose how pages animate between route changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={transitionType === 'fade' ? 'default' : 'outline'}
                onClick={() => setTransitionType('fade')}
              >
                Fade
              </Button>
              <Button
                variant={transitionType === 'slideRight' ? 'default' : 'outline'}
                onClick={() => setTransitionType('slideRight')}
              >
                Slide Right
              </Button>
              <Button
                variant={transitionType === 'slideLeft' ? 'default' : 'outline'}
                onClick={() => setTransitionType('slideLeft')}
              >
                Slide Left
              </Button>
              <Button
                variant={transitionType === 'scale' ? 'default' : 'outline'}
                onClick={() => setTransitionType('scale')}
              >
                Scale
              </Button>
              <Button
                variant={transitionType === 'slideUp' ? 'default' : 'outline'}
                onClick={() => setTransitionType('slideUp')}
              >
                Slide Up
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage((p) => (p > 0 ? p - 1 : pages.length - 1))}
              >
                ← Previous
              </Button>
              <Button
                onClick={() => setCurrentPage((p) => (p < pages.length - 1 ? p + 1 : 0))}
              >
                Next →
              </Button>
            </div>

            <div className="border-2 rounded-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  variants={transitions[transitionType]}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <DemoPage {...pages[currentPage]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
}

/**
 * Staggered content animation for page load
 */
export const StaggeredContent: Story = {
  render: () => {
    const [show, setShow] = useState(true)

    return (
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Staggered Content</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Content appears sequentially when page loads
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Page Content Stagger</CardTitle>
            <CardDescription>
              Sections appear one after another for visual rhythm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setShow(!show)}>Toggle Content</Button>

            <AnimatePresence mode="wait">
              {show && (
                <motion.div
                  variants={pageContentStagger}
                  initial="initial"
                  animate="animate"
                  className="space-y-4"
                >
                  <motion.div
                    variants={pageContentItem}
                    className="p-6 bg-primary text-primary-foreground rounded-lg"
                  >
                    <h3 className="font-bold text-lg mb-2">Section 1</h3>
                    <p>This section appears first</p>
                  </motion.div>
                  <motion.div
                    variants={pageContentItem}
                    className="p-6 bg-secondary text-secondary-foreground rounded-lg"
                  >
                    <h3 className="font-bold text-lg mb-2">Section 2</h3>
                    <p>This section appears second</p>
                  </motion.div>
                  <motion.div
                    variants={pageContentItem}
                    className="p-6 bg-accent text-accent-foreground rounded-lg"
                  >
                    <h3 className="font-bold text-lg mb-2">Section 3</h3>
                    <p>This section appears third</p>
                  </motion.div>
                  <motion.div
                    variants={pageContentItem}
                    className="p-6 bg-muted text-foreground rounded-lg border-2"
                  >
                    <h3 className="font-bold text-lg mb-2">Section 4</h3>
                    <p>This section appears last</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    )
  },
}

/**
 * Card grid with stagger animation
 */
export const CardGridStagger: Story = {
  render: () => {
    const [show, setShow] = useState(true)
    const cards = Array.from({ length: 6 }, (_, i) => ({
      title: `Card ${i + 1}`,
      description: 'This card animates into view',
    }))

    return (
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Card Grid Stagger</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Grid items appear sequentially with stagger effect
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Staggered Grid</CardTitle>
            <CardDescription>Common pattern for dashboards and galleries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setShow(!show)}>Toggle Grid</Button>

            <AnimatePresence mode="wait">
              {show && (
                <motion.div
                  variants={cardGrid}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {cards.map((card, i) => (
                    <motion.div key={i} variants={cardGridItem}>
                      <Card className="border-2">
                        <CardHeader>
                          <CardTitle>{card.title}</CardTitle>
                          <CardDescription>{card.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    )
  },
}

/**
 * List with stagger animation
 */
export const ListStagger: Story = {
  render: () => {
    const [show, setShow] = useState(true)
    const items = [
      'First list item',
      'Second list item',
      'Third list item',
      'Fourth list item',
      'Fifth list item',
    ]

    return (
      <div className="max-w-4xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">List Stagger</h2>
          <p className="text-lg text-muted-foreground mb-6">
            List items slide in sequentially
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Staggered List</CardTitle>
            <CardDescription>Common for search results, notifications, etc.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setShow(!show)}>Toggle List</Button>

            <AnimatePresence mode="wait">
              {show && (
                <motion.ul
                  variants={listStagger}
                  initial="initial"
                  animate="animate"
                  className="space-y-2"
                >
                  {items.map((item, i) => (
                    <motion.li
                      key={i}
                      variants={listItem}
                      className="p-4 bg-muted rounded-lg border-2"
                    >
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    )
  },
}

/**
 * Scroll-based reveal animations
 */
export const ScrollReveal: Story = {
  render: () => {
    return (
      <div className="max-w-4xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Scroll Reveal Animations</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Elements animate into view when scrolled to (scroll down to see)
          </p>
        </div>

        <div className="space-y-[400px]">
          <motion.div {...revealFromBottom}>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Reveal from Bottom</CardTitle>
                <CardDescription>Slides up and fades in</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This card animates when it comes into view from the bottom.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...revealFromLeft}>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Reveal from Left</CardTitle>
                <CardDescription>Slides from left side</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This card animates from the left when scrolled into view.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...revealFromRight}>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Reveal from Right</CardTitle>
                <CardDescription>Slides from right side</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This card animates from the right when scrolled into view.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...scaleReveal}>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Scale Reveal</CardTitle>
                <CardDescription>Scales up when visible</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This card scales up when it becomes visible.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  },
}

/**
 * Tab panel transitions
 */
export const TabTransitions: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1')

    return (
      <div className="max-w-4xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Tab Transitions</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Smooth transitions between tab content
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Animated Tabs</CardTitle>
            <CardDescription>Content slides when switching tabs</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <div className="mt-4 min-h-[200px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'tab1' && (
                    <motion.div
                      key="tab1"
                      variants={tabPanel}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="p-6 bg-primary text-primary-foreground rounded-lg"
                    >
                      <h3 className="text-xl font-bold mb-2">Tab 1 Content</h3>
                      <p>This is the content for tab 1. It slides in smoothly.</p>
                    </motion.div>
                  )}
                  {activeTab === 'tab2' && (
                    <motion.div
                      key="tab2"
                      variants={tabPanel}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="p-6 bg-secondary text-secondary-foreground rounded-lg"
                    >
                      <h3 className="text-xl font-bold mb-2">Tab 2 Content</h3>
                      <p>This is the content for tab 2. Notice the smooth transition.</p>
                    </motion.div>
                  )}
                  {activeTab === 'tab3' && (
                    <motion.div
                      key="tab3"
                      variants={tabPanel}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="p-6 bg-accent text-accent-foreground rounded-lg"
                    >
                      <h3 className="text-xl font-bold mb-2">Tab 3 Content</h3>
                      <p>This is the content for tab 3. Same animation pattern.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  },
}

/**
 * Notification badge animation
 */
export const NotificationBadge: Story = {
  render: () => {
    const [count, setCount] = useState(0)

    return (
      <div className="max-w-4xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Notification Badge</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Badge appears with spring animation
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Animated Badge</CardTitle>
            <CardDescription>Common for notification counts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Button onClick={() => setCount(count + 1)}>Add Notification</Button>
              <Button variant="outline" onClick={() => setCount(0)}>
                Clear
              </Button>
            </div>

            <div className="flex justify-center p-12">
              <div className="relative">
                <Button size="lg">Notifications</Button>
                <AnimatePresence>
                  {count > 0 && (
                    <motion.div
                      variants={notificationBadge}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                    >
                      {count}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
}
