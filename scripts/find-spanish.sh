#!/bin/bash

# Comprehensive Spanish Text Cleanup Script
# Finds and lists all Spanish text in story files

echo "=== Scanning for Spanish text in story files ==="
echo ""

files_with_spanish=()

for file in components/ui/*.stories.tsx stories/foundation/*.stories.tsx; do
  if [ -f "$file" ]; then
    # Check for Spanish text (contains ñ, accents, or common Spanish words)
    if grep -q "ción\|ía\|ó\|ñ\|Añadir\|Editar\|Guardar\|Cancelar\|Buscar\|Crear\|Nuevo\|Ver\|evaluación\|Opciones\|Acciones" "$file"; then
      echo "Found Spanish in: $file"
      files_with_spanish+=("$file")
      echo "Lines with Spanish text:"
      grep -n "ción\|ía\|ó\|ñ\|Añadir\|Editar\|Guardar\|Cancelar\|Buscar\|Crear\|Nuevo\|Ver\|evaluación\|Opciones\|Acciones" "$file" | head -10
      echo ""
    fi
  fi
done

echo "=== Summary ==="
echo "Total files with Spanish: ${#files_with_spanish[@]}"
echo ""
echo "Files:"
for file in "${files_with_spanish[@]}"; do
  echo "  - $file"
done
