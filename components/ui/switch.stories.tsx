import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';
import { useState } from 'react';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

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
        Notificar cambios al staff
        <Switch checked={checked} onCheckedChange={setChecked} />
      </label>
    );
  },
};
