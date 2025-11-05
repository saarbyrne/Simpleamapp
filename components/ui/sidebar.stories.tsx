import type { Meta, StoryObj } from '@storybook/react';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarInset,
  SidebarSeparator,
  SidebarInput,
} from './sidebar';
import { Button } from './button';
import { tokens } from '@/design-system/tokens';
import {
  BellIcon,
  CalendarIcon,
  HomeIcon,
  LayersIcon,
  PlusIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';

const meta: Meta<typeof SidebarProvider> = {
  title: 'Components/Sidebar',
  component: SidebarProvider,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SidebarProvider>;

const ExampleLayout = () => (
  <SidebarProvider
    style={{
      minHeight: '100vh',
      backgroundColor: tokens.colors.surface.base,
    }}
  >
    <Sidebar>
      <SidebarHeader>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.gap.sm,
            paddingLeft: tokens.spacing.spacing.sm,
            paddingRight: tokens.spacing.spacing.sm,
          }}
        >
          <SidebarTrigger />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing.gap.xs,
            }}
          >
            <span
              style={{
                fontSize: tokens.typography.body.sm.fontSize,
                fontWeight: tokens.typography.fontWeight.semibold,
              }}
            >
              SimpleAM
            </span>
            <span
              style={{
                fontSize: tokens.typography.body.xs.fontSize,
                color: tokens.colors.text.secondary,
              }}
            >
              Temporada 2025
            </span>
          </div>
        </div>
        <SidebarInput placeholder="Buscar jugadores..." />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <HomeIcon className="mr-2" />
                  <span>Inicio</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <UsersIcon className="mr-2" />
                  <span>Plantilla</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <CalendarIcon className="mr-2" />
                  <span>Calendario</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>3</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Wellness</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <LayersIcon className="mr-2" />
                  <span>Formularios</span>
                </SidebarMenuButton>
                <SidebarMenuAction showOnHover>
                  <PlusIcon className="size-4" />
                </SidebarMenuAction>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BellIcon className="mr-2" />
                  <span>Alertas</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Ver planes individuales">
                  <SettingsIcon className="mr-2" />
                  <span>Configuración</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton isActive>
                      <span>Recuperación</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>
                      <span>Carga aguda</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="secondary">Invitar staff</Button>
        <Button>Nuevo reporte</Button>
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing.gap.lg,
          padding: tokens.spacing.spacing['3xl'],
        }}
      >
        <h2
          style={{
            fontSize: tokens.typography.heading.h3.fontSize,
            fontWeight: tokens.typography.heading.h3.fontWeight,
            lineHeight: tokens.typography.heading.h3.lineHeight,
            color: tokens.colors.text.primary,
          }}
        >
          Panel principal
        </h2>
        <p
          style={{
            fontSize: tokens.typography.body.md.fontSize,
            lineHeight: tokens.typography.body.md.lineHeight,
            color: tokens.colors.text.secondary,
            maxWidth: '42rem',
          }}
        >
          Utiliza la barra lateral para navegar por la información crítica del equipo: wellness
          diario, cargas de entrenamiento, documentación médica y reportes personalizados.
        </p>
      </div>
    </SidebarInset>
  </SidebarProvider>
);

export const Default: Story = {
  render: () => <ExampleLayout />,
};
