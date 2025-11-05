import type { Meta, StoryObj } from '@storybook/react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from './context-menu';
import { Button } from './button';
import { tokens } from '@/design-system/tokens';
import { ClipboardCopyIcon, Share2Icon, PenSquareIcon } from 'lucide-react';
import { useState } from 'react';
import { Icon } from './icon';

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/Context Menu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: () => {
    const [showNotifications, setShowNotifications] = useState(true);
    const [view, setView] = useState<'overview' | 'medical' | 'training'>(
      'overview',
    );

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Button variant="secondary">Jugador: Jordan Smith</Button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Acciones rápidas</ContextMenuLabel>
          <ContextMenuItem>
            <Icon icon={PenSquareIcon} size="sm" decorative className="mr-2" />
            <span>Abrir perfil</span>
          </ContextMenuItem>
          <ContextMenuItem>
            <Icon icon={ClipboardCopyIcon} size="sm" decorative className="mr-2" />
            <span>Copiar link</span>
          </ContextMenuItem>
          <ContextMenuItem variant="destructive">
            <Icon icon={Share2Icon} size="sm" decorative className="mr-2" />
            <span>Desactivar notificaciones</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={showNotifications}
            onCheckedChange={(checked) =>
              setShowNotifications(Boolean(checked))
            }
          >
            Alertas de bienestar
          </ContextMenuCheckboxItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <span>Vista predeterminada</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuRadioGroup
                value={view}
                onValueChange={(value) => setView(value as typeof view)}
              >
                <ContextMenuRadioItem value="overview">
                  Resumen general
                </ContextMenuRadioItem>
                <ContextMenuRadioItem value="medical">
                  Seguimiento médico
                </ContextMenuRadioItem>
                <ContextMenuRadioItem value="training">
                  Carga de entrenamiento
                </ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};
