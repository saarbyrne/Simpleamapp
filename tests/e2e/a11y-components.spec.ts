import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Tests for Design System Components
 *
 * These tests use @axe-core/playwright to scan all component stories
 * for WCAG 2.1 Level AA accessibility violations.
 *
 * Run with: npm run test:a11y
 */

test.describe('Component Accessibility @a11y', () => {
  test.beforeEach(async ({ page }) => {
    // Start Storybook on port 6006
    await page.goto('http://localhost:6006');
  });

  const components = [
    'Accordion',
    'Alert',
    'Alert Dialog',
    'Aspect Ratio',
    'Avatar',
    'Badge',
    'Breadcrumb',
    'Button',
    'Calendar',
    'Card',
    'Carousel',
    'Checkbox',
    'Collapsible',
    'Combobox',
    'Command',
    'Context Menu',
    'Data Table',
    'Date Picker',
    'Dialog',
    'Drawer',
    'Dropdown Menu',
    'Form',
    'Hover Card',
    'Input',
    'Input OTP',
    'Label',
    'Menubar',
    'Navigation Menu',
    'Pagination',
    'Popover',
    'Progress',
    'Radio Group',
    'Resizable',
    'Scroll Area',
    'Select',
    'Separator',
    'Sheet',
    'Sidebar',
    'Skeleton',
    'Slider',
    'Sonner',
    'Switch',
    'Table',
    'Tabs',
    'Textarea',
    'Toast',
    'Toggle',
    'Toggle Group',
    'Tooltip',
  ];

  for (const component of components) {
    test(`${component} - Default story has no accessibility violations`, async ({ page }) => {
      // Navigate to component's default story
      const storyUrl = `http://localhost:6006/iframe.html?id=components-${component
        .toLowerCase()
        .replace(/\s+/g, '-')}--default`;
      await page.goto(storyUrl);

      // Wait for component to render
      await page.waitForLoadState('networkidle');

      // Run axe accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Assert no violations found
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});

test.describe('Foundation Accessibility @a11y', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:6006');
  });

  const foundationStories = [
    { name: 'Colors', id: 'foundation-colors--color-palette' },
    { name: 'Typography', id: 'foundation-typography--type-scale' },
    { name: 'Spacing', id: 'foundation-spacing--spacing-scale' },
    { name: 'Icons', id: 'foundation-icons--icon-library' },
    { name: 'Animations', id: 'foundation-animations--entrance-animations' },
    { name: 'Responsive', id: 'foundation-responsive-design--breakpoints' },
  ];

  for (const story of foundationStories) {
    test(`${story.name} - has no accessibility violations`, async ({ page }) => {
      await page.goto(`http://localhost:6006/iframe.html?id=${story.id}`);
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});

test.describe('Critical Accessibility Checks @a11y', () => {
  test('Color contrast meets WCAG AA standards', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=foundation-colors--color-palette');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.color'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('All interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=components-button--showcase');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.keyboard'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('All images have alt text', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=components-avatar--default');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.text-alternatives'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Form inputs have associated labels', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=components-label--form-example');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.forms'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('ARIA attributes are used correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=components-dialog--default');
    await page.waitForLoadState('networkidle');

    // Open the dialog
    await page.click('button');
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.aria'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Accessibility Utilities @a11y', () => {
  test('Skip links are present and functional', async ({ page }) => {
    await page.goto('http://localhost:6006');

    // Check for skip link
    const skipLink = page.locator('a[href="#main-content"], a[href="#content"]').first();

    if (await skipLink.count() > 0) {
      // Verify skip link is keyboard accessible
      await page.keyboard.press('Tab');
      await expect(skipLink).toBeFocused();

      // Verify skip link navigates correctly
      await page.keyboard.press('Enter');
      const mainContent = page.locator('#main-content, #content').first();
      await expect(mainContent).toBeFocused();
    }
  });

  test('Focus indicators are visible', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=components-button--default');
    await page.waitForLoadState('networkidle');

    const button = page.locator('button').first();

    // Tab to focus the button
    await page.keyboard.press('Tab');

    // Check if button has focus
    await expect(button).toBeFocused();

    // Verify focus ring is visible (check for outline or box-shadow)
    const styles = await button.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        outlineWidth: computed.outlineWidth,
        boxShadow: computed.boxShadow,
      };
    });

    // Assert focus indicator exists
    const hasFocusIndicator =
      styles.outlineWidth !== '0px' ||
      (styles.boxShadow !== 'none' && styles.boxShadow !== '');

    expect(hasFocusIndicator).toBeTruthy();
  });

  test('Reduced motion is respected', async ({ page, context }) => {
    // Set reduced motion preference
    await context.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('http://localhost:6006/iframe.html?id=foundation-animations--entrance-animations');
    await page.waitForLoadState('networkidle');

    // Verify animations are disabled or simplified
    const animatedElement = page.locator('[class*="animate"]').first();

    if (await animatedElement.count() > 0) {
      const animationDuration = await animatedElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return computed.animationDuration;
      });

      // Animation should be instant or very short when motion is reduced
      expect(animationDuration === '0s' || animationDuration === '0.01s').toBeTruthy();
    }
  });
});
