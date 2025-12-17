# Requirements Traceability Matrix

**Last Updated**: December 17, 2025

> **📝 Living Document**: This matrix should be updated whenever requirements, designs, tests, or implementation changes. Update the "Last Updated" date when making changes.

## Overview

This matrix provides bi-directional traceability between requirements, design documents, test plans, and implementation artifacts. Each feature is tracked from requirements through design, testing, and implementation.

## Traceability Matrix

| REQ ID      | Feature             | Requirements                                          | Design                                                 | Test Plan                                                   | Execution                                                | E2E Tests                                                                 | Implementation                                                           | Status  |
| ----------- | ------------------- | ----------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------- |
| **REQ-001** | Expense Sorting     | [REQ-001](requirements/REQ-001-expense-sorting.md)    | [HLD-001](../dev/designs/HLD-001-expense-sorting.md)\* | [TEST-001](../qa/test-plans/TEST-001-expense-sorting.md)    | [EXEC-001](../qa/test-plans/EXEC-001-expense-sorting.md) | [sort-expenses.spec.ts](../../tests/e2e/expenses/sort-expenses.spec.ts)   | [ExpenseList.tsx](../../app/frontend/src/components/ExpenseList.tsx)     | ✅ Done |
| **REQ-002** | Expense Creation    | [REQ-002](requirements/REQ-002-expense-creation.md)\* | TBD                                                    | [TEST-002](../qa/test-plans/TEST-002-expense-creation.md)\* | TBD                                                      | [create-expense.spec.ts](../../tests/e2e/expenses/create-expense.spec.ts) | [ExpenseDialog.tsx](../../app/frontend/src/components/ExpenseDialog.tsx) | ✅ Done |
| **REQ-003** | User Authentication | [REQ-003](requirements/REQ-003-authentication.md)\*   | TBD                                                    | [TEST-003](../qa/test-plans/TEST-003-authentication.md)\*   | TBD                                                      | [health-check.spec.ts](../../tests/e2e/health-check.spec.ts)              | [auth-service](../../app/services/auth-service/)                         | ✅ Done |

_\* = To be created_

---

## Requirements Coverage

### By Test Type

| REQ ID  | Unit Tests | Component Tests | Integration Tests | E2E Tests  | Manual Tests |
| ------- | ---------- | --------------- | ----------------- | ---------- | ------------ |
| REQ-001 | ⬜ Planned | ⬜ Planned      | ⬜ Planned        | ✅ 8 tests | ✅ 12 cases  |
| REQ-002 | ⬜ Planned | ⬜ Planned      | ⬜ Planned        | ✅ 3 tests | ⬜ TBD       |
| REQ-003 | ⬜ Planned | ⬜ Planned      | ✅ 1 test         | ✅ 1 test  | ⬜ TBD       |

---

## Functional Requirements Mapping

### REQ-001: Expense Sorting

| FR ID  | Requirement                   | Test Cases             | Status  |
| ------ | ----------------------------- | ---------------------- | ------- |
| FR-001 | Date column sorting           | TC-001-001             | ✅ Pass |
| FR-002 | Category column sorting       | TC-001-002             | ✅ Pass |
| FR-003 | Description column sorting    | TC-001-003             | ✅ Pass |
| FR-004 | Amount column sorting         | TC-001-004             | ✅ Pass |
| FR-005 | Payment method column sorting | TC-001-005             | ✅ Pass |
| FR-006 | Sort state indicators         | TC-001-006             | ✅ Pass |
| FR-007 | Tri-state sorting behavior    | TC-001-007, TC-001-008 | ✅ Pass |

---

## Non-Functional Requirements Mapping

### REQ-001: Expense Sorting

| NFR ID  | Requirement           | Test Cases | Status      |
| ------- | --------------------- | ---------- | ----------- |
| NFR-001 | Performance < 100ms   | TC-001-011 | ✅ Pass     |
| NFR-002 | Usability             | TC-001-006 | ✅ Pass     |
| NFR-003 | Internationalization  | TC-001-009 | ⚠️ Partial  |
| NFR-004 | Browser compatibility | TC-001-012 | ⚠️ Partial  |
| NFR-005 | Accessibility         | None       | ⬜ Deferred |

---

## Test Coverage Summary

