import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './aspect-ratio';

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  args: {
    ratio: 16 / 9,
  },
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['ref', 'asChild'],
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[450px]">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  args: {
    ratio: 1,
  },
  render: (args) => (
    <div className="w-[300px]">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const Portrait: Story = {
  args: {
    ratio: 3 / 4,
  },
  render: (args) => (
    <div className="w-[300px]">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const Video: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <div className="w-[560px]">
      <AspectRatio {...args}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
          <span className="text-sm text-muted-foreground">16:9 Video Container</span>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const UltraWide: Story = {
  args: {
    ratio: 21 / 9,
  },
  render: (args) => (
    <div className="w-[700px]">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const AllRatios: Story = {
  render: () => {
    const ratios = [
      { ratio: 1, label: '1:1 Square' },
      { ratio: 3 / 4, label: '3:4 Portrait' },
      { ratio: 4 / 3, label: '4:3 Standard' },
      { ratio: 16 / 9, label: '16:9 HD' },
      { ratio: 21 / 9, label: '21:9 Ultrawide' },
    ];

    return (
      <div className="grid gap-8">
        {ratios.map(({ ratio, label }) => (
          <div key={label} className="space-y-2">
            <p className="text-sm font-medium">{label}</p>
            <div className="w-[300px]">
              <AspectRatio ratio={ratio}>
                <div className="flex h-full w-full items-center justify-center rounded-md border bg-muted">
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
              </AspectRatio>
            </div>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    controls: { exclude: ['ratio'] },
  },
};
