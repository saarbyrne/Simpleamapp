# Dropdown Menu Component Migration

**Component:** DropdownMenu  
**Status:** ✅ Complete  
**Priority:** P1 - Overlay / Select dependency  
**Time Taken:** 45 minutes  
**Date:** 2025-11-04

## Summary

El menú desplegable ahora consume los tokens para color, espaciado, tipografía y z-index, reemplazando `bg-popover`, `text-popover-foreground`, `focus:bg-accent` hardcodeados. También se creó una historia en Storybook que cubre items, checkbox, radio group y submenús.

## Cambios

- `components/ui/dropdown-menu.tsx`
  - Contenido y submenú usan `tokens.colors.surface.elevated`, `tokens.colors.text.primary`, `tokens.radius.component.dropdown`, `tokens.elevation.component.dropdown`.
  - Los items definen variables CSS (`--accent`, `--destructive`, etc.) con tokens para conservar los estados hover/focus heredados.
  - Checkbox, radio e items destructivos usan los colores del sistema (`feedback.error`, `interactive.secondary`).
- `components/ui/dropdown-menu.stories.tsx`
  - Story con acciones reales (shortcuts, toggles, submenú) para validar layout y estados.

## Tests

- [x] `npm run lint`
- [x] `npm run storybook -- --smoke-test --quiet`
- [ ] Revisión visual manual en Storybook

## Beneficios

1. **Consistencia:** Overlays (Select/Dropdown/Popover) comparten tokens de superficie y sombras.
2. **Estados accesibles:** Los colores derivados de tokens aseguran contraste adecuado en hover/focus.
3. **Documentación:** Storybook muestra casos comunes para QA y diseño.

## Próximos pasos

- Migrar `ContextMenu`, `HoverCard` y `Tooltip` siguiendo el mismo patrón de overlay tokens.
- Añadir pruebas visuales cuando se integre Chromatic.
