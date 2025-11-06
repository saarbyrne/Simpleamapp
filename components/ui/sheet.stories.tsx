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
          <Button>Update player information</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Ficha médica</SheetTitle>
            <SheetDescription>
              Add quick observations for the medical team. The player will be able to see the
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
                placeholder="Indicate suggested load, recovery recommendations or other relevant comments."
              />
            </label>
          </div>
          <SheetFooter>
            <Button variant="secondary">Save as draft</Button>
            <Button disabled={!notes.trim()}>Publish for staff</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  },
};
