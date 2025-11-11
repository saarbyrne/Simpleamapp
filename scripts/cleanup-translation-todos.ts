#!/usr/bin/env tsx
/**
 * Cleanup Translation TODOs
 * 
 * Replaces all [TODO: Translate] placeholders with English text from en.json
 * This ensures the app works properly even if translations aren't complete.
 */

import fs from 'fs';
import path from 'path';

const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'ar'];
const SOURCE_LOCALE = 'en';

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

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

function writeTranslationFile(locale: string, data: TranslationObject): void {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  const content = JSON.stringify(data, null, 2) + '\n';
  fs.writeFileSync(filePath, content, 'utf-8');
}

function getNestedValue(obj: TranslationObject, path: string[]): string | undefined {
  let current: any = obj;
  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

function replaceTODOs(
  target: TranslationObject,
  source: TranslationObject,
  path: string[] = []
): number {
  let replaced = 0;

  for (const key in target) {
    const targetValue = target[key];
    const currentPath = [...path, key];

    if (typeof targetValue === 'object' && targetValue !== null) {
      // Recursive case: nested object
      replaced += replaceTODOs(
        targetValue as TranslationObject,
        source,
        currentPath
      );
    } else if (typeof targetValue === 'string' && targetValue.includes('[TODO: Translate]')) {
      // Replace TODO with English text
      const englishValue = getNestedValue(source, currentPath);
      if (englishValue) {
        // Extract the English text after "[TODO: Translate] "
        const match = targetValue.match(/\[TODO: Translate\] (.+)/);
        if (match) {
          target[key] = match[1];
        } else {
          target[key] = englishValue;
        }
        replaced++;
      }
    }
  }

  return replaced;
}

function cleanupTODOs(): void {
  console.log('\n🧹 Cleaning up [TODO: Translate] placeholders...\n');

  const source = readTranslationFile(SOURCE_LOCALE);
  if (Object.keys(source).length === 0) {
    console.error(`❌ Source file (${SOURCE_LOCALE}.json) is empty or not found`);
    process.exit(1);
  }

  let totalReplaced = 0;

  for (const locale of SUPPORTED_LOCALES) {
    if (locale === SOURCE_LOCALE) {
      continue;
    }

    const target = readTranslationFile(locale);
    const replaced = replaceTODOs(target, source);
    
    if (replaced > 0) {
      writeTranslationFile(locale, target);
      console.log(`✅ ${locale.toUpperCase()}: Replaced ${replaced} TODO placeholder(s) with English text`);
      totalReplaced += replaced;
    } else {
      console.log(`✓  ${locale.toUpperCase()}: No TODOs found`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  if (totalReplaced > 0) {
    console.log(`✅ Replaced ${totalReplaced} TODO placeholder(s) total`);
    console.log('✅ All languages now use English as fallback');
  } else {
    console.log('✅ No TODOs found - all translations are clean!');
  }
}

cleanupTODOs();

