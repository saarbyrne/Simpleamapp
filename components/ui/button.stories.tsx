import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['asChild', 'ref'],
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Button>;

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
    children: 'Delete',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Learn more',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        Continue
        <ArrowRightIcon className="size-4" aria-hidden />
      </>
    ),
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Icon button">
        <ArrowRightIcon className="size-4" aria-hidden />
      </Button>
    </div>
  ),
  parameters: {
    controls: { exclude: ['size', 'variant', 'children'] },
  },
};
