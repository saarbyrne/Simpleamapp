# Tabs, Menubar y Navigation Menu - Migración

**Componentes:**
- `components/ui/tabs.tsx`
- `components/ui/menubar.tsx`
- `components/ui/navigation-menu.tsx`

**Status:** ✅ Tokens + Historias
**Fecha:** 2025-11-04
**Duración:** 1h

## Cambios realizados

1. **Tabs**
   - Se añadieron variables `--accent`/`--accent-foreground` para que los estados activos utilicen `tokens.colors.interactive.secondary`.
   - Listas y triggers emplean `surface.sunken`, tipografía `ui.button` y spacing semántico.
   - Nueva historia `components/ui/tabs.stories.tsx` con escenarios de planificación semanal.

2. **Menubar**
   - Fondo, bordes y sombras alineados con `surface.elevated`, `border.default` y `elevation.dropdown`.
   - Items/checkbox/radios configuran `--accent`, `--destructive` desde tokens para mantener los estados Radix.
   - Historia `components/ui/menubar.stories.tsx` mostrando acciones de Archivo/Vista/Ayuda.

3. **Navigation Menu**
   - Trigger, contenido y viewport adoptan tokens de superficie y z-index (`popup.dropdown`).
   - La flecha indicadora usa borde y fondo del sistema; enlaces definen `--accent` para estados hover/active.
   - Historia `components/ui/navigation-menu.stories.tsx` con enlaces de Equipo y Planificación.

## Pruebas
- [x] `npm run lint`
- [x] `npm run storybook -- --smoke-test --quiet`
- [ ] Revisión visual manual

## Beneficios
- **Consistencia** entre todos los componentes de navegación superior.
- **Mantenibilidad** al eliminar dependencias de clases `bg-popover`/`text-popover-foreground`.
- **Documentación** lista en Storybook para Producto y QA.

## Próximos pasos
- Añadir historias en modo oscuro cuando se definan los tokens dark.
- Considerar estados avanzados (multi-columnas, viewports personalizados) en documentación adicional.
