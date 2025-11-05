# Card Component Migration

**Component:** Card  
**Status:** ✅ Complete  
**Priority:** P2 - Medium Impact  
**Time Taken:** 35 minutes  
**Date:** 2025-11-04

## Summary

Migrated the Card component family to the design-system token architecture and documented usage in Storybook. This ensures layout surfaces follow the same elevation, spacing y tipografía rules as dialogs y formularios.

## Issues Addressed

1. **Inconsistent spacing** – Se reemplazaron valores ad hoc (`paddingLeft: 1.5rem`, etc.) por tokens semánticos `tokens.spacing.component.cardPadding`.
2. **Borders y elevación fuera de sistema** – Ahora se usan `tokens.colors.border.subtle` y `tokens.elevation.component.card` con transición hacia `tokens.elevation.component.cardHover`.
3. **Tipografía sin semántica** – `CardTitle` aprovecha `tokens.typography.heading.h5`; `CardDescription` continúa con `tokens.typography.body.sm`.

## Changes Made

- `components/ui/card.tsx`
  - Se añadió transición con sombra en hover usando los tokens de elevación.
  - Se mapearon los paddings de header, content y footer a los tokens de componente (`cardPadding`, `cardPaddingSm`).
  - Se actualizó la tipografía de `CardTitle` a `heading.h5` y se homogenizó la paleta de borde.
- `components/ui/card.stories.tsx`
  - Historias de Storybook para escenarios comunes (simple, con acciones, layout multimedia).

## Testing Checklist

- [x] `npm run lint`
- [x] `npm run storybook -- --smoke-test --quiet`
- [ ] Revisión visual manual en Storybook (pendiente)

## Benefits

1. **Consistencia visual** – Las tarjetas comparten elevación y paddings con el resto de superficies elevadas.
2. **Accesibilidad mantenida** – Tipografía y contraste siguen los tokens aprobados.
3. **Documentación lista** – Diseño y desarrollo pueden ver variantes directamente en Storybook.

## Next Component

**Sidebar (`components/ui/sidebar.tsx`)** – requiere migrar z-index, colores de fondo y espaciado, además de documentación de navegación.
