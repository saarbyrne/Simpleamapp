import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Spinner,
  SpinnerFast,
  BounceLoader,
  DotsLoader,
  WaveLoader,
  ProgressBar,
  CircularProgress,
  Skeleton,
  LoadingOverlay,
  LoadingButton,
} from '@/components/ui/loading'

/**
 * # Loading States
 *
 * Pre-built loading indicators, progress bars, and skeleton screens
 * for async operations and data fetching.
 *
 * ## Loading Principles
 *
 * - **Immediate feedback** - Show loading state within 100ms
 * - **Appropriate duration** - Use different loaders for different wait times
 * - **Skeleton screens** - Show structure while loading (better than spinners)
 * - **Progress indication** - Show progress when duration is known
 * - **Accessible** - All loaders have proper ARIA attributes
 *
 * ## Best Practices
 *
 * - **< 1 second**: Use spinner or dots
 * - **1-5 seconds**: Use progress bar or skeleton
 * - **> 5 seconds**: Use progress bar with percentage
 * - **Unknown duration**: Use indeterminate progress or skeleton
 * - **Always** respect prefers-reduced-motion
 */
const meta: Meta = {
  title: 'Foundation/Loading States',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Loading indicators, progress bars, and skeleton screens for async operations.',
      },
    },
  },
}

export default meta
type Story = StoryObj

/**
 * Spinner variations
 */
