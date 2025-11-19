# CI/CD Workflow Guide

## Overview

This document describes the complete CI/CD pipeline for the Expense Tracker application, including automated testing, deployment strategies, and environment management.

## Workflow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CI/CD Pipeline                          │
└─────────────────────────────────────────────────────────────────┘

Pull Request Branch:
  Unit Tests → Build → Deploy to PR-{number} → E2E Smoke Tests
                                  ↓
                         [Auto-cleanup on PR close]

Main Branch (after merge):
  Unit Tests → Build → Deploy to Staging → E2E Smoke Tests
                                  ↓
                         [Blocks if tests fail]

Production (Manual Only):
  Manual Trigger → Build → Deploy to Production
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

### 2. Staging Environment (Persistent)
- **Trigger**: Push to `main` branch
- **Naming**: `staging`
- **Services**:
  - `frontend-staging`
  - `api-service-staging`
  - `auth-service-staging`
- **Purpose**: Pre-production validation, smoke testing
- **E2E Tests**: Runs full smoke test suite after deployment

### 3. Production Environment (Manual)
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
  - PR → pr-{number}
  - Main → staging
  - Manual → production
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

### Job 5: E2E Smoke Tests
**Runs on**: PR and Staging deployments only
```yaml
- Install Playwright + Chromium
- Create dynamic .env file with deployment URLs
- Run smoke tests (@smoke tag)
- Upload test results as artifacts
- Comment on PR with results (PR only)
```
**Test Time**: ~30 seconds - 2 minutes
**Failure Impact**: Blocks PR merge (tests must pass)

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

### 2. Automatic: Main Branch
When you merge a PR to `main`:
```bash
# After PR approval and merge
```
**Result**:
- Deploys to `staging` environment
- Runs E2E smoke tests
- If tests fail, staging deployment is marked as failed
- Production deployment remains unchanged

### 3. Manual: Production Deployment
Go to GitHub Actions → CI/CD Pipeline → Run workflow:
```yaml
Inputs:
  - environment: production (only option)
```
**Result**:
- Deploys to production environment
- NO automatic E2E tests (manual validation recommended)
- Updates production services with latest `main` branch code

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

| Secret | Description | Example |
|--------|-------------|---------|
| `GCP_SA_KEY` | Google Cloud Service Account JSON | `{"type": "service_account"...}` |
| `GCP_PROJECT_ID` | Google Cloud Project ID | `expense-tracker-12345` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-xxxxx` |

## Workflow Examples

### Example 1: Feature Development
```bash
# 1. Create feature branch
git checkout -b feature/add-category-filter
git commit -m "Add expense category filtering"
git push origin feature/add-category-filter

# 2. Open PR on GitHub
# ✅ CI automatically deploys to pr-123
# ✅ E2E tests run against pr-123 environment
# ✅ PR comment shows: "All smoke tests passed!"
# ✅ Environment URL: https://frontend-pr-123...

# 3. Review and merge PR
# ✅ PR environment auto-deploys to staging
# ✅ Smoke tests validate staging
# ✅ PR-123 environment deleted automatically
```

### Example 2: Staging Deployment
```bash
# After PR merge to main
# ✅ Unit tests pass
# ✅ Build succeeds
# ✅ Deploys to staging automatically
# ✅ E2E smoke tests run
# ✅ Staging is ready for manual validation
```

### Example 3: Production Deployment
```bash
# 1. Validate staging environment
# 2. Go to GitHub Actions
# 3. Select "CI/CD Pipeline"
# 4. Click "Run workflow"
# 5. Select: environment = production
# 6. Click "Run workflow"
# ✅ Deploys latest main to production
# ⚠️ No automatic tests - manual validation recommended
```

## Cost Management

### PR Environments
- **Auto-cleanup**: Deleted immediately when PR closes
- **Typical lifetime**: 1-3 days
- **Resources**: 3 Cloud Run services (scales to zero)

### Staging Environment
- **Persistent**: Always available
- **Resources**: 3 Cloud Run services (scales to zero)
- **Cost**: ~$0-10/month (depending on usage)

### Production Environment
- **Persistent**: Always available
- **Resources**: 3 Cloud Run services (min instances = 0)
- **Cost**: Based on actual traffic

## Monitoring and Debugging

### View Workflow Status
```
GitHub → Actions → CI/CD Pipeline
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
**Solution**: Cloud Run service may need 30-60s to start. Tests include retry logic.

**Issue**: PR environment not deploying
**Solution**: Check if GCP quotas exceeded or service naming conflicts

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
4. ✅ Fix E2E test failures before requesting merge
5. ✅ Verify staging after merge before deploying to production

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

### Rollback Staging
```bash
# Find previous working commit
git log --oneline

# Revert to previous commit
git revert <commit-sha>
git push origin main

# Staging automatically redeploys
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
