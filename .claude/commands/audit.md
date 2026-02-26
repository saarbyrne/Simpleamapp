# Project Audit

Audit this project against professional development practices. Check every category below.

## 1. Security Audit

### 1a. Secrets scan
Search the entire codebase for hardcoded secrets using these patterns:
- AWS keys (`AKIA`, `ASIA` + 16 chars)
- GitHub tokens (`ghp_`, `gho_`, `ghs_`, `ghu_`, `ghr_`)
- Private keys (`-----BEGIN ... PRIVATE KEY-----`)
- Stripe keys (`sk_live_`, `pk_live_`, `sk_test_`)
- Slack tokens (`xoxb-`, `xoxp-`, `xoxs-`)
- Sentry tokens (`sntrys_`)
- Database URIs with passwords (`postgresql://user:pass@`)
- Generic secrets (`api_key = "..."`, `secret_key: "..."`)

Also scan `.github/workflows/*.yml` for inline secrets.

### 1b. .gitignore check
- Does `.gitignore` exist?
- Does it include `.env`, `.env.*`, `*.pem`, `*.key`?
- Are any `.env` files tracked? (`git ls-files | grep '\.env'`)

### 1c. Dependencies
- Run `npm audit` and report known vulnerabilities

## 2. Project Structure

- Does `CLAUDE.md` exist? Does it cover: design system, security, git workflow, testing?
- Does `.claude/settings.json` exist with hooks?
- Are hooks executable? (`ls -la .claude/hooks/`)
- Does `.claude/commands/` have review and security-review skills?
- Are there issue templates in `.github/ISSUE_TEMPLATE/`?

## 3. CI/CD

- Does `.github/workflows/` exist?
- Is there a test workflow?
- Is there an automated review workflow?
- Are all workflows using consistent Node versions?
- Are all actions pinned to specific versions (@v4, not @main)?

## 4. Testing

- Do tests exist? Where?
- What's the test file count?
- Unit vs integration vs E2E separation?
- Coverage thresholds configured?
- Run `npm run test:unit` and report pass/fail

## 5. Labels & Issues

- Does `docs/labels.yaml` exist?
- Does `scripts/sync-labels.sh` exist?
- Do issue templates exist for bugs and features?

## 6. Code Quality

- Run `npm run lint` and report error count
- Run `npm run typecheck` and report error count
- Run `npm run design:lint` and report violations

## Output Format

| Category | Status | Details |
|----------|--------|---------|
| Secrets scan | PASS/FAIL | ... |
| .gitignore | PASS/FAIL | ... |
| Dependencies | PASS/WARN/FAIL | ... |
| CLAUDE.md | PASS/PARTIAL/FAIL | ... |
| Hooks | PASS/FAIL | ... |
| Skills | PASS/FAIL | ... |
| CI workflows | PASS/FAIL | ... |
| Tests | PASS/WARN/FAIL | ... |
| Labels | PASS/FAIL | ... |
| Code quality | PASS/WARN/FAIL | ... |

Then list all FAIL/WARN items with specific fix instructions.

End with: **"Do these things, in this order:"** (priority-ordered action plan).

Target: $ARGUMENTS
