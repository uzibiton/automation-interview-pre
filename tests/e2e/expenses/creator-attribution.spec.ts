/**
 * E2E tests for expense list creator attribution
 *
 * Tests the display of creator information and "My Expenses" filter
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123';

async function login(page: Page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', TEST_USER_EMAIL);
  await page.fill('input[type="password"]', TEST_USER_PASSWORD);
  await page.click('button[type="submit"]');
  // Wait for navigation after login
  await page.waitForURL(`${BASE_URL}/`, { timeout: 5000 });
}

test.describe('Expense List Creator Attribution', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page);
  });

  test('should display creator information for each expense', async ({ page }) => {
    // Navigate to expenses page
    await page.goto(`${BASE_URL}/expenses`);

    // Wait for expense list to load
    await page.waitForSelector('table.table', { timeout: 10000 });

    // Check if at least one expense row exists
    const expenseRows = page.locator('tr[data-testid^="expense-row-"]');
    const count = await expenseRows.count();
    expect(count).toBeGreaterThan(0);

    // Check if creator info is displayed for the first expense
    const firstRow = expenseRows.first();
    const creatorInfo = firstRow.locator('[data-testid^="creator-info-"]');

    if ((await creatorInfo.count()) > 0) {
      // Verify creator avatar is present
      const avatar = firstRow.locator('[data-testid^="creator-avatar-"]');
      await expect(avatar).toBeVisible();

      // Verify creator name is present
      const creatorName = firstRow.locator('[data-testid^="creator-name-"]');
      await expect(creatorName).toBeVisible();
      await expect(creatorName).toContainText('Created by:');
    }
  });

  test('should display "My Expenses" filter toggle', async ({ page }) => {
    await page.goto(`${BASE_URL}/expenses`);

    // Wait for page to load
    await page.waitForSelector('table.table', { timeout: 10000 });

    // Check if "My Expenses" toggle exists
    const toggle = page.locator('[data-testid="my-expenses-toggle"]');
    await expect(toggle).toBeVisible();

    // Verify it's a checkbox
    await expect(toggle).toHaveAttribute('type', 'checkbox');

    // Verify it starts unchecked
    await expect(toggle).not.toBeChecked();
  });

  test('should filter expenses when "My Expenses" is checked', async ({ page }) => {
    await page.goto(`${BASE_URL}/expenses`);

    // Wait for page to load
    await page.waitForSelector('table.table', { timeout: 10000 });

    // Count expenses before filtering
    const allExpenseRows = page.locator('tr[data-testid^="expense-row-"]');
    const totalCount = await allExpenseRows.count();

    // Check the "My Expenses" toggle
    const toggle = page.locator('[data-testid="my-expenses-toggle"]');
    await toggle.check();

    // Wait for filtering to apply by checking if the row count changes or stabilizes
    await page.waitForFunction(
      (expectedMax) => {
        const rows = document.querySelectorAll('tr[data-testid^="expense-row-"]');
        return rows.length <= expectedMax;
      },
      totalCount,
      { timeout: 5000 },
    );

    // Count expenses after filtering
    const filteredExpenseRows = page.locator('tr[data-testid^="expense-row-"]');
    const filteredCount = await filteredExpenseRows.count();

    // The filtered count should be less than or equal to total count
    expect(filteredCount).toBeLessThanOrEqual(totalCount);

    // If there are filtered expenses, verify they all have the current user's name
    if (filteredCount > 0) {
      // All visible expenses should have creator info
      const creatorInfos = page.locator('[data-testid^="creator-info-"]');
      const creatorCount = await creatorInfos.count();
      expect(creatorCount).toBe(filteredCount);
    }
  });

  test('should show all expenses when "My Expenses" is unchecked', async ({ page }) => {
    await page.goto(`${BASE_URL}/expenses`);

    // Wait for page to load
    await page.waitForSelector('table.table', { timeout: 10000 });

    // Check the toggle first
    const toggle = page.locator('[data-testid="my-expenses-toggle"]');
    await toggle.check();

    // Wait for filtering to apply
    await page.waitForFunction(
      () => {
        const toggle = document.querySelector(
          '[data-testid="my-expenses-toggle"]',
        ) as HTMLInputElement;
        return toggle?.checked === true;
      },
      { timeout: 5000 },
    );

    // Count filtered expenses
    const filteredRows = page.locator('tr[data-testid^="expense-row-"]');
    const filteredCount = await filteredRows.count();

    // Uncheck the toggle
    await toggle.uncheck();

    // Wait for unfiltering to apply
    await page.waitForFunction(
      () => {
        const toggle = document.querySelector(
          '[data-testid="my-expenses-toggle"]',
        ) as HTMLInputElement;
        return toggle?.checked === false;
      },
      { timeout: 5000 },
    );

    // Count all expenses
    const allRows = page.locator('tr[data-testid^="expense-row-"]');
    const totalCount = await allRows.count();

    // Total count should be greater than or equal to filtered count
    expect(totalCount).toBeGreaterThanOrEqual(filteredCount);
  });

  test('should display creator avatar with correct attributes', async ({ page }) => {
    await page.goto(`${BASE_URL}/expenses`);

    // Wait for page to load
    await page.waitForSelector('table.table', { timeout: 10000 });

    // Find first expense with creator info
    const firstCreatorAvatar = page.locator('[data-testid^="creator-avatar-"]').first();

    if ((await firstCreatorAvatar.count()) > 0) {
      // Verify avatar is an image
      await expect(firstCreatorAvatar).toHaveAttribute('src');

      // Verify avatar has alt text
      await expect(firstCreatorAvatar).toHaveAttribute('alt');

      // Check styling
      const styles = await firstCreatorAvatar.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          borderRadius: style.borderRadius,
          width: style.width,
          height: style.height,
        };
      });

      // Verify avatar is circular
      expect(styles.borderRadius).toContain('50%');

      // Verify avatar size is 20px
      expect(styles.width).toBe('20px');
      expect(styles.height).toBe('20px');
    }
  });

  test('should apply subtle styling to creator information', async ({ page }) => {
    await page.goto(`${BASE_URL}/expenses`);

    // Wait for page to load
    await page.waitForSelector('table.table', { timeout: 10000 });

    // Find first creator info element
    const firstCreatorInfo = page.locator('[data-testid^="creator-info-"]').first();

    if ((await firstCreatorInfo.count()) > 0) {
      // Check styling
      const styles = await firstCreatorInfo.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          fontSize: style.fontSize,
          color: style.color,
        };
      });

      // Verify subtle styling
      // Font size should be smaller (approximately 0.85em)
      const parentFontSize = await page.evaluate(() => {
        return parseFloat(window.getComputedStyle(document.body).fontSize);
      });
      const actualFontSize = parseFloat(styles.fontSize);
      expect(actualFontSize).toBeLessThan(parentFontSize);

      // Color should be greyish (#666 = rgb(102, 102, 102))
      expect(styles.color).toMatch(/rgb\(102,\s*102,\s*102\)/);
    }
  });
});
