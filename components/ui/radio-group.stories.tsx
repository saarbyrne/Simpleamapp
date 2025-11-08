import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { tokens } from '@/design-system/tokens';
import { useState } from 'react';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio Group',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('available');

    return (
      <RadioGroup value={value} onValueChange={setValue}>
        {[
          { value: 'available', label: 'Available' },
          { value: 'limited', label: 'Caution' },
          { value: 'unavailable', label: 'Unavailable' },
        ].map((option) => (
          <label
            key={option.value}
            className="text-foreground"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing.gap.sm,
              fontSize: tokens.typography.body.sm.fontSize,
            }}
          >
            <RadioGroupItem value={option.value} />
            {option.label}
          </label>
        ))}
      </RadioGroup>
    );
  },
};
