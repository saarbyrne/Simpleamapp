import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Image } from 'lucide-react';

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  render: () => (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
          <Image className="h-12 w-12 text-muted-foreground" />
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="w-80">
      <AspectRatio ratio={1} className="bg-muted rounded-md overflow-hidden">
        <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-4">
          <p className="font-semibold text-lg">Team Logo</p>
          <p className="text-sm text-muted-foreground">1:1 Aspect Ratio</p>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Video: Story = {
  render: () => (
    <div className="w-[600px]">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden border">
        <div className="h-full w-full flex flex-col items-center justify-center bg-black/5 p-4">
          <p className="font-semibold">Game Highlight Video</p>
          <p className="text-sm text-muted-foreground mt-2">16:9 Aspect Ratio</p>
          <p className="text-xs text-muted-foreground mt-1">Perfect for video content</p>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const TeamBanner: Story = {
  render: () => (
    <div className="w-[700px]">
      <AspectRatio ratio={21 / 9} className="bg-muted rounded-md overflow-hidden border">
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold">Eagles FC</h3>
            <p className="text-sm text-muted-foreground mt-2">Premier Division Champions 2025</p>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const PlayerCard: Story = {
  render: () => (
    <div className="w-80">
      <div className="rounded-lg border overflow-hidden">
        <AspectRatio ratio={4 / 3} className="bg-muted">
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-500/20 to-green-500/5">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-2">
                JS
              </div>
              <p className="font-semibold">John Smith</p>
              <p className="text-sm text-muted-foreground">#23</p>
            </div>
          </div>
        </AspectRatio>
        <div className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Position</span>
              <span className="font-medium">Forward</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Goals</span>
              <span className="font-medium">15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const StadiumImage: Story = {
  render: () => (
    <div className="w-[500px]">
      <AspectRatio ratio={3 / 2} className="bg-muted rounded-md overflow-hidden border">
        <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-500/20 to-purple-500/5 p-6">
          <Image className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="font-semibold text-lg">Eagle Arena</p>
          <p className="text-sm text-muted-foreground mt-2">Capacity: 25,000</p>
          <p className="text-xs text-muted-foreground mt-1">3:2 Aspect Ratio</p>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Portrait: Story = {
  render: () => (
    <div className="w-64">
      <AspectRatio ratio={2 / 3} className="bg-muted rounded-md overflow-hidden border">
        <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-500/5 p-6">
          <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold mb-4">
            SW
          </div>
          <p className="font-semibold">Sarah Williams</p>
          <p className="text-sm text-muted-foreground">Midfielder</p>
          <p className="text-xs text-muted-foreground mt-4">2:3 Portrait</p>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const MultipleRatios: Story = {
  render: () => (
    <div className="space-y-6 w-[600px]">
      <div>
        <p className="text-sm font-medium mb-2">16:9 - Standard Video</p>
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-md border">
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">16:9</p>
          </div>
        </AspectRatio>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">4:3 - Classic Photo</p>
        <AspectRatio ratio={4 / 3} className="bg-muted rounded-md border">
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">4:3</p>
          </div>
        </AspectRatio>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">1:1 - Square</p>
        <AspectRatio ratio={1} className="bg-muted rounded-md border">
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">1:1</p>
          </div>
        </AspectRatio>
      </div>
    </div>
  ),
};

export const GameHighlightCard: Story = {
  render: () => (
    <div className="w-96">
      <div className="rounded-lg border overflow-hidden">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-red-500/20 to-red-500/5 p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">January 15, 2026</p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="font-semibold">Eagles FC</p>
                  <p className="text-3xl font-bold mt-1">3</p>
                </div>
                <p className="text-2xl font-bold">-</p>
                <div className="text-center">
                  <p className="font-semibold">Thunder United</p>
                  <p className="text-3xl font-bold mt-1">2</p>
                </div>
              </div>
            </div>
          </div>
        </AspectRatio>
        <div className="p-4">
          <p className="text-sm font-medium mb-2">Match Highlights</p>
          <p className="text-xs text-muted-foreground">
            Watch the key moments from this thrilling encounter
          </p>
        </div>
      </div>
    </div>
  ),
};

export const TeamGallery: Story = {
  render: () => (
    <div className="w-[800px]">
      <h3 className="font-semibold mb-4">Team Photo Gallery</h3>
      <div className="grid grid-cols-3 gap-4">
        <AspectRatio ratio={1} className="bg-muted rounded-md border overflow-hidden">
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-500/5">
            <p className="text-sm text-muted-foreground">Team Photo 1</p>
          </div>
        </AspectRatio>
        <AspectRatio ratio={1} className="bg-muted rounded-md border overflow-hidden">
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-500/20 to-green-500/5">
            <p className="text-sm text-muted-foreground">Team Photo 2</p>
          </div>
        </AspectRatio>
        <AspectRatio ratio={1} className="bg-muted rounded-md border overflow-hidden">
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-purple-500/5">
            <p className="text-sm text-muted-foreground">Team Photo 3</p>
          </div>
        </AspectRatio>
        <AspectRatio ratio={1} className="bg-muted rounded-md border overflow-hidden">
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-red-500/20 to-red-500/5">
            <p className="text-sm text-muted-foreground">Team Photo 4</p>
          </div>
        </AspectRatio>
        <AspectRatio ratio={1} className="bg-muted rounded-md border overflow-hidden">
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-yellow-500/5">
            <p className="text-sm text-muted-foreground">Team Photo 5</p>
          </div>
        </AspectRatio>
        <AspectRatio ratio={1} className="bg-muted rounded-md border overflow-hidden">
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-pink-500/20 to-pink-500/5">
            <p className="text-sm text-muted-foreground">Team Photo 6</p>
          </div>
        </AspectRatio>
      </div>
    </div>
  ),
};
