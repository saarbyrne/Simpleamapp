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
          <Button variant="secondary">Add weekly objective</Button>
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
              className="text-foreground"
              style={{
                fontSize: tokens.typography.heading.h5.fontSize,
                fontWeight: tokens.typography.heading.h5.fontWeight,
                lineHeight: tokens.typography.heading.h5.lineHeight,
              }}
            >
              Team objective
            </h4>
            <p
              className="text-muted-foreground"
              style={{
                fontSize: tokens.typography.body.sm.fontSize,
                lineHeight: tokens.typography.body.sm.lineHeight,
              }}
            >
              Define a key point for the week. This will be shown on the staff dashboard.
            </p>
            <Input
              value={objective}
              onChange={(event) => setObjective(event.target.value)}
              placeholder="E.g. Improve defensive communication"
            />
            <Button disabled={!objective}>Save objective</Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
};
