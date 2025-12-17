/**
 * =============================================================================
 * BDD Hooks - Setup and Teardown
 * =============================================================================
 * Cucumber hooks that run before and after scenarios/steps.
 * Manages browser lifecycle and test data cleanup.
 * =============================================================================
 */

import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { ExpenseWorld } from './world';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment configuration
const TEST_ENV = process.env.TEST_ENV || 'local';
const envFile = `.env.${TEST_ENV}`;
const envPath = path.resolve(__dirname, '../../config', envFile);
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
Before(async function (this: ExpenseWorld) {
  console.log(`📝 Starting scenario: ${this.pickle.name}`);
  await this.init();
});

/**
 * After each scenario
 */
After(async function (this: ExpenseWorld, { result }) {
  console.log(`✅ Scenario ${result?.status}: ${this.pickle.name}`);

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
