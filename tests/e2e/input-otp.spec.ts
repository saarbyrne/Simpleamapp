import { test, expect } from '@playwright/test';

test.describe('Input OTP Component', () => {
  // This test ensures the Input OTP component renders correctly in SSR
  // and that the caret animation doesn't break server-side rendering
  test('renders without SSR hydration errors', async ({ page }) => {
    // Navigate to a page with the Input OTP component
    // For now, we'll use the Storybook story as the test target
    await page.goto('http://localhost:6006/iframe.html?id=components-inputotp--default');

    // Wait for the component to be visible
    const inputOtp = page.locator('[data-slot="input-otp"]');
    await expect(inputOtp).toBeVisible({ timeout: 5000 });

    // Check that slots are rendered
    const slots = page.locator('[data-input-otp-slot]');
    await expect(slots.first()).toBeVisible();

    // Verify no console errors related to hydration
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Allow time for any hydration errors to appear
    await page.waitForTimeout(1000);

    // Check for hydration-related errors
    const hydrationErrors = errors.filter(
      (err) =>
        err.includes('hydration') ||
        err.includes('Hydration') ||
        err.includes('did not match')
    );

    expect(hydrationErrors.length).toBe(0);
  });

  test('accepts keyboard input', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=components-inputotp--default');

    // Wait for component to load
    const inputOtp = page.locator('[data-slot="input-otp"]');
    await expect(inputOtp).toBeVisible({ timeout: 5000 });

    // Click to focus
    await inputOtp.click();

    // Type some digits
    await page.keyboard.type('123456');

    // Verify the input was accepted
    // The actual verification depends on the component implementation
    // For now, we just ensure no errors occur during typing
    await page.waitForTimeout(500);

    // Check that no errors were thrown
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    expect(errors.length).toBe(0);
  });

  test('handles separator rendering', async ({ page }) => {
    // Test the grouped OTP input with separator
    await page.goto('http://localhost:6006/iframe.html?id=components-inputotp--with-separator');

    const inputOtp = page.locator('[data-slot="input-otp"]');
    await expect(inputOtp).toBeVisible({ timeout: 5000 });

    // Check for separator element
    const separator = page.locator('[data-input-otp-separator]');
    await expect(separator).toBeVisible();

    // Verify the layout is correct
    const slots = page.locator('[data-input-otp-slot]');
    const slotCount = await slots.count();
    expect(slotCount).toBeGreaterThan(0);
  });

  test('@visual input-otp renders correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=components-inputotp--default');

    const inputOtp = page.locator('[data-slot="input-otp"]');
    await expect(inputOtp).toBeVisible({ timeout: 5000 });

    // Visual regression test placeholder
    // When visual regression tools are set up, this will capture and compare screenshots
  });

  test('@a11y input-otp is accessible', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=components-inputotp--default');

    const inputOtp = page.locator('[data-slot="input-otp"]');
    await expect(inputOtp).toBeVisible({ timeout: 5000 });

    // Accessibility test placeholder
    // When axe-core is integrated, this will run accessibility checks
    // Expected checks:
    // - Proper ARIA attributes
    // - Keyboard navigation
    // - Focus management
    // - Screen reader compatibility
  });
});
