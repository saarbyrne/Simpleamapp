import type { Meta, StoryObj } from '@storybook/react';
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
        <span aria-hidden>•</span>
        Live
      </>
    ),
  },
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
