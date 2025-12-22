# Automation infrastructure - Expense Tracker

Multi-environment expense tracking application with comprehensive testing infrastructure for SDET interview showcase.

## 🎯 Project Purpose

This project demonstrates **QA planning and strategic thinking** rather than just testing a specific application. The focus is on:

- **Issue lifecycle management**: Template → Issue → Development → Review → Testing → Deployment
- **AI-assisted development**: Using GitHub Copilot agents to implement features based on defined requirements
- **Iterative quality process**: Manual testing, pipeline validation, and continuous improvement
- **Professional practices**: Issue tracking, PR reviews, automated testing, cloud deployment

**The Application**: A web-based expense tracker with microservices architecture (Auth, API, Frontend), deployed on Google Cloud Run with PostgreSQL/Firestore databases and CI/CD via GitHub Actions.

📑 **[Table of Contents](docs/TABLE_OF_CONTENTS.md)** | 📋 **[Test Strategy](docs/qa/TEST_STRATEGY.md)** | 🧪 **[E2E Testing Guide](docs/qa/E2E_TESTING_GUIDE.md)** | 🚀 **[CI/CD Guide](docs/devops/CI_CD_GUIDE.md)** | 👤 **[About the Author](docs/general/ABOUTME.md)** | 🐛 **[GitHub Issues](https://github.com/uzibiton/automation-interview-pre/issues)** | 📊 **[Project Board](https://github.com/users/uzibiton/projects/2/views/2)**

> **Note:** All issues, bugs, and feature requests are now tracked in GitHub Issues with structured templates for consistent tracking and workflow management.

## 🎬 Demo: Feature in Action

**Expense Sorting Feature** - Complete traceability from requirements to passing tests:

🎥 **[![Watch Test Execution Video](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/demo/screenshots/Screenshot.png)](https://youtu.be/zOg7DhXGRH4)**

**Complete Feature Documentation:**

- 📋 [REQ-001: Requirements](docs/product/requirements/REQ-001-expense-sorting.md) - 7 FRs, 5 NFRs
- 🏗️ [HLD-001: Design](docs/dev/designs/HLD-001-expense-sorting.md) - Architecture & algorithms
- ✅ [TEST-001: Test Plan](docs/qa/test-plans/TEST-001-expense-sorting.md) - 12 test cases, 10/12 passed
- 🔗 [Traceability Matrix](docs/product/TRACEABILITY_MATRIX.md) - End-to-end mapping

**Traceability Flow**: Requirements → Design → Test Plan → Implementation → E2E Tests ✅

**Test Results**: 8/8 E2E automated tests passing | [View E2E Tests](tests/e2e/expenses/sort-expenses.spec.ts) | [📊 View Execution Report](docs/qa/test-plans/EXEC-001-expense-sorting.md)

## 🌐 Environments

- **Local**: http://localhost:3000
- **Develop**: [https://expense-tracker-develop-buuath6a3q-uc.a.run.app](https://expense-tracker-develop-buuath6a3q-uc.a.run.app) (Auto-deploy on push to main)
- **Staging**: [https://expense-tracker-staging-buuath6a3q-uc.a.run.app](https://expense-tracker-staging-buuath6a3q-uc.a.run.app) (Manual deployment)
- **Production**: [https://expense-tracker-buuath6a3q-uc.a.run.app](https://expense-tracker-buuath6a3q-uc.a.run.app) (Manual deployment)
- **PR Environments**: `pr-{number}` format, temporary (auto-cleanup on PR close)

**Deployment Strategy:**

- Push to `main` → Auto-deploys to **Develop**
- Staging & Production → [Manual workflow dispatch](https://github.com/uzibiton/automation-interview-pre/actions/workflows/ci-cd.yml)

📖 See [CI/CD Guide](docs/devops/CI_CD_GUIDE.md) for complete deployment documentation.

## 💡 Ideas & Innovation

**Exploring New Features:**

- 💬 [#68 - AI-Powered Conversational Expense Input & Comparative Analytics](https://github.com/uzibiton/automation-interview-pre/issues/68) - **8%** (2/25 subtasks completed)
  - ✅ [REQ-003: Requirements](docs/product/requirements/REQ-003-ai-expense-input.md) - 7 user stories, 7 FRs, 7 NFRs
  - ✅ [HLD-003: Design](docs/dev/designs/HLD-003-ai-expense-input.md) - NLP pipeline, AI adapter, security architecture
  - ✅ [TEST-003: Test Plan](docs/qa/test-plans/TEST-003-ai-expense-input.md) - 150 test cases (AI accuracy, security, privacy, bias)
  - ✅ [TASKS-003: Implementation](docs/dev/TASKS-003-ai-expense-input.md) - 40 tasks, 56-69 days estimated
  - ✅ [GitHub Issues](https://github.com/uzibiton/automation-interview-pre/issues?q=is%3Aissue+label%3ATASK-003) - 23 issues retrofitted with [TASK-003-XXX] naming (P0:4, P1:9, P2:11, P3:7, P4:9)
  - 🔍 17 additional tasks need GitHub issues created
- 👥 [#69 - Household/Group Management with Role-Based Permissions](https://github.com/uzibiton/automation-interview-pre/issues/69) - **78%** (Phase 3 UI: 7/9 completed, 3 in progress)
  - ✅ [REQ-002: Requirements](docs/product/requirements/REQ-002-group-management.md) - 10 user stories, 6 FRs, 9 API specs
  - ✅ [HLD-002: Design](docs/dev/designs/HLD-002-group-management.md) - Architecture, RBAC, database schema
  - ✅ [TEST-002: Test Plan](docs/qa/test-plans/TEST-002-group-management.md) - 110 test cases across functional, security, performance
  - ✅ [TASKS-002: Implementation](docs/dev/TASKS-002-group-management.md) - 28 tasks, 41-50 days estimated
  - ✅ [GitHub Issues](https://github.com/uzibiton/automation-interview-pre/issues?q=is%3Aissue+label%3ATASK-002) - 30 issues created with [TASK-002-XXX] naming (P0:2, P1:8, P2:4, P3:11, P4:5)
  - 🔍 Phase 3 UI Components: Mock API, Stores (Group/Invitation), Dialogs (Creation/Role), Tables (Members), Modals (Invitation) - 7/9 ✅
  - 🔍 In Progress: Group Dashboard Page, Expense List Updates, Invitation Acceptance Page
- 📱 [#80 - Add PWA + Mobile/Desktop Testing Demo (Without Native Apps)](https://github.com/uzibiton/automation-interview-pre/issues/80) - **0%** (idea phase)
- 🔍 [#81 - Implement Production Synthetic Monitoring (Shift-Right Testing)](https://github.com/uzibiton/automation-interview-pre/issues/81) - **0%** (idea phase)

📝 **[View All Ideas](https://github.com/uzibiton/automation-interview-pre/labels/type%3Aidea)** | **[Suggest New Idea](https://github.com/uzibiton/automation-interview-pre/issues/new?template=template-idea.md)**

## 📚 Documentation

📖 **[Complete Table of Contents](docs/TABLE_OF_CONTENTS.md)** - Full documentation index with all guides and resources

### 📋 Document Traceability

Professional documentation with **bidirectional traceability** between requirements, design, tests, and implementation:

| Type              | Format                      | Example                                                                                                                                                                                                                                                        |
| ----------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Requirements**  | `REQ-###-feature-name.md`   | [REQ-001-expense-sorting.md](docs/product/requirements/REQ-001-expense-sorting.md), [REQ-002-group-management.md](docs/product/requirements/REQ-002-group-management.md), [REQ-003-ai-expense-input.md](docs/product/requirements/REQ-003-ai-expense-input.md) |
| **Design (HLD)**  | `HLD-###-feature-name.md`   | [HLD-001-expense-sorting.md](docs/dev/designs/HLD-001-expense-sorting.md), [HLD-002-group-management.md](docs/dev/designs/HLD-002-group-management.md), [HLD-003-ai-expense-input.md](docs/dev/designs/HLD-003-ai-expense-input.md)                            |
| **Test Plans**    | `TEST-###-feature-name.md`  | [TEST-001-expense-sorting.md](docs/qa/test-plans/TEST-001-expense-sorting.md), [TEST-002-group-management.md](docs/qa/test-plans/TEST-002-group-management.md), [TEST-003-ai-expense-input.md](docs/qa/test-plans/TEST-003-ai-expense-input.md)                |
| **Tasks**         | `TASKS-###-feature-name.md` | [TASKS-002-group-management.md](docs/dev/TASKS-002-group-management.md), [TASKS-003-ai-expense-input.md](docs/dev/TASKS-003-ai-expense-input.md)                                                                                                               |
| **GitHub Issues** | `[TASK-###-YYY] Title`      | [View TASK-002 Issues](https://github.com/uzibiton/automation-interview-pre/issues?q=is%3Aissue+label%3ATASK-002), [View TASK-003 Issues](https://github.com/uzibiton/automation-interview-pre/issues?q=is%3Aissue+label%3ATASK-003)                           |

**Traceability Flow**: `REQ <-> HLD <-> TEST <-> TASKS <-> Implementation <-> E2E Tests`

📊 **[View Traceability Matrix](docs/product/TRACEABILITY_MATRIX.md)** - Complete requirements mapping for all features

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Build and start all services with Docker Compose
docker-compose build
docker-compose up -d

# Or use npm script
npm run docker:up

# Start services individually
npm run dev:auth      # Auth service on :3001
npm run dev:api       # API service on :3002
npm run dev:frontend  # Frontend on :3000
```

### Running Tests

```bash
# E2E tests
npm run test:e2e:local              # Local environment
npm run test:e2e:staging            # Staging environment
npm run test:e2e:production:smoke   # Production smoke tests

# Multi-environment tests
npm run test:e2e:docker             # Docker environment
```

📖 **[E2E Testing Guide](docs/qa/E2E_TESTING_GUIDE.md)** - Complete multi-environment testing guide

### Quick Links

- **[Run Locally](docs/dev/RUN_LOCALLY.md)** - Get started with local development
- **[Application Architecture](app/README.md)** - System design and data flow
- **[Test Strategy](docs/qa/TEST_STRATEGY.md)** - Comprehensive testing approach ⭐
- **[E2E Testing Guide](docs/qa/E2E_TESTING_GUIDE.md)** - End-to-end testing guide ⭐
- **[CI/CD Guide](docs/devops/CI_CD_GUIDE.md)** - Pipeline and deployment guide ⭐
- **[Portfolio Roadmap](docs/demo/PORTFOLIO_IMPROVEMENT_PLAN.md)** - 5-phase improvement plan
- **[PR Workflow Guide](docs/qa/PR_WORKFLOW_GUIDE.md)** - Contribute to the project
- **[Cloud Run Deployment](docs/devops/CLOUD_RUN_DEPLOYMENT.md)** - Deploy to staging/production
- **[SDET Demo Script](docs/demo/SDET_DEMO_SCRIPT.md)** - Interview presentation

### Documentation Structure

- **[docs/product/](docs/product/)** - Requirements and traceability
- **[docs/general/](docs/general/)** - Project overview and status
- **[docs/dev/](docs/dev/)** - Development setup, API docs, and designs
- **[docs/qa/](docs/qa/)** - Testing and quality assurance
- **[docs/devops/](docs/devops/)** - CI/CD and deployment
- **[docs/demo/](docs/demo/)** - Presentation materials

## 🧪 Testing Infrastructure

- **E2E**: Playwright with multi-environment support
- **Contract**: API contract testing
- **Performance**: k6 & Locust load testing
- **Security**: OWASP ZAP, Bandit, dependency scanning
- **Reliability**: Soak, stress, spike, recovery tests
- **Visual**: Visual regression testing
- **Accessibility**: WCAG compliance testing

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: NestJS (Auth & API services)
- **Database**: Firestore (production) / PostgreSQL (local)
- **Infrastructure**: Google Cloud Run
- **CI/CD**: GitHub Actions
- **Testing**: Playwright, k6, Locust, OWASP ZAP

## 📁 Project Structure

```
automation-interview-pre/
├── app/                          # Application code
│   ├── services/                 # Backend microservices
│   │   ├── auth-service/         # Authentication service (NestJS)
│   │   └── api-service/          # API service (NestJS)
│   ├── frontend/                 # React frontend (TypeScript + Vite)
│   ├── database/                 # Database schemas & migrations
│   ├── nginx/                    # Nginx configurations
│   ├── scripts/                  # Utility scripts
│   └── README.md                 # Architecture documentation
│
├── tests/                        # 🎯 COMPREHENSIVE TEST SUITE (Main Focus)
│   ├── e2e/                      # End-to-end tests (Playwright)
│   │   ├── specs/                # Test specifications
│   │   ├── fixtures/             # Test data and utilities
│   │   └── page-objects/         # Page object models
│   ├── component/                # Component tests
│   │   ├── frontend/             # React component tests
│   │   └── storybook/            # Storybook stories
│   ├── integration/              # Integration tests
│   │   ├── api/                  # API integration tests
│   │   └── database/             # Database integration tests
│   ├── contract/                 # Contract tests (Pact)
│   │   ├── consumers/            # Consumer contract tests
│   │   └── providers/            # Provider contract tests
│   ├── non-functional/           # Non-functional tests
│   │   ├── performance/          # Load & stress tests
│   │   ├── security/             # Security & penetration tests
│   │   └── reliability/          # Chaos engineering tests
│   ├── visual/                   # Visual regression tests
│   ├── unit/                     # Unit tests
│   ├── config/                   # Test configurations
│   │   ├── playwright.config.ts  # Playwright config
│   │   ├── jest.config.js        # Jest config
│   │   └── environments/         # Environment configs
│   ├── reports/                  # Test reports & artifacts
│   ├── fixtures/                 # Shared test data
│   └── README.md                 # Testing documentation
│
├── docs/                         # Documentation
│   ├── product/                  # Requirements & traceability
│   │   ├── requirements/         # Feature requirements (REQ-###)
│   │   └── TRACEABILITY_MATRIX.md # Requirements mapping
│   ├── dev/                      # Development docs
│   │   └── designs/              # High-level designs (HLD-###)
│   ├── qa/                       # QA & testing docs
│   │   └── test-plans/           # Test plans (TEST-###)
│   ├── general/                  # General project info
│   ├── devops/                   # CI/CD & deployment
│   ├── ui/                       # UI/UX guides
│   ├── demo/                     # Demo materials
│   └── README.md                 # Documentation hub
│
├── environments/                 # Environment configurations
│   ├── docker-compose.yml        # Local development stack
│   └── deploy-*.sh               # Deployment scripts
│
├── .github/                      # GitHub Actions workflows
│   ├── workflows/                # CI/CD workflows
│   └── ISSUE_TEMPLATE/           # Issue templates
│
├── docker-compose.yml            # Root Docker Compose file
├── package.json                  # Root package.json (workspaces)
└── README.md                     # This file
```

## 📦 Workspaces

This project uses npm workspaces:

```json
{
  "workspaces": ["app/services/auth-service", "app/services/api-service", "app/frontend"]
}
```

## 🔧 Configuration

Environment configurations are in `environments/`:

- `.env` - Local development
- `.env.cloudrun` - Cloud Run deployment
- `docker-compose.yml` - Docker stack

All build contexts updated to reference `app/` folder structure.

## 📝 Notes

- **Date**: Folder structure reorganized December 5, 2025
- **Branch**: `refactor/folder-structure-reorg`
- **Purpose**: Cleaner organization for interview showcase
- **Breaking Changes**: All paths updated in configs (docker-compose, package.json, CI/CD)

See [docs/general/PROJECT_STATUS.md](docs/general/PROJECT_STATUS.md) for detailed status and next steps.
