# Manual Test Checklists

Use these checklists after significant releases or when automation flags regressions. Each checklist references journeys from the Experience Charter. Record outcomes and notes in the release journal.  
Status: Checklists drafted (2024-11-14); no manual runs yet logged.

## 1. Create Automation
- [ ] Sign in via primary account and land on dashboard.
- [ ] Start new automation; confirm default fields pre-populate correctly.
- [ ] Configure trigger + action using drag-and-drop; verify visual state updates.
- [ ] Save automation and confirm success toast + list refresh.
- [ ] Refresh browser; ensure new automation persists.

## 2. Edit Automation
- [ ] Open existing automation; confirm settings load without delay.
- [ ] Modify logic (add/remove step) and preview updates live.
- [ ] Validate error handling by intentionally breaking validation (e.g., missing required field).
- [ ] Save changes; confirm success toast and updated data.
- [ ] Reopen automation to ensure edits persisted.

## 3. Dashboard Insight
- [ ] Navigate to analytics dashboard.
- [ ] Switch date range and filters; confirm charts re-render.
- [ ] Inspect tooltips for accurate values and alignment.
- [ ] Validate empty-state handling by applying filters with no data.
- [ ] Capture screenshot if any visual anomalies appear.

## 4. Collaboration Workflow
- [ ] Invite collaborator via email; confirm invite sent toast.
- [ ] Accept invite (use alternate browser/profile) and confirm role assignment.
- [ ] Leave comment/annotation; verify it appears immediately for both users.
- [ ] Check notification settings to confirm corresponding alerts toggled correctly.

## 5. Template Publish
- [ ] Duplicate existing template; ensure fields copy correctly.
- [ ] Customize text/media and preview final state.
- [ ] Publish template and confirm public link works in incognito window.
- [ ] Validate template listing updates (thumbnail/title) in dashboard.

## 6. Mobile Review
- [ ] Switch browser to mobile viewport (DevTools > iPhone/Android).
- [ ] Open automation summary; confirm layout adapts without overflow.
- [ ] Toggle activation state; confirm toast and persisted status after refresh.

## 7. Theme Toggle
- [ ] Switch between light/dark themes on key pages (dashboard, editor).
- [ ] Ensure charts, text, and icons remain legible.
- [ ] Check persisted preference after reload.

## 8. Notification Settings
- [ ] Update notification preferences and save.
- [ ] Trigger related event (e.g., comment) to confirm new preference takes effect.
- [ ] Sign out/in; verify settings persist.

## 9. Auth Session
- [ ] Simulate expired session (open tab overnight or manually clear token).
- [ ] Attempt protected action; confirm re-auth prompt appears.
- [ ] Re-authenticate without losing unsaved data.

## 10. Help & Support
- [ ] Access help resources from main navigation.
- [ ] Submit feedback form; confirm confirmation message/email.
- [ ] Ensure navigation allows return to previous workflow without dead ends.

### Notes
- Record anomalies, screenshots, or Loom links directly under each checklist section in the release journal.
- If manual discovery surfaces new risks, update the Experience Charter and create corresponding automation prompts.
