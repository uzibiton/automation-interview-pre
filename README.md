# Automation Interview Pre - Expense Tracker

Multi-environment expense tracking application with comprehensive testing infrastructure for SDET interview showcase.

👤 **[About the Author](docs/general/ABOUTME.md)** | 📋 **[Testing Strategy](docs/qa/TESTING_STRATEGY.md)** | 📝 **[Issue Template Tracking](.github/ISSUE_TEMPLATE/TRACKING.md)**

> **Note:** Issue Template Tracking helps you see which feature requests and tasks have been created as GitHub issues vs. which are still available as templates.

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
│   ├── general/                  # General project info
│   ├── dev/                      # Development docs
│   ├── qa/                       # QA & testing docs
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

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start all services (Docker)
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

## 🌐 Environments

- **Local**: http://localhost:3000
- **Staging**: https://frontend-staging-773292472093.us-central1.run.app
- **Production**: https://frontend-773292472093.us-central1.run.app

## 📚 Documentation

📖 **[Complete Table of Contents](docs/TABLE_OF_CONTENTS.md)** - Full documentation index with all guides and resources

### Quick Links
- **[Run Locally](docs/dev/RUN_LOCALLY.md)** - Get started with local development
- **[Application Architecture](app/README.md)** - System design and data flow
- **[Testing Strategy](docs/qa/TESTING_STRATEGY.md)** - Comprehensive QA approach
- **[PR Workflow Guide](docs/qa/PR_WORKFLOW_GUIDE.md)** - Contribute to the project
- **[Deployment Guide](docs/devops/DEPLOYMENT.md)** - Deploy to staging/production
- **[SDET Demo Script](docs/demo/SDET_DEMO_SCRIPT.md)** - Interview presentation

### Documentation Structure
- **[docs/general/](docs/general/)** - Project overview and status
- **[docs/dev/](docs/dev/)** - Development setup and API docs
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
