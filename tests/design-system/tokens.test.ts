/**
 * Design System Token Tests
 * 
 * Validates that design tokens are properly defined and consistent.
 */

import { describe, it, expect } from 'vitest'
import { motion } from '@/design-system/tokens/motion'
import { colors, colorVariables } from '@/design-system/tokens/colors'
import { spacing, spacingPatterns } from '@/design-system/tokens/spacing'
import { typography, typographyScale, typographyVariables } from '@/design-system/tokens/typography'

describe('Design System Tokens', () => {
  describe('Motion Tokens', () => {
    it('should have all duration values defined', () => {
      expect(motion.duration.fast).toBe('150')
      expect(motion.duration.moderate).toBe('250')
      expect(motion.duration.normal).toBe('300')
      expect(motion.duration.slow).toBe('500')
      expect(motion.duration.slower).toBe('700')
      expect(motion.duration.slowest).toBe('1000')
    })

    it('should have all easing functions defined', () => {
      expect(motion.easing.easeIn).toBe('cubic-bezier(0.4, 0, 1, 1)')
      expect(motion.easing.easeOut).toBe('cubic-bezier(0, 0, 0.2, 1)')
      expect(motion.easing.easeInOut).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
    })

    it('should have durations in ascending order', () => {
      const durations = [
        parseInt(motion.duration.fast),
        parseInt(motion.duration.moderate),
        parseInt(motion.duration.normal),
        parseInt(motion.duration.slow),
        parseInt(motion.duration.slower),
        parseInt(motion.duration.slowest),
      ]
      
      for (let i = 1; i < durations.length; i++) {
        expect(durations[i]).toBeGreaterThan(durations[i - 1])
      }
    })
  })

  describe('Color Tokens', () => {
    it('should have primary colors defined for light and dark modes', () => {
      expect(colors.primary.light).toBeDefined()
      expect(colors.primary.dark).toBeDefined()
      expect(colors.primary.foreground.light).toBeDefined()
      expect(colors.primary.foreground.dark).toBeDefined()
    })

    it('should have all semantic colors defined', () => {
      expect(colors.secondary).toBeDefined()
      expect(colors.destructive).toBeDefined()
      expect(colors.muted).toBeDefined()
      expect(colors.accent).toBeDefined()
    })

    it('should have background colors defined', () => {
      expect(colors.background).toBeDefined()
      expect(colors.foreground).toBeDefined()
      expect(colors.card).toBeDefined()
      expect(colors.popover).toBeDefined()
      expect(colors.pageBackground).toBeDefined()
      expect(colors.navBackground).toBeDefined()
    })

    it('should have sidebar colors defined', () => {
      expect(colors.sidebar).toBeDefined()
      expect(colors.sidebar.primary).toBeDefined()
      expect(colors.sidebar.accent).toBeDefined()
      expect(colors.sidebar.border).toBeDefined()
      expect(colors.sidebar.ring).toBeDefined()
    })

    it('should have chart colors defined', () => {
      expect(colors.chart['1']).toBeDefined()
      expect(colors.chart['2']).toBeDefined()
      expect(colors.chart['3']).toBeDefined()
      expect(colors.chart['4']).toBeDefined()
      expect(colors.chart['5']).toBeDefined()
    })

    it('should have all color variables defined', () => {
      expect(colorVariables.primary).toBe('--primary')
      expect(colorVariables.background).toBe('--background')
      expect(colorVariables.foreground).toBe('--foreground')
    })
  })

  describe('Spacing Tokens', () => {
    it('should have common spacing values defined', () => {
      expect(spacing['0']).toBe('0')
      expect(spacing['1']).toBe('0.25rem')
      expect(spacing['2']).toBe('0.5rem')
      expect(spacing['4']).toBe('1rem')
      expect(spacing['8']).toBe('2rem')
    })

    it('should have spacing patterns defined', () => {
      expect(spacingPatterns.cardPadding).toBeDefined()
      expect(spacingPatterns.formGap).toBeDefined()
      expect(spacingPatterns.sectionMargin).toBeDefined()
    })

    it('should have spacing values in rem units', () => {
      Object.values(spacing).forEach((value) => {
        if (value !== '0') {
          expect(value).toMatch(/rem$/)
        }
      })
    })
  })

  describe('Typography Tokens', () => {
    it('should have font families defined', () => {
      expect(typography.fontFamily.sans).toBeDefined()
      expect(typography.fontFamily.mono).toBeDefined()
    })

    it('should have font sizes defined', () => {
      expect(typography.fontSize.xs).toBe('0.75rem')
      expect(typography.fontSize.sm).toBe('0.875rem')
      expect(typography.fontSize.base).toBe('1rem')
      expect(typography.fontSize.lg).toBe('1.125rem')
      expect(typography.fontSize.xl).toBe('1.25rem')
    })

    it('should have font weights defined', () => {
      expect(typography.fontWeight.normal).toBe('400')
      expect(typography.fontWeight.medium).toBe('500')
      expect(typography.fontWeight.semibold).toBe('600')
      expect(typography.fontWeight.bold).toBe('700')
    })

    it('should have typography scale defined', () => {
      expect(typographyScale.h1).toBeDefined()
      expect(typographyScale.h2).toBeDefined()
      expect(typographyScale.h3).toBeDefined()
      expect(typographyScale.body).toBeDefined()
      expect(typographyScale.label).toBeDefined()
      expect(typographyScale.caption).toBeDefined()
    })

    it('should have typography variables defined', () => {
      expect(typographyVariables.fontSans).toBe('--font-sans')
      expect(typographyVariables.fontMono).toBe('--font-mono')
    })
  })

  describe('Token Consistency', () => {
    it('should have consistent token structure', () => {
      // All tokens should be exported as const objects
      expect(typeof motion).toBe('object')
      expect(typeof colors).toBe('object')
      expect(typeof spacing).toBe('object')
      expect(typeof typography).toBe('object')
    })

    it('should have no undefined values in tokens', () => {
      const allTokens = { motion, colors, spacing, typography }
      
      function checkForUndefined(obj: any, path = ''): string[] {
        const issues: string[] = []
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key
          if (value === undefined) {
            issues.push(currentPath)
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            issues.push(...checkForUndefined(value, currentPath))
          }
        }
        return issues
      }

      const undefinedValues = checkForUndefined(allTokens)
      expect(undefinedValues).toEqual([])
    })
  })
})
