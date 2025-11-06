import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';
import { Button } from './button';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Collapsible>;

export const TrainingNotes: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);

    return (
      <Collapsible open={open} onOpenChange={setOpen} style={{ width: '360px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing.gap.sm,
            padding: tokens.spacing.spacing.lg,
            borderRadius: tokens.radius.component.card,
            backgroundColor: tokens.colors.surface.base,
            boxShadow: tokens.elevation.shadow.sm,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h4
              style={{
                fontSize: tokens.typography.heading.h5.fontSize,
                fontWeight: tokens.typography.heading.h5.fontWeight,
                lineHeight: tokens.typography.heading.h5.lineHeight,
                margin: 0,
              }}
            >
              Medical staff instructions
            </h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {open ? 'Hide' : 'Show'}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <p
              style={{
                fontSize: tokens.typography.body.sm.fontSize,
                lineHeight: tokens.typography.body.sm.lineHeight,
                color: tokens.colors.text.secondary,
                margin: 0,
              }}
            >
              Limitar cambios de dirección en los últimos dos bloques y priorizar activaciones de
              deep core. Reinforce check with physio after session.
            </p>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  },
};
