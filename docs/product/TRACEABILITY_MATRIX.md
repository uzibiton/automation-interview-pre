# Requirements Traceability Matrix

**Last Updated**: December 21, 2025

> **📝 Living Document**: This matrix should be updated whenever requirements, designs, tests, or implementation changes. Update the "Last Updated" date when making changes.

## Overview

This matrix provides bi-directional traceability between requirements, design documents, test plans, and implementation artifacts. Each feature is tracked from requirements through design, testing, and implementation.

## Traceability Matrix

| REQ ID      | Feature                         | Requirements                                          | Design                                                 | Test Plan                                                 | Tasks                                              | E2E Tests                                                               | Implementation                                                       | Status                                                                          |
| ----------- | ------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **REQ-001** | Expense Sorting                 | [REQ-001](requirements/REQ-001-expense-sorting.md)    | [HLD-001](../dev/designs/HLD-001-expense-sorting.md)\* | [TEST-001](../qa/test-plans/TEST-001-expense-sorting.md)  | [TASKS-001](../dev/TASKS-001-expense-sorting.md)\* | [sort-expenses.spec.ts](../../tests/e2e/expenses/sort-expenses.spec.ts) | [ExpenseList.tsx](../../app/frontend/src/components/ExpenseList.tsx) | ✅ Done                                                                         |
| **REQ-002** | Group Management (RBAC)         | [REQ-002](requirements/REQ-002-group-management.md)   | [HLD-002](../dev/designs/HLD-002-group-management.md)  | [TEST-002](../qa/test-plans/TEST-002-group-management.md) | [TASKS-002](../dev/TASKS-002-group-management.md)  | TBD                                                                     | TBD                                                                  | 🔍 Planned                                                                      |
| **REQ-003** | AI Conversational Expense Input | [REQ-003](requirements/REQ-003-ai-expense-input.md)\* | TBD                                                    | TBD                                                       | TBD                                                | TBD                                                                     | TBD                                                                  | 💡 Idea ([#68](https://github.com/uzibiton/automation-interview-pre/issues/68)) |

_\* = To be created_

---

## Requirements Coverage

### By Test Type

| REQ ID  | Unit Tests         | Component Tests | Integration Tests | E2E Tests   | Manual Tests |
| ------- | ------------------ | --------------- | ----------------- | ----------- | ------------ |
| REQ-001 | ⬜ Planned         | ⬜ Planned      | ⬜ Planned        | ✅ 8 tests  | ✅ 12 cases  |
| REQ-002 | 🔍 50+ tests (90%) | 🔍 25+ tests    | 🔍 45+ tests      | 🔍 20 flows | 🔍 110 cases |
| REQ-003 | 💡 TBD             | 💡 TBD          | 💡 TBD            | 💡 TBD      | 💡 TBD       |

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

### REQ-002: Group Management with RBAC

| FR ID  | Requirement                           | Test Cases               | Status     |
| ------ | ------------------------------------- | ------------------------ | ---------- |
| FR-001 | Group creation and management         | TC-002-001 to TC-002-010 | 🔍 Planned |
| FR-002 | Email invitation system               | TC-002-011 to TC-002-020 | 🔍 Planned |
| FR-003 | Shareable invite links                | TC-002-021 to TC-002-028 | 🔍 Planned |
| FR-004 | Direct member registration            | TC-002-029 to TC-002-034 | 🔍 Planned |
| FR-005 | Role-based permission enforcement     | TC-002-035 to TC-002-050 | 🔍 Planned |
| FR-006 | Member management (roles, revocation) | TC-002-051 to TC-002-058 | 🔍 Planned |

---

### REQ-002: Group Management with RBAC

| NFR ID  | Requirement                       | Test Cases               | Status      |
| ------- | --------------------------------- | ------------------------ | ----------- |
| NFR-001 | Performance (member list <300ms)  | TC-002-086, TC-002-087   | 🔍 Planned  |
| NFR-002 | Security (OWASP Top 10)           | TC-002-071 to TC-002-085 | 🔍 Planned  |
| NFR-003 | Usability (intuitive permissions) | TC-002-Usability         | 🔍 Planned  |
| NFR-004 | Compatibility (browsers/mobile)   | TC-002-Compatibility     | 🔍 Planned  |
| NFR-005 | Localization (EN/HE)              | TC-002-Localization      | 🔍 Planned  |
| NFR-006 | Accessibility (WCAG 2.1)          | None                     | ⚠️ Deferred |

## Non-Functional Requirements Mapping

### REQ-001: Expense Sorting

| NFR ID  | Requirement           | Test Cases | Status      |
| ------- | --------------------- | ---------- | ----------- | --- | --- | --- |
| NFR-001 | Performance < 100ms   | TC-001-011 | ✅ Pass     |
| NFR-002 | Usability             | TC-001-006 | ✅ Pass     |
| NFR-003 | Inte6                 | 0          | 0%          | 6   | 0   | 0%  |
| REQ-003 | TBD                   | TBD        | -           | TBD | TBD | -   |
| REQ-004 | Browser compatibility | TC-001-012 | ⚠️ Partial  |
| NFR-005 | Accessibility         | None       | ⬜ Deferred |

---

## Test Coverage Summary

| Requirement | Total FRs | Tested | Coverage | Total NFRs | Tested | Coverage |
| ----------- | --------- | ------ | -------- | ---------- | ------ | -------- |
| REQ-001     | 7         | 7      | 100%     | 5          | 4      | 80%      |
| REQ-002     | 6         | 0      | 0%       | 6          | 0      | 0%       |
| REQ-003     | TBD       | TBD    | -        | TBD        | TBD    | -        |

---

## Defects Traceability

## Document Index

### Requirements Documents

- [REQ-001: Expense Sorting](requirements/REQ-001-expense-sorting.md) - ✅ Complete
- [REQ-002: Group Management (RBAC)](requirements/REQ-002-group-management.md) - ✅ Complete
- [REQ-003: AI Conversational Expense Input](requirements/REQ-003-ai-expense-input.md) - 💡 Idea phase ([#68](https://github.com/uzibiton/automation-interview-pre/issues/68))
- [REQUIREMENTS_TEMPLATE.md](REQUIREMENTS_TEMPLATE.md) - Template

### Design Documents

- [HLD-001: Expense Sorting](../dev/designs/HLD-001-expense-sorting.md) - ⬜ To create
- [HLD-002: Group Management (RBAC)](../dev/designs/HLD-002-group-management.md) - ✅ Complete
- [HLD_TEMPLATE.md](../dev/HLD_TEMPLATE.md) - Template
- [DETAILED_DESIGN_TEMPLATE.md](../dev/DETAILED_DESIGN_TEMPLATE.md) - Template

### Test Plans

- [TEST-001: Expense Sorting](../qa/test-plans/TEST-001-expense-sorting.md) - ✅ Complete
- [TEST-002: Group Management (RBAC)](../qa/test-plans/TEST-002-group-management.md) - ✅ Complete
- [TEST_PLAN_TEMPLATE.md](../qa/test-plans/TEST_PLAN_TEMPLATE.md) - Template

### Implementation Tasks

- [TASKS-001: Expense Sorting](../dev/TASKS-001-expense-sorting.md) - ⬜ To create
- [TASKS-002: Group Management (RBAC)](../dev/TASKS-002-group-management.md) - ✅ Complete (26 tasks, 39-48 days)

### Test Automation

- [tests/e2e/expenses/sort-expenses.spec.ts](../../tests/e2e/expenses/sort-expenses.spec.ts) - ✅ Implemented
- [tests/e2e/expenses/create-expense.spec.ts](../../tests/e2e/expenses/create-expense.spec.ts) - ✅ Implemented
- [tests/e2e/health-check.spec.ts](../../tests/e2e/health-check.spec.ts) - ✅ Implemented
- [tests/e2e/groups/\*\*/\*.spec.ts](../../tests/e2e/groups/) - 🔍 Planned (20 test suites)

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
- **Example**: `REQ-002-group-management.md`
- **Location**: `docs/product/requirements/`

### Design Documents

- **Format**: `HLD-###-short-description.md` or `DDD-###-short-description.md`
- **Example**: `HLD-002-group-management.md`
- **Location**: `docs/dev/designs/`

### Test Plans

- **Format**: `TEST-###-short-description.md`
- **Example**: `TEST-002-group-management.md`
- **Location**: `docs/qa/test-plans/`

### Tasks

- **Format**: `TASKS-###-short-description.md`
- **Example**: `TASKS-002-group-management.md`
- **Location**: `docs/dev/`

### Test Cases

- **Format**: `TC-<FEATURE>-###`
- **Example**: `TC-002-001` (TEST-002, Test Case 001), `TC-002-071` (TEST-002, Security Test Case 071)
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
