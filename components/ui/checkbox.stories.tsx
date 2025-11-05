import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { tokens } from '@/design-system/tokens';
import { useState } from 'react';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);

    return (
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.gap.sm,
          fontSize: tokens.typography.body.sm.fontSize,
          color: tokens.colors.text.primary,
        }}
      >
        Incluir en informe semanal
        <Checkbox checked={checked} onCheckedChange={setChecked} />
      </label>
    );
  },
};
