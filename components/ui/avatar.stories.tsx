import type { Meta, StoryObj } from '@storybook/react';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar
      style={{
        boxShadow: tokens.elevation.shadow.xs,
      }}
    >
      <AvatarImage src="https://i.pravatar.cc/128?img=65" alt="Player" />
      <AvatarFallback
        style={{
          fontSize: tokens.typography.body.md.fontSize,
          fontWeight: tokens.typography.fontWeight.medium,
        }}
      >
        DR
      </AvatarFallback>
    </Avatar>
  ),
};

export const Small: Story = {
  render: () => (
    <Avatar
      size="sm"
      style={{
        boxShadow: tokens.elevation.shadow.xs,
      }}
    >
      <AvatarImage src="https://i.pravatar.cc/128?img=65" alt="Player" />
      <AvatarFallback className="text-xs">DR</AvatarFallback>
    </Avatar>
  ),
};

export const Medium: Story = {
  render: () => (
    <Avatar
      size="md"
      style={{
        boxShadow: tokens.elevation.shadow.xs,
      }}
    >
      <AvatarImage src="https://i.pravatar.cc/128?img=65" alt="Player" />
      <AvatarFallback
        style={{
          fontSize: tokens.typography.body.md.fontSize,
          fontWeight: tokens.typography.fontWeight.medium,
        }}
      >
        DR
      </AvatarFallback>
    </Avatar>
  ),
};

export const Large: Story = {
  render: () => (
    <Avatar
      size="lg"
      style={{
        boxShadow: tokens.elevation.shadow.xs,
      }}
    >
      <AvatarImage src="https://i.pravatar.cc/128?img=65" alt="Player" />
      <AvatarFallback className="text-lg font-medium">DR</AvatarFallback>
    </Avatar>
  ),
};

export const ExtraLarge: Story = {
  render: () => (
    <Avatar
      size="xl"
      style={{
        boxShadow: tokens.elevation.shadow.xs,
      }}
    >
      <AvatarImage src="https://i.pravatar.cc/128?img=65" alt="Player" />
      <AvatarFallback className="text-2xl font-medium">DR</AvatarFallback>
    </Avatar>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar size="sm">
          <AvatarImage src="https://i.pravatar.cc/128?img=65" alt="Player" />
          <AvatarFallback className="text-xs">SM</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="md">
          <AvatarImage src="https://i.pravatar.cc/128?img=66" alt="Player" />
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src="https://i.pravatar.cc/128?img=67" alt="Player" />
          <AvatarFallback className="text-lg">LG</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">Large</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="xl">
          <AvatarImage src="https://i.pravatar.cc/128?img=68" alt="Player" />
          <AvatarFallback className="text-2xl">XL</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">X-Large</span>
      </div>
    </div>
  ),
};
