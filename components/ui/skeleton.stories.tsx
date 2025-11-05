import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './skeleton';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: '280px',
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing.gap.sm,
      }}
    >
      <Skeleton style={{ height: tokens.spacing.spacing['3xl'] }} />
      <Skeleton style={{ height: tokens.spacing.spacing.lg, width: '70%' }} />
      <Skeleton style={{ height: tokens.spacing.spacing.lg, width: '55%' }} />
    </div>
  ),
};
