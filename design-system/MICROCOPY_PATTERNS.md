# Microcopy Patterns

**Last Updated:** 05 November 2024
**Purpose:** Standardized text patterns for common UI scenarios
**Inspired By:** IBM Carbon, GOV.UK Design System

---

## Table of Contents

1. [Button Labels](#button-labels)
2. [Error Messages](#error-messages)
3. [Success Messages](#success-messages)
4. [Warning Messages](#warning-messages)
5. [Confirmation Dialogs](#confirmation-dialogs)
6. [Empty States](#empty-states)
7. [Loading States](#loading-states)
8. [Form Fields](#form-fields)
9. [Tooltips](#tooltips)
10. [Navigation](#navigation)

---

## Button Labels

### Primary Actions

Use **verb + noun** pattern. Be specific about what happens.

✅ **Good Examples:**
- "Save changes"
- "Add player"
- "Create report"
- "Submit form"
- "Download CSV"

❌ **Avoid:**
- "Save" (alone)
- "Submit" (without context)
- "OK"
- "Yes" (in isolation)

### Secondary Actions

Provide clear alternatives to the primary action.

✅ **Good Examples:**
- "Cancel"
- "Go back"
- "Skip this step"
- "Save as draft"
- "Discard changes"

### Destructive Actions

Be explicit about what will be deleted or removed.

✅ **Good Examples:**
- "Delete player"
- "Remove from roster"
- "Clear all filters"
- "Reset to defaults"

❌ **Avoid:**
- "Delete" (alone)
- "Remove" (without object)
- "Are you sure?"

### Progressive Disclosure

Lead users through multi-step processes.

✅ **Good Examples:**
- "Continue"
- "Next step"
- "Finish setup"
- "Review and submit"
- "Back to player list"

---

## Error Messages

### Structure

**Pattern:** `[What's wrong] + [How to fix it]`

Always include:
1. What the error is
2. How to resolve it

### Form Validation Errors

#### Required Fields

```
❌ Email is required
✓ Enter your email address

❌ Name cannot be blank
✓ Enter the player's full name

❌ Please select a position
✓ Select the player's primary position
```

#### Format Errors

```
❌ Invalid email format
✓ Enter a valid email address (name@example.com)

❌ Wrong phone number
✓ Enter a 10-digit phone number (555-123-4567)

❌ Invalid date
✓ Enter a date in DD/MM/YYYY format
```

#### Length Constraints

```
❌ Too short
✓ Password must be at least 8 characters

❌ Exceeds character limit
✓ Bio must be 200 characters or fewer (currently 245)

❌ Invalid username
✓ Username must be 3-20 characters long
```

#### Range Errors

```
❌ Value out of range
✓ Age must be between 16 and 45

❌ Invalid height
✓ Height must be between 150cm and 220cm

❌ Number too high
✓ Enter a number between 1 and 99
```

### System Errors

#### Network Errors

```
Cannot connect to server
Check your internet connection and try again

Failed to load players
Refresh the page or try again in a few moments

Upload failed
Check your connection and try uploading again
```

#### Permission Errors

```
You don't have permission to delete players
Contact your team admin to request access

This action requires manager role
Ask your admin to change your permissions
```

#### Not Found

```
Player not found
The player may have been deleted or moved

Page not found
Check the URL or return to the dashboard
```

### Tone Guidelines

**Do:**
- Be specific about the problem
- Provide actionable solutions
- Stay calm and professional
- Use plain language

**Don't:**
- Blame the user
- Use jargon or error codes alone
- Use humor or levity
- Show exclamation points

---

## Success Messages

### Structure

**Pattern:** `[What succeeded] + [Next action (optional)]`

### Simple Confirmations

```
Player saved successfully

Changes saved

Email sent

File uploaded
```

### With Next Actions

```
Player added successfully
View player profile or add another

Report created
Download PDF or share via email

Password changed successfully
You can now log in with your new password

Player removed from roster
Undo this action or continue
```

### Progressive Actions

```
Step 1 of 3 complete
Continue to payment details

Profile updated
Your changes are now live

Import complete
12 players added to your roster
```

### Tone Guidelines

**Do:**
- Be brief and positive
- Confirm what happened
- Suggest logical next steps
- Use past tense

**Don't:**
- Be overly enthusiastic
- Use exclamation points excessively
- Add unnecessary detail
- Patronize ("Great job!")

---

## Warning Messages

### Structure

**Pattern:** `[What will happen] + [How to prevent it (optional)]`

### Unsaved Changes

```
Unsaved changes will be lost
Save your changes before leaving

You have unsaved changes
Save now or discard changes

Changes not saved
Save to keep your edits
```

### Destructive Actions

```
This action cannot be undone
All player data will be permanently deleted

Removing this player from the roster is permanent
This does not delete the player's account

Clearing all filters will reset your view
You'll need to reapply your filters
```

### System Warnings

```
Your session will expire in 5 minutes
Save your work to avoid losing changes

Storage space is running low
Delete unused files to free up space

This feature is in beta
Some functionality may change
```

### Tone Guidelines

**Do:**
- Be honest and direct
- Explain consequences clearly
- Provide options when possible
- Use future tense

**Don't:**
- Alarm unnecessarily
- Hide important information
- Use technical jargon
- Understate serious consequences

---

## Confirmation Dialogs

### Delete Confirmations

**Pattern:** Question + Consequence + Actions

```tsx
<AlertDialog>
  <AlertDialogTitle>
    Delete player?
  </AlertDialogTitle>
  <AlertDialogDescription>
    This will permanently delete Jordan Smith from your roster.
    This action cannot be undone.
  </AlertDialogDescription>
  <AlertDialogActions>
    <Button variant="outline">Cancel</Button>
    <Button variant="destructive">Delete player</Button>
  </AlertDialogActions>
</AlertDialog>
```

### Discard Changes

```tsx
<AlertDialog>
  <AlertDialogTitle>
    Discard unsaved changes?
  </AlertDialogTitle>
  <AlertDialogDescription>
    Your edits to Jordan Smith's profile haven't been saved.
    Leaving now will discard all changes.
  </AlertDialogDescription>
  <AlertDialogActions>
    <Button variant="outline">Continue editing</Button>
    <Button variant="destructive">Discard changes</Button>
  </AlertDialogActions>
</AlertDialog>
```

### Bulk Actions

```tsx
<AlertDialog>
  <AlertDialogTitle>
    Remove 5 players from roster?
  </AlertDialogTitle>
  <AlertDialogDescription>
    This will remove 5 selected players. Players will not be deleted,
    only removed from the current roster.
  </AlertDialogDescription>
  <AlertDialogActions>
    <Button variant="outline">Cancel</Button>
    <Button variant="destructive">Remove 5 players</Button>
  </AlertDialogActions>
</AlertDialog>
```

---

## Empty States

### Structure

**Pattern:** `[Current state] + [Action to take] + [Optional: Why it matters]`

### No Data Yet

```
No players yet
Add your first player to get started
[Add player button]

No reports created
Create your first wellness report
[Create report button]

No matches scheduled
Schedule a match to begin tracking performance
[Schedule match button]
```

### Filtered View (No Results)

```
No players match your filters
Try different search terms or clear filters
[Clear filters button]

No results for "goalkeeper"
Try searching for another position

0 matches found
Adjust your date range or search criteria
```

### No Permission

```
You don't have access to this section
Contact your team admin to request access

Players list unavailable
Ask your manager for player roster permissions
```

### Error State

```
Unable to load players
Check your connection and try again
[Retry button]

Something went wrong
Refresh the page or contact support
[Refresh button]
```

### Tone Guidelines

**Do:**
- Acknowledge the empty state
- Provide clear next steps
- Make primary action obvious
- Be encouraging

**Don't:**
- Make users feel like they failed
- Use humor
- Leave users without options
- Apologize excessively

---

## Loading States

### General Loading

```
Loading...
Loading players...
Loading report data...
Processing...
```

### Progress Indicators

```
Uploading... 45%
Importing players... 23 of 100
Generating report... Please wait
Syncing data...
```

### Skeleton Text

Use semantic placeholders:

```
Loading player information...
Preparing your dashboard...
Fetching latest results...
```

**Don't:**
- "Please wait..."
- "Hold on..."
- "Just a moment..."

---

## Form Fields

### Labels

Use sentence case. Be specific and clear.

✅ **Good:**
- "Player name"
- "Email address"
- "Primary position"
- "Date of birth"
- "Jersey number"

❌ **Avoid:**
- "Name" (too vague)
- "Email" (alone)
- "Position" (could mean role, location, etc.)

### Helper Text

Provide context before the user fills out the field.

```
Player name
Enter full name as it appears on official documents

Email address
We'll use this to send roster updates and reports

Jersey number
Must be between 1 and 99 (optional)

Password
Must be at least 8 characters with one number and one symbol
```

### Placeholder Text

Show format, not labels.

✅ **Good:**
- `placeholder="name@example.com"`
- `placeholder="DD/MM/YYYY"`
- `placeholder="Search players..."`

❌ **Avoid:**
- `placeholder="Email address"` (use label instead)
- `placeholder="Enter name here"` (obvious)

### Optional vs Required

Mark required fields clearly.

```tsx
// Required (default)
<Label>
  Email address <span className="text-destructive">*</span>
</Label>

// Optional (explicit)
<Label>
  Middle name <span className="text-muted-foreground">(optional)</span>
</Label>
```

---

## Tooltips

### Structure

Keep under 60 characters. Be concise.

✅ **Good:**
- "Filter by position"
- "Export as CSV"
- "Edit player details"
- "View full report"
- "Sort by date"

❌ **Avoid:**
- "Click here to filter the player list by their primary position"
- "You can export this data as a CSV file for use in other applications"

### Icon Tooltips

Describe the action, not the icon.

✅ **Good:**
- "Delete player"
- "Download report"
- "Share via email"

❌ **Avoid:**
- "Trash can"
- "Download icon"
- "Mail symbol"

### Abbreviations

Spell out abbreviations.

```
CSV → "Comma-separated values"
PDF → "Portable document format"
API → "Application programming interface"
```

---

## Navigation

### Menu Items

Use sentence case. Start with verbs when appropriate.

✅ **Good:**
- "Dashboard"
- "Player roster"
- "Wellness reports"
- "Settings"
- "Help and support"

❌ **Avoid:**
- "Home" (use "Dashboard")
- "Players List"
- "Reports Page"

### Breadcrumbs

Show hierarchy clearly.

```
Dashboard > Players > Jordan Smith > Edit profile

Reports > Wellness > Weekly report > March 15-22

Settings > Team > Roster management
```

### Links

Be specific about destination.

✅ **Good:**
- "View player profile"
- "See all wellness reports"
- "Read documentation"
- "Learn about pricing"

❌ **Avoid:**
- "Click here"
- "Read more"
- "Learn more"
- "See details"

---

## Quick Reference Matrix

| Context | Example | Length | Tone |
|---------|---------|--------|------|
| **Button** | "Save changes" | 1-3 words | Action-oriented |
| **Error** | "Email is required. Enter your email address." | 1-2 sentences | Calm, specific |
| **Success** | "Player saved successfully" | 1 sentence | Brief, positive |
| **Warning** | "Unsaved changes will be lost" | 1 sentence | Honest, direct |
| **Confirmation** | "Delete player? This action cannot be undone." | 2 sentences | Clear, serious |
| **Empty state** | "No players yet. Add your first player." | 2 sentences | Encouraging |
| **Loading** | "Loading players..." | 2-4 words | Informative |
| **Tooltip** | "Filter by position" | Under 60 chars | Concise |
| **Label** | "Email address" | 1-3 words | Clear, specific |
| **Helper** | "We'll send updates to this address" | 1 sentence | Supportive |

---

## Common Mistakes to Avoid

### ❌ Vague Buttons
```
"Submit" → "Submit application"
"Delete" → "Delete player"
"Save" → "Save changes"
```

### ❌ Apologizing Too Much
```
"Sorry, an error occurred" → "Cannot connect to server"
"We're sorry, but..." → "This feature is unavailable"
```

### ❌ Using Jargon
```
"API rate limit exceeded" → "Too many requests. Try again in 1 minute"
"400 Bad Request" → "Cannot process request. Check your input and try again"
```

### ❌ Passive Voice
```
"Your profile has been updated" → "Profile updated"
"The player was deleted" → "Player deleted"
```

### ❌ Unnecessary Words
```
"Please enter your email address" → "Enter your email address"
"Go ahead and click save" → "Save changes"
"Simply add a player" → "Add player"
```

---

## Testing Your Microcopy

Before finalizing any text, ask:

1. **Is it clear?** Can anyone understand it without context?
2. **Is it concise?** Have you removed all unnecessary words?
3. **Is it helpful?** Does it guide the user to the next step?
4. **Is it consistent?** Does it match our voice and tone?
5. **Is it accessible?** Will screen readers handle it well?

---

## Maintenance

This guide grows with our product. When you write new microcopy:

1. Check if a pattern exists here
2. If not, propose a new pattern
3. Submit a PR with examples
4. Update this guide

**Questions?** Open a GitHub discussion.
**Found a better way?** Submit a pull request.

---

**Last Updated:** November 5, 2024
**Version:** 1.0.0
