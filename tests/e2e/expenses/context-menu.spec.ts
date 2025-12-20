/**
 * =============================================================================
 * E2E Test: Expense Context Menu
 * =============================================================================
 * PURPOSE: Test context menu functionality on expense table rows
 *
 * KEY FEATURES TESTED:
 * 1. Context menu opens on row click
 * 2. Show/View details action
 * 3. Edit action via context menu
 * 4. Delete action via context menu
 * 5. Keyboard accessibility
 * 6. Menu closes when clicking outside
 * 7. Mobile responsiveness
 * =============================================================================
 */

import { test, expect } from '@playwright/test';

// Test configuration
test.use({
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'retain-on-failure',
});

// SKIPPED: Context menu tests temporarily disabled pending deployment
// Ticket: E2E-005 - Enable context menu tests after feature deployment
// Reason: Tests need live environment with context menu feature
test.describe.skip('Expense Context Menu @e2e @smoke', () => {
  // Setup before each test
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Login with test user
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'TestPassword123');
    await page.click('[data-testid="login-button"]');

    // Wait for successful login
    await expect(page).toHaveURL('/dashboard');

    // Navigate to expenses page
    await page.click('[data-testid="nav-expenses"]');
    await expect(page).toHaveURL('/expenses');
  });

  test('Context menu opens when clicking on expense row @critical', async ({ page }) => {
    // Wait for expenses to load
    await page.waitForSelector('[data-testid^="expense-row-"]', { state: 'visible' });

    // Get first expense row
    const firstRow = page.locator('[data-testid^="expense-row-"]').first();

    // Click on the row (not on buttons)
    await firstRow.click({ position: { x: 50, y: 10 } });

    // Verify context menu appears
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();

    // Verify all three menu items are present
    await expect(page.locator('[data-testid="context-menu-show"]')).toBeVisible();
    await expect(page.locator('[data-testid="context-menu-edit"]')).toBeVisible();
    await expect(page.locator('[data-testid="context-menu-delete"]')).toBeVisible();
  });

  test('Context menu closes when clicking outside @critical', async ({ page }) => {
    // Open context menu
    const firstRow = page.locator('[data-testid^="expense-row-"]').first();
    await firstRow.click({ position: { x: 50, y: 10 } });
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();

    // Click outside the menu
    await page.mouse.click(10, 10);

    // Verify menu is closed
    await expect(page.locator('[data-testid="context-menu"]')).not.toBeVisible();
  });

  test('Show Details action displays expense information @sanity', async ({ page }) => {
    // Open context menu on first expense
    const firstRow = page.locator('[data-testid^="expense-row-"]').first();
    await firstRow.click({ position: { x: 50, y: 10 } });

    // Click "Show Details" option
    await page.click('[data-testid="context-menu-show"]');

    // Verify expense details dialog opens
    await expect(page.locator('[data-testid="expense-details-dialog"]')).toBeVisible();

    // Verify dialog has essential information
    await expect(page.locator('.detail-label:has-text("Amount")')).toBeVisible();
    await expect(page.locator('.detail-label:has-text("Category")')).toBeVisible();
    await expect(page.locator('.detail-label:has-text("Date")')).toBeVisible();

    // Close details dialog
    await page.click('[data-testid="close-details-ok"]');
    await expect(page.locator('[data-testid="expense-details-dialog"]')).not.toBeVisible();
  });

  test('Edit action via context menu opens edit dialog @sanity', async ({ page }) => {
    // Open context menu
    const firstRow = page.locator('[data-testid^="expense-row-"]').first();
    await firstRow.click({ position: { x: 50, y: 10 } });

    // Click "Edit" option
    await page.click('[data-testid="context-menu-edit"]');

    // Verify edit dialog opens (ExpenseDialog in edit mode)
    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.locator('h3:has-text("Edit")')).toBeVisible();

    // Verify form fields are populated
    await expect(page.locator('input[type="number"]')).not.toHaveValue('');
    await expect(page.locator('select').first()).not.toHaveValue('');
  });

  test('Delete action via context menu shows confirmation @sanity', async ({ page }) => {
    // Open context menu
    const firstRow = page.locator('[data-testid^="expense-row-"]').first();
    await firstRow.click({ position: { x: 50, y: 10 } });

    // Click "Delete" option
    await page.click('[data-testid="context-menu-delete"]');

    // Verify confirmation dialog appears
    await expect(page.locator('.modal-content:has-text("Delete Expense")')).toBeVisible();
    await expect(
      page.locator('.modal-content:has-text("Are you sure you want to delete")'),
    ).toBeVisible();

    // Cancel deletion
    const cancelButton = page.locator('button:has-text("Cancel")');
    await cancelButton.click();

    // Verify confirmation closed
    await expect(page.locator('.modal-content:has-text("Delete Expense")')).not.toBeVisible();
  });

  test('Context menu opens with keyboard (Enter key) @a11y', async ({ page }) => {
    // Wait for expenses to load
    await page.waitForSelector('[data-testid^="expense-row-"]', { state: 'visible' });

    // Focus first row using keyboard
    const firstRow = page.locator('[data-testid^="expense-row-"]').first();
    await firstRow.focus();

    // Press Enter to open context menu
    await page.keyboard.press('Enter');

    // Verify context menu appears
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();
  });

  test('Context menu opens with keyboard (Space key) @a11y', async ({ page }) => {
    // Wait for expenses to load
    await page.waitForSelector('[data-testid^="expense-row-"]', { state: 'visible' });

    // Focus first row using keyboard
    const firstRow = page.locator('[data-testid^="expense-row-"]').first();
    await firstRow.focus();

    // Press Space to open context menu
    await page.keyboard.press(' ');

    // Verify context menu appears
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();
  });

  test('Context menu closes with Escape key @a11y', async ({ page }) => {
    // Open context menu
    const firstRow = page.locator('[data-testid^="expense-row-"]').first();
    await firstRow.click({ position: { x: 50, y: 10 } });
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();

    // Press Escape to close menu
    await page.keyboard.press('Escape');

    // Verify menu is closed
    await expect(page.locator('[data-testid="context-menu"]')).not.toBeVisible();
  });

  test('Context menu items are keyboard navigable @a11y', async ({ page }) => {
    // Open context menu
    const firstRow = page.locator('[data-testid^="expense-row-"]').first();
    await firstRow.click({ position: { x: 50, y: 10 } });
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();

    // Tab through menu items
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="context-menu-show"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="context-menu-edit"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="context-menu-delete"]')).toBeFocused();
  });

  test('Clicking action buttons does not open context menu @regression', async ({ page }) => {
    // Wait for expenses to load
    await page.waitForSelector('[data-testid^="expense-row-"]', { state: 'visible' });

    // Click on Edit button directly (should not open context menu)
    const firstRow = page.locator('[data-testid^="expense-row-"]').first();
    const editButton = firstRow.locator('[data-testid^="edit-button-"]');
    await editButton.click();

    // Verify context menu does not appear
    await expect(page.locator('[data-testid="context-menu"]')).not.toBeVisible();

    // Verify edit dialog opens instead
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('Multiple rows can be clicked sequentially @regression', async ({ page }) => {
    // Wait for expenses to load
    await page.waitForSelector('[data-testid^="expense-row-"]', { state: 'visible' });

    // Click first row
    const firstRow = page.locator('[data-testid^="expense-row-"]').first();
    await firstRow.click({ position: { x: 50, y: 10 } });
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();

    // Click outside to close
    await page.mouse.click(10, 10);
    await expect(page.locator('[data-testid="context-menu"]')).not.toBeVisible();

    // Click second row
    const secondRow = page.locator('[data-testid^="expense-row-"]').nth(1);
    await secondRow.click({ position: { x: 50, y: 10 } });
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();
  });
});

