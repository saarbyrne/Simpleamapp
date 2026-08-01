import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Whether a Storybook config exists in the repo.
 *
 * Some e2e specs drive components through Storybook stories on
 * `http://localhost:6006` rather than through the app. Storybook is not
 * configured yet — it is being built properly in #120 — so those specs have no
 * server to talk to and fail with ERR_CONNECTION_REFUSED on every commit.
 *
 * Specs that depend on Storybook gate themselves on this flag so they report as
 * skipped rather than failed, and re-activate on their own the moment #120 adds
 * `.storybook/main.ts`. See #199.
 *
 * Playwright runs from the repo root, so cwd is the right base.
 */
export const storybookConfigured =
  existsSync(join(process.cwd(), '.storybook', 'main.ts')) ||
  existsSync(join(process.cwd(), '.storybook', 'main.js'))

export const STORYBOOK_SKIP_REASON =
  'Storybook is not configured yet — these specs drive stories on localhost:6006. Re-activates automatically when #120 adds .storybook/main.ts. See #199.'
