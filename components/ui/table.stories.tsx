import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
  TableFooter,
} from './table';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Table>;

const players = [
  { name: 'Jordan Smith', position: 'Center back', availability: 'Available', workload: 'Medium' },
  { name: 'Alex Martínez', position: 'Right winger', availability: 'Caution', workload: 'High' },
  { name: 'Luis Ortega', position: 'Box-to-box midfielder', availability: 'Review', workload: 'Low' },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Updated status of the main squad.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead>Estimated load</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.name}>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.position}</TableCell>
            <TableCell>{player.availability}</TableCell>
            <TableCell>{player.workload}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>
            Last updated: {new Date().toLocaleDateString()}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
