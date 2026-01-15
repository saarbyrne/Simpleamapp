import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Search } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => <Input placeholder="Enter text..." />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="m@example.com" />
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Text</Label>
        <Input id="text" type="text" placeholder="Enter text" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-type">Email</Label>
        <Input id="email-type" type="email" placeholder="name@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="number">Number</Label>
        <Input id="number" type="number" placeholder="0" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" />
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-icon">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input id="email-icon" type="email" placeholder="m@example.com" className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-icon">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input id="password-icon" type="password" placeholder="••••••••" className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input id="search" type="search" placeholder="Search..." className="pl-10" />
        </div>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="normal">Normal</Label>
        <Input id="normal" placeholder="Normal state" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="disabled">Disabled</Label>
        <Input id="disabled" placeholder="Disabled state" disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="readonly">Read Only</Label>
        <Input id="readonly" value="Read only value" readOnly />
      </div>
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-helper">Email</Label>
        <Input id="email-helper" type="email" placeholder="m@example.com" />
        <p className="text-sm text-muted-foreground">We'll never share your email.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-helper">Password</Label>
        <Input id="password-helper" type="password" placeholder="••••••••" />
        <p className="text-sm text-destructive">Password must be at least 8 characters.</p>
      </div>
    </div>
  ),
};
