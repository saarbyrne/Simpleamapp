import { test, expect } from '@playwright/test';

test.describe('health endpoint', () => {
  test('reports application status', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();

    const payload = await response.json();
    expect(payload).toMatchObject({ status: 'ok' });
    expect(typeof payload.timestamp).toBe('string');
  });

  test('@visual placeholder', async () => {
    test.skip(); // Visual regression scenarios will be added later.
  });

  test('@a11y placeholder', async () => {
    test.skip(); // Accessibility journeys will be implemented via axe scans.
  });
});
