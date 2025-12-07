# CI/CD Pipeline Documentation

Complete guide for the GitHub Actions CI/CD pipeline that automates testing, building, and deployment.

---

## 🎯 Overview

This pipeline automates the entire software delivery process from code commit to production deployment.

### Pipeline Flow:

```
┌─────────────────────────────────────────────────────────────┐
│                     CODE PUSH/PR                            │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  STAGE 1: Unit Tests (2-3 minutes)                   │  │
│  │  • Checkout code                                      │  │
│  │  • Install Node.js dependencies                       │  │
│  │  • Run Jest unit tests                                │  │
│  │  • Generate coverage report                           │  │
│  │  ✅ Pass → Continue                                   │  │
│  │  ❌ Fail → STOP (no build/deploy)                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  STAGE 2: Build (5-8 minutes)                        │  │
│  │  • Only on 'main' branch                             │  │
│  │  • Authenticate to Google Cloud                       │  │
│  │  • Build Docker images:                               │  │
│  │    - auth-service                                     │  │
│  │    - api-service                                      │  │
│  │    - frontend                                         │  │
│  │  • Push images to Google Container Registry          │  │
│  │  • Tag with commit SHA + 'latest'                    │  │
│  │  ✅ Pass → Continue                                   │  │
│  │  ❌ Fail → STOP (no deploy)                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  STAGE 3: Deploy (3-5 minutes)                       │  │
│  │  • Deploy auth-service to Cloud Run                  │  │
│  │  • Deploy api-service to Cloud Run                   │  │
│  │  • Deploy frontend to Cloud Run                      │  │
│  │  • Set environment variables                          │  │
│  │  • Output deployment URLs                            │  │
│  │  ✅ Success → Live in Production                     │  │
│  │  ❌ Fail → Previous version still running            │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│                  🎉 DEPLOYED TO PRODUCTION                 │
└─────────────────────────────────────────────────────────────┘
```

### Total Time:

- **PR (tests only)**: 2-3 minutes
- **Main branch (full pipeline)**: 10-16 minutes

---

## 🚀 Triggers

The pipeline runs automatically on:

### 1. **Push to Main Branch**

```yaml
on:
  push:
    branches:
      - main
    paths-ignore:
      - 'doc/**'
      - '*.md'
      - '.github/ISSUE_TEMPLATE/**'
```

**What happens:** Full pipeline (Test → Build → Deploy)

**Use case:** After merging a PR, automatically deploy to production

**Documentation-only changes:** CI is skipped to save resources when only documentation files are modified

### 2. **Pull Request to Main**

```yaml
on:
  pull_request:
    branches:
      - main
    paths-ignore:
      - 'doc/**'
      - '*.md'
      - '.github/ISSUE_TEMPLATE/**'
```

**What happens:** Tests only (no build/deploy)

**Use case:** Validate changes before merging

**Documentation-only changes:** CI is skipped to save resources when only documentation files are modified

### 3. **Manual Trigger**

```yaml
on:
  workflow_dispatch:
```

**What happens:** Full pipeline (if on main) or tests (if on other branch)

**Use case:**

- Emergency hotfix deployment
- Re-deploy after fixing secrets
- Testing the pipeline
- Force CI run for documentation changes (bypasses paths-ignore)

**How to trigger:**

1. Go to GitHub → Actions tab
2. Click "CI/CD Pipeline"
3. Click "Run workflow"
4. Select branch
5. Click "Run workflow" button

---

### 📝 Skipped Paths (Documentation Changes)

The CI pipeline is automatically skipped when commits only modify:

- **`doc/**`** - All files in the documentation directory
- **`*.md`** - Root-level markdown files (README.md, RUN-LOCALLY.md, etc.)
- **`.github/ISSUE_TEMPLATE/**`** - Issue and PR templates

**Why?** Documentation changes don't affect code functionality and don't require testing, building, or deployment.

**Note:** If a commit includes both documentation AND code changes, the CI will run normally.

**Manual override:** You can still run CI for documentation-only changes using the Manual Trigger (workflow_dispatch)

