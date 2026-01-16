import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch id="default" {...args} />
      <Label htmlFor="default">Airplane Mode</Label>
    </div>
  ),
}

export const Checked: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch id="checked" defaultChecked {...args} />
      <Label htmlFor="checked">Enabled by default</Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch id="disabled" disabled {...args} />
      <Label htmlFor="disabled">Disabled switch</Label>
    </div>
  ),
}

export const DisabledChecked: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch id="disabled-checked" disabled defaultChecked {...args} />
      <Label htmlFor="disabled-checked">Disabled and checked</Label>
    </div>
  ),
}

export const SettingsExample: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">Push Notifications</Label>
        <Switch id="notifications" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode">Dark Mode</Label>
        <Switch id="dark-mode" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="analytics">Analytics</Label>
        <Switch id="analytics" defaultChecked />
      </div>
    </div>
  ),
}
