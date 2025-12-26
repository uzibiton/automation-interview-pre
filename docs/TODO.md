# TODO - Roadmap & Future Improvements

This document tracks planned improvements to the test automation infrastructure and portfolio.

---

## Table of Contents

- [In Progress](#in-progress)
- [Planned Improvements](#planned-improvements)
- [Ideas Backlog](#ideas-backlog)
- [Completed](#completed)

---

## In Progress

### Group Management Feature (TASK-002)

- **Status**: 78% complete
- **Tracking**: [GitHub Issue #69](https://github.com/uzibiton/automation-interview-pre/issues/69)
- **Details**: [TASKS-002-group-management.md](dev/TASKS-002-group-management.md)
- **Remaining**:
  - [ ] Group Dashboard Page
  - [ ] Expense List Updates for groups
  - [ ] Invitation Acceptance Page
  - [ ] E2E tests for group flows

### AI Expense Input Feature (TASK-003)

- **Status**: 8% complete
- **Tracking**: [GitHub Issue #68](https://github.com/uzibiton/automation-interview-pre/issues/68)
- **Details**: [TASKS-003-ai-expense-input.md](dev/TASKS-003-ai-expense-input.md)
- **Remaining**: 17 tasks need GitHub issues created

---

## Planned Improvements

### Test Infrastructure

- [ ] **Expand E2E Coverage**
  - Complete E2E tests for Group Management (20+ flows)
  - Add E2E tests for AI expense input when implemented
  - Visual regression tests for critical UI components

- [ ] **Contract Testing Expansion**
  - Add Pact contracts for all API endpoints
  - Set up Pact Broker for contract versioning
  - Consumer-driven contract workflow in CI

- [ ] **Performance Testing Suite**
  - k6 load tests for API endpoints
  - Lighthouse CI for frontend performance
  - Database query performance benchmarks

- [ ] **Security Testing**
  - OWASP ZAP automated scans in CI
  - Dependency vulnerability scanning (Snyk)
  - Authentication/authorization test scenarios

### CI/CD Pipeline

- [ ] **Enable Integration Tests**
  - Currently skipped in CI for speed
  - Add optional flag to run on staging deploys

- [ ] **Enable Smoke Tests**
  - Post-deployment verification
  - Critical path validation

- [ ] **Test Reporting**
  - Allure reports integration
  - Test trend tracking over time
  - Coverage trend visualization

### Documentation

- [ ] **API Documentation**
  - OpenAPI/Swagger specs
  - Interactive API explorer
  - Request/response examples

- [ ] **Architecture Diagrams**
  - C4 model diagrams
  - Sequence diagrams for key flows
  - Test infrastructure overview

---

## Ideas Backlog

For exploratory ideas and future features, see [IDEAS.md](general/IDEAS.md).

---

## Completed

### December 2024

- [x] Folder structure reorganization
- [x] E2E test framework setup (Playwright)
- [x] Multi-environment test execution
- [x] CI/CD pipeline with GitHub Actions
- [x] Cloud Run deployment automation
- [x] REQ/HLD/TEST document templates
- [x] Traceability matrix system
- [x] Expense Sorting feature (REQ-001 -> E2E)
- [x] Group Management planning (REQ-002, HLD-002, TEST-002)
- [x] AI Expense Input planning (REQ-003, HLD-003, TEST-003)
- [x] Portfolio documentation restructuring

---

## Contributing

Want to help? Check:

- [GitHub Issues](https://github.com/uzibiton/automation-interview-pre/issues) - Open tasks
- [GETTING_STARTED.md](GETTING_STARTED.md) - How to contribute
- [PR_WORKFLOW_GUIDE.md](qa/PR_WORKFLOW_GUIDE.md) - PR process

---

## References

- [PROJECT_STATUS.md](general/PROJECT_STATUS.md) - Current project state
- [IDEAS.md](general/IDEAS.md) - Feature ideas backlog
- [GitHub Project Board](https://github.com/users/uzibiton/projects/2) - Task tracking
