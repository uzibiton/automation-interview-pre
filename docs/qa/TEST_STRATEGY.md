# Testing Strategy & Architecture

> **Purpose**: This document explains the complete testing infrastructure for the Expense Tracker application. It serves as both technical documentation and a demonstration of testing expertise for interviews.

---

## Table of Contents

1. [Overview](#overview)
2. [Development & QA Workflow](#development--qa-workflow)
3. [Testing Philosophy](#testing-philosophy)
4. [Test Pyramid](#test-pyramid)
5. [Architecture](#architecture)
6. [Test Types](#test-types)
7. [Docker Strategy](#docker-strategy)
8. [Test Suites & Execution](#test-suites--execution)
9. [CI/CD Integration](#cicd-integration)
10. [Metrics & Reporting](#metrics--reporting)
11. [Best Practices](#best-practices)

---

## Overview

### Project Context

**Application**: Expense Tracker - A full-stack expense management system
**Stack**: TypeScript, React, NestJS, PostgreSQL, deployed on Google Cloud Run
**Goal**: Demonstrate enterprise-level testing infrastructure for production applications

### Testing Goals

1. **Quality Assurance**: Catch bugs before production
2. **Confidence**: Safe deployments with automated validation
3. **Documentation**: Tests as living documentation
4. **Speed**: Fast feedback loops for developers
5. **Coverage**: Comprehensive testing across all layers

---

## Development & QA Workflow

> **Note**: This section describes the QA process and workflow. For technical testing architecture, see [Testing Philosophy](#testing-philosophy) below.

This project follows a **Hybrid Development-QA Approach** where features are developed and merged first, followed by comprehensive test automation. This approach maximizes development velocity while maintaining high quality through systematic testing.

### Workflow Phases

For detailed workflow phases, issue classification, scope management, and code review best practices, see [docs/qa/TESTING_STRATEGY.md](TESTING_STRATEGY.md).

**Summary**:

- **Phase 1**: Requirements & Planning (QA creates test plan)
- **Phase 2**: Development & Parallel QA Preparation
- **Phase 3**: Manual Testing & Exploratory Testing
- **Phase 4**: Test Automation (after dev merge)
- **Phase 5**: Continuous Testing in CI/CD

---

## Testing Philosophy

### Core Principles

#### 1. **Test Pyramid Approach**

```
        /\           E2E Tests (10%)
       /  \          - Slow but critical
      /    \         - Full user workflows
     /------\
    / Integration    Integration Tests (30%)
   /   Tests   \     - API + DB interactions
  /            \     - Service communication
 /--------------\
/  Unit Tests   \    Unit Tests (60%)
/________________\   - Fast, isolated
                     - Business logic focus
```

**Rationale**:

- More unit tests = faster feedback
- Fewer E2E tests = manageable execution time
- Balance between speed and confidence

#### 2. **Shift-Left Testing**

Test early in the development cycle:

- Unit tests during development
- Integration tests before commit
- E2E tests before merge
- Performance/security tests nightly

#### 3. **Test Independence**

Each test should:

- Run in isolation
- Not depend on other tests
- Clean up after itself
- Use fresh test data

#### 4. **Tag-Based Organization**

Instead of folder-based suites, use tags:

```typescript
test.describe('Expenses @smoke @critical', () => {
  test('Create expense @sanity', async ({ page }) => {
    // Test implementation
  });
});
```

**Benefits**:

- Tests can belong to multiple suites
- Flexible CI/CD execution
- Easy filtering and selection

---

## Test Pyramid

### Distribution Strategy

| Test Type       | Coverage      | Speed     | Count | When to Run   |
| --------------- | ------------- | --------- | ----- | ------------- |
| **Unit**        | 60%           | Very Fast | ~200  | On every save |
| **Component**   | 15%           | Fast      | ~50   | On commit     |
| **Integration** | 15%           | Medium    | ~40   | On PR         |
| **Contract**    | 5%            | Medium    | ~20   | On PR         |
| **E2E**         | 10%           | Slow      | ~30   | Before merge  |
| **Visual**      | Supplementary | Slow      | ~20   | Nightly       |
| **Performance** | Supplementary | Slow      | ~10   | Nightly       |
| **Security**    | Supplementary | Slow      | ~5    | Nightly       |

### Why This Distribution?

**Unit Tests (60%)**:

- Test business logic in isolation
- Fast execution (milliseconds)
- Easy to maintain and debug
- High confidence in individual functions

**Integration Tests (15%)**:

- Test service interactions
- Database operations
- API endpoint validation
- Medium execution time (seconds)

**E2E Tests (10%)**:

- Critical user workflows only
- Full stack validation
- Slow but essential
- Represents real user behavior

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CI/CD Pipeline                          │
│  GitHub Actions / Jenkins / GitLab CI                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Docker Testing Infrastructure                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Unit Tests  │  │ Integration  │  │  E2E Tests   │     │
│  │   Container  │  │   Container  │  │   Container  │     │
│  │              │  │              │  │              │     │
│  │  - Jest      │  │  - Jest      │  │  - Playwright│     │
│  │  - Fast      │  │  - DB Access │  │  - Browsers  │     │
│  │  - Isolated  │  │  - Services  │  │  - Full App  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Test Results & Reports                      │
│  - JUnit XML (CI integration)                               │
│  - HTML Reports (human-readable)                            │
│  - Coverage Reports (code quality metrics)                  │
│  - Allure Reports (executive dashboard)                     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### TypeScript Testing

- **Jest**: Unit, Component, Integration tests
- **Playwright**: E2E, Visual regression
- **Cucumber**: BDD feature files
- **Pact**: Contract testing
- **Testing Library**: React component testing
- **Storybook**: Component showcase

#### Python Testing

- **Locust**: Performance testing
- **OWASP ZAP**: Security scanning
- **OpenCV**: ML-based visual testing
- **Pytest**: Python test execution

#### Reporting & Metrics

- **Allure**: Comprehensive test reporting
- **Lighthouse**: Performance metrics
- **axe-core**: Accessibility validation
- **K6**: Performance benchmarking

---

## Test Types

### 1. Unit Tests

**Purpose**: Test individual functions and classes in isolation

**Characteristics**:

- No external dependencies (mocked)
- Very fast execution (< 1 second)
- High coverage of business logic
- Easy to write and maintain

**Example Structure**:

```
tests/unit/
├── services/
│   ├── expenses.service.test.ts
│   └── auth.service.test.ts
├── components/
│   └── utils.test.ts
└── utils/
    └── validators.test.ts
```

**Sample Test**:

```typescript
// tests/unit/services/expenses.service.test.ts
describe('ExpensesService @unit @smoke', () => {
  let service: ExpensesService;

  beforeEach(() => {
    service = new ExpensesService();
  });

  test('should calculate total expenses correctly @sanity', () => {
    const expenses = [
      { amount: 100, category: 'food' },
      { amount: 200, category: 'transport' },
    ];

    expect(service.calculateTotal(expenses)).toBe(300);
  });
});
```

**Key Metrics**:

- Execution time: < 5 minutes for all unit tests
- Coverage target: > 80%
- Run frequency: On every file save

---

### 2. Component Tests

**Purpose**: Test React components in isolation

**Characteristics**:

- Render components in JSDOM
- Test user interactions
- Verify UI behavior
- No full browser needed

**Example Structure**:

```
tests/component/
├── frontend/
│   ├── ExpenseForm.test.tsx
│   ├── ExpenseList.test.tsx
│   └── Dashboard.test.tsx
└── storybook/
    └── *.stories.tsx
```

**Sample Test**:

```typescript
// tests/component/frontend/ExpenseForm.test.tsx
describe('ExpenseForm @component @sanity', () => {
  test('should submit valid expense @smoke', async () => {
    const onSubmit = jest.fn();
    render(<ExpenseForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Amount'), '100');
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'food');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({
      amount: 100,
      category: 'food',
    });
  });
});
```

**Key Metrics**:

- Execution time: < 2 minutes
- Coverage: All user-facing components
- Run frequency: On commit

---

### 3. Integration Tests

**Purpose**: Test interactions between services and external systems

**Characteristics**:

- Real database connections
- Service-to-service communication
- API endpoint validation
- Test data cleanup

**Example Structure**:

```
tests/integration/
├── api/
│   └── expenses.integration.test.ts
├── auth/
│   └── oauth.integration.test.ts
└── database/
    └── queries.integration.test.ts
```

**Sample Test**:

```typescript
// tests/integration/api/expenses.integration.test.ts
describe('Expenses API @integration @sanity', () => {
  let app: INestApplication;
  let db: Database;

  beforeAll(async () => {
    app = await createTestingApp();
    db = app.get(Database);
  });

  afterEach(async () => {
    await db.cleanTestData();
  });

  test('POST /expenses creates expense in database @smoke', async () => {
    const response = await request(app.getHttpServer())
      .post('/expenses')
      .send({ amount: 100, category: 'food' })
      .expect(201);

    const dbExpense = await db.findExpenseById(response.body.id);
    expect(dbExpense).toBeDefined();
    expect(dbExpense.amount).toBe(100);
  });
});
```

**Key Metrics**:

- Execution time: < 5 minutes
- Coverage: All API endpoints
- Run frequency: On PR

---

### 4. Contract Tests

**Purpose**: Verify API contracts between consumers and providers

**Characteristics**:

- Test API agreements
- Consumer-driven contracts
- Prevent breaking changes
- Service independence

**Example Structure**:

```
tests/contract/
├── consumers/
│   ├── frontend-api.pact.test.ts
│   └── frontend-auth.pact.test.ts
└── providers/
    ├── api-service.pact.test.ts
    └── auth-service.pact.test.ts
```

**Why Contract Testing?**

- Frontend and backend can develop independently
- Catch breaking API changes early
- Document API agreements
- Enable microservices architecture

**Sample Test**:

```typescript
// tests/contract/consumers/frontend-api.pact.test.ts
describe('Frontend -> API Contract @contract', () => {
  test('GET /expenses returns list of expenses', async () => {
    await provider.addInteraction({
      state: 'user has expenses',
      uponReceiving: 'request for expenses list',
      withRequest: {
        method: 'GET',
        path: '/expenses',
        headers: { Authorization: 'Bearer token' },
      },
      willRespondWith: {
        status: 200,
        body: Matchers.eachLike({
          id: Matchers.uuid(),
          amount: Matchers.decimal(),
          category: Matchers.string(),
        }),
      },
    });

    const response = await apiClient.getExpenses();
    expect(response).toBeInstanceOf(Array);
  });
});
```

---

### 5. End-to-End (E2E) Tests

**Purpose**: Test complete user workflows through the browser

**Characteristics**:

- Full application stack running
- Real browser automation
- Critical path focus
- Slowest but most realistic

**Example Structure**:

```
tests/e2e/
├── expenses/
│   ├── create-expense.spec.ts
│   ├── edit-expense.spec.ts
│   └── delete-expense.spec.ts
├── auth/
│   └── login-flow.spec.ts
└── workflows/
    └── expense-lifecycle.spec.ts
```

**Sample Test**:

```typescript
// tests/e2e/expenses/create-expense.spec.ts
test.describe('Create Expense Workflow @e2e @smoke @critical', () => {
  test('User can create a new expense @sanity', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('[type="submit"]');

    // Navigate to expenses
    await page.click('text=Expenses');
    await page.click('text=Add Expense');

    // Fill form
    await page.fill('[name="amount"]', '100');
    await page.selectOption('[name="category"]', 'food');
    await page.fill('[name="description"]', 'Lunch');
    await page.click('text=Save');

    // Verify
    await expect(page.locator('text=Expense created successfully')).toBeVisible();
    await expect(page.locator('text=Lunch')).toBeVisible();
  });
});
```

**Key Metrics**:

- Execution time: < 15 minutes
- Coverage: Critical user journeys
- Run frequency: Before merge to main

---

### 6. Cucumber/BDD Tests

**Purpose**: Business-readable test scenarios using Gherkin syntax

**Characteristics**:

- Written in natural language
- Bridge between technical and non-technical stakeholders
- Reusable step definitions
- Living documentation

**Example Structure**:

```
tests/cucumber/
├── features/
│   ├── e2e/
│   │   └── expense-management.feature
│   ├── integration/
│   │   └── api-endpoints.feature
│   └── component/
│       └── form-validation.feature
├── step-definitions/
│   ├── expense-steps.ts
│   └── common-steps.ts
└── support/
    ├── hooks.ts
    └── world.ts
```

**Sample Feature**:

```gherkin
# tests/cucumber/features/e2e/expense-management.feature
Feature: Expense Management
  As a user
  I want to manage my expenses
  So that I can track my spending

  @smoke @critical
  Scenario: Create a new expense
    Given I am logged in as a user
    When I navigate to the expenses page
    And I click on "Add Expense"
    And I enter amount "100"
    And I select category "Food"
    And I enter description "Lunch"
    And I click "Save"
    Then I should see "Expense created successfully"
    And I should see the expense in my list

  @regression
  Scenario: Delete an existing expense
    Given I am logged in as a user
    And I have an expense with amount "50"
    When I delete the expense
    Then I should see "Expense deleted"
    And the expense should not appear in my list
```

**Step Definitions**:

```typescript
// tests/cucumber/step-definitions/expense-steps.ts
import { Given, When, Then } from '@cucumber/cucumber';

Given('I have an expense with amount {string}', async function (amount) {
  this.expense = await this.apiClient.createExpense({
    amount: parseFloat(amount),
    category: 'food',
  });
});

When('I delete the expense', async function () {
  await this.page.click(`[data-expense-id="${this.expense.id}"] button.delete`);
  await this.page.click('text=Confirm');
});

Then('the expense should not appear in my list', async function () {
  const expense = this.page.locator(`[data-expense-id="${this.expense.id}"]`);
  await expect(expense).not.toBeVisible();
});
```

**Benefits**:

- Product owners can read/write tests
- Reduces miscommunication
- Tests serve as requirements documentation
- Natural language = accessible to all

---

### 7. Visual Regression Tests

**Purpose**: Detect unintended visual changes to the UI

**Characteristics**:

- Screenshot comparison
- Pixel-diff analysis
- Cross-browser consistency
- Automated visual QA

**Example Structure**:

```
tests/visual/
├── playwright/         # Playwright visual snapshots
│   ├── pages/
│   └── components/
├── python-ml/          # ML-based visual testing
│   └── opencv_comparison.py
└── baselines/          # Baseline screenshots
```

**Sample Test**:

```typescript
// tests/visual/playwright/pages/expenses-page.spec.ts
test.describe('Expenses Page Visual Tests @visual', () => {
  test('expenses list matches snapshot', async ({ page }) => {
    await page.goto('/expenses');
    await page.waitForLoadState('networkidle');

    // Take screenshot and compare
    await expect(page).toHaveScreenshot('expenses-page.png', {
      maxDiffPixels: 100, // Allow minor rendering differences
    });
  });

  test('dark mode matches snapshot @regression', async ({ page }) => {
    await page.goto('/expenses');
    await page.click('[aria-label="Toggle dark mode"]');
    await expect(page).toHaveScreenshot('expenses-page-dark.png');
  });
});
```

**When Visual Tests Fail**:

1. Review the diff image
2. Determine if change is intentional
3. If intentional: Update baseline (`--update-snapshots`)
4. If bug: Fix the UI issue

**Key Metrics**:

- Execution time: ~10 minutes
- Coverage: Key pages and components
- Run frequency: Nightly or on UI changes

---

### 8. Non-Functional Tests

> **Note**: Non-functional tests validate **how well** the system performs (quality attributes), not **what** it does (functionality).
>
> **Full documentation**: See `/tests/non-functional/README.md` for complete guide

**Current Structure**:

```
tests/non-functional/
├── README.md              ← Complete guide to all types
├── accessibility/         ← WCAG compliance tests (planned)
├── lighthouse/            ← Web quality audits (planned)
├── performance/           ← Load and stress testing (active)
│   ├── k6/               ← JavaScript-based load testing
│   └── locust/           ← Python-based load testing
└── security/             ← Vulnerability scanning (active)
    ├── zap/              ← OWASP ZAP dynamic scanning
    ├── bandit/           ← Python code security analysis
    └── dependency/       ← Vulnerable dependency scanning
```

#### Performance Testing

**Purpose**: Validate system performance under load

**Tools**:

- **k6** - Modern JavaScript-based load testing
- **Locust** - Python-based distributed load testing

**Example**:

```javascript
// tests/non-functional/performance/k6/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'], // Less than 1% failures
  },
};

export default function () {
  const response = http.get('http://test-api-service:3002/expenses');

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

**Metrics Tracked**:

- Response times (p50, p95, p99)
- Requests per second
- Error rate
- Concurrent users supported

#### Security Testing

**Purpose**: Identify security vulnerabilities across multiple layers

Security testing includes multiple approaches, each catching different types of vulnerabilities:

##### 1. Static Analysis (SAST)

**What**: Analyzes code WITHOUT running the application  
**When**: During development, in CI/CD pipeline  
**Tools**: Snyk, npm audit, SonarQube, CodeQL, Semgrep

**Checks**:

- **Dependency vulnerabilities**: Known CVEs in npm packages
- **Code vulnerabilities**: Unsafe patterns (eval, innerHTML, SQL concatenation)
- **Secret detection**: Hardcoded passwords, API keys, tokens
- **License compliance**: Open source license issues
- **Infrastructure as Code**: Docker, Kubernetes, Terraform misconfigurations

**Example**:

```bash
# Dependency scanning
npm audit --audit-level=moderate

# Snyk scanning (Issue #45)
snyk test --severity-threshold=high
snyk code test  # Code analysis
snyk container test  # Docker image scanning

# ESLint security rules
npx eslint . --ext .ts,.tsx --plugin security
```

##### 2. Dynamic Analysis (DAST)

**What**: Tests RUNNING application by simulating attacks  
**When**: Against deployed environments (staging/production)  
**Tools**: OWASP ZAP, Burp Suite, Nikto

**Checks**:

- SQL injection attempts
- XSS (Cross-Site Scripting) attacks
- CSRF token validation
- Authentication/authorization bypass
- Session management issues
- API security (rate limiting, input validation)

**Example**:

```python
# tests/non-functional/security/zap/zap_scan.py
from zapv2 import ZAPv2
import time

# Initialize ZAP
zap = ZAPv2(proxies={'http': 'http://localhost:8080'})

# Target URL
target = 'http://test-api-service:3002'

# Start spider scan
scan_id = zap.spider.scan(target)
while int(zap.spider.status(scan_id)) < 100:
    print(f'Spider progress: {zap.spider.status(scan_id)}%')
    time.sleep(2)

# Start active scan
scan_id = zap.ascan.scan(target)
while int(zap.ascan.status(scan_id)) < 100:
    print(f'Scan progress: {zap.ascan.status(scan_id)}%')
    time.sleep(5)

# Get results
alerts = zap.core.alerts(baseurl=target)
high_risk = [a for a in alerts if a['risk'] == 'High']

print(f'Found {len(high_risk)} high-risk vulnerabilities')
for alert in high_risk:
    print(f"- {alert['alert']}: {alert['description']}")
```

##### 3. Interactive Analysis (IAST)

**What**: Monitors application during test execution  
**When**: While running integration/E2E tests  
**Tools**: Contrast Security, Hdiv Security

**Benefits**:

- Real-time vulnerability detection
- Combines static + dynamic approaches
- Low false positive rate
- Identifies exact vulnerable code paths

##### 4. Penetration Testing

**What**: Manual ethical hacking by security experts  
**When**: Before major releases, quarterly security audits  
**Scope**: Business logic flaws, complex attack chains, social engineering

**Approach**:

- Reconnaissance and information gathering
- Vulnerability assessment
- Exploitation attempts
- Post-exploitation analysis
- Detailed reporting with remediation steps

##### Security Testing Strategy

**Phase 1: Shift-Left (Development)**

- Static analysis in IDE and pre-commit hooks
- Dependency scanning on every build
- Secret detection in commits

**Phase 2: CI/CD Pipeline**

- Automated SAST scans (Snyk, CodeQL)
- Container image scanning
- License compliance checks

**Phase 3: Pre-Production**

- DAST scans against staging environment
- Automated penetration testing (OWASP ZAP)
- API security testing

**Phase 4: Production**

- Runtime security monitoring
- Periodic penetration testing
- Bug bounty program (future)

**Current Implementation**:

- ✅ npm audit (basic dependency scanning)
- 🔄 Snyk integration (Issue #45) - comprehensive SAST
- 📋 OWASP ZAP (planned) - DAST
- 📋 Manual penetration testing (as needed)

#### Accessibility Testing

**Purpose**: Ensure application is accessible to all users

**Standards**: WCAG 2.1 Level AA

**Example**:

```typescript
// tests/non-functional/accessibility/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility @a11y', () => {
  test('expenses page should have no accessibility violations', async ({ page }) => {
    await page.goto('/expenses');

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('forms should be keyboard navigable @critical', async ({ page }) => {
    await page.goto('/expenses/new');

    // Tab through form
    await page.keyboard.press('Tab');
    await expect(page.locator('[name="amount"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[name="category"]')).toBeFocused();
  });
});
```

**Checks Include**:

- Color contrast
- Keyboard navigation
- Screen reader compatibility
- ARIA labels
- Focus management

---

## Docker Strategy

### Why Docker for Testing?

1. **Consistency**: Same environment locally, in CI, and production
2. **Isolation**: Tests don't affect development environment
3. **Reproducibility**: Exact dependencies and versions
4. **Scalability**: Easy to run in parallel
5. **Portability**: Works on any machine with Docker

### Architecture

#### Single Container Approach (Current)

**When to Use**:

- Test suite runs in < 10 minutes
- Simple setup and maintenance
- Getting started quickly

**Structure**:

```dockerfile
# Multi-stage Dockerfile
FROM node:18 AS base
  -> Install Node dependencies

FROM base AS python
  -> Add Python and pip
  -> Install Python packages

FROM python AS browser
  -> Install Playwright browsers

FROM browser AS test
  -> Ready to run all test types
```

**Benefits**:

- Simple to build and run
- All tools in one place
- Easy debugging

**Limitations**:

- Slower for large test suites
- Can't run different test types simultaneously

#### Multi-Container Approach (Future)

**When to Migrate**:

- Test suite exceeds 10 minutes
- Want parallel execution
- Different resource requirements

**Structure**:

```yaml
services:
  test-unit: # Fast, no external dependencies
  test-integration: # Needs DB and services
  test-e2e: # Needs browsers and full stack
  test-performance: # Resource-intensive
  test-security: # Specialized tools
```

**Benefits**:

- Parallel execution
- Resource optimization
- Faster CI/CD pipelines

**Migration Path** (documented in code comments):

```dockerfile
# TODO: When test execution > 10 minutes, split into:
#  - test-unit.Dockerfile (fast, ~2 min)
#  - test-integration.Dockerfile (medium, ~5 min)
#  - test-e2e.Dockerfile (slow, ~15 min)
```

### Docker Compose Services

#### Service Profiles

Docker Compose uses profiles to run specific test types:

```bash
# Run only unit tests
docker-compose -f tests/docker/docker-compose.test.yml --profile unit up

# Run integration tests
docker-compose -f tests/docker/docker-compose.test.yml --profile integration up

# Run E2E tests
docker-compose -f tests/docker/docker-compose.test.yml --profile e2e up

# Run all tests
docker-compose -f tests/docker/docker-compose.test.yml \
  --profile unit --profile integration --profile e2e up
```

**Why Profiles?**

- Start only needed services
- Save resources
- Faster execution for specific test types

#### Volume Mounts

**Source Code** (read-only):

```yaml
volumes:
  - ../../services:/app/services:ro
  - ../../frontend/src:/app/frontend/src:ro
```

**Why**: Tests need access to application code without modifying it

**Test Files** (read-write):

```yaml
volumes:
  - ../unit:/app/tests/unit
  - ../e2e/test-results:/app/tests/e2e/test-results
```

**Why**: Generate test reports and artifacts

**Node Modules** (container volume):

```yaml
volumes:
  - test-node-modules:/app/node_modules
```

**Why**: Don't override container's installed dependencies with host's node_modules

---

## Test Suites & Execution

### Tag-Based Organization

Instead of separate test folders for suites, use tags:

```typescript
// Tags applied to tests
test.describe('Expenses @smoke @critical', () => {
  test('Create expense @sanity', async ({ page }) => {
    // Critical path test
  });

  test('Filter expenses @regression', async ({ page }) => {
    // Full regression only
  });
});
```

### Suite Definitions

| Suite          | Tags          | Purpose                        | Frequency       | Duration |
| -------------- | ------------- | ------------------------------ | --------------- | -------- |
| **Smoke**      | `@smoke`      | Critical path validation       | Every commit    | ~2 min   |
| **Sanity**     | `@sanity`     | Basic functionality check      | On PR           | ~5 min   |
| **Regression** | `@regression` | Full feature validation        | Before merge    | ~30 min  |
| **Critical**   | `@critical`   | Must-pass tests                | Blocking builds | ~3 min   |
| **Nightly**    | `@nightly`    | Comprehensive + non-functional | Scheduled daily | ~2 hours |

### Execution Strategy

#### Local Development

```bash
# Watch mode for active development
npm run test:watch

# Quick validation before commit
npm run test:smoke

# Full local validation
npm run test:all
```

#### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run smoke tests
        run: |
          docker-compose -f tests/docker/docker-compose.test.yml \
            --profile unit up --abort-on-container-exit
        # ~2 minutes

  sanity:
    runs-on: ubuntu-latest
    needs: smoke
    steps:
      - name: Run sanity tests
        run: npm run test:sanity
        # ~5 minutes

  regression:
    runs-on: ubuntu-latest
    needs: sanity
    if: github.event_name == 'pull_request'
    steps:
      - name: Run regression suite
        run: |
          docker-compose -f tests/docker/docker-compose.test.yml \
            --profile unit --profile integration --profile e2e up
        # ~30 minutes

  nightly:
    runs-on: ubuntu-latest
    schedule:
      - cron: '0 2 * * *' # 2 AM daily
    steps:
      - name: Run complete test suite
        run: npm run test:nightly
        # ~2 hours (includes performance, security, visual)
```

### Execution Scripts

#### Smoke Tests

```bash
# tests/scripts/run-smoke.sh
#!/bin/bash
# Run critical path tests only (~2 minutes)

echo "🔥 Running smoke tests..."

# Unit tests with @smoke tag
npm run test:unit -- --grep '@smoke'

# E2E critical tests
playwright test --grep '@smoke'

echo "✅ Smoke tests complete"
```

#### Sanity Tests

```bash
# tests/scripts/run-sanity.sh
#!/bin/bash
# Run basic functionality tests (~5 minutes)

echo "🧪 Running sanity tests..."

# Component + integration tests
npm run test:component -- --grep '@sanity'
npm run test:integration -- --grep '@sanity'

# Basic E2E workflows
playwright test --grep '@sanity'

echo "✅ Sanity tests complete"
```

#### Regression Tests

```bash
# tests/scripts/run-regression.sh
#!/bin/bash
# Run full regression suite (~30 minutes)

echo "🔄 Running regression tests..."

# All functional tests
npm run test:unit
npm run test:component
npm run test:integration
npm run test:e2e

# Contract tests
npm run test:contract

echo "✅ Regression tests complete"
```

#### Nightly Tests

```bash
# tests/scripts/run-nightly.sh
#!/bin/bash
# Run comprehensive test suite (~2 hours)

echo "🌙 Running nightly test suite..."

# Functional tests
./run-regression.sh

# Visual regression
npm run test:visual

# Non-functional tests
npm run test:performance
npm run test:security
npm run test:accessibility

# Generate comprehensive report
npm run report:allure

echo "✅ Nightly suite complete"
```

---

## CI/CD Integration

### Pipeline Stages

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Commit    │────▶│    Build    │────▶│    Test     │────▶│   Deploy    │
│             │     │             │     │             │     │             │
│ - Lint      │     │ - Compile   │     │ - Smoke     │     │ - Staging   │
│ - Format    │     │ - Bundle    │     │ - Sanity    │     │ - Prod      │
└─────────────┘     └─────────────┘     │ - Regression│     └─────────────┘
                                        │ - Security  │
                                        └─────────────┘
```

### Stage Gating

**Smoke Tests**: Must pass before proceeding

- Fast feedback (2 min)
- Blocks broken builds early
- Critical path validation

**Sanity Tests**: Required for PR approval

- Medium confidence (5 min)
- Verifies basic functionality
- Reviewer can see results

**Regression Tests**: Required for merge to main

- High confidence (30 min)
- Full feature validation
- Prevents regressions

**Nightly Tests**: Don't block, but notify on failure

- Scheduled execution
- Comprehensive coverage
- Early warning system

### Integration Examples

#### GitHub Actions

```yaml
name: Test Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        test-suite: [smoke, sanity, regression]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Docker
        run: |
          docker-compose -f tests/docker/docker-compose.test.yml build

      - name: Run ${{ matrix.test-suite }} tests
        run: |
          ./tests/scripts/run-${{ matrix.test-suite }}.sh

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results-${{ matrix.test-suite }}
          path: tests/reports/

      - name: Publish test report
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Test Results - ${{ matrix.test-suite }}
          path: tests/reports/junit.xml
          reporter: jest-junit
```

#### Jenkins Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Smoke Tests') {
            steps {
                sh './tests/scripts/run-smoke.sh'
            }
            post {
                always {
                    junit 'tests/reports/junit.xml'
                }
            }
        }

        stage('Sanity Tests') {
            when {
                branch 'PR-*'
            }
            steps {
                sh './tests/scripts/run-sanity.sh'
            }
        }

        stage('Regression Tests') {
            when {
                branch 'main'
            }
            steps {
                sh './tests/scripts/run-regression.sh'
            }
        }
    }
}
```

---

## Metrics & Reporting

### Test Metrics Tracked

#### Code Coverage Metrics

- **Line Coverage**: % of code lines executed
- **Branch Coverage**: % of conditional branches tested
- **Function Coverage**: % of functions called
- **Statement Coverage**: % of statements executed

**Target**: > 80% overall, > 90% for critical paths

#### Requirements Coverage

- **Requirement Traceability**: Each requirement has associated test cases
- **Test Case Mapping**: Track requirement ID -> test cases
- **Acceptance Criteria Coverage**: All ACs have passing tests
- **Feature Coverage**: % of features with automated tests

**Target**: 100% of acceptance criteria covered

#### API Coverage Metrics

- **Endpoint Coverage**: % of API endpoints tested
- **HTTP Method Coverage**: GET, POST, PUT, DELETE, PATCH tested per endpoint
- **Status Code Coverage**: Success (2xx), client errors (4xx), server errors (5xx)
- **Request Variation Coverage**: Headers, query params, body variations
- **Error Scenario Coverage**: Validation errors, auth failures, edge cases

**Target**: 100% of public endpoints, all status codes

#### UI Coverage Metrics

- **Screen Coverage**: % of screens/pages with tests
- **User Journey Coverage**: Critical paths through application
- **Navigation Coverage**: All routes and navigation flows tested
- **Component Coverage**: % of reusable components tested
- **Responsive Coverage**: Mobile, tablet, desktop breakpoints

**Target**: 100% of critical journeys, 80%+ of screens

#### Browser/Device Coverage

- **Browser Coverage**: Chrome, Firefox, Safari, Edge
- **Mobile Browser Coverage**: Mobile Chrome, Mobile Safari
- **Device Types**: Desktop, tablet, mobile
- **OS Coverage**: Windows, macOS, Linux, iOS, Android
- **Viewport Coverage**: Common screen resolutions

**Target**: 100% of critical journeys on primary browsers (Chrome, Safari)

#### Test Type Coverage

- **Test Pyramid Balance**: Unit > Integration > E2E > Visual
- **Test Layer Coverage**: Frontend, Backend, API, Database
- **Non-Functional Coverage**: Performance, security, accessibility, reliability
- **Testing Approach**: Automated, manual exploratory, user acceptance

**Target**: Balanced test pyramid with focus on lower layers

#### Quality Metrics

- **Test Success Rate**: % of tests passing
- **Flakiness Rate**: % of tests that fail intermittently
- **Test Execution Time**: Time to run each suite
- **Code Churn**: Changes requiring test updates

#### Performance Metrics

- **Response Times**: p50, p95, p99 percentiles
- **Throughput**: Requests per second
- **Error Rate**: % of failed requests
- **Resource Usage**: CPU, memory, network

### Reporting Tools

#### Jest HTML Report

- Test execution results
- Coverage reports
- Failed test details
- Generated automatically

#### Playwright Report

- Test videos and screenshots
- Test traces for debugging
- Step-by-step execution
- Cross-browser results

#### Allure Report

- Executive dashboard
- Historical trends
- Test categorization
- Rich visualizations

**Example**:

```bash
# Generate Allure report
npm run report:allure

# View report
allure serve tests/reports/allure-results
```

#### Coverage Report

```bash
# Generate coverage
npm run test:coverage

# View in browser
open coverage/lcov-report/index.html
```

### Dashboards

**Test Execution Dashboard**:

- Tests run today
- Pass/fail rate
- Execution time trends
- Flaky test alerts

**Quality Dashboard**:

- Code coverage trend
- Bug escape rate
- Test effectiveness
- Technical debt

---

## Best Practices

### Writing Good Tests

#### 1. **AAA Pattern**

```typescript
test('should calculate expense total', () => {
  // Arrange - Set up test data
  const expenses = [{ amount: 100 }, { amount: 200 }];

  // Act - Execute the code
  const total = calculateTotal(expenses);

  // Assert - Verify the result
  expect(total).toBe(300);
});
```

#### 2. **Descriptive Names**

```typescript
// ❌ Bad
test('test1', () => { ... });

// ✅ Good
test('should return 400 when expense amount is negative', () => { ... });
```

#### 3. **One Assertion Per Concept**

```typescript
// ❌ Bad - Testing multiple concepts
test('expense validation', () => {
  expect(validateAmount(-1)).toBe(false);
  expect(validateAmount(0)).toBe(false);
  expect(validateCategory('')).toBe(false);
  expect(validateDate(futureDate)).toBe(false);
});

// ✅ Good - Separate tests
test('should reject negative expense amounts', () => {
  expect(validateAmount(-1)).toBe(false);
});

test('should reject zero expense amounts', () => {
  expect(validateAmount(0)).toBe(false);
});
```

#### 4. **Test Independence**

```typescript
// ❌ Bad - Tests depend on each other
let expense;

test('create expense', () => {
  expense = createExpense({ amount: 100 });
});

test('update expense', () => {
  updateExpense(expense.id, { amount: 200 }); // Fails if previous test fails
});

// ✅ Good - Independent tests
test('create expense', () => {
  const expense = createExpense({ amount: 100 });
  expect(expense.id).toBeDefined();
});

test('update expense', () => {
  const expense = createExpense({ amount: 100 });
  const updated = updateExpense(expense.id, { amount: 200 });
  expect(updated.amount).toBe(200);
});
```

#### 5. **Use Test Fixtures**

```typescript
// tests/fixtures/expenses.json
{
  "validExpense": {
    "amount": 100,
    "category": "food",
    "description": "Lunch"
  },
  "invalidExpense": {
    "amount": -50,
    "category": "invalid"
  }
}

// In test
import fixtures from '@fixtures/expenses.json';

test('should create valid expense', () => {
  const result = createExpense(fixtures.validExpense);
  expect(result.success).toBe(true);
});
```

### Test Maintenance

#### 1. **Keep Tests DRY**

```typescript
// Create helper functions
function createTestExpense(overrides = {}) {
  return {
    amount: 100,
    category: 'food',
    date: new Date(),
    ...overrides,
  };
}

// Use in tests
test('example 1', () => {
  const expense = createTestExpense({ amount: 200 });
  // ...
});

test('example 2', () => {
  const expense = createTestExpense({ category: 'transport' });
  // ...
});
```

#### 2. **Page Object Pattern** (for E2E)

```typescript
// tests/e2e/pages/ExpensesPage.ts
export class ExpensesPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/expenses');
  }

  async createExpense(amount: number, category: string) {
    await this.page.click('text=Add Expense');
    await this.page.fill('[name="amount"]', String(amount));
    await this.page.selectOption('[name="category"]', category);
    await this.page.click('text=Save');
  }

  async getExpenseCount() {
    return this.page.locator('.expense-item').count();
  }
}

// In test
test('create expense', async ({ page }) => {
  const expensesPage = new ExpensesPage(page);
  await expensesPage.goto();
  await expensesPage.createExpense(100, 'food');

  expect(await expensesPage.getExpenseCount()).toBe(1);
});
```

#### 3. **Regular Test Cleanup**

- Remove obsolete tests
- Update outdated fixtures
- Refactor duplicated code
- Fix flaky tests immediately

#### 4. **Test Review Process**

- Tests reviewed like production code
- Check test quality and coverage
- Verify test independence
- Ensure proper tagging

### Performance Optimization

#### 1. **Run Tests in Parallel**

```javascript
// jest.config.js
module.exports = {
  maxWorkers: '50%', // Use half of CPU cores
};
```

#### 2. **Use Test Fixtures**

- Pre-populate databases with test data
- Avoid redundant setup in each test
- Share fixtures across tests

#### 3. **Mock External Dependencies**

```typescript
// Mock API calls in unit tests
jest.mock('../services/api', () => ({
  fetchExpenses: jest.fn().mockResolvedValue([{ id: 1, amount: 100 }]),
}));
```

#### 4. **Skip Slow Tests in Dev**

```typescript
test.skip('slow integration test', async () => {
  // Only run in CI
});

// Or conditionally
const runSlowTests = process.env.RUN_SLOW_TESTS === 'true';

test[runSlowTests ? 'describe' : 'skip']('slow tests', () => {
  // ...
});
```

---

## Interview Talking Points

When presenting this testing infrastructure in interviews, emphasize:

### 1. **Strategic Thinking**

- "I designed a comprehensive testing strategy based on the test pyramid"
- "Each test type serves a specific purpose in our quality assurance"
- "Tag-based organization provides flexibility for different execution scenarios"

### 2. **Technical Depth**

- "Multi-stage Docker builds optimize our testing environment"
- "Volume mounts allow live code changes without rebuilding containers"
- "Hybrid TypeScript/Python approach leverages best tools for each job"

### 3. **Scalability Planning**

- "Current single-container approach works for our <10 minute test suite"
- "Documented migration path to multi-container when needed"
- "Designed with CI/CD pipeline integration from day one"

### 4. **Business Value**

- "Smoke tests provide 2-minute feedback loop"
- "Tag-based suites optimize CI/CD execution time"
- "Comprehensive reporting gives stakeholders confidence"

### 5. **Best Practices**

- "Tests are independent and can run in any order"
- "Coverage targets ensure critical code is tested"
- "Regular maintenance prevents test rot"

### 6. **Real-World Application**

- "This structure supports a production application on Google Cloud Run"
- "Can demonstrate full test execution and reporting"
- "Architecture scales from startup to enterprise"

---

## Summary

This testing infrastructure demonstrates:

✅ **Comprehensive Coverage**: All test types (unit, integration, E2E, visual, performance, security)
✅ **Modern Tools**: Jest, Playwright, Cucumber, K6, OWASP ZAP
✅ **Docker Integration**: Containerized testing environment
✅ **CI/CD Ready**: Tag-based execution for pipelines
✅ **Scalable Architecture**: Designed to grow with the application
✅ **Best Practices**: Independent tests, proper organization, clear documentation
✅ **Business Focused**: Fast feedback, high confidence, clear reporting

**Key Differentiators for Interviews**:

- Multi-language support (TypeScript + Python)
- Cutting-edge tools (Playwright MCP, ML visual testing)
- Thoughtful architecture (test pyramid, tag-based suites)
- Production-ready (deployed to GCP, real OAuth, actual database)
- Comprehensive documentation (explains "why" not just "how")

---

**Next Steps**:

1. Review this strategy document
2. Explore sample tests in each category
3. Run demo scripts to see tests in action
4. Practice explaining architecture in interviews
5. Extend with additional test types as needed
