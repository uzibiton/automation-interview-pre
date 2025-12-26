# Notes - Architectural Decisions

This document captures **architectural and technology decisions** made while building this test automation infrastructure.

For **workflow processes and CI/CD challenges**, see [DEVELOPMENT_INSIGHTS.md](dev/DEVELOPMENT_INSIGHTS.md).

---

## Table of Contents

- [Architectural Decisions](#architectural-decisions)
- [Design Patterns Used](#design-patterns-used)
- [Trade-offs Considered](#trade-offs-considered)
- [Lessons Learned](#lessons-learned)

---

## Architectural Decisions

### Why Playwright over Cypress/Selenium

**Decision**: Use Playwright for E2E testing

**Rationale**:
- Native multi-browser support (Chromium, Firefox, WebKit) with single API
- Built-in auto-waiting eliminates flaky tests from timing issues
- Parallel test execution out of the box
- Better debugging with trace viewer and video recording
- TypeScript-first with excellent IDE support
- Cross-platform mobile emulation

**Trade-off**: Smaller community than Cypress, but Microsoft backing ensures longevity.

### Why Pact for Contract Testing

**Decision**: Use Pact for API contract testing

**Rationale**:
- Consumer-driven contracts ensure API changes don't break clients
- Works independently of live services (mock-based)
- Broker support for contract versioning across environments
- Prevents integration issues before deployment

**Trade-off**: Additional maintenance for contract files, but catches breaking changes early.

### Why Jest + Playwright (Not Just Playwright)

**Decision**: Separate unit/component testing (Jest) from E2E (Playwright)

**Rationale**:
- Jest is faster for isolated unit tests (no browser overhead)
- Component tests with React Testing Library run in jsdom (faster)
- Playwright reserved for true user-flow E2E tests
- Clear separation in test pyramid

**Trade-off**: Two test frameworks to maintain, but appropriate tools for each level.

### Why Cloud Run over EC2/GKE

**Decision**: Google Cloud Run for serverless container deployment

**Rationale**:
- Scale to zero when idle (cost efficiency for portfolio project)
- Per-request pricing vs always-on instances
- Simpler than Kubernetes for this scale
- Automatic HTTPS and load balancing
- Easy PR environment provisioning

**Trade-off**: Less control than full Kubernetes, 60s request timeout limit.

### Why Firestore (Production) + PostgreSQL (Local)

**Decision**: Database abstraction layer supporting both

**Rationale**:
- Firestore for production (serverless, auto-scaling, low maintenance)
- PostgreSQL for local development (standard SQL, easier debugging)
- Repository pattern abstracts database choice from application
- Environment variable switches database at runtime

**Trade-off**: Two databases to understand, but flexibility for different environments.

### Why GitHub Actions over Jenkins/CircleCI

**Decision**: GitHub Actions for CI/CD

**Rationale**:
- Native GitHub integration (no external service)
- Matrix builds for multi-environment testing
- Reusable workflows and composite actions
- Free tier sufficient for portfolio
- Easy secrets management

**Trade-off**: GitHub lock-in, but transferable skills to other YAML-based CI systems.

---

## Design Patterns Used

### Page Object Model (POM)

**Location**: `tests/e2e/page-objects/`

**Why**: Encapsulates page structure and interactions, making tests readable and maintainable. When UI changes, only page objects need updating.

```typescript
// Example: ExpenseListPage
class ExpenseListPage {
  async sortBy(column: 'date' | 'amount' | 'category') { }
  async getExpenses(): Promise<Expense[]> { }
  async filterByCategory(category: string) { }
}
```

### Repository Pattern

**Location**: `app/services/api-service/src/repositories/`

**Why**: Abstracts data access, enabling database switching (Firestore/PostgreSQL) without changing application logic.

### Factory Pattern

**Location**: `tests/fixtures/`

**Why**: Creates consistent test data with sensible defaults while allowing customization.

```typescript
// Example: ExpenseFactory
const expense = ExpenseFactory.create({ amount: 100 });
const expenses = ExpenseFactory.createMany(5);
```

### Builder Pattern

**Location**: Test setup utilities

**Why**: Constructs complex test scenarios step-by-step with fluent API.

### Strategy Pattern

**Location**: Database adapters, test environment configuration

**Why**: Swaps implementations (Firestore vs PostgreSQL, local vs staging) at runtime.

---

## Trade-offs Considered

### Test Coverage vs Speed

**Decision**: 70% coverage threshold with fast feedback

**Trade-off**: Higher coverage possible but diminishing returns. Prioritized critical paths and edge cases over exhaustive coverage.

### Parallel vs Sequential E2E Tests

**Decision**: Parallel by default, sequential for state-dependent tests

**Trade-off**: Speed vs potential isolation issues. Solved with proper test data isolation.

### Mocking vs Real Services

**Decision**: MSW for component tests, real services for E2E

**Trade-off**:
- Mocks: Fast, isolated, but may miss integration issues
- Real: Slower, but catches actual integration problems
- Solution: Different approaches at different test levels

### Documentation Detail vs Maintainability

**Decision**: Comprehensive documentation with traceability

**Trade-off**: More upfront effort, but pays off in onboarding and debugging. Templates ensure consistency.

---

## Lessons Learned

### 1. Environment Parity Matters

**Problem**: Tests passing locally but failing in CI.

**Solution**: Docker-based local development matching CI environment. Same Docker images used locally and in pipeline.

### 2. Flaky Tests Are Trust Killers

**Problem**: Intermittent test failures erode confidence in automation.

**Solution**:
- Playwright's auto-waiting for UI elements
- Explicit waits for API responses
- Retry logic for known-flaky external dependencies
- Quarantine flaky tests rather than skip

### 3. Test Data Isolation is Critical

**Problem**: Tests interfering with each other through shared data.

**Solution**:
- Unique test data per test run (timestamps, UUIDs)
- Database seeding before test suites
- Cleanup in afterEach hooks
- Ephemeral PR environments

### 4. Contract Tests Catch What E2E Misses

**Problem**: E2E tests pass but production breaks due to API changes.

**Solution**: Pact contract tests run in CI, catching breaking changes before deployment.

### 5. Documentation Saves Time

**Problem**: Context switching and onboarding overhead.

**Solution**:
- Templates for consistent documentation
- Traceability links between documents
- Living documentation updated with code

### 6. Multi-Environment Strategy Requires Planning

**Problem**: Managing configurations across local/staging/production.

**Solution**:
- Environment-specific .env files
- Same test code, different configs
- CI workflow determines target environment

### 7. Early Investment in Infrastructure Pays Off

**Problem**: Retrofitting testing infrastructure is expensive.

**Solution**: Built testing infrastructure alongside application from day one. Test pyramid, CI/CD, and documentation established early.

---

## Related Documents

| Document | Focus |
|----------|-------|
| **This file (NOTES.md)** | Architectural decisions, tech choices, design patterns |
| [DEVELOPMENT_INSIGHTS.md](dev/DEVELOPMENT_INSIGHTS.md) | Workflow processes, CI/CD challenges, bug fixing patterns |
| [Test Strategy](qa/TEST_STRATEGY.md) | Testing approach and philosophy |
| [CI/CD Guide](devops/CI_CD_GUIDE.md) | Pipeline architecture |
