import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { Label } from './label';
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
      <div className="flex items-center gap-2">
        <Checkbox id="default-checkbox" checked={checked} onCheckedChange={setChecked} />
        <label
          htmlFor="default-checkbox"
          className="text-sm font-normal text-foreground cursor-pointer"
        >
          Include in weekly report
        </label>
      </div>
    );
  },
};

export const WithLabelComponent: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex items-center gap-2">
        <Checkbox id="label-checkbox" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="label-checkbox" className="font-normal cursor-pointer">
          Accept terms and conditions
        </Label>
      </div>
    );
  },
};

export const MultipleCheckboxes: Story = {
  render: () => {
    const [checked1, setChecked1] = useState(true);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Checkbox id="cb1" checked={checked1} onCheckedChange={setChecked1} />
          <label htmlFor="cb1" className="text-sm font-normal text-foreground cursor-pointer">
            Send weekly reports
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cb2" checked={checked2} onCheckedChange={setChecked2} />
          <label htmlFor="cb2" className="text-sm font-normal text-foreground cursor-pointer">
            Enable notifications
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cb3" checked={checked3} onCheckedChange={setChecked3} />
          <label htmlFor="cb3" className="text-sm font-normal text-foreground cursor-pointer">
            Share data with team
          </label>
        </div>
      </div>
    );
  },
};
