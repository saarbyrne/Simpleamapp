/**
 * Accessibility Audit Script
 *
 * Generates a comprehensive accessibility report for all components
 * Identifies violations and provides remediation guidance
 *
 * Usage: npx tsx scripts/a11y-audit.ts
 */

import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';

interface ViolationReport {
  component: string;
  storyId: string;
  violations: Array<{
    id: string;
    impact: string;
    description: string;
    help: string;
    helpUrl: string;
    nodes: number;
  }>;
}

const components = [
  { name: 'Accordion', id: 'components-accordion--default' },
  { name: 'Alert', id: 'components-alert--default' },
  { name: 'Avatar', id: 'components-avatar--default' },
  { name: 'Badge', id: 'components-badge--default' },
  { name: 'Breadcrumb', id: 'components-breadcrumb--performance-journey' },
  { name: 'Button', id: 'components-button--default' },
  { name: 'Calendar', id: 'components-calendar--default' },
  { name: 'Card', id: 'components-card--default' },
  { name: 'Carousel', id: 'components-carousel--default' },
  { name: 'Checkbox', id: 'components-checkbox--default' },
  { name: 'Collapsible', id: 'components-collapsible--training-notes' },
  { name: 'Command', id: 'components-command--default' },
  { name: 'Context Menu', id: 'components-context-menu--default' },
  { name: 'Dialog', id: 'components-dialog--default' },
  { name: 'Drawer', id: 'components-drawer--default' },
  { name: 'Dropdown Menu', id: 'components-dropdown-menu--default' },
  { name: 'Hover Card', id: 'components-hover-card--default' },
  { name: 'Input', id: 'components-input--default' },
  { name: 'Input OTP', id: 'components-input-otp--verification' },
  { name: 'Label', id: 'components-label--default' },
  { name: 'Menubar', id: 'components-menubar--default' },
  { name: 'Navigation Menu', id: 'components-navigation-menu--default' },
  { name: 'Popover', id: 'components-popover--default' },
  { name: 'Progress', id: 'components-progress--default' },
  { name: 'Radio Group', id: 'components-radio-group--default' },
  { name: 'Resizable', id: 'components-resizable--default' },
  { name: 'Scroll Area', id: 'components-scroll-area--default' },
  { name: 'Select', id: 'components-select--default' },
  { name: 'Separator', id: 'components-separator--default' },
  { name: 'Sheet', id: 'components-sheet--default' },
  { name: 'Sidebar', id: 'components-sidebar--default' },
  { name: 'Skeleton', id: 'components-skeleton--default' },
  { name: 'Slider', id: 'components-slider--default' },
  { name: 'Sonner', id: 'components-toaster--default' },
  { name: 'Switch', id: 'components-switch--default' },
  { name: 'Table', id: 'components-table--default' },
  { name: 'Tabs', id: 'components-tabs--default' },
  { name: 'Textarea', id: 'components-textarea--default' },
  { name: 'Toggle', id: 'components-toggle--default' },
  { name: 'Toggle Group', id: 'components-toggle-group--default' },
  { name: 'Tooltip', id: 'components-tooltip--default' },
];

async function auditComponent(
  page: any,
  component: { name: string; id: string }
): Promise<ViolationReport> {
  const url = `http://localhost:6006/iframe.html?id=${component.id}`;

  try {
    await page.goto(url, { timeout: 10000 });
    await page.waitForLoadState('networkidle', { timeout: 5000 });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    return {
      component: component.name,
      storyId: component.id,
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact || 'unknown',
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length,
      })),
    };
  } catch (error) {
    console.error(`Error auditing ${component.name}:`, error);
    return {
      component: component.name,
      storyId: component.id,
      violations: [],
    };
  }
}

