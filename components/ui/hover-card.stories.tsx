import type { Meta, StoryObj } from '@storybook/react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from './hover-card';
import { Avatar } from './avatar';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof HoverCard> = {
  title: 'Components/Hover Card',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <Avatar
          src="https://i.pravatar.cc/80?img=64"
          alt="Jordan Smith"
          style={{
            width: tokens.spacing.spacing['3xl'],
            height: tokens.spacing.spacing['3xl'],
          }}
        />
      </HoverCardTrigger>
      <HoverCardContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing.gap.sm,
          }}
        >
          <div>
            <h4
              style={{
                fontSize: tokens.typography.heading.h5.fontSize,
                fontWeight: tokens.typography.heading.h5.fontWeight,
                lineHeight: tokens.typography.heading.h5.lineHeight,
                color: tokens.colors.text.primary,
              }}
            >
              Jordan Smith
            </h4>
            <p
              style={{
                fontSize: tokens.typography.body.sm.fontSize,
                lineHeight: tokens.typography.body.sm.lineHeight,
                color: tokens.colors.text.secondary,
              }}
            >
              Center back • Individual plan active
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing.gap.xs,
              fontSize: tokens.typography.body.xs.fontSize,
              lineHeight: tokens.typography.body.xs.lineHeight,
              color: tokens.colors.text.secondary,
            }}
          >
            <span>• Acute load: balanced</span>
            <span>• Last alert: 12 days ago</span>
            <span>• Next medical check: Thursday</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
