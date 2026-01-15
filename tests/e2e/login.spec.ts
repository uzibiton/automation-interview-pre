import { test, expect } from '@playwright/test';

test.describe('Login Functionality @e2e @login @smoke', () => {
  test('should log in with valid credentials', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL || '';
    const password = process.env.TEST_USER_PASSWORD || '';
    const userName = process.env.TEST_USER_NAME || '';
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    if (!email || !password || !userName) {
      throw new Error('Missing required environment variables for login test.');
    }

    const emailLocator = page.locator('[data-testid="login-email-input"]');
    const passwordLocator = page.locator('[data-testid="login-password-input"]');
    const submitButtonLocator = page.locator('[data-testid="login-submit-button"]');
    // TODO: add data-testid
    // const userInfoLocator = page.locator('data-testid=user-info');
    const userInfoLocator = page.locator('.user-info');

    await page.goto(`${baseUrl}/login`);

    await emailLocator.fill(email);
    await passwordLocator.fill(password);

    await Promise.all([submitButtonLocator.click(), userInfoLocator.waitFor({ state: 'visible' })]);

    // expect to be redirected to dashboard
    await expect(userInfoLocator).toBeVisible();
    await expect(userInfoLocator).toContainText(userName);

    // Verify logout button is present and functional
    const logoutButtonLocator = page.locator('[data-testid="nav-logout-button"]');
    await expect(logoutButtonLocator).toBeVisible();

    await Promise.all([logoutButtonLocator.click(), page.waitForURL(`${baseUrl}/login`)]);
  });
});
