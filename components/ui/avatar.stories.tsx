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

export const Player: Story = {
  render: () => (
    <Avatar
      style={{
        boxShadow: tokens.elevation.shadow.xs,
      }}
    >
      <AvatarImage src="https://i.pravatar.cc/128?img=65" alt="Delantero titular" />
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
