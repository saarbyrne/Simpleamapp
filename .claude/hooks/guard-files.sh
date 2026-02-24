#!/bin/bash
# PreToolUse hook for Edit and Write tools.
# 1. Block edits to sensitive files
# 2. Scan content being written for secrets

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

deny() {
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"%s"}}\n' "$1"
  exit 0
}

ask() {
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"%s"}}\n' "$1"
  exit 0
}

# ═══════════════════════════════════════════════════
# PART 1: Protect sensitive files
# ═══════════════════════════════════════════════════

[[ "$FILE_PATH" =~ \.env$ ]] && deny "Blocked: .env files contain secrets. Edit manually."
[[ "$FILE_PATH" =~ \.env\. ]] && deny "Blocked: .env files contain secrets. Edit manually."
[[ "$FILE_PATH" =~ /\.git/ ]] && deny "Blocked: never edit git internals directly."
[[ "$FILE_PATH" =~ package-lock\.json$ ]] && deny "Blocked: lock files change via npm only."
[[ "$FILE_PATH" =~ yarn\.lock$ ]] && deny "Blocked: lock files change via yarn only."
[[ "$FILE_PATH" =~ pnpm-lock\.yaml$ ]] && deny "Blocked: lock files change via pnpm only."
[[ "$FILE_PATH" =~ \.aws/credentials ]] && deny "Blocked: AWS credentials must not be edited by Claude."

# ═══════════════════════════════════════════════════
# PART 2: Scan content for secrets
# ═══════════════════════════════════════════════════

if [ -n "$CONTENT" ]; then

  # AWS Access Keys
  if echo "$CONTENT" | grep -qE '(AKIA|ASIA|ABIA|ACCA)[A-Z0-9]{16}'; then
    deny "SECRET DETECTED: AWS access key. Use environment variables instead."
  fi

  # GitHub Tokens
  if echo "$CONTENT" | grep -qE 'gh[pousr]_[0-9a-zA-Z]{36}'; then
    deny "SECRET DETECTED: GitHub token. Use environment variables instead."
  fi
  if echo "$CONTENT" | grep -qE 'github_pat_[0-9a-zA-Z]{22}_[0-9a-zA-Z]{59}'; then
    deny "SECRET DETECTED: GitHub fine-grained PAT. Use environment variables instead."
  fi

  # Private Keys
  if echo "$CONTENT" | grep -qE '\-\-\-\-\-BEGIN.*(RSA |DSA |EC |OPENSSH |ENCRYPTED |PGP )?PRIVATE KEY'; then
    deny "SECRET DETECTED: Private key. Never put private keys in source code."
  fi

  # Stripe Keys
  if echo "$CONTENT" | grep -qE '[spr]k_(live|test)_[0-9a-zA-Z]{10,99}'; then
    deny "SECRET DETECTED: Stripe key. Use environment variables instead."
  fi

  # Slack Tokens
  if echo "$CONTENT" | grep -qE 'xox[bpase]-[0-9]{1,}-'; then
    deny "SECRET DETECTED: Slack token. Use environment variables instead."
  fi

  # Sentry Tokens
  if echo "$CONTENT" | grep -qE 'sntrys_[0-9a-zA-Z+/=_-]{20,}'; then
    deny "SECRET DETECTED: Sentry auth token. Use environment variables instead."
  fi

  # Database Connection Strings with Passwords
  if echo "$CONTENT" | grep -qE '(postgresql|postgres|mysql|mongodb|redis)(\+srv)?://[^:[:space:]]+:[^@[:space:]]+@'; then
    deny "SECRET DETECTED: Database connection string with password. Use environment variables instead."
  fi

  # Hardcoded JWT in assignment
  if echo "$CONTENT" | grep -qE '(token|jwt|bearer|auth)[[:space:]]*[:=].*eyJ[a-zA-Z0-9_-]{20,}\.eyJ'; then
    deny "SECRET DETECTED: Hardcoded JWT token. Use environment variables instead."
  fi

  # Generic hardcoded secrets (ASK, not deny — may be false positive)
  if echo "$CONTENT" | grep -qEi '(api_key|api_secret|secret_key|private_key|client_secret|auth_token|access_token)[[:space:]]*[:=][[:space:]]*["\x27][A-Za-z0-9/+=_\-]{20,}["\x27]'; then
    if ! echo "$CONTENT" | grep -qE '(process\.env|os\.environ|os\.getenv|\$\{|getenv)'; then
      ask "Possible hardcoded secret detected. Is this a real secret or a placeholder?"
    fi
  fi

fi

exit 0
