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
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
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
