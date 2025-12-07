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

## 📚 Documentation Hub

Comprehensive documentation covering requirements, design, testing, and workflows.

### 📖 Table of Contents

#### 🎯 Getting Started
| Document | Description | Audience |
|----------|-------------|----------|
| [Quick Start Guide](docs/dev/RUN_LOCALLY.md) | Run the app locally with Docker | Developers, QA |
| [About the Project](docs/general/ABOUTME.md) | Project overview and author info | Everyone |
| [Project Status](docs/general/PROJECT_STATUS.md) | Current state, roadmap, and priorities | Team, Stakeholders |

#### 📋 Requirements & Planning
| Document | Description | Related Docs |
|----------|-------------|--------------|
| [Feature Requirements](docs/dev/INSTRUCTIONS.md) | User stories and acceptance criteria | → [Test Strategy](docs/qa/TESTING_STRATEGY.md), [Issue Templates](.github/ISSUE_TEMPLATE/) |
| [Issue Template Tracking](.github/ISSUE_TEMPLATE/TRACKING.md) | Track which templates have been converted to issues | → [GitHub Issues](../../issues) |
| [API Reference](docs/dev/API_REFERENCE.md) | API endpoints, request/response formats | → [Contract Tests](tests/contract/), [E2E Tests](tests/e2e/) |

#### 🎨 Design & Architecture
| Document | Description | Related Docs |
|----------|-------------|--------------|
| **[Application Architecture](app/README.md)** | **Microservices architecture, tech stack, data flow** | **→ [System Diagram](app/README.md#architecture-diagram)** |
| [System Architecture](docs/devops/DEPLOYMENT_SUMMARY.md) | High-level architecture and components | → [Deployment Guide](docs/devops/DEPLOYMENT.md) |
| [Database Schema](app/database/README.md) | Database tables, relationships, migrations | → [Integration Tests](tests/integration/) |
| [CI/CD Pipeline](docs/devops/CI_CD_PIPELINE.md) | Build, test, and deployment automation | → [GitHub Actions](.github/workflows/ci-cd.yml) |
| [Cloud Run Setup](docs/devops/CLOUD_RUN_MANAGEMENT.md) | GCP Cloud Run configuration and management | → [Deployment Scripts](environments/) |

#### 🧪 Testing & Quality
| Document | Description | Related Tests |
|----------|-------------|---------------|
| **[Testing Strategy](docs/qa/TESTING_STRATEGY.md)** | **Comprehensive QA approach and workflows** | **→ All test suites** |
| [E2E Test Guide](tests/E2E-QUICK-START.md) | End-to-end testing with Playwright | → [E2E Tests](tests/e2e/) |
| [Multi-Environment Testing](tests/README-MULTI-ENV-E2E.md) | Test across local, staging, production | → [E2E Config](tests/config/playwright.config.ts) |
| [Test Implementation Summary](tests/IMPLEMENTATION_SUMMARY.md) | What's tested and coverage overview | → [Test Results](tests/reports/) |

#### 🚀 Development & Workflows
| Document | Description | Related Docs |
|----------|-------------|--------------|
| **[Task & Bug Management](docs/qa/TASK_BUG_MANAGEMENT.md)** | **Issue tracking, workflows, and best practices** | **→ [Issue Templates](.github/ISSUE_TEMPLATE/)** |
| [PR Workflow Guide](docs/qa/PR_WORKFLOW_GUIDE.md) | Complete PR process from task to merge | → [Testing Strategy](docs/qa/TESTING_STRATEGY.md) |
| [Development Insights](docs/dev/DEVELOPMENT_INSIGHTS.md) | Lessons learned and best practices | → [PR Workflow](docs/qa/PR_WORKFLOW_GUIDE.md) |
| [GitHub Actions Setup](docs/devops/GITHUB_ACTIONS_SETUP.md) | CI/CD configuration details | → [Workflows](.github/workflows/) |
| [Cloud Run Deployment](docs/devops/DEPLOYMENT.md) | Deploy to staging and production | → [Cloud Run Management](docs/devops/CLOUD_RUN_MANAGEMENT.md) |

#### 📊 Demo & Presentation
| Document | Description | Audience |
|----------|-------------|----------|
| [SDET Demo Script](docs/demo/SDET_DEMO_SCRIPT.md) | 15-minute interview demonstration | Interviewers, QA Managers |
| [15-Min Senior Demo](docs/demo/15MIN_SENIOR_DEMO.md) | Senior SDET showcase script | Senior Hiring Managers |
| [Testing Strategy Highlights](docs/qa/TESTING_STRATEGY.md#demo-talking-points) | Key testing accomplishments | Technical Interviewers |

#### 🔗 Quick Reference
| Document | Description | Use When |
|----------|-------------|----------|
| [Session Resume](docs/general/SESSION_RESUME.md) | Resume work after interruption | Starting new session |
| [PWA Testing Guide](docs/qa/PWA_TESTING.md) | Progressive Web App testing | Testing offline/mobile features |
| [Conversion Summary](docs/dev/CONVERSION_SUMMARY.md) | Firestore to PostgreSQL migration | Understanding data layer changes |

### 🗺️ Document Relationships

```
Requirements & Features
    ↓
[INSTRUCTIONS.md] ──→ [Issue Templates] ──→ [GitHub Issues]
    ↓                       ↓
[API_REFERENCE.md]    [Testing Strategy]
    ↓                       ↓
Design & Architecture   Test Plans & Execution
    ↓                       ↓
[CI/CD Pipeline] ────→ [E2E Tests] ────→ [Test Reports]
    ↓                       ↓
Deployment              Quality Metrics
    ↓                       ↓
[Cloud Run] ←──────── [Multi-Env Testing]
```

### 📝 Documentation Standards

- **Requirements**: User stories with acceptance criteria
- **Design**: Architecture diagrams and technical decisions
- **Testing**: Test plans with traceability to requirements
- **Workflows**: Step-by-step guides with examples
- **APIs**: OpenAPI/Swagger specs with examples
- **Issues**: Standardized templates with investigation steps

### 🔍 Finding What You Need

**I want to...**
- **Understand the project** → Start with [ABOUTME.md](docs/general/ABOUTME.md)
- **Run locally** → [RUN_LOCALLY.md](docs/dev/RUN_LOCALLY.md)
- **Report a bug** → [Task & Bug Management](docs/qa/TASK_BUG_MANAGEMENT.md) + [Bug Templates](.github/ISSUE_TEMPLATE/)
- **Add a feature** → [PR Workflow](docs/qa/PR_WORKFLOW_GUIDE.md) + [Issue Templates](.github/ISSUE_TEMPLATE/)
- **Track issues** → [Task & Bug Management](docs/qa/TASK_BUG_MANAGEMENT.md)
- **Write tests** → [Testing Strategy](docs/qa/TESTING_STRATEGY.md) + [E2E Guide](tests/E2E-QUICK-START.md)
- **Deploy** → [Deployment Guide](docs/devops/DEPLOYMENT.md)
- **Debug CI/CD** → [CI/CD Pipeline](docs/devops/CI_CD_PIPELINE.md)
- **Demo for interview** → [SDET Demo Script](docs/demo/SDET_DEMO_SCRIPT.md)

### 📚 Additional Resources

- **Code Examples**: [tests/e2e/](tests/e2e/) - Real test implementations
- **Sample Reports**: [docs/demo/sample-reports/](docs/demo/sample-reports/) - Test execution reports
- **Screenshots**: [docs/demo/screenshots/](docs/demo/screenshots/) - Visual documentation
- **Scripts**: [docs/demo/scripts/](docs/demo/scripts/) - Automation utilities

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
