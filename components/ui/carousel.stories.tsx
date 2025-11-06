import type { Meta, StoryObj } from '@storybook/react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './carousel';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Carousel>;

const sessions = [
  {
    title: 'Preventive Phase',
    focus: 'Mobility + Core',
    duration: '15 minutes',
  },
  {
    title: 'Main Block',
    focus: 'Eccentric Strength',
    duration: '30 minutes',
  },
  {
    title: 'Power',
    focus: 'Horizontal Plyometrics',
    duration: '20 minutes',
  },
  {
    title: 'Recovery',
    focus: 'Breathing Work',
    duration: '10 minutes',
  },
];

export const TrainingBlocks: Story = {
  render: () => (
    <Carousel style={{ width: '480px' }}>
      <CarouselContent
        style={{
          gap: tokens.spacing.gap.lg,
        }}
      >
        {sessions.map((session) => (
          <CarouselItem key={session.title}>
            <Card
              style={{
                borderRadius: tokens.radius.component.card,
                boxShadow: tokens.elevation.shadow.sm,
                height: '100%',
              }}
            >
              <CardHeader>
                <CardTitle>{session.title}</CardTitle>
              </CardHeader>
              <CardContent
                className="text-muted-foreground"
                style={{
                  display: 'grid',
                  gap: tokens.spacing.gap.sm,
                }}
              >
                <span>{session.focus}</span>
                <span
                  style={{
                    fontSize: tokens.typography.body.sm.fontSize,
                    lineHeight: tokens.typography.body.sm.lineHeight,
                  }}
                >
                  Duration: {session.duration}
                </span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious aria-label="Previous block" />
      <CarouselNext aria-label="Next block" />
    </Carousel>
  ),
};
