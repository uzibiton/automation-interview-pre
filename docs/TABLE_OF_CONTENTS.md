# Documentation Table of Contents

Comprehensive guide to all project documentation organized by category and use case.

## � Document Traceability System

**All feature documents follow a standard naming convention:**

| Type             | Format                     | Location                                       | Example                                                                       |
| ---------------- | -------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| **Requirements** | `REQ-###-feature-name.md`  | [product/requirements/](product/requirements/) | [REQ-001-expense-sorting.md](product/requirements/REQ-001-expense-sorting.md) |
| **Design (HLD)** | `HLD-###-feature-name.md`  | [dev/designs/](dev/designs/)                   | [HLD-001-expense-sorting.md](dev/designs/HLD-001-expense-sorting.md)          |
| **Test Plans**   | `TEST-###-feature-name.md` | [qa/test-plans/](qa/test-plans/)               | [TEST-001-expense-sorting.md](qa/test-plans/TEST-001-expense-sorting.md)      |

**Each document includes**: Role & Name (owner), Traceability links, Status, Related issues/PRs

**See**: [TRACEABILITY_MATRIX.md](product/TRACEABILITY_MATRIX.md) for complete requirements mapping

---

## �📖 Browse by Category

### 🎯 Getting Started

| Document                                            | Description                                     | Audience               |
| --------------------------------------------------- | ----------------------------------------------- | ---------------------- |
| [Quick Start Guide](dev/RUN_LOCALLY.md)             | Run the app locally with Docker                 | Developers, QA         |
| [About the Project](general/ABOUTME.md)             | Project overview and author info                | Everyone               |
| [Project Status](general/PROJECT_STATUS.md)         | Current state, roadmap, and priorities          | Team, Stakeholders     |
| **[Future Ideas](general/IDEAS.md)**                | **Investigation backlog for future features**   | **Team, Contributors** |
| **[AI Prompts Library](general/prompts/README.md)** | **Reusable prompt templates for AI assistance** | **Everyone**           |

### 📋 Requirements & Planning

