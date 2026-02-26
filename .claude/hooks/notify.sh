#!/bin/bash
# Notification hook: desktop alert when Claude needs input (macOS).

if command -v osascript &>/dev/null; then
  osascript -e 'display notification "Claude Code needs your input" with title "SimpleAM" sound name "Tink"' 2>/dev/null || true
fi

exit 0