---

## 📋 Jobs Breakdown

### Job 1: Unit Tests

**Purpose:** Fast validation of code quality

**Duration:** 2-3 minutes

**Steps:**

1. **Checkout code** - Get the latest code
2. **Setup Node.js** - Install Node 18 with npm cache
3. **Install dependencies** - `npm ci` (clean install)
4. **Run tests** - Execute Jest unit tests
5. **Upload results** - Save coverage reports as artifacts

**Runs on:**

- ✅ All PRs
- ✅ Push to main
- ✅ Manual trigger

**What it tests:**

- JavaScript/TypeScript unit tests
- Component tests
- Utility function tests
- Business logic tests

**Output:**

- Test results in GitHub UI
- Coverage report as artifact
- ✅/❌ status visible in PR

---

### Job 2: Build

**Purpose:** Create deployable Docker images

**Duration:** 5-8 minutes

**Conditions:**

```yaml
needs: unit-tests # Only runs if tests pass
if: github.ref == 'refs/heads/main' # Only on main branch
```

**Steps:**

1. **Authenticate to GCP** - Use service account key
2. **Configure Docker** - Set up GCR authentication
3. **Build auth-service** - Create Docker image
4. **Build api-service** - Create Docker image
5. **Build frontend** - Create Docker image
6. **Push to registry** - Upload images to GCR

**Tagging strategy:**

- `gcr.io/PROJECT_ID/SERVICE:COMMIT_SHA` - Specific version
- `gcr.io/PROJECT_ID/SERVICE:latest` - Latest version

**Runs on:**

- ❌ PRs (tests only)
- ✅ Push to main (after tests pass)
- ✅ Manual trigger on main

**Why it's separate:**

- PRs don't waste time building
- Failed tests don't trigger builds
- Keeps PR feedback fast

---

### Job 3: Deploy

**Purpose:** Deploy to Cloud Run production

**Duration:** 3-5 minutes

**Conditions:**

```yaml
needs: build # Only runs if build succeeds
```

**Steps:**

1. **Authenticate to GCP**
2. **Deploy auth-service** - With environment variables
3. **Deploy api-service** - Link to auth-service URL
4. **Deploy frontend** - Link to both service URLs
5. **Output URLs** - Show deployment endpoints

**Deployment strategy:**

- Uses commit SHA for traceability
- Environment variables from GitHub Secrets
- Service URLs dynamically fetched
- Zero-downtime deployment (Cloud Run handles)

**Runs on:**

- ❌ PRs (tests only)
- ✅ Push to main (after build succeeds)
- ✅ Manual trigger on main (after build)

**Rollback:**
If deployment fails, previous version stays running

---

## 🔒 Required Secrets

Set these in: **GitHub repo → Settings → Secrets and variables → Actions**

### GCP Authentication:

#### `GCP_SA_KEY`

**Description:** Google Cloud service account JSON key

**How to create:**

```bash
# 1. Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# 2. Grant permissions
gcloud projects add-iam-policy-binding automation-interview-pre \
  --member="serviceAccount:github-actions@automation-interview-pre.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding automation-interview-pre \
  --member="serviceAccount:github-actions@automation-interview-pre.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding automation-interview-pre \
  --member="serviceAccount:github-actions@automation-interview-pre.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# 3. Create key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@automation-interview-pre.iam.gserviceaccount.com

# 4. Copy the entire contents of key.json
# 5. Paste into GitHub Secret: GCP_SA_KEY
```

#### `GCP_PROJECT_ID`

**Value:** `automation-interview-pre`

### Application Secrets:

#### `JWT_SECRET`

**Example:** `your-super-secret-jwt-key-change-this-in-production-12345`

#### `GOOGLE_CLIENT_ID`

**Example:** `773292472093-xxx.apps.googleusercontent.com`

#### `GOOGLE_CLIENT_SECRET`

**Example:** `GOCSPX-xxxxxxxxxxxxx`

---

## 📊 Monitoring the Pipeline

### In GitHub UI:

