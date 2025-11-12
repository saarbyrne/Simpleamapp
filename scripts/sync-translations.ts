#!/usr/bin/env tsx
/**
 * Translation Sync Script
 * 
 * This script ensures all language files have the same keys as the English (en.json) file.
 * Missing keys are added with placeholder values that need to be translated.
 * 
 * Usage:
 *   npm run i18n:sync          # Sync all languages, add placeholders
 *   npm run i18n:sync -- --check  # Only check for missing keys (CI mode)
 */

import fs from 'fs';
import path from 'path';

const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'ar'];
const SOURCE_LOCALE = 'en';

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

/**
 * Deep merge two objects, adding missing keys from source to target
 */
function deepMergeKeys(
  source: TranslationObject,
  target: TranslationObject,
  path: string[] = []
): { added: number; missing: string[] } {
  let added = 0;
  const missing: string[] = [];

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];
    const currentPath = [...path, key].join('.');

    if (typeof sourceValue === 'object' && sourceValue !== null) {
      // Recursive case: nested object
      if (!targetValue || typeof targetValue !== 'object') {
        target[key] = {};
        added++;
      }
      const result = deepMergeKeys(
        sourceValue as TranslationObject,
        target[key] as TranslationObject,
        [...path, key]
      );
      added += result.added;
      missing.push(...result.missing);
    } else {
      // Leaf case: string value
      if (!(key in target)) {
        // Use English text as fallback instead of TODO placeholder
        // This ensures the app works even if translations aren't complete
        target[key] = sourceValue as string;
        added++;
        missing.push(currentPath);
      }
    }
  }

  return { added, missing };
}

/**
 * Sort object keys recursively
 */
function sortKeys(obj: TranslationObject): TranslationObject {
  const sorted: TranslationObject = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'object' && value !== null) {
      sorted[key] = sortKeys(value as TranslationObject);
    } else {
      sorted[key] = value;
    }
  }

  return sorted;
}

/**
 * Read and parse JSON file
 */
function readTranslationFile(locale: string): TranslationObject {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return {};
  }
}

/**
 * Write JSON file with proper formatting
 */
function writeTranslationFile(locale: string, data: TranslationObject): void {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  const content = JSON.stringify(data, null, 2) + '\n';
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Main sync function
 */
function syncTranslations(checkOnly: boolean = false): { success: boolean; missing: number } {
  console.log(`\n🌐 Translation Sync ${checkOnly ? '(Check Mode)' : '(Sync Mode)'}\n`);

  // Read source (English) file
  const source = readTranslationFile(SOURCE_LOCALE);
  if (Object.keys(source).length === 0) {
    console.error(`❌ Source file (${SOURCE_LOCALE}.json) is empty or not found`);
    process.exit(1);
  }

  let totalMissing = 0;
  const results: Array<{ locale: string; added: number; missing: string[] }> = [];

  // Process each locale
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === SOURCE_LOCALE) {
      continue; // Skip source locale
    }

    const target = readTranslationFile(locale);
    const { added, missing } = deepMergeKeys(source, target);

    if (added > 0) {
      totalMissing += added;
      results.push({ locale, added, missing });

      if (!checkOnly) {
        // Sort keys for consistency
        const sorted = sortKeys(target);
        writeTranslationFile(locale, sorted);
        console.log(`✅ ${locale.toUpperCase()}: Added ${added} missing key(s)`);
      } else {
        console.log(`⚠️  ${locale.toUpperCase()}: Missing ${added} key(s)`);
      }
    } else {
      console.log(`✓  ${locale.toUpperCase()}: Up to date`);
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  if (checkOnly) {
    if (totalMissing === 0) {
      console.log('✅ All translation files are in sync!');
      return { success: true, missing: 0 };
    } else {
      console.log(`❌ Found ${totalMissing} missing translation key(s) across all languages`);
      console.log('\nMissing keys by locale:');
      results.forEach(({ locale, missing }) => {
        if (missing.length > 0) {
          console.log(`\n  ${locale.toUpperCase()}:`);
          missing.slice(0, 10).forEach(key => console.log(`    - ${key}`));
          if (missing.length > 10) {
            console.log(`    ... and ${missing.length - 10} more`);
          }
        }
      });
      return { success: false, missing: totalMissing };
    }
  } else {
    if (totalMissing === 0) {
      console.log('✅ All translation files are already in sync!');
    } else {
      console.log(`✅ Added ${totalMissing} missing key(s) across all languages`);
      console.log('\n⚠️  Next steps:');
      console.log('   1. Review the added [TODO: Translate] placeholders');
      console.log('   2. Replace placeholders with proper translations');
      console.log('   3. Run "npm run i18n:sync -- --check" to verify');
    }
    return { success: true, missing: totalMissing };
  }
}

// CLI
const args = process.argv.slice(2);
const checkOnly = args.includes('--check') || args.includes('-c');

const result = syncTranslations(checkOnly);
process.exit(result.success ? 0 : 1);

