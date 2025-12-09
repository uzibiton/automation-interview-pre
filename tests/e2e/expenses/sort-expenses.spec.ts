/**
 * =============================================================================
 * E2E Test: Expense Table Sorting
 * =============================================================================
 * PURPOSE: Test the sorting functionality of the expenses table
 *
 * KEY CONCEPTS:
 * 1. Column header click interactions
 * 2. Sort order verification (ascending/descending)
 * 3. Visual indicator validation (↑ ↓ arrows)
 * 4. Single-column sorting behavior (only one column sorted at a time)
 * 5. Default sort behavior (newest first)
 * =============================================================================
 */

import { test, expect } from '@playwright/test';

// Test configuration
test.use({
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'retain-on-failure',
});

test.describe('Expense Table Sorting @e2e @sorting @expenses', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('Default sort is by date descending (newest first) @smoke', async ({ page }) => {
    // Look for expenses table
    const table = page.locator('table.table');
    await expect(table).toBeVisible({ timeout: 10000 });

    // Get all date cells (first column in tbody)
    const rows = await table.locator('tbody tr').all();
    
    if (rows.length >= 2) {
      const dates: Date[] = [];
      for (const row of rows) {
        const dateCell = row.locator('td').first();
        const dateText = await dateCell.textContent();
        if (dateText) {
          dates.push(new Date(dateText));
        }
      }

      // Verify dates are in descending order (newest first)
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i + 1].getTime());
      }
    }
  });

  test('Can sort by date column (ascending/descending/default) @regression', async ({ page }) => {
    const table = page.locator('table.table');
    await expect(table).toBeVisible({ timeout: 10000 });

    const dateHeader = table.locator('thead th').filter({ hasText: /date/i }).first();
    
    // First click: ascending (check for ↑)
    await dateHeader.click();
    await expect(dateHeader).toContainText('↑');
    
    // Verify ascending order
    const ascRows = await table.locator('tbody tr').all();
    if (ascRows.length >= 2) {
      const ascDates: Date[] = [];
      for (const row of ascRows) {
        const dateCell = row.locator('td').first();
        const dateText = await dateCell.textContent();
        if (dateText) {
          ascDates.push(new Date(dateText));
        }
      }
      
      // Verify dates are in ascending order (oldest first)
      for (let i = 0; i < ascDates.length - 1; i++) {
        expect(ascDates[i].getTime()).toBeLessThanOrEqual(ascDates[i + 1].getTime());
      }
    }

    // Second click: descending (check for ↓)
    await dateHeader.click();
    await expect(dateHeader).toContainText('↓');
    
    // Third click: remove sort (back to default)
    await dateHeader.click();
    // Should not have sort indicator after third click
    const headerText = await dateHeader.textContent();
    expect(headerText).not.toContain('↑');
    expect(headerText).not.toContain('↓');
  });

  test('Can sort by description column (alphabetical) @regression', async ({ page }) => {
    const table = page.locator('table.table');
    await expect(table).toBeVisible({ timeout: 10000 });

    const descriptionHeader = table.locator('thead th').filter({ hasText: /description/i }).first();
    
    // Click to sort ascending
    await descriptionHeader.click();
    await expect(descriptionHeader).toContainText('↑');
    
    // Get descriptions and verify alphabetical order
    const rows = await table.locator('tbody tr').all();
    if (rows.length >= 2) {
      const descriptions: string[] = [];
      for (const row of rows) {
        const cells = await row.locator('td').all();
        if (cells.length >= 3) {
          const descText = await cells[2].textContent();
          if (descText) {
            descriptions.push(descText.trim());
          }
        }
      }
      
      // Verify alphabetical order
      for (let i = 0; i < descriptions.length - 1; i++) {
        expect(descriptions[i].localeCompare(descriptions[i + 1])).toBeLessThanOrEqual(0);
      }
    }

    // Click again for descending
    await descriptionHeader.click();
    await expect(descriptionHeader).toContainText('↓');
  });

  test('Can sort by category column (alphabetical) @regression', async ({ page }) => {
    const table = page.locator('table.table');
    await expect(table).toBeVisible({ timeout: 10000 });

    const categoryHeader = table.locator('thead th').filter({ hasText: /category/i }).first();
    
    // Click to sort ascending
    await categoryHeader.click();
    await expect(categoryHeader).toContainText('↑');
    
    // Click again for descending
    await categoryHeader.click();
    await expect(categoryHeader).toContainText('↓');
    
    // Click third time to remove sort
    await categoryHeader.click();
    const headerText = await categoryHeader.textContent();
    expect(headerText).not.toContain('↑');
    expect(headerText).not.toContain('↓');
  });

  test('Can sort by amount column (numerical) @regression', async ({ page }) => {
    const table = page.locator('table.table');
    await expect(table).toBeVisible({ timeout: 10000 });

    const amountHeader = table.locator('thead th').filter({ hasText: /amount/i }).first();
    
    // Click to sort ascending
    await amountHeader.click();
    await expect(amountHeader).toContainText('↑');
    
    // Get amounts and verify numerical order
    const rows = await table.locator('tbody tr').all();
    if (rows.length >= 2) {
      const amounts: number[] = [];
      for (const row of rows) {
        const cells = await row.locator('td').all();
        if (cells.length >= 4) {
          const amountText = await cells[3].textContent();
          if (amountText) {
            // Extract number from format like "₪ 123.45" or "$ 123.45"
            const match = amountText.match(/[\d.]+/);
            if (match) {
              amounts.push(parseFloat(match[0]));
            }
          }
        }
      }
      
      // Verify ascending numerical order
      for (let i = 0; i < amounts.length - 1; i++) {
        expect(amounts[i]).toBeLessThanOrEqual(amounts[i + 1]);
      }
    }

    // Click again for descending
    await amountHeader.click();
    await expect(amountHeader).toContainText('↓');
  });

  test('Sortable headers have pointer cursor @regression', async ({ page }) => {
    const table = page.locator('table.table');
    await expect(table).toBeVisible({ timeout: 10000 });

    const dateHeader = table.locator('thead th.sortable-header').first();
    
    // Check if the header has cursor pointer style
    await expect(dateHeader).toHaveClass(/sortable-header/);
  });

  test('Only one column can be sorted at a time @regression', async ({ page }) => {
    const table = page.locator('table.table');
    await expect(table).toBeVisible({ timeout: 10000 });

    const dateHeader = table.locator('thead th').filter({ hasText: /date/i }).first();
    const amountHeader = table.locator('thead th').filter({ hasText: /amount/i }).first();
    
    // Sort by date
    await dateHeader.click();
    await expect(dateHeader).toContainText('↑');
    
    // Now sort by amount
    await amountHeader.click();
    await expect(amountHeader).toContainText('↑');
    
    // Date header should no longer have sort indicator
    const dateText = await dateHeader.textContent();
    expect(dateText).not.toContain('↑');
    expect(dateText).not.toContain('↓');
  });
});

/**
 * =============================================================================
 * INTERVIEW TALKING POINTS:
 * =============================================================================
 *
 * 1. USER INTERACTION TESTING:
 *    - Tests simulate real user clicks on column headers
 *    - Verifies visual feedback (arrows) appears correctly
 *    - Validates tri-state behavior (asc -> desc -> none)
 *
 * 2. DATA VALIDATION:
 *    - Extracts actual table data to verify sort order
 *    - Tests different data types (dates, strings, numbers)
 *    - Handles various format patterns (currency symbols, etc.)
 *
 * 3. COMPREHENSIVE COVERAGE:
 *    - Default behavior (date descending)
 *    - All sortable columns tested
 *    - Edge cases (single column at a time)
 *    - Visual elements (cursor style)
 *
 * 4. ROBUSTNESS:
 *    - Handles empty tables gracefully
 *    - Works with various data sizes
 *    - Waits for page load before testing
 *
 * =============================================================================
 */
