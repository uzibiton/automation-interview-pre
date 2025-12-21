# Test Generation Prompts

## Create Test Plan Document

**Use Case**: Generate a comprehensive test plan (TEST-###) for a feature or release.

**Prompt Template**:

```
Create a test plan following the TEST-### template format for [FEATURE_NAME].

Use this structure:
- Template: docs/qa/test-plans/TEST_PLAN_TEMPLATE.md
- File name: docs/qa/test-plans/TEST-XXX-[feature-name].md
- Related requirement: [REQ-ID]

Test Plan Details:

1. **Objective**
   - Purpose: [What are we testing and why?]
   - Goals: [3-5 testable goals]

2. **Scope**
   - In Scope: [Features/components to test]
   - Out of Scope: [What we're not testing]
   - Environments: Local, Staging, Production
   - Test types: Unit, Integration, E2E, Performance, Security

3. **Test Strategy**
   - Test Coverage Checklist (mark each as ✅ Covered / ⬜ Not Needed / ⚠️ Needed but Not Covered):
     - Unit Tests (≥80% coverage target)
     - Integration Tests (API endpoints, database)
     - E2E Tests (critical user flows with Playwright)
     - Component Tests (React Testing Library)
     - API/Contract Tests (Pact)
     - Performance Tests (k6, load testing)
     - Security Tests (OWASP ZAP, vulnerability scanning)
     - Accessibility Tests (axe-core, WCAG 2.1 AA)
     - Mobile Tests (responsive, PWA)
     - Smoke Tests (<5 min critical path)
     - Regression Tests (automated in CI/CD)
     - Boundary Tests (edge cases, limits)
     - Negative Tests (error handling, invalid inputs)

4. **Entry/Exit Criteria**
   - Entry: Requirements for testing to begin
   - Exit: Requirements to complete testing

5. **Test Cases**
   - Format: TC-XXX-###
   - Include: ID, Priority, Title, Description, Requirements, Automated/Manual
   - Coverage: Happy path, edge cases, error scenarios

6. **Test Environment Setup**
   - URLs for each environment
   - Configuration requirements
   - Test data setup

7. **Resources & Schedule**
   - Team members
   - Tools (Playwright, k6, OWASP ZAP, etc.)
   - Timeline

8. **Risks & Dependencies**
   - Potential blockers
   - Mitigation strategies
   - External dependencies

Include:
- Test case tagging convention (@testcase TC-XXX-###)
- Traceability to requirements
- Defect management process
- Success metrics
```

**Example**:

```
Create a test plan following the TEST-### template format for expense filtering by date range.

Use this structure:
- Template: docs/qa/test-plans/TEST_PLAN_TEMPLATE.md
- File name: docs/qa/test-plans/TEST-002-expense-filtering.md
- Related requirement: REQ-004

Test Plan Details:

1. **Objective**
   - Purpose: Validate expense filtering by date range functionality
   - Goals:
     - Verify date range selection works correctly
     - Confirm filtered results match criteria
     - Test performance with large datasets
     - Validate error handling for invalid dates

[continues with full structure as above]
```

---

**Tips**:

- Reference the TEST_PLAN_TEMPLATE.md structure
- Include both automated and manual test coverage
- Link to related requirements (REQ-###) and designs (HLD-###)
- Specify test case IDs using TC-XXX-### format
- Mark test types as ✅ Covered / ⬜ Not Needed / ⚠️ Needed but Not Covered

---

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
