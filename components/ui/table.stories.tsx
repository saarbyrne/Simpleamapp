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
  { name: 'Jordan Smith', position: 'Defensa central', availability: 'Disponible', workload: 'Media' },
  { name: 'Alex Martínez', position: 'Extremo derecho', availability: 'Precaución', workload: 'Alta' },
  { name: 'Luis Ortega', position: 'Volante mixto', availability: 'Revisar', workload: 'Baja' },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Estado actualizado de la plantilla principal.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Jugador</TableHead>
          <TableHead>Posición</TableHead>
          <TableHead>Disponibilidad</TableHead>
          <TableHead>Carga estimada</TableHead>
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
            Última actualización: {new Date().toLocaleDateString()}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
