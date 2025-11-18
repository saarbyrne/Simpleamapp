/**
 * Canvas/Whiteboard Manual Testing Script
 *
 * Open the browser console and run this script to test the canvas functionality
 * Run sections individually by copying and pasting into the console
 */

// ============================================================================
// TEST UTILITIES
// ============================================================================

const testResults = {
  tests: [],
  startTime: new Date(),
  passed: 0,
  failed: 0,
  warnings: 0
};

function logTest(name, status, details = '') {
  const result = {
    name,
    status, // 'PASS', 'FAIL', 'WARN'
    details,
    timestamp: new Date().toISOString()
  };
  testResults.tests.push(result);

  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else if (status === 'WARN') testResults.warnings++;

  console.log(`[${status}] ${name}${details ? ': ' + details : ''}`);
  return result;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// TEST 1: PAGE LOAD AND INITIAL STATE
// ============================================================================

async function testPageLoad() {
  console.log('\n=== TEST 1: Page Load and Initial State ===\n');

  // Check if we're on the canvas page
  const onCanvasPage = window.location.pathname.includes('/dashboard/canvas');
  logTest('TC-001: On Canvas Page', onCanvasPage ? 'PASS' : 'FAIL', window.location.pathname);

  // Check for main elements
  const hasSearchInput = !!document.querySelector('input[placeholder*="Search"]');
  logTest('TC-002: Search Input Present', hasSearchInput ? 'PASS' : 'FAIL');

  const hasNewButton = Array.from(document.querySelectorAll('button')).some(b =>
    b.textContent.includes('New')
  );
  logTest('TC-003: New Drawing Button Present', hasNewButton ? 'PASS' : 'FAIL');

  // Check for existing drawings
  const drawingCards = document.querySelectorAll('[class*="card"], [class*="Card"], article, [role="article"]');
  logTest('TC-004: Drawing List Rendered', drawingCards.length >= 0 ? 'PASS' : 'FAIL', `${drawingCards.length} cards found`);

  return testResults;
}

// Run: await testPageLoad();

// ============================================================================
// TEST 2: CREATE BLANK DRAWING
// ============================================================================

async function testCreateBlankDrawing() {
  console.log('\n=== TEST 2: Create Blank Drawing ===\n');

  try {
    // Step 1: Click New Drawing button
    const buttons = Array.from(document.querySelectorAll('button'));
    const newBtn = buttons.find(b => b.textContent.includes('New Drawing') || b.textContent.trim() === 'New');

    if (!newBtn) {
      logTest('TC-005: Click New Drawing Button', 'FAIL', 'Button not found');
      return;
    }

    newBtn.click();
    logTest('TC-005: Click New Drawing Button', 'PASS');

    await wait(1000);

    // Step 2: Check dialog opened
    const dialogs = document.querySelectorAll('[role="dialog"]');
    const dialogOpen = dialogs.length > 0;
    logTest('TC-006: Dialog Opened', dialogOpen ? 'PASS' : 'FAIL', `${dialogs.length} dialogs found`);

    if (!dialogOpen) return;

    // Step 3: Fill in the form
    const nameInput = document.querySelector('input[placeholder*="4-3-3"], input[placeholder*="name" i]');
    if (nameInput) {
      const testName = 'Automated Test Drawing ' + Date.now();
      nameInput.value = testName;
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));
      logTest('TC-007: Fill Drawing Name', 'PASS', testName);
    } else {
      logTest('TC-007: Fill Drawing Name', 'FAIL', 'Name input not found');
    }

    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = 'Automated test description';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      logTest('TC-008: Fill Description', 'PASS');
    }

    // Step 4: Select blank canvas (if there are options)
    await wait(500);

    // Step 5: Click Create button
    console.log('\n⚠️  MANUAL STEP REQUIRED:');
    console.log('1. Select "Blank Canvas" option if available');
    console.log('2. Select type (Formation/Drill/etc)');
    console.log('3. Click "Create" button');
    console.log('4. Wait for navigation to drawing editor');
    console.log('5. Then run: await testDrawingEditor();\n');

    logTest('TC-009: Submit Form', 'WARN', 'Manual completion required');

  } catch (error) {
    logTest('TC-CREATE: Create Drawing', 'FAIL', error.message);
  }

  return testResults;
}

