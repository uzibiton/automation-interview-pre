# Uzi Biton - Senior SDET Portfolio

**Senior QA Automation Engineer & Test Infrastructure Architect**

> Building robust, scalable testing infrastructure that catches bugs before they reach production. This portfolio showcases enterprise-grade test automation, CI/CD integration, and quality engineering practices.

[![GitHub](https://img.shields.io/badge/GitHub-@uzibiton-181717?style=flat&logo=github)](https://github.com/uzibiton)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Uzi_Biton-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/uzibiton)

---

## What This Portfolio Demonstrates

This isn't just a collection of test cases - it's a complete **test automation infrastructure** designed with enterprise-grade practices:

| Capability | Implementation |
|------------|----------------|
| **Test Architecture** | Multi-layered strategy (Unit -> Integration -> Contract -> E2E) |
| **CI/CD Pipeline** | GitHub Actions with automated testing gates |
| **Multi-Environment Testing** | Same tests run on local, Docker, staging, and production |
| **Cloud Deployment** | Google Cloud Run with auto-scaling and PR environments |
| **Documentation System** | Full traceability: Requirements -> Design -> Test Plans -> Implementation |
| **Non-Functional Testing** | Performance (k6), Security (OWASP ZAP), Accessibility (WCAG) |

---

## Key Achievements

- **272+ test scenarios** documented across 3 features (expense sorting, group management, AI input)
- **4-environment test execution** without code changes (local/docker/staging/production)
- **Ephemeral PR environments** with automatic cleanup
- **Complete traceability** from requirements to E2E tests
- **7-stage CI/CD pipeline** with parallel execution (10-16 min total)

---

## Featured: End-to-End Traceability

**Expense Sorting Feature** - Complete documentation from requirements to passing tests:

[![Watch Test Execution](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/demo/screenshots/Screenshot.png)](https://youtu.be/zOg7DhXGRH4)

| Document | Status |
|----------|--------|
| [REQ-001: Requirements](docs/product/requirements/REQ-001-expense-sorting.md) | 7 FRs, 5 NFRs |
| [HLD-001: Design](docs/dev/designs/HLD-001-expense-sorting.md) | Architecture & algorithms |
| [TEST-001: Test Plan](docs/qa/test-plans/TEST-001-expense-sorting.md) | 12 test cases |
| [E2E Tests](tests/e2e/expenses/sort-expenses.spec.ts) | 8/8 passing |

**Traceability Flow**: `Requirements -> Design -> Test Plan -> Implementation -> E2E Tests`

---

## Live Environments

| Environment | URL | Trigger |
|-------------|-----|---------|
| **Develop** | [expense-tracker-develop](https://expense-tracker-develop-buuath6a3q-uc.a.run.app) | Auto on push to main |
| **Staging** | [expense-tracker-staging](https://expense-tracker-staging-buuath6a3q-uc.a.run.app) | Manual |
| **Production** | [expense-tracker](https://expense-tracker-buuath6a3q-uc.a.run.app) | Manual |
| **PR Environments** | `pr-{number}` | Auto-created, auto-cleanup |

---

## Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Application**
- React + TypeScript + Vite
- NestJS (Auth & API services)
- Firestore / PostgreSQL
- Google Cloud Run

</td>
<td valign="top" width="50%">

**Testing & Infrastructure**
- Playwright (E2E, multi-browser)
- Jest (Unit, Component)
- Pact (Contract testing)
- k6 & Locust (Performance)
- OWASP ZAP (Security)
- GitHub Actions (CI/CD)

</td>
</tr>
</table>

---

## Quick Navigation

| For... | Start Here |
|--------|------------|
| **About Me** | [ABOUTME.md](ABOUTME.md) |
| **Full Documentation** | [Table of Contents](docs/TABLE_OF_CONTENTS.md) |
| **Test Strategy** | [TEST_STRATEGY.md](docs/qa/TEST_STRATEGY.md) |
| **CI/CD Pipeline** | [CI_CD_GUIDE.md](docs/devops/CI_CD_GUIDE.md) |
| **Demo Script** | [SDET_DEMO_SCRIPT.md](docs/demo/SDET_DEMO_SCRIPT.md) |
| **Getting Started** | [GETTING_STARTED.md](docs/GETTING_STARTED.md) |
| **Technical Details** | [TECHNICAL_OVERVIEW.md](docs/TECHNICAL_OVERVIEW.md) |

---

## Project Links

- [GitHub Issues](https://github.com/uzibiton/automation-interview-pre/issues) - Issue tracking with structured templates
- [Project Board](https://github.com/users/uzibiton/projects/2/views/2) - QA backlog and task management
- [CI/CD Workflows](https://github.com/uzibiton/automation-interview-pre/actions) - Pipeline executions

---

## Documentation Structure

```
docs/
├── product/          # Requirements & traceability matrix
├── dev/              # Designs (HLD), implementation tasks
├── qa/               # Test strategy, test plans, E2E guides
├── devops/           # CI/CD, deployment, Cloud Run
├── demo/             # Interview scripts, portfolio materials
└── general/          # Project status, prompts library
```

---

## In Active Development

- [Group Management](https://github.com/uzibiton/automation-interview-pre/issues/69) - 78% complete (RBAC, 110 test cases)
- [AI Expense Input](https://github.com/uzibiton/automation-interview-pre/issues/68) - 8% complete (NLP, 150 test cases)

See [PROJECT_STATUS.md](docs/general/PROJECT_STATUS.md) for current roadmap.

---

<div align="center">

**[Explore the Automation Infrastructure](docs/TABLE_OF_CONTENTS.md)**

_Quality is not an act, it is a habit._

</div>
