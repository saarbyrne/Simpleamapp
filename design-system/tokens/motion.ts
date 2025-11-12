/**
 * Motion Design Tokens
 * 
 * Standard animation durations and easing functions for consistent motion design.
 */

export const motion = {
  duration: {
    fast: '150',
    moderate: '250',
    normal: '300',
    slow: '500',
    slower: '700',
    slowest: '1000',
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

