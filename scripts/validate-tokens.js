#!/usr/bin/env node

/**
 * Validates that UI components use design system tokens instead of hardcoded values
 *
 * This script scans component files for hardcoded Tailwind utility classes and flags
 * any that should be using design system tokens instead.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Patterns that indicate hardcoded values (not using tokens)
const VIOLATIONS = {
  // Spacing violations: p-4, px-3, py-2, gap-2, space-x-1, etc.
  spacing: /\b(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-[xy])-(\d+(?:\.\d+)?)\b/g,

  // Size violations: h-4, w-4, h-10, w-10, etc. (excluding percentages and viewport units)
  sizing: /\b(h|w|min-h|min-w|max-h|max-w)-(\d+(?:\.\d+)?)\b/g,

  // Exception: Allow certain fixed values that don't have token equivalents
  // Like h-10 for standard button height, w-72 for popover width, etc.
};

// Allowed exceptions (values that don't need tokens)
const ALLOWED_EXCEPTIONS = [
  'h-10', 'h-11', 'h-9',  // Standard button/input heights
  'w-full', 'h-full',      // Full width/height
  'w-72', 'w-3/4',         // Specific component widths
  'h-px',                  // 1px height for separators
  'h-3.5', 'w-3.5',       // Small indicator sizes (used in some contexts)
  'top-[1px]', 'top-[60%]', 'top-[50%]', 'left-[50%]', // Positioning values
];

// Token patterns that ARE correct
const TOKEN_PATTERNS = [
  /\bds-spacing-/,
  /\bgap-ds-/,
  /\bspace-[xy]-ds-/,
  /\bp-ds-/,
  /\bpx-ds-/,
  /\bpy-ds-/,
  /\bpt-ds-/,
  /\bpb-ds-/,
  /\bpl-ds-/,
  /\bpr-ds-/,
  /\bm-ds-/,
  /\bmt-ds-/,
  /\bmb-ds-/,
  /\bml-ds-/,
  /\bmr-ds-/,
  /\bh-ds-/,
  /\bw-ds-/,
  /\bmax-w-ds-/,
  /\bmin-w-ds-/,
];

function isException(match) {
  return ALLOWED_EXCEPTIONS.some(exception => match.includes(exception));
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const violations = [];

  // Check for hardcoded spacing values
  let match;
  while ((match = VIOLATIONS.spacing.exec(content)) !== null) {
    const fullMatch = match[0];
    if (!isException(fullMatch)) {
      violations.push({
        type: 'spacing',
        value: fullMatch,
        line: getLineNumber(content, match.index),
        suggestion: suggestTokenReplacement(fullMatch),
      });
    }
  }

  // Check for hardcoded sizing values
  VIOLATIONS.sizing.lastIndex = 0; // Reset regex
  while ((match = VIOLATIONS.sizing.exec(content)) !== null) {
    const fullMatch = match[0];
    if (!isException(fullMatch)) {
      violations.push({
        type: 'sizing',
        value: fullMatch,
        line: getLineNumber(content, match.index),
        suggestion: suggestTokenReplacement(fullMatch),
      });
    }
  }

  return violations;
}

function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

function suggestTokenReplacement(value) {
  const suggestions = {
    // Spacing
    'p-1': 'p-ds-2xs',
    'p-2': 'p-ds-sm',
    'p-3': 'p-ds-md',
    'p-4': 'p-ds-lg',
    'p-6': 'p-ds-2xl',
    'px-2': 'px-ds-sm',
    'px-3': 'px-ds-md',
    'px-4': 'px-ds-lg',
    'px-8': 'px-ds-3xl',
    'py-1': 'py-ds-2xs',
    'py-1.5': 'py-ds-xs',
    'py-2': 'py-ds-sm',
    'py-3': 'py-ds-md',
    'gap-1': 'gap-ds-2xs',
    'gap-2': 'gap-ds-sm',
    'gap-4': 'gap-ds-lg',
    'space-x-1': 'space-x-ds-2xs',
    'space-x-2': 'space-x-ds-sm',
    'space-y-1.5': 'space-y-ds-xs',
    'space-y-2': 'space-y-ds-sm',

    // Sizing
    'h-2': 'h-ds-icon-2xs',
    'h-3': 'h-ds-icon-xs',
    'h-4': 'h-ds-icon-sm',
    'h-5': 'h-ds-icon-md',
    'w-2': 'w-ds-icon-2xs',
    'w-3': 'w-ds-icon-xs',
    'w-4': 'w-ds-icon-sm',
    'w-5': 'w-ds-icon-md',
    'h-8': 'h-ds-3xl',
    'w-8': 'w-ds-3xl',
    'h-12': 'h-ds-5xl',
    'w-12': 'w-ds-5xl',
    'max-w-md': 'max-w-ds-dialog-md',
    'max-w-lg': 'max-w-ds-dialog-lg',
  };

  return suggestions[value] || `Use a design system token (check design-system-tokens.css)`;
}

function main() {
  console.log('🔍 Validating design system token usage...\n');

  const componentFiles = glob.sync('components/ui/*.tsx', {
    ignore: ['**/*.stories.tsx', '**/utils.tsx'],
  });

  let totalViolations = 0;
  const filesWithViolations = [];

  componentFiles.forEach(filePath => {
    const violations = validateFile(filePath);

    if (violations.length > 0) {
      totalViolations += violations.length;
      filesWithViolations.push({ filePath, violations });
    }
  });

  if (filesWithViolations.length === 0) {
    console.log('✅ All components are using design system tokens correctly!\n');
    console.log(`Checked ${componentFiles.length} component files.`);
    return 0;
  }

  console.log(`❌ Found ${totalViolations} token violations in ${filesWithViolations.length} files:\n`);

  filesWithViolations.forEach(({ filePath, violations }) => {
    console.log(`\n📄 ${filePath}`);
    violations.forEach(({ type, value, line, suggestion }) => {
      console.log(`  Line ${line}: ${value} → ${suggestion}`);
    });
  });

  console.log(`\n\n📊 Summary:`);
  console.log(`  Total files checked: ${componentFiles.length}`);
  console.log(`  Files with violations: ${filesWithViolations.length}`);
  console.log(`  Total violations: ${totalViolations}`);
  console.log(`\n💡 Tip: Replace hardcoded values with design system tokens for consistency and maintainability.`);

  return 1;
}

process.exit(main());
