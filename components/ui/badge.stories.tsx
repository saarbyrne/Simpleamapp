import type { Meta, StoryObj } from '@storybook/react';
import { Circle, Check, AlertCircle, Info } from 'lucide-react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    children: 'Badge',
    variant: 'default',
  },
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['ref', 'asChild'],
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Circle className="h-2 w-2 fill-current" />
        Live
      </>
    ),
  },
};

export const WithCheckIcon: Story = {
  render: () => (
    <Badge variant="secondary">
      <Check className="h-3 w-3 mr-1" />
      Verified
    </Badge>
  ),
};

export const WithAlertIcon: Story = {
  render: () => (
    <Badge variant="destructive">
      <AlertCircle className="h-3 w-3 mr-1" />
      Error
    </Badge>
  ),
};

export const WithInfoIcon: Story = {
  render: () => (
    <Badge variant="outline">
      <Info className="h-3 w-3 mr-1" />
      Info
    </Badge>
  ),
};

export const AllVariants: Story = {
  render: () => {
    const variants = ['default', 'secondary', 'destructive', 'outline'] as const;

    return (
      <div className="flex flex-wrap items-center gap-4">
        {variants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </div>
    );
  },
  parameters: {
    controls: { exclude: ['variant', 'children'] },
  },
};

export const IconExamples: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge>
        <Circle className="h-2 w-2 fill-current mr-1" />
        Live
      </Badge>
      <Badge variant="secondary">
        <Check className="h-3 w-3 mr-1" />
        Completed
      </Badge>
      <Badge variant="destructive">
        <AlertCircle className="h-3 w-3 mr-1" />
        Failed
      </Badge>
      <Badge variant="outline">
        <Info className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    </div>
  ),
  parameters: {
    controls: { exclude: ['variant', 'children'] },
  },
};
