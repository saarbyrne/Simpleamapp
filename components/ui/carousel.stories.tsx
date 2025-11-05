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
    title: 'Fase preventiva',
    focus: 'Movilidad + Core',
    duration: '15 minutos',
  },
  {
    title: 'Bloque principal',
    focus: 'Fuerza excéntrica',
    duration: '30 minutos',
  },
  {
    title: 'Potencia',
    focus: 'Pliometría horizontal',
    duration: '20 minutos',
  },
  {
    title: 'Regenerativo',
    focus: 'Trabajo respiratorio',
    duration: '10 minutos',
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
                style={{
                  display: 'grid',
                  gap: tokens.spacing.gap.sm,
                  color: tokens.colors.text.secondary,
                }}
              >
                <span>{session.focus}</span>
                <span
                  style={{
                    fontSize: tokens.typography.body.sm.fontSize,
                    lineHeight: tokens.typography.body.sm.lineHeight,
                  }}
                >
                  Duración: {session.duration}
                </span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious aria-label="Bloque anterior" />
      <CarouselNext aria-label="Bloque siguiente" />
    </Carousel>
  ),
};
