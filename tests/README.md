# Testing Infrastructure

> Comprehensive testing framework for the Expense Tracker application

## 🎯 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for security/performance tests)

### Run Tests

```bash
# Run in Docker (recommended - everything configured)
docker-compose -f tests/docker/docker-compose.test.yml \
  --profile unit up --abort-on-container-exit

# Specific test suites in Docker
docker-compose -f tests/docker/docker-compose.test.yml \
  --profile unit up --abort-on-container-exit      # Unit tests (~2 min)
docker-compose -f tests/docker/docker-compose.test.yml \
  --profile integration up --abort-on-container-exit # Integration tests (~5 min)
docker-compose -f tests/docker/docker-compose.test.yml \
  --profile e2e up --abort-on-container-exit        # E2E tests (~15 min)

# Local development (requires setup - see below)
cd tests/config
npm run test:unit       # Unit tests
npm run test:watch      # Watch mode for active development
npm run test:e2e        # E2E tests with Playwright
```

### Local Development Setup

If you want to run tests locally (outside Docker):

```bash
# 1. Navigate to test config directory
cd tests/config

# 2. Install Node.js dependencies
npm install

# 3. Install Playwright browsers (required for E2E tests)
npx playwright install chromium
# Or install all browsers with system dependencies:
# npm run playwright:install

# 4. Install Python dependencies (optional - for security/performance tests)
pip install -r requirements.txt

# 5. Run tests
npm run test:unit       # Fast unit tests
npm run test:e2e        # E2E tests (requires services running)
npm run test:watch      # Watch mode
```

**Note**: For E2E and integration tests locally, you'll need services running:

```bash
# In project root, start services
docker-compose up
```

## 📁 Structure

```
tests/
├── unit/              # Fast isolated tests
├── component/         # React component tests
├── integration/       # API + DB tests
├── contract/          # API contract tests
├── e2e/              # Browser automation
├── bdd/              # BDD feature files
├── visual/           # Screenshot comparison
├── non-functional/   # Performance, security, accessibility
├── mcp/              # AI-driven test generation
├── demo/             # Demo materials for presentations
├── fixtures/         # Test data
├── docker/           # Docker configuration
├── config/           # Test configurations
├── scripts/          # Execution scripts
└── docs/             # Documentation
```

## 📊 Test Types

| Type              | Tool                   | Purpose            | Speed        |
| ----------------- | ---------------------- | ------------------ | ------------ |
| **Unit**          | Jest                   | Business logic     | ⚡ Very Fast |
| **Component**     | Jest + Testing Library | React components   | ⚡ Fast      |
| **Integration**   | Jest                   | API + Database     | 🔶 Medium    |
| **Contract**      | Pact                   | API agreements     | 🔶 Medium    |
| **E2E**           | Playwright             | Full workflows     | 🐌 Slow      |
| **BDD**           | Cucumber.js            | BDD scenarios      | 🔶 Medium    |
| **Visual**        | Playwright             | UI regression      | 🐌 Slow      |
| **Performance**   | K6 / Locust            | Load testing       | 🐌 Slow      |
| **Security**      | OWASP ZAP              | Vulnerability scan | 🐌 Slow      |
| **Accessibility** | axe-core               | WCAG compliance    | 🔶 Medium    |

## 🏷️ Test Suites (Tag-Based)

Tests are tagged for flexible execution:

```typescript
test.describe('Expenses @smoke @critical', () => {
  test('Create expense @sanity', async ({ page }) => {
    // Test implementation
  });
});
```

### Available Tags

- `@smoke` - Critical path (every commit)
- `@sanity` - Basic functionality (on PR)
- `@regression` - Full suite (before merge)
- `@critical` - Must-pass tests
- `@nightly` - Comprehensive daily tests
- `@visual` - Visual regression
- `@a11y` - Accessibility
- `@mobile` - Mobile-specific

## 🐳 Docker Usage

### Single Command Test Execution

```bash
# Build the test image (first time only, or after dependency changes)
docker-compose -f tests/docker/docker-compose.test.yml build

# Unit tests only (fastest - ~2 min)
docker-compose -f tests/docker/docker-compose.test.yml \
  --profile unit up --abort-on-container-exit

# Integration tests (requires services - ~5 min)
docker-compose -f tests/docker/docker-compose.test.yml \
  --profile integration up --abort-on-container-exit

# E2E tests (full stack - ~15 min)
docker-compose -f tests/docker/docker-compose.test.yml \
  --profile e2e up --abort-on-container-exit

# Performance tests
docker-compose -f tests/docker/docker-compose.test.yml \
  --profile performance up --abort-on-container-exit

# Run all test types
docker-compose -f tests/docker/docker-compose.test.yml \
  --profile unit --profile integration --profile e2e up --abort-on-container-exit

# Clean up containers and volumes
docker-compose -f tests/docker/docker-compose.test.yml down -v
```

### Architecture

