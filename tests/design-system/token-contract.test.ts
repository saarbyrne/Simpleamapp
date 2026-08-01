/**
 * Design token contract tests.
 *
 * `tests/design-system/tokens.test.ts` asserts the TypeScript token objects are
 * populated. It cannot catch the class of bug these tests exist for: the
 * Tailwind config and `app/globals.css` disagreeing about what a token *is*.
 *
 * That disagreement shipped. The config wrapped every token in `hsl(...)` while
 * globals.css defined them as `oklch(...)`, generating `hsl(oklch(0.646 ...))` —
 * invalid CSS, silently dropped by every browser. ~154 usages of
 * `border-primary`, `bg-primary/*`, `bg-destructive/*` and `ring-primary`
 * rendered no colour at all, and nothing failed. See issue #149.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const tailwindConfig = require('../../tailwind.config.js')

const globalsCss = readFileSync(join(__dirname, '../../app/globals.css'), 'utf8')

/** Custom properties declared in a given top-level block of globals.css. */
function declaredIn(selector: string): Set<string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const block = globalsCss.match(new RegExp(`^${escaped} \\{\\n(?:.*\\n)*?\\}`, 'm'))
  if (!block) throw new Error(`No \`${selector}\` block found in app/globals.css`)
  return new Set(Array.from(block[0].matchAll(/^\s*(--[\w-]+):/gm), (m) => m[1]))
}

/** Every colour string in theme.extend.colors, flattened to [path, value]. */
function colorEntries(): Array<[string, string]> {
  const out: Array<[string, string]> = []
  const walk = (node: unknown, path: string) => {
    if (typeof node === 'string') return void out.push([path, node])
    if (node && typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        walk(value, path ? `${path}.${key}` : key)
      }
    }
  }
  walk(tailwindConfig.theme.extend.colors, '')
  return out
}

const rootTokens = declaredIn(':root')
const colors = colorEntries()

describe('design token contract', () => {
  it('resolves every token the Tailwind config references', () => {
    const missing = colors.flatMap(([path, value]) =>
      Array.from(value.matchAll(/var\((--[\w-]+)\)/g))
        .map((m) => m[1])
        .filter((name) => !rootTokens.has(name))
        .map((name) => `${path} → ${name}`)
    )

    // `--destructive-foreground` was referenced by the config and consumed by
    // `.text-destructive-foreground`, but declared nowhere.
    expect(missing).toEqual([])
  })

  it('never nests one colour function inside another', () => {
    // The tokens in globals.css are already complete colours. Wrapping them in
    // a second colour function is the #149 bug. `color-mix()` is not a colour
    // function in this sense — it composites a colour rather than declaring one.
    const nested = colors.filter(([, value]) =>
      /\b(?:hsl|rgb|hsla|rgba|oklch|lab|lch|hwb)\(\s*var\(/.test(value)
    )

    expect(nested.map(([path, value]) => `${path}: ${value}`)).toEqual([])
  })

  it('keeps opacity modifiers working on every semantic colour', () => {
    // Without the `<alpha-value>` placeholder, `bg-primary/50` silently drops
    // its opacity. 163 usages across the app depend on this.
    const withoutAlpha = colors
      .filter(([path]) => !path.endsWith('hover')) // hover tokens are used bare, by design
      .filter(([, value]) => !value.includes('<alpha-value>'))

    expect(withoutAlpha.map(([path]) => path)).toEqual([])
  })

  it('declares every themed token in the dark block too', () => {
    // A token present in :root but missing from .dark keeps its light value in
    // dark mode. Only tokens that are genuinely theme-invariant may be absent.
    const themeInvariant = new Set([
      '--font-size',
      '--radius',
      '--chart-1',
      '--chart-2',
      '--chart-3',
      '--chart-4',
      '--chart-5',
    ])
    const darkTokens = declaredIn('.dark')
    const orphans = Array.from(rootTokens).filter(
      (name) => !darkTokens.has(name) && !themeInvariant.has(name)
    )

    expect(orphans).toEqual([])
  })
})
