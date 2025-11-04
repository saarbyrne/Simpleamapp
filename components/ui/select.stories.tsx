import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'] as const;

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['onValueChange', 'value', 'defaultValue'],
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Select>;

function SelectDemo({
  placeholder = 'Select option',
  disabled = false,
  initialValue,
}: {
  placeholder?: string;
  disabled?: boolean;
  initialValue?: string;
}) {
  const [value, setValue] = useState<string | undefined>(initialValue);

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger disabled={disabled}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {positions.map((option) => (
          <SelectItem key={option} value={option.toLowerCase()}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export const Default: Story = {
  render: () => <SelectDemo />,
};

export const Preselected: Story = {
  render: () => <SelectDemo placeholder="Select position" initialValue="midfielder" />,
};

export const Disabled: Story = {
  render: () => <SelectDemo placeholder="Disabled" disabled />,
};
