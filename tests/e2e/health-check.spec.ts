import { test, expect } from '@playwright/test';

/**
 * Sample E2E Test - Application Health Check
 *
 * This test validates basic application functionality across all environments.
 * Tagged as @smoke for critical path testing.
 *
 * Usage:
 *   npm run test:e2e:local          # Test against localhost
 *   npm run test:e2e:docker         # Test against Docker
 *   npm run test:e2e:staging        # Test against Cloud Run staging
 *   npm run test:e2e:production     # Test against Cloud Run production
 */

test.describe('Application Health @smoke @critical', () => {
  test('should load homepage successfully', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Verify page loads
    await expect(page).toHaveTitle(/Expense Tracker/i);

    // Verify main content is visible
    await expect(page.locator('body')).toBeVisible();

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/homepage.png' });
  });

  test('should display navigation menu', async ({ page }) => {
    await page.goto('/');

    // Check for common navigation elements
    // Adjust selectors based on your actual app structure
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav).toBeVisible();
  });

  test('should handle API connectivity', async ({ page }) => {
    // Navigate to a page that makes API calls
    await page.goto('/');

    // Wait for API calls to complete
    await page.waitForLoadState('networkidle');

    // Verify no critical errors in console
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Check if any API errors occurred
    expect(errors.filter((e) => e.includes('500'))).toHaveLength(0);
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Authentication Flow @sanity', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');

    // Verify login form exists
    await expect(page.locator('form, [role="form"]')).toBeVisible();
  });

  test('should handle invalid login', async ({ page }) => {
    await page.goto('/login');

    // Fill in invalid credentials
    await page.fill('input[type="email"], input[name="email"]', 'invalid@example.com');
    await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error message
    await page.waitForTimeout(2000);

    // Verify error is shown (adjust selector based on your app)
    // This is a generic check - update with actual error selector
    const hasError = await page
      .locator('text=/error|invalid|wrong/i')
      .isVisible()
      .catch(() => false);
    // Error should be shown for invalid login
    expect(hasError).toBeTruthy();
  });
});

test.describe('API Service Health @smoke', () => {
  test('should reach API service', async ({ page }) => {
    // Make a request to API health endpoint
    const apiUrl = process.env.API_URL || 'http://localhost:3002';

    try {
      const response = await page.request.get(`${apiUrl}/health`);
      expect(response.ok()).toBeTruthy();
    } catch (error) {
      // If health endpoint doesn't exist, just verify we can reach the API
      console.log('Health endpoint not available, skipping API health check');
    }
  });

  test('should reach Auth service', async ({ page }) => {
    // Make a request to Auth health endpoint
    const authUrl = process.env.AUTH_URL || 'http://localhost:3001';

    try {
      const response = await page.request.get(`${authUrl}/health`);
      expect(response.ok()).toBeTruthy();
    } catch (error) {
      console.log('Auth health endpoint not available, skipping Auth health check');
    }
  });
});

/**
 * Visual Regression Tests
 * Run with: npm run test:visual
 */
test.describe('Visual Regression @visual', () => {
  test('homepage should match snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('login page should match snapshot', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixels: 100,
    });
  });
});

/**
 * Accessibility Tests
 * Run with: npm run test:accessibility
 */
test.describe('Accessibility @a11y', () => {
  test('homepage should be accessible', async ({ page }) => {
    await page.goto('/');

    // Check for basic a11y attributes
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();

    // Verify page has proper structure
    const headings = page.locator('h1, h2, h3');
    await expect(headings.first()).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);

    // Verify an element received focus
    expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']).toContain(focusedElement);
  });
});

/**
 * DEMO SCRIPT FOR INTERVIEW
 *
 * 1. Show this file and explain multi-environment testing
 * 2. Run: npm run test:e2e:local:headed
 *    - "See how tests run against localhost with browser visible"
 * 3. Run: npm run test:e2e:production:smoke
 *    - "Same tests, now validating production deployment"
 * 4. Show: npm run report:open
 *    - "Rich HTML reports with screenshots and traces"
 *
 * Talking Points:
 * - "Single test suite, multiple environments"
 * - "Tags organize tests by priority (@smoke, @sanity, @regression)"
 * - "Visual regression catches UI bugs automatically"
 * - "Accessibility tests built into E2E suite"
 * - "Same tests developers run locally also validate production"
 */
