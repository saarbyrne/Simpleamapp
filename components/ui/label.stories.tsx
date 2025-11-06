import type { Meta, StoryObj } from '@storybook/react';
import { Label, LabelDescription, LabelError } from './label';
import { Input } from './input';
import { tokens } from '@/design-system/tokens';

/**
 * Label Component Stories
 *
 * An accessible label component for form inputs with enhanced features including
 * required/optional indicators, size variants, and helper components for descriptions
 * and error messages.
 */

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['ref', 'asChild'],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the label',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Show required indicator (red asterisk)',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    optional: {
      control: 'boolean',
      description: 'Show optional indicator text',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state styling',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Label>;

// ============================================================================
// Basic Examples
// ============================================================================

/**
 * Default label with basic text
 */
export const Default: Story = {
  args: {
    children: 'Email Address',
    htmlFor: 'email',
  },
};

/**
 * Label with input field demonstrating typical usage
 */
export const WithInput: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
      <Label htmlFor="player-name">Player Name</Label>
      <Input id="player-name" placeholder="Jordan Smith" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Label with description text providing additional context
 */
export const WithDescription: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
      <Label htmlFor="email">Email Address</Label>
      <LabelDescription>We'll use this to send team updates and notifications.</LabelDescription>
      <Input id="email" type="email" placeholder="player@example.com" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Required and Optional Indicators
// ============================================================================

/**
 * Label with required indicator (red asterisk)
 */
export const Required: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
      <Label htmlFor="full-name" required>Full Name</Label>
      <Input id="full-name" placeholder="Enter your full name" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Label with optional indicator text
 */
export const Optional: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
      <Label htmlFor="nickname" optional>Nickname</Label>
      <Input id="nickname" placeholder="Enter a nickname" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xl, width: '320px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
        <Label htmlFor="small" size="sm">Small Label</Label>
        <Input id="small" size="sm" placeholder="Small input" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
        <Label htmlFor="medium" size="md">Medium Label (Default)</Label>
        <Input id="medium" size="md" placeholder="Medium input" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
        <Label htmlFor="large" size="lg">Large Label</Label>
        <Input id="large" size="lg" placeholder="Large input" />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Error States
// ============================================================================

/**
 * Label with error message
 */
export const WithError: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
      <Label htmlFor="username" required>Username</Label>
      <Input id="username" variant="error" defaultValue="ab" />
      <LabelError>Username must be at least 3 characters.</LabelError>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Multiple error messages stacked
 */
export const MultipleErrors: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
      <Label htmlFor="password" required>Password</Label>
      <Input id="password" type="password" variant="error" defaultValue="12" />
      <LabelError>Password is too short.</LabelError>
      <LabelError>Password must contain at least one letter.</LabelError>
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
 * Disabled label with disabled input
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
      <Label htmlFor="disabled-field" disabled>Disabled Field</Label>
      <Input id="disabled-field" disabled placeholder="Cannot edit this field" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Complex Form Examples
// ============================================================================

/**
 * Complete form field with all features
 */
export const CompleteFormField: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
      <Label htmlFor="bio" required>Biography</Label>
      <LabelDescription>
        Tell us about your athletic background and achievements. This will be shown on your profile.
      </LabelDescription>
      <textarea
        id="bio"
        rows={4}
        placeholder="I've been playing basketball since..."
        style={{
          width: '100%',
          padding: tokens.spacing.component.inputPadding,
          fontSize: tokens.typography.ui.input.fontSize,
          lineHeight: tokens.typography.ui.input.lineHeight,
          border: `1px solid ${tokens.colors.border.default}`,
          borderRadius: tokens.radius.component.input,
          backgroundColor: tokens.colors.surface.sunken,
          color: tokens.colors.text.primary,
          resize: 'vertical',
        }}
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Form with multiple fields and mixed states
 */
export const FormExample: Story = {
  render: () => (
    <div style={{
      width: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacing.gap.lg,
      padding: tokens.spacing.spacing.xl,
      backgroundColor: tokens.colors.surface.elevated,
      borderRadius: tokens.radius.component.card,
      border: `1px solid ${tokens.colors.border.default}`,
    }}>
      {/* Required field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label htmlFor="form-name" required>Full Name</Label>
        <Input id="form-name" placeholder="Jordan Smith" />
      </div>

      {/* Optional field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label htmlFor="form-nickname" optional>Preferred Nickname</Label>
        <Input id="form-nickname" placeholder="J-Smith" />
      </div>

      {/* Field with description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label htmlFor="form-email" required>Email Address</Label>
        <LabelDescription>We'll use this for important team communications.</LabelDescription>
        <Input id="form-email" type="email" placeholder="player@example.com" />
      </div>

      {/* Field with error */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label htmlFor="form-phone" required>Phone Number</Label>
        <Input id="form-phone" variant="error" defaultValue="555" />
        <LabelError>Please enter a valid phone number.</LabelError>
      </div>

      {/* Disabled field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label htmlFor="form-team" disabled>Team Assignment</Label>
        <Input id="form-team" disabled defaultValue="Will be assigned by coach" />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Composition Examples
// ============================================================================

/**
 * All helper components together
 */
export const AllHelperComponents: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xl }}>
      {/* Success state */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label htmlFor="success-field" required>Validated Field</Label>
        <LabelDescription>This field has been successfully validated.</LabelDescription>
        <Input id="success-field" variant="success" defaultValue="Valid input" />
      </div>

      {/* Warning state */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label htmlFor="warning-field" optional>Optional Field</Label>
        <LabelDescription>Providing this information helps us serve you better.</LabelDescription>
        <Input id="warning-field" variant="warning" defaultValue="Uncommon format" />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Different size combinations
 */
export const SizeCombinations: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xl }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label htmlFor="small-combo" size="sm" required>Small Field</Label>
        <LabelDescription size="sm">Smaller description text.</LabelDescription>
        <Input id="small-combo" size="sm" placeholder="Small input" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label htmlFor="large-combo" size="lg" required>Large Field</Label>
        <LabelDescription size="lg">Larger description text for better readability.</LabelDescription>
        <Input id="large-combo" size="lg" placeholder="Large input" />
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
    children: 'Label Text',
    htmlFor: 'playground-input',
    size: 'md',
    required: false,
    optional: false,
    disabled: false,
  },
  render: (args) => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
      <Label {...args} />
      <Input id="playground-input" disabled={args.disabled} placeholder="Type something..." />
    </div>
  ),
};
