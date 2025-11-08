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
    const [status, setStatus] = useState('Available');

    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button>Update player information</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Medical Record</SheetTitle>
            <SheetDescription>
              Add quick observations for the medical team. The player will be able to see the
              public recommendations.
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
              className="text-foreground"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: tokens.spacing.gap.xs,
                fontSize: tokens.typography.body.sm.fontSize,
              }}
            >
              Current Status
              <Input
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              />
            </label>
            <label
              className="text-foreground"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: tokens.spacing.gap.xs,
                fontSize: tokens.typography.body.sm.fontSize,
              }}
            >
              Observations
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
