import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './dropdown-menu';
import { Button } from './button';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/Dropdown Menu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => {
    const [showNotifications, setShowNotifications] = useState(true);
    const [mode, setMode] = useState<'team' | 'player' | 'medical'>('team');

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Opciones</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{ gap: tokens.spacing.gap.xs }}>
          <DropdownMenuLabel>Acciones rápidas</DropdownMenuLabel>
          <DropdownMenuItem>
            <span>Ver reporte semanal</span>
            <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Crear evaluación</span>
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <span>Archivar jugador</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={showNotifications}
            onCheckedChange={(checked) =>
              setShowNotifications(Boolean(checked))
            }
          >
            Mostrar notificaciones
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Vista actual</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={mode}
                onValueChange={(value) => setMode(value as typeof mode)}
              >
                <DropdownMenuRadioItem value="team">
                  Equipo completo
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="player">
                  Perfil individual
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medical">
                  Seguimiento médico
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};
