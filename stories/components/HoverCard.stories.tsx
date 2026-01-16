import type { Meta, StoryObj } from '@storybook/react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Target } from 'lucide-react';

const meta: Meta<typeof HoverCard> = {
  title: 'Components/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="text-sm font-medium underline cursor-pointer">
          @johnsmith
        </button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">John Smith</h4>
          <p className="text-sm text-muted-foreground">
            Forward • Eagles FC
          </p>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-medium">15</span>
              <span className="text-muted-foreground ml-1">Goals</span>
            </div>
            <div>
              <span className="font-medium">8</span>
              <span className="text-muted-foreground ml-1">Assists</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const PlayerProfile: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="font-medium hover:underline cursor-pointer">
          John Smith
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12">
            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
              JS
            </div>
          </Avatar>
          <div className="space-y-2 flex-1">
            <div>
              <h4 className="text-sm font-semibold">John Smith</h4>
              <div className="flex gap-2 items-center mt-1">
                <Badge variant="secondary">Forward</Badge>
                <span className="text-sm text-muted-foreground">#23</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div>
                <p className="text-lg font-bold">24</p>
                <p className="text-xs text-muted-foreground">Games</p>
              </div>
              <div>
                <p className="text-lg font-bold">15</p>
                <p className="text-xs text-muted-foreground">Goals</p>
              </div>
              <div>
                <p className="text-lg font-bold">8.5</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
              <Calendar className="h-3 w-3" />
              <span>Joined Jan 2024</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const TeamCard: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="font-semibold text-primary hover:underline cursor-pointer">
          Eagles FC
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold">Eagles FC</h4>
              <p className="text-sm text-muted-foreground">Premier Division</p>
            </div>
            <Badge variant="default">Active</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Win Rate</p>
              <p className="text-xl font-bold">75%</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Goals/Game</p>
              <p className="text-xl font-bold">2.8</p>
            </div>
          </div>
          <div className="pt-2 border-t space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Manager</span>
              <span className="font-medium">John Doe</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stadium</span>
              <span className="font-medium">Eagle Arena</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const GameResult: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors w-full">
          <div className="flex justify-between items-center">
            <span className="font-medium">Eagles FC</span>
            <span className="text-2xl font-bold">3</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="font-medium">Thunder United</span>
            <span className="text-2xl font-bold">2</span>
          </div>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-96">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold mb-1">Match Details</h4>
            <p className="text-sm text-muted-foreground">January 15, 2026 • Eagle Arena</p>
          </div>
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Goal Scorers</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>John Smith (15', 67')</span>
                <Badge variant="secondary" className="text-xs">Eagles FC</Badge>
              </div>
              <div className="flex justify-between">
                <span>Sarah Williams (43')</span>
                <Badge variant="secondary" className="text-xs">Eagles FC</Badge>
              </div>
              <div className="flex justify-between">
                <span>Mike Brown (28', 55')</span>
                <Badge variant="outline" className="text-xs">Thunder United</Badge>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t">
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="font-medium">58%</p>
                <p className="text-xs text-muted-foreground">Possession</p>
              </div>
              <div>
                <p className="font-medium">8</p>
                <p className="text-xs text-muted-foreground">Shots</p>
              </div>
              <div>
                <p className="font-medium">7</p>
                <p className="text-xs text-muted-foreground">Corners</p>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const AchievementBadge: Story = {
  render: () => (
    <div className="flex gap-2">
      <HoverCard>
        <HoverCardTrigger asChild>
          <button className="p-2 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
            <Trophy className="h-6 w-6 text-yellow-500" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <h4 className="font-semibold">Top Scorer</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Achieved by scoring the most goals in the 2025-2026 season (15 goals)
            </p>
            <p className="text-xs text-muted-foreground pt-1">
              Earned on January 10, 2026
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <button className="p-2 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
            <Target className="h-6 w-6 text-blue-500" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <h4 className="font-semibold">Assist Master</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Achieved by providing the most assists in the season (8 assists)
            </p>
            <p className="text-xs text-muted-foreground pt-1">
              Earned on January 8, 2026
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

export const PlayerList: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <h3 className="font-semibold mb-3">Team Roster</h3>
      {[
        { name: 'John Smith', position: 'Forward', jersey: 23, goals: 15 },
        { name: 'Sarah Williams', position: 'Midfielder', jersey: 10, goals: 12 },
        { name: 'Mike Johnson', position: 'Goalkeeper', jersey: 1, goals: 0 },
      ].map((player) => (
        <HoverCard key={player.jersey}>
          <HoverCardTrigger asChild>
            <button className="w-full p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors text-left">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.position}</p>
                </div>
                <Badge variant="outline">#{player.jersey}</Badge>
              </div>
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">{player.name}</h4>
                <p className="text-sm text-muted-foreground">{player.position} • #{player.jersey}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold">24</p>
                  <p className="text-xs text-muted-foreground">Games</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{player.goals}</p>
                  <p className="text-xs text-muted-foreground">Goals</p>
                </div>
                <div>
                  <p className="text-lg font-bold">8.2</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  ),
};

export const StatsSummary: Story = {
  render: () => (
    <div className="p-4 border rounded-lg w-80">
      <h3 className="font-semibold mb-4">Season Overview</h3>
      <div className="grid grid-cols-2 gap-3">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors text-left">
              <p className="text-sm text-muted-foreground">Games</p>
              <p className="text-2xl font-bold">24</p>
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Game Breakdown</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wins</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Draws</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Losses</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors text-left">
              <p className="text-sm text-muted-foreground">Goals</p>
              <p className="text-2xl font-bold">68</p>
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Scoring Stats</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goals For</span>
                  <span className="font-medium">68</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goals Against</span>
                  <span className="font-medium">32</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difference</span>
                  <span className="font-medium text-green-600">+36</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  ),
};
