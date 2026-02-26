#!/bin/bash
# PostToolUse hook: auto-lint after Edit/Write on JS/TS files.
# Non-blocking — formatting is best-effort.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0

# Only lint JS/TS files
if [[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
  # Get path relative to project root
  PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
  REL_PATH="${FILE_PATH#"$PROJECT_DIR"/}"

  npx next lint --file "$REL_PATH" --fix --quiet 2>/dev/null || true
fi

exit 0
