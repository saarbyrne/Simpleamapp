# Security Review

Think like an attacker. Your goal is to find vulnerabilities.

## Step 0: Secrets scan (ALWAYS do this first)

Scan the ENTIRE codebase for hardcoded secrets. Search for these patterns in all `.ts`, `.tsx`, `.js`, `.json`, `.yaml`, `.yml` files:

1. AWS access keys: `AKIA` or `ASIA` followed by 16 alphanumeric chars
2. GitHub tokens: `ghp_`, `gho_`, `ghs_`, `ghu_`, `ghr_` followed by 36 chars
3. GitHub fine-grained PATs: `github_pat_` followed by 82 chars
4. Private keys: `-----BEGIN ... PRIVATE KEY-----`
5. Stripe keys: `sk_live_`, `pk_live_`, `sk_test_`, `rk_live_`
6. Slack tokens: `xoxb-`, `xoxp-`, `xoxs-`, `xoxa-`, `xoxe-`
7. Sentry tokens: `sntrys_`
8. Database URIs with passwords: `postgresql://user:password@`, `mongodb://`, `mysql://`, `redis://`
9. Generic secrets: `api_key = "..."`, `secret_key: "..."`, `auth_token = "..."`

Also scan GitHub Actions workflow files (`.github/workflows/*.yml`) for inline secrets that should use `${{ secrets.NAME }}`.

Report ALL matches as **CRITICAL** findings.

## Step 1: Check .env and .gitignore

- Is `.env` in `.gitignore`?
- Are any `.env` files tracked by git? (`git ls-files | grep '\.env'`)
- Do `NEXT_PUBLIC_` env vars expose anything sensitive?

## Step 2: Attack classes

### Authentication bypass
- Can requests reach protected endpoints without a valid token/session?
- Can expired/malformed tokens pass validation?
- Same error for "user not found" vs "wrong password"?

### Authorisation bypass (IDOR)
- Can User A access User B's data by changing IDs in URLs?
- Are ownership checks in every server action and API route?

### SQL injection
- Any raw SQL with string concatenation?
- Any `.format()` or template literals in database queries?
- Is Prisma used consistently (parameterised queries)?

### XSS
- Any `dangerouslySetInnerHTML` or `innerHTML`?
- Is user content sanitised before rendering?

### Input validation
- File uploads validated (type, size)?
- Query parameters validated with Zod schemas?
- Form inputs validated server-side (not just client-side)?

### CORS / Headers
- CORS origins restricted in `next.config`?
- Security headers present (CSP, X-Frame-Options, etc.)?

## Step 3: Dependency check

- Run `npm audit` and report any high/critical vulnerabilities
- Flag any newly added packages that are unfamiliar or unmaintained

## Output Format

```
### [CRITICAL/HIGH/MEDIUM/LOW] — Title

**Location**: file:line
**Attack**: How to exploit this
**Impact**: What an attacker achieves
**Fix**: Specific code change
```

End with an overall verdict: **PASS** / **FAIL** / **NEEDS REVIEW**

Target: $ARGUMENTS
