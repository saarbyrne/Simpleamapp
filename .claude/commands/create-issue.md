# Create Issue

Help create a well-structured GitHub issue.

## Steps

1. Ask the user (if not provided in args):
   - What needs to happen?
   - Why does it matter?

2. Determine labels from the canonical set (`docs/labels.yaml`):
   - **Type** (pick one): feat, fix, refactor, security, test, docs, chore
   - **Effort** (pick one): small (<2h), medium (2-8h), large (1-3d), xlarge (3+d)
   - **Priority** (pick one): P1-P4 (ask if unclear)

3. Write acceptance criteria:
   - Each criterion must be independently testable
   - Use checkbox format
   - Be specific: "Login form shows error message" not "Handle errors"

4. Create the issue:

```bash
gh issue create \
  --title "<type>: <concise description>" \
  --label "<type>,effort: <size>,P<N>: <priority>" \
  --body "$(cat <<'EOF'
## What
<one sentence>

## Why
<who benefits and how>

## Acceptance criteria
- [ ] <criterion 1>
- [ ] <criterion 2>
- [ ] <criterion 3>

## Notes
<links, mockups, edge cases, or "None">
EOF
)"
```

5. If effort is xlarge, suggest splitting into smaller issues first.

Topic: $ARGUMENTS
