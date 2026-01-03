/**
 * Design System Lint
 *
 * Validates that components follow design system rules:
 * - Use design tokens instead of hardcoded values
 * - Follow naming conventions
 * - Include proper accessibility attributes
 * - Use responsive patterns correctly
 * - Follow motion guidelines
 *
 * Usage: npx tsx scripts/design-lint.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface LintViolation {
  file: string;
  line: number;
  rule: string;
  severity: 'error' | 'warning';
  message: string;
  suggestion?: string;
}

interface LintResult {
  file: string;
  violations: LintViolation[];
}

const rules = {
  // Color rules
  hardcodedColors: {
    pattern: /(#[0-9A-Fa-f]{3,6}|rgb\(|rgba\(|hsl\(|hsla\()/g,
    exclude: [
      /\/\/ @design-system-ignore/,
      /className=["'].*bg-\w+.*["']/,
      /className=["'].*text-\w+.*["']/,
    ],
    message: 'Avoid hardcoded colors. Use Tailwind semantic classes or design tokens.',
    suggestion: 'Use text-foreground, bg-background, border, etc. or tokens.colors.*',
    severity: 'error' as const,
  },

  // Spacing rules
  hardcodedSpacing: {
    pattern: /(?:padding|margin|gap):\s*['"]?\d+(?:px|rem|em)['"]?/g,
    exclude: [/\/\/ @design-system-ignore/, /style=\{\{/],
    message: 'Avoid hardcoded spacing. Use Tailwind spacing classes or design tokens.',
    suggestion: 'Use p-4, m-2, gap-6, etc. or tokens.spacing.*',
    severity: 'warning' as const,
  },

  // Typography rules
  hardcodedFontSizes: {
    pattern: /fontSize:\s*['"]?\d+(?:px|rem|em)['"]?/g,
    exclude: [/\/\/ @design-system-ignore/],
    message: 'Avoid hardcoded font sizes. Use Tailwind text classes or typography tokens.',
    suggestion: 'Use text-sm, text-base, text-lg, etc. or tokens.typography.*',
    severity: 'warning' as const,
  },

  // Accessibility rules
  missingAltText: {
    pattern: /<img(?![^>]*alt=)[^>]*>/g,
    exclude: [/decorative/],
    message: 'Images must have alt text for accessibility.',
    suggestion: 'Add alt="" for decorative images or alt="description" for content images',
    severity: 'error' as const,
  },

  missingAriaLabel: {
    pattern: /<button[^>]*>[\s]*<(?:svg|Icon)[^>]*>[\s]*<\/button>/g,
    exclude: [/aria-label=/, /aria-labelledby=/],
    message: 'Icon-only buttons must have aria-label for screen readers.',
    suggestion: 'Add aria-label="Action description" to the button',
    severity: 'error' as const,
  },

  // Component conventions
  incorrectComponentNaming: {
    pattern: /^(?:function|const)\s+([a-z][a-zA-Z]*)\s*[=:]/gm,
    exclude: [/use[A-Z]/, /get[A-Z]/, /handle[A-Z]/, /on[A-Z]/],
    message: 'Component names must start with uppercase letter (PascalCase).',
    suggestion: 'Rename to PascalCase: MyComponent',
    severity: 'warning' as const,
  },

  // Responsive design rules
  nonMobileFirst: {
    pattern: /className=["'][^"']*\s(?:lg|xl|2xl):[^\s"']+(?:\s(?!sm:|md:)[^\s"']+)+["']/g,
    exclude: [],
    message: 'Use mobile-first responsive design. Apply base styles first, then larger breakpoints.',
    suggestion: 'Apply mobile styles by default, then add sm:, md:, lg: progressively',
    severity: 'warning' as const,
  },

  // Motion rules
  hardcodedTransitions: {
    pattern: /transition:\s*['"]all\s+\d+(?:ms|s)['"]?/g,
    exclude: [/\/\/ @design-system-ignore/],
    message: 'Use motion tokens for consistent transitions.',
    suggestion: 'Use tokens.motion.duration.* and tokens.motion.easing.*',
    severity: 'warning' as const,
  },

  // Reduced motion
  missingReducedMotion: {
    pattern: /@keyframes|animation:|transition:/g,
    exclude: [/prefers-reduced-motion/, /@media.*reduced-motion/],
    message: 'Animations should respect prefers-reduced-motion for accessibility.',
    suggestion: 'Add @media (prefers-reduced-motion: reduce) { ... } or use motion utilities',
    severity: 'warning' as const,
  },

  // Token usage validation
  missingTokenImport: {
    pattern: /(?:duration|easing|colors|spacing|typography):\s*['"]?\d+/g,
    exclude: [/\/\/ @design-system-ignore/, /from ['"]@\/design-system\/tokens/],
    message: 'Use design tokens instead of hardcoded values. Import from @/design-system/tokens',
    suggestion: 'Import { motion, colors, spacing, typography } from "@/design-system/tokens"',
    severity: 'warning' as const,
  },

  // Dark mode checks
  missingDarkMode: {
    pattern: /className=["'][^"']*bg-(?:white|black|gray-\d+|slate-\d+|zinc-\d+|neutral-\d+|stone-\d+)/g,
    exclude: [/\/\/ @design-system-ignore/, /dark:/],
    message: 'Use semantic color classes that support dark mode. Avoid hardcoded color names.',
    suggestion: 'Use bg-background, bg-card, bg-primary, etc. which automatically adapt to dark mode',
    severity: 'warning' as const,
  },

  // Component import validation
  directRadixImport: {
    pattern: /from ['"]@radix-ui\//g,
    exclude: [/\/\/ @design-system-ignore/, /components\/ui\//],
    message: 'Import components from @/components/ui instead of directly from @radix-ui',
    suggestion: 'Use shadcn/ui components from @/components/ui which include proper styling',
    severity: 'error' as const,
  },

  // Table implementation check
  incorrectTableImplementation: {
    pattern: /<table|<thead|<tbody/g,
    exclude: [/\/\/ @design-system-ignore/, /DataTable/, /@tanstack\/react-table/],
    message: 'Use TanStack Table (DataTable component) instead of native HTML tables for data tables.',
    suggestion: 'Use DataTable from @/components/data-table. See app/dashboard/players/page.tsx for reference.',
    severity: 'warning' as const,
  },
};

async function lintFile(filePath: string): Promise<LintResult> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations: LintViolation[] = [];

  for (const [ruleName, rule] of Object.entries(rules)) {
    const matches = content.matchAll(rule.pattern);

    for (const match of matches) {
      // Check if match should be excluded
      const matchContext = content.substring(
        Math.max(0, match.index! - 100),
        Math.min(content.length, match.index! + 100)
      );

      const shouldExclude = rule.exclude.some((excludePattern) =>
        excludePattern.test(matchContext)
      );

      if (shouldExclude) continue;

      // Find line number
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;

      violations.push({
        file: filePath,
        line: lineNumber,
        rule: ruleName,
        severity: rule.severity,
        message: rule.message,
        suggestion: rule.suggestion,
      });
    }
  }

  return {
    file: filePath,
    violations,
  };
}

async function lintDesignSystem() {
  console.log('🎨 Running design system lint...\n');
  console.log('📚 Design system documentation: docs/design-system/DESIGN_SYSTEM.md\n');

  // Find all component and story files
  const componentFiles = await glob('components/**/*.{tsx,ts}', {
    ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**'],
    cwd: process.cwd(),
  });

  const storyFiles = await glob('stories/**/*.{tsx,ts}', {
    ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**'],
    cwd: process.cwd(),
  });

  // Also check app directory for pages
  const appFiles = await glob('app/**/*.{tsx,ts}', {
    ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**', '**/layout.tsx', '**/loading.tsx', '**/error.tsx'],
    cwd: process.cwd(),
  });

  const files = [...componentFiles, ...storyFiles, ...appFiles];

  const results: LintResult[] = [];
  let totalViolations = 0;
  let errors = 0;
  let warnings = 0;

  for (const file of files) {
    const result = await lintFile(file);

    if (result.violations.length > 0) {
      results.push(result);
      totalViolations += result.violations.length;
      errors += result.violations.filter((v) => v.severity === 'error').length;
      warnings += result.violations.filter((v) => v.severity === 'warning').length;
    }
  }

  // Print results
  console.log('📊 Design Lint Summary');
  console.log('======================');
  console.log(`Files scanned: ${files.length}`);
  console.log(`Files with violations: ${results.length}`);
  console.log(`Total violations: ${totalViolations}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Warnings: ${warnings}\n`);

  if (results.length > 0) {
    console.log('📝 Violations by File:\n');

    for (const result of results) {
      console.log(`${result.file}:`);

      const grouped = result.violations.reduce((acc, v) => {
        if (!acc[v.rule]) acc[v.rule] = [];
        acc[v.rule].push(v);
        return acc;
      }, {} as Record<string, LintViolation[]>);

      for (const [rule, violations] of Object.entries(grouped)) {
        console.log(`  ${violations[0].severity === 'error' ? '❌' : '⚠️ '} ${rule} (${violations.length})`);
        console.log(`     ${violations[0].message}`);
        if (violations[0].suggestion) {
          console.log(`     💡 ${violations[0].suggestion}`);
        }
        console.log(`     Lines: ${violations.map((v) => v.line).join(', ')}\n`);
      }
    }

    // Save report
    const reportDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(reportDir, `design-lint-${timestamp}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`📄 Detailed report saved to: ${reportPath}\n`);

    if (errors > 0) {
      console.log(`❌ ${errors} error(s) found. Please fix before committing.\n`);
      process.exit(1);
    } else {
      console.log(`✅ No errors found. ${warnings} warning(s) to address.\n`);
      process.exit(0);
    }
  } else {
    console.log('✅ All files pass design system lint!\n');
    process.exit(0);
  }
}

// Run the linter
lintDesignSystem().catch((error) => {
  console.error('Error running design lint:', error);
  process.exit(1);
});
