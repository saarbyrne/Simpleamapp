import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/invalid-url.jpg" alt="Invalid" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="Small" />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar className="h-10 w-10">
        <AvatarImage src="https://github.com/shadcn.png" alt="Default" />
        <AvatarFallback>DF</AvatarFallback>
      </Avatar>
      <Avatar className="h-16 w-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="Large" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar className="h-24 w-24">
        <AvatarImage src="https://github.com/shadcn.png" alt="Extra Large" />
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const PlayerAvatars: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">John Doe</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">Sarah Miller</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarFallback>RJ</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">Robert Johnson</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarFallback>EW</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">Emily Wilson</span>
      </div>
    </div>
  ),
};

export const TeamRoster: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Team A Roster</h3>
      <div className="space-y-2">
        {[
          { name: 'John Doe', position: 'Forward', initials: 'JD' },
          { name: 'Sarah Miller', position: 'Midfielder', initials: 'SM' },
          { name: 'Robert Johnson', position: 'Defender', initials: 'RJ' },
          { name: 'Emily Wilson', position: 'Goalkeeper', initials: 'EW' },
        ].map((player) => (
          <div key={player.initials} className="flex items-center gap-3 p-2 hover:bg-muted rounded-md">
            <Avatar>
              <AvatarFallback>{player.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{player.name}</p>
              <p className="text-xs text-muted-foreground">{player.position}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const AvatarGroup: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center">
        <Avatar className="border-2 border-background">
          <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
          <AvatarFallback>U1</AvatarFallback>
        </Avatar>
        <Avatar className="-ml-3 border-2 border-background">
          <AvatarFallback>U2</AvatarFallback>
        </Avatar>
        <Avatar className="-ml-3 border-2 border-background">
          <AvatarFallback>U3</AvatarFallback>
        </Avatar>
        <Avatar className="-ml-3 border-2 border-background">
          <AvatarFallback>U4</AvatarFallback>
        </Avatar>
        <div className="-ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
          +5
        </div>
      </div>
      <p className="text-sm text-muted-foreground">9 team members</p>
    </div>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="Online" />
          <AvatarFallback>ON</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
      </div>
      <div className="relative">
        <Avatar>
          <AvatarFallback>AW</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-yellow-500 ring-2 ring-background" />
      </div>
      <div className="relative">
        <Avatar>
          <AvatarFallback>OF</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gray-400 ring-2 ring-background" />
      </div>
      <div className="relative">
        <Avatar>
          <AvatarFallback>DN</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-background" />
      </div>
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback className="bg-blue-500 text-white">BL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-green-500 text-white">GR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-purple-500 text-white">PR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-orange-500 text-white">OR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-pink-500 text-white">PK</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const ProfileHeader: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <Avatar className="h-20 w-20">
        <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
        <AvatarFallback className="text-2xl">JD</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="text-xl font-semibold">John Doe</h3>
        <p className="text-sm text-muted-foreground">Team A - Forward</p>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <span>23 Games</span>
          <span>15 Goals</span>
          <span>8 Assists</span>
        </div>
      </div>
    </div>
  ),
};
