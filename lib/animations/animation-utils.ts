/**
 * Animation Utilities
 *
 * Helper utilities and performance tools for working with animations.
 * Includes motion detection, performance monitoring, and testing helpers.
 */

/**
 * Check if user prefers reduced motion
 * Can be used in both browser and SSR contexts
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Create a motion media query listener
 * Returns a cleanup function to remove the listener
 */
export function watchReducedMotion(callback: (prefersReduced: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const handler = (e: MediaQueryListEvent | MediaQueryList) => {
    callback(e.matches)
  }

  // Call immediately with current value
  handler(mediaQuery)

  // Listen for changes
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handler)
    return () => mediaQuery.removeListener(handler)
  }
}

/**
 * Get a safe animation variant that respects reduced motion
 * Returns instant fade if reduced motion is preferred
 */
export function getSafeAnimation<T extends Record<string, any>>(
  animation: T,
  reducedAnimation?: T
): T {
  if (prefersReducedMotion()) {
    return (
      reducedAnimation || {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0 } },
        exit: { opacity: 0, transition: { duration: 0 } },
      }
    ) as T
  }
  return animation
}

/**
 * Calculate stagger delay for child animations
 */
export function getStaggerDelay(index: number, baseDelay: number = 0.1): number {
  return index * baseDelay
}

/**
 * Generate stagger children variants
 */
export function createStaggerVariants(options: {
  staggerChildren?: number
  delayChildren?: number
  staggerDirection?: 1 | -1
}) {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: options.staggerChildren || 0.1,
        delayChildren: options.delayChildren || 0,
        staggerDirection: options.staggerDirection || 1,
      },
    },
  }
}

/**
 * Create a responsive animation based on viewport size
 */
export function getResponsiveAnimation(options: {
  mobile: Record<string, any>
  desktop: Record<string, any>
  breakpoint?: number
}) {
  if (typeof window === 'undefined') return options.desktop

  const breakpoint = options.breakpoint || 768
  const isMobile = window.innerWidth < breakpoint

  return isMobile ? options.mobile : options.desktop
}

/**
 * Performance: Check if device has good animation performance
 * Returns false on low-end devices or when battery is low
 */
export function hasGoodAnimationPerformance(): boolean {
  if (typeof window === 'undefined') return true

  // Check if reduced motion is enabled
  if (prefersReducedMotion()) return false

  // Check battery status (if available)
  if ('getBattery' in navigator) {
    // Battery API is async, so this is a best-effort check
    // In practice, you'd want to call this once and cache the result
    ;(navigator as any).getBattery().then((battery: any) => {
      if (battery.level < 0.2 && !battery.charging) {
        return false
      }
    })
  }

  // Check hardware concurrency (CPU cores)
  // Devices with 2 or fewer cores might struggle with complex animations
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    return false
  }

  return true
}

/**
 * Measure animation performance
 * Returns the time taken to run an animation
 */
export async function measureAnimationPerformance(
  animationFn: () => Promise<void>
): Promise<number> {
  if (typeof performance === 'undefined') return 0

  const start = performance.now()
  await animationFn()
  const end = performance.now()

  return end - start
}

/**
 * Check if an element is in the viewport
 * Useful for scroll-triggered animations
 */
export function isInViewport(
  element: HTMLElement,
  offset: number = 0
): boolean {
  if (typeof window === 'undefined') return false

  const rect = element.getBoundingClientRect()
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  )
}

/**
 * Create intersection observer for scroll animations
 * Returns a cleanup function to disconnect the observer
 */
export function createScrollObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
): { observe: (element: Element) => void; disconnect: () => void } {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return {
      observe: () => {},
      disconnect: () => {},
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry)
        }
      })
    },
    {
      threshold: 0.3,
      rootMargin: '0px',
      ...options,
    }
  )

  return {
    observe: (element) => observer.observe(element),
    disconnect: () => observer.disconnect(),
  }
}

/**
 * Debounce function for animation triggers
 * Useful for scroll or resize events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for animation triggers
 * Ensures function runs at most once per interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Convert CSS duration string to milliseconds
 */
