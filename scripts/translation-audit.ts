#!/usr/bin/env tsx
/**
 * Translation Audit Script
 * 
 * Scans the codebase for:
 * 1. Hardcoded English text that should be translated
 * 2. Missing translation keys in locale files
 * 3. Unused translation keys
 * 4. Translation keys used but not defined
 * 
 * Usage:
 *   npm run i18n:audit
 *   npm run i18n:audit -- --locale es
 *   npm run i18n:audit -- --check-missing
 */

import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

interface TranslationKey {
  key: string
  file: string
  line: number
  context?: string
}

interface AuditResult {
  hardcodedText: Array<{
    text: string
    file: string
    line: number
    suggestion?: string
  }>
  missingKeys: Array<{
    key: string
    locale: string
    usedIn: string[]
  }>
  unusedKeys: Array<{
    key: string
    locale: string
  }>
  usedKeys: Set<string>
  allKeys: Set<string>
}

// Common English words/phrases that should be translated
const COMMON_ENGLISH_PATTERNS = [
  /\b(Add|Create|Edit|Delete|Save|Cancel|Submit|Search|Filter|Export|Import|Close|Back|Next|Previous|Submit|Reset|Clear|Refresh|Loading|Error|Success|Confirm|Yes|No|OK)\b/gi,
  /\b(Players|Forms|Reports|Calendar|Notes|Spreadsheets|Canvas|Files|Planner)\b/gi,
  /\b(Profile|Settings|Preferences|Notifications|Security)\b/gi,
  /\b(Name|Email|Phone|Address|Date|Time|Status|Actions|Details|More|Less)\b/gi,
  /\b(No results found|No data available|Loading|Error occurred|Success|Failed)\b/gi,
]

// Words that are commonly OK to leave untranslated (technical terms, proper nouns)
const SKIP_PATTERNS = [
  /^[A-Z]{2,}$/, // Acronyms like API, URL, CSV
  /^\d+$/, // Numbers
  /^[a-z]+\.(com|org|net|io)$/i, // Domains
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email addresses
  /^(http|https|ftp):\/\//, // URLs
  /^[A-Z][a-z]+ [A-Z][a-z]+$/, // Proper nouns (likely names)
]

