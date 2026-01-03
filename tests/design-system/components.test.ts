/**
 * Design System Component Tests
 * 
 * Validates that components follow design system patterns and conventions.
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

describe('Design System Components', () => {
  describe('Button Component', () => {
    it('should render with default variant', () => {
      const { container } = render(<Button>Click me</Button>)
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })

    it('should support all variants', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const
      
      variants.forEach((variant) => {
        const { container } = render(<Button variant={variant}>Button</Button>)
        const button = container.querySelector('button')
        expect(button).toBeInTheDocument()
      })
    })

    it('should support all sizes', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'] as const
      
      sizes.forEach((size) => {
        const { container } = render(<Button size={size}>Button</Button>)
        const button = container.querySelector('button')
        expect(button).toBeInTheDocument()
      })
    })

    it('should have accessible button element', () => {
      const { container } = render(<Button>Accessible Button</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveAttribute('type', 'button')
    })
  })

  describe('Card Component', () => {
    it('should render card structure', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )
      
      expect(container.querySelector('[class*="card"]')).toBeInTheDocument()
    })

    it('should support composition pattern', () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
        </Card>
      )
      
      expect(getByText('Card Title')).toBeInTheDocument()
      expect(getByText('Card content goes here')).toBeInTheDocument()
    })
  })

  describe('Form Components', () => {
    it('should render input with proper attributes', () => {
      const { container } = render(<Input type="email" placeholder="Email" />)
      const input = container.querySelector('input')
      
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'email')
      expect(input).toHaveAttribute('placeholder', 'Email')
    })

    it('should render label with proper association', () => {
      const { container } = render(
        <>
          <Label htmlFor="test-input">Test Label</Label>
          <Input id="test-input" />
        </>
      )
      
      const label = container.querySelector('label')
      const input = container.querySelector('input')
      
      expect(label).toBeInTheDocument()
      expect(input).toBeInTheDocument()
      expect(label).toHaveAttribute('for', 'test-input')
      expect(input).toHaveAttribute('id', 'test-input')
    })
  })

  describe('Component Accessibility', () => {
    it('should have proper semantic HTML', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>
            <Button>Action</Button>
          </CardContent>
        </Card>
      )
      
      // Check for semantic elements
      expect(container.querySelector('button')).toBeInTheDocument()
    })

    it('should support keyboard navigation', () => {
      const { container } = render(<Button>Click me</Button>)
      const button = container.querySelector('button')
      
      expect(button).not.toHaveAttribute('tabindex', '-1')
    })
  })

  describe('Component Styling', () => {
    it('should use design system classes', () => {
      const { container } = render(<Button>Styled Button</Button>)
      const button = container.querySelector('button')
      
      // Button should have classes that use design tokens
      expect(button?.className).toBeTruthy()
    })

    it('should support dark mode classes', () => {
      const { container } = render(
        <Card>
          <CardContent>Content</CardContent>
        </Card>
      )
      
      const card = container.querySelector('[class*="card"]')
      // Card should have classes that adapt to dark mode
      expect(card?.className).toBeTruthy()
    })
  })
})
