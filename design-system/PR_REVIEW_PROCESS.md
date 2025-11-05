# Pull Request & Review Process

**Last Updated:** 05 November 2024
**Purpose:** Guide for submitting and reviewing pull requests

---

## Table of Contents

1. [Overview](#overview)
2. [Before You Submit](#before-you-submit)
3. [Creating a Pull Request](#creating-a-pull-request)
4. [Review Process](#review-process)
5. [Review Checklist](#review-checklist)
6. [Addressing Feedback](#addressing-feedback)
7. [Merging](#merging)
8. [Post-Merge](#post-merge)

---

## Overview

Our PR process ensures that all changes to the design system meet our quality standards and maintain consistency.

### Goals

- **Quality** – Maintain high code and design standards
- **Consistency** – Ensure all components follow established patterns
- **Accessibility** – Meet WCAG 2.1 AA requirements
- **Collaboration** – Foster learning and knowledge sharing
- **Documentation** – Keep documentation current and helpful

### Timeline Expectations

- **Initial review:** Within 2-3 business days
- **Follow-up reviews:** Within 1-2 business days
- **Total time:** Most PRs merge within 5-7 days

---

## Before You Submit

### Pre-Submission Checklist

Run through this checklist before opening your PR:

#### Code Quality

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Type check
npm run type-check

# Build to catch build errors
npm run build

# Build Storybook
npm run build-storybook
```

#### Design System Compliance

- [ ] Uses design tokens from `@/design-system/tokens`
- [ ] No hardcoded colors, spacing, or typography
- [ ] Follows existing naming conventions
- [ ] Component structure matches established patterns
- [ ] Uses CVA for variant management (if applicable)

#### Accessibility

- [ ] Keyboard navigable (Tab, Enter, Escape, Arrow keys)
- [ ] Proper ARIA attributes
- [ ] Visible focus indicators
- [ ] Screen reader friendly
- [ ] Meets contrast requirements (4.5:1 for text, 3:1 for UI)
- [ ] Respects `prefers-reduced-motion`

#### Theming

- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Uses CSS variables for theming
- [ ] Smooth theme transitions

#### Testing

- [ ] Manually tested in Chrome
- [ ] Manually tested in Firefox
- [ ] Manually tested in Safari (if available)
- [ ] Tested with keyboard only
- [ ] Tested with screen reader (if interactive)
- [ ] Storybook stories added/updated
- [ ] E2E tests added (for complex components)

#### Documentation

- [ ] Component JSDoc comments added
- [ ] Props documented
- [ ] Usage examples included
- [ ] Storybook stories comprehensive
- [ ] README updated (if needed)
- [ ] Migration guide updated (if breaking change)

---

## Creating a Pull Request

### 1. Push Your Branch

```bash
git push origin feature/your-feature-name
```

### 2. Open PR on GitHub

1. Navigate to the repository
2. Click "Pull requests" → "New pull request"
3. Select your branch
4. Fill out the PR template completely

### 3. PR Title Convention

Use clear, descriptive titles following Conventional Commits:

```
<type>(<scope>): <description>

Examples:
feat(button): add loading state variant
fix(dialog): correct focus trap behavior
docs(icons): add usage guidelines for icon sizing
refactor(tokens): reorganize color token structure
test(input): add accessibility tests
```

**Types:**
- `feat` – New feature or component
- `fix` – Bug fix
- `docs` – Documentation only
- `style` – Code formatting (not visual style)
- `refactor` – Code restructuring
- `test` – Adding or updating tests
- `chore` – Maintenance tasks
- `perf` – Performance improvements

### 4. Fill Out PR Template

The PR template includes:

- **Description** – What changed and why
- **Type of Change** – Feature, bug fix, docs, etc.
- **Testing** – What you tested and how
- **Screenshots** – Before/after for UI changes
- **Breaking Changes** – If applicable
- **Related Issues** – Link to issues

**Example:**

```markdown
## Description

Add a loading state variant to the Button component with a spinner animation.
This allows buttons to show loading feedback without disabling user interaction.

## Type of Change

- [x] New feature
- [ ] Bug fix
- [ ] Documentation update

## Changes Made

- Added `loading` prop to Button component
- Created loading spinner animation
- Updated Storybook stories with loading examples
- Added accessibility support for loading state

## Motivation and Context

Users needed visual feedback when buttons trigger async actions.
Closes #123

## Testing

- [x] Tested in Chrome, Firefox, Safari
- [x] Tested with keyboard navigation
- [x] Tested with screen reader (announces "Loading")
- [x] Tested in light and dark mode
- [x] Added Storybook stories
- [x] No console errors

## Screenshots

[Include before/after screenshots]
```

### 5. Request Reviewers

- Request at least one reviewer
- For major changes, request two reviewers
- Tag relevant team members
- Add appropriate labels

---

## Review Process

### Reviewer Responsibilities

As a reviewer, you should:

1. **Be timely** – Review within 2-3 business days
2. **Be thorough** – Check all aspects (code, design, a11y, docs)
3. **Be constructive** – Suggest improvements, don't just critique
4. **Be clear** – Explain your reasoning
5. **Be collaborative** – Work together to find the best solution

### What to Review

#### 1. Code Quality

```tsx
✅ Good:
const Button = ({ variant = 'default', ...props }) => {
  return (
    <button
      className={cn(buttonVariants({ variant }))}
      {...props}
    />
  )
}

❌ Avoid:
const Button = (props: any) => {
  return <button style={{ background: '#000' }}>{props.children}</button>
}
```

**Check:**
- TypeScript types are correct and strict
- No `any` types without justification
- Code is readable and well-organized
- No unnecessary complexity
- Follows existing patterns
- Proper error handling

#### 2. Design Consistency

**Check:**
- Uses design tokens consistently
- Matches existing component patterns
- Visual design aligns with design system
- Spacing and sizing are consistent
- Typography follows type scale

#### 3. Accessibility

**Test:**

```bash
# Keyboard navigation
- Tab to focus
- Enter/Space to activate
- Escape to close (modals, dropdowns)
- Arrow keys for navigation (where appropriate)

# Screen reader
- Elements have proper labels
- State changes are announced
- Error messages are associated with fields
- Focus management is correct
```

**Check:**
- ARIA attributes are correct
- Semantic HTML is used
- Focus indicators are visible
- Color contrast meets WCAG AA
- Works without mouse
- Works without sight

#### 4. Performance

**Check:**
- No unnecessary re-renders
- No heavy computations in render
- Proper use of `useMemo`/`useCallback`
- No memory leaks
- Bundle size impact is reasonable

#### 5. Documentation

**Check:**
- Storybook stories are comprehensive
- Props are documented
- Usage examples are clear
- Edge cases are covered
- Breaking changes are noted

---

## Review Checklist

Use this checklist when reviewing PRs:

### General

- [ ] PR title follows conventions
- [ ] Description is clear and complete
- [ ] Related issues are linked
- [ ] Appropriate labels are added
- [ ] No merge conflicts

### Code

- [ ] Code is readable and maintainable
- [ ] TypeScript types are correct
- [ ] No unnecessary complexity
- [ ] Follows existing patterns
- [ ] No console.log or debug code
- [ ] Error handling is appropriate
- [ ] Edge cases are handled

### Design System

- [ ] Uses design tokens (no hardcoded values)
- [ ] Follows naming conventions
- [ ] Consistent with existing components
- [ ] CVA variants are well-structured
- [ ] Component API is intuitive

### Accessibility

- [ ] Keyboard navigable
- [ ] Proper ARIA attributes
- [ ] Focus indicators visible
- [ ] Semantic HTML used
- [ ] Screen reader tested
- [ ] Meets WCAG 2.1 AA
- [ ] Color contrast sufficient
- [ ] Respects reduced motion

### Theming

- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Theme transitions smooth
- [ ] Uses CSS variables

### Testing

- [ ] Manually tested across browsers
- [ ] Keyboard navigation tested
- [ ] Screen reader tested (if interactive)
- [ ] Responsive design tested
- [ ] Storybook stories added
- [ ] E2E tests added (if complex)

### Documentation

- [ ] Component documented
- [ ] Props have descriptions
- [ ] Usage examples included
- [ ] Edge cases documented
- [ ] Breaking changes noted
- [ ] Migration guide updated (if needed)

### Performance

- [ ] No unnecessary re-renders
- [ ] No performance regressions
- [ ] Bundle size acceptable
- [ ] Images optimized (if applicable)

---

## Addressing Feedback

### As the Author

#### 1. Respond to All Comments

- Thank reviewers for their feedback
- Ask clarifying questions
- Explain your reasoning when disagreeing
- Be open to suggestions

#### 2. Make Requested Changes

```bash
# Make changes
git add .
git commit -m "fix: address review feedback"
git push origin your-branch
```

#### 3. Mark Conversations as Resolved

- Resolve conversations after addressing them
- Leave a comment explaining what you changed
- Re-request review when ready

#### 4. Handle Disagreements

If you disagree with feedback:

1. **Explain your reasoning** – Share your perspective
2. **Ask questions** – Understand the reviewer's concern
3. **Seek compromise** – Find a solution that works for both
4. **Escalate if needed** – Bring in a third party for major disagreements

**Example:**

```markdown
I see your concern about the prop naming. I chose `variant` because
it's consistent with our other components (Button, Badge, Card).
However, I'm open to changing it if you feel strongly. What do you think?
```

---

## Merging

### Merge Criteria

PRs can be merged when:

- [ ] At least 2 approvals (1 for minor changes)
- [ ] All conversations resolved
- [ ] CI/CD checks passing
- [ ] No merge conflicts
- [ ] Documentation complete
- [ ] Breaking changes documented

### Merge Methods

**Squash and Merge** (default for most PRs)
- Combines all commits into one
- Keeps main branch history clean
- Use for feature branches

**Rebase and Merge**
- Maintains individual commits
- Use for well-structured commit history

**Merge Commit**
- Preserves full branch history
- Use rarely, for special cases

### After Merging

1. Delete the feature branch
2. Update linked issues
3. Monitor for any post-merge issues
4. Celebrate the contribution! 🎉

---

## Post-Merge

### For Authors

- [ ] Branch deleted
- [ ] Linked issues closed/updated
- [ ] Monitor for feedback
- [ ] Thank your reviewers

### For Reviewers

- [ ] Verify merge was successful
- [ ] Monitor for any issues
- [ ] Update relevant documentation

### For Maintainers

- [ ] Update changelog (if needed)
- [ ] Plan release (if needed)
- [ ] Communicate changes to team

---

## Common Review Scenarios

### Scenario 1: Missing Accessibility

**Feedback:**
```markdown
This component isn't keyboard accessible. Can you add:
- Tab focus support
- Enter key activation
- Visible focus indicator
- aria-label for screen readers
```

**Response:**
```markdown
Good catch! I've added:
- Focus styles with ring-2 on focus-visible
- onKeyDown handler for Enter and Space
- aria-label prop
- Updated Storybook story to demonstrate keyboard usage

Please re-review when you have a chance.
```

### Scenario 2: Inconsistent with Design System

**Feedback:**
```markdown
This uses hardcoded spacing (padding: 16px). Can you use design tokens?
Also, the variant naming doesn't match our existing components.
```

**Response:**
```markdown
You're right, I should follow the established patterns. I've:
- Replaced hardcoded padding with tokens.spacing.spacing.md
- Renamed variants to match Button component (default, outline, ghost)
- Updated tests and stories accordingly

Let me know if this looks better!
```

### Scenario 3: Performance Concern

**Feedback:**
```markdown
This component re-renders on every keystroke. Can we optimize this?
Consider using useMemo or moving calculations outside the component.
```

**Response:**
```markdown
Great point! I've optimized it by:
- Memoizing the expensive calculation with useMemo
- Debouncing the onChange handler
- Moving static data outside the component

Performance is much better now. Thanks for catching this!
```

---

## Tips for Effective Reviews

### For Authors

- **Keep PRs focused** – One feature or fix per PR
- **Keep PRs small** – Aim for < 400 lines changed
- **Write clear descriptions** – Help reviewers understand your changes
- **Respond promptly** – Address feedback quickly
- **Be receptive** – View feedback as learning, not criticism

### For Reviewers

- **Review promptly** – Don't let PRs languish
- **Be specific** – Point to exact lines and suggest solutions
- **Be kind** – Remember there's a person on the other end
- **Ask questions** – Seek to understand before critiquing
- **Praise good work** – Call out things done well

---

## Review Examples

### ✅ Good Review Comment

```markdown
Great work on this component! The code is clean and well-structured.

One suggestion: The focus indicator could be more visible. Currently it's
a 1px outline, but our accessibility guidelines recommend 2px for better
visibility. You can use `focus-visible:ring-2` instead of `focus-visible:ring-1`.

Example:
[Code suggestion with diff]

This will ensure users with low vision can see the focus state clearly.
```

### ❌ Unhelpful Review Comment

```markdown
This doesn't work.
```

**Why it's unhelpful:**
- Not specific
- No explanation
- No suggestion for improvement
- Not constructive

**Better version:**

```markdown
I tested this on Firefox and the dropdown doesn't open when I click the trigger.
Chrome works fine. Can you check if there's a Firefox-specific issue?

I suspect it might be related to the pointer-events style. Try debugging
with Firefox DevTools to see if the click event is firing.
```

---

## Escalation Process

If you're stuck on a PR:

1. **Tag additional reviewers** – Get more perspectives
2. **Schedule a call** – Discuss complex issues synchronously
3. **Create a discussion** – Open a GitHub Discussion for architectural decisions
4. **Reach out to maintainers** – Get help from core team

---

## Questions?

- Review the [Contributing Guidelines](../CONTRIBUTING.md)
- Check [Component Template](./COMPONENT_TEMPLATE.md)
- Open a GitHub Discussion
- Ask in your PR comments

---

**Last Updated:** November 5, 2024
**Version:** 1.0.0
