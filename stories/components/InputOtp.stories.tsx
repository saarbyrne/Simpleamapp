'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof InputOTP> = {
  title: 'Components/InputOTP',
  component: InputOTP,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InputOTP>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Enter Code</Label>
          <InputOTP maxLength={6} value={value} onChange={setValue}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className="text-sm text-muted-foreground">Value: {value || '(empty)'}</p>
      </div>
    );
  },
};

export const TwoFactorAuthentication: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const handleVerify = () => {
      setIsVerifying(true);
      // Simulate API call
      setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
        setTimeout(() => {
          setIsVerified(false);
          setValue('');
        }, 2000);
      }, 1500);
    };

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-2fa">Verification Code</Label>
            <InputOTP
              maxLength={6}
              value={value}
              onChange={setValue}
              id="otp-2fa"
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
          </div>
          <Button
            onClick={handleVerify}
            disabled={value.length !== 6 || isVerifying}
            className="w-full"
          >
            {isVerifying ? 'Verifying...' : isVerified ? 'Verified!' : 'Verify Code'}
          </Button>
        </CardContent>
      </Card>
    );
  },
};

export const PhoneVerification: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Phone Number</CardTitle>
          <CardDescription>
            We sent a 4-digit code to +1 (555) 123-4567
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-phone">Verification Code</Label>
            <InputOTP
              maxLength={4}
              value={value}
              onChange={setValue}
              id="otp-phone"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="text-sm text-muted-foreground">
            Didn't receive a code?{' '}
            <button className="text-primary hover:underline">Resend</button>
          </div>
          <Button disabled={value.length !== 4} className="w-full">
            Verify Phone
          </Button>
        </CardContent>
      </Card>
    );
  },
};

export const PINEntry: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [showPin, setShowPin] = useState(false);

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enter PIN</CardTitle>
          <CardDescription>
            Enter your 4-digit security PIN to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-pin">Security PIN</Label>
            <InputOTP
              maxLength={4}
              value={value}
              onChange={setValue}
              id="otp-pin"
              pattern="[0-9]*"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                onClick={() => setShowPin(!showPin)}
                className="text-primary hover:underline"
              >
                {showPin ? 'Hide' : 'Show'} PIN
              </button>
            </div>
            {showPin && value && (
              <div className="text-sm font-mono">{value}</div>
            )}
          </div>
          <Button disabled={value.length !== 4} className="w-full">
            Unlock
          </Button>
        </CardContent>
      </Card>
    );
  },
};

export const WithSeparators: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Activation Code</CardTitle>
          <CardDescription>Enter your 8-character activation code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-activation">Activation Code</Label>
            <InputOTP
              maxLength={8}
              value={value}
              onChange={setValue}
              id="otp-activation"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <p className="text-sm text-muted-foreground">
            {value.length > 0 ? `${value.length}/8 characters entered` : 'Waiting for input...'}
          </p>
          <Button disabled={value.length !== 8} className="w-full">
            Activate License
          </Button>
        </CardContent>
      </Card>
    );
  },
};

export const DisabledState: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Disabled Input</Label>
          <InputOTP maxLength={6} value="123456" disabled>
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
        </div>
        <p className="text-sm text-muted-foreground">
          This input is disabled and cannot be edited
        </p>
      </div>
    );
  },
};

export const CustomLength: Story = {
  render: () => {
    const [shortValue, setShortValue] = useState('');
    const [longValue, setLongValue] = useState('');

    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Label>3-digit Code</Label>
          <InputOTP maxLength={3} value={shortValue} onChange={setShortValue}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="space-y-2">
          <Label>10-digit Number</Label>
          <InputOTP maxLength={10} value={longValue} onChange={setLongValue}>
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
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={6} />
              <InputOTPSlot index={7} />
              <InputOTPSlot index={8} />
              <InputOTPSlot index={9} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const correctCode = '123456';

    const handleSubmit = () => {
      if (value === correctCode) {
        setError('');
        alert('Code verified successfully!');
      } else {
        setError('Invalid code. Please try again.');
      }
    };

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verification Code</CardTitle>
          <CardDescription>
            Enter the correct code (hint: try 123456)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-validation">Code</Label>
            <InputOTP
              maxLength={6}
              value={value}
              onChange={(val) => {
                setValue(val);
                setError('');
              }}
              id="otp-validation"
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
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={value.length !== 6}
            className="w-full"
          >
            Verify
          </Button>
        </CardContent>
      </Card>
    );
  },
};
