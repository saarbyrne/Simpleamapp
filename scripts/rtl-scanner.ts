#!/usr/bin/env node
/**
 * RTL Hardcoded Classes Scanner
 * 
 * Scans the codebase for hardcoded directional classes that need to be
 * updated for RTL support.
 * 
 * Usage:
 *   npm run rtl:scan          # Scan and report issues
 *   npm run rtl:scan --fix    # Scan and auto-fix (with dry-run preview)
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join, extname } from 'path'

interface RTLIssue {
  file: string
  line: number
  column: number
  original: string
  replacement: string
  severity: 'high' | 'medium' | 'low'
  context: string
}

interface ScanResult {
  totalIssues: number
  issuesByFile: Map<string, RTLIssue[]>
  issuesBySeverity: {
    high: number
    medium: number
    low: number
  }
  summary: {
    pattern: string
    count: number
    replacement: string
  }[]
}

// RTL replacement patterns
const RTL_PATTERNS = [
  // Margin
  { pattern: /\bmr-(\d+|auto)\b/g, replacement: 'me-$1', severity: 'high' as const },
  { pattern: /\bml-(\d+|auto)\b/g, replacement: 'ms-$1', severity: 'high' as const },
  { pattern: /\b-mr-(\d+)\b/g, replacement: '-me-$1', severity: 'high' as const },
  { pattern: /\b-ml-(\d+)\b/g, replacement: '-ms-$1', severity: 'high' as const },
  
  // Padding
  { pattern: /\bpr-(\d+|auto)\b/g, replacement: 'pe-$1', severity: 'high' as const },
  { pattern: /\bpl-(\d+|auto)\b/g, replacement: 'ps-$1', severity: 'high' as const },
  { pattern: /\b-pr-(\d+)\b/g, replacement: '-pe-$1', severity: 'high' as const },
  { pattern: /\b-pl-(\d+)\b/g, replacement: '-ps-$1', severity: 'high' as const },
  
  // Text alignment
  { pattern: /\btext-left\b/g, replacement: 'text-start', severity: 'high' as const },
  { pattern: /\btext-right\b/g, replacement: 'text-end', severity: 'high' as const },
  
  // Position
  { pattern: /\bright-(\d+|\[.*?\])/g, replacement: (match: string) => match.replace('right-', 'end-'), severity: 'medium' as const },
  { pattern: /\bleft-(\d+|\[.*?\])/g, replacement: (match: string) => match.replace('left-', 'start-'), severity: 'medium' as const },
  
  // Special cases that need manual review
  { pattern: /\bChevronRight\b/g, replacement: 'ChevronRight (needs conditional flip)', severity: 'low' as const, manual: true },
  { pattern: /\bArrowLeft\b/g, replacement: 'ArrowLeft (needs conditional flip)', severity: 'low' as const, manual: true },
  { pattern: /\bChevronLeft\b/g, replacement: 'ChevronLeft (needs conditional flip)', severity: 'low' as const, manual: true },
]

// Files/directories to ignore
const IGNORE_PATTERNS = [
  /node_modules/,
  /\.next/,
  /\.git/,
  /dist/,
  /build/,
  /\.bak$/,
  /\.test\./,
  /\.spec\./,
]

// File extensions to scan
const SCAN_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js']

function shouldIgnoreFile(filePath: string): boolean {
  return IGNORE_PATTERNS.some(pattern => pattern.test(filePath))
}

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir)
  
  for (const file of files) {
    const filePath = join(dir, file)
    
    if (shouldIgnoreFile(filePath)) {
      continue
    }
    
    const stat = statSync(filePath)
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList)
    } else if (SCAN_EXTENSIONS.includes(extname(filePath))) {
      fileList.push(filePath)
    }
  }
  
  return fileList
}

function scanFile(filePath: string): RTLIssue[] {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const issues: RTLIssue[] = []
  
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]
    const lineNumber = lineIndex + 1
    
    for (const pattern of RTL_PATTERNS) {
      const matches = [...line.matchAll(pattern.pattern)]
      
      for (const match of matches) {
        if (match.index === undefined) continue
        
        const original = match[0]
        let replacement: string
        
        if (typeof pattern.replacement === 'function') {
          replacement = pattern.replacement(original)
        } else {
          replacement = original.replace(pattern.pattern, pattern.replacement)
        }
        
        // Skip if already using RTL-aware class
        if (replacement === original || replacement.includes('me-') || replacement.includes('ms-') || 
            replacement.includes('pe-') || replacement.includes('ps-') || replacement.includes('text-start') || 
            replacement.includes('text-end') || replacement.includes('start-') || replacement.includes('end-')) {
          continue
        }
        
        issues.push({
          file: filePath,
          line: lineNumber,
          column: match.index + 1,
          original,
          replacement,
          severity: pattern.severity,
          context: line.trim(),
        })
      }
    }
  }
  
  return issues
}

function scanCodebase(rootDir: string = process.cwd()): ScanResult {
  const files = getAllFiles(rootDir)
  const allIssues: RTLIssue[] = []
  const issuesByFile = new Map<string, RTLIssue[]>()
  
  console.log(`📁 Scanning ${files.length} files...\n`)
  
  for (const file of files) {
    const issues = scanFile(file)
    if (issues.length > 0) {
      allIssues.push(...issues)
      issuesByFile.set(file, issues)
    }
  }
  
  // Group by pattern
  const patternCounts = new Map<string, { count: number; replacement: string }>()
  
  for (const issue of allIssues) {
    const key = issue.original
    const existing = patternCounts.get(key) || { count: 0, replacement: issue.replacement }
    patternCounts.set(key, { count: existing.count + 1, replacement: issue.replacement })
  }
  
  const summary = Array.from(patternCounts.entries())
    .map(([pattern, data]) => ({
      pattern,
      count: data.count,
      replacement: data.replacement,
    }))
    .sort((a, b) => b.count - a.count)
  
  const issuesBySeverity = {
    high: allIssues.filter(i => i.severity === 'high').length,
    medium: allIssues.filter(i => i.severity === 'medium').length,
    low: allIssues.filter(i => i.severity === 'low').length,
  }
  
  return {
    totalIssues: allIssues.length,
    issuesByFile,
    issuesBySeverity,
    summary,
  }
}

function generateReport(result: ScanResult): string {
  let report = '# RTL Hardcoded Classes Scan Report\n\n'
  report += `**Generated:** ${new Date().toISOString()}\n\n`
  report += `## Summary\n\n`
  report += `- **Total Issues Found:** ${result.totalIssues}\n`
  report += `- **High Priority:** ${result.issuesBySeverity.high}\n`
  report += `- **Medium Priority:** ${result.issuesBySeverity.medium}\n`
  report += `- **Low Priority (Manual Review):** ${result.issuesBySeverity.low}\n\n`
  
  report += `## Pattern Summary\n\n`
  report += `| Pattern | Count | Replacement |\n`
  report += `|---------|-------|-------------|\n`
  for (const item of result.summary) {
    report += `| \`${item.pattern}\` | ${item.count} | \`${item.replacement}\` |\n`
  }
  report += `\n`
  
  report += `## Issues by File\n\n`
  
  // Sort files by issue count
  const sortedFiles = Array.from(result.issuesByFile.entries())
    .sort((a, b) => b[1].length - a[1].length)
  
  for (const [file, issues] of sortedFiles) {
    const relativePath = file.replace(process.cwd() + '/', '')
    report += `### ${relativePath}\n\n`
    report += `**${issues.length} issue(s)**\n\n`
    
    // Group by line
    const issuesByLine = new Map<number, RTLIssue[]>()
    for (const issue of issues) {
      const existing = issuesByLine.get(issue.line) || []
      existing.push(issue)
      issuesByLine.set(issue.line, existing)
    }
    
    for (const [lineNum, lineIssues] of Array.from(issuesByLine.entries()).sort((a, b) => a[0] - b[0])) {
      report += `**Line ${lineNum}:**\n`
      for (const issue of lineIssues) {
        const severityBadge = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟢'
        report += `- ${severityBadge} \`${issue.original}\` → \`${issue.replacement}\`\n`
        report += `  \`\`\`tsx\n  ${issue.context}\n  \`\`\`\n`
      }
      report += `\n`
    }
    report += `\n`
  }
  
  return report
}

function applyFixes(result: ScanResult, dryRun: boolean = true): void {
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n')
  }
  
  let totalFixed = 0
  
  for (const [file, issues] of result.issuesByFile.entries()) {
    if (issues.some(i => i.severity === 'low' && i.replacement.includes('needs conditional'))) {
      console.log(`⏭️  Skipping ${file} - contains manual review items`)
      continue
    }
    
    let content = readFileSync(file, 'utf-8')
    let fileFixed = 0
    
    for (const issue of issues) {
      if (issue.severity === 'low' && issue.replacement.includes('needs conditional')) {
        continue // Skip manual review items
      }
      
      const lines = content.split('\n')
      const line = lines[issue.line - 1]
      
      if (line.includes(issue.original)) {
        const newLine = line.replace(
          new RegExp(`\\b${issue.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'),
          issue.replacement
        )
        lines[issue.line - 1] = newLine
        content = lines.join('\n')
        fileFixed++
      }
    }
    
    if (fileFixed > 0) {
      totalFixed += fileFixed
      if (!dryRun) {
        writeFileSync(file, content, 'utf-8')
        console.log(`✅ Fixed ${fileFixed} issue(s) in ${file}`)
      } else {
        console.log(`🔧 Would fix ${fileFixed} issue(s) in ${file}`)
      }
    }
  }
  
  console.log(`\n${dryRun ? 'Would fix' : 'Fixed'} ${totalFixed} total issue(s)`)
}

// Main execution
const args = process.argv.slice(2)
const shouldFix = args.includes('--fix')
const dryRun = !args.includes('--no-dry-run')

console.log('🔍 RTL Hardcoded Classes Scanner\n')
console.log('=' .repeat(50) + '\n')

const result = scanCodebase()

console.log(`\n📊 Scan Complete!\n`)
console.log(`Total Issues: ${result.totalIssues}`)
console.log(`  🔴 High Priority: ${result.issuesBySeverity.high}`)
console.log(`  🟡 Medium Priority: ${result.issuesBySeverity.medium}`)
console.log(`  🟢 Low Priority: ${result.issuesBySeverity.low}`)
console.log(`\nFiles Affected: ${result.issuesByFile.size}\n`)

// Generate report
const report = generateReport(result)
writeFileSync('RTL_SCAN_REPORT.md', report, 'utf-8')
console.log('📄 Report saved to: RTL_SCAN_REPORT.md\n')

if (shouldFix) {
  console.log('=' .repeat(50))
  applyFixes(result, dryRun)
  
  if (dryRun) {
    console.log('\n💡 To apply fixes, run: npm run rtl:fix -- --no-dry-run')
  }
} else {
  console.log('💡 To see what would be fixed, run: npm run rtl:scan --fix')
}

// Exit with error code if issues found
process.exit(result.totalIssues > 0 ? 1 : 0)
