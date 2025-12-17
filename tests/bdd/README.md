# BDD Tests for Expense Sorting Feature

This directory contains Behavior-Driven Development (BDD) tests using Cucumber and Playwright for the expense tracking application.

## Structure

```
bdd/
├── features/
│   └── e2e/
│       ├── expense-sorting.feature     # Gherkin feature file
│       └── data/
│           └── expense-sorting.data.json  # Test data
├── step-definitions/
│   └── expense-sorting.steps.ts        # Step implementations
└── support/
    ├── hooks.ts                        # Setup/teardown hooks
    └── world.ts                        # Test context/world
```

## Features

### expense-sorting.feature

Contains 4 BDD scenarios that validate expense table sorting functionality:

1. **TC-001-001**: Sort expenses by date in ascending order (@smoke)
2. **TC-001-002**: Sort expenses by date in descending order (@regression)
3. **TC-001-004**: Sort expenses by category alphabetically (@regression)
4. **TC-001-005**: Sortable headers have hover effects (@regression)

## Test Data

The `expense-sorting.data.json` file contains:

- **input.expenses**: 20 test expenses with various dates, categories, descriptions, amounts, and payment methods
- **output.sorted**: 8 pre-sorted arrays for validation:
  - `date_asc` / `date_desc`
  - `category_asc` / `category_desc`
  - `description_asc` / `description_desc`
  - `amount_asc` / `amount_desc`

## Step Definitions

The step definitions implement the following Gherkin steps:

### Given Steps (Setup)

- `Given the user is logged in as {string}`
- `Given the test data is loaded from {string}`
- `Given the expenses from {string} exist in the database`
- `Given the user navigates to the expenses page`

### When Steps (Actions)

- `When the user clicks on the {string} column header`
- `When the user clicks on the {string} column header again`
- `When the user clicks on the {string} column header a third time`
- `When the user hovers over the {string} column header`

### Then Steps (Assertions)

- `Then the expenses should be sorted by date in ascending order`
- `Then the expenses should be sorted by date in descending order`
- `Then the expenses should be sorted by category in ascending order`
- `Then the {string} column should display the ascending indicator {string}`
- `Then the {string} column should display the descending indicator {string}`
- `Then the expenses should match the order from {string}`
- `Then the cursor should change to pointer`
- `Then the header should have a visual hover effect`

## Running Tests

### Prerequisites

1. Install dependencies:

   ```bash
   cd tests
   npm install
   ```

2. Ensure services are running (choose one):

   ```bash
   # Option 1: Docker Compose
   docker-compose up

   # Option 2: Local development
   npm run dev
   ```

### Commands

```bash
# Run all BDD tests (from tests directory)
cd tests
npm run test:bdd

# Run BDD tests by environment
npm run test:bdd:local      # Local development (default)
npm run test:bdd:docker     # Docker containers
npm run test:bdd:staging    # Staging environment
npm run test:bdd:production # Production environment

# Run only smoke tests
npm run test:bdd:smoke

# Run specific scenario by tag
npm run test:bdd -- --tags @TC-001-001

# Run with visible browser (non-headless mode)
npx cross-env HEADLESS=false npm run test:bdd -- --tags @TC-001-001

# Dry run (validate step definitions)
npx cucumber-js --config config/bdd.config.js --dry-run

# Run with specific configuration
npx cucumber-js --config config/bdd.config.js --tags "@smoke or @regression"
```

### Environment Configuration

BDD tests use the same environment configuration as E2E tests:

- `tests/config/.env.local` - Local development
- `tests/config/.env.docker` - Docker containers
- `tests/config/.env.staging` - Staging environment
- `tests/config/.env.production` - Production environment

## Reports

Test reports are generated in:

- `tests/test-results/cucumber-report.html` - HTML report
- `tests/test-results/cucumber-report.json` - JSON report for CI
- `tests/test-results/cucumber-junit.xml` - JUnit XML for CI

## Technical Details

### Dependencies

- `@cucumber/cucumber` - BDD framework
- `@playwright/test` - Browser automation
- `lodash` - JSON path traversal with `_.get()`
- `ts-node` - TypeScript execution

### Key Features

1. **Data-Driven Testing**: Uses JSON files for test data
2. **Page Object Pattern**: Integrates with Playwright page objects
3. **World Context**: Shares state between step definitions
4. **Hooks**: Setup/teardown for each scenario
5. **Screenshot on Failure**: Automatically captures screenshots when tests fail
6. **Multi-Environment**: Supports local, docker, staging, production

### JSON Path Traversal

The step definitions use lodash `_.get()` to access nested test data:

```typescript
// Load expenses from JSON
const expenses = _.get(this.testData, 'input.expenses');

// Verify against expected sorted data
const expectedOrder = _.get(this.testData, 'output.sorted.date_asc');
```

## Troubleshooting

### Common Issues

1. **Step not defined**: Run dry-run to validate all steps are connected

   ```bash
   npx cucumber-js --config config/bdd.config.js --dry-run
   ```

2. **Cannot find module**: Ensure all dependencies are installed

   ```bash
   cd tests
   npm install
   ```

3. **TypeScript compilation errors**: The tests use `ts-node/register/transpile-only` to skip type checking during test runs. If you encounter module resolution errors, ensure `@cucumber/cucumber` is installed in `tests/node_modules`.

4. **Test data not found**: Check that the JSON file path is correct and file exists

5. **Browser not launching**: Install Playwright browsers

   ```bash
   cd tests
   npx playwright install --with-deps
   ```

6. **Navigation timeout**: Ensure the application is running before executing tests
   ```bash
   # Start local dev server first
   npm run dev
   # Then run tests
   cd tests && npm run test:bdd
   ```

## Integration with Existing Tests

These BDD tests complement the existing E2E tests in `tests/e2e/expenses/sort-expenses.spec.ts`:

- **E2E Tests**: Technical, developer-focused, detailed assertions
- **BDD Tests**: Business-readable, stakeholder-friendly, acceptance criteria

Both test suites validate the same functionality but serve different audiences and purposes.

## Contributing

When adding new scenarios:

1. Write the Gherkin scenario in the `.feature` file
2. Run dry-run to identify missing step definitions
3. Implement the missing steps in the step definitions file
4. Add test data to the JSON file if needed
5. Run tests to validate

## References

- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Playwright Documentation](https://playwright.dev/)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- Test Plan: `docs/qa/test-plans/TEST-001-expense-sorting.md`
- E2E Tests: `tests/e2e/expenses/sort-expenses.spec.ts`
