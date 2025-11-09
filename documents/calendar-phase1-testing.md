# Calendar Phase 1 - Testing Documentation

## Overview
This document outlines the testing procedures for Phase 1 of the Calendar implementation.

## What Was Built in Phase 1

### 1. Server Actions (`/app/actions/events.ts`)
- ✅ `getEvents()` - Fetch all events for organization
- ✅ `getEvent(id)` - Fetch single event with details
- ✅ `createEvent(data)` - Create new event
- ✅ `updateEvent(id, data)` - Update existing event
- ✅ `deleteEvent(id)` - Delete event
- ✅ `updateAttendance(eventId, personOrgId, status, notes)` - Update attendance
- ✅ `getOrganizationPlayers()` - Get players for attendee selection

### 2. Calendar Component (`/components/calendar/event-calendar.tsx`)
- ✅ React Big Calendar integration
- ✅ Month/Week/Day views with toggle
- ✅ Custom toolbar with navigation
- ✅ Color-coded events by type:
  - Blue: Training
  - Green: Match
  - Red: Medical
  - Purple: Meeting
  - Gray: Other
- ✅ Event click handler
- ✅ Slot selection for quick event creation
- ✅ Responsive dark mode support

### 3. Event Form Dialog (`/components/calendar/event-form-dialog.tsx`)
- ✅ Create and Edit modes
- ✅ Form validation with Zod
- ✅ Fields:
  - Title (required)
  - Type (training/match/medical/meeting/other)
  - Start Date & Time
  - End Date & Time
  - Location (optional)
  - Description (optional)
- ✅ Time validation (end must be after start)
- ✅ Date picker integration
- ✅ Loading states
- ✅ Error handling with toast notifications

### 4. Event Detail Dialog (`/components/calendar/event-detail-dialog.tsx`)
- ✅ Overview tab with event details
- ✅ Attendance summary statistics
- ✅ Placeholder tabs for Phase 4:
  - Spreadsheets
  - Notes
  - Drawings
  - Forms
  - Files
  - Attendance list
- ✅ Edit and Delete buttons
- ✅ Badge for event type and recurring status
- ✅ Attendee list with avatars and status badges

### 5. Main Calendar Page (`/app/dashboard/calendar/page.tsx`)
- ✅ Integration of all components
- ✅ Event loading from database
- ✅ Create event via "New Event" button
- ✅ Create event via calendar slot selection
- ✅ Edit event from detail view
- ✅ Delete event with confirmation dialog
- ✅ Real-time updates after CRUD operations
- ✅ Loading states

## Setup for Testing

### 1. Database Setup
Ensure your database is configured and migrated:
```bash
npm run db:push
```

### 2. Seed Calendar Data
```bash
npx tsx prisma/seed-calendar.ts
```

This will create:
- 15+ sample events across past, present, and future
- Various event types (training, matches, meetings, medical)
- Sample attendance data for some events

### 3. Start Development Server
```bash
npm run dev
```

## Test Cases

### TC1: View Calendar
**Steps:**
1. Navigate to `/dashboard/calendar`
2. Observe the calendar loads with events

**Expected Results:**
- Calendar displays in month view by default
- Events appear on their respective dates
- Events are color-coded by type
- Loading state appears briefly before events load

**Status:** ✅ PASS / ❌ FAIL

---

### TC2: Switch Calendar Views
**Steps:**
1. On calendar page, click "Week" button
2. Verify week view displays
3. Click "Day" button
4. Verify day view displays
5. Click "Month" button to return

**Expected Results:**
- Each view change happens smoothly
- Events display correctly in all views
- Time slots are visible in Week and Day views
- Current time indicator shows in Day/Week views

**Status:** ✅ PASS / ❌ FAIL

---

### TC3: Navigate Between Months/Weeks/Days
**Steps:**
1. Use left/right arrows to navigate
2. Click "Today" button

**Expected Results:**
- Navigation updates the calendar view
- Events load for the new time period
- "Today" button returns to current date
- Month/week/day label updates correctly