- **Multi-stage Dockerfile**: Optimized layers for caching (Node.js → Python → Playwright)
- **Service profiles**: Run only what you need (unit/integration/e2e/performance)
- **Volume mounts**: Live code changes without rebuilds
- **Named volumes**: Persist test data and node_modules
- **Virtual environments**: Python packages isolated in venv
- **Working directory**: Tests execute from `/app/tests/config` with proper Jest configuration

## 📈 Coverage & Reporting

### Generate Reports

```bash
# Coverage report
npm run test:coverage
open coverage/lcov-report/index.html

# Playwright HTML report
npm run report:open

# Allure comprehensive report
npm run report:allure
```

### Coverage Targets

- Overall: > 80%
- Critical paths: > 90%
- New code: > 85%

## 🔄 CI/CD Integration

### Pipeline Stages

```
Commit → Smoke (2 min) → Sanity (5 min) → Regression (30 min) → Deploy
```

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: ./tests/scripts/run-smoke.sh
```

## 📚 Documentation

- **[TEST_STRATEGY.md](docs/TEST_STRATEGY.md)** - Complete testing strategy and architecture
- **[TESTING_GUIDE.md](docs/TESTING_GUIDE.md)** - Writing and running tests
- **[DOCKER_SETUP.md](docs/DOCKER_SETUP.md)** - Docker configuration details
- **[CI_CD.md](docs/CI_CD.md)** - Pipeline integration guide

## 🎬 Demo

For interview presentations, see:

- `demo/DEMO_SCRIPT.md` - Step-by-step walkthrough
- `demo/scripts/run-demo.sh` - Quick demo execution
- `demo/sample-reports/` - Example test reports

## 🛠️ Development Workflow

### Adding New Tests

1. **Unit Test**

   ```typescript
   // tests/unit/services/expenses.service.test.ts
   describe('ExpensesService @unit', () => {
     test('should do something @smoke', () => {
       // Test code
     });
   });
   ```

2. **Component Test**

   ```typescript
   // tests/component/frontend/ExpenseForm.test.tsx
   describe('ExpenseForm @component', () => {
     test('should submit form @sanity', async () => {
       // Test code
     });
   });
   ```

3. **E2E Test**
   ```typescript
   // tests/e2e/expenses/create-expense.spec.ts
   test('Create expense @e2e @smoke', async ({ page }) => {
     // Test code
   });
   ```

### Running During Development

```bash
# Watch mode (auto-run on file changes)
npm run test:watch

# Run specific test file
jest expenses.service.test.ts

# Run specific test by name
jest -t "should calculate total"

# Debug Playwright test
npm run test:e2e:debug
```

## 🔧 Configuration Files

- `jest.config.js` - Unit/Component/Integration tests
- `playwright.config.ts` - E2E and visual tests
- `bdd.config.js` - BDD feature tests
- `pytest.ini` - Python tests
- `requirements.txt` - Python dependencies
- `package.json` - Node dependencies and scripts

## 🚀 Performance

### Execution Times (Target)

- Smoke: ~2 minutes
- Sanity: ~5 minutes
- Regression: ~30 minutes
- Nightly: ~2 hours (includes non-functional)

### Optimization

- Parallel execution (50% of CPU cores)
- Docker layer caching
- Test fixtures for data
- Mock external services in unit tests

## 🔐 Security Testing

Includes:

- OWASP ZAP vulnerability scanning
- Bandit static analysis
- Safety dependency checks
- Authentication/authorization tests

## ♿ Accessibility Testing

Standards: WCAG 2.1 Level AA

Checks:

- Color contrast
- Keyboard navigation
- Screen reader compatibility
- ARIA labels

## 📱 Visual Regression

- Playwright screenshot comparison
- Python ML-based visual testing (OpenCV)
- Baseline management
- Threshold configuration

## 🎯 Best Practices

1. **Test Independence**: Each test can run in isolation
2. **AAA Pattern**: Arrange, Act, Assert
3. **Descriptive Names**: `test('should reject negative amounts')`
4. **One Concept**: One assertion per logical concept
5. **Use Fixtures**: Reusable test data
6. **Page Objects**: Encapsulate E2E interactions
7. **Proper Tagging**: Organize with meaningful tags

## 🤝 Contributing

When adding tests:

1. Follow existing patterns
2. Tag appropriately (`@smoke`, `@sanity`, etc.)
3. Ensure tests are independent
4. Update documentation if needed
5. Run affected test suites locally

## 📞 Support

For questions about this testing infrastructure:

- Review `docs/TEST_STRATEGY.md` for comprehensive explanation
- Check `demo/DEMO_SCRIPT.md` for walkthrough
- See sample tests in each test type folder

---

**Built with**: Jest, Playwright, BDD/Cucumber, Docker, K6, OWASP ZAP, and more

**Purpose**: Production-ready testing infrastructure demonstrating enterprise-level QA practices

**Status**: ✅ Active - Continuously maintained and improved
