# Technical Overview - Expense Tracker

Multi-environment expense tracking application with comprehensive testing infrastructure for SDET interview showcase.

## Project Purpose

This project demonstrates **QA planning and strategic thinking** rather than just testing a specific application. The focus is on:

- **Issue lifecycle management**: Template -> Issue -> Development -> Review -> Testing -> Deployment
- **AI-assisted development**: Using GitHub Copilot agents to implement features based on defined requirements
- **Iterative quality process**: Manual testing, pipeline validation, and continuous improvement
- **Professional practices**: Issue tracking, PR reviews, automated testing, cloud deployment

**The Application**: A web-based expense tracker with microservices architecture (Auth, API, Frontend), deployed on Google Cloud Run with PostgreSQL/Firestore databases and CI/CD via GitHub Actions.

---

## Environments

- **Local**: http://localhost:3000
- **Develop**: [https://expense-tracker-develop-buuath6a3q-uc.a.run.app](https://expense-tracker-develop-buuath6a3q-uc.a.run.app) (Auto-deploy on push to main)
- **Staging**: [https://expense-tracker-staging-buuath6a3q-uc.a.run.app](https://expense-tracker-staging-buuath6a3q-uc.a.run.app) (Manual deployment)
- **Production**: [https://expense-tracker-buuath6a3q-uc.a.run.app](https://expense-tracker-buuath6a3q-uc.a.run.app) (Manual deployment)
- **PR Environments**: `pr-{number}` format, temporary (auto-cleanup on PR close)

**Deployment Strategy:**

- Push to `main` -> Auto-deploys to **Develop**
- Staging & Production -> [Manual workflow dispatch](https://github.com/uzibiton/automation-interview-pre/actions/workflows/ci-cd.yml)

See [CI/CD Guide](devops/CI_CD_GUIDE.md) for complete deployment documentation.

---

## Quick Start

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

See **[E2E Testing Guide](qa/E2E_TESTING_GUIDE.md)** for complete multi-environment testing guide.

---

## Testing Infrastructure

- **E2E**: Playwright with multi-environment support
- **Contract**: API contract testing with Pact
- **Performance**: k6 & Locust load testing
- **Security**: OWASP ZAP, Bandit, dependency scanning
- **Reliability**: Soak, stress, spike, recovery tests
- **Visual**: Visual regression testing
- **Accessibility**: WCAG compliance testing

---

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: NestJS (Auth & API services)
- **Database**: Firestore (production) / PostgreSQL (local)
- **Infrastructure**: Google Cloud Run
- **CI/CD**: GitHub Actions
- **Testing**: Playwright, Jest, Pact, k6, Locust, OWASP ZAP

---

## Project Structure

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
├── tests/                        # COMPREHENSIVE TEST SUITE
│   ├── e2e/                      # End-to-end tests (Playwright)
│   │   ├── specs/                # Test specifications
│   │   ├── fixtures/             # Test data and utilities
│   │   └── page-objects/         # Page object models
│   ├── component/                # Component tests
│   ├── integration/              # Integration tests
│   ├── contract/                 # Contract tests (Pact)
│   ├── non-functional/           # Non-functional tests
│   │   ├── performance/          # Load & stress tests
│   │   ├── security/             # Security & penetration tests
│   │   └── reliability/          # Chaos engineering tests
│   ├── visual/                   # Visual regression tests
│   ├── unit/                     # Unit tests
│   ├── config/                   # Test configurations
│   └── README.md                 # Testing documentation
│
├── docs/                         # Documentation
│   ├── product/                  # Requirements & traceability
│   ├── dev/                      # Development docs & designs
│   ├── qa/                       # QA & testing docs
│   ├── devops/                   # CI/CD & deployment
│   ├── general/                  # General project info
│   ├── demo/                     # Demo materials
│   └── TABLE_OF_CONTENTS.md      # Full documentation index
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
├── README.md                     # Portfolio entry point
└── ABOUTME.md                    # About the author
```

---

## Workspaces

This project uses npm workspaces:

```json
{
  "workspaces": ["app/services/auth-service", "app/services/api-service", "app/frontend"]
}
```

---

## Configuration

Environment configurations are in `environments/`:

- `.env` - Local development
- `.env.cloudrun` - Cloud Run deployment
- `docker-compose.yml` - Docker stack

All build contexts updated to reference `app/` folder structure.

---

## Quick Links

| Category | Links |
|----------|-------|
| **Getting Started** | [Run Locally](dev/RUN_LOCALLY.md) |
| **Architecture** | [Application Architecture](../app/README.md) |
| **Testing** | [Test Strategy](qa/TEST_STRATEGY.md) / [E2E Guide](qa/E2E_TESTING_GUIDE.md) |
| **Deployment** | [CI/CD Guide](devops/CI_CD_GUIDE.md) / [Cloud Run](devops/CLOUD_RUN_DEPLOYMENT.md) |
| **Contributing** | [PR Workflow](qa/PR_WORKFLOW_GUIDE.md) |
| **Demo** | [SDET Demo Script](demo/SDET_DEMO_SCRIPT.md) |

---

## Notes

- **Date**: Folder structure reorganized December 5, 2025
- **Branch**: `refactor/folder-structure-reorg`
- **Purpose**: Cleaner organization for interview showcase
- **Breaking Changes**: All paths updated in configs (docker-compose, package.json, CI/CD)

See [PROJECT_STATUS.md](general/PROJECT_STATUS.md) for detailed status and next steps.
