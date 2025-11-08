import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './scroll-area';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/Scroll Area',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea
      className="border"
      style={{
        width: '320px',
        height: '180px',
        borderRadius: tokens.radius.radius.md,
        padding: tokens.spacing.spacing.sm,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing.gap.sm,
        }}
      >
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="text-foreground"
            style={{
              fontSize: tokens.typography.body.sm.fontSize,
              lineHeight: tokens.typography.body.sm.lineHeight,
            }}
          >
            Entry #{index + 1}: training session summary and notes for staff.
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
