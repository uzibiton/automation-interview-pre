# Automation Interview Pre - Expense Tracker

Multi-environment expense tracking application with comprehensive testing infrastructure for SDET interview showcase.

👤 **[About the Author](doc/ABOUTME.md)** | 📋 **[Testing Strategy](doc/TESTING_STRATEGY.md)** | 📝 **[Issue Template Tracking](.github/ISSUE_TEMPLATE/TRACKING.md)**

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
│   └── scripts/                  # Utility scripts
│
├── tests/                        # All test suites
│   ├── e2e/                      # End-to-end tests (Playwright)
│   ├── contract/                 # Contract tests
│   ├── component/                # Component tests
│   ├── non-functional/           # Performance, security, reliability
│   ├── visual/                   # Visual regression tests
│   └── config/                   # Test configurations
│
├── docs/                         # Documentation
│   ├── PROJECT_STATUS.md         # Current project status
│   ├── SDET_DEMO_SCRIPT.md       # Demo script for interviews
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── API_REFERENCE.md          # API documentation
│   └── ...                       # Additional docs
│
├── environments/                 # Environment configurations
│   ├── .env*                     # Environment variables
│   ├── docker-compose.yml        # Local development stack
│   └── deploy-*.sh               # Deployment scripts
│
├── .github/                      # GitHub Actions workflows
├── reference-expenses/           # Reference implementation
└── package.json                  # Root package.json (workspaces)
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

## 📚 Key Documentation

- [Project Status](docs/PROJECT_STATUS.md) - Current state & roadmap
- [SDET Demo Script](docs/SDET_DEMO_SCRIPT.md) - Interview showcase
- [Deployment Guide](docs/DEPLOYMENT.md) - Deployment instructions
- [Test Strategy](tests/docs/TEST_STRATEGY.md) - Testing approach
- [Multi-Env E2E](tests/README-MULTI-ENV-E2E.md) - Multi-environment testing

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

See [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) for detailed status and next steps.
