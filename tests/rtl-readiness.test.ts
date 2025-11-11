import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

/**
 * RTL Readiness Test
 * 
 * Tests that the codebase is ready for RTL support by checking for
 * hardcoded directional classes.
 */

describe('RTL Readiness', () => {
  const RTL_PATTERNS = [
    { pattern: /\bmr-(\d+|auto)\b/g, name: 'margin-right', replacement: 'me-*' },
    { pattern: /\bml-(\d+|auto)\b/g, name: 'margin-left', replacement: 'ms-*' },
    { pattern: /\bpr-(\d+|auto)\b/g, name: 'padding-right', replacement: 'pe-*' },
    { pattern: /\bpl-(\d+|auto)\b/g, name: 'padding-left', replacement: 'ps-*' },
    { pattern: /\btext-left\b/g, name: 'text-left', replacement: 'text-start' },
    { pattern: /\btext-right\b/g, name: 'text-right', replacement: 'text-end' },
    { pattern: /\bright-(\d+|\[.*?\])/g, name: 'right-*', replacement: 'end-*' },
    { pattern: /\bleft-(\d+|\[.*?\])/g, name: 'left-*', replacement: 'start-*' },
  ]

  const IGNORE_PATTERNS = [
    /node_modules/,
    /\.next/,
    /\.git/,
    /dist/,
    /build/,
    /\.bak$/,
    /\.test\./,
    /\.spec\./,
    /rtl-scanner\.ts/,
    /RTL_.*\.md/,
  ]

  const SCAN_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js']

  function getAllFiles(dir: string, fileList: string[] = []): string[] {
    try {
      const files = readdirSync(dir)
      
      for (const file of files) {
        const filePath = join(dir, file)
        
        if (IGNORE_PATTERNS.some(pattern => pattern.test(filePath))) {
          continue
        }
        
        const stat = statSync(filePath)
        
        if (stat.isDirectory()) {
          getAllFiles(filePath, fileList)
        } else if (SCAN_EXTENSIONS.includes(extname(filePath))) {
          fileList.push(filePath)
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
    
    return fileList
  }

  function scanFile(filePath: string): Array<{ pattern: string; line: number; match: string; replacement: string }> {
    const content = readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    const issues: Array<{ pattern: string; line: number; match: string; replacement: string }> = []
    
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex]
      
      for (const { pattern, name, replacement } of RTL_PATTERNS) {
        const matches = [...line.matchAll(pattern)]
        
        for (const match of matches) {
          const matched = match[0]
          
          // Skip if already using RTL-aware class
          if (matched.includes('me-') || matched.includes('ms-') || 
              matched.includes('pe-') || matched.includes('ps-') || 
              matched.includes('text-start') || matched.includes('text-end') || 
              matched.includes('start-') || matched.includes('end-')) {
            continue
          }
          
          // Skip comments
          if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
            continue
          }
          
          issues.push({
            pattern: name,
            line: lineIndex + 1,
            match: matched,
            replacement,
          })
        }
      }
    }
    
    return issues
  }

  const files = getAllFiles('components').concat(getAllFiles('app'))
  const allIssues: Array<{ file: string; pattern: string; line: number; match: string; replacement: string }> = []

  for (const file of files) {
    const issues = scanFile(file)
    for (const issue of issues) {
      allIssues.push({ ...issue, file })
    }
  }

  it('should not have hardcoded margin-left/right classes', () => {
    const marginIssues = allIssues.filter(i => i.pattern.includes('margin'))
    const fileGroups = new Map<string, number>()
    
    for (const issue of marginIssues) {
      fileGroups.set(issue.file, (fileGroups.get(issue.file) || 0) + 1)
    }
    
    if (marginIssues.length > 0) {
      const report = Array.from(fileGroups.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([file, count]) => `  ${file}: ${count} issue(s)`)
        .join('\n')
      
      expect(marginIssues.length).toBe(0)
    }
  })

  it('should not have hardcoded padding-left/right classes', () => {
    const paddingIssues = allIssues.filter(i => i.pattern.includes('padding'))
    
    if (paddingIssues.length > 0) {
      const report = paddingIssues
        .slice(0, 10)
        .map(i => `  ${i.file}:${i.line} - ${i.match} → ${i.replacement}`)
        .join('\n')
      
      expect(paddingIssues.length).toBe(0)
    }
  })

  it('should not have hardcoded text-left/right classes', () => {
    const textIssues = allIssues.filter(i => i.pattern.includes('text-'))
    
    if (textIssues.length > 0) {
      const report = textIssues
        .slice(0, 10)
        .map(i => `  ${i.file}:${i.line} - ${i.match} → ${i.replacement}`)
        .join('\n')
      
      expect(textIssues.length).toBe(0)
    }
  })

  it('should not have hardcoded left/right positioning classes', () => {
    const positionIssues = allIssues.filter(i => i.pattern.includes('left-') || i.pattern.includes('right-'))
    
    if (positionIssues.length > 0) {
      const report = positionIssues
        .slice(0, 10)
        .map(i => `  ${i.file}:${i.line} - ${i.match} → ${i.replacement}`)
        .join('\n')
      
      expect(positionIssues.length).toBe(0)
    }
  })

  it('should report all RTL issues found', () => {
    if (allIssues.length > 0) {
      const summary = new Map<string, number>()
      for (const issue of allIssues) {
        summary.set(issue.pattern, (summary.get(issue.pattern) || 0) + 1)
      }
      
      const report = Array.from(summary.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([pattern, count]) => `  ${pattern}: ${count} issue(s)`)
        .join('\n')
      
      console.log(`\n📊 RTL Issues Summary:\n${report}\n`)
      console.log(`Total issues found: ${allIssues.length}`)
      console.log(`Files affected: ${new Set(allIssues.map(i => i.file)).size}`)
    }
    
    // This test will fail until all issues are fixed
    expect(allIssues.length).toBe(0)
  })
})