function shouldSkipText(text: string): boolean {
  // Skip if it's a translation key
  if (text.includes('t(') || text.includes('useTranslations') || text.includes('getTranslations')) {
    return true
  }
  
  // Skip if it matches skip patterns
  if (SKIP_PATTERNS.some(pattern => pattern.test(text))) {
    return true
  }
  
  // Skip CSS classes (common patterns)
  if (/^(flex|grid|absolute|relative|fixed|sticky|block|inline|hidden|visible|w-|h-|p-|m-|text-|bg-|border-|rounded-|shadow-|opacity-|z-|top-|bottom-|left-|right-|start-|end-|gap-|space-|items-|justify-|content-|self-|order-|col-|row-|data-\[|group|peer|hover:|focus:|active:|disabled:|dark:|sm:|md:|lg:|xl:|2xl:)/.test(text)) {
    return true
  }
  
  // Skip if it contains CSS-like patterns
  if (/^[a-z-]+:\s*[a-z-]+/.test(text) || /^[a-z-]+\s+[a-z-]+/.test(text) && text.split(/\s+/).length > 2) {
    return true
  }
  
  // Skip if it's a variable name or code
  if (/^[a-z_$][a-zA-Z0-9_$]*$/.test(text) && text.length < 20) {
    return true
  }
  
  // Skip if it's mostly symbols
  if (/^[^a-zA-Z]*$/.test(text)) {
    return true
  }
  
  // Skip if it looks like a CSS selector or className
  if (text.includes('className') || text.includes('class=') || text.includes('data-')) {
    return true
  }
  
  return false
}

function extractTranslationKeys(content: string, file: string): TranslationKey[] {
  const keys: TranslationKey[] = []
  const lines = content.split('\n')
  
  // Match t('key') or t("key") patterns
  const tPattern = /t\(['"]([^'"]+)['"]\)/g
  // Match t('key.subkey') patterns
  const tNestedPattern = /t\(['"]([^'"]+)['"]\)/g
  
  lines.forEach((line, index) => {
    let match
    while ((match = tPattern.exec(line)) !== null) {
      keys.push({
        key: match[1],
        file,
        line: index + 1,
        context: line.trim(),
      })
    }
  })
  
  return keys
}

function findHardcodedText(content: string, file: string): Array<{ text: string; file: string; line: number; suggestion?: string }> {
  const issues: Array<{ text: string; file: string; line: number; suggestion?: string }> = []
  const lines = content.split('\n')
  
  lines.forEach((line, index) => {
    // Skip comments and code-only lines
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) {
      return
    }
    
    // Skip if it's already using translations
    if (line.includes('t(') || line.includes('useTranslations') || line.includes('getTranslations')) {
      return
    }
    
    // Look for string literals that might be user-facing text
    const stringPattern = /['"`]([^'"`]{3,})['"`]/g
    let match
    
    while ((match = stringPattern.exec(line)) !== null) {
      const text = match[1]
      
      // Skip if it's a translation key path
      if (text.includes('.') && !text.includes(' ')) {
        continue
      }
      
      if (shouldSkipText(text)) {
        continue
      }
      
      // Check if it matches common English patterns
      const hasEnglishPattern = COMMON_ENGLISH_PATTERNS.some(pattern => {
        pattern.lastIndex = 0
        return pattern.test(text)
      })
      
      // Check if it looks like user-facing text (has spaces, capital letters, etc.)
      const looksLikeText = text.length > 3 && 
                           (text.includes(' ') || 
                            /[A-Z]/.test(text) ||
                            text.includes('!') ||
                            text.includes('?') ||
                            text.endsWith('.') ||
                            text.endsWith(':'))
      
      if (hasEnglishPattern || looksLikeText) {
        // Generate a suggested translation key
        const suggestion = text
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '.')
          .substring(0, 50)
        
        issues.push({
          text,
          file,
          line: index + 1,
          suggestion: `common.${suggestion}`,
        })
      }
    }
  })
  
  return issues
}

function loadTranslationFile(locale: string): Record<string, any> {
  const filePath = path.join(process.cwd(), 'messages', `${locale}.json`)
  if (!fs.existsSync(filePath)) {
    return {}
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function getAllKeys(obj: Record<string, any>, prefix = ''): Set<string> {
  const keys = new Set<string>()
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      getAllKeys(value, fullKey).forEach(k => keys.add(k))
    } else {
      keys.add(fullKey)
    }
  }
  
  return keys
}

async function auditTranslations(options: { locale?: string; checkMissing?: boolean } = {}): Promise<void> {
  const { locale = 'es', checkMissing = true } = options
  
  console.log('🔍 Translation Audit Tool\n')
  console.log(`Target locale: ${locale}\n`)
  
  const result: AuditResult = {
    hardcodedText: [],
    missingKeys: [],
    unusedKeys: [],
    usedKeys: new Set(),
    allKeys: new Set(),
  }
  
  // Find all TypeScript/TSX files
  const files = await glob('**/*.{ts,tsx}', {
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/scripts/**',
    ],
    cwd: process.cwd(),
  })
  
  console.log(`📁 Scanning ${files.length} files...\n`)
  
  // Extract translation keys and find hardcoded text
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    
    // Extract translation keys
    const keys = extractTranslationKeys(content, file)
    keys.forEach(k => result.usedKeys.add(k.key))
    
    // Find hardcoded text (only in component files)
    if (file.includes('components') || file.includes('app')) {
      const hardcoded = findHardcodedText(content, file)
      result.hardcodedText.push(...hardcoded)
    }
  }
  
  // Load translation files
  const enTranslations = loadTranslationFile('en')
  const localeTranslations = loadTranslationFile(locale)
  
  result.allKeys = getAllKeys(enTranslations)
  const localeKeys = getAllKeys(localeTranslations)
  
  // Find missing keys
  if (checkMissing) {
    result.usedKeys.forEach(key => {
      if (!localeKeys.has(key) && enTranslations) {
        // Check if key exists in English
        const keyParts = key.split('.')
        let current = enTranslations
        let exists = true
        
        for (const part of keyParts) {
          if (current && typeof current === 'object' && part in current) {
            current = current[part]
          } else {
            exists = false
            break
          }
        }
        
        if (exists) {
          result.missingKeys.push({
            key,
            locale,
            usedIn: Array.from(result.usedKeys).filter(k => k === key).map(() => 'unknown'), // Simplified
          })
        }
      }
    })
  }
  
  // Find unused keys
  localeKeys.forEach(key => {
    if (!result.usedKeys.has(key)) {
      result.unusedKeys.push({ key, locale })
    }
  })
  
  // Print results
  console.log('='.repeat(80))
  console.log('📊 AUDIT RESULTS')
  console.log('='.repeat(80))
  
  if (result.hardcodedText.length > 0) {
    console.log(`\n⚠️  Found ${result.hardcodedText.length} potential hardcoded English strings:\n`)
    result.hardcodedText.slice(0, 20).forEach(issue => {
      console.log(`  ${issue.file}:${issue.line}`)
      console.log(`    Text: "${issue.text}"`)
      if (issue.suggestion) {
        console.log(`    Suggested key: ${issue.suggestion}`)
      }
      console.log()
    })
    if (result.hardcodedText.length > 20) {
      console.log(`  ... and ${result.hardcodedText.length - 20} more\n`)
    }
  } else {
    console.log('\n✅ No hardcoded English text found!\n')
  }
  
  if (result.missingKeys.length > 0) {
    console.log(`\n❌ Found ${result.missingKeys.length} missing translation keys in ${locale}:\n`)
    result.missingKeys.slice(0, 30).forEach(missing => {
      console.log(`  - ${missing.key}`)
    })
    if (result.missingKeys.length > 30) {
      console.log(`  ... and ${result.missingKeys.length - 30} more\n`)
    }
  } else {
    console.log(`\n✅ All used translation keys exist in ${locale}!\n`)
  }
  
  if (result.unusedKeys.length > 0) {
    console.log(`\nℹ️  Found ${result.unusedKeys.length} unused translation keys in ${locale}:\n`)
    result.unusedKeys.slice(0, 20).forEach(unused => {
      console.log(`  - ${unused.key}`)
    })
    if (result.unusedKeys.length > 20) {
      console.log(`  ... and ${result.unusedKeys.length - 20} more\n`)
    }
  } else {
    console.log(`\n✅ No unused translation keys found!\n`)
  }
  
  // Summary
  console.log('='.repeat(80))
  console.log('📈 SUMMARY')
  console.log('='.repeat(80))
  console.log(`Total files scanned: ${files.length}`)
  console.log(`Translation keys used: ${result.usedKeys.size}`)
  console.log(`Translation keys defined (en): ${result.allKeys.size}`)
  console.log(`Translation keys defined (${locale}): ${localeKeys.size}`)
  console.log(`Hardcoded text found: ${result.hardcodedText.length}`)
  console.log(`Missing keys: ${result.missingKeys.length}`)
  console.log(`Unused keys: ${result.unusedKeys.length}`)
  
  // Generate report file
  const reportPath = path.join(process.cwd(), 'translation-audit-report.json')
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        locale,
        summary: {
          filesScanned: files.length,
          keysUsed: result.usedKeys.size,
          keysDefinedEn: result.allKeys.size,
          keysDefinedLocale: localeKeys.size,
          hardcodedText: result.hardcodedText.length,
          missingKeys: result.missingKeys.length,
          unusedKeys: result.unusedKeys.length,
        },
        hardcodedText: result.hardcodedText,
        missingKeys: result.missingKeys,
        unusedKeys: result.unusedKeys,
      },
      null,
      2
    )
  )
  
  console.log(`\n📄 Detailed report saved to: ${reportPath}`)
}

// Parse command line arguments
const args = process.argv.slice(2)
const localeIndex = args.indexOf('--locale')
const locale = localeIndex !== -1 && args[localeIndex + 1] ? args[localeIndex + 1] : 'es'
const checkMissing = args.includes('--check-missing') || !args.includes('--no-check-missing')

auditTranslations({ locale, checkMissing }).catch(console.error)

