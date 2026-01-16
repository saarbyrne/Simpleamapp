import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-80 rounded-md border p-4">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Team Roster</h4>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="text-sm">
            Player {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const PlayerList: Story = {
  render: () => {
    const players = [
      { name: 'John Smith', position: 'Forward', jersey: 23 },
      { name: 'Sarah Williams', position: 'Midfielder', jersey: 10 },
      { name: 'Mike Johnson', position: 'Goalkeeper', jersey: 1 },
      { name: 'Tom Davis', position: 'Forward', jersey: 9 },
      { name: 'Emma Taylor', position: 'Midfielder', jersey: 8 },
      { name: 'Alex Brown', position: 'Forward', jersey: 11 },
      { name: 'David Lee', position: 'Defender', jersey: 5 },
      { name: 'Lisa Anderson', position: 'Defender', jersey: 3 },
      { name: 'Kevin Zhang', position: 'Defender', jersey: 2 },
      { name: 'James Wilson', position: 'Midfielder', jersey: 6 },
      { name: 'Chris Martin', position: 'Midfielder', jersey: 7 },
      { name: 'Robert Chen', position: 'Defender', jersey: 4 },
    ];

    return (
      <ScrollArea className="h-96 w-96 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-semibold">Eagles FC Roster</h4>
          <div className="space-y-2">
            {players.map((player) => (
              <div key={player.jersey} className="flex items-center justify-between p-2 border rounded hover:bg-accent">
                <div>
                  <p className="font-medium">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.position}</p>
                </div>
                <Badge variant="outline">#{player.jersey}</Badge>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    );
  },
};

export const GameSchedule: Story = {
  render: () => {
    const games = Array.from({ length: 15 }).map((_, i) => ({
      id: i + 1,
      homeTeam: i % 2 === 0 ? 'Eagles FC' : 'Thunder United',
      awayTeam: i % 2 === 0 ? 'Thunder United' : 'Eagles FC',
      date: `January ${i + 10}, 2026`,
      time: '7:00 PM',
    }));

    return (
      <ScrollArea className="h-[500px] w-[450px] rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-semibold">Season Schedule</h4>
          <div className="space-y-3">
            {games.map((game) => (
              <div key={game.id} className="p-3 border rounded">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <p className="font-medium">{game.homeTeam} vs {game.awayTeam}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {game.date} • {game.time}
                    </p>
                  </div>
                  <Badge variant="secondary">Game {game.id}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    );
  },
};

export const Statistics: Story = {
  render: () => (
    <ScrollArea className="h-[450px] w-[400px] rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-semibold">Season Statistics</h4>

        <div className="space-y-6">
          <div>
            <h5 className="font-medium mb-3">Team Performance</h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Games Played</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Wins</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Draws</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Losses</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Win Rate</span>
                <span className="font-medium">75%</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h5 className="font-medium mb-3">Scoring Stats</h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Goals For</span>
                <span className="font-medium">68</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Goals Against</span>
                <span className="font-medium">32</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Goal Difference</span>
                <span className="font-medium text-green-600">+36</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average Goals/Game</span>
                <span className="font-medium">2.8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Clean Sheets</span>
                <span className="font-medium">10</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h5 className="font-medium mb-3">Top Scorers</h5>
            <div className="space-y-2">
              {[
                { name: 'John Smith', goals: 15 },
                { name: 'Sarah Williams', goals: 12 },
                { name: 'Tom Davis', goals: 8 },
                { name: 'Alex Brown', goals: 7 },
                { name: 'Emma Taylor', goals: 6 },
              ].map((player, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{player.name}</span>
                  <span className="font-medium">{player.goals} goals</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h5 className="font-medium mb-3">Assists Leaders</h5>
            <div className="space-y-2">
              {[
                { name: 'Sarah Williams', assists: 10 },
                { name: 'John Smith', assists: 8 },
                { name: 'Emma Taylor', assists: 7 },
                { name: 'James Wilson', assists: 5 },
                { name: 'Tom Davis', assists: 4 },
              ].map((player, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{player.name}</span>
                  <span className="font-medium">{player.assists} assists</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  ),
};

export const MatchReport: Story = {
  render: () => (
    <ScrollArea className="h-[500px] w-[500px] rounded-md border">
      <div className="p-6">
        <h4 className="text-lg font-semibold mb-2">Match Report</h4>
        <p className="text-sm text-muted-foreground mb-6">
          Eagles FC vs Thunder United - January 15, 2026
        </p>

        <div className="space-y-6">
          <div>
            <h5 className="font-medium mb-2">Final Score</h5>
            <div className="flex justify-around items-center py-4 border rounded">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Eagles FC</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <p className="text-2xl font-bold">-</p>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Thunder United</p>
                <p className="text-3xl font-bold">2</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h5 className="font-medium mb-3">Match Summary</h5>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                The game started with high intensity as both teams fought for possession.
                Eagles FC dominated the early stages, creating several scoring opportunities.
              </p>
              <p>
                The first goal came in the 15th minute from a well-executed corner kick by
                John Smith, giving Eagles FC an early lead.
              </p>
              <p>
                Thunder United equalized in the 28th minute through Mike Brown, but Sarah
                Williams restored the lead for Eagles FC just before halftime with a brilliant
                individual effort.
              </p>
              <p>
                The second half saw Thunder United push for an equalizer, which came in the
                55th minute again from Mike Brown. However, John Smith scored the winner in
                the 67th minute to seal the victory for Eagles FC.
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h5 className="font-medium mb-3">Goal Scorers</h5>
            <div className="space-y-2">
              <div className="p-2 border rounded">
                <p className="text-sm font-medium">John Smith (15', 67')</p>
                <p className="text-xs text-muted-foreground">Eagles FC</p>
              </div>
              <div className="p-2 border rounded">
                <p className="text-sm font-medium">Sarah Williams (43')</p>
                <p className="text-xs text-muted-foreground">Eagles FC</p>
              </div>
              <div className="p-2 border rounded">
                <p className="text-sm font-medium">Mike Brown (28', 55')</p>
                <p className="text-xs text-muted-foreground">Thunder United</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h5 className="font-medium mb-3">Match Statistics</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Possession</span>
                <span className="font-medium">Eagles FC 58% - 42% Thunder United</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shots</span>
                <span className="font-medium">18 - 14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shots on Target</span>
                <span className="font-medium">8 - 6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Corners</span>
                <span className="font-medium">7 - 4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fouls</span>
                <span className="font-medium">12 - 15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Offsides</span>
                <span className="font-medium">3 - 5</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h5 className="font-medium mb-3">Player Ratings</h5>
            <div className="space-y-2">
              {[
                { name: 'John Smith', rating: 8.5, team: 'Eagles FC' },
                { name: 'Sarah Williams', rating: 8.2, team: 'Eagles FC' },
                { name: 'Mike Johnson', rating: 8.0, team: 'Eagles FC' },
                { name: 'Mike Brown', rating: 7.8, team: 'Thunder United' },
                { name: 'Tom Wilson', rating: 7.5, team: 'Thunder United' },
              ].map((player, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{player.name}</p>
                    <p className="text-xs text-muted-foreground">{player.team}</p>
                  </div>
                  <Badge variant="secondary">{player.rating}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  ),
};

export const NotificationsList: Story = {
  render: () => {
    const notifications = Array.from({ length: 20 }).map((_, i) => ({
      id: i + 1,
      title: `Notification ${i + 1}`,
      message: 'This is a notification message with some details about team updates.',
      time: `${i + 1} hour${i !== 0 ? 's' : ''} ago`,
    }));

    return (
      <ScrollArea className="h-96 w-80 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-semibold">Notifications</h4>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-3 border rounded hover:bg-accent">
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    );
  },
};

export const HorizontalScroll: Story = {
  render: () => {
    const teams = [
      'Eagles FC',
      'Thunder United',
      'Storm Athletic',
      'Lightning FC',
      'Phoenix Rising',
      'Dragon Warriors',
      'Tiger Strikers',
      'Wolf Pack',
      'Falcon United',
      'Hawk FC',
    ];

    return (
      <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {teams.map((team) => (
            <div key={team} className="shrink-0 w-48">
              <div className="h-32 rounded-md border p-4 flex items-center justify-center">
                <p className="text-sm font-medium text-center">{team}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  },
};