| Document                                                         | Description                                          | Related Docs                                                                              |
| ---------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **[Requirements Template](product/REQUIREMENTS_TEMPLATE.md)**    | **Template for documenting feature requirements**    | **-> [HLD](dev/HLD_TEMPLATE.md), [Test Plan](qa/test-plans/TEST_PLAN_TEMPLATE.md)**       |
| **[Idea Template](qa/IDEA_TEMPLATE.md)**                         | **Template for capturing and researching new ideas** | **-> [IDEAS.md](general/IDEAS.md), [Requirements](product/REQUIREMENTS_TEMPLATE.md)**     |
| [Feature Requirements](dev/INSTRUCTIONS.md)                      | User stories and acceptance criteria                 | -> [Test Strategy](qa/TESTING_STRATEGY.md), [Issue Templates](../.github/ISSUE_TEMPLATE/) |
| [Issue Template Tracking](../.github/ISSUE_TEMPLATE/TRACKING.md) | Track which templates have been converted to issues  | -> [GitHub Issues](https://github.com/uzibiton/automation-interview-pre/issues)           |
| [API Reference](dev/API_REFERENCE.md)                            | API endpoints, request/response formats              | -> [Contract Tests](../tests/contract/), [E2E Tests](../tests/e2e/)                       |

### 🎨 Design & Architecture

| Document                                                        | Description                                           | Related Docs                                                                                                |
| --------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **[High-Level Design Template](dev/HLD_TEMPLATE.md)**           | **Template for system architecture documentation**    | **-> [Requirements](product/REQUIREMENTS_TEMPLATE.md), [Detailed Design](dev/DETAILED_DESIGN_TEMPLATE.md)** |
| **[Detailed Design Template](dev/DETAILED_DESIGN_TEMPLATE.md)** | **Template for component implementation details**     | **-> [HLD](dev/HLD_TEMPLATE.md), [Test Plan](qa/TEST_PLAN_TEMPLATE.md)**                                    |
| **[Application Architecture](../app/README.md)**                | **Microservices architecture, tech stack, data flow** | **-> [System Diagram](../app/README.md#architecture-diagram)**                                              |
| [System Architecture](devops/DEPLOYMENT_SUMMARY.md)             | High-level architecture and components                | -> [Deployment Guide](devops/DEPLOYMENT.md)                                                                 |
| [Database Schema](../app/database/README.md)                    | Database tables, relationships, migrations            | -> [Integration Tests](../tests/integration/)                                                               |
| [CI/CD Pipeline](devops/CI_CD_PIPELINE.md)                      | Build, test, and deployment automation                | -> [GitHub Actions](../.github/workflows/ci-cd.yml)                                                         |

### 🧪 Testing & Quality

| Document                                                                | Description                                         | Related Tests                                                                                       |
| ----------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **[Test Plan Template](qa/test-plans/TEST_PLAN_TEMPLATE.md)**           | **Template for feature/release test planning**      | **-> [Requirements](product/REQUIREMENTS_TEMPLATE.md), [Testing Strategy](qa/TESTING_STRATEGY.md)** |
| **[Test Execution Template](qa/test-plans/TEST_EXECUTION_TEMPLATE.md)** | **Template for documenting test execution results** | **-> [Test Plan Template](qa/test-plans/TEST_PLAN_TEMPLATE.md)**                                    |
| **[Testing Strategy (Workflow)](qa/TESTING_STRATEGY.md)**               | **QA workflows, issue classification, PR review**   | **-> [Test Strategy](qa/TEST_STRATEGY.md)**                                                         |
| **[Test Strategy (Technical)](qa/TEST_STRATEGY.md)**                    | **Testing architecture, tools, implementation**     | **-> All test suites**                                                                              |
| [Manual Testing Guide](qa/TESTING.md)                                   | Step-by-step manual test scenarios                  | -> Manual test execution                                                                            |
| [E2E Test Guide](qa/E2E-QUICK-START.md)                                 | End-to-end testing with Playwright                  | -> [E2E Tests](../tests/e2e/)                                                                       |
| [Multi-Environment Testing](qa/README-MULTI-ENV-E2E.md)                 | Test across local, staging, production              | -> [E2E Config](../tests/config/playwright.config.ts)                                               |
| [E2E Implementation Complete](qa/E2E-IMPLEMENTATION-COMPLETE.md)        | Complete E2E testing implementation details         | -> [E2E Tests](../tests/e2e/)                                                                       |
| [E2E Quick Reference](qa/QUICK-REFERENCE-E2E.md)                        | E2E testing commands cheat sheet                    | -> [E2E Tests](../tests/e2e/)                                                                       |
| [Implementation Checklist](qa/IMPLEMENTATION_CHECKLIST.md)              | Testing infrastructure setup checklist              | -> [Test Strategy](qa/TESTING_STRATEGY.md)                                                          |
| [Test Implementation Summary](qa/IMPLEMENTATION_SUMMARY.md)             | What's tested and coverage overview                 | -> [Test Results](../tests/reports/)                                                                |
| [Non-Functional Testing Guide](qa/NON_FUNCTIONAL_SIMPLE_GUIDE.md)       | Performance, security, accessibility testing        | -> [Non-Functional Tests](../tests/non-functional/)                                                 |

### 🚀 Development & Workflows

| Document                                                  | Description                                       | Related Docs                                                 |
| --------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| **[Task & Bug Management](qa/TASK_BUG_MANAGEMENT.md)**    | **Issue tracking, workflows, and best practices** | **-> [Issue Templates](../.github/ISSUE_TEMPLATE/)**         |
| **[Maintenance Schedule](dev/MAINTENANCE.md)**            | **Recurring maintenance tasks and tracking**      | **-> Weekly, Monthly, Quarterly checklists**                 |
| **[Working with AI Agents](dev/WORKING_WITH_AGENTS.md)**  | **Best practices for AI-assisted development**    | **-> [PR Workflow](qa/PR_WORKFLOW_GUIDE.md)**                |
| **[Database Tools](../tools/README.md)**                  | **Test data seeding and database management**     | **-> [Run Locally](dev/RUN_LOCALLY.md)**                     |
| [Category Implementation](dev/CATEGORY_IMPLEMENTATION.md) | Database category management implementation       | -> [Database Schema](../app/database/README.md)              |
| [Database Quick Fix](dev/QUICK_FIX.md)                    | Quick fixes for database issues                   | -> [Category Implementation](dev/CATEGORY_IMPLEMENTATION.md) |
| [PR Workflow Guide](qa/PR_WORKFLOW_GUIDE.md)              | Complete PR process from task to merge            | -> [Testing Strategy](qa/TESTING_STRATEGY.md)                |
| [Development Insights](dev/DEVELOPMENT_INSIGHTS.md)       | Lessons learned and best practices                | -> [PR Workflow](qa/PR_WORKFLOW_GUIDE.md)                    |
| [GitHub Actions Setup](devops/GITHUB_ACTIONS_SETUP.md)    | CI/CD configuration details                       | -> [Workflows](../.github/workflows/)                        |
| [Cloud Run Deployment](devops/DEPLOYMENT.md)              | Deploy to staging and production                  | -> [Cloud Run Management](devops/CLOUD_RUN_MANAGEMENT.md)    |

### 📊 Demo & Presentation

| Document                                                                  | Description                       | Audience                  |
| ------------------------------------------------------------------------- | --------------------------------- | ------------------------- |
| [SDET Demo Script](demo/SDET_DEMO_SCRIPT.md)                              | 15-minute interview demonstration | Interviewers, QA Managers |
| [15-Min Senior Demo](demo/15MIN_SENIOR_DEMO.md)                           | Senior SDET showcase script       | Senior Hiring Managers    |
| [Testing Strategy Highlights](qa/TESTING_STRATEGY.md#demo-talking-points) | Key testing accomplishments       | Technical Interviewers    |

### 🔗 Quick Reference

| Document                                        | Description                       | Use When                         |
| ----------------------------------------------- | --------------------------------- | -------------------------------- |
| [Session Resume](general/SESSION_RESUME.md)     | Resume work after interruption    | Starting new session             |
| [PWA Testing Guide](qa/PWA_TESTING.md)          | Progressive Web App testing       | Testing offline/mobile features  |
| [Conversion Summary](dev/CONVERSION_SUMMARY.md) | Firestore to PostgreSQL migration | Understanding data layer changes |

## 🗺️ Document Relationships

```
Requirements & Features
    ↓
[INSTRUCTIONS.md] ──-> [Issue Templates] ──-> [GitHub Issues]
    ↓                       ↓
[API_REFERENCE.md]    [Testing Strategy]
    ↓                       ↓
Design & Architecture   Test Plans & Execution
    ↓                       ↓
[CI/CD Pipeline] ────-> [E2E Tests] ────-> [Test Reports]
    ↓                       ↓
Deployment              Quality Metrics
    ↓                       ↓
[Cloud Run] ←──────── [Multi-Env Testing]
```

## 🔍 Find What You Need

### By Role

- **Developers** -> Start with [dev/RUN_LOCALLY.md](dev/RUN_LOCALLY.md)
- **QA Engineers** -> Check [qa/TESTING_STRATEGY.md](qa/TESTING_STRATEGY.md)
- **DevOps** -> See [devops/CI_CD_PIPELINE.md](devops/CI_CD_PIPELINE.md)
- **Interviewers** -> View [demo/SDET_DEMO_SCRIPT.md](demo/SDET_DEMO_SCRIPT.md)
- **Product/Stakeholders** -> Read [general/PROJECT_STATUS.md](general/PROJECT_STATUS.md)

### By Task

**I want to...**

- **Understand the project** -> Start with [general/ABOUTME.md](general/ABOUTME.md)
- **Run locally** -> [dev/RUN_LOCALLY.md](dev/RUN_LOCALLY.md)
- **Capture an idea** -> [general/IDEAS.md](general/IDEAS.md) + [Idea Template](qa/IDEA_TEMPLATE.md)
- **Report a bug** -> [qa/TASK_BUG_MANAGEMENT.md](qa/TASK_BUG_MANAGEMENT.md) + [Bug Templates](../.github/ISSUE_TEMPLATE/)
- **Add a feature** -> [qa/PR_WORKFLOW_GUIDE.md](qa/PR_WORKFLOW_GUIDE.md) + [Issue Templates](../.github/ISSUE_TEMPLATE/)
- **Track issues** -> [qa/TASK_BUG_MANAGEMENT.md](qa/TASK_BUG_MANAGEMENT.md)
- **Do maintenance** -> [dev/MAINTENANCE.md](dev/MAINTENANCE.md)
- **Write tests** -> [qa/TESTING_STRATEGY.md](qa/TESTING_STRATEGY.md) + [E2E Guide](qa/E2E-QUICK-START.md)
- **Deploy** -> [devops/DEPLOYMENT.md](devops/DEPLOYMENT.md)
- **Debug CI/CD** -> [devops/CI_CD_PIPELINE.md](devops/CI_CD_PIPELINE.md)
- **Demo for interview** -> [demo/SDET_DEMO_SCRIPT.md](demo/SDET_DEMO_SCRIPT.md)
- **View architecture** -> [../app/README.md](../app/README.md)
- **Check API docs** -> [dev/API_REFERENCE.md](dev/API_REFERENCE.md)

## 📚 Additional Resources

- **Code Examples**: [../tests/e2e/](../tests/e2e/) - Real test implementations
- **Sample Reports**: [demo/sample-reports/](demo/sample-reports/) - Test execution reports
- **Screenshots**: [demo/screenshots/](demo/screenshots/) - Visual documentation
- **Scripts**: [demo/scripts/](demo/scripts/) - Automation utilities

## 📝 Documentation Standards

- **Requirements**: User stories with acceptance criteria
- **Design**: Architecture diagrams and technical decisions
- **Testing**: Test plans with traceability to requirements
- **Workflows**: Step-by-step guides with examples
- **APIs**: OpenAPI/Swagger specs with examples
- **Issues**: Standardized templates with investigation steps

## 🔗 Key Links

- **[Main README](../README.md)** - Project overview
- **[Documentation Hub](README.md)** - Documentation organization
- **[App Architecture](../app/README.md)** - System architecture details
- **[Tests README](../tests/README.md)** - Test suite documentation
- **[GitHub Issues](https://github.com/uzibiton/automation-interview-pre/issues)** - Issue tracker
- **[GitHub Projects](https://github.com/users/uzibiton/projects/2)** - QA Backlog & Test Planning