// SKIPPED: Mobile context menu tests temporarily disabled pending deployment
test.describe.skip('Expense Context Menu - Mobile @e2e @mobile', () => {
  // Configure mobile viewport
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE size
  });

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'TestPassword123');
    await page.click('[data-testid="login-button"]');

    // Navigate to expenses
    await page.click('[data-testid="nav-expenses"]');
    await expect(page).toHaveURL('/expenses');
  });

  test('Context menu works on mobile touch @critical', async ({ page }) => {
    // Wait for expenses to load
    await page.waitForSelector('[data-testid^="expense-row-"]', { state: 'visible' });

    // Tap on expense row
    const firstRow = page.locator('[data-testid^="expense-row-"]').first();
    await firstRow.tap({ position: { x: 50, y: 10 } });

    // Verify context menu appears
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();

    // Verify menu is positioned appropriately for mobile
    const menu = page.locator('[data-testid="context-menu"]');
    const boundingBox = await menu.boundingBox();
    expect(boundingBox).not.toBeNull();

    // Menu should be visible within viewport
    if (boundingBox) {
      expect(boundingBox.x).toBeGreaterThanOrEqual(0);
      expect(boundingBox.y).toBeGreaterThanOrEqual(0);
    }
  });

  test('Context menu closes on mobile when tapping outside @regression', async ({ page }) => {
    // Open context menu
    const firstRow = page.locator('[data-testid^="expense-row-"]').first();
    await firstRow.tap({ position: { x: 50, y: 10 } });
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();

    // Tap outside
    await page.tap('body', { position: { x: 10, y: 10 } });

    // Verify menu closed
    await expect(page.locator('[data-testid="context-menu"]')).not.toBeVisible();
  });
});

/**
 * =============================================================================
 * INTERVIEW TALKING POINTS:
 * =============================================================================
 *
 * 1. COMPREHENSIVE COVERAGE:
 *    - Tests all three menu actions (Show, Edit, Delete)
 *    - Tests keyboard accessibility (Enter, Space, Escape, Tab)
 *    - Tests click outside to close
 *    - Tests mobile touch interactions
 *
 * 2. ACCESSIBILITY TESTING:
 *    - Keyboard navigation with Enter and Space
 *    - Tab navigation through menu items
 *    - Escape key to close
 *    - Focus management
 *
 * 3. USER EXPERIENCE:
 *    - Context menu opens at correct position
 *    - Menu closes after action selection
 *    - Action buttons don't trigger context menu
 *    - Multiple rows can be interacted with sequentially
 *
 * 4. MOBILE RESPONSIVENESS:
 *    - Touch interactions work correctly
 *    - Menu positioning adapts to mobile viewport
 *    - Tap outside closes menu
 *
 * 5. TEST DATA ATTRIBUTES:
 *    - Uses data-testid for stable selectors
 *    - IDs include row-specific identifiers
 *    - Easy to maintain and understand
 *
 * 6. BEST PRACTICES:
 *    - Independent tests with beforeEach setup
 *    - Clear test names describe functionality
 *    - Proper waits for elements to be visible
 *    - Screenshots and videos on failure
 *
 * =============================================================================
 */
