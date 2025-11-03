# AI Testing Playbook

This playbook captures reusable prompts and workflows the designer can use to direct Codex (or any AI coding assistant) to generate and maintain automated tests without manual coding.

## How to Use
1. Choose the scenario below that matches the needed change.
2. Copy the prompt into Codex/AI chat, replacing bracketed text with real details.
3. Ask the AI to run the suggested commands (`npm test`, `npx playwright test`, etc.).
4. Review summaries of test results; if failures occur, re-run the prompt with failure details so the AI can patch.

Status: Playbook created 2024-11-14. Next review 2025-02-01 or when new workflows are added.

## Prompts

### A. Create/Update Component Unit Tests
```
You are contributing to Simpleam. Write or update Vitest + Testing Library tests for [component path]. 
Behaviors to cover:
- [list specific behaviors]
Use the existing design-system conventions.
After updating, run `npm run test:unit` and summarize the results.
```

### B. Add Storybook Story
```
Add or update Storybook stories for [component path] demonstrating:
- [scenario 1]
- [scenario 2]
Ensure controls exist for key props. Run `npm run storybook:lint` if available.
```

### C. Generate End-to-End Flow
```
Create a Playwright test for the "[journey name]" flow. 
Steps:
- [list steps from manual checklist]
Tag accessibility assertions with `@a11y` and visual snapshots with `@visual`.
Run `npm run test:e2e` and summarize outcomes.
```

### D. Fill Coverage Gaps
```
Current Vitest coverage fell below threshold. Inspect coverage report in `coverage/lcov-report/index.html` and add tests for the lowest covered files until overall coverage returns to 80%. Then rerun `npm run test:unit -- --coverage`.
```

### E. Perf & Accessibility Regression
```
Run `npm run test:perf` and `npm run test:a11y`. If performance budgets or axe checks fail, list offending URLs/selectors and propose code fixes or fallback handling.
```

## Guidelines for Prompts
- Always provide the component or file path.
- Reference acceptance criteria from `documents/experience-charter.md`.
- Include any recent bugs to prevent regressions.
- Ask for command outputs to be summarized so you can copy into release notes.

## Handling Failures
- When tests fail, copy the error summary and request: “Investigate this failure and patch the code/tests.”
- If automation flakes, ask the AI to stabilize (e.g., by waiting for selectors, adding retries) and rerun the suite.

## Maintenance Checklist
- Update prompts whenever new journeys or components are added.
- Store additional successful prompts at the bottom of this file for future reuse.
- Keep track of AI-generated changes in the release journal for transparency.
