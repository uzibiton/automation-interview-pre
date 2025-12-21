/**
 * =============================================================================
 * Cucumber BDD Configuration
 * =============================================================================
 * Configuration for running BDD tests with Cucumber and Playwright.
 *
 * USAGE:
 *   npm run test:bdd              - Run all BDD tests
 *   npm run test:bdd:local        - Run against local environment
 *   npm run test:bdd:staging      - Run against staging environment
 *   npm run test:bdd -- --tags @smoke  - Run only smoke tests
 * =============================================================================
 */

module.exports = {
  default: {
    // Require step definitions and support code
    require: ['bdd/support/**/*.ts', 'bdd/step-definitions/**/*.ts'],

    // TypeScript loader (transpile-only to skip type checking during test runs)
    requireModule: ['ts-node/register/transpile-only'],

    // Test format and reporting
    format: [
      'progress-bar', // Console progress
      'html:reports/bdd/cucumber-report.html', // HTML report
      'json:reports/bdd/cucumber-report.json', // JSON report for CI
      'junit:reports/bdd/cucumber-junit.xml', // JUnit XML for CI
    ],

    // Feature file paths
    paths: ['bdd/features/**/*.feature'],
    parallel: 1, // Run scenarios in parallel (set to 1 for debugging)

    // Default step timeout (in milliseconds) - default is 5000ms
    timeout: 60 * 1000, // 60 seconds for each step

    // Retry failed scenarios
    retry: 0, // Set to 1 or 2 in CI environments

    // Fail fast on first failure
    failFast: false,

    // Strict mode - fail on undefined or pending steps
    strict: true,

    // Dry run - validate step definitions without executing
    dryRun: false,

    // Publish results to Cucumber Reports (optional)
    publish: false,

    // World parameters (available in World constructor)
    worldParameters: {
      baseURL: process.env.BASE_URL || 'http://localhost:5173',
      headless: process.env.HEADLESS !== 'false',
    },
  },
};
