import type { Meta, StoryObj } from '@storybook/react';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from './command';
import { useState } from 'react';

const meta: Meta<typeof CommandDialog> = {
  title: 'Components/Command',
  component: CommandDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof CommandDialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Busca acciones rápidas..." />
        <CommandList>
          <CommandEmpty>No encontramos resultados.</CommandEmpty>
          <CommandGroup heading="Navegación principal">
            <CommandItem>
              Abrir dashboard
              <CommandShortcut>⌘ D</CommandShortcut>
            </CommandItem>
            <CommandItem>
              Plantilla
              <CommandShortcut>⌘ P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              Calendario de cargas
              <CommandShortcut>⌘ C</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Acciones rápidas">
            <CommandItem>Crear evaluación de wellness</CommandItem>
            <CommandItem>Invitar nuevo staff</CommandItem>
            <CommandItem>Exportar reporte semanal</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    );
  },
};
