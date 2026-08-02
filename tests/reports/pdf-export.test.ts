import { describe, it, expect, vi, afterEach } from 'vitest'
import { exportToPDF } from '@/lib/reports/export'

/**
 * Regression cover for the jsPDF v3 -> v4 upgrade.
 *
 * Both PDF call sites fail *silently at runtime* rather than at compile time,
 * so `typecheck` and `build` prove nothing about them:
 *
 *   - `lib/reports/export.ts` imports the default export and calls `new jsPDF()`.
 *   - `components/canvas/export-dialog.tsx:153` resolves the constructor at
 *     runtime with `jsPDFModule.jsPDF || jsPDFModule.default`, so a changed
 *     export shape yields `undefined` and throws only when a user clicks
 *     Export.
 *
 * jsPDF ships two builds and the module namespace differs between them: the ESM
 * build (`browser`/`default` condition, which is what webpack gives the client
 * bundle) exposes `default` as the constructor, while the Node CJS build
 * exposes `default` as a plain object with the constructor hanging off it. That
 * is true of v3 and v4 alike — these tests exist to catch the version where it
 * stops being true.
 */
describe('report PDF export', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('resolves a usable constructor through both import patterns the app uses', async () => {
    const mod = await import('jspdf')

    // The export-dialog.tsx pattern. Whichever build resolves here, at least
    // one of these must be the constructor or the canvas export breaks.
    const Resolved = (mod as any).jsPDF || (mod as any).default
    expect(typeof Resolved).toBe('function')

    const doc = new Resolved({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    // The exact API surface lib/reports/export.ts depends on. A rename in any
    // of these is a breaking change that nothing else in CI would catch.
    expect(typeof doc.internal.pageSize.getWidth()).toBe('number')
    expect(typeof doc.internal.pageSize.getHeight()).toBe('number')
    expect(typeof doc.setFontSize).toBe('function')
    expect(typeof doc.setFont).toBe('function')
    expect(typeof doc.setTextColor).toBe('function')
    expect(typeof doc.text).toBe('function')
    expect(typeof doc.splitTextToSize).toBe('function')
    expect(typeof doc.addPage).toBe('function')
    expect(typeof doc.addImage).toBe('function')
    expect(typeof doc.save).toBe('function')
  })

  it('produces a real PDF payload', async () => {
    const mod = await import('jspdf')
    const Resolved = (mod as any).jsPDF || (mod as any).default
    const doc = new Resolved({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Smoke test', 20, 20)

    const bytes = new Uint8Array(doc.output('arraybuffer'))
    expect(bytes.byteLength).toBeGreaterThan(0)

    // Every PDF starts with the %PDF- magic number.
    expect(String.fromCharCode(...bytes.subarray(0, 5))).toBe('%PDF-')
  })

  it('runs exportToPDF end to end against the real library', async () => {
    // chartData is deliberately long enough to cross a page boundary and
    // exercise the addPage() branch.
    const chartData = Array.from({ length: 60 }, (_, i) => ({
      name: `Row ${i}`,
      value: i,
    }))

    // Nothing is stubbed. Every jsPDF call in the function body runs for real —
    // construction, splitTextToSize wrapping, setFont/setTextColor, the
    // addPage() page break, and the closing save(). If any of them were renamed
    // or removed in a future major, this rejects. `save()` is a no-op download
    // under jsdom (URL.createObjectURL is undefined), which is why reaching the
    // end without throwing is the assertion.
    await expect(
      exportToPDF({
        reportName: 'Squad Availability',
        description:
          'A description long enough to exercise splitTextToSize wrapping across more than a single rendered line of body copy.',
        metadata: {
          totalRecords: 60,
          dateRange: { from: new Date('2026-01-01'), to: new Date('2026-06-30') },
        },
        kpis: { 'Matches Played': 24, 'Average Availability': 87 },
        chartData,
      })
    ).resolves.toBeUndefined()
  })
})
