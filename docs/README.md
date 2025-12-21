# Documentation Hub

Welcome to the documentation for the Automation Interview Pre project - an expense tracking application with comprehensive testing infrastructure.

## � Quick Start for AI Workflow

**Working with AI assistants?** Use the **Prompt Catalog System**:

```
Simply say: "load [name]"
Examples: load reset | load planning | load docs | load test
```

📖 **See**: [general/prompts/PROMPT_CATALOG.md](general/prompts/PROMPT_CATALOG.md) for all available prompts and commands

---

## �📂 Documentation Structure

### � Document Traceability

**All feature documents follow a naming convention for traceability:**

- **Requirements**: `REQ-###-short-description.md` -> [product/requirements/](product/requirements/)
- **Design**: `HLD-###-short-description.md` -> [dev/designs/](dev/designs/)
- **Test Plans**: `TEST-###-short-description.md` -> [qa/test-plans/](qa/test-plans/)

**Each document includes:**

- **Role & Name**: Who created/owns the document
- **Traceability Section**: Links to related requirements, design, tests, and implementation
- **Status Tracking**: Current state (Draft/Approved/Implemented)

**Example**: Expense Sorting feature

```
REQ-001 (Requirements) ↔ HLD-001 (Design) ↔ TEST-001 (Test Plan)
```

👉 See [TRACEABILITY_MATRIX.md](product/TRACEABILITY_MATRIX.md) for complete mapping

---

### �📖 [general/](general/) - Project Overview & Status

General project information and tracking:

- **[prompts/PROMPT_CATALOG.md](general/prompts/PROMPT_CATALOG.md)** - 🚀 AI prompt catalog (start here for AI workflows)
- **[ABOUTME.md](general/ABOUTME.md)** - Project overview and author information
- **[PROJECT_STATUS.md](general/PROJECT_STATUS.md)** - Current status, roadmap, and priorities
- **[SESSION_RESUME.md](general/SESSION_RESUME.md)** - Resume work after interruption
- **[prompts/](general/prompts/)** - AI prompt templates library
- **[temp.md](general/temp.md)** - Temporary notes and scratchpad

### � [product/](product/) - Product Requirements

Product requirements and traceability:

