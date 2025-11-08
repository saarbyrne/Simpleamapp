import type { Meta, StoryObj } from '@storybook/react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from './hover-card';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
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
        <button className="cursor-pointer">
          <Avatar size="xl">
            <AvatarImage src="https://i.pravatar.cc/80?img=64" alt="Jordan Smith" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
        </button>
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
              className="text-foreground"
              style={{
                fontSize: tokens.typography.heading.h5.fontSize,
                fontWeight: tokens.typography.heading.h5.fontWeight,
                lineHeight: tokens.typography.heading.h5.lineHeight,
              }}
            >
              Jordan Smith
            </h4>
            <p
              className="text-muted-foreground"
              style={{
                fontSize: tokens.typography.body.sm.fontSize,
                lineHeight: tokens.typography.body.sm.lineHeight,
              }}
            >
              Center back • Individual plan active
            </p>
          </div>
          <div
            className="text-muted-foreground"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing.gap.xs,
              fontSize: tokens.typography.body.xs.fontSize,
              lineHeight: tokens.typography.body.xs.lineHeight,
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