1. Go to **Actions** tab
2. Click on a workflow run
3. See:
   - ✅/❌ Overall status
   - Duration of each job
   - Logs for each step
   - Artifacts (test results)

### Status Badges:

Add to README.md:

```markdown
![CI/CD](https://github.com/uzibiton/automation-interview-pre/actions/workflows/ci-cd.yml/badge.svg)
```

### Notifications:

GitHub automatically sends notifications on:

- ❌ Workflow failures
- ✅ Successful deployments (if configured)

---

## 🐛 Troubleshooting

### Tests Fail:

```
❌ Job: unit-tests failed
```

**Solution:**

1. Check test logs in GitHub Actions
2. Run tests locally: `cd tests/config && npm test`
3. Fix failing tests
4. Push fix

### Build Fails:

```
❌ Job: build failed
```

**Common causes:**

- Docker build errors
- Missing dependencies
- Invalid Dockerfile syntax

**Solution:**

1. Check build logs
2. Test locally: `docker build -t test .`
3. Fix Dockerfile
4. Push fix

### Deploy Fails:

```
❌ Job: deploy failed
```

**Common causes:**

- Missing GitHub secrets
- Invalid environment variables
- GCP permissions issues
- Service quota limits

**Solution:**

1. Verify all secrets are set
2. Check GCP permissions
3. Review Cloud Run logs
4. Check service quotas

### Manual Rollback:

If deployment succeeds but application is broken:

```bash
# Find previous working revision
gcloud run revisions list --service api-service --region us-central1

# Rollback to previous revision
gcloud run services update-traffic api-service \
  --region us-central1 \
  --to-revisions=api-service-00006-wrj=100
```

---

## 🎨 Customization Options

### Add More Stages:

#### Stage: Linting

```yaml
lint:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: npm run lint
```

#### Stage: Integration Tests

```yaml
integration-tests:
  needs: unit-tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: docker-compose -f tests/docker/docker-compose.test.yml run test-runner
```

#### Stage: Security Scan

```yaml
security-scan:
  needs: build
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### Multiple Environments:

Deploy to staging first, then production:

```yaml
deploy-staging:
  needs: build
  steps:
    - run: gcloud run deploy api-service-staging ...

deploy-production:
  needs: deploy-staging
  # Require manual approval
  environment: production
  steps:
    - run: gcloud run deploy api-service ...
```

---

## 📈 Future Enhancements

### Planned Additions:

- [ ] **Linting stage** - ESLint/Prettier checks
- [ ] **Type checking** - TypeScript validation
- [ ] **Contract tests** - Pact consumer/provider tests
- [ ] **Integration tests** - Full Docker test suite
- [ ] **E2E tests** - Playwright browser tests
- [ ] **Security scanning** - Snyk/Trivy
- [ ] **Performance tests** - Lighthouse CI
- [ ] **Staging environment** - Test before production
- [ ] **Manual approval** - Required sign-off for production
- [ ] **Slack notifications** - Alert on failures/deploys
- [ ] **Rollback automation** - Auto-revert on errors

### Optimization Ideas:

- **Caching:** Docker layer caching for faster builds
- **Parallel jobs:** Run tests in parallel
- **Matrix strategy:** Test multiple Node versions
- **Artifacts:** Share build outputs between jobs
- **Self-hosted runners:** Use your own infrastructure

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Run Deploy Action](https://github.com/google-github-actions/deploy-cloudrun)
- [Docker Build Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [CI/CD Best Practices](https://docs.github.com/en/actions/deployment/about-deployments/deploying-with-github-actions)

---

## ✅ Quick Reference

### View Pipeline:

```
https://github.com/uzibiton/automation-interview-pre/actions
```

### Trigger Manually:

1. Actions tab → CI/CD Pipeline → Run workflow

### Check Deployment:

```bash
gcloud run services list --region us-central1
```

### View Logs:

```bash
gcloud run services logs read api-service --region us-central1
```

### Current Pipeline Status:

- ✅ Tests on PR
- ✅ Build on main
- ✅ Deploy on main
- ✅ Manual trigger
- 📝 Ready for enhancements
