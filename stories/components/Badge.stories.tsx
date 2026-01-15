import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/ui/badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge className="bg-success text-success-foreground">Active</Badge>
      <Badge className="bg-warning text-warning-foreground">Pending</Badge>
      <Badge className="bg-destructive text-destructive-foreground">Inactive</Badge>
      <Badge className="bg-info text-info-foreground">Info</Badge>
    </div>
  ),
};

export const PlayerStatuses: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="font-semibold">Player Status Examples:</h3>
      <div className="flex flex-wrap gap-4">
        <Badge className="bg-success text-success-foreground hover:bg-success/90">Available</Badge>
        <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Injured</Badge>
        <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">Suspended</Badge>
        <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">Inactive</Badge>
      </div>
    </div>
  ),
};

export const WithDot: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge>
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        Online
      </Badge>
      <Badge variant="secondary">
        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
        Away
      </Badge>
      <Badge variant="outline">
        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
        Offline
      </Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge className="text-xs px-2 py-0.5">Small</Badge>
      <Badge>Default</Badge>
      <Badge className="text-base px-3 py-1.5">Large</Badge>
    </div>
  ),
};
