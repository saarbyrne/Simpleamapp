import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { UserIcon, ShieldIcon, CrownIcon, FlagIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';
import { Label } from './label';
import { tokens } from '@/design-system/tokens';

/**
 * Select Component Stories
 *
 * A customizable select dropdown with size variants, validation states,
 * icons, loading states, and grouped options. Built with shadcn aesthetic.
 */

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['onValueChange', 'value', 'defaultValue', 'children'],
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Select>;

const positions = [
  { value: 'forward', label: 'Forward' },
  { value: 'midfielder', label: 'Midfielder' },
  { value: 'defender', label: 'Defender' },
  { value: 'goalkeeper', label: 'Goalkeeper' },
] as const;

const countries = [
  { value: 'usa', label: 'United States' },
  { value: 'canada', label: 'Canada' },
  { value: 'mexico', label: 'Mexico' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'france', label: 'France' },
  { value: 'germany', label: 'Germany' },
  { value: 'spain', label: 'Spain' },
  { value: 'italy', label: 'Italy' },
] as const;

// ============================================================================
// Helper Components
// ============================================================================

function SelectDemo({
  placeholder = 'Select option',
  disabled = false,
  initialValue,
  size = 'md',
  variant = 'default',
  loading = false,
}: {
  placeholder?: string;
  disabled?: boolean;
  initialValue?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'error' | 'success' | 'warning';
  loading?: boolean;
}) {
  const [value, setValue] = useState<string | undefined>(initialValue);

  return (
    <div style={{ width: '280px' }}>
      <Select value={value} onValueChange={setValue} disabled={disabled}>
        <SelectTrigger size={size} variant={variant} loading={loading}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {positions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ============================================================================
// Basic Examples
// ============================================================================

/**
 * Default select with basic options
 */
export const Default: Story = {
  render: () => <SelectDemo placeholder="Select a position" />,
};

/**
 * Select with preselected value
 */
export const Preselected: Story = {
  render: () => <SelectDemo placeholder="Select position" initialValue="midfielder" />,
};

/**
 * Disabled select
 */
export const Disabled: Story = {
  render: () => <SelectDemo placeholder="Disabled" disabled />,
};

// ============================================================================
// Size Variants
// ============================================================================

/**
 * All available size variants
 */
export const SizeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.lg, width: '280px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label size="sm">Small</Label>
        <SelectDemo size="sm" placeholder="Small select" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label size="md">Medium (Default)</Label>
        <SelectDemo size="md" placeholder="Medium select" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label size="lg">Large</Label>
        <SelectDemo size="lg" placeholder="Large select" />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Validation States
// ============================================================================

/**
 * Select with error state
 */
export const ErrorState: Story = {
  render: () => <SelectDemo variant="error" placeholder="Select a position" />,
};

/**
 * Select with success state
 */
export const SuccessState: Story = {
  render: () => <SelectDemo variant="success" placeholder="Select a position" initialValue="forward" />,
};

/**
 * Select with warning state
 */
export const WarningState: Story = {
  render: () => <SelectDemo variant="warning" placeholder="Select a position" />,
};

/**
 * All validation states
 */
export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.lg, width: '280px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label>Default</Label>
        <SelectDemo variant="default" placeholder="Default state" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label>Error</Label>
        <SelectDemo variant="error" placeholder="Error state" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label>Success</Label>
        <SelectDemo variant="success" placeholder="Success state" initialValue="forward" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label>Warning</Label>
        <SelectDemo variant="warning" placeholder="Warning state" />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Loading State
// ============================================================================

/**
 * Select with loading spinner
 */
export const Loading: Story = {
  render: () => <SelectDemo loading placeholder="Loading options..." />,
};

/**
 * Loading states in different sizes
 */
export const LoadingSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.lg, width: '280px' }}>
      <SelectDemo size="sm" loading placeholder="Loading..." />
      <SelectDemo size="md" loading placeholder="Loading..." />
      <SelectDemo size="lg" loading placeholder="Loading..." />
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
 * Select items with icons
 */
export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState<string>();

    return (
      <div style={{ width: '280px' }}>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin" icon={<CrownIcon size={16} />}>
              Administrator
            </SelectItem>
            <SelectItem value="moderator" icon={<ShieldIcon size={16} />}>
              Moderator
            </SelectItem>
            <SelectItem value="user" icon={<UserIcon size={16} />}>
              User
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Grouped Options
// ============================================================================

/**
 * Select with grouped options
 */
export const WithGroups: Story = {
  render: () => {
    const [value, setValue] = useState<string>();

    return (
      <div style={{ width: '320px' }}>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select a player position" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Attacking</SelectLabel>
              <SelectItem value="striker">Striker</SelectItem>
              <SelectItem value="winger">Winger</SelectItem>
              <SelectItem value="attacking-mid">Attacking Midfielder</SelectItem>
            </SelectGroup>

            <SelectSeparator />

            <SelectGroup>
              <SelectLabel>Midfield</SelectLabel>
              <SelectItem value="center-mid">Center Midfielder</SelectItem>
              <SelectItem value="defensive-mid">Defensive Midfielder</SelectItem>
            </SelectGroup>

            <SelectSeparator />

            <SelectGroup>
              <SelectLabel>Defense</SelectLabel>
              <SelectItem value="fullback">Fullback</SelectItem>
              <SelectItem value="center-back">Center Back</SelectItem>
              <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Long List (Scrollable)
// ============================================================================

/**
 * Select with many options (scrollable)
 */
export const ScrollableList: Story = {
  render: () => {
    const [value, setValue] = useState<string>();

    return (
      <div style={{ width: '280px' }}>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Form Integration
// ============================================================================

/**
 * Select integrated in a form field
 */
export const FormField: Story = {
  render: () => {
    const [value, setValue] = useState<string>();

    return (
      <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
        <Label htmlFor="position" required>
          Player Position
        </Label>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger id="position">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {positions.map((position) => (
              <SelectItem key={position.value} value={position.value}>
                {position.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p
          className="text-muted-foreground"
          style={{
            fontSize: tokens.typography.body.xs.fontSize,
            marginTop: tokens.spacing.spacing.xs,
          }}
        >
          Choose the primary position for this player.
        </p>
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Form with multiple select fields
 */
export const MultipleFields: Story = {
  render: () => {
    const [position, setPosition] = useState<string>();
    const [country, setCountry] = useState<string>();
    const [role, setRole] = useState<string>();

    return (
      <div
        className="bg-card border"
        style={{
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing.gap.lg,
          padding: tokens.spacing.spacing.xl,
          borderRadius: tokens.radius.component.card,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
          <Label htmlFor="position-select" required>
            Position
          </Label>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger id="position-select">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos.value} value={pos.value}>
                  {pos.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
          <Label htmlFor="country-select" required>
            Country
          </Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger id="country-select">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.value} value={c.value} icon={<FlagIcon size={14} />}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
          <Label htmlFor="role-select" optional>
            Team Role
          </Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role-select">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="captain" icon={<CrownIcon size={16} />}>
                Team Captain
              </SelectItem>
              <SelectItem value="vice-captain" icon={<ShieldIcon size={16} />}>
                Vice Captain
              </SelectItem>
              <SelectItem value="member" icon={<UserIcon size={16} />}>
                Team Member
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
  },
};

// ============================================================================
// Complex Examples
// ============================================================================

/**
 * Comprehensive showcase of all features
 */
export const Showcase: Story = {
  render: () => {
    const [basicValue, setBasicValue] = useState<string>();
    const [sizeValue, setSizeValue] = useState<string>();
    const [validationValue, setValidationValue] = useState<string>();
    const [iconValue, setIconValue] = useState<string>();

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing.gap.xl,
          padding: tokens.spacing.spacing.xl,
          backgroundColor: tokens.colors.surface.elevated,
          borderRadius: tokens.radius.component.card,
          border: `1px solid ${tokens.colors.border.default}`,
          width: '500px',
        }}
      >
        {/* Basic */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
          <h3
            className="text-foreground"
            style={{
              fontSize: tokens.typography.heading.h5.fontSize,
              fontWeight: tokens.typography.heading.h5.fontWeight,
            }}
          >
            Basic Select
          </h3>
          <div style={{ display: 'flex', gap: tokens.spacing.gap.md }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
              <Label>Position</Label>
              <Select value={basicValue} onValueChange={setBasicValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
              <Label>Disabled</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Disabled" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test">Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
          <h3
            className="text-foreground"
            style={{
              fontSize: tokens.typography.heading.h5.fontSize,
              fontWeight: tokens.typography.heading.h5.fontWeight,
            }}
          >
            Size Variants
          </h3>
          <div style={{ display: 'flex', gap: tokens.spacing.gap.md, alignItems: 'end' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
              <Label size="sm">Small</Label>
              <Select value={sizeValue} onValueChange={setSizeValue}>
                <SelectTrigger size="sm">
                  <SelectValue placeholder="Small" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
              <Label>Medium</Label>
              <Select>
                <SelectTrigger size="md">
                  <SelectValue placeholder="Medium" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
              <Label size="lg">Large</Label>
              <Select>
                <SelectTrigger size="lg">
                  <SelectValue placeholder="Large" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Validation States */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
          <h3
            className="text-foreground"
            style={{
              fontSize: tokens.typography.heading.h5.fontSize,
              fontWeight: tokens.typography.heading.h5.fontWeight,
            }}
          >
            Validation States
          </h3>
          <div style={{ display: 'flex', gap: tokens.spacing.gap.md }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
              <Label>Error</Label>
              <Select value={validationValue} onValueChange={setValidationValue}>
                <SelectTrigger variant="error">
                  <SelectValue placeholder="Error" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.xs }}>
              <Label>Success</Label>
              <Select defaultValue="forward">
                <SelectTrigger variant="success">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* With Icons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.sm }}>
          <h3
            className="text-foreground"
            style={{
              fontSize: tokens.typography.heading.h5.fontSize,
              fontWeight: tokens.typography.heading.h5.fontWeight,
            }}
          >
            With Icons
          </h3>
          <Select value={iconValue} onValueChange={setIconValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin" icon={<CrownIcon size={16} />}>
                Administrator
              </SelectItem>
              <SelectItem value="moderator" icon={<ShieldIcon size={16} />}>
                Moderator
              </SelectItem>
              <SelectItem value="user" icon={<UserIcon size={16} />}>
                User
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
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
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Select {...args}>
        <SelectTrigger>
          <SelectValue placeholder="Select a position" />
        </SelectTrigger>
        <SelectContent>
          {positions.map((position) => (
            <SelectItem key={position.value} value={position.value}>
              {position.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};
