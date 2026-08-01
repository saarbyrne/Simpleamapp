import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      // No thresholds. There were four set to 80%, but CI never passed
      // --coverage so they were never evaluated — real coverage is nearer 8%
      // (35 test files against 428 source files). A threshold that cannot fail
      // is worse than none: it reads as a guarantee. #157 sets an honest floor
      // and enforces it once there is coverage worth gating.
    },
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: [
      'tests/e2e/**',
      'tests/design-system/accessibility.test.ts',
      'tests/design-system/visual-regression.test.ts',
      'node_modules/**',
    ],
  },
});
