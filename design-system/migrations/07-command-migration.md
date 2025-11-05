# Command Palette Migration

**Component:** Command (`components/ui/command.tsx`)  
**Status:** ✅ Complete  
**Impact:** Alto — búsqueda global y accesos rápidos  
**Fecha:** 2025-11-04  
**Tiempo invertido:** 40 minutos

## Cambios realizados

- Sustituido el uso de clases `bg-popover`, `text-popover-foreground`, `bg-border`, etc. por tokens (`tokens.colors.surface.elevated`, `tokens.colors.text.primary`, `tokens.colors.border.subtle`).
- Se añadieron variables CSS (`--accent`, `--accent-foreground`, `--muted-foreground`) obtenidas del sistema para que los estados Radix (selected, muted) conserven el estilo sin depender de Tailwind por defecto.
- Ajustes de tipografía y espaciado con `tokens.typography.body.*` y `tokens.spacing.*`.
- Actualización del separador (`CommandSeparator`) para usar `tokens.colors.border.subtle`.
- Nueva historia en `components/ui/command.stories.tsx` que muestra un diálogo con grupos, separadores y shortcuts.

## Pruebas

- [x] `npm run lint`
- [x] `npm run storybook -- --smoke-test --quiet`
- [ ] Revisión visual en Storybook

## Beneficios

1. **Consistencia visual:** se alinea con Dropdown/Context menu en colores y elevación.
2. **Mantenibilidad:** los estados seleccionados y muted dependen ahora del sistema de tokens.
3. **Documentación:** Storybook sirve como referencia para QA y diseño.

## Próximos pasos

- Añadir pruebas visuales (Chromatic) una vez disponible.
- Incluir ejemplos con resultados vacíos/acciones deshabilitadas al ampliar la documentación.
