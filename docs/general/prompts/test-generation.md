# Test Generation Prompts

## Generate E2E Test Scenarios

**Use Case**: Create comprehensive end-to-end test scenarios for a feature using Playwright.

**Prompt Template**:

```
Generate E2E test scenarios for [FEATURE_NAME] based on [REQ-ID].

Requirements:
- Framework: Playwright with TypeScript
- Location: tests/e2e/specs/[feature-name].spec.ts
- Follow patterns from existing tests in tests/e2e/
- Use page objects from tests/e2e/pages/
- Use fixtures from tests/e2e/fixtures/

Test Coverage Needed:
1. Happy path scenarios
2. Validation and error handling
3. Edge cases (boundary values, empty states, max limits)
4. User permissions and access control
5. Mobile responsive behavior

For each test scenario, include:
- Test description following "should [expected behavior] when [condition]" format
- Setup steps using fixtures
- Assertions using Playwright's expect()
- Cleanup steps if needed

Reference the test strategy in docs/qa/TEST_STRATEGY.md for coverage requirements.
```

**Example**:

```
Generate E2E test scenarios for expense category management based on REQ-003.

Requirements:
- Framework: Playwright with TypeScript
- Location: tests/e2e/specs/categories.spec.ts
- Follow patterns from existing tests in tests/e2e/
- Use page objects from tests/e2e/pages/
- Use fixtures from tests/e2e/fixtures/

Test Coverage Needed:
[continues as above]
```

---

**Tips**:

- Reference existing test files for consistent patterns
- Specify test data requirements
- Include both positive and negative test cases
- Request accessibility and mobile tests when relevant