export function parseAnimationDuration(duration: string): number {
  if (duration.endsWith('ms')) {
    return parseFloat(duration)
  }
  if (duration.endsWith('s')) {
    return parseFloat(duration) * 1000
  }
  return parseFloat(duration)
}

/**
 * Generate random value within range for variation
 * Useful for confetti or particle effects
 */
export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Easing functions as JavaScript functions
 * Useful for custom animation logic outside of Framer Motion
 */
export const easingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
}

/**
 * Create a custom spring animation
 * Returns config for Framer Motion spring animations
 */
export function createSpringConfig(options: {
  stiffness?: number
  damping?: number
  mass?: number
  velocity?: number
}) {
  return {
    type: 'spring' as const,
    stiffness: options.stiffness || 300,
    damping: options.damping || 20,
    mass: options.mass || 1,
    velocity: options.velocity || 0,
  }
}

/**
 * Preload images for animations
 * Ensures smooth transitions by loading assets first
 */
export async function preloadImages(urls: string[]): Promise<void> {
  if (typeof window === 'undefined') return

  const promises = urls.map((url) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = reject
      img.src = url
    })
  })

  await Promise.all(promises)
}

/**
 * Get optimal animation duration based on distance
 * Longer distances get slightly longer durations
 */
export function getOptimalDuration(distance: number, baseSpeed: number = 1000): number {
  // Calculate duration based on distance traveled
  // Uses a logarithmic scale so long distances don't take forever
  const duration = Math.max(0.2, Math.min(0.6, Math.log(distance) / Math.log(baseSpeed)))
  return duration
}

/**
 * Testing: Create a promise that resolves after animation completes
 * Useful for testing animated components
 */
export function waitForAnimation(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

/**
 * Testing: Mock reduced motion preference
 * Useful for testing animation variants in tests
 */
export function mockReducedMotion(enabled: boolean): void {
  if (typeof window === 'undefined') return

  // Type guard for jest
  const jestAvailable = typeof (globalThis as any).jest !== 'undefined'
  
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jestAvailable
      ? (globalThis as any).jest.fn().mockImplementation((query: string) => ({
          matches: query.includes('prefers-reduced-motion') ? enabled : false,
          media: query,
          onchange: null,
          addListener: (globalThis as any).jest.fn(),
          removeListener: (globalThis as any).jest.fn(),
          addEventListener: (globalThis as any).jest.fn(),
          removeEventListener: (globalThis as any).jest.fn(),
          dispatchEvent: (globalThis as any).jest.fn(),
        }))
      : (query: string) => ({
          matches: query.includes('prefers-reduced-motion') ? enabled : false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }),
  })
}

/**
 * Browser support detection
 */
export function supportsAnimations(): boolean {
  if (typeof window === 'undefined') return false

  return (
    'animate' in document.createElement('div') &&
    typeof window.requestAnimationFrame !== 'undefined'
  )
}

/**
 * Get GPU tier estimate
 * Returns 'high', 'medium', or 'low'
 */
export function getGPUTier(): 'high' | 'medium' | 'low' {
  if (typeof window === 'undefined') return 'high'

  // Check for WebGL support and capabilities
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

  if (!gl) return 'low'

  const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info')
  if (!debugInfo) return 'medium'

  const renderer = (gl as WebGLRenderingContext).getParameter(
    debugInfo.UNMASKED_RENDERER_WEBGL
  )

  // Check for high-end GPUs
  if (
    typeof renderer === 'string' &&
    (renderer.includes('NVIDIA') || renderer.includes('AMD') || renderer.includes('Radeon'))
  ) {
    return 'high'
  }

  // Check for integrated/low-end GPUs
  if (typeof renderer === 'string' && renderer.includes('Intel')) {
    return 'low'
  }

  return 'medium'
}

/**
 * Adaptive animation quality
 * Returns simplified animation config for low-end devices
 */
export function getAdaptiveAnimationConfig(): {
  shouldAnimate: boolean
  reducedMotion: boolean
  gpuTier: 'high' | 'medium' | 'low'
} {
  return {
    shouldAnimate: hasGoodAnimationPerformance() && supportsAnimations(),
    reducedMotion: prefersReducedMotion(),
    gpuTier: getGPUTier(),
  }
}
