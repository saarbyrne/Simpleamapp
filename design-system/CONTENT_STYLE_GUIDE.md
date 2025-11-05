# Content Style Guide

**Last Updated:** 05 November 2024
**Inspired By:** IBM Carbon Design System, GOV.UK Design System
**Purpose:** Create clear, consistent, and user-focused content across our design system

---

## Table of Contents

1. [Voice & Tone](#voice--tone)
2. [Writing Principles](#writing-principles)
3. [Grammar & Mechanics](#grammar--mechanics)
4. [Capitalization](#capitalization)
5. [Punctuation](#punctuation)
6. [Numbers & Dates](#numbers--dates)
7. [Inclusive Language](#inclusive-language)
8. [Accessibility](#accessibility)

---

## Voice & Tone

### Our Voice

Our design system speaks with a voice that is:

- **Clear** – We use simple, direct language that anyone can understand
- **Helpful** – We anticipate user needs and provide practical guidance
- **Professional** – We're knowledgeable without being condescending
- **Human** – We write like we're talking to a colleague, not a machine
- **Confident** – We're certain about our recommendations, but open to feedback

**Think of it as:** A conversation between experienced teammates who respect each other's time.

### Tone Variations

While our voice stays consistent, our tone adapts to context:

#### Instructional (Documentation, Guidelines)
**Goal:** Help users accomplish tasks
**Tone:** Direct, clear, supportive

✅ **Good:** "Use the Button component for primary actions that submit or confirm."
❌ **Avoid:** "You might want to consider using the Button component if you need to submit something."

#### Reference (API Docs, Props Tables)
**Goal:** Provide quick answers
**Tone:** Concise, precise, factual

✅ **Good:** "`variant` – Controls the visual style. Options: 'default', 'destructive', 'outline', 'ghost'."
❌ **Avoid:** "The variant prop is a really useful way to change how your button looks visually."

#### Error Messages
**Goal:** Help users fix problems
**Tone:** Calm, specific, solution-oriented

✅ **Good:** "Email is required. Enter your email address."
❌ **Avoid:** "Oops! Looks like you forgot something! 😅"

#### Success Messages
**Goal:** Confirm completion
**Tone:** Brief, positive, actionable

✅ **Good:** "Player added successfully. Add another player or view the roster."
❌ **Avoid:** "Congratulations! You've successfully added a player to the system!"

#### Empty States
**Goal:** Guide next steps
**Tone:** Encouraging, action-oriented

✅ **Good:** "No players yet. Add your first player to get started."
❌ **Avoid:** "There's nothing here. The list is empty."

---

## Writing Principles

### 1. Start with the User's Goal

Focus on what the user wants to accomplish, not what the system does.

✅ **Good:** "Filter players by position to find defenders."
❌ **Avoid:** "The system allows filtering by position attribute."

### 2. Use Active Voice

Active voice makes it clear who does what.

✅ **Good:** "The component validates input automatically."
❌ **Avoid:** "Input is validated automatically by the component."

### 3. Keep It Short

**Target:** 25 words or fewer per sentence.

✅ **Good:** "Use tooltips for helpful hints. Keep them under 60 characters."
❌ **Avoid:** "Tooltips should be used in situations where you want to provide additional helpful information to users, and you should try to keep the text relatively short, ideally under 60 characters."

### 4. One Idea Per Sentence

Don't pack multiple concepts into a single sentence.

✅ **Good:** "Choose a variant. Each variant serves a different purpose."
❌ **Avoid:** "Choose a variant, keeping in mind that each variant serves a different purpose, which is explained in the sections below."

### 5. Front-Load Important Information

Put the most important information first.

✅ **Good:** "Required fields use an asterisk (*). Mark all required fields in your forms."
❌ **Avoid:** "In your forms, you should mark all required fields, and we use an asterisk (*) to indicate this."

### 6. Avoid Jargon and Explain Technical Terms

When you must use technical terms, explain them clearly.

✅ **Good:** "The component uses polymorphism (it can render as different HTML elements)."
❌ **Avoid:** "The component leverages polymorphic rendering capabilities via the `asChild` prop."

### 7. Be Specific

Vague words like "easy," "simple," or "just" add no value.

✅ **Good:** "Import the component: `import { Button } from '@/components/ui/button'`"
❌ **Avoid:** "Simply import the component. It's easy!"

### 8. Write for Scanning

Users scan, they don't read every word.

- Use descriptive headings
- Break up long paragraphs
- Use bulleted lists
- Highlight key terms
- Add visual examples

### 9. Address the User as "You"

Direct address feels more personal and clear.

✅ **Good:** "You can customize the theme using CSS variables."
❌ **Avoid:** "Developers can customize the theme using CSS variables."

### 10. Show, Don't Tell

Provide code examples, screenshots, or interactive demos.

✅ **Good:**
```tsx
// Use the 'destructive' variant for delete actions
<Button variant="destructive">Delete player</Button>
```

❌ **Avoid:** "You should use the destructive variant for delete actions."

---

## Grammar & Mechanics

### Contractions

**Use contractions** to sound more natural and conversational.

✅ **Good:** "Don't use this pattern for large datasets."
✅ **Good:** "It's recommended to validate all inputs."
✅ **Good:** "You'll find the prop documented below."

**Avoid contractions** in error messages or critical instructions where absolute clarity is needed.

✅ **Good:** "Cannot connect to server. Check your network connection."

### Starting Sentences with And, But, So

**It's okay** when it improves readability and flow.

✅ **Good:** "Use kebab-case for file names. And use PascalCase for component names."
✅ **Good:** "The component is accessible. But you still need to provide labels."

### Abbreviations

**First use:** Spell out, then provide abbreviation.
**Subsequent uses:** Use abbreviation.

✅ **Example:** "Web Content Accessibility Guidelines (WCAG) set the standard. Follow WCAG 2.1 AA."

### Common Abbreviations (No explanation needed)
- HTML, CSS, JavaScript, TypeScript
- UI, UX, API
- ARIA, a11y (accessibility)

---

## Capitalization

### Sentence Case (Default)

Use sentence-case for **all** UI text:
- Headings and titles
- Button labels
- Navigation items
- Form labels
- Error messages

✅ **Good:** "Add new player"
❌ **Avoid:** "Add New Player"

### Exceptions (Use Title Case)

- Brand names: "SimpleAM," "Lucide React," "Next.js"
- Proper nouns: "Monday," "January," "Premier League"
- Acronyms: "API," "CSS," "WCAG"

### Code and Technical Terms

Keep original capitalization for:
- Component names: `Button`, `ThemeProvider`
- Props: `variant`, `asChild`, `className`
- CSS properties: `backgroundColor`, `display`
- File names: `button.tsx`, `theme-toggle.tsx`

---

## Punctuation

### Periods

**Use periods** for:
- Full sentences in body text
- Multi-sentence list items

**Omit periods** for:
- Single-word or fragment list items
- Button labels
- Form field labels
- Short tooltips

✅ **Good (body text):** "This component provides flexible layout options."
✅ **Good (list):**
- Default variant
- Outline variant
- Ghost variant

✅ **Good (button):** "Save changes" (no period)
✅ **Good (label):** "Player name" (no period)

### Commas

Use the **Oxford comma** (serial comma) in lists.

✅ **Good:** "Import the component, add props, and render it."
❌ **Avoid:** "Import the component, add props and render it."

### Exclamation Points

Use sparingly. Never in error messages or critical instructions.

✅ **Acceptable:** "Welcome to the design system!" (onboarding)
❌ **Avoid:** "Error! Please try again!" (error message)

---

## Numbers & Dates

### Numbers

**Spell out:** One through nine
**Use numerals:** 10 and above

✅ **Good:** "Choose one of three variants."
✅ **Good:** "Import 12 components from the library."

**Exceptions (always use numerals):**
- Measurements: "16px," "2rem," "100%"
- Versions: "Version 1.0," "v2.3.1"
- Code examples: "timeout: 300"
- UI elements: "Button has 4 variants"

### Dates

**Format:** Month DD, YYYY

✅ **Good:** "November 5, 2024"
✅ **Good:** "Updated: Nov 5, 2024" (abbreviate in tight spaces)

**In code comments or technical docs:** ISO 8601

✅ **Good:** "2024-11-05"

### Time

**Format:** 12-hour with am/pm (lowercase, no periods)

✅ **Good:** "Last updated: 2:30pm"
✅ **Good:** "Session expires at 11:59pm"

---

## Inclusive Language

### Avoid Gendered Language

Use gender-neutral terms and pronouns.

✅ **Good:** "When a user submits the form, they receive confirmation."
❌ **Avoid:** "When a user submits the form, he receives confirmation."

### Avoid Ableist Language

Don't use disability as a metaphor.

✅ **Good:** "This feature isn't working as expected."
❌ **Avoid:** "This feature is crippled/broken/lame."

### Cultural Sensitivity

Be aware that idioms and metaphors don't translate universally.

✅ **Good:** "Complete all required fields before continuing."
❌ **Avoid:** "Touch base with all required fields before moving forward."

### Use Precise Technical Language

Avoid unnecessarily complex terms when simpler words work.

✅ **Good:** "Use this component for confirmation dialogs."
❌ **Avoid:** "Leverage this component to facilitate user confirmation workflows."

---

## Accessibility

### Alt Text for Images

Describe the content and function, not the image itself.

✅ **Good:** `alt="Button component with three variants: default, outline, and ghost"`
❌ **Avoid:** `alt="Screenshot of button variations"`

### Link Text

Use descriptive link text. Never "click here" or "read more."

✅ **Good:** "View the [Button component documentation](link)."
❌ **Avoid:** "Click [here](link) for more information."

### Error Messages

Be specific about what's wrong and how to fix it.

✅ **Good:** "Email is required. Enter your email address in the format name@example.com"
❌ **Avoid:** "Invalid input"

### Placeholder Text

Don't use placeholders as labels. Provide both.

✅ **Good:**
```tsx
<Label>Email address</Label>
<Input placeholder="name@example.com" />
```

❌ **Avoid:**
```tsx
<Input placeholder="Email address" />
```

---

## Quick Reference

### Do's
- ✅ Use active voice
- ✅ Address users as "you"
- ✅ Keep sentences under 25 words
- ✅ Use contractions naturally
- ✅ Use sentence case
- ✅ Use the Oxford comma
- ✅ Provide code examples
- ✅ Spell out one through nine
- ✅ Use inclusive language
- ✅ Write descriptive link text

### Don'ts
- ❌ Use passive voice unnecessarily
- ❌ Use jargon without explanation
- ❌ Write long, complex sentences
- ❌ Use title case for UI text
- ❌ Use exclamation points in errors
- ❌ Say "click here" or "read more"
- ❌ Use gendered pronouns
- ❌ Use ableist metaphors
- ❌ Rely on placeholders as labels
- ❌ Use vague words like "easy" or "simple"

---

## Examples in Context

### Component Documentation

**Good:**
```markdown
## Button

Use the Button component for actions that submit or confirm.

### When to use
- Primary actions (save, submit, confirm)
- Form submissions
- Standalone calls to action

### When not to use
- Navigation (use Link instead)
- Toggling state (use Toggle or Switch)
```

**Avoid:**
```markdown
## Button Component

The Button component is designed to facilitate user interaction
for various action-based workflows. It's extremely versatile and
can be utilized across numerous contexts.
```

### Error Message

**Good:**
```
Email is required
Enter your email address
```

**Avoid:**
```
Oops! Something went wrong!
Please fix the errors and try again.
```

### Empty State

**Good:**
```
No players yet
Add your first player to get started
[Add player button]
```

**Avoid:**
```
This list is currently empty
There are no players to display at this time
```

---

## Tone Matrix

| Context | Example | Tone |
|---------|---------|------|
| **Documentation** | "Import the component from `@/components/ui/button`" | Clear, direct |
| **Error** | "Email is required. Enter your email address." | Calm, specific |
| **Success** | "Player saved successfully" | Brief, positive |
| **Warning** | "Unsaved changes will be lost" | Honest, direct |
| **Empty state** | "No players yet. Add your first player." | Encouraging |
| **Loading** | "Loading players..." | Informative |
| **Tooltip** | "Filter by position" | Concise |
| **Help text** | "Choose the player's primary position" | Supportive |

---

## Maintenance

This style guide is a living document. As our design system evolves, so will our content guidelines.

**Questions?** Open a discussion in GitHub or reach out to the design system team.

**Suggestions?** Submit a pull request with your proposed changes.

---

**Last Updated:** November 5, 2024
**Version:** 1.0.0
