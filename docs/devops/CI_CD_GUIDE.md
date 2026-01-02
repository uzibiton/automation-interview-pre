# CI/CD Pipeline Guide

> **Complete guide for the GitHub Actions CI/CD pipeline - automated testing, building, and deployment**

---

## Quick Links

- 🔗 [GitHub Actions Workflow File](../../.github/workflows/ci-cd.yml)
- 🚀 [Run Workflow Manually](https://github.com/uzibiton/automation-interview-pre/actions/workflows/ci-cd.yml)
- 📊 [View Workflow Runs](https://github.com/uzibiton/automation-interview-pre/actions)

---

## Table of Contents

1. [Overview](#overview)
2. [Planned Changes](#planned-changes)
3. [Deployment Environments](#deployment-environments)
4. [Pipeline Triggers](#pipeline-triggers)
5. [Pipeline Stages](#pipeline-stages)
6. [Workflow Examples](#workflow-examples)
7. [Cost Management](#cost-management)
8. [Required Secrets](#required-secrets)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This pipeline automates the entire software delivery process from code commit to production deployment with maximum parallelization for speed and efficiency.

### Deployment Strategy Summary

| Environment     | Trigger                       | Integration Tests | Smoke Tests | Purpose                       |
| --------------- | ----------------------------- | ----------------- | ----------- | ----------------------------- |
| **PR-{number}** | Automatic (PR opened/updated) | ⏭️ Skipped        | ⏭️ Skipped  | Isolated testing before merge |
| **Develop**     | Automatic (push to main)      | ⏭️ Skipped        | ⏭️ Skipped  | Continuous development        |
| **Staging**     | Manual only                   | ⚙️ Optional       | ⚙️ Optional | Release candidate testing     |
| **Production**  | Manual only                   | ⚙️ Optional       | ⚙️ Optional | Live environment              |

**Key Features:**

- ✅ Push to main deploys to **develop** automatically
- ✅ Staging and production require **manual deployment**
- ✅ Integration and smoke tests **skipped by default** for faster deployments
- ✅ Tests can be **enabled on-demand** via workflow_dispatch inputs
- ✅ Documentation-only changes skip CI automatically

### Pipeline Execution Times

- **Stage 1 (Parallel)**: ~2-3 minutes (Code Quality + Security + Unit Tests)
- **Build Stage (Parallel)**: ~5-8 minutes (Auth, API, Frontend, Test Runner)
- **Deploy**: ~3-5 minutes
- **Integration + E2E (optional)**: ~5-7 minutes
- **Total (optimized)**: ~10-16 minutes without tests, ~15-23 minutes with tests

---

## Planned Changes

> ⚠️ **STATUS: PLANNED** - The changes below are planned but not yet implemented.
> See GitHub issues [#162](https://github.com/uzibiton/automation-interview-pre/issues/162) and [#163](https://github.com/uzibiton/automation-interview-pre/issues/163)

### Summary

Restructuring the CI/CD pipeline to:

1. **Require manual trigger for PR validation** (no auto-run on PR open/update)
2. **Auto-deploy to staging after merge to main** (not develop)
3. **Create a separate reusable deploy workflow** for manual deployments

### Proposed Flow

| Event                | Tests      | Deploy To                  | Notes                   |
| -------------------- | ---------- | -------------------------- | ----------------------- |
| PR opened/commit     | ❌ None    | -                          | Manual trigger required |
| Manual trigger on PR | ✅ Run all | PR temp env (if pass)      | Required for merge      |
| Merge to main        | ✅ Run all | Staging (if pass)          | Automatic               |
| Manual `deploy.yml`  | Optional   | develop/staging/production | Branch + env selection  |

### Key Changes

#### 1. ci-cd.yml Modifications

- Remove `pull_request` auto-trigger
- Keep `workflow_dispatch` for manual PR runs
- Change push-to-main deploy target: develop → **staging**
- Call `deploy.yml` instead of inline deploy job

#### 2. New deploy.yml Workflow

- **Inputs**: branch, environment (develop/staging/production)
- **Usage**: Called by ci-cd.yml OR triggered manually
- **No approval gates**
- Production only via manual trigger

#### 3. Branch Protection (GitHub Settings)

- Require status checks to pass before merge
- PR shows "Waiting for status" until manual trigger
- GitHub enforces - merge button disabled until checks pass

### Open Decisions (Issue #163)

1. **Develop environment**: Permanent shared env vs PR-specific only?
2. **Production restrictions**: Any branch can deploy, or main-only?
3. **Skip toggles**: Keep all current `skip_*` options?

---

## Deployment Environments

### 1. PR Environments (Temporary)

**Trigger**: Opening/updating a Pull Request

**Naming**: `pr-{number}` (e.g., pr-42)

**Services**:

- `frontend-pr-{number}`
- `api-service-pr-{number}`
- `auth-service-pr-{number}`

**Lifecycle**: Automatically deleted when PR is closed/merged

**Purpose**: Test changes in isolation before merging

**E2E Tests**: SKIPPED by default (can be enabled manually)

---

### 2. Develop Environment (Persistent)

**Trigger**: Push to `main` branch (automatic)

**Naming**: `develop`

**Services**:

- `frontend-develop`
- `api-service-develop`
- `auth-service-develop`

**Purpose**: Continuous development environment, latest merged changes

**E2E Tests**: SKIPPED by default (can be enabled manually)

---

### 3. Staging Environment (Persistent)

**Trigger**: Manual workflow dispatch only

**Naming**: `staging`

**Services**:

- `frontend-staging`
- `api-service-staging`
- `auth-service-staging`

**Purpose**: Pre-production validation, release candidate testing

**E2E Tests**: SKIPPED by default (can be enabled manually for thorough validation)

---

### 4. Production Environment (Manual)

**Trigger**: Manual workflow dispatch only

**Naming**: No suffix (production services)

**Services**:

- `frontend`
- `api-service`
- `auth-service`

**Purpose**: Live production environment

**E2E Tests**: Not run automatically (manual validation recommended)

---

## Pipeline Triggers

### 1. Push to Main Branch

```yaml
on:
  push:
    branches:
      - main
    paths-ignore:
      - 'docs/**'
      - '**/*.md'
      - '**/*.pdf'
      - '.github/ISSUE_TEMPLATE/**'
```

**What happens**: Full pipeline (Test → Build → Deploy to Develop)

**Use case**: After merging a PR, automatically deploy to develop environment

**Documentation-only changes**: CI is skipped to save resources when only documentation files are modified

---

### 2. Pull Request to Main

```yaml
on:
  pull_request:
    branches:
      - main
    paths-ignore:
      - 'docs/**'
      - '**/*.md'
      - '**/*.pdf'
      - '.github/ISSUE_TEMPLATE/**'
```

**What happens**: Full pipeline (Test → Build → Deploy to PR environment)

**Use case**: Validate changes in isolated environment before merging

**Documentation-only changes**: CI is skipped to save resources

---

### 3. Manual Trigger (Workflow Dispatch)

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        - develop
        - staging
        - production
      skip_integration_tests: true
      skip_smoke_tests: true
      # ... other skip options
```

**What happens**: Full pipeline with selected environment and optional test toggles

**Use cases**:

- Deploy to staging for release candidate testing
- Deploy to production for releases
- Re-deploy after fixing secrets
- Testing the pipeline
- Force CI run for documentation changes (bypasses paths-ignore)
- Enable/disable integration and smoke tests

**How to trigger**:

1. Go to GitHub → Actions tab
2. Click "CI/CD Pipeline"
3. Click "Run workflow"
4. Select environment (develop/staging/production)
5. Optional: Toggle skip options for tests
6. Click "Run workflow" button

---

## Pipeline Stages

### Stage 1: Quality & Testing (Parallel Execution)

Three independent job groups run simultaneously:

#### 1.1 Code Quality Gateway

Spawns parallel checks:

- **Prettier** - Code formatting validation
- **ESLint** - Linting and code style
- **TypeCheck** - TypeScript type checking

**Duration**: ~1-2 minutes  
**Skipped**: Yes (default - configurable)  
**Blocks Pipeline**: No (continues on error)  
**Skip Options**: `skip_prettier`, `skip_eslint`, `skip_typecheck`

---

#### 1.2 Security Checks Gateway

Spawns parallel scans:

- **npm audit** - Dependency vulnerability scan
- **Snyk** - Advanced security scanning with SARIF upload

**Duration**: ~2-3 minutes  
**Skipped**: npm audit=Yes (default), Snyk=No (active)  
**Blocks Pipeline**: No (continues on error)  
**Skip Options**: `skip_audit`, `skip_snyk`

---

#### 1.3 Unit Tests

Independent test execution:

- Jest unit tests across all workspaces
- Coverage report generation
- Artifact upload

**Duration**: ~2-3 minutes  
**Skipped**: No (always runs)  
**Blocks Pipeline**: Yes (required for deployment)  
**Skip Option**: `skip_unit_tests`

---

### Stage 2: Setup Environment

**Purpose**: Determine deployment target and configuration

**Duration**: <10 seconds  
**Skipped**: No (always runs)  
**Blocks Pipeline**: Yes (required by all build/deploy stages)

**Logic**:

- PR → temporary PR environment (pr-{number})
- Push to main → develop
- Manual trigger → user-selected environment (develop/staging/production)

**Outputs**:

- `env_name` - Environment name
- `env_suffix` - Suffix for service names
- `should_run_e2e` - Whether to run E2E tests

---

### Stage 3: Build App (Parallel Builds)

Gateway job spawns 4 parallel builds:

#### 3.1 Auth Service

- Build Docker image
- Tag with SHA + latest
- Push to GCR

#### 3.2 API Service

- Build Docker image
- Tag with SHA + latest
- Push to GCR

#### 3.3 Frontend

- Build Docker image
- Tag with SHA + latest
- Push to GCR

#### 3.4 Test Runner

- Build test runner image
- Tag with SHA + latest
- Push to GCR

**Duration**: ~5-8 minutes (parallel)  
**Sequential would be**: ~20-32 minutes  
**Skipped**: No (always runs after setup)  
**Blocks Pipeline**: Yes (deploy requires all builds)

---

### Stage 4: Deploy

**Purpose**: Deploy services to Google Cloud Run

**Duration**: ~3-5 minutes  
**Skipped**: No (always runs after builds)  
**Blocks Pipeline**: Yes (integration tests require deployed services)

**Deployment Order**:

1. Frontend (to get URL)
2. Auth Service (needs frontend URL)
3. API Service (needs auth URL)
4. Frontend update (with backend URLs)

**Outputs**:

- Service URLs for all deployed services
- OAuth callback URLs

---

### Stage 5: Integration Tests (Optional)

**Purpose**: Test service-to-service communication and API integration

**Duration**: ~3-5 minutes  
**Skipped**: **YES by default** (skip_integration_tests = true)  
**Blocks Pipeline**: No (continue-on-error: true)  
**Can be enabled**: Via workflow_dispatch input

**Tests**:

- API integration tests
- Service-to-service communication tests
- Database integration tests

**Note**: Integration tests are disabled by default to speed up deployment. Enable them manually when needed for thorough validation.

---

### Stage 6: Smoke Tests (Optional)

**Purpose**: Fast validation of critical user flows

**Duration**: ~2-4 minutes  
**Skipped**: **YES by default** (skip_smoke_tests = true)  
**Blocks Pipeline**: No (continue-on-error: true)  
**Can be enabled**: Via workflow_dispatch input

**Test Coverage**:

- ✅ Homepage loads successfully
- ✅ API connectivity works
- ✅ Auth service reachable
- ✅ Responsive design
- ✅ Keyboard navigation

**Test Selection**: Tests tagged with `@smoke`:

```typescript
test.describe('Application Health @smoke @critical', () => {
  test('should load homepage successfully', async ({ page }) => {
    // Critical path test
  });
});
```

**Dynamic Environment Configuration**: Tests automatically receive deployment URLs

**Note**: Smoke tests are disabled by default to enable faster deployments. Enable them manually when you need E2E validation.

---

### Stage 7: Cleanup PR Environment

**Runs on**: PR closed/merged

**Actions**:

```yaml
- Authenticate to Google Cloud
- Delete frontend-pr-{number}
- Delete api-service-pr-{number}
- Delete auth-service-pr-{number}
```

**Purpose**: Automatic cleanup to reduce costs and clutter

---

## Workflow Examples

### Example 1: Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/add-category-filter
git commit -m "Add expense category filtering"
git push origin feature/add-category-filter

# 2. Open PR on GitHub
# ✅ CI automatically deploys to pr-123
# ⚠️ E2E tests SKIPPED by default (fast feedback)
# ✅ Environment URL: https://frontend-pr-123...
# ✅ Manual testing on PR environment

# 3. Review and merge PR
# ✅ Deploys to develop automatically
# ✅ PR-123 environment deleted automatically
```

---

### Example 2: Develop Deployment (Automatic)

```bash
# After PR merge to main
# ✅ Unit tests pass
# ✅ Build succeeds
# ✅ Deploys to develop automatically
# ⚠️ Integration & smoke tests SKIPPED (fast deployment)
# ✅ Develop is ready for continuous testing
```

---

### Example 3: Staging Deployment (Manual)

```bash
# 1. Go to GitHub Actions
# 2. Select "CI/CD Pipeline"
# 3. Click "Run workflow"
# 4. Select: environment = staging
# 5. Optional: Uncheck skip_integration_tests
# 6. Optional: Uncheck skip_smoke_tests
# 7. Click "Run workflow"
# ✅ Deploys latest main to staging
# ✅ Run E2E tests if enabled
# ✅ Staging ready for release validation
```

---

### Example 4: Production Deployment (Manual)

```bash
# 1. Validate staging environment thoroughly
# 2. Go to GitHub Actions
# 3. Select "CI/CD Pipeline"
# 4. Click "Run workflow"
# 5. Select: environment = production
# 6. Click "Run workflow"
# ✅ Deploys latest main to production
# ⚠️ Manual validation recommended
# ⚠️ E2E tests not run in production by default
```

---

## Cost Management

### PR Environments

- **Auto-cleanup**: Deleted immediately when PR closes
- **Typical lifetime**: 1-3 days
- **Resources**: 3 Cloud Run services (scales to zero)
- **Cost**: Minimal, only active during testing

### Develop Environment

- **Persistent**: Always available
- **Resources**: 3 Cloud Run services (scales to zero)
- **Cost**: ~$0-5/month (scales to zero when idle)

### Staging Environment

- **Persistent**: Always available
- **Resources**: 3 Cloud Run services (scales to zero)
- **Cost**: ~$0-10/month (depends on usage)

### Production Environment

- **Persistent**: Always available
- **Resources**: 3 Cloud Run services (autoscaling)
- **Cost**: Depends on traffic (~$10-50/month estimated)

### Cost Optimization Tips

1. **Use PR environments** for feature testing (auto-cleanup)
2. **Skip E2E tests** during development (enable for staging/production)
3. **Cloud Run scales to zero** when idle (no wasted resources)
4. **Delete unused staging environments** if not needed

---

## Required Secrets and Variables

Configure these in GitHub Settings → Secrets and variables → Actions:

### Repository Variables

| Variable        | Description                            | Values         |
| --------------- | -------------------------------------- | -------------- |
| `CI_CD_ENABLED` | Enable/disable automatic pipeline runs | `true`/`false` |

**Note**: When `CI_CD_ENABLED` is `false`, push/PR events skip the pipeline. Manual triggers (`workflow_dispatch`) always work regardless of this setting.

To toggle via CLI:

```bash
gh variable set CI_CD_ENABLED --body "true"   # Enable auto-trigger
gh variable set CI_CD_ENABLED --body "false"  # Disable auto-trigger
```

### Repository Secrets

| Secret                 | Description                       | Example                             |
| ---------------------- | --------------------------------- | ----------------------------------- |
| `GCP_SA_KEY`           | Google Cloud Service Account JSON | `{"type": "service_account"...}`    |
| `GCP_PROJECT_ID`       | Google Cloud Project ID           | `expense-tracker-12345`             |
| `JWT_SECRET`           | JWT signing secret                | `your-secret-key`                   |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID            | `123456.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret        | `GOCSPX-xxxxx`                      |

---

## Troubleshooting

### Pipeline Fails on Unit Tests

**Problem**: Tests failing in CI but pass locally

**Solutions**:

1. Check environment variables are set correctly
2. Verify dependencies match (run `npm ci` locally)
3. Review test logs in GitHub Actions
4. Check for timing/race condition issues

---

### Build Fails on Docker

**Problem**: Docker image build errors

**Solutions**:

1. Verify Dockerfile syntax
2. Check if all dependencies are declared
3. Test build locally: `docker build -t test-image .`
4. Review build logs for missing files

---

### Deployment Fails

**Problem**: Cloud Run deployment errors

**Solutions**:

1. Verify GCP service account has correct permissions
2. Check secrets are set correctly in GitHub
3. Verify GCP_PROJECT_ID matches your project
4. Review Cloud Run logs in GCP console

---

### E2E Tests Fail

**Problem**: Smoke tests failing after deployment

**Solutions**:

1. Check if services are fully deployed (may take 1-2 min)
2. Verify environment URLs are correct
3. Review Playwright test logs
4. Test URLs manually in browser
5. Check Cloud Run service logs for errors

---

### PR Environment Not Cleaning Up

**Problem**: Old PR environments still exist

**Solutions**:

1. Manually delete via Cloud Run console
2. Check cleanup workflow ran successfully
3. Use gcloud CLI: `gcloud run services delete frontend-pr-{number}`

---

### All Jobs Skipped on Push

**Problem**: Push to main triggers workflow but all jobs show as "skipped"

**Cause**: `CI_CD_ENABLED` repository variable is set to `false`

**Solutions**:

1. Set the variable to `true` in GitHub Settings → Secrets and variables → Actions → Variables
2. Or via CLI: `gh variable set CI_CD_ENABLED --body "true"`

---

### npm ci Fails with Lock File Sync Error

**Problem**: `npm ci` fails with "package.json and package-lock.json are not in sync"

**Cause**: Dependencies were added/updated in package.json but lock file wasn't regenerated

**Solutions**:

1. Run `npm install` locally to regenerate package-lock.json
2. Commit and push the updated lock file
3. For monorepos, run `npm install` from the root directory

---

### Node Version Mismatch

**Problem**: CI fails with EBADENGINE errors or unexpected behavior

**Cause**: CI using different Node.js version than packages require

**Solutions**:

1. Check package.json `engines` field for required Node version
2. Update `node-version` in workflow file to match (e.g., '20' for modern packages)
3. Ensure all jobs in workflow use consistent Node version

---

## Best Practices

### 1. Test Locally First

Run tests and builds locally before pushing:

```bash
npm test
npm run build
docker-compose up --build
```

### 2. Use Draft PRs

Create draft PRs to avoid triggering full deployments during development.

### 3. Enable Tests for Staging

Always enable integration and smoke tests for staging deployments to catch issues before production.

### 4. Monitor Costs

Check Cloud Run costs regularly in GCP Console → Billing.

### 5. Keep Secrets Updated

Rotate secrets periodically and update in GitHub Actions settings.

### 6. Review Pipeline Logs

Check GitHub Actions logs regularly to identify and fix issues early.

---

## Related Documentation

- [E2E Testing Guide](../qa/E2E_TESTING_GUIDE.md) - How to run and write E2E tests
- [Test Strategy](../qa/TEST_STRATEGY.md) - Overall testing approach
- [Cloud Run Deployment](./CLOUD_RUN_DEPLOYMENT.md) - Manual deployment guide
- [Cloud Run Management](./CLOUD_RUN_MANAGEMENT.md) - Managing Cloud Run services

---

## Demo Tips (Interview Context)

**Talking Points**:

> "I built a CI/CD pipeline that balances speed and quality:
>
> 1. **Fast feedback** - Parallel execution reduces build time by 60%
> 2. **Flexible testing** - E2E tests are optional, enabled on-demand
> 3. **Cost-efficient** - Auto-cleanup of PR environments, scale-to-zero services
> 4. **Multi-environment** - Automatic PR/develop, manual staging/production
>
> **Trade-offs**:
>
> - **Benefit**: Faster deployments (10-16 min vs 30+ min)
> - **Cost**: Tests disabled by default (enable for critical deployments)
> - **Decision**: Worth it for rapid iteration, enable tests for production readiness"

---

**Last Updated**: December 2024  
**Maintainer**: DevOps Team
