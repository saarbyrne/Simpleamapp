import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRightIcon, PlusIcon, Trash2Icon, DownloadIcon, CheckIcon, XIcon } from 'lucide-react';
import { Button } from './button';
import { tokens } from '@/design-system/tokens';

/**
 * Button Component Stories
 *
 * A flexible button component with extensive variant support, loading states,
 * and icon positioning. Built with shadcn aesthetic and design tokens.
 */

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['asChild', 'ref'],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual style variant',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon'],
      description: 'Size of the button',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make button full width',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

// ============================================================================
// Basic Examples
// ============================================================================

/**
 * Default button with primary styling
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * Secondary variant with subtle styling
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

/**
 * Destructive variant for dangerous actions
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

/**
 * Outline variant with border
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

/**
 * Ghost variant with transparent background
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

/**
 * Link variant styled as hyperlink
 */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Learn more',
  },
};

// ============================================================================
// Size Variants
// ============================================================================

/**
 * All available size variants
 */
export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Icon button">
        <ArrowRightIcon size={16} />
      </Button>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Loading States
// ============================================================================

/**
 * Button with loading spinner
 */
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Processing...',
  },
};

/**
 * All variants in loading state
 */
export const LoadingVariants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button loading>Default</Button>
      <Button variant="secondary" loading>Secondary</Button>
      <Button variant="destructive" loading>Destructive</Button>
      <Button variant="outline" loading>Outline</Button>
      <Button variant="ghost" loading>Ghost</Button>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Different sizes in loading state
 */
export const LoadingSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button size="sm" loading>Small</Button>
      <Button loading>Default</Button>
      <Button size="lg" loading>Large</Button>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// With Icons
// ============================================================================

/**
 * Button with left icon
 */
export const WithLeftIcon: Story = {
  render: () => (
    <Button leftIcon={<PlusIcon size={16} />}>
      Add Item
    </Button>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Button with right icon
 */
export const WithRightIcon: Story = {
  render: () => (
    <Button rightIcon={<ArrowRightIcon size={16} />}>
      Continue
    </Button>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Various icon positions and combinations
 */
export const IconExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <Button leftIcon={<PlusIcon size={16} />}>
        Add Item
      </Button>

      <Button rightIcon={<ArrowRightIcon size={16} />}>
        Continue
      </Button>

      <Button variant="destructive" leftIcon={<Trash2Icon size={16} />}>
        Delete
      </Button>

      <Button variant="outline" leftIcon={<DownloadIcon size={16} />}>
        Download
      </Button>

      <Button size="icon" aria-label="Check">
        <CheckIcon size={16} />
      </Button>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Disabled State
// ============================================================================

/**
 * Disabled button
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

/**
 * All variants in disabled state
 */
export const DisabledVariants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button disabled>Default</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="destructive" disabled>Destructive</Button>
      <Button variant="outline" disabled>Outline</Button>
      <Button variant="ghost" disabled>Ghost</Button>
      <Button variant="link" disabled>Link</Button>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Full Width
// ============================================================================

/**
 * Full width button
 */
export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Button fullWidth>Full Width Button</Button>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Full width form example
 */
export const FullWidthForm: Story = {
  render: () => (
    <div style={{
      width: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacing.gap.md,
      padding: tokens.spacing.spacing.xl,
      backgroundColor: tokens.colors.surface.elevated,
      borderRadius: tokens.radius.component.card,
      border: `1px solid ${tokens.colors.border.default}`,
    }}>
      <Button fullWidth variant="default">Submit</Button>
      <Button fullWidth variant="outline">Cancel</Button>
      <Button fullWidth variant="ghost">Reset</Button>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Complex Examples
// ============================================================================

/**
 * All variants side by side
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Comprehensive button showcase
 */
export const Showcase: Story = {
  render: () => (
    <div className="bg-card border rounded-lg" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacing.gap.xl,
      padding: tokens.spacing.spacing.xl,
      borderRadius: tokens.radius.component.card,
    }}>
      {/* Primary actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
        <h3 className="text-foreground" style={{
          fontSize: tokens.typography.heading.h5.fontSize,
          fontWeight: tokens.typography.heading.h5.fontWeight,
        }}>
          Primary Actions
        </h3>
        <div className="flex gap-4 flex-wrap">
          <Button leftIcon={<PlusIcon size={16} />}>
            Create New
          </Button>
          <Button variant="secondary" leftIcon={<DownloadIcon size={16} />}>
            Download
          </Button>
          <Button variant="outline" rightIcon={<ArrowRightIcon size={16} />}>
            Continue
          </Button>
        </div>
      </div>

      {/* Destructive actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
        <h3 className="text-foreground" style={{
          fontSize: tokens.typography.heading.h5.fontSize,
          fontWeight: tokens.typography.heading.h5.fontWeight,
        }}>
          Destructive Actions
        </h3>
        <div className="flex gap-4 flex-wrap">
          <Button variant="destructive" leftIcon={<Trash2Icon size={16} />}>
            Delete
          </Button>
          <Button variant="destructive" size="sm">
            Remove All
          </Button>
          <Button variant="outline" size="icon" aria-label="Delete">
            <Trash2Icon size={16} />
          </Button>
        </div>
      </div>

      {/* Loading states */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
        <h3 className="text-foreground" style={{
          fontSize: tokens.typography.heading.h5.fontSize,
          fontWeight: tokens.typography.heading.h5.fontWeight,
        }}>
          Loading States
        </h3>
        <div className="flex gap-4 flex-wrap">
          <Button loading>Saving...</Button>
          <Button variant="secondary" loading>Processing</Button>
          <Button variant="outline" loading>Loading</Button>
        </div>
      </div>

      {/* Size variants */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
        <h3 className="text-foreground" style={{
          fontSize: tokens.typography.heading.h5.fontSize,
          fontWeight: tokens.typography.heading.h5.fontWeight,
        }}>
          Size Variants
        </h3>
        <div style={{ display: 'flex', gap: tokens.spacing.gap.md, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Form actions example
 */
export const FormActions: Story = {
  render: () => (
    <div className="bg-card border" style={{
      width: '500px',
      padding: tokens.spacing.spacing.xl,
      borderRadius: tokens.radius.component.card,
    }}>
      {/* Form content would go here */}
      <div className="bg-muted text-muted-foreground" style={{
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: tokens.radius.component.input,
        marginBottom: tokens.spacing.gap.lg,
      }}>
        Form fields here...
      </div>

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        gap: tokens.spacing.gap.md,
        justifyContent: 'flex-end',
      }}>
        <Button variant="ghost">
          Cancel
        </Button>
        <Button variant="outline">
          Save Draft
        </Button>
        <Button rightIcon={<CheckIcon size={16} />}>
          Submit
        </Button>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Interactive Playground
// ============================================================================

/**
 * Playground for testing all props combinations
 */
export const Playground: Story = {
  args: {
    children: 'Click me',
    variant: 'default',
    size: 'default',
    loading: false,
    fullWidth: false,
    disabled: false,
  },
};