async function generateReport() {
  console.log('🔍 Starting accessibility audit...\n');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const reports: ViolationReport[] = [];
  let totalViolations = 0;
  let componentsWithViolations = 0;

  for (const component of components) {
    process.stdout.write(`Auditing ${component.name}... `);

    const report = await auditComponent(page, component);
    reports.push(report);

    if (report.violations.length > 0) {
      totalViolations += report.violations.length;
      componentsWithViolations++;
      console.log(`❌ ${report.violations.length} violations found`);
    } else {
      console.log(`✅ No violations`);
    }
  }

  await browser.close();

  // Generate summary
  console.log('\n📊 Accessibility Audit Summary');
  console.log('================================');
  console.log(`Total Components: ${components.length}`);
  console.log(`Components with Violations: ${componentsWithViolations}`);
  console.log(`Total Violations: ${totalViolations}`);
  console.log(`Pass Rate: ${Math.round(((components.length - componentsWithViolations) / components.length) * 100)}%\n`);

  // Group violations by severity
  const violationsBySeverity = reports
    .flatMap((r) => r.violations)
    .reduce((acc, v) => {
      acc[v.impact] = (acc[v.impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  console.log('Violations by Severity:');
  Object.entries(violationsBySeverity)
    .sort(([, a], [, b]) => b - a)
    .forEach(([severity, count]) => {
      console.log(`  ${severity}: ${count}`);
    });

  // Generate detailed report
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportDir = path.join(process.cwd(), 'reports');
  const reportPath = path.join(reportDir, `a11y-audit-${timestamp}.json`);

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);

  // Generate markdown report
  const markdownPath = path.join(reportDir, `a11y-audit-${timestamp}.md`);
  const markdown = generateMarkdownReport(reports);
  fs.writeFileSync(markdownPath, markdown);
  console.log(`📄 Markdown report saved to: ${markdownPath}`);

  // Generate HTML report
  const htmlPath = path.join(reportDir, `a11y-audit-${timestamp}.html`);
  const html = generateHTMLReport(reports);
  fs.writeFileSync(htmlPath, html);
  console.log(`📄 HTML report saved to: ${htmlPath}\n`);

  // Exit with error code if violations found
  if (totalViolations > 0) {
    console.log('❌ Accessibility violations detected. Please review and fix.\n');
    process.exit(1);
  } else {
    console.log('✅ All components pass accessibility checks!\n');
    process.exit(0);
  }
}

function generateMarkdownReport(reports: ViolationReport[]): string {
  const timestamp = new Date().toLocaleString();

  let markdown = `# Accessibility Audit Report\n\n`;
  markdown += `Generated: ${timestamp}\n\n`;

  const componentsWithViolations = reports.filter((r) => r.violations.length > 0);

  if (componentsWithViolations.length === 0) {
    markdown += `## ✅ All components pass accessibility checks!\n\n`;
    markdown += `Scanned ${reports.length} components with 0 violations.\n`;
    return markdown;
  }

  markdown += `## Summary\n\n`;
  markdown += `- Total Components: ${reports.length}\n`;
  markdown += `- Components with Violations: ${componentsWithViolations.length}\n`;
  markdown += `- Total Violations: ${reports.reduce((sum, r) => sum + r.violations.length, 0)}\n\n`;

  markdown += `## Components with Violations\n\n`;

  for (const report of componentsWithViolations) {
    markdown += `### ${report.component}\n\n`;

    for (const violation of report.violations) {
      markdown += `#### ${violation.help}\n\n`;
      markdown += `- **Impact:** ${violation.impact}\n`;
      markdown += `- **Description:** ${violation.description}\n`;
      markdown += `- **Affected Elements:** ${violation.nodes}\n`;
      markdown += `- **Learn More:** [${violation.helpUrl}](${violation.helpUrl})\n\n`;
    }
  }

  return markdown;
}

function generateHTMLReport(reports: ViolationReport[]): string {
  const timestamp = new Date().toLocaleString();
  const componentsWithViolations = reports.filter((r) => r.violations.length > 0);
  const totalViolations = reports.reduce((sum, r) => sum + r.violations.length, 0);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Audit Report</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: #f5f5f5;
    }
    h1 { color: #333; }
    .summary {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .component {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .violation {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 4px;
    }
    .impact {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .impact.critical { background: #fca5a5; color: #7f1d1d; }
    .impact.serious { background: #fed7aa; color: #7c2d12; }
    .impact.moderate { background: #fde68a; color: #713f12; }
    .impact.minor { background: #d9f99d; color: #365314; }
    .pass { color: #059669; }
    .fail { color: #dc2626; }
  </style>
</head>
<body>
  <h1>🔍 Accessibility Audit Report</h1>
  <p>Generated: ${timestamp}</p>

  <div class="summary">
    <h2>Summary</h2>
    <p><strong>Total Components:</strong> ${reports.length}</p>
    <p><strong>Components with Violations:</strong> ${componentsWithViolations.length}</p>
    <p><strong>Total Violations:</strong> ${totalViolations}</p>
    <p><strong>Pass Rate:</strong> ${Math.round(((reports.length - componentsWithViolations.length) / reports.length) * 100)}%</p>
  </div>

  ${componentsWithViolations
    .map(
      (report) => `
    <div class="component">
      <h2>${report.component}</h2>
      ${report.violations
        .map(
          (v) => `
        <div class="violation">
          <h3>${v.help}</h3>
          <p><span class="impact ${v.impact}">${v.impact.toUpperCase()}</span></p>
          <p>${v.description}</p>
          <p><strong>Affected Elements:</strong> ${v.nodes}</p>
          <p><a href="${v.helpUrl}" target="_blank">Learn more →</a></p>
        </div>
      `
        )
        .join('')}
    </div>
  `
    )
    .join('')}

  ${
    componentsWithViolations.length === 0
      ? '<div class="summary"><h2 class="pass">✅ All components pass accessibility checks!</h2></div>'
      : ''
  }
</body>
</html>
  `;
}

// Run the audit
generateReport().catch((error) => {
  console.error('Error running accessibility audit:', error);
  process.exit(1);
});
