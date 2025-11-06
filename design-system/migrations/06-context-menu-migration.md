# Context Menu Component Migration

**Component:** ContextMenu  
**Status:** ✅ Complete  
**Priority:** P1 — Overlay pattern  
**Date:** 2025-11-04  
**Duración:** 35 minutos

## Resumen

Los menús contextuales ahora utilizan los tokens de superficie, tipografía y espaciado del sistema, eliminando las dependencias de `bg-popover`, `text-popover-foreground` y valores arbitrarios. También se creó una story en Storybook para validar las variantes más comunes (items, checkbox, radio group y submenús).

## Cambios

- `components/ui/context-menu.tsx`
  - Contenido y submenús aplican `tokens.colors.surface.elevated`, `border.default`, `radius.component.dropdown`, `elevation.component.dropdown` y `zIndex.popup.dropdown`.
  - Los items definen `--accent`, `--accent-foreground`, `--destructive` y `--destructive-foreground` con tokens para mantener los estilos Radix en focus/hover.
  - Tipografía y espaciado usan `tokens.typography.body.*` y `tokens.spacing.*`.
- `components/ui/context-menu.stories.tsx`
  - Nueva story “Default” con acciones reales, checkbox y submenús para pruebas visuales.

## Pruebas

- [x] `npm run lint`
- [x] `npm run storybook -- --smoke-test --quiet`
- [ ] Revisión visual manual

## Beneficios

1. **Consistencia:** los overlays comparten la misma superficie y sombra que Select y DropdownMenu.
2. **Accesibilidad:** los estados destructivos y secundarios heredan los colores aprobados por el sistema.
3. **Documentación:** Storybook listo para QA y diseño.

## Siguientes pasos

- Migrar `Popover`, `Tooltip`, `HoverCard` y `Sheet` para completar la familia de overlays.
- Añadir pruebas visuales automatizadas una vez que se configure Chromatic.