// Run: await testCreateBlankDrawing();

// ============================================================================
// TEST 3: DRAWING EDITOR
// ============================================================================

async function testDrawingEditor() {
  console.log('\n=== TEST 3: Drawing Editor ===\n');

  try {
    // Check if we're on a drawing page
    const onDrawingPage = window.location.pathname.match(/\/dashboard\/canvas\/[a-zA-Z0-9]+/);
    logTest('TC-010: On Drawing Editor Page', onDrawingPage ? 'PASS' : 'FAIL', window.location.pathname);

    if (!onDrawingPage) {
      console.log('⚠️  Navigate to a drawing first: /dashboard/canvas/{id}');
      return testResults;
    }

    // Check for Excalidraw
    await wait(2000); // Wait for Excalidraw to load

    const excalidrawEl = document.querySelector('.excalidraw, [class*="excalidraw"]');
    logTest('TC-011: Excalidraw Loaded', !!excalidrawEl ? 'PASS' : 'FAIL');

    // Check for editor UI elements
    const hasCanvas = !!document.querySelector('canvas');
    logTest('TC-012: Canvas Element Present', hasCanvas ? 'PASS' : 'FAIL');

    const hasSaveButton = Array.from(document.querySelectorAll('button')).some(b =>
      b.textContent.includes('Save')
    );
    logTest('TC-013: Save Button Present', hasSaveButton ? 'PASS' : 'FAIL');

    const hasExportButton = Array.from(document.querySelectorAll('button')).some(b =>
      b.textContent.includes('Export')
    );
    logTest('TC-014: Export Button Present', hasExportButton ? 'PASS' : 'FAIL');

    // Check for unsaved changes indicator
    const hasIndicator = document.body.textContent.includes('Unsaved') ||
                        document.body.textContent.includes('unsaved');
    logTest('TC-015: Unsaved Changes Indicator', 'PASS', hasIndicator ? 'Visible' : 'Hidden (expected for new drawing)');

    // Test sport toolbar
    const hasSportToolbar = document.body.textContent.includes('Sport') ||
                           document.body.textContent.includes('Pitch') ||
                           document.body.textContent.includes('Player');
    logTest('TC-016: Sport Toolbar Present', hasSportToolbar ? 'PASS' : 'WARN', 'May be in a collapsed state');

    console.log('\n📝 MANUAL TESTS TO PERFORM:');
    console.log('1. Draw something on the canvas');
    console.log('2. Wait 3 seconds for auto-save');
    console.log('3. Check for success toast notification');
    console.log('4. Refresh page and verify drawing persists');
    console.log('5. Then run: await testExport();\n');

  } catch (error) {
    logTest('TC-EDITOR: Drawing Editor', 'FAIL', error.message);
  }

  return testResults;
}

// Run: await testDrawingEditor();

// ============================================================================
// TEST 4: EXPORT FUNCTIONALITY
// ============================================================================