**Status:** ✅ PASS / ❌ FAIL

---

### TC4: Create Event - New Event Button
**Steps:**
1. Click "New Event" button in header
2. Fill in event details:
   - Title: "Test Training Session"
   - Type: "Training"
   - Start Date: Tomorrow
   - Start Time: 09:00
   - End Time: 11:00
   - Location: "Test Ground"
   - Description: "Test description"
3. Click "Create Event"

**Expected Results:**
- Form opens with empty fields
- Validation prevents submission if required fields empty
- Success toast appears
- Dialog closes
- New event appears on calendar
- Event has correct blue color (training type)

**Status:** ✅ PASS / ❌ FAIL

---

### TC5: Create Event - Calendar Slot Selection
**Steps:**
1. In week or day view, click on a time slot
2. Verify form opens with pre-filled start/end times
3. Add title and type
4. Submit

**Expected Results:**
- Form opens automatically
- Start and end times match the selected slot
- Event creates successfully
- Event appears in correct time slot

**Status:** ✅ PASS / ❌ FAIL

---

### TC6: View Event Details
**Steps:**
1. Click on any event in the calendar
2. Observe event detail dialog

**Expected Results:**
- Dialog opens with event information
- Overview tab shows:
  - Event title and type badge
  - Date, time, location
  - Description if present
  - Attendance summary (Total/Attending/Absent/Invited)
- All tabs are present
- Edit and Delete buttons visible

**Status:** ✅ PASS / ❌ FAIL

---

### TC7: Edit Event
**Steps:**
1. Click on an event to open details
2. Click Edit button
3. Modify title, time, or other fields
4. Click "Update Event"

**Expected Results:**
- Edit form opens with current values pre-filled
- Changes save successfully
- Success toast appears
- Event updates on calendar
- Event detail dialog closes

**Status:** ✅ PASS / ❌ FAIL

---

### TC8: Delete Event
**Steps:**
1. Click on an event to open details
2. Click Delete button
3. Confirm deletion in alert dialog

**Expected Results:**
- Confirmation dialog appears
- After confirming, success toast shows
- Event disappears from calendar
- Dialog closes

**Status:** ✅ PASS / ❌ FAIL

---

### TC9: Form Validation
**Steps:**
1. Open create event form
2. Try submitting without title
3. Try setting end time before start time
4. Enter invalid time format

**Expected Results:**
- "Title is required" error shows
- "End time must be after start time" error shows
- Form prevents submission with validation errors
- Error messages are clear and helpful

**Status:** ✅ PASS / ❌ FAIL

---

### TC10: Event Type Colors
**Steps:**
1. Create or view events of each type:
   - Training (blue)
   - Match (green)
   - Medical (red)
   - Meeting (purple)
   - Other (gray)

**Expected Results:**
- Each event type displays with correct color
- Colors are distinguishable in light and dark mode
- Color coding is consistent across month/week/day views

**Status:** ✅ PASS / ❌ FAIL

---

### TC11: Responsive Design
**Steps:**
1. Resize browser window to mobile size (< 640px)
2. Test all interactions on mobile

**Expected Results:**
- Calendar remains functional on mobile
- Dialogs are scrollable
- Buttons remain accessible
- Tab labels adjust for small screens

**Status:** ✅ PASS / ❌ FAIL

---

### TC12: Dark Mode
**Steps:**
1. Toggle dark mode (if available in app)
2. Verify calendar appearance

**Expected Results:**
- All calendar elements adapt to dark mode
- Event colors remain visible and distinguishable
- Text has sufficient contrast
- Borders and backgrounds update correctly

**Status:** ✅ PASS / ❌ FAIL

---

### TC13: Attendance Display
**Steps:**
1. Click on event with attendees
2. Go to Attendance tab
3. Verify attendee list

**Expected Results:**
- Attendees show with avatar, name, position, jersey number
- Status badges display correct color:
  - Invited (gray)
  - Attending (green)
  - Absent (red)
  - Excused (yellow)
