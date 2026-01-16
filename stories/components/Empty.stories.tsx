import type { Meta, StoryObj } from '@storybook/react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { Users, Trophy, Calendar, FileText, Search, Inbox, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const meta: Meta<typeof Empty> = {
  title: 'Components/Empty',
  component: Empty,
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Empty>;

export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Inbox className="h-12 w-12 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No items found</EmptyTitle>
        <EmptyDescription>
          There are no items to display at the moment.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

export const NoPlayers: Story = {
  render: () => (
    <Card>
      <CardContent className="p-0">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>No players yet</EmptyTitle>
            <EmptyDescription>
              Get started by adding your first player to the roster.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Player
            </Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  ),
};

export const NoTeams: Story = {
  render: () => (
    <Card>
      <CardContent className="p-0">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Trophy />
            </EmptyMedia>
            <EmptyTitle>No teams found</EmptyTitle>
            <EmptyDescription>
              Create your first team to start organizing players and scheduling matches.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button>Create Team</Button>
              <Button variant="outline">Import Teams</Button>
            </div>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  ),
};

export const NoMatches: Story = {
  render: () => (
    <Card>
      <CardContent className="p-0">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Calendar />
            </EmptyMedia>
            <EmptyTitle>No matches scheduled</EmptyTitle>
            <EmptyDescription>
              There are no upcoming matches. Schedule a match to get started.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Schedule Match</Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  ),
};

export const SearchResults: Story = {
  render: () => (
    <Card>
      <CardContent className="p-0">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No results found</EmptyTitle>
            <EmptyDescription>
              We couldn't find any players matching "Alex Smith". Try adjusting your search
              terms.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline">Clear Search</Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  ),
};

export const NoReports: Story = {
  render: () => (
    <Card>
      <CardContent className="p-0">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>No reports available</EmptyTitle>
            <EmptyDescription>
              Reports will appear here once you have match data. Play some matches to generate
              reports.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button>Schedule Match</Button>
              <Button variant="outline">View Past Matches</Button>
            </div>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  ),
};

export const WithLink: Story = {
  render: () => (
    <Card>
      <CardContent className="p-0">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <Users className="h-12 w-12 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No players in this team</EmptyTitle>
            <EmptyDescription>
              This team doesn't have any players yet.{' '}
              <a href="#" className="underline">
                Learn more about team management
              </a>
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Add Players</Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  ),
};

export const LargeIcon: Story = {
  render: () => (
    <Card>
      <CardContent className="p-0">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <Trophy className="h-16 w-16 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>Championship Not Started</EmptyTitle>
            <EmptyDescription>
              The season championship hasn't begun yet. Check back when matches start to see
              standings and rankings.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button>View Schedule</Button>
              <Button variant="secondary">Set Reminders</Button>
            </div>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  ),
};

export const MinimalStyle: Story = {
  render: () => (
    <div className="rounded-lg border">
      <Empty className="py-12">
        <EmptyHeader>
          <EmptyTitle>No data</EmptyTitle>
          <EmptyDescription>Nothing to display</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ),
};

export const InTableState: Story = {
  render: () => (
    <div className="w-full rounded-lg border">
      <div className="border-b p-4">
        <h3 className="font-semibold">Player Statistics</h3>
      </div>
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users />
          </EmptyMedia>
          <EmptyTitle>No statistics available</EmptyTitle>
          <EmptyDescription>
            Player statistics will appear here once matches are played.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ),
};

export const CustomLayout: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardContent className="p-0">
        <Empty className="min-h-[400px]">
          <EmptyHeader>
            <EmptyMedia>
              <div className="flex gap-4">
                <Users className="h-10 w-10 text-muted-foreground" />
                <Trophy className="h-10 w-10 text-muted-foreground" />
                <Calendar className="h-10 w-10 text-muted-foreground" />
              </div>
            </EmptyMedia>
            <EmptyTitle>Welcome to Sports Manager</EmptyTitle>
            <EmptyDescription>
              Get started by creating teams, adding players, and scheduling matches. Our
              comprehensive platform helps you manage every aspect of your sports organization.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg">
                <Users className="mr-2 h-4 w-4" />
                Add Players
              </Button>
              <Button size="lg" variant="outline">
                <Trophy className="mr-2 h-4 w-4" />
                Create Teams
              </Button>
              <Button size="lg" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Match
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  ),
};
