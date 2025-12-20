# CI/CD Workflow Guide

## Overview

This document describes the complete CI/CD pipeline for the Expense Tracker application, including automated testing, deployment strategies, and environment management.

**Quick Links:**

- 🔗 [GitHub Actions Workflow File](../../.github/workflows/ci-cd.yml)
- 🚀 [Run Workflow Manually](https://github.com/uzibiton/automation-interview-pre/actions/workflows/ci-cd.yml)
- 📊 [View Workflow Runs](https://github.com/uzibiton/automation-interview-pre/actions)

## Deployment Strategy Summary

| Environment     | Trigger                       | Integration Tests | Smoke Tests | Purpose                       |
| --------------- | ----------------------------- | ----------------- | ----------- | ----------------------------- |
| **PR-{number}** | Automatic (PR opened/updated) | ⏭️ Skipped        | ⏭️ Skipped  | Isolated testing before merge |
| **Develop**     | Automatic (push to main)      | ⏭️ Skipped        | ⏭️ Skipped  | Continuous development        |
| **Staging**     | Manual only                   | ⚙️ Optional       | ⚙️ Optional | Release candidate testing     |
| **Production**  | Manual only                   | ⚙️ Optional       | ⚙️ Optional | Live environment              |

**Key Changes:**

- ✅ Push to main now deploys to **develop** (not staging)
- ✅ Staging and production require **manual deployment**
- ✅ Integration and smoke tests are **skipped by default** for faster deployments
- ✅ Tests can be **enabled on-demand** via workflow_dispatch inputs

## Workflow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CI/CD Pipeline                          │
└─────────────────────────────────────────────────────────────────┘

Pull Request Branch:
  Unit Tests -> Build -> Deploy to PR-{number}
                                  ↓
                         [Auto-cleanup on PR close]
                                  ↓
             [Integration & Smoke Tests: SKIPPED by default]

Main Branch (after merge):
  Unit Tests -> Build -> Deploy to Develop
                                  ↓
             [Integration & Smoke Tests: SKIPPED by default]

Staging (Manual Only):
  Manual Trigger -> Build -> Deploy to Staging
                                  ↓
             [Integration & Smoke Tests: Can be enabled]

Production (Manual Only):
  Manual Trigger -> Build -> Deploy to Production
                                  ↓
             [Integration & Smoke Tests: Can be enabled]
```

## Environments

### 1. PR Environments (Temporary)

- **Trigger**: Opening/updating a Pull Request
- **Naming**: `pr-{number}` (e.g., pr-42)
- **Services**:
  - `frontend-pr-{number}`
  - `api-service-pr-{number}`
  - `auth-service-pr-{number}`
- **Lifecycle**: Automatically deleted when PR is closed/merged
- **Purpose**: Test changes in isolation before merging
- **E2E Tests**: SKIPPED by default (can be enabled manually)

### 2. Develop Environment (Persistent)

- **Trigger**: Push to `main` branch (automatic)
- **Naming**: `develop`
- **Services**:
  - `frontend-develop`
  - `api-service-develop`
  - `auth-service-develop`
- **Purpose**: Continuous development environment, latest merged changes
- **E2E Tests**: SKIPPED by default (can be enabled manually)

### 3. Staging Environment (Persistent)

- **Trigger**: Manual workflow dispatch only
- **Naming**: `staging`
- **Services**:
  - `frontend-staging`
  - `api-service-staging`
  - `auth-service-staging`
- **Purpose**: Pre-production validation, release candidate testing
- **E2E Tests**: SKIPPED by default (can be enabled manually)

### 4. Production Environment (Manual)

- **Trigger**: Manual workflow dispatch only
- **Naming**: No suffix (production services)
- **Services**:
  - `frontend`
  - `api-service`
  - `auth-service`
- **Purpose**: Live production environment
- **E2E Tests**: Not run automatically (manual validation recommended)

## Pipeline Jobs

### Job 1: Unit Tests

**Runs on**: All triggers (PR, main push, manual)

```yaml
- Checkout code
- Setup Node.js 18
- Install dependencies (npm ci)
- Run unit tests
- Upload test results
```

**Failure Impact**: Blocks entire pipeline

### Job 2: Setup Environment

**Runs on**: After unit tests pass

```yaml
- Determine target environment:
    - PR -> pr-{number}
    - Main -> develop
    - Manual -> develop, staging, or production
- Set environment variables
- Configure E2E test execution flag
```

### Job 3: Build Services

**Runs on**: After environment setup

```yaml
- Authenticate to Google Cloud
- Build Docker images:
    - auth-service:${github.sha}
    - api-service:${github.sha}
    - frontend:${github.sha}
- Push images to Google Container Registry
- Tag as :latest
```

**Build Time**: ~5-8 minutes

### Job 4: Deploy to Cloud Run

**Runs on**: After successful build

```yaml
- Deploy Auth Service
- Deploy API Service (with Auth URL)
- Deploy Frontend (with Auth & API URLs)
- Capture deployment URLs
- Output service endpoints
```

**Deploy Time**: ~3-5 minutes

### Job 5: Integration & Smoke Tests

**Runs on**: SKIPPED by default (can be enabled via workflow_dispatch)

**Note**: Integration tests and smoke tests are disabled by default to speed up the pipeline.
You can enable them when manually triggering the workflow.

```yaml
- Install Playwright + Chromium
- Create dynamic .env file with deployment URLs
- Run integration tests (if enabled)
- Run smoke tests (@smoke tag, if enabled)
- Upload test results as artifacts
```

**Test Time**: ~5-7 minutes (when enabled)
**Failure Impact**: Non-blocking (continue-on-error: true)

### Job 6: Cleanup PR Environment

**Runs on**: PR closed/merged

```yaml
- Authenticate to Google Cloud
- Delete frontend-pr-{number}
- Delete api-service-pr-{number}
- Delete auth-service-pr-{number}
```

## Triggering Workflows

### 1. Automatic: Pull Request

When you open or update a PR to `main`:

```bash
git checkout -b feature/my-feature
git commit -m "Add new feature"
git push origin feature/my-feature
# Open PR on GitHub
```

**Result**:

- Deploys to `pr-{number}` environment
- Runs E2E smoke tests
- Comments on PR with test results and URLs
- PR cannot be merged if tests fail

**Note:** If your PR only contains documentation changes (files in `doc/`, root-level `*.md` files, or `.github/ISSUE_TEMPLATE/`), the CI pipeline will be skipped automatically to save resources.

### 2. Automatic: Main Branch

When you merge a PR to `main`:

```bash
# After PR approval and merge
```

**Result**:

- Deploys to `develop` environment
- Integration and smoke tests are SKIPPED by default
- Fast deployment for continuous development
- Staging and production remain unchanged

**Note:** If your commit only contains documentation changes (files in `doc/`, root-level `*.md` files, or `.github/ISSUE_TEMPLATE/`), the CI pipeline will be skipped automatically to save resources.

### 3. Manual: Staging Deployment

Go to GitHub Actions -> CI/CD Pipeline -> Run workflow:

```yaml
Inputs:
  - environment: staging
  - skip_integration_tests: true (default, can be unchecked)
  - skip_smoke_tests: true (default, can be unchecked)
```

**Result**:

- Deploys to staging environment
- Integration and smoke tests SKIPPED by default (can be enabled)
- Use for release candidate testing
- Updates staging services with latest `main` branch code

### 4. Manual: Production Deployment

Go to GitHub Actions -> CI/CD Pipeline -> Run workflow:

```yaml
Inputs:
  - environment: production
  - skip_integration_tests: true (default, can be unchecked)
  - skip_smoke_tests: true (default, can be unchecked)
```

**Result**:

- Deploys to production environment
- Integration and smoke tests SKIPPED by default (can be enabled)
- Updates production services with latest `main` branch code
- Manual validation recommended before deployment

**Note:** Manual workflow runs bypass the paths-ignore rules, so you can force CI to run even for documentation-only changes if needed.

## E2E Test Strategy

### Smoke Tests (@smoke tag)

**Purpose**: Fast validation of critical functionality
**Duration**: 30-120 seconds
**Runs on**: PR and Staging environments

**Test Coverage**:

- ✅ Homepage loads successfully
- ✅ API connectivity works
- ✅ Auth service reachable
- ✅ Responsive design
- ✅ Keyboard navigation
- ⏭️ Skipped: Tests requiring data-testid updates (documented with tickets)

### Test Selection

Tests tagged with `@smoke` in describe blocks:

```typescript
test.describe('Application Health @smoke @critical', () => {
  test('should load homepage successfully', async ({ page }) => {
    // Critical path test
  });
});
```

### Dynamic Environment Configuration

Tests automatically receive deployment URLs:

```bash
# Created dynamically in CI
tests/config/.env.pr-42
tests/config/.env.staging

# Content:
BASE_URL=https://frontend-pr-42-881467160213.us-central1.run.app
API_URL=https://api-service-pr-42-881467160213.us-central1.run.app
AUTH_URL=https://auth-service-pr-42-881467160213.us-central1.run.app
```

## GitHub Secrets Required

| Secret                 | Description                       | Example                             |
| ---------------------- | --------------------------------- | ----------------------------------- |
| `GCP_SA_KEY`           | Google Cloud Service Account JSON | `{"type": "service_account"...}`    |
| `GCP_PROJECT_ID`       | Google Cloud Project ID           | `expense-tracker-12345`             |
| `JWT_SECRET`           | JWT signing secret                | `your-secret-key`                   |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID            | `123456.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret        | `GOCSPX-xxxxx`                      |

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
# ✅ PR environment auto-deploys to develop
# ✅ PR-123 environment deleted automatically
```

### Example 2: Develop Deployment

```bash
# After PR merge to main
# ✅ Unit tests pass
# ✅ Build succeeds
# ✅ Deploys to develop automatically
# ⚠️ Integration & smoke tests SKIPPED (fast deployment)
# ✅ Develop is ready for continuous testing
```

### Example 3: Staging Deployment

```bash
# 1. Go to GitHub Actions
# 2. Select "CI/CD Pipeline"
# 3. Click "Run workflow"
# 4. Select: environment = staging
# 5. Optional: Enable skip_integration_tests = false
# 6. Optional: Enable skip_smoke_tests = false
# 7. Click "Run workflow"
# ✅ Deploys latest main to staging
# ✅ Run E2E tests if enabled
# ✅ Staging ready for release validation
```

### Example 4: Production Deployment

```bash
# 1. Validate staging environment thoroughly
# 2. Go to GitHub Actions
# 3. Select "CI/CD Pipeline"
# 4. Click "Run workflow"
# 5. Select: environment = production
# 6. Click "Run workflow"
# ✅ Deploys latest main to production
# ⚠️ Manual validation recommended
```

## Cost Management

### PR Environments

- **Auto-cleanup**: Deleted immediately when PR closes
- **Typical lifetime**: 1-3 days
- **Resources**: 3 Cloud Run services (scales to zero)

### Develop Environment

- **Persistent**: Always available
- **Resources**: 3 Cloud Run services (scales to zero)
- **Cost**: ~$0-5/month (continuous deployment, scales to zero)

### Staging Environment

- **Persistent**: Always available
- **Resources**: 3 Cloud Run services (scales to zero)
- **Cost**: ~$0-10/month (manual deployments only)

### Production Environment

- **Persistent**: Always available
- **Resources**: 3 Cloud Run services (min instances = 0)
- **Cost**: Based on actual traffic

## Monitoring and Debugging

### View Workflow Status

```
GitHub -> Actions -> CI/CD Pipeline
```

### Check Deployment URLs

Look for "Output deployment URLs" step in workflow logs:

```
🚀 Deployment Complete to pr-42!
Frontend: https://frontend-pr-42-881467160213.us-central1.run.app
API: https://api-service-pr-42-881467160213.us-central1.run.app
Auth: https://auth-service-pr-42-881467160213.us-central1.run.app
```

### View E2E Test Results

1. Go to workflow run
2. Download artifact: `e2e-test-results-{environment}`
3. Open `tests/reports/*/html-report/index.html`

### Common Issues

**Issue**: E2E tests fail with "Service Unavailable"
**Solution**: Cloud Run service may need 30-60s to start. Tests include retry logic. Note: Tests are SKIPPED by default - enable them manually if needed.

**Issue**: PR environment not deploying
**Solution**: Check if GCP quotas exceeded or service naming conflicts

**Issue**: Need to run integration/smoke tests
**Solution**: Manually trigger workflow with skip_integration_tests and skip_smoke_tests set to false

**Issue**: Staging tests passing but production different
**Solution**: Validate environment variables match between staging and production

## Manual Testing Commands

### Test Against PR Environment

```bash
# Get PR environment URL from workflow logs
export BASE_URL=https://frontend-pr-42-881467160213.us-central1.run.app

# Create test environment file
cat > tests/config/.env.pr-42 << EOF
BASE_URL=$BASE_URL
API_URL=https://api-service-pr-42-881467160213.us-central1.run.app
AUTH_URL=https://auth-service-pr-42-881467160213.us-central1.run.app
EOF

# Run tests locally
TEST_ENV=pr-42 npm run test:e2e:smoke
```

### Test Against Develop

```bash
npm run test:e2e:develop:smoke
```

### Test Against Staging

```bash
npm run test:e2e:staging:smoke
```

### Test Against Production (manual validation)

```bash
npm run test:e2e:production:smoke
```

## Best Practices

### For Developers

1. ✅ Always run unit tests locally before pushing
2. ✅ Wait for PR environment to deploy before requesting review
3. ✅ Share PR environment URL with reviewers for testing
4. ✅ Test manually on PR environment (E2E tests are skipped by default)
5. ✅ Verify develop environment after merge
6. ✅ Deploy to staging for release candidate testing
7. ✅ Enable E2E tests on staging before production deployment

### For Reviewers

1. ✅ Test PR environment URL manually
2. ✅ Verify E2E tests passed in PR checks
3. ✅ Check test coverage in workflow artifacts
4. ✅ Validate new features in temporary environment

### For Production Deployments

1. ✅ Validate staging thoroughly
2. ✅ Run full E2E suite locally against staging
3. ✅ Deploy to production during low-traffic hours
4. ✅ Monitor production logs after deployment
5. ✅ Have rollback plan ready (previous git SHA)

## Rollback Strategy

### Rollback Develop

```bash
# Find previous working commit
git log --oneline

# Revert to previous commit
git revert <commit-sha>
git push origin main

# Develop automatically redeploys
```

### Rollback Staging

```bash
# Manually trigger workflow with older commit
# 1. Checkout the working commit
# 2. Go to GitHub Actions
# 3. Run workflow -> environment: staging
```

### Rollback Production

```bash
# Go to GitHub Actions
# Select "CI/CD Pipeline"
# Click "Run workflow"
# Ensure main branch is at previous working commit
# Deploy to production
```

## Future Enhancements

### Planned Improvements

- [ ] Add visual regression tests to smoke suite
- [ ] Implement canary deployments for production
- [ ] Add performance testing to E2E suite
- [ ] Create separate test database per PR environment
- [ ] Add Slack/Discord notifications for deployments
- [ ] Implement automatic rollback on test failures

### Advanced Features

- [ ] Blue-green deployments
- [ ] A/B testing infrastructure
- [ ] Load testing integration
- [ ] Security scanning (SAST/DAST)
- [ ] Automated changelog generation

## Support

### Questions?

- Check workflow logs in GitHub Actions
- Review test results in artifacts
- Contact DevOps team for Cloud Run access issues
- See `tests/README-MULTI-ENV-E2E.md` for detailed E2E testing guide

### Related Documentation

- [E2E Testing Guide](../tests/README-MULTI-ENV-E2E.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Cloud Run Management](./CLOUD_RUN_MANAGEMENT.md)
- [API Reference](./API_REFERENCE.md)
