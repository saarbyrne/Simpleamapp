#!/usr/bin/env tsx
/**
 * Automated Translation Script
 * 
 * Uses translation APIs to automatically translate missing keys.
 * Supports multiple translation providers:
 * - Google Translate API (requires API key)
 * - DeepL API (requires API key)
 * - OpenAI API (requires API key)
 * 
 * Usage:
 *   npm run i18n:translate -- --locale fr --provider deepl
 *   npm run i18n:translate -- --all --provider google
 */

import fs from 'fs';
import path from 'path';

const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'ar'];
const SOURCE_LOCALE = 'en';

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

// Language codes for translation APIs
const LANGUAGE_CODES: Record<string, string> = {
  es: 'es',
  fr: 'fr',
  de: 'de',
  pt: 'pt',
  it: 'it',
  ja: 'ja',
  ar: 'ar',
};

/**
 * Translate text using OpenAI API
 * This is the most accessible option as many developers have OpenAI API keys
 */
async function translateWithOpenAI(text: string, targetLang: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable not set');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // Cheaper and fast for translations
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text to ${targetLang}. 
          - Preserve placeholders like {name}, {count}, etc.
          - Maintain the same tone and formality level.
          - Return only the translation, no explanations.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

/**
 * Translate text using DeepL API
 */
async function translateWithDeepL(text: string, targetLang: string): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPL_API_KEY environment variable not set');
  }

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      auth_key: apiKey,
      text: text,
      target_lang: LANGUAGE_CODES[targetLang] || targetLang.toUpperCase(),
      source_lang: 'EN',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepL API error: ${error}`);
  }

  const data = await response.json();
  return data.translations[0].text;
}

/**
 * Translate text using Google Translate API
 */
async function translateWithGoogle(text: string, targetLang: string): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_TRANSLATE_API_KEY environment variable not set');
  }

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      target: LANGUAGE_CODES[targetLang] || targetLang,
      source: 'en',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Translate API error: ${error}`);
  }

  const data = await response.json();
  return data.data.translations[0].translatedText;
}

/**
 * Get translation function based on provider
 */
function getTranslator(provider: string): (text: string, targetLang: string) => Promise<string> {
  switch (provider.toLowerCase()) {
    case 'openai':
      return translateWithOpenAI;
    case 'deepl':
      return translateWithDeepL;
    case 'google':
      return translateWithGoogle;
    default:
      throw new Error(`Unknown provider: ${provider}. Supported: openai, deepl, google`);
  }
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

/**
 * Recursively translate missing keys
 */
async function translateMissingKeys(
  target: TranslationObject,
  source: TranslationObject,
  targetLang: string,
  translateFn: (text: string, targetLang: string) => Promise<string>,
  path: string[] = [],
  delay: number = 100
): Promise<{ translated: number; skipped: number; errors: number }> {
  let translated = 0;
  let skipped = 0;
  let errors = 0;

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];
    const currentPath = [...path, key].join('.');

    if (typeof sourceValue === 'object' && sourceValue !== null) {
      // Recursive case: nested object
      if (!targetValue || typeof targetValue !== 'object') {
        target[key] = {};
      }
      const result = await translateMissingKeys(
        target[key] as TranslationObject,
        sourceValue as TranslationObject,
        targetLang,
        translateFn,
        [...path, key],
        delay
      );
      translated += result.translated;
      skipped += result.skipped;
      errors += result.errors;
    } else {
      // Leaf case: string value
      const sourceText = sourceValue as string;
      const currentTarget = targetValue as string | undefined;
      
      // Check if translation is needed
      if (!currentTarget || currentTarget === sourceText) {
        try {
          // Translate this text
          const translatedText = await translateFn(sourceText, targetLang);
          target[key] = translatedText;
          translated++;
          console.log(`  ✓ ${currentPath}`);
          
          // Rate limiting delay
          if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } catch (error) {
          console.error(`  ✗ ${currentPath}: ${error instanceof Error ? error.message : String(error)}`);
          errors++;
          // Keep English as fallback
          target[key] = sourceText;
        }
      } else {
        skipped++;
      }
    }
  }

  return { translated, skipped, errors };
}

async function translateLocale(locale: string, provider: string): Promise<void> {
  if (locale === SOURCE_LOCALE) {
    console.log('Cannot translate source locale (en)');
    return;
  }

  console.log(`\n🌐 Translating ${locale.toUpperCase()} using ${provider.toUpperCase()}...\n`);

  const source = readTranslationFile(SOURCE_LOCALE);
  const target = readTranslationFile(locale);
  const translateFn = getTranslator(provider);

  // Rate limiting: OpenAI/DeepL have rate limits
  // Adjust delay based on provider (OpenAI is faster, DeepL is slower)
  const delay = provider === 'openai' ? 50 : provider === 'deepl' ? 100 : 200;

  const result = await translateMissingKeys(target, source, locale, translateFn, [], delay);
  
  if (result.translated > 0 || result.errors > 0) {
    writeTranslationFile(locale, target);
    console.log(`\n✅ Translated ${result.translated} key(s)`);
    if (result.skipped > 0) {
      console.log(`⏭️  Skipped ${result.skipped} already translated key(s)`);
    }
    if (result.errors > 0) {
      console.log(`❌ Errors: ${result.errors} key(s)`);
    }
  } else {
    console.log('✅ All keys already translated');
  }
}

// CLI
const args = process.argv.slice(2);
const all = args.includes('--all');
const localeArg = args.find(arg => arg.startsWith('--locale='))?.split('=')[1];
const providerArg = args.find(arg => arg.startsWith('--provider='))?.split('=')[1] || 'openai';

if (!providerArg) {
  console.error('Error: --provider is required');
  console.log('\nUsage:');
  console.log('  npm run i18n:translate -- --locale=fr --provider=openai');
  console.log('  npm run i18n:translate -- --all --provider=deepl');
  console.log('\nProviders:');
  console.log('  - openai (requires OPENAI_API_KEY)');
  console.log('  - deepl (requires DEEPL_API_KEY)');
  console.log('  - google (requires GOOGLE_TRANSLATE_API_KEY)');
  process.exit(1);
}

if (all) {
  console.log(`Translating all languages using ${providerArg}...\n`);
  for (const locale of SUPPORTED_LOCALES) {
    if (locale !== SOURCE_LOCALE) {
      await translateLocale(locale, providerArg);
    }
  }
} else if (localeArg) {
  await translateLocale(localeArg, providerArg);
} else {
  console.error('Error: --locale or --all is required');
  console.log('\nUsage:');
  console.log('  npm run i18n:translate -- --locale=fr --provider=openai');
  console.log('  npm run i18n:translate -- --all --provider=deepl');
  process.exit(1);
}