- **[requirements/](product/requirements/)** - Feature requirements (REQ-###)
- **[TRACEABILITY_MATRIX.md](product/TRACEABILITY_MATRIX.md)** - Requirements -> Design -> Tests mapping
- **[REQUIREMENTS_TEMPLATE.md](product/REQUIREMENTS_TEMPLATE.md)** - Template for new requirements

### 💻 [dev/](dev/) - Development Documentation

Setup, configuration, and development guides:

- **[designs/](dev/designs/)** - High-level designs (HLD-###)
- **[RUN_LOCALLY.md](dev/RUN_LOCALLY.md)** - Run the app locally with Docker
- **[SETUP.md](dev/SETUP.md)** - Initial setup instructions
- **[API_REFERENCE.md](dev/API_REFERENCE.md)** - API endpoints and specifications
- **[DEVELOPMENT_INSIGHTS.md](dev/DEVELOPMENT_INSIGHTS.md)** - Lessons learned and best practices
- **[HLD_TEMPLATE.md](dev/HLD_TEMPLATE.md)** - Template for high-level designs
- **[DETAILED_DESIGN_TEMPLATE.md](dev/DETAILED_DESIGN_TEMPLATE.md)** - Template for detailed designs

### 🧪 [qa/](qa/) - QA & Testing

Testing strategy and quality assurance processes:

- **[test-plans/](qa/test-plans/)** - Feature test plans (TEST-###) and execution reports
  - **[TEST_PLAN_TEMPLATE.md](qa/test-plans/TEST_PLAN_TEMPLATE.md)** - Template for test plans
  - **[TEST_EXECUTION_TEMPLATE.md](qa/test-plans/TEST_EXECUTION_TEMPLATE.md)** - Template for test execution reports
  - **[TEST-002-group-management.md](qa/test-plans/TEST-002-group-management.md)** - Example: Group management test plan (110 test cases) ⭐
  - **[TEST-001-expense-sorting.md](qa/test-plans/TEST-001-expense-sorting.md)** - Example: Expense sorting test plan
- **[TEST_STRATEGY.md](qa/TEST_STRATEGY.md)** - Complete testing architecture, tools, and workflows ⭐
- **[E2E_TESTING_GUIDE.md](qa/E2E_TESTING_GUIDE.md)** - End-to-end testing across all environments ⭐
- **[DATA_TESTID_CONVENTION.md](qa/DATA_TESTID_CONVENTION.md)** - Test ID naming standards
- **[PWA_TESTING.md](qa/PWA_TESTING.md)** - Progressive Web App testing guide
- **[PR_WORKFLOW_GUIDE.md](qa/PR_WORKFLOW_GUIDE.md)** - Pull request workflow
- **[TASK_BUG_MANAGEMENT.md](qa/TASK_BUG_MANAGEMENT.md)** - Issue tracking and workflows
- **[NON_FUNCTIONAL_SIMPLE_GUIDE.md](qa/NON_FUNCTIONAL_SIMPLE_GUIDE.md)** - Performance, security, accessibility testing

### 🚀 [devops/](devops/) - CI/CD & Deployment

DevOps, infrastructure, and deployment:

- **[CI_CD_GUIDE.md](devops/CI_CD_GUIDE.md)** - Complete CI/CD pipeline guide ⭐
- **[CLOUD_RUN_DEPLOYMENT.md](devops/CLOUD_RUN_DEPLOYMENT.md)** - Google Cloud Run deployment guide
- **[CLOUD_RUN_MANAGEMENT.md](devops/CLOUD_RUN_MANAGEMENT.md)** - Cloud Run service management
- **[GITHUB_ACTIONS_SETUP.md](devops/GITHUB_ACTIONS_SETUP.md)** - GitHub Actions configuration
- **[CODE_SCANNING_SETUP.md](devops/CODE_SCANNING_SETUP.md)** - Security scanning setup

### 🎨 [ui/](ui/) - UI/UX Documentation

User interface and experience guides:

- **[GITHUB_UI_GUIDE.md](ui/GITHUB_UI_GUIDE.md)** - GitHub UI navigation guide

### 🎬 [demo/](demo/) - Demo Materials

Presentation materials and demo scripts:

- **[SDET_DEMO_SCRIPT.md](demo/SDET_DEMO_SCRIPT.md)** - 15-minute interview demonstration
- **[15MIN_SENIOR_DEMO.md](demo/15MIN_SENIOR_DEMO.md)** - Senior SDET showcase
- **[DEMO_SCRIPT.md](demo/DEMO_SCRIPT.md)** - General demo script
- **[datasets/](demo/datasets/)** - Sample data for demos
- **[presentation/](demo/presentation/)** - Presentation materials
- **[sample-reports/](demo/sample-reports/)** - Test execution reports
- **[screenshots/](demo/screenshots/)** - Visual documentation
- **[scripts/](demo/scripts/)** - Demo automation scripts
- **[videos/](demo/videos/)** - Video demonstrations

## 🔍 Quick Navigation

**By Role:**

- **Developers** -> Start with [dev/RUN_LOCALLY.md](dev/RUN_LOCALLY.md)
- **QA Engineers** -> Check [qa/TEST_STRATEGY.md](qa/TEST_STRATEGY.md)
- **DevOps** -> See [devops/CI_CD_GUIDE.md](devops/CI_CD_GUIDE.md)
- **Interviewers** -> View [demo/SDET_DEMO_SCRIPT.md](demo/SDET_DEMO_SCRIPT.md)

**By Task:**

- **Run the app** -> [dev/RUN_LOCALLY.md](dev/RUN_LOCALLY.md)
- **Write tests** -> [qa/TEST_STRATEGY.md](qa/TEST_STRATEGY.md) + [E2E Guide](qa/E2E_TESTING_GUIDE.md)
- **Deploy** -> [devops/CLOUD_RUN_DEPLOYMENT.md](devops/CLOUD_RUN_DEPLOYMENT.md)
- **CI/CD Pipeline** -> [devops/CI_CD_GUIDE.md](devops/CI_CD_GUIDE.md)
- **Report bug** -> [qa/TASK_BUG_MANAGEMENT.md](qa/TASK_BUG_MANAGEMENT.md)
- **Submit PR** -> [qa/PR_WORKFLOW_GUIDE.md](qa/PR_WORKFLOW_GUIDE.md)

## 📋 Documentation Standards

All documentation follows these principles:

- **Clear structure** with table of contents
- **Code examples** for technical concepts
- **Links to related docs** for navigation
- **Audience tags** (Dev, QA, DevOps, etc.)
- **Date stamps** for version tracking

## 🔗 Related Resources

- **[Main README](../README.md)** - Project overview
- **[App Architecture](../app/README.md)** - System architecture details
- **[Tests README](../tests/README.md)** - Test suite documentation
- **[GitHub Issues](https://github.com/uzibiton/automation-interview-pre/issues)** - Issue tracker
- **[GitHub Projects](https://github.com/users/uzibiton/projects/2)** - QA Backlog & Test Planning