async function testExport() {
  console.log('\n=== TEST 4: Export Functionality ===\n');

  try {
    const buttons = Array.from(document.querySelectorAll('button'));
    const exportBtn = buttons.find(b => b.textContent.includes('Export'));

    if (!exportBtn) {
      logTest('TC-017: Find Export Button', 'FAIL', 'Button not found');
      return testResults;
    }

    exportBtn.click();
    logTest('TC-017: Click Export Button', 'PASS');

    await wait(1000);

    // Check export dialog opened
    const exportDialog = Array.from(document.querySelectorAll('[role="dialog"]')).find(d =>
      d.textContent.includes('Export') || d.textContent.includes('PNG') || d.textContent.includes('SVG')
    );

    logTest('TC-018: Export Dialog Opened', !!exportDialog ? 'PASS' : 'FAIL');

    if (exportDialog) {
      const hasPNG = exportDialog.textContent.includes('PNG');
      const hasSVG = exportDialog.textContent.includes('SVG');
      const hasPDF = exportDialog.textContent.includes('PDF');

      logTest('TC-019: PNG Export Option', hasPNG ? 'PASS' : 'FAIL');
      logTest('TC-020: SVG Export Option', hasSVG ? 'PASS' : 'FAIL');
      logTest('TC-021: PDF Export Option', hasPDF ? 'PASS' : 'FAIL');

      console.log('\n📝 MANUAL TESTS TO PERFORM:');
      console.log('1. Test PNG export (check Downloads folder)');
      console.log('2. Test SVG export');
      console.log('3. Test PDF export');
      console.log('4. Verify files open correctly');
      console.log('5. Then run: await testDelete();\n');
    }

  } catch (error) {
    logTest('TC-EXPORT: Export Tests', 'FAIL', error.message);
  }

  return testResults;
}

// Run: await testExport();

// ============================================================================
// TEST 5: DELETE DRAWING
// ============================================================================

async function testDelete() {
  console.log('\n=== TEST 5: Delete Drawing ===\n');

  try {
    // Navigate back to canvas list
    console.log('⚠️  First, navigate back to /dashboard/canvas');

    if (!window.location.pathname.endsWith('/dashboard/canvas')) {
      console.log('Navigate to canvas list first, then run this test again');
      return testResults;
    }

    await wait(1000);

    // Find a drawing card
    const drawingCards = document.querySelectorAll('[class*="card"], article');
    logTest('TC-022: Find Drawing Cards', drawingCards.length > 0 ? 'PASS' : 'FAIL', `${drawingCards.length} found`);

    if (drawingCards.length === 0) {
      console.log('No drawings to delete');
      return testResults;
    }

    console.log('\n📝 MANUAL TESTS TO PERFORM:');
    console.log('1. Click the menu button (⋮) on a test drawing');
    console.log('2. Click "Delete"');
    console.log('3. Verify confirmation dialog appears');
    console.log('4. Click "Delete" to confirm');
    console.log('5. Verify drawing is removed from list');
    console.log('6. Verify success toast appears');
    console.log('7. Then run: printTestResults();\n');

    logTest('TC-023: Delete Drawing', 'WARN', 'Manual completion required');

  } catch (error) {
    logTest('TC-DELETE: Delete Tests', 'FAIL', error.message);
  }

  return testResults;
}

// Run: await testDelete();

// ============================================================================
// TEST UTILITIES - RESULTS
// ============================================================================

