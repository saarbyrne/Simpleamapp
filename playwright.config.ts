import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const webCommand = process.env.PLAYWRIGHT_WEB_COMMAND ?? 'npm run dev';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  // Was false, which ran every test serially across four browsers — 336 tests
  // taking 21 minutes. Nothing here shares state between tests.
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // Chromium only by default. Running all four browsers quadrupled the cost of
  // a suite whose assertions are browser-agnostic. Set PLAYWRIGHT_ALL_BROWSERS=1
  // for a cross-browser pass when that is actually the question being asked.
  projects: process.env.PLAYWRIGHT_ALL_BROWSERS
    ? [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
      ]
    : [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: webCommand,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