| Requirement | Total FRs | Tested | Coverage | Total NFRs | Tested | Coverage |
| ----------- | --------- | ------ | -------- | ---------- | ------ | -------- |
| REQ-001     | 7         | 7      | 100%     | 5          | 4      | 80%      |
| REQ-002     | TBD       | TBD    | -        | TBD        | TBD    | -        |
| REQ-003     | TBD       | TBD    | -        | TBD        | TBD    | -        |

---

## Defects Traceability

| Bug ID | Related REQ | FR/NFR | Severity | Status   | Fix PR                                                                 |
| ------ | ----------- | ------ | -------- | -------- | ---------------------------------------------------------------------- |
| BUG-01 | REQ-001     | FR-005 | High     | ✅ Fixed | [PR #56](https://github.com/uzibiton/automation-interview-pre/pull/56) |

---

## Document Index

### Requirements Documents

- [REQ-001: Expense Sorting](requirements/REQ-001-expense-sorting.md) - ✅ Complete
- [REQ-002: Expense Creation](requirements/REQ-002-expense-creation.md) - ⬜ To create
- [REQ-003: User Authentication](requirements/REQ-003-authentication.md) - ⬜ To create
- [REQUIREMENTS_TEMPLATE.md](REQUIREMENTS_TEMPLATE.md) - Template

### Design Documents

- [HLD-001: Expense Sorting](../dev/designs/HLD-001-expense-sorting.md) - ⬜ To create
- [HLD_TEMPLATE.md](../dev/HLD_TEMPLATE.md) - Template
- [DETAILED_DESIGN_TEMPLATE.md](../dev/DETAILED_DESIGN_TEMPLATE.md) - Template

### Test Plans

- [TEST-001: Expense Sorting](../qa/test-plans/TEST-001-expense-sorting.md) - ✅ Complete
- [TEST-002: Expense Creation](../qa/test-plans/TEST-002-expense-creation.md) - ⬜ To create
- [TEST-003: Authentication](../qa/test-plans/TEST-003-authentication.md) - ⬜ To create
- [TEST_PLAN_TEMPLATE.md](../qa/test-plans/TEST_PLAN_TEMPLATE.md) - Template

### Test Automation

- [tests/e2e/expenses/sort-expenses.spec.ts](../../tests/e2e/expenses/sort-expenses.spec.ts) - ✅ Implemented
- [tests/e2e/expenses/create-expense.spec.ts](../../tests/e2e/expenses/create-expense.spec.ts) - ✅ Implemented
- [tests/e2e/health-check.spec.ts](../../tests/e2e/health-check.spec.ts) - ✅ Implemented

---

## Naming Conventions

### Requirements

- **Format**: `REQ-###-short-description.md`
- **Example**: `REQ-001-expense-sorting.md`
- **Location**: `docs/product/requirements/`

### Design Documents

- **Format**: `HLD-###-short-description.md` or `DDD-###-short-description.md`
- **Example**: `HLD-001-expense-sorting.md`
- **Location**: `docs/dev/designs/`

### Test Plans

- **Format**: `TEST-###-short-description.md`
- **Example**: `TEST-001-expense-sorting.md`
- **Location**: `docs/qa/test-plans/`

### Test Cases

- **Format**: `TC-<FEATURE>-###`
- **Example**: `TC-001-001` (TEST-001, Test Case 001), `TC-002-001` (TEST-002, Test Case 001)
- **Embedded in**: Test plan documents

---

## How to Use This Matrix

### For Requirements Traceability

1. Start with a requirement (REQ-###)
2. Follow links to find design, tests, and implementation
3. Verify all requirements have corresponding tests
4. Check test execution status

### For Test Planning

1. Review requirements document
2. Identify functional and non-functional requirements
3. Create test plan with traceability links
4. Map test cases to specific FRs/NFRs

### For Impact Analysis

1. Identify changed requirement
2. Use matrix to find affected design docs
3. Find related test plans and update
4. Re-run affected tests

### For Coverage Analysis

1. Review requirements list
2. Check test coverage percentages
3. Identify gaps (requirements without tests)
4. Create additional tests as needed

---

## Status Legend

- ✅ **Complete**: Document created and reviewed
- ⬜ **Planned**: Scheduled for creation
- 🔍 **In Progress**: Currently being worked on
- ⚠️ **Partial**: Partially complete, needs work
- ❌ **Blocked**: Blocked by dependency

---

**Maintained by**: QA/SDET Team  
**Review Frequency**: Weekly or on major changes  
**Next Review**: On next feature implementation
