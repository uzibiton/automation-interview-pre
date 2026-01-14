import { test, expect } from '@playwright/test';

test.describe('Login Functionality @e2e @login @smoke', () => {
  test('should log in with valid credentials', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL || '';
    const password = process.env.TEST_USER_PASSWORD || '';
    const userName = process.env.TEST_USER_NAME || 'Test User';
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const emailLocator = page.locator('data-testid=login-email-input');
    const passwordLocator = page.locator('data-testid=login-password-input');
    const submitButtonLocator = page.locator('data-testid=login-submit-button');
    // TODO: add data-testid
    // const userInfoLocator = page.locator('data-testid=user-info');
    const userInfoLocator = page.locator('.user-info');

    await page.goto(`${baseUrl}/login`);
    await emailLocator.fill(email);
    await passwordLocator.fill(password);
    await submitButtonLocator.click();

    // expect to be redirected to dashboard
    await expect(userInfoLocator).toBeVisible();
    await expect(userInfoLocator).toContainText(userName);

    // Verify logout button is present
    const logoutButtonLocator = page.locator('data-testid=nav-logout-button');
    await expect(logoutButtonLocator).toBeVisible();

    // Logout to clean up session
    await logoutButtonLocator.click();
    // expect to be redirected to login page
    await expect(page).toHaveURL(`${baseUrl}/login`);

    await page.waitForTimeout(1000); // wait for 1 second to ensure logout is complete
  });
});
