#!/bin/bash
# Syncs GitHub labels from docs/labels.yaml
# Idempotent — safe to re-run
# Usage: bash scripts/sync-labels.sh

set -euo pipefail

REPO="saarbyrne/Simpleamapp"
LABELS_FILE="docs/labels.yaml"

if ! command -v yq &> /dev/null; then
  echo "Error: yq is required. Install: brew install yq"
  exit 1
fi

echo "Syncing labels from $LABELS_FILE to $REPO..."

# Delete GitHub's defaults that aren't in our canonical set
for default_label in "bug" "documentation" "duplicate" "enhancement" "good first issue" "help wanted" "invalid" "question" "wontfix"; do
  if ! yq -e ".[] | select(.name == \"$default_label\")" "$LABELS_FILE" > /dev/null 2>&1; then
    gh label delete "$default_label" --repo "$REPO" --yes 2>/dev/null && echo "  Deleted default: $default_label" || true
  fi
done

# Create/update all canonical labels
LABEL_COUNT=$(yq '. | length' "$LABELS_FILE")
for i in $(seq 0 $((LABEL_COUNT - 1))); do
  NAME=$(yq -r ".[$i].name" "$LABELS_FILE")
  COLOR=$(yq -r ".[$i].color" "$LABELS_FILE")
  DESC=$(yq -r ".[$i].description" "$LABELS_FILE")
  gh label create "$NAME" --color "$COLOR" --description "$DESC" --repo "$REPO" --force 2>/dev/null
  echo "  Synced: $NAME"
done

echo ""
echo "Done. $LABEL_COUNT labels synced to $REPO"

# Check for drift
echo ""
echo "Checking for drift (labels on repo not in canonical set)..."
DRIFT=0
while IFS= read -r repo_label; do
  if ! yq -e ".[] | select(.name == \"$repo_label\")" "$LABELS_FILE" > /dev/null 2>&1; then
    echo "  DRIFT: '$repo_label' exists on repo but not in $LABELS_FILE"
    DRIFT=1
  fi
done < <(gh label list --repo "$REPO" --limit 100 --json name --jq '.[].name')

if [ $DRIFT -eq 0 ]; then
  echo "  No drift detected."
else
  echo ""
  echo "  To fix: either add these labels to $LABELS_FILE or delete them:"
  echo "  gh label delete \"<name>\" --repo $REPO --yes"
fi
