#!/usr/bin/env node
/**
 * RTL Hardcoded Classes Scanner
 * Scans codebase for hardcoded directional classes that need RTL updates
 */

const fs = require('fs')
const path = require('path')

// RTL replacement patterns
const RTL_PATTERNS = [
  { pattern: /\bmr-(\d+|auto)\b/g, replacement: 'me-$1', name: 'margin-right', severity: 'high' },
  { pattern: /\bml-(\d+|auto)\b/g, replacement: 'ms-$1', name: 'margin-left', severity: 'high' },
  { pattern: /\b-mr-(\d+)\b/g, replacement: '-me-$1', name: 'negative-margin-right', severity: 'high' },
  { pattern: /\b-ml-(\d+)\b/g, replacement: '-ms-$1', name: 'negative-margin-left', severity: 'high' },
  { pattern: /\bpr-(\d+|auto)\b/g, replacement: 'pe-$1', name: 'padding-right', severity: 'high' },
  { pattern: /\bpl-(\d+|auto)\b/g, replacement: 'ps-$1', name: 'padding-left', severity: 'high' },
  { pattern: /\b-pr-(\d+)\b/g, replacement: '-pe-$1', name: 'negative-padding-right', severity: 'high' },
  { pattern: /\b-pl-(\d+)\b/g, replacement: '-ps-$1', name: 'negative-padding-left', severity: 'high' },
  { pattern: /\btext-left\b/g, replacement: 'text-start', name: 'text-left', severity: 'high' },
  { pattern: /\btext-right\b/g, replacement: 'text-end', name: 'text-right', severity: 'high' },
  { pattern: /\bright-(\d+|\[.*?\])/g, replacement: (m) => m.replace('right-', 'end-'), name: 'right-position', severity: 'medium' },
  { pattern: /\bleft-(\d+|\[.*?\])/g, replacement: (m) => m.replace('left-', 'start-'), name: 'left-position', severity: 'medium' },
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
  /rtl-scanner/,
  /RTL_.*\.md/,
]

const SCAN_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js']

function shouldIgnoreFile(filePath) {
  return IGNORE_PATTERNS.some(pattern => pattern.test(filePath))
}

function getAllFiles(dir, fileList = []) {
  try {
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const filePath = path.join(dir, file)
      
      if (shouldIgnoreFile(filePath)) continue
      
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        getAllFiles(filePath, fileList)
      } else if (SCAN_EXTENSIONS.includes(path.extname(filePath))) {
        fileList.push(filePath)
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
  
  return fileList
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const issues = []
  
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]
    const lineNumber = lineIndex + 1
    
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
      continue
    }
    
    for (const { pattern, replacement, name, severity } of RTL_PATTERNS) {
      const matches = [...line.matchAll(pattern)]
      
      for (const match of matches) {
        if (match.index === undefined) continue
        
        const original = match[0]
        
        // Skip if already using RTL-aware class
        if (original.includes('me-') || original.includes('ms-') || 
            original.includes('pe-') || original.includes('ps-') || 
            original.includes('text-start') || original.includes('text-end') || 
            original.includes('start-') || original.includes('end-')) {
          continue
        }
        
        let fixed = original
        if (typeof replacement === 'function') {
          fixed = replacement(original)
        } else {
          fixed = original.replace(pattern, replacement)
        }
        
        // Skip if replacement is same as original
        if (fixed === original) continue
        
        issues.push({
          file: filePath,
          line: lineNumber,
          column: match.index + 1,
          original,
          replacement: fixed,
          severity,
          pattern: name,
          context: line.trim(),
        })
      }
    }
  }
  
  return issues
}

function scanCodebase(rootDir = process.cwd()) {
  const files = getAllFiles(rootDir)
  const allIssues = []
  const issuesByFile = new Map()
  
  console.log(`📁 Scanning ${files.length} files...\n`)
  
  for (const file of files) {
    const issues = scanFile(file)
    if (issues.length > 0) {
      allIssues.push(...issues)
      issuesByFile.set(file, issues)
    }
  }
  
  // Group by pattern
  const patternCounts = new Map()
  for (const issue of allIssues) {
    const key = issue.pattern
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
    allIssues,
  }
}

