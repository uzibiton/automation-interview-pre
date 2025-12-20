# CI/CD Pipeline Documentation

Complete guide for the GitHub Actions CI/CD pipeline that automates testing, building, and deployment.

**Quick Links:**

- 🔗 [GitHub Actions Workflow File](../../.github/workflows/ci-cd.yml)
- 🚀 [Run Workflow Manually](https://github.com/uzibiton/automation-interview-pre/actions/workflows/ci-cd.yml)
- 📊 [View Workflow Runs](https://github.com/uzibiton/automation-interview-pre/actions)

---

## 📋 Deployment Environments

| Environment     | Trigger           | Auto-Deploy | Tests       | Use Case               |
| --------------- | ----------------- | ----------- | ----------- | ---------------------- |
| **Develop**     | Push to main      | ✅ Yes      | ⏭️ Skipped  | Continuous development |
| **Staging**     | Manual            | ❌ No       | ⚙️ Optional | Release candidates     |
| **Production**  | Manual            | ❌ No       | ⚙️ Optional | Live environment       |
| **PR-{number}** | PR opened/updated | ✅ Yes      | ⏭️ Skipped  | Feature testing        |

**Workflow Dispatch Options:**

- `environment`: Choose develop, staging, or production
- `skip_integration_tests`: Default true (can enable for thorough testing)
- `skip_smoke_tests`: Default true (can enable for E2E validation)
- Plus standard quality gate skip options (prettier, eslint, etc.)

---

## 🎯 Overview

This pipeline automates the entire software delivery process from code commit to production deployment with maximum parallelization for speed and efficiency.

### Pipeline Flow:

```
┌────────────────────────────────────────────────────────────────────┐
│                         CODE PUSH/PR                                │
└───────────────────────────┬────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Code Quality  │   │Security Checks│   │  Unit Tests   │
│   (Gateway)   │   │   (Gateway)   │   │               │
└───────┬───────┘   └───────┬───────┘   └───────────────┘
        │                   │
   ┌────┼────┐         ┌────┼────┐
   ▼    ▼    ▼         ▼         ▼
┌────┐┌────┐┌────┐  ┌────┐  ┌────┐
│Pret││ESLt││Type│  │Audt│  │Snyk│
│tier││int ││Chck│  │    │  │    │
└────┘└────┘└────┘  └────┘  └────┘
  │     │     │       │       │
  └─────┴─────┴───────┴───────┴──────┐
                                      │
                                      ▼
                          ┌────────────────────┐
                          │Setup Environment   │
                          └──────────┬─────────┘
                  ┌──────────────────┼──────────────────┐
                  │                  │                  │
                  ▼                  ▼                  ▼
         ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
         │   Build App    │  │ Build Test     │  │     Deploy     │
         │   (Gateway)    │  │   Runner       │  │ (after builds) │
         └────────┬───────┘  └────────────────┘  └────────┬───────┘
              ┌───┼───┐                                   │
              ▼   ▼   ▼                                   │
          ┌────┐┌────┐┌────┐                             │
          │Auth││API ││Frnt│                             │
          └────┘└────┘└────┘                             │
            │    │    │                                  │
            └────┴────┴──────────────────────────────────┘
                                    │
                                    ▼
                      ┌──────────────────────────┐
                      │   Integration Tests      │
                      │       (Gateway)          │
                      └────────────┬─────────────┘
                                   │
                                   ▼
                         ┌──────────────────┐
                         │ API Integration  │
                         └─────────┬────────┘
                                   │
                                   ▼
                         ┌──────────────────┐
                         │   E2E Sanity     │
                         │    (Gateway)     │
                         └─────────┬────────┘
                                   │
                                   ▼
                         ┌──────────────────┐
                         │  Smoke Tests     │
                         └──────────────────┘
```

### Total Time:

- **Stage 1 (Parallel)**: ~2-3 minutes (Code Quality + Security + Unit Tests)
- **Build Stage (Parallel)**: ~5-8 minutes (Auth, API, Frontend, Test Runner)
- **Deploy**: ~3-5 minutes
- **Integration + E2E**: ~5-7 minutes
- **Total (optimized)**: ~15-23 minutes (vs. ~30+ minutes sequential)

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

**What happens:** Full pipeline (Test -> Build -> Deploy to Develop)

**Use case:** After merging a PR, automatically deploy to develop environment

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
    inputs:
      environment:
        - develop
        - staging
        - production
```

**What happens:** Full pipeline with selected environment

**Use case:**

- Deploy to staging for release candidate testing
- Deploy to production for releases
- Re-deploy after fixing secrets
- Testing the pipeline
- Force CI run for documentation changes (bypasses paths-ignore)
- Optionally enable/disable integration and smoke tests

**How to trigger:**

1. Go to GitHub -> Actions tab
2. Click "CI/CD Pipeline"
3. Click "Run workflow"
4. Select environment (develop/staging/production)
5. Optional: Toggle skip options for tests
6. Click "Run workflow" button

---

### 📝 Skipped Paths (Documentation Changes)

The CI pipeline is automatically skipped when commits only modify:

- **`doc/**`\*\* - All files in the documentation directory
- **`*.md`** - Root-level markdown files (README.md, RUN-LOCALLY.md, etc.)
- **`.github/ISSUE_TEMPLATE/**`\*\* - Issue and PR templates

**Why?** Documentation changes don't affect code functionality and don't require testing, building, or deployment.

**Note:** If a commit includes both documentation AND code changes, the CI will run normally.

**Manual override:** You can still run CI for documentation-only changes using the Manual Trigger (workflow_dispatch)

---

## 📋 Pipeline Stages

### Stage 1: Quality & Testing (Parallel Execution)

Three independent job groups run simultaneously:

#### 1.1 Code Quality Gateway

Spawns parallel checks:

- **Prettier** - Code formatting validation
- **ESLint** - Linting and code style
- **TypeCheck** - TypeScript type checking

**Duration:** ~1-2 minutes  
**Skipped:** Yes (default - not fully configured yet)  
**Blocks Pipeline:** No (if: always() in setup job)  
**Skip Option:** `skip_prettier`, `skip_eslint`, `skip_typecheck`

#### 1.2 Security Checks Gateway

Spawns parallel scans:

- **npm audit** - Dependency vulnerability scan
- **Snyk** - Advanced security scanning with SARIF upload

**Duration:** ~2-3 minutes  
**Skipped:** npm audit=Yes (default), Snyk=No (active)  
**Blocks Pipeline:** No (if: always() in setup job)  
**Skip Option:** `skip_audit`, `skip_snyk`

#### 1.3 Unit Tests

Independent test execution:

- Jest unit tests across all workspaces
- Coverage report generation
- Artifact upload

**Duration:** ~2-3 minutes  
**Skipped:** No (always runs)  
**Blocks Pipeline:** No (if: always() in setup job)  
**Skip Option:** `skip_unit_tests`

**Total Stage 1 Time:** ~2-3 minutes (parallel execution)

---

### Stage 2: Setup Environment

**Purpose:** Determine deployment target and configuration

**Duration:** <10 seconds  
**Skipped:** No (always runs)  
**Blocks Pipeline:** Yes (required by all build/deploy stages)  
**Skip Option:** None

**Logic:**

- PR -> temporary PR environment (pr-{number})
- Push to main -> develop
- Manual trigger -> user-selected environment (develop/staging/production)

**Outputs:**

- `env_name` - Environment name (pr-{number}, develop, staging, or production)
- `env_suffix` - Suffix for service names (-pr-{number}, -develop, -staging, or empty)
- `should_run_e2e` - Whether to run E2E tests (false for production, true for others)

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

**Duration:** ~5-8 minutes (parallel)  
**Sequential would be:** ~20-32 minutes  
**Skipped:** No (always runs after setup)  
**Blocks Pipeline:** Yes (deploy requires all builds)  
**Skip Option:** None (critical for deployment)

---

### Stage 4: Deploy

**Purpose:** Deploy services to Google Cloud Run

**Duration:** ~3-5 minutes  
**Skipped:** No (always runs after builds)  
**Blocks Pipeline:** Yes (integration tests require deployed services)  
**Skip Option:** None (critical for deployment)

**Order:**

1. Frontend (to get URL)
2. Auth Service (needs frontend URL)
3. API Service (needs auth URL)
4. Frontend update (with backend URLs)

**Outputs:**

- Service URLs for all deployed services
- OAuth callback URLs

---

### Stage 5: Integration Tests

**Purpose:** Test service-to-service communication and API integration

**Duration:** ~3-5 minutes  
**Skipped:** **YES by default** (skip_integration_tests = true)  
**Blocks Pipeline:** No (continue-on-error: true)  
**Skip Option:** Can be enabled via workflow_dispatch input

**Tests:**

- API integration tests
- Service-to-service communication tests
- Database integration tests

**Note:** Integration tests are disabled by default to speed up deployment. Enable them manually when needed for thorough validation.

---

### Stage 6: Smoke Tests

**Purpose:** Fast validation of critical user flows

**Duration:** ~2-4 minutes  
**Skipped:** **YES by default** (skip_smoke_tests = true)  
**Blocks Pipeline:** No (continue-on-error: true)  
**Skip Option:** Can be enabled via workflow_dispatch input

**Tests:**

- Smoke tests for critical user flows
- Basic UI validation
- Authentication flow tests

**Output:**

- Test results in GitHub UI
- Test reports as artifacts
- ✅/❌ status visible in workflow

**Note:** Smoke tests are disabled by default to enable faster deployments. Enable them manually when you need E2E validation before production deployment.

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

Set these in: **GitHub repo -> Settings -> Secrets and variables -> Actions**

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

**Example:** `{project-number}-xxx.apps.googleusercontent.com`

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

1. Actions tab -> CI/CD Pipeline -> Run workflow

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
