/**
 * =============================================================================
 * BDD Hooks - Setup and Teardown
 * =============================================================================
 * Cucumber hooks that run before and after scenarios/steps.
 * Manages browser lifecycle and test data cleanup.
 * =============================================================================
 */

import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  Status,
  ITestCaseHookParameter,
} from '@cucumber/cucumber';
import { ExpenseWorld } from './world';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment configuration
// The current working directory should be the tests directory when running cucumber
// from the package.json scripts, but we use path resolution to be safe
const TEST_ENV = process.env.TEST_ENV || 'local';
const envFile = `.env.${TEST_ENV}`;

// Try to find the config directory relative to the tests directory
// If cwd is 'tests', config is at './config'
// If cwd is project root, config is at './tests/config'
let envPath = path.resolve(process.cwd(), 'config', envFile);
if (!require('fs').existsSync(envPath)) {
  envPath = path.resolve(process.cwd(), 'tests', 'config', envFile);
}

dotenv.config({ path: envPath });

console.log(`🔧 Loading BDD config for environment: ${TEST_ENV}`);
console.log(`📄 Environment file: ${envFile}`);
console.log(`🌐 Base URL: ${process.env.BASE_URL}`);

/**
 * Before all scenarios
 */
BeforeAll(async function () {
  console.log('🚀 Starting BDD test suite');
});

/**
 * Before each scenario
 */
Before(async function (this: ExpenseWorld, { pickle }: ITestCaseHookParameter) {
  console.log(`📝 Starting scenario: ${pickle.name}`);
  await this.init();
});

/**
 * After each scenario
 */
After(async function (this: ExpenseWorld, { pickle, result }: ITestCaseHookParameter) {
  console.log(`✅ Scenario ${result?.status}: ${pickle.name}`);

  // Take screenshot on failure
  if (result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
  }

  // Cleanup browser
  await this.cleanup();

  // TODO: Cleanup test data from database if needed
  // This would require database access to remove created test expenses
});

/**
 * After all scenarios
 */
AfterAll(async function () {
  console.log('🏁 BDD test suite completed');
});