function generateReport(result) {
  let report = '# RTL Hardcoded Classes Scan Report\n\n'
  report += `**Generated:** ${new Date().toISOString()}\n\n`
  report += `## Summary\n\n`
  report += `- **Total Issues Found:** ${result.totalIssues}\n`
  report += `- **High Priority:** ${result.issuesBySeverity.high}\n`
  report += `- **Medium Priority:** ${result.issuesBySeverity.medium}\n`
  report += `- **Low Priority:** ${result.issuesBySeverity.low}\n\n`
  
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
    const relativePath = file.replace(process.cwd() + path.sep, '')
    report += `### ${relativePath}\n\n`
    report += `**${issues.length} issue(s)**\n\n`
    
    // Group by line
    const issuesByLine = new Map()
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

function applyFixes(result, dryRun = true) {
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n')
  }
  
  let totalFixed = 0
  const filesToFix = new Map()
  
  // Group fixes by file
  for (const issue of result.allIssues) {
    if (!filesToFix.has(issue.file)) {
      filesToFix.set(issue.file, [])
    }
    filesToFix.get(issue.file).push(issue)
  }
  
  for (const [file, issues] of filesToFix.entries()) {
    let content = fs.readFileSync(file, 'utf-8')
    let fileFixed = 0
    
    // Sort issues by line number (descending) to avoid offset issues
    const sortedIssues = [...issues].sort((a, b) => b.line - a.line)
    
    for (const issue of sortedIssues) {
      const lines = content.split('\n')
      const lineIndex = issue.line - 1
      
      if (lineIndex >= 0 && lineIndex < lines.length) {
        const line = lines[lineIndex]
        
        if (line.includes(issue.original)) {
          // Escape special regex characters
          const escaped = issue.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const regex = new RegExp(`\\b${escaped}\\b`, 'g')
          const newLine = line.replace(regex, issue.replacement)
          lines[lineIndex] = newLine
          content = lines.join('\n')
          fileFixed++
        }
      }
    }
    
    if (fileFixed > 0) {
      totalFixed += fileFixed
      if (!dryRun) {
        fs.writeFileSync(file, content, 'utf-8')
        console.log(`✅ Fixed ${fileFixed} issue(s) in ${file.replace(process.cwd() + path.sep, '')}`)
      } else {
        console.log(`🔧 Would fix ${fileFixed} issue(s) in ${file.replace(process.cwd() + path.sep, '')}`)
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
console.log('='.repeat(50) + '\n')

const result = scanCodebase()

console.log(`\n📊 Scan Complete!\n`)
console.log(`Total Issues: ${result.totalIssues}`)
console.log(`  🔴 High Priority: ${result.issuesBySeverity.high}`)
console.log(`  🟡 Medium Priority: ${result.issuesBySeverity.medium}`)
console.log(`  🟢 Low Priority: ${result.issuesBySeverity.low}`)
console.log(`\nFiles Affected: ${result.issuesByFile.size}\n`)

if (result.summary.length > 0) {
  console.log('Top patterns found:')
  result.summary.slice(0, 10).forEach(item => {
    console.log(`  ${item.pattern}: ${item.count} instance(s) → ${item.replacement}`)
  })
  console.log('')
}

// Generate report
const report = generateReport(result)
fs.writeFileSync('RTL_SCAN_REPORT.md', report, 'utf-8')
console.log('📄 Detailed report saved to: RTL_SCAN_REPORT.md\n')

if (shouldFix) {
  console.log('='.repeat(50))
  applyFixes(result, dryRun)
  
  if (dryRun) {
    console.log('\n💡 To apply fixes, run: npm run rtl:fix')
  }
} else {
  console.log('💡 To see what would be fixed, run: npm run rtl:scan --fix')
}

// Exit with error code if issues found
process.exit(result.totalIssues > 0 ? 1 : 0)
