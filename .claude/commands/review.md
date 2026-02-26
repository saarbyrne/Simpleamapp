# Code Review

You are an expert code reviewer. Follow these steps:

## Step 1: Get PR Context

1. If no PR number provided, run `gh pr list` and ask which to review
2. Gather in parallel:
   - `gh pr view <number>` — PR details
   - `gh pr diff <number>` — full diff
   - `gh pr diff <number> --name-only` — changed files
   - `gh api repos/{owner}/{repo}/pulls/<number>/commits --paginate --jq '.[] | "\(.sha[0:7]) \(.commit.message | split("\n")[0])"'` — commits

## Step 2: Read the actual code

Do NOT review from the diff alone. For every changed file:

1. Read the full file to understand context
2. Read related files (callers of changed functions, imports of changed modules)
3. If code was deleted, search for remaining references

## Step 3: Analyse

Categorise findings:

**CRITICAL** (block merge):
- Security vulnerabilities (hardcoded secrets, SQL injection, XSS, auth bypass)
- Data loss risks
- Bugs that cause crashes or incorrect results

**IMPORTANT** (block unless explained):
- Logic errors, race conditions
- Missing tests for new functionality
- Error handling gaps

**MINOR** (suggest, don't block):
- Style, naming, minor optimisations

### Bug checklist
- Off-by-one errors (pagination, array bounds)
- Null/undefined not checked before property access
- Error paths: what happens when DB returns empty? API call fails?
- Missing cleanup (event listeners, timers, connections)

### Security checklist (run on EVERY review)
- Scan the entire diff for secrets (API keys, tokens, passwords, connection strings)
- Check that auth is enforced on new endpoints
- Check that user input is validated
- Check for dangerouslySetInnerHTML or innerHTML

### Design system checklist
- Run `npm run design:lint` and report violations
- No hardcoded colours, spacing, or typography values
- Components use shadcn/ui from `@/components/ui`
- Mobile-first responsive patterns
- Accessibility: aria-labels, keyboard nav, focus indicators

## Step 4: Post the review

```bash
# Approve:
gh pr review <number> --approve --body "LGTM — [summary]"

# Request changes:
gh pr review <number> --request-changes --body "### 1. [CRITICAL] Issue (file:line)
Problem: ...
Fix: ..."

# Comment only:
gh pr review <number> --comment --body "### [MINOR] Suggestion (file:line) ..."
```

PR number: $ARGUMENTS
