import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './slider';
import { useState } from 'react';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState([60]);

    return (
      <div
        style={{
          width: '320px',
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing.gap.sm,
        }}
      >
        <label
          className="text-foreground"
          style={{
            fontSize: tokens.typography.body.sm.fontSize,
            lineHeight: tokens.typography.body.sm.lineHeight,
          }}
        >
          Target intensity
        </label>
        <Slider value={value} onValueChange={setValue} min={0} max={100} />
        <span
          className="text-muted-foreground"
          style={{
            fontSize: tokens.typography.body.xs.fontSize,
            lineHeight: tokens.typography.body.xs.lineHeight,
          }}
        >
          {value[0]}% for today&apos;s session
        </span>
      </div>
    );
  },
};
