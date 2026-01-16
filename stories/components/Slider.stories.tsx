import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  render: (args) => <Slider defaultValue={[50]} max={100} step={1} className="w-[300px]" {...args} />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="flex items-center justify-between">
        <Label>Volume</Label>
        <span className="text-sm text-muted-foreground">50%</span>
      </div>
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
  ),
}

export const Range: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="flex items-center justify-between">
        <Label>Price Range</Label>
        <span className="text-sm text-muted-foreground">$25 - $75</span>
      </div>
      <Slider defaultValue={[25, 75]} max={100} step={1} />
    </div>
  ),
}

export const Steps: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="flex items-center justify-between">
        <Label>Quality</Label>
        <span className="text-sm text-muted-foreground">Medium</span>
      </div>
      <Slider defaultValue={[50]} max={100} step={25} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
        <span>Ultra</span>
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Disabled Slider</Label>
      <Slider defaultValue={[50]} max={100} step={1} disabled />
    </div>
  ),
}

export const SettingsExample: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Brightness</Label>
          <span className="text-sm text-muted-foreground">75%</span>
        </div>
        <Slider defaultValue={[75]} max={100} step={1} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Volume</Label>
          <span className="text-sm text-muted-foreground">50%</span>
        </div>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Font Size</Label>
          <span className="text-sm text-muted-foreground">14px</span>
        </div>
        <Slider defaultValue={[14]} min={12} max={24} step={1} />
      </div>
    </div>
  ),
}
