import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from './input-otp';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof InputOTP> = {
  title: 'Components/Input OTP',
  component: InputOTP,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof InputOTP>;

export const Verification: Story = {
  render: () => {
    const [value, setValue] = React.useState('1824');

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing.gap.sm,
          alignItems: 'center',
        }}
      >
        <InputOTP
          maxLength={6}
          value={value}
          onChange={setValue}
          style={{ margin: '0 auto' }}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <span
          style={{
            fontSize: tokens.typography.body.sm.fontSize,
            lineHeight: tokens.typography.body.sm.lineHeight,
            color: tokens.colors.text.secondary,
          }}
        >
          Code sent to the fitness coach.
        </span>
      </div>
    );
  },
};
