import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * =============================================================================
 * Multi-Environment Configuration Setup
 * =============================================================================
 * Supports running E2E tests against different environments:
 * - local: Services running on localhost via docker-compose or npm run dev
 * - docker: Services running in Docker containers (internal networking)
 * - staging: Cloud Run staging environment (-staging suffix)
 * - production: Cloud Run production environment
 *
 * Set TEST_ENV environment variable to switch between environments:
 *   TEST_ENV=local npm run test:e2e
 *   TEST_ENV=docker npm run test:e2e
 *   TEST_ENV=staging npm run test:e2e
 *   TEST_ENV=production npm run test:e2e
 * =============================================================================
 */

// Determine which environment to load
const TEST_ENV = process.env.TEST_ENV || 'local';
const envFile = `.env.${TEST_ENV}`;
const envPath = path.resolve(__dirname, 'config', envFile);

// Load environment-specific configuration
dotenv.config({ path: envPath });

console.log(`🔧 Loading Playwright config for environment: ${TEST_ENV}`);
console.log(`📄 Environment file: ${envFile}`);
console.log(`🌐 Base URL: ${process.env.BASE_URL}`);

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
 * 7. Multi-environment support (local, Docker, Cloud Run)
 * =============================================================================
 */

export default defineConfig({
  // Test directory
  testDir: './e2e',

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // Fail if test.only in CI
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined, // Limit workers in CI

  // Reporter configuration with timestamped folder structure
  reporter: [
    [
      'html',
      {
        outputFolder: `./reports/e2e/${new Date().toISOString().replace(/[:.]/g, '-')}/html-report`,
        open: 'never',
      },
    ],
    [
      'json',
      {
        outputFile: `./reports/e2e/${new Date().toISOString().replace(/[:.]/g, '-')}/results.json`,
      },
    ],
    [
      'junit',
      {
        outputFile: `./reports/e2e/${new Date().toISOString().replace(/[:.]/g, '-')}/junit.xml`,
      },
    ],
    ['list'], // Console output
    // ['allure-playwright'], // Allure reporting - uncomment after installing: npm install --save-dev allure-playwright
  ],

  // Global test settings
  use: {
    // Base URL for navigation - loaded from environment file
    baseURL: process.env.BASE_URL || 'http://localhost:5173',

    // API URLs available in tests via process.env
    extraHTTPHeaders: {
      // Can be used for authentication or tracking test runs
      'X-Test-Environment': TEST_ENV,
    },

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
    // Temporarily disabled - need to create baseline snapshots first
    // {
    //   name: 'visual-chromium',
    //   use: { ...devices['Desktop Chrome'] },
    //   testMatch: /.*\.spec\.ts/,
    //   grep: /@visual/,
    // },

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

  // Output folder for test artifacts (screenshots, videos, traces)
  outputDir: `./test-results/${new Date().toISOString().replace(/[:.]/g, '-')}/test-artifacts`,
});

/**
 * =============================================================================
 * USAGE EXAMPLES (for your interview demo):
 * =============================================================================
 *
 * Run E2E tests against different environments:
 *   npm run test:e2e:local         # Against localhost (docker-compose or npm dev)
 *   npm run test:e2e:docker        # Inside Docker containers
 *   npm run test:e2e:staging       # Against Cloud Run staging
 *   npm run test:e2e:production    # Against Cloud Run production
 *
 * Run in headed mode (see browser):
 *   npm run test:e2e:local:headed
 *   npm run test:e2e:staging:headed
 *
 * Run in debug mode:
 *   npm run test:e2e:local:debug
 *   npm run test:e2e:production:debug
 *
 * Run specific project:
 *   TEST_ENV=local playwright test --project=chromium
 *
 * Run tests with specific tag:
 *   TEST_ENV=staging playwright test --grep @smoke
 *   TEST_ENV=production playwright test --grep @critical
 *
 * Run specific test file:
 *   TEST_ENV=local playwright test create-expense.spec.ts
 *
 * Update visual snapshots:
 *   TEST_ENV=local playwright test --update-snapshots
 *
 * Show HTML report:
 *   npm run report:open
 *
 * Generate Allure report:
 *   npm run report:allure
 *
 * =============================================================================
 * ENVIRONMENT CONFIGURATION WORKFLOW:
 * =============================================================================
 * 1. LOCAL DEVELOPMENT (Fast Iteration):
 *    - Start services: docker-compose up OR npm run dev
 *    - Run tests: npm run test:e2e:local
 *    - Debug: npm run test:e2e:local:headed
 *    - Use case: Fast feedback before pushing code
 *
 * 2. DOCKER (Pre-Deploy Validation):
 *    - Start: docker-compose up
 *    - Run tests in container: npm run test:e2e:docker
 *    - Use case: Validate dockerized services match production
 *
 * 3. STAGING (Branch Deployments):
 *    - Deploy: GitHub Actions (branch deployment)
 *    - Update .env.staging with Cloud Run URLs
 *    - Run: npm run test:e2e:staging
 *    - Use case: Validate feature branch before merge
 *
 * 4. PRODUCTION (Post-Deploy Validation):
 *    - Deploy: GitHub Actions (main branch)
 *    - Update .env.production with Cloud Run URLs
 *    - Run: npm run test:e2e:production
 *    - Use case: Smoke tests after production deployment
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
 *
 * =============================================================================
 * SENIOR ENGINEER TALKING POINTS (for demo):
 * =============================================================================
 * "I architected a multi-environment E2E testing strategy that enables:
 *  1. Fast local validation (saves 5-10min per push)
 *  2. Docker parity testing (catches container-specific issues)
 *  3. Post-deployment smoke tests (production validation)
 *  4. Branch environment testing (isolate feature testing)
 *
 *  The same Playwright tests run across all environments without code changes.
 *  We just switch the TEST_ENV variable to target different endpoints.
 *
 *  Trade-offs:
 *  - Benefit: Single test suite, multiple deployment targets
 *  - Cost: Need to maintain environment config files
 *  - Decision: Worth it - reduces test maintenance and enables shift-left testing"
 * =============================================================================
 */
