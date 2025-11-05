import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './sheet';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { tokens } from '@/design-system/tokens';
import { useState } from 'react';

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: () => {
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('Disponible');

    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button>Actualizar información del jugador</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Ficha médica</SheetTitle>
            <SheetDescription>
              Añade observaciones rápidas para el equipo médico. El jugador podrá ver las
              recomendaciones públicas.
            </SheetDescription>
          </SheetHeader>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing.gap.md,
              paddingLeft: tokens.spacing.spacing.xl,
              paddingRight: tokens.spacing.spacing.xl,
            }}
          >
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: tokens.spacing.gap.xs,
                fontSize: tokens.typography.body.sm.fontSize,
                color: tokens.colors.text.primary,
              }}
            >
              Estado actual
              <Input
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              />
            </label>
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: tokens.spacing.gap.xs,
                fontSize: tokens.typography.body.sm.fontSize,
                color: tokens.colors.text.primary,
              }}
            >
              Observaciones
              <Textarea
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Indica carga sugerida, recomendaciones de recuperación u otros comentarios relevantes."
              />
            </label>
          </div>
          <SheetFooter>
            <Button variant="secondary">Guardar como borrador</Button>
            <Button disabled={!notes.trim()}>Publicar para el staff</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  },
};
