import type { Meta, StoryObj } from '@storybook/react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
} from './menubar';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Menubar> = {
  title: 'Components/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar style={{ width: 'fit-content' }}>
      <MenubarMenu>
        <MenubarTrigger>Archivo</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New report</MenubarItem>
          <MenubarItem>Import templates</MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Close season</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Vista</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Secciones visibles</MenubarLabel>
          <MenubarCheckboxItem>Daily wellness</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Planning</MenubarCheckboxItem>
          <MenubarCheckboxItem>Medical alerts</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Densidad de datos</MenubarLabel>
          <MenubarRadioGroup value="normal">
            <MenubarRadioItem value="compact">Compacta</MenubarRadioItem>
            <MenubarRadioItem value="normal">Equilibrada</MenubarRadioItem>
            <MenubarRadioItem value="spacious">Amplia</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Ayuda</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Centro de soporte</MenubarItem>
          <MenubarItem>Atajos de teclado</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
