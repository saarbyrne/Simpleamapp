import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Calendar } from './calendar';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<Date | undefined>(new Date());

    return (
      <Calendar
        mode="single"
        selected={value}
        onSelect={setValue}
        style={{
          backgroundColor: tokens.colors.surface.base,
          boxShadow: tokens.elevation.shadow.md,
        }}
      />
    );
  },
};
