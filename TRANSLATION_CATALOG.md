# Translation Issues Catalog

**Generated:** 2025-11-11  
**Total Issues:** 974 user-facing hardcoded English strings  
**Files Affected:** 105 files

## Priority Levels

- **P0 (Critical):** User-facing dialogs, forms, error messages, main navigation
- **P1 (High):** Dashboard pages, tables, action buttons
- **P2 (Medium):** UI components, validation messages, tooltips
- **P3 (Low):** Test files, internal messages, developer-facing text

## P0 - Critical Components (User-Facing Dialogs & Forms)

### Form Components (45+ issues)
**File:** `components/dashboard/form-builder-dialog.tsx`
- Field types: "Text", "Text Area", "Number", "Rating", "Select", "Checkbox", "Date", "Time"
- Categories: "Health & Recovery", "Coaching", "Medical", "Education", "Performance", "General"
- Dialog titles: "Edit Form", "Create New Form"
- Labels: "Form Name", "Description", "Category", "Fields", "Add Field"
- Messages: "Loading form...", "No fields added yet", "Required", "Optional", "Field", "Preview"
- Buttons: "Save", "Cancel", "Delete", "Add Field"

**File:** `components/dashboard/form-distribution-dialog.tsx`
- Dialog title: "Distribute Form: {formName}"
- Labels: "Send To", "All Players", "Specific Players"
- Schedule options: "One Time", "Daily", "Weekly", "Monthly"
- Messages: "Choose who should receive this form and when to send it", "Failed to load players"

**File:** `components/dashboard/form-preview-dialog.tsx`
- Dialog title: "Preview: {form?.name || 'Form'}"
- Messages: "This is how the form will appear to users...", "Loading form...", "Form not found", "This form has no fields yet"
- Button: "Submit (Preview)", "Close"

**File:** `components/calendar/event-form-dialog.tsx`
- Validation messages: "Title is required", "Title is too long", "Invalid time format", "End time must be after start time"
- Event types: "Training", "Match", "Medical", "Meeting", "Other"
- Recurrence options: "Daily", "Weekly", "Monthly", "Never", "Until", "Count"
- Days of week: "Monday", "Tuesday", etc.

**File:** `components/calendar/event-detail-dialog.tsx`
- Event type labels, action buttons, status messages

### Profile & Settings (80+ issues)
**File:** `app/dashboard/profile/tabs/preferences-tab.tsx` (52 issues)
- Date formats: "DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"
- Time formats: "12-hour", "24-hour"
- Timezone labels: "UTC (Coordinated Universal Time)", timezone names
- Language options

**File:** `app/dashboard/profile/tabs/security-tab.tsx` (15 issues)
- Validation: "Current password is required", "Password must be at least 8 characters", "Passwords don't match"
- Success: "Password changed successfully"
- Error messages

**File:** `app/dashboard/profile/tabs/profile-tab.tsx` (13 issues)
- Form labels, validation messages

### Authentication (15+ issues)
**File:** `app/(auth)/login/page.tsx` (11 issues)
- Page titles, form labels, error messages

**File:** `app/(auth)/signup/page.tsx` (4 issues)
- Signup form labels, validation

## P1 - High Priority (Dashboard Pages & Tables)

### Calendar Pages (48+ issues)
**File:** `app/dashboard/calendar/events/[eventId]/page.tsx` (39 issues)
- Error messages: "Failed to load event", "Event deleted successfully", "Failed to delete event"
- Success messages, action confirmations

**File:** `app/dashboard/calendar/calendar-client.tsx` (9 issues)
- Calendar view labels, navigation

### Spreadsheet Pages (37+ issues)
**File:** `app/dashboard/spreadsheets/[id]/page.tsx` (19 issues)
- Error messages: "Failed to load spreadsheet"
- Success: "Spreadsheet saved", "Manual save"
- Column labels: "Column 1", "Column 2"

**File:** `app/dashboard/spreadsheets/page.tsx` (18 issues)
- Error messages, success messages, default column names

### Player Pages (17+ issues)
**File:** `app/dashboard/players/[id]/page.tsx` (15 issues)
- Status labels: "Available", "Injured", "Suspended", "Inactive", "Unknown"
- Page sections, action buttons

### Forms Table (24 issues)
**File:** `components/dashboard/forms-table.tsx`
- CSS class strings (false positives), but also real text in tooltips/aria-labels

## P2 - Medium Priority (UI Components & Actions)

### Server Actions (195+ issues)
**Files:** `app/actions/*.ts`
- Error messages: "Not authenticated", "Failed to fetch...", "Error creating...", "Not found"
- Success messages, validation errors
- These are shown to users via toast notifications

### Data Table Components (30+ issues)
- Bulk actions, column manager, export dialogs
- Inline actions, tooltips

### UI Components (100+ issues)
- Sidebar, charts, carousel, pagination
- Form components, dialogs, alerts
- Many are aria-labels and accessibility text that should be translated

## P3 - Low Priority

### Test Files (49 issues)
**File:** `tests/e2e/a11y-components.spec.ts`
- Test descriptions, component names in tests

## Long-Term Plan

### Phase 1: Critical User-Facing Components (Week 1)
1. ✅ Forms table - COMPLETED
2. ✅ Players table - COMPLETED  
3. ✅ Calendar toolbar - COMPLETED
4. ⏳ Form builder dialog - IN PROGRESS
5. ⏳ Form distribution dialog
6. ⏳ Form preview dialog
7. ⏳ Event form dialog
8. ⏳ Event detail dialog

### Phase 2: Profile & Settings (Week 2)
1. Preferences tab
2. Security tab
3. Profile tab
4. Notifications tab

### Phase 3: Dashboard Pages (Week 3)
1. Calendar event pages
2. Spreadsheet pages
3. Player detail pages
4. Other dashboard pages

### Phase 4: Server Actions & Error Messages (Week 4)
1. Update all server action error messages
2. Add translation keys for all toast messages
3. Update validation messages

### Phase 5: UI Components (Week 5)
1. Data table components
2. Form components
3. Dialog components
4. Accessibility labels

## Automated Testing Strategy

### CI/CD Integration
1. Run translation audit on every PR
2. Fail build if new hardcoded English text is introduced
3. Generate report and attach to PR

### Pre-commit Hooks
1. Run quick audit before commit
2. Warn about hardcoded text
3. Option to auto-fix common patterns

### Regular Audits
1. Weekly automated audit
2. Monthly comprehensive review
3. Quarterly translation completeness check

