# Canvas/Whiteboard Tool - Comprehensive Testing Plan

**Generated:** 2025-11-13
**Status:** In Progress
**Application:** SimpleAM Tactical Whiteboard (Excalidraw Integration)

---

## Executive Summary

This document outlines a comprehensive testing strategy for the tactical whiteboard/canvas tool. Based on code analysis, several critical vulnerabilities and functional issues have been identified that require immediate attention before production release.

### Critical Issues Identified:
1. **Security Vulnerability:** `incrementTemplateDownloads()` lacks authentication
2. **Missing Data Validation:** No schema validation for Excalidraw data
3. **Performance Risk:** No pagination on drawing list (could load 10K+ items)
4. **Concurrent Edit Risk:** Last-write-wins with no conflict detection
5. **Missing Error Boundaries:** PDF export could fail silently

---

## 1. Test Environment Setup

### Prerequisites:
- ✅ Development server running on `http://localhost:3001`
- ✅ Chrome DevTools connected for debugging
- ✅ Database accessible (Prisma + PostgreSQL)
- ⚠️ Authentication required to access canvas

### Browser Testing Matrix:
- Chrome (primary - DevTools connected)
- Safari (secondary - macOS native)
- Firefox (secondary)
- Mobile browsers (future)

---

## 2. Critical Path Testing

### 2.1 Create Blank Drawing
**Priority:** HIGH
**User Flow:**
1. Navigate to `/dashboard/canvas`
2. Click "New Drawing" button
3. Select "Blank Canvas" option
4. Enter drawing name (required)
5. Enter description (optional)
6. Select type (Formation/Drill/Tactics/Set Piece/Session Plan)
7. Click "Create"
8. Verify redirect to `/dashboard/canvas/[id]`
9. Verify Excalidraw loads successfully

**Expected Results:**
- Drawing created in database
- Unique ID generated
- OrganizationId properly set
- CreatedBy matches current user
- Default Excalidraw data structure present

**Test Cases:**
```
TC-001: Create with minimum required fields (name only)
TC-002: Create with all fields populated
TC-003: Create with special characters in name (emoji, Unicode)
TC-004: Create with max length name (255 chars)
TC-005: Attempt create with empty name (should fail validation)
TC-006: Rapid creation (10 drawings in quick succession)
```

