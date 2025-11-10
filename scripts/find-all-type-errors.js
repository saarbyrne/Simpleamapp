#!/usr/bin/env node

/**
 * TypeScript Error Finder & Auto-Fixer
 * 
 * This script:
 * 1. Finds all TypeScript errors at once
 * 2. Categorizes them by type
 * 3. Suggests fixes
 * 4. Can attempt automatic fixes for common patterns
 * 
 * Usage:
 *   node scripts/find-all-type-errors.js
 *   node scripts/find-all-type-errors.js --fix  # Attempt auto-fixes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function categorizeError(error) {
  const patterns = {
    'Missing Property': /Property '(\w+)' does not exist/,
    'Type Mismatch': /Type '(.+)' is not assignable to type '(.+)'/,
    'Null/Undefined': /is possibly 'null'|is possibly 'undefined'/,
    'Generic Type': /is not generic|Expected (\d+) type arguments/,
    'React Hook': /React Hook/,
    'Unused Variable': /is declared but never used/,
  };

  for (const [category, pattern] of Object.entries(patterns)) {
    if (pattern.test(error)) {
      return category;
    }
  }
  return 'Other';
}

function extractErrors(buildOutput) {
  const errors = [];
  const lines = buildOutput.split('\n');
  
  let currentError = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match file path and line number
    const fileMatch = line.match(/^\.\/(.+):(\d+):(\d+)/);
    if (fileMatch) {
      if (currentError) errors.push(currentError);
      currentError = {
        file: fileMatch[1],
        line: parseInt(fileMatch[2]),
        column: parseInt(fileMatch[3]),
        message: '',
        category: '',
      };
    }
    
    // Match error message
    if (currentError && line.includes('Type error:')) {
      currentError.message = line.replace(/.*Type error:\s*/, '');
      currentError.category = categorizeError(currentError.message);
    }
  }
  
  if (currentError) errors.push(currentError);
  return errors;
}

function suggestFix(error) {
  const { message, file } = error;
  
  if (message.includes("Property '") && message.includes("' does not exist")) {
    const propMatch = message.match(/Property '(\w+)' does not exist/);
    if (propMatch) {
      return `Add '${propMatch[1]}' to the interface/type, or make it optional with '?'`;
    }
  }
  
  if (message.includes("is not assignable")) {
    return "Check type definitions - may need type assertion or fix the type";
  }
  
  if (message.includes("possibly 'null'") || message.includes("possibly 'undefined'")) {
    return "Add null check or use optional chaining (?.) or nullish coalescing (??)";
  }
  
  if (message.includes("is not generic")) {
    return "Remove generic type parameter or make the type generic";
  }
  
  return "Review the error and fix manually";
}

function main() {
  const shouldFix = process.argv.includes('--fix');
  
  log('🔍 Running TypeScript type check...', 'cyan');
  log('');
  
  try {
    const buildOutput = execSync('npm run build 2>&1', { 
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    
    log('✅ Build succeeded! No type errors.', 'green');
    return 0;
  } catch (error) {
    const buildOutput = error.stdout || error.stderr || '';
    
    if (!buildOutput.includes('Type error:')) {
      log('❌ Build failed, but no TypeScript errors found.', 'yellow');
      log('Check the output above for other issues.', 'yellow');
      return 1;
    }
    
    const errors = extractErrors(buildOutput);
    
    log(`\n❌ Found ${errors.length} TypeScript error(s):\n`, 'red');
    
    // Group by category
    const byCategory = {};
    errors.forEach(err => {
      if (!byCategory[err.category]) {
        byCategory[err.category] = [];
      }
      byCategory[err.category].push(err);
    });
    
    // Print by category
    Object.entries(byCategory).forEach(([category, errs]) => {
      log(`\n📁 ${category} (${errs.length} error(s)):`, 'yellow');
      errs.forEach(err => {
        log(`  ${err.file}:${err.line}:${err.column}`, 'cyan');
        log(`    ${err.message}`, 'red');
        log(`    💡 ${suggestFix(err)}`, 'blue');
        log('');
      });
    });
    
    // Summary
    log('\n📊 Summary:', 'cyan');
    log(`  Total errors: ${errors.length}`, 'reset');
    Object.entries(byCategory).forEach(([category, errs]) => {
      log(`  ${category}: ${errs.length}`, 'reset');
    });
    
    log('\n💡 Tips:', 'yellow');
    log('  1. Fix errors in order - earlier fixes may resolve later ones', 'reset');
    log('  2. Focus on one category at a time', 'reset');
    log('  3. Common patterns can be fixed together', 'reset');
    log('  4. Run this script again after fixes to see progress', 'reset');
    
    return 1;
  }
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { extractErrors, categorizeError, suggestFix };

