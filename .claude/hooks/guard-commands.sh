#!/bin/bash
# PreToolUse hook for Bash commands.
# With skip permissions ON, this is the only thing between Claude and destruction.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

deny() {
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"%s"}}\n' "$1"
  exit 0
}

ask() {
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"%s"}}\n' "$1"
  exit 0
}

# ═══════════════════════════════════════════════════
# HARD BLOCKS — these never run, no exceptions
# ═══════════════════════════════════════════════════

# Recursive force delete
echo "$COMMAND" | grep -qE 'rm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)\b' && \
  deny "Blocked: rm -rf can delete your entire project."

# Force push
echo "$COMMAND" | grep -qE 'git\s+push\s+.*(-f|--force|--force-with-lease)\b' && \
  deny "Blocked: force push rewrites remote history. Use a normal push."

# Hard reset
echo "$COMMAND" | grep -qE 'git\s+reset\s+--hard\b' && \
  deny "Blocked: git reset --hard discards uncommitted work. Commit or stash first."

# Discard all changes
echo "$COMMAND" | grep -qE 'git\s+checkout\s+\.\s*$' && \
  deny "Blocked: git checkout . discards all unstaged changes."

# Clean untracked files
echo "$COMMAND" | grep -qE 'git\s+clean\s+-[a-zA-Z]*f' && \
  deny "Blocked: git clean -f deletes untracked files permanently."

# Restore all files
echo "$COMMAND" | grep -qE 'git\s+restore\s+\.\s*$' && \
  deny "Blocked: git restore . discards all changes."

# Destructive SQL
echo "$COMMAND" | grep -qiE '\b(drop\s+(table|database)|truncate\s+table|delete\s+from)\b' && \
  deny "Blocked: destructive SQL. Run this manually if you really mean it."

# Docker volume removal
echo "$COMMAND" | grep -qE 'docker(-compose|\s+compose)?\s+down\s+-v\b' && \
  deny "Blocked: -v flag deletes database volumes. Use down without -v."

# ═══════════════════════════════════════════════════
# ASK — require confirmation
# ═══════════════════════════════════════════════════

# Merging PRs
echo "$COMMAND" | grep -qE 'gh\s+pr\s+merge\b' && \
  ask "Confirm: merging a PR. This is permanent."

# Publishing packages
echo "$COMMAND" | grep -qE 'npm\s+publish\b' && \
  ask "Confirm: publishing to npm registry."

# Everything else: allow silently
exit 0