**Files to Monitor:**
- [app/actions/drawings.ts](app/actions/drawings.ts#L21-L71)
- [components/canvas/template-selector-dialog.tsx](components/canvas/template-selector-dialog.tsx#L155-L208)

---

### 2.2 Create Drawing from Template
**Priority:** HIGH
**User Flow:**
1. Navigate to `/dashboard/canvas`
2. Click "New Drawing"
3. Browse template tabs (All/Formations/Drills/Set Pieces)
4. Select a template
5. Preview loads (if implemented)
6. Enter name and metadata
7. Click "Create"
8. Verify template data copied to new drawing

**Expected Results:**
- Template data fully cloned (elements, appState, files)
- New drawing references `templateId`
- Template download counter incremented
- No mutation of original template

**Test Cases:**
```
TC-007: Create from formation template
TC-008: Create from drill template
TC-009: Create from set piece template
TC-010: Verify template data integrity after creation
TC-011: Verify template download counter increments
TC-012: Create multiple drawings from same template
```

**Known Issues:**
- ⚠️ `incrementTemplateDownloads()` has NO AUTH CHECK (security vulnerability)
- Any user can spam increment template downloads

**Files to Monitor:**
- [app/actions/drawing-templates.ts](app/actions/drawing-templates.ts#L152-L167)
- [components/canvas/template-selector-dialog.tsx](components/canvas/template-selector-dialog.tsx)

---

### 2.3 Auto-Save Functionality
**Priority:** CRITICAL
**Implementation:** 3-second debounce on drawing changes

**User Flow:**
1. Open existing drawing
2. Make modifications (add element, move, resize)
3. Wait 3 seconds without further changes
4. Verify auto-save triggers
5. Check "Unsaved changes" indicator disappears
6. Verify toast notification appears

**Expected Results:**
- Auto-save triggers exactly 3 seconds after last change
- Loading indicator shows during save
- Toast confirms success/failure
- Database updated with latest scene data
- No data loss on rapid edits

**Test Cases:**
```
TC-013: Single element addition triggers auto-save
TC-014: Rapid edits (10 changes in 10 seconds) - should trigger once
TC-015: Edit, wait 2.5s, edit again - debounce resets
TC-016: Auto-save during network failure
TC-017: Concurrent edits from multiple browser tabs
TC-018: Large drawing auto-save (1000+ elements)
TC-019: Auto-save with embedded images/files
```

**Edge Cases:**
- What happens if user navigates away during save?
- Does browser beforeunload prompt trigger?
- What if save fails due to 413 Payload Too Large?

**Files to Monitor:**
- [components/canvas/drawing-editor.tsx](components/canvas/drawing-editor.tsx#L120-L160)
- Network tab for `/api/drawings/update` calls

---

### 2.4 Manual Save
**Priority:** HIGH
**Trigger:** Header "Save" button

**Test Cases:**
```
TC-020: Manual save with unsaved changes
TC-021: Manual save with no changes (should skip)
TC-022: Manual save during active auto-save
TC-023: Manual save with network offline
TC-024: Save button disabled during save operation
```

---

### 2.5 Export Functionality
**Priority:** HIGH
**Formats:** PNG (1x/2x/4x), SVG, PDF

**User Flow:**
1. Open drawing with content
2. Click "Export" button
3. Select format
4. Configure options (scale, background color)
5. Click "Download"
6. Verify file downloads correctly

**Test Cases:**
```
TC-025: Export PNG at 1x scale
TC-026: Export PNG at 2x scale (high-res)
TC-027: Export PNG at 4x scale (print quality)
TC-028: Export SVG (vector)
TC-029: Export PDF landscape orientation
TC-030: Export PDF portrait orientation
TC-031: Export with background color enabled
TC-032: Export with background color disabled (transparent)
TC-033: Export blank drawing (edge case)
TC-034: Export large drawing (performance test)
TC-035: Export with special characters in filename
TC-036: Export with embedded images
```

**Known Issues:**
- ⚠️ jsPDF imported dynamically - could fail if package missing
- No error boundary for PDF export failures
- Filename sanitization may be incomplete

**Files to Monitor:**
- [components/canvas/export-dialog.tsx](components/canvas/export-dialog.tsx#L84-L225)
- Browser console for PDF generation errors
- Download folder for file output

---

### 2.6 Sport Toolbar Element Placement
**Priority:** MEDIUM
**Elements:** Pitch templates, players, equipment (cones, balls, goals)

**User Flow:**
1. Open drawing editor
2. Open sport toolbar sidebar
3. Click "Full Pitch" or "Half Pitch"
4. Verify pitch centered on canvas
5. Select team color (Blue/Red)
6. Click player icon
7. Verify player placed at canvas center
8. Repeat for cones, balls, goals

**Test Cases:**
```
TC-037: Place full pitch template
TC-038: Place half pitch template
TC-039: Add blue team player
TC-040: Add red team player
TC-041: Switch team colors and add player
TC-042: Add multiple players in sequence
TC-043: Add cone markers
TC-044: Add ball
TC-045: Add goal
TC-046: Verify elements at zoom level 50%
TC-047: Verify elements at zoom level 200%
TC-048: Verify elements after canvas pan
```

**Edge Cases:**
- Placement when canvas scrolled far from origin
- Placement at extreme zoom levels
- Multiple rapid clicks on toolbar buttons

**Files to Monitor:**
- [components/canvas/sport-toolbar.tsx](components/canvas/sport-toolbar.tsx#L47-L134)
- Excalidraw canvas state

---

### 2.7 Delete Drawing
**Priority:** HIGH
**Implementation:** Confirmation dialog before delete

**Test Cases:**
```
TC-049: Delete drawing - confirm dialog appears
TC-050: Delete - click "Cancel" (should abort)
TC-051: Delete - click "Delete" (should remove)
TC-052: Verify drawing removed from list
TC-053: Verify database soft-delete (if implemented)
TC-054: Attempt to access deleted drawing by URL
TC-055: Delete last drawing in list
TC-056: Delete drawing while it's open in another tab
```

**Security Test:**
```
TC-057: Attempt to delete another org's drawing (should fail)
TC-058: Attempt to delete without authentication
```

**Files to Monitor:**
- [app/actions/drawings.ts](app/actions/drawings.ts#L111-L140)
- [components/canvas/drawing-library.tsx](components/canvas/drawing-library.tsx)

---

### 2.8 Duplicate Drawing
**Priority:** MEDIUM
**Implementation:** Creates copy with "(Copy)" suffix

**Test Cases:**
```
TC-059: Duplicate drawing - verify "(Copy)" added to name
TC-060: Duplicate already duplicated drawing (handle "(Copy) (Copy)")
TC-061: Verify all drawing data cloned
TC-062: Verify original and copy are independent
TC-063: Duplicate with name at max length (255 chars)
TC-064: Rapid duplication (stress test)
```

**Files to Monitor:**
- [app/actions/drawings.ts](app/actions/drawings.ts#L142-L179)

---

### 2.9 Search and Filter
**Priority:** MEDIUM
**Features:** Search by name, filter by type

**Test Cases:**
```
TC-065: Search by exact name
TC-066: Search by partial name
TC-067: Search case-insensitive
TC-068: Search with special characters
TC-069: Filter by "Formation"
TC-070: Filter by "Drill"
TC-071: Filter by "Tactics"
TC-072: Filter by "Set Piece"
TC-073: Filter by "Session Plan"
TC-074: Combined search + filter
TC-075: Clear filters
TC-076: No results handling
```

**Files to Monitor:**
- [components/canvas/drawing-library.tsx](components/canvas/drawing-library.tsx#L71-L89)

---

## 3. Error Scenarios & Edge Cases

### 3.1 Boundary Testing

```
TC-077: Name with exactly 255 characters
TC-078: Name with 256 characters (should truncate or fail)
TC-079: Description with 10,000 characters
TC-080: Drawing with 0 elements (blank)
TC-081: Drawing with 10,000 elements (performance)
TC-082: Drawing with 50,000 elements (stress test)
TC-083: Excalidraw data size > 5MB
TC-084: Embedded image > 10MB in drawing
```

### 3.2 Data Integrity Testing

```
TC-085: Create drawing with malformed Excalidraw data
TC-086: Save drawing with invalid element types
TC-087: Save drawing with missing required fields
TC-088: Attempt to save null or undefined data
TC-089: Attempt to save non-object data (string, array)
```

### 3.3 Concurrent User Testing

```
TC-090: Two users edit same drawing simultaneously
TC-091: User A saves while User B is editing
TC-092: User A deletes drawing while User B has it open
TC-093: User A duplicates while User B is viewing list
TC-094: Multiple users create drawings rapidly
```

### 3.4 Network & Performance Testing

```
TC-095: Auto-save during network disconnect
TC-096: Manual save during network disconnect
TC-097: Export during network issues
TC-098: Load drawing with slow network (throttle to 3G)
TC-099: Load drawing list with 1000+ items
TC-100: Scroll performance with 500+ drawings
TC-101: Search performance with 1000+ drawings
```

### 3.5 Browser Compatibility Testing

```
TC-102: Full test suite on Chrome
TC-103: Full test suite on Safari
TC-104: Full test suite on Firefox
TC-105: Test on mobile Safari (iOS)
TC-106: Test on Chrome mobile (Android)
```

---

## 4. Security Testing

### 4.1 Authentication & Authorization

```
TC-107: Access canvas without login (should redirect)
TC-108: Access another org's drawing by URL manipulation
TC-109: Attempt to update another org's drawing
TC-110: Attempt to delete another org's drawing
TC-111: SQL injection in search field
TC-112: XSS attempt in drawing name
TC-113: XSS attempt in description
TC-114: CSRF attempt on create/update/delete
```

### 4.2 Data Validation

```
TC-115: Create drawing with JavaScript in name
TC-116: Create drawing with HTML in description
TC-117: Save drawing with malicious Excalidraw elements
TC-118: Embed SVG with script tags
TC-119: Embed data URI with JavaScript
```

### 4.3 Rate Limiting

```
TC-120: Create 100 drawings in 1 minute (should throttle or allow)
TC-121: Update same drawing 100 times in 1 minute
TC-122: Delete 50 drawings rapidly
TC-123: Increment template downloads 1000 times (VULNERABILITY)
```

---

## 5. Integration Testing

### 5.1 Global Search Integration

```
TC-124: Create drawing and verify it appears in global search
TC-125: Search for drawing by name in global search
TC-126: Click drawing from search results
TC-127: Update drawing name and verify search updates
TC-128: Delete drawing and verify removed from search
```

**Files to Monitor:**
- [components/global-search.tsx](components/global-search.tsx)

### 5.2 Sidebar Navigation

```
TC-129: Navigate to canvas from sidebar
TC-130: Verify "Canvas" menu item highlights when active
TC-131: Verify canvas icon displays correctly
```

**Files to Monitor:**
- [components/dashboard/app-sidebar.tsx](components/dashboard/app-sidebar.tsx)

### 5.3 Event/Plan Linking (Future)

```
TC-132: Link drawing to event (if implemented)
TC-133: Link drawing to training plan (if implemented)
TC-134: View linked drawings from event
TC-135: Delete event and verify drawing handling
```

---

## 6. Chrome DevTools Testing Protocol

### 6.1 Console Monitoring

**Monitor for:**
- JavaScript errors
- React warnings
- Network failures
- Unhandled promise rejections
- Excalidraw errors

**Commands to run:**
```javascript
// Check for memory leaks
performance.memory

// Monitor Excalidraw API
window.excalidrawAPI

// Check localStorage usage
Object.keys(localStorage)

// Monitor React state
// (requires React DevTools extension)
```

### 6.2 Network Monitoring

**Track:**
- API response times
- Failed requests (4xx, 5xx)
- Payload sizes
- Auto-save request frequency
- Duplicate/redundant requests

**Specific endpoints:**
- `POST /api/drawings/create`
- `PATCH /api/drawings/update`
- `DELETE /api/drawings/delete`
- `GET /api/drawings`
- `GET /api/drawing-templates`
- `POST /api/drawing-templates/increment`

### 6.3 Performance Profiling

**Metrics to capture:**
- Initial page load time
- Time to Interactive (TTI)
- Excalidraw initialization time
- Drawing render time (1000+ elements)
- Auto-save execution time
- Export generation time
- Search/filter response time

### 6.4 Memory Profiling

**Monitor:**
- Memory usage during extended editing session
- Memory leaks on repeated create/delete cycles
- Memory usage with large drawings
- Garbage collection frequency

---

## 7. Automated Testing Recommendations

### 7.1 Unit Tests Needed

```typescript
// Drawing Actions
describe('createDrawing', () => {
  test('creates with valid data')
  test('rejects without auth')
  test('rejects without organization')
  test('validates data is object')
  test('handles database errors')
})

describe('updateDrawing', () => {
  test('updates own drawing')
  test('rejects updating other org drawing')
  test('validates Excalidraw data structure')
  test('handles concurrent updates')
})

describe('deleteDrawing', () => {
  test('deletes own drawing')
  test('rejects deleting other org drawing')
  test('returns proper error messages')
})

// Drawing Editor
describe('DrawingEditor', () => {
  test('normalizes invalid Excalidraw data')
  test('triggers auto-save after 3 seconds')
  test('debounces rapid changes')
  test('shows unsaved changes indicator')
  test('exports to PNG/SVG/PDF')
})

// Sport Toolbar
describe('SportToolbar', () => {
  test('calculates canvas center correctly')
  test('places elements at center regardless of zoom')
  test('handles team color switching')
  test('creates valid Excalidraw elements')
})
```

### 7.2 Integration Tests Needed

```typescript
// End-to-end user flows
describe('Canvas E2E', () => {
  test('full creation flow: blank drawing')
  test('full creation flow: from template')
  test('edit and auto-save flow')
  test('duplicate flow')
  test('delete flow with confirmation')
  test('export all formats flow')
  test('search and filter flow')
})
```

### 7.3 Recommended Testing Frameworks

- **Unit Tests:** Jest + React Testing Library
- **Integration Tests:** Playwright or Cypress
- **API Tests:** Supertest
- **Performance Tests:** Lighthouse CI
- **Visual Regression:** Percy or Chromatic

---

## 8. Known Issues & Recommendations

### 🔴 Critical Issues (Fix Before Release)

1. **Security: `incrementTemplateDownloads()` Missing Auth**
   - Location: [app/actions/drawing-templates.ts:152](app/actions/drawing-templates.ts#L152)
   - Impact: Any user can spam increment downloads
   - Fix: Add authentication check

2. **Missing Data Validation**
   - Location: [app/actions/drawings.ts:44](app/actions/drawings.ts#L44)
   - Impact: Malformed data could crash Excalidraw
   - Fix: Add Zod schema validation

3. **No Pagination on Drawing List**
   - Location: [components/canvas/drawing-library.tsx](components/canvas/drawing-library.tsx)
   - Impact: Performance degradation with 1000+ drawings
   - Fix: Implement pagination or infinite scroll

### 🟡 High Priority Issues (Fix Soon)

4. **No Concurrent Edit Protection**
   - Location: [app/actions/drawings.ts:120](app/actions/drawings.ts#L120)
   - Impact: Last-write-wins, potential data loss
   - Fix: Add optimistic locking with `updatedAt` check

5. **PDF Export Error Handling**
   - Location: [components/canvas/export-dialog.tsx:128](components/canvas/export-dialog.tsx#L128)
   - Impact: Silent failures if jsPDF missing
   - Fix: Add error boundary and validation

6. **No Rate Limiting**
   - Location: All server actions
   - Impact: Potential DoS via rapid creates/updates
   - Fix: Implement request throttling

### 🟢 Medium Priority Issues (Address Later)

7. **Thumbnail Generation Not Implemented**
   - Database field exists but not used
   - Recommendation: Generate on save for better UX

8. **Share Functionality Incomplete**
   - UI shows "Coming Soon"
   - Database fields exist: `shareToken`, `isPublic`
   - Recommendation: Complete implementation

9. **AI Assistant is Mocked**
   - Currently shows hardcoded suggestions
   - Recommendation: Integrate real AI API

10. **No Storage Quota Limits**
    - JSON size unlimited
    - Recommendation: Add 5MB limit per drawing

---

## 9. Testing Execution Plan

### Phase 1: Smoke Testing (Day 1)
- [ ] Verify app starts without errors
- [ ] Verify authentication works
- [ ] Create one blank drawing
- [ ] Make one edit and verify save
- [ ] Delete test drawing
- **Duration:** 1 hour

### Phase 2: Critical Path Testing (Day 1-2)
- [ ] Execute TC-001 through TC-064 (critical user flows)
- [ ] Document all failures with screenshots
- [ ] Log console errors
- [ ] Track network issues
- **Duration:** 4-6 hours

### Phase 3: Edge Case & Error Testing (Day 2-3)
- [ ] Execute TC-065 through TC-101 (boundaries, errors, performance)
- [ ] Stress test with large datasets
- [ ] Test concurrent scenarios
- **Duration:** 4-6 hours

### Phase 4: Security Testing (Day 3)
- [ ] Execute TC-102 through TC-123 (security & auth)
- [ ] Attempt to exploit identified vulnerabilities
- [ ] Document security findings
- **Duration:** 3-4 hours

### Phase 5: Integration & Browser Testing (Day 4)
- [ ] Execute TC-124 through TC-135 (integrations)
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- **Duration:** 3-4 hours

### Phase 6: Reporting & Recommendations (Day 4-5)
- [ ] Compile all findings
- [ ] Categorize by severity
- [ ] Create bug tickets
- [ ] Provide recommendations
- **Duration:** 2-3 hours

**Total Estimated Duration:** 16-23 hours

---

## 10. Test Results Template

For each test case, document:

```markdown
### TC-XXX: [Test Name]

**Status:** ✅ Pass | ❌ Fail | ⚠️ Partial | ⏸️ Blocked
**Date Executed:** YYYY-MM-DD
**Browser:** Chrome 120.0.0
**Tester:** [Name]

**Steps Taken:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots/Evidence:**
[Attach images, console logs, network traces]

**Console Errors:**
```
[Error messages]
```

**Network Issues:**
- Request: POST /api/drawings
- Status: 500
- Response: {"error": "Failed to create drawing"}

**Notes:**
[Any additional observations]

**Severity:** Critical | High | Medium | Low
**Priority:** P0 | P1 | P2 | P3
**Bug Ticket:** [Link to issue tracker]
```

---

## 11. Success Criteria

The canvas/whiteboard tool is ready for production release when:

- ✅ All P0 (Critical) bugs resolved
- ✅ 95%+ of test cases passing
- ✅ No security vulnerabilities present
- ✅ Performance metrics meet targets:
  - Page load < 3 seconds
  - Auto-save < 500ms
  - Export < 2 seconds (1000 elements)
  - Search response < 100ms
- ✅ Cross-browser compatibility verified
- ✅ Mobile responsiveness confirmed
- ✅ Error handling comprehensive
- ✅ Data validation robust
- ✅ Authentication/authorization secure

---

## 12. Contact & Resources

**Documentation:**
- Excalidraw Docs: https://docs.excalidraw.com/
- Next.js Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Prisma Docs: https://www.prisma.io/docs

**Related Files:**
- [Drawing Actions](app/actions/drawings.ts)
- [Template Actions](app/actions/drawing-templates.ts)
- [Drawing Editor Component](components/canvas/drawing-editor.tsx)
- [Drawing Library Component](components/canvas/drawing-library.tsx)
- [Sport Toolbar](components/canvas/sport-toolbar.tsx)
- [Export Dialog](components/canvas/export-dialog.tsx)

**Database Schema:**
- Check `prisma/schema.prisma` for Drawing and DrawingTemplate models

---

## Appendix A: Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                     User Interface                        │
├──────────────────────────────────────────────────────────┤
│  DrawingLibrary → TemplateSelectorDialog → DrawingEditor │
│       ↓                    ↓                     ↓        │
│   List View          Create Dialog         Excalidraw    │
│   Search/Filter      Template Browse       Auto-Save     │
│   CRUD Actions       Metadata Input        Sport Toolbar │
│                                             Export        │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                  Server Actions (API)                     │
├──────────────────────────────────────────────────────────┤
│  createDrawing()      updateDrawing()    deleteDrawing() │
│  getDrawings()        getDrawing()       duplicateDrawing│
│  createTemplate()     getTemplates()     incrementDL()   │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                 Data Layer (Prisma ORM)                   │
├──────────────────────────────────────────────────────────┤
│  Drawing Model:                                           │
│  - id, name, description, type, tags, data (JSON)        │
│  - organizationId, createdBy, createdAt, updatedAt       │
│  - isPublic, shareToken, templateId                      │
│                                                            │
│  DrawingTemplate Model:                                   │
│  - id, name, category, sport, data (JSON)                │
│  - isGlobal, organizationId, downloads, rating           │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                     │
└──────────────────────────────────────────────────────────┘
```

---

## Appendix B: Test Data Requirements

### Seed Data Needed:

**Drawing Templates:**
- 5 Formation templates (global)
- 5 Drill templates (global)
- 3 Set Piece templates (global)
- 2 Tactics templates (global)
- 3 Organization-specific templates

**Test Drawings:**
- 1 blank drawing
- 1 minimal drawing (5 elements)
- 1 medium drawing (100 elements)
- 1 large drawing (1000 elements)
- 1 extra-large drawing (5000 elements)
- 50 drawings for pagination testing

**Test Users:**
- User A (Organization 1)
- User B (Organization 1) - for concurrent testing
- User C (Organization 2) - for access control testing

---

## Appendix C: Console Commands for Manual Testing

```javascript
// Get current drawing data
excalidrawAPI?.getSceneElements()

// Get app state
excalidrawAPI?.getAppState()

// Get files
excalidrawAPI?.getFiles()

// Trigger manual save
document.querySelector('[data-testid="save-button"]')?.click()

// Trigger export
document.querySelector('[data-testid="export-button"]')?.click()

// Check localStorage
console.table(Object.keys(localStorage))

// Check memory usage
console.log(performance.memory)

// Force garbage collection (Chrome with --enable-precise-memory-info)
if (window.gc) window.gc()

// Monitor network requests
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name.includes('drawings')) {
      console.log(entry.name, entry.duration);
    }
  }
});
observer.observe({ entryTypes: ['resource'] });
```

---

**End of Testing Plan**

---

**Next Steps:**
1. Review and approve this testing plan
2. Set up test environment with seed data
3. Execute Phase 1 (Smoke Testing)
4. Log into application to access canvas functionality
5. Begin systematic test execution
6. Document all findings
7. Create bug tickets for issues
8. Retest after fixes
9. Sign off for production release

**Questions for Product Team:**
1. What is the expected maximum number of drawings per organization?
2. What is the acceptable drawing data size limit?
3. Should we implement real-time collaboration in v1?
4. When will AI assistant integration be prioritized?
5. What are the mobile usage expectations?
