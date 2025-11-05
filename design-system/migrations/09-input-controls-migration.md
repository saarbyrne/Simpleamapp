# Controles de interacción - Migración

**Componentes:** Checkbox, RadioGroup, Toggle, ToggleGroup, Slider, Switch, Progress

**Estado:** ✅ Tokens + Historias
**Fecha:** 2025-11-04
**Tiempo:** 45 minutos

## Cambios clave

- **Checkbox / RadioGroup**: se añadieron variables `--primary` y colores de fondo / borde desde tokens para evitar dependencias de clases `bg-primary` predeterminadas. Historias: `checkbox.stories.tsx`, `radio-group.stories.tsx`.
- **Toggle / ToggleGroup**: los estados `on`, `muted` y `destructive` ahora mapean a `interactive.secondary`, `surface.sunken`, `feedback.error`; historia `toggle.stories.tsx` (incluye grupo múltiple).
- **Slider**: el root expone `--accent` y la historia permite ajustar intensidad (`slider.stories.tsx`).
- **Switch**: root y thumb usan `--primary`, `--input` y bordes tokenizados; historia `switch.stories.tsx`.
- **Progress**: el fondo se genera con color primario al 20% y la historia `progress.stories.tsx` documenta un caso real.

## Pruebas
- [x] `npm run lint`
- [x] `npm run storybook -- --smoke-test --quiet`
- [ ] Revisión visual manual

## Beneficios
- Los controles comparten los mismos colores de interacción y semántica que Buttons y Dropdowns.
- Historias cubren casos reales (notificaciones, intensidad, progreso de formularios).
- Se eliminan referencias a clases de Tailwind con valores por defecto ajenos al sistema.

## Próximos pasos
- Evaluar estados deshabilitados/dark cuando se definan tokens y completar pruebas visuales automatizadas.
