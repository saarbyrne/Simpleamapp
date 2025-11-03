import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 0.8,
        branches: 0.8,
        functions: 0.8,
        statements: 0.8,
      },
    },
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
});
