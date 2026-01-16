import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

const players = [
  { id: '1', name: 'Alex Johnson', position: 'Forward', team: 'Warriors', goals: 12, assists: 8, status: 'Active' },
  { id: '2', name: 'Sam Williams', position: 'Midfielder', team: 'Warriors', goals: 5, assists: 15, status: 'Active' },
  { id: '3', name: 'Jordan Lee', position: 'Defender', team: 'Eagles', goals: 2, assists: 3, status: 'Active' },
  { id: '4', name: 'Taylor Brown', position: 'Goalkeeper', team: 'Eagles', goals: 0, assists: 1, status: 'Injured' },
  { id: '5', name: 'Morgan Davis', position: 'Forward', team: 'Tigers', goals: 18, assists: 6, status: 'Active' },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Team</TableHead>
          <TableHead className="text-end">Goals</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell>{player.position}</TableCell>
            <TableCell>{player.team}</TableCell>
            <TableCell className="text-end">{player.goals}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of top-performing players this season</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Team</TableHead>
          <TableHead className="text-end">Goals</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell>{player.position}</TableCell>
            <TableCell>{player.team}</TableCell>
            <TableCell className="text-end">{player.goals}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead className="text-end">Goals</TableHead>
          <TableHead className="text-end">Assists</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell>{player.position}</TableCell>
            <TableCell className="text-end">{player.goals}</TableCell>
            <TableCell className="text-end">{player.assists}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-end font-medium">
            {players.reduce((sum, p) => sum + p.goals, 0)}
          </TableCell>
          <TableCell className="text-end font-medium">
            {players.reduce((sum, p) => sum + p.assists, 0)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-end">Goals</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell>{player.position}</TableCell>
            <TableCell>{player.team}</TableCell>
            <TableCell>
              <Badge variant={player.status === 'Active' ? 'default' : 'destructive'}>
                {player.status}
              </Badge>
            </TableCell>
            <TableCell className="text-end">{player.goals}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Team</TableHead>
          <TableHead className="text-end">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell>{player.position}</TableCell>
            <TableCell>{player.team}</TableCell>
            <TableCell className="text-end">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Team</TableHead>
          <TableHead className="text-end">Goals</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="h-24 text-center">
            No players found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