- Attendance summary shows correct counts

**Status:** ✅ PASS / ❌ FAIL

---

### TC14: Empty States
**Steps:**
1. Navigate to a future month with no events
2. Try accessing placeholder tabs (Spreadsheets, Notes, etc.)

**Expected Results:**
- Calendar displays cleanly with no events
- Placeholder tabs show helpful messages
- "Integration coming in Phase 4" note displays

**Status:** ✅ PASS / ❌ FAIL

---

### TC15: Error Handling
**Steps:**
1. Attempt to create event with network disconnected (if possible)
2. Try editing a non-existent event

**Expected Results:**
- Error toast displays with helpful message
- User remains on current screen
- No data loss occurs

**Status:** ✅ PASS / ❌ FAIL

---

## Performance Testing

### P1: Large Event Set
**Steps:**
1. Create 50+ events
2. Navigate through calendar

**Expected Results:**
- Calendar remains responsive
- No lag when switching views
- Events render quickly

**Status:** ✅ PASS / ❌ FAIL

---

### P2: Form Submission Speed
**Steps:**
1. Create event and measure time from submit to success

**Expected Results:**
- Event creates in < 2 seconds
- Loading indicator shows during submission
- UI remains responsive

**Status:** ✅ PASS / ❌ FAIL

---

## Accessibility Testing

### A1: Keyboard Navigation
**Steps:**
1. Navigate calendar using only keyboard
2. Create/edit event using keyboard
3. Tab through all interactive elements

**Expected Results:**
- All buttons and inputs are keyboard accessible
- Focus indicators are visible
- Dialogs can be closed with Escape key
- Tab order is logical

**Status:** ✅ PASS / ❌ FAIL

---

### A2: Screen Reader
**Steps:**
1. Use screen reader (if available)
2. Navigate through calendar

**Expected Results:**
- Events are announced with title and time
- Buttons have descriptive labels
- Form fields have associated labels
- Error messages are announced

**Status:** ✅ PASS / ❌ FAIL

---

## Known Limitations (Phase 1)

These features are intentionally deferred to later phases:

### Deferred to Phase 2 (Templates):
- ❌ Event templates (Match Day, Training Session, etc.)
- ❌ Template marketplace
- ❌ Pre-configured sections per template

### Deferred to Phase 3 (Attendance & Recurrence):
- ❌ Editing attendance status
- ❌ Marking attendance after events
- ❌ Recurring events (rrule integration)
- ❌ Recurring event editing
- ❌ Attendance reports

### Deferred to Phase 4 (Integration):
- ❌ Link spreadsheets to events
- ❌ Link notes to events
- ❌ Link forms to events
- ❌ Link drawings/canvas to events
- ❌ Link files to events
- ❌ Form triggers (auto-send after events)
- ❌ AI event creation
- ❌ External calendar sync (Google/Outlook)
- ❌ iCal export

## Bug Tracking

### Critical Bugs
| ID | Description | Steps to Reproduce | Status |
|----|-------------|-------------------|---------|
|    |             |                   |         |

### Minor Bugs
| ID | Description | Steps to Reproduce | Status |
|----|-------------|-------------------|---------|
|    |             |                   |         |

### Enhancement Requests
| ID | Description | Priority |
|----|-------------|----------|
|    |             |          |

## Sign-off

### Phase 1 Completion Criteria
- [ ] All TC1-TC15 test cases pass
- [ ] No critical bugs
- [ ] Performance is acceptable (P1-P2 pass)
- [ ] Basic accessibility requirements met (A1-A2 pass)
- [ ] Code compiles without errors
- [ ] Documentation complete

**Tested By:** _________________
**Date:** _________________
**Status:** ✅ APPROVED / ❌ NEEDS WORK
**Notes:**

---

## Next Steps
After Phase 1 approval, proceed to:
1. **Phase 2**: Event Templates System
2. **Phase 3**: Attendance Management & Recurring Events
3. **Phase 4**: Module Integration & Advanced Features
