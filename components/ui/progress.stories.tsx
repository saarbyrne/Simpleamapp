import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing.gap.sm,
      }}
    >
      <span
        style={{
          fontSize: tokens.typography.body.sm.fontSize,
          lineHeight: tokens.typography.body.sm.lineHeight,
          color: tokens.colors.text.secondary,
        }}
      >
        Medical report completed
      </span>
      <Progress value={72} />
      <span
        style={{
          fontSize: tokens.typography.body.xs.fontSize,
          lineHeight: tokens.typography.body.xs.lineHeight,
          color: tokens.colors.text.secondary,
        }}
      >
        72% of forms have been completed this week.
      </span>
    </div>
  ),
};
