import { defineConfig, devices } from '@playwright/test';

/**
 * =============================================================================
 * Playwright Configuration for E2E and Visual Testing
 * =============================================================================
 * ARCHITECTURE EXPLANATION (for interviews):
 * Playwright is our E2E testing framework providing cross-browser automation.
 * This config sets up browser contexts, base URLs, and test execution settings.
 *
 * WHY PLAYWRIGHT:
 * 1. Modern API with auto-waiting and retry mechanisms
 * 2. Multi-browser support (Chromium, Firefox, WebKit)
 * 3. Built-in visual regression testing
 * 4. Network interception and mocking
 * 5. Parallel execution with isolated browser contexts
 * 6. Video and screenshot on failure
 * =============================================================================
 */

export default defineConfig({
  // Test directory
  testDir: '../e2e',

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // Fail if test.only in CI
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined, // Limit workers in CI

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: '../reports/playwright-report' }],
    ['json', { outputFile: '../reports/playwright-results.json' }],
    ['junit', { outputFile: '../reports/junit.xml' }],
    ['list'], // Console output
    ['allure-playwright'], // Allure reporting
  ],

  // Global test settings
  use: {
    // Base URL for navigation
    baseURL: process.env.BASE_URL || 'http://localhost:5173',

    // Browser options
    headless: process.env.HEADLESS !== 'false',
    viewport: { width: 1280, height: 720 },

    // Artifacts on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // Network
    ignoreHTTPSErrors: true,

    // Timeouts
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // Test timeout
  timeout: 60000, // 1 minute per test
  expect: {
    timeout: 10000, // Assertion timeout
    toHaveScreenshot: {
      maxDiffPixels: 100, // Visual regression threshold
    },
  },

  // Projects for different browsers and test types
  projects: [
    // === Desktop Browsers ===
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Authentication state can be loaded here
        // storageState: 'auth-state.json',
      },
      testMatch: /.*\.spec\.ts/,
      grep: /@e2e/,
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /.*\.spec\.ts/,
      grep: /@e2e/,
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: /.*\.spec\.ts/,
      grep: /@e2e/,
    },

    // === Mobile Browsers ===
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: /.*\.spec\.ts/,
      grep: /@mobile/,
    },

    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      testMatch: /.*\.spec\.ts/,
      grep: /@mobile/,
    },

    // === Visual Regression Tests ===
    {
      name: 'visual-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\.spec\.ts/,
      grep: /@visual/,
    },

    // === Accessibility Tests ===
    {
      name: 'accessibility',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\.spec\.ts/,
      grep: /@a11y/,
    },

    // === Smoke Tests (Critical Path) ===
    {
      name: 'smoke',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\.spec\.ts/,
      grep: /@smoke/,
    },
  ],

  // Web server to start before tests (optional)
  // Uncomment if you want Playwright to start the dev server
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },

  // Output folder for test artifacts
  outputDir: '../e2e/test-results',
});

/**
 * =============================================================================
 * USAGE EXAMPLES (for your interview demo):
 * =============================================================================
 *
 * Run all E2E tests:
 *   npm run test:e2e
 *
 * Run in headed mode (see browser):
 *   npm run test:e2e:headed
 *
 * Run in debug mode:
 *   npm run test:e2e:debug
 *
 * Run specific project:
 *   playwright test --project=chromium
 *
 * Run tests with specific tag:
 *   playwright test --grep @smoke
 *   playwright test --grep @visual
 *   playwright test --grep @a11y
 *
 * Run specific test file:
 *   playwright test create-expense.spec.ts
 *
 * Update visual snapshots:
 *   playwright test --update-snapshots
 *
 * Show HTML report:
 *   npm run report:open
 *
 * Generate Allure report:
 *   npm run report:allure
 *
 * =============================================================================
 * TEST TAGGING STRATEGY:
 * =============================================================================
 * Use test tags in your spec files for organization:
 *
 * test.describe('Expenses @smoke @critical', () => {
 *   test('Create expense @sanity', async ({ page }) => { ... });
 *   test('Delete expense @regression', async ({ page }) => { ... });
 * });
 *
 * Tags:
 * - @smoke: Critical path tests (run on every commit)
 * - @sanity: Basic functionality tests (run on PR)
 * - @regression: Full test suite (run on merge)
 * - @critical: Must-pass tests
 * - @nightly: Scheduled comprehensive tests
 * - @visual: Visual regression tests
 * - @a11y: Accessibility tests
 * - @mobile: Mobile-specific tests
 * =============================================================================
 */
