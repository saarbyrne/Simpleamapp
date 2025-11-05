import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Button } from './button';
import { Input } from './input';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => {
    const [objective, setObjective] = useState('');

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Agregar objetivo semanal</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing.gap.sm,
            }}
          >
            <h4
              style={{
                fontSize: tokens.typography.heading.h5.fontSize,
                fontWeight: tokens.typography.heading.h5.fontWeight,
                lineHeight: tokens.typography.heading.h5.lineHeight,
                color: tokens.colors.text.primary,
              }}
            >
              Objetivo del equipo
            </h4>
            <p
              style={{
                fontSize: tokens.typography.body.sm.fontSize,
                lineHeight: tokens.typography.body.sm.lineHeight,
                color: tokens.colors.text.secondary,
              }}
            >
              Define un punto clave para la semana. Esto se mostrará en el dashboard del staff.
            </p>
            <Input
              value={objective}
              onChange={(event) => setObjective(event.target.value)}
              placeholder="Ej. Mejorar la comunicación defensiva"
            />
            <Button disabled={!objective}>Guardar objetivo</Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
};