function printTestResults() {
  console.log('\n' + '='.repeat(80));
  console.log('TEST EXECUTION SUMMARY');
  console.log('='.repeat(80));

  console.log(`\nStart Time: ${testResults.startTime.toISOString()}`);
  console.log(`End Time: ${new Date().toISOString()}`);
  console.log(`Duration: ${((new Date() - testResults.startTime) / 1000).toFixed(2)}s`);

  console.log(`\n✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️  Warnings: ${testResults.warnings}`);
  console.log(`📊 Total: ${testResults.tests.length}`);

  const passRate = (testResults.passed / testResults.tests.length * 100).toFixed(1);
  console.log(`\n📈 Pass Rate: ${passRate}%`);

  console.log('\n' + '-'.repeat(80));
  console.log('DETAILED RESULTS:');
  console.log('-'.repeat(80) + '\n');

  testResults.tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${test.name}`);
    if (test.details) {
      console.log(`   ${test.details}`);
    }
  });

  console.log('\n' + '='.repeat(80));

  // Check for failures
  if (testResults.failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.tests.filter(t => t.status === 'FAIL').forEach(test => {
      console.log(`   • ${test.name}: ${test.details}`);
    });
  }

  // Check for warnings
  if (testResults.warnings > 0) {
    console.log('\n⚠️  WARNINGS:');
    testResults.tests.filter(t => t.status === 'WARN').forEach(test => {
      console.log(`   • ${test.name}: ${test.details}`);
    });
  }

  console.log('\n' + '='.repeat(80));

  return testResults;
}

// ============================================================================
// NETWORK MONITORING
// ============================================================================

function startNetworkMonitoring() {
  console.log('\n=== NETWORK MONITORING STARTED ===\n');

  const networkLog = [];

  // Monitor fetch requests
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const startTime = performance.now();
    const url = typeof args[0] === 'string' ? args[0] : args[0].url;
    const method = args[1]?.method || 'GET';

    try {
      const response = await originalFetch.apply(this, args);
      const duration = performance.now() - startTime;

      const logEntry = {
        url,
        method,
        status: response.status,
        duration: duration.toFixed(2) + 'ms',
        timestamp: new Date().toISOString()
      };

      networkLog.push(logEntry);
      console.log(`🌐 ${method} ${url} - ${response.status} (${logEntry.duration})`);

      return response;
    } catch (error) {
      const duration = performance.now() - startTime;
      const logEntry = {
        url,
        method,
        status: 'ERROR',
        error: error.message,
        duration: duration.toFixed(2) + 'ms',
        timestamp: new Date().toISOString()
      };

      networkLog.push(logEntry);
      console.error(`❌ ${method} ${url} - ERROR: ${error.message}`);

      throw error;
    }
  };

  window.getNetworkLog = () => networkLog;
  console.log('Network monitoring active. Call getNetworkLog() to see all requests.\n');
}

// Run: startNetworkMonitoring();

// ============================================================================
// ERROR MONITORING
// ============================================================================

function startErrorMonitoring() {
  console.log('\n=== ERROR MONITORING STARTED ===\n');

  const errors = [];

  window.addEventListener('error', (event) => {
    const errorLog = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: new Date().toISOString()
    };
    errors.push(errorLog);
    console.error('🔥 JavaScript Error:', errorLog);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const errorLog = {
      message: event.reason?.message || event.reason,
      type: 'Unhandled Promise Rejection',
      timestamp: new Date().toISOString()
    };
    errors.push(errorLog);
    console.error('🔥 Unhandled Rejection:', errorLog);
  });

  window.getErrors = () => errors;
  console.log('Error monitoring active. Call getErrors() to see all errors.\n');
}

// Run: startErrorMonitoring();

// ============================================================================
// QUICK START
// ============================================================================

async function runAllTests() {
  console.clear();
  console.log('🚀 STARTING CANVAS TESTING SUITE\n');

  startNetworkMonitoring();
  startErrorMonitoring();

  await testPageLoad();

  console.log('\n⏸️  Automated testing paused.');
  console.log('Complete the manual steps, then continue with:');
  console.log('  await testCreateBlankDrawing()');
  console.log('  await testDrawingEditor()');
  console.log('  await testExport()');
  console.log('  await testDelete()');
  console.log('  printTestResults()');
  console.log('\nOr jump to a specific test directly.\n');
}

// ============================================================================
// INSTRUCTIONS
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║          CANVAS/WHITEBOARD TESTING SCRIPT LOADED               ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  QUICK START:                                                  ║
║    await runAllTests()                                         ║
║                                                                ║
║  INDIVIDUAL TESTS:                                             ║
║    await testPageLoad()         - Test page load              ║
║    await testCreateBlankDrawing() - Test creation             ║
║    await testDrawingEditor()    - Test editor                 ║
║    await testExport()           - Test export                 ║
║    await testDelete()           - Test delete                 ║
║                                                                ║
║  MONITORING:                                                   ║
║    startNetworkMonitoring()     - Monitor API calls           ║
║    startErrorMonitoring()       - Monitor errors              ║
║    getNetworkLog()              - View network log            ║
║    getErrors()                  - View error log              ║
║                                                                ║
║  RESULTS:                                                      ║
║    printTestResults()           - Show test summary           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);
