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

## 📚 Documentation Hub

Comprehensive documentation covering requirements, design, testing, and workflows.

### 📖 Table of Contents

#### 🎯 Getting Started
| Document | Description | Audience |
|----------|-------------|----------|
| [Quick Start Guide](doc/RUN_LOCALLY.md) | Run the app locally with Docker | Developers, QA |
| [About the Project](doc/ABOUTME.md) | Project overview and author info | Everyone |
| [Project Status](doc/PROJECT_STATUS.md) | Current state, roadmap, and priorities | Team, Stakeholders |

#### 📋 Requirements & Planning
| Document | Description | Related Docs |
|----------|-------------|--------------|
| [Feature Requirements](doc/INSTRUCTIONS.md) | User stories and acceptance criteria | → [Test Strategy](doc/TESTING_STRATEGY.md), [Issue Templates](.github/ISSUE_TEMPLATE/) |
| [Issue Template Tracking](.github/ISSUE_TEMPLATE/TRACKING.md) | Track which templates have been converted to issues | → [GitHub Issues](../../issues) |
| [API Reference](doc/API_REFERENCE.md) | API endpoints, request/response formats | → [Contract Tests](tests/contract/), [E2E Tests](tests/e2e/) |

#### 🎨 Design & Architecture
| Document | Description | Related Docs |
|----------|-------------|--------------|
| [System Architecture](doc/DEPLOYMENT_SUMMARY.md) | High-level architecture and components | → [Deployment Guide](doc/DEPLOYMENT.md) |
| [Database Schema](app/database/README.md) | Database tables, relationships, migrations | → [Integration Tests](tests/integration/) |
| [CI/CD Pipeline](doc/CI_CD_PIPELINE.md) | Build, test, and deployment automation | → [GitHub Actions](.github/workflows/ci-cd.yml) |
| [Cloud Run Setup](doc/CLOUD_RUN_MANAGEMENT.md) | GCP Cloud Run configuration and management | → [Deployment Scripts](environments/) |

#### 🧪 Testing & Quality
| Document | Description | Related Tests |
|----------|-------------|---------------|
| **[Testing Strategy](doc/TESTING_STRATEGY.md)** | **Comprehensive QA approach and workflows** | **→ All test suites** |
| [E2E Test Guide](tests/E2E-QUICK-START.md) | End-to-end testing with Playwright | → [E2E Tests](tests/e2e/) |
| [Multi-Environment Testing](tests/README-MULTI-ENV-E2E.md) | Test across local, staging, production | → [E2E Config](tests/config/playwright.config.ts) |
| [Test Implementation Summary](tests/IMPLEMENTATION_SUMMARY.md) | What's tested and coverage overview | → [Test Results](tests/reports/) |

#### 🚀 Development & Workflows
| Document | Description | Related Docs |
|----------|-------------|--------------|
| [PR Workflow Guide](doc/PR_WORKFLOW_GUIDE.md) | Complete PR process from task to merge | → [Testing Strategy](doc/TESTING_STRATEGY.md) |
| [Development Insights](doc/DEVELOPMENT_INSIGHTS.md) | Lessons learned and best practices | → [PR Workflow](doc/PR_WORKFLOW_GUIDE.md) |
| [GitHub Actions Setup](doc/GITHUB_ACTIONS_SETUP.md) | CI/CD configuration details | → [Workflows](.github/workflows/) |
| [Cloud Run Deployment](doc/DEPLOYMENT.md) | Deploy to staging and production | → [Cloud Run Management](doc/CLOUD_RUN_MANAGEMENT.md) |

#### 📊 Demo & Presentation
| Document | Description | Audience |
|----------|-------------|----------|
| [SDET Demo Script](doc/SDET_DEMO_SCRIPT.md) | 15-minute interview demonstration | Interviewers, QA Managers |
| [15-Min Senior Demo](doc/demo/15MIN_SENIOR_DEMO.md) | Senior SDET showcase script | Senior Hiring Managers |
| [Testing Strategy Highlights](doc/TESTING_STRATEGY.md#demo-talking-points) | Key testing accomplishments | Technical Interviewers |

#### 🔗 Quick Reference
| Document | Description | Use When |
|----------|-------------|----------|
| [Session Resume](doc/SESSION_RESUME.md) | Resume work after interruption | Starting new session |
| [PWA Testing Guide](doc/PWA_TESTING.md) | Progressive Web App testing | Testing offline/mobile features |
| [Conversion Summary](doc/CONVERSION_SUMMARY.md) | Firestore to PostgreSQL migration | Understanding data layer changes |

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
- **Understand the project** → Start with [ABOUTME.md](doc/ABOUTME.md)
- **Run locally** → [RUN_LOCALLY.md](doc/RUN_LOCALLY.md)
- **Add a feature** → [PR Workflow](doc/PR_WORKFLOW_GUIDE.md) + [Issue Templates](.github/ISSUE_TEMPLATE/)
- **Write tests** → [Testing Strategy](doc/TESTING_STRATEGY.md) + [E2E Guide](tests/E2E-QUICK-START.md)
- **Deploy** → [Deployment Guide](doc/DEPLOYMENT.md)
- **Debug CI/CD** → [CI/CD Pipeline](doc/CI_CD_PIPELINE.md)
- **Demo for interview** → [SDET Demo Script](doc/SDET_DEMO_SCRIPT.md)

### 📚 Additional Resources

- **Code Examples**: [tests/e2e/](tests/e2e/) - Real test implementations
- **Sample Reports**: [doc/demo/sample-reports/](doc/demo/sample-reports/) - Test execution reports
- **Screenshots**: [doc/demo/screenshots/](doc/demo/screenshots/) - Visual documentation
- **Scripts**: [doc/demo/scripts/](doc/demo/scripts/) - Automation utilities

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
