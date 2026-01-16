'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal } from 'lucide-react';

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

type Player = {
  id: string;
  name: string;
  position: string;
  team: string;
  goals: number;
  assists: number;
  status: 'Active' | 'Injured' | 'Suspended';
};

const players: Player[] = [
  { id: '1', name: 'Alex Johnson', position: 'Forward', team: 'Warriors', goals: 12, assists: 8, status: 'Active' },
  { id: '2', name: 'Sam Williams', position: 'Midfielder', team: 'Warriors', goals: 5, assists: 15, status: 'Active' },
  { id: '3', name: 'Jordan Lee', position: 'Defender', team: 'Eagles', goals: 2, assists: 3, status: 'Active' },
  { id: '4', name: 'Taylor Brown', position: 'Goalkeeper', team: 'Eagles', goals: 0, assists: 1, status: 'Injured' },
  { id: '5', name: 'Morgan Davis', position: 'Forward', team: 'Tigers', goals: 18, assists: 6, status: 'Active' },
  { id: '6', name: 'Casey Martinez', position: 'Midfielder', team: 'Tigers', goals: 9, assists: 12, status: 'Suspended' },
  { id: '7', name: 'Riley Anderson', position: 'Defender', team: 'Hawks', goals: 1, assists: 2, status: 'Active' },
  { id: '8', name: 'Jamie Wilson', position: 'Forward', team: 'Hawks', goals: 14, assists: 7, status: 'Active' },
];

const basicColumns: ColumnDef<Player>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'team',
    header: 'Team',
  },
  {
    accessorKey: 'goals',
    header: 'Goals',
    cell: ({ row }) => <div className="text-end">{row.getValue('goals')}</div>,
  },
];

export const Default: Story = {
  render: () => {
    const table = useReactTable({
      data: players,
      columns: basicColumns,
      getCoreRowModel: getCoreRowModel(),
    });

    return <DataTable table={table} columns={basicColumns} />;
  },
};

const sortableColumns: ColumnDef<Player>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'team',
    header: 'Team',
  },
  {
    accessorKey: 'goals',
    header: 'Goals',
    cell: ({ row }) => <div className="text-end">{row.getValue('goals')}</div>,
  },
  {
    accessorKey: 'assists',
    header: 'Assists',
    cell: ({ row }) => <div className="text-end">{row.getValue('assists')}</div>,
  },
];

export const WithSorting: Story = {
  render: () => {
    const table = useReactTable({
      data: players,
      columns: sortableColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });

    return <DataTable table={table} columns={sortableColumns} />;
  },
};

const columnsWithBadges: ColumnDef<Player>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'team',
    header: 'Team',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'Active'
              ? 'default'
              : status === 'Injured'
              ? 'destructive'
              : 'secondary'
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'goals',
    header: 'Goals',
    cell: ({ row }) => <div className="text-end">{row.getValue('goals')}</div>,
  },
];

export const WithBadges: Story = {
  render: () => {
    const table = useReactTable({
      data: players,
      columns: columnsWithBadges,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });

    return <DataTable table={table} columns={columnsWithBadges} />;
  },
};

const selectableColumns: ColumnDef<Player>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'team',
    header: 'Team',
  },
  {
    accessorKey: 'goals',
    header: 'Goals',
    cell: ({ row }) => <div className="text-end">{row.getValue('goals')}</div>,
  },
];

export const WithRowSelection: Story = {
  render: () => {
    const table = useReactTable({
      data: players,
      columns: selectableColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      enableRowSelection: true,
    });

    return <DataTable table={table} columns={selectableColumns} enableRowSelection />;
  },
};

const columnsWithActions: ColumnDef<Player>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'team',
    header: 'Team',
  },
  {
    accessorKey: 'goals',
    header: 'Goals',
    cell: ({ row }) => <div className="text-end">{row.getValue('goals')}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const player = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => alert(`View ${player.name}`)}>
            View
          </Button>
          <Button variant="ghost" size="sm" onClick={() => alert(`Edit ${player.name}`)}>
            Edit
          </Button>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export const WithActions: Story = {
  render: () => {
    const table = useReactTable({
      data: players,
      columns: columnsWithActions,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });

    return <DataTable table={table} columns={columnsWithActions} />;
  },
};

export const Empty: Story = {
  render: () => {
    const table = useReactTable({
      data: [],
      columns: basicColumns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <DataTable
        table={table}
        columns={basicColumns}
        emptyMessage={
          <div className="flex flex-col items-center gap-2">
            <p className="text-muted-foreground">No players found</p>
            <Button variant="outline" size="sm">
              Add Player
            </Button>
          </div>
        }
      />
    );
  },
};