export const Spinners: Story = {
  render: () => {
    return (
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Spinners</h2>
          <p className="text-lg text-muted-foreground">
            Classic rotating spinners for quick loading states
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Spinner Sizes</CardTitle>
              <CardDescription>Four size options: sm, md, lg, xl</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-6">
                <div className="text-center space-y-2">
                  <Spinner size="sm" className="text-primary mx-auto" />
                  <p className="text-xs text-muted-foreground">Small</p>
                </div>
                <div className="text-center space-y-2">
                  <Spinner size="md" className="text-primary mx-auto" />
                  <p className="text-xs text-muted-foreground">Medium</p>
                </div>
                <div className="text-center space-y-2">
                  <Spinner size="lg" className="text-primary mx-auto" />
                  <p className="text-xs text-muted-foreground">Large</p>
                </div>
                <div className="text-center space-y-2">
                  <Spinner size="xl" className="text-primary mx-auto" />
                  <p className="text-xs text-muted-foreground">X-Large</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Spinner Fast</CardTitle>
              <CardDescription>Faster rotation for quick operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-6 h-24">
                <div className="text-center space-y-2">
                  <SpinnerFast size="md" className="text-primary mx-auto" />
                  <p className="text-xs text-muted-foreground">Normal</p>
                </div>
                <div className="text-center space-y-2">
                  <SpinnerFast size="md" className="text-destructive mx-auto" />
                  <p className="text-xs text-muted-foreground">Destructive</p>
                </div>
                <div className="text-center space-y-2">
                  <SpinnerFast size="md" className="text-muted-foreground mx-auto" />
                  <p className="text-xs text-muted-foreground">Muted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
}

/**
 * Dot loaders
 */
export const DotLoaders: Story = {
  render: () => {
    return (
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Dot Loaders</h2>
          <p className="text-lg text-muted-foreground">
            Animated dots for subtle loading feedback
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Bounce Loader</CardTitle>
              <CardDescription>Dots bounce up and down</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-24">
                <BounceLoader className="text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Dots Loader</CardTitle>
              <CardDescription>Dots pulse in sequence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-24">
                <DotsLoader className="text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Wave Loader</CardTitle>
              <CardDescription>Vertical bars create wave effect</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-24">
                <WaveLoader className="text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Custom Colors</CardTitle>
              <CardDescription>Loaders inherit text color</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-8 h-24">
                <DotsLoader className="text-green-600" />
                <DotsLoader className="text-blue-600" />
                <DotsLoader className="text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
}

/**
 * Progress indicators
 */
export const ProgressIndicators: Story = {
  render: () => {
    const [progress1, setProgress1] = useState(0)
    const [progress2, setProgress2] = useState(0)

    useEffect(() => {
      const timer1 = setInterval(() => {
        setProgress1((prev) => (prev >= 100 ? 0 : prev + 10))
      }, 500)
      const timer2 = setInterval(() => {
        setProgress2((prev) => (prev >= 100 ? 0 : prev + 5))
      }, 300)
      return () => {
        clearInterval(timer1)
        clearInterval(timer2)
      }
    }, [])

    return (
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Progress Indicators</h2>
          <p className="text-lg text-muted-foreground">
            Show progress for operations with known duration
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Progress Bar (Determinate)</CardTitle>
              <CardDescription>Shows exact progress percentage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm text-muted-foreground">{progress1}%</span>
                </div>
                <ProgressBar progress={progress1} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Processing...</span>
                  <span className="text-sm text-muted-foreground">{progress2}%</span>
                </div>
                <ProgressBar progress={progress2} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Progress Bar (Indeterminate)</CardTitle>
              <CardDescription>For unknown duration tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-2">Loading data...</p>
                <ProgressBar indeterminate />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Connecting to server...</p>
                <ProgressBar indeterminate className="h-1" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Circular Progress (Determinate)</CardTitle>
                <CardDescription>With percentage display</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center gap-8">
                  <CircularProgress progress={progress1} size={80} strokeWidth={6} />
                  <CircularProgress progress={progress2} size={60} strokeWidth={5} />
                  <CircularProgress progress={75} size={40} strokeWidth={4} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Circular Progress (Indeterminate)</CardTitle>
                <CardDescription>Spinning animation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center gap-8">
                  <CircularProgress indeterminate size={80} strokeWidth={6} />
                  <CircularProgress indeterminate size={60} strokeWidth={5} />
                  <CircularProgress indeterminate size={40} strokeWidth={4} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Skeleton screens
 */
export const SkeletonScreens: Story = {
  render: () => {
    const [loading, setLoading] = useState(true)

    return (
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Skeleton Screens</h2>
          <p className="text-lg text-muted-foreground">
            Show structure while content loads (better UX than spinners)
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Card Skeleton</CardTitle>
                  <CardDescription>Common pattern for loading cards</CardDescription>
                </div>
                <Button onClick={() => setLoading(!loading)}>
                  {loading ? 'Show Content' : 'Show Skeleton'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Real Content Title</h3>
                  <p className="text-muted-foreground">
                    This is the actual content that appears after loading completes.
                  </p>
                  <div className="h-24 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Image placeholder</span>
                  </div>
                  <div className="flex gap-2">
                    <Button>Action 1</Button>
                    <Button variant="outline">Action 2</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>List Skeleton</CardTitle>
              <CardDescription>For loading lists of items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Table Skeleton</CardTitle>
              <CardDescription>For loading tabular data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex gap-4">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-6 flex-1" />
                    <Skeleton className="h-6 flex-1" />
                    <Skeleton className="h-6 flex-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
}

/**
 * Loading overlays
 */
export const LoadingOverlays: Story = {
  render: () => {
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)

    return (
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Loading Overlays</h2>
          <p className="text-lg text-muted-foreground">
            Block UI while loading with overlay
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Spinner Overlay</CardTitle>
              <CardDescription>Classic spinner overlay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setLoading1(!loading1)}>
                {loading1 ? 'Stop Loading' : 'Start Loading'}
              </Button>
              <LoadingOverlay loading={loading1} loaderType="spinner">
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Content area</p>
                </div>
              </LoadingOverlay>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Custom Loader Overlay</CardTitle>
              <CardDescription>Different loader types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setLoading2(!loading2)}>
                {loading2 ? 'Stop Loading' : 'Start Loading'}
              </Button>
              <LoadingOverlay loading={loading2} loaderType="wave">
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Content area</p>
                </div>
              </LoadingOverlay>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
}

/**
 * Button loading states
 */
export const ButtonLoadingStates: Story = {
  render: () => {
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [loading3, setLoading3] = useState(false)

    const simulateAsync = (setLoading: (val: boolean) => void) => {
      setLoading(true)
      setTimeout(() => setLoading(false), 2000)
    }

    return (
      <div className="max-w-4xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Button Loading States</h2>
          <p className="text-lg text-muted-foreground">
            Buttons with inline loading indicators
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Loading Buttons</CardTitle>
            <CardDescription>
              Buttons show spinner during async operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <LoadingButton
                loading={loading1}
                onClick={() => simulateAsync(setLoading1)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Save Changes
              </LoadingButton>
              <LoadingButton
                loading={loading2}
                onClick={() => simulateAsync(setLoading2)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg"
              >
                Delete Item
              </LoadingButton>
              <LoadingButton
                loading={loading3}
                onClick={() => simulateAsync(setLoading3)}
                className="px-4 py-2 border-2 rounded-lg"
              >
                Load More
              </LoadingButton>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
}

/**
 * Real-world examples
 */
export const RealWorldExamples: Story = {
  render: () => {
    const [dataLoading, setDataLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const simulateDataLoad = () => {
      setDataLoading(true)
      setTimeout(() => setDataLoading(false), 3000)
    }

    const simulateUpload = () => {
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 0
          }
          return prev + 10
        })
      }, 300)
    }

    return (
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold mb-3">Real-World Examples</h2>
          <p className="text-lg text-muted-foreground">
            Common loading patterns in actual use cases
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Data Table Loading</CardTitle>
              <CardDescription>Shows skeleton while fetching data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={simulateDataLoad}>Load Data</Button>
              {dataLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-6 flex-1" />
                      <Skeleton className="h-6 flex-1" />
                      <Skeleton className="h-6 flex-1" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-4 font-semibold">
                    <div className="flex-1">Name</div>
                    <div className="flex-1">Email</div>
                    <div className="flex-1">Status</div>
                  </div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-4 text-sm">
                      <div className="flex-1">User {i}</div>
                      <div className="flex-1">user{i}@example.com</div>
                      <div className="flex-1">Active</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>File Upload</CardTitle>
              <CardDescription>Progress bar during upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={simulateUpload}>Start Upload</Button>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      Uploading document.pdf...
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {uploadProgress}%
                    </span>
                  </div>
                  <ProgressBar progress={uploadProgress} />
                </div>
              )}
              {uploadProgress === 100 && (
                <div className="p-4 bg-green-50 dark:bg-green-950 border-2 border-green-600 dark:border-green-500 rounded-lg text-sm">
                  ✓ Upload complete!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
}
