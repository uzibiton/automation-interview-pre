# Project Status & Continuation Guide

**Last Updated:** November 23, 2025  
**Current State:** Ready for multi-environment deployment  
**Branch:** main

---

## 🚀 Quick Start - Resume Work

### Immediate Actions Needed

1. **Deploy Staging** (In Progress)
   - Go to: https://github.com/uzibiton/automation-interview-pre/actions/workflows/ci-cd.yml
   - Click "Run workflow" → Select `main` branch → Environment: `staging` → Run
   - Wait ~5-10 minutes

2. **Update OAuth Redirect URIs**
   - Console: https://console.cloud.google.com/apis/credentials?project=773292472093
   - OAuth Client ID: `773292472093-2k7ikkmj4f3tl8r885s0pkkun3dr7bra`
   - Add the URLs listed in "OAuth Configuration" section below

3. **Test Staging**
   - URL: `https://frontend-staging-773292472093.us-central1.run.app`
   - Test login, categories, basic functionality

4. **Deploy Production & PR** (After staging works)
   - Repeat workflow run with `environment=production`
   - Create test PR to trigger PR environment

---

## 🔐 Credentials & Configuration

### Google Cloud Project

- **Project ID:** `skillful-eon-477917-b7`
- **Project Number:** `773292472093`
- **Region:** `us-central1`
- **Console:** https://console.cloud.google.com/?project=773292472093

### OAuth 2.0 Client (Web Application)

- **Client ID:** `773292472093-2k7ikkmj4f3tl8r885s0pkkun3dr7bra.apps.googleusercontent.com`
- **Client Secret:** `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`
- **Type:** Web Application
- **Console:** https://console.cloud.google.com/apis/credentials/oauthclient/773292472093-2k7ikkmj4f3tl8r885s0pkkun3dr7bra?project=773292472093

### Service Account

- **Email:** `github-actions@skillful-eon-477917-b7.iam.gserviceaccount.com`
- **Roles:**
  - Cloud Run Admin (`roles/run.admin`)
  - Storage Admin (`roles/storage.admin`)
  - Service Account User (`roles/iam.serviceAccountUser`)
  - Artifact Registry Repository Admin (`roles/artifactregistry.repoAdmin`)
  - Artifact Registry Writer (`roles/artifactregistry.writer`)
  - Cloud Build Service Agent (`roles/cloudbuild.builds.builder`)

### Firebase/Firestore

- **Project:** Same as GCP (skillful-eon-477917-b7)
- **Database:** Firestore in Native mode
- **Collections:**
  - `categories` - 5 documents (Entertainment, Food, Health, Transportation, Bills)
  - `sub_categories` - 21 documents
  - `expenses` - User expense data
  - `users` - User profiles

### GitHub Secrets (Already Configured)

```
GCP_PROJECT_ID=skillful-eon-477917-b7
FIREBASE_PROJECT_ID=skillful-eon-477917-b7
GCP_SA_KEY=<Service account key JSON>
JWT_SECRET=your-jwt-secret-change-in-production
GOOGLE_CLIENT_ID=773292472093-2k7ikkmj4f3tl8r885s0pkkun3dr7bra.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

---

## 🌐 Environment URLs

### Staging

- **Frontend:** `https://frontend-staging-773292472093.us-central1.run.app`
- **Auth Service:** `https://auth-service-staging-773292472093.us-central1.run.app`
- **API Service:** `https://api-service-staging-773292472093.us-central1.run.app`

### Production

- **Frontend:** `https://frontend-773292472093.us-central1.run.app`
- **Auth Service:** `https://auth-service-773292472093.us-central1.run.app`
- **API Service:** `https://api-service-773292472093.us-central1.run.app`

### PR Environments (Dynamic)

- **Pattern:** `https://{service}-pr-{number}-773292472093.us-central1.run.app`
- **Example (PR #15):**
  - Frontend: `https://frontend-pr-15-773292472093.us-central1.run.app`
  - Auth: `https://auth-service-pr-15-773292472093.us-central1.run.app`
  - API: `https://api-service-pr-15-773292472093.us-central1.run.app`

### Local Development

- **Frontend:** `http://localhost:3000`
- **Auth Service:** `http://localhost:3001`
- **API Service:** `http://localhost:3002`
- **PostgreSQL:** `localhost:5432` (testdb/testuser/testpass)

---

## 🔧 OAuth Configuration

### Required Setup in Google Console

**Console URL:** https://console.cloud.google.com/apis/credentials/oauthclient/773292472093-2k7ikkmj4f3tl8r885s0pkkun3dr7bra?project=773292472093

#### Authorized JavaScript Origins

```
http://localhost:3000
https://frontend-staging-773292472093.us-central1.run.app
https://frontend-773292472093.us-central1.run.app
```

#### Authorized Redirect URIs

```
http://localhost:3001/auth/google/callback
https://auth-service-staging-773292472093.us-central1.run.app/auth/google/callback
https://auth-service-773292472093.us-central1.run.app/auth/google/callback
```

**Note for PR Environments:**

- Add URLs manually when testing PR: `https://frontend-pr-{N}-773292472093.us-central1.run.app`
- And: `https://auth-service-pr-{N}-773292472093.us-central1.run.app/auth/google/callback`

---

## 📋 Architecture Overview

### Services

1. **Frontend** (React + TypeScript + Vite)
   - Port 3000 (local) / 8080 (container)
   - Nginx serves static files
   - Runtime config via `window.ENV` (generated at startup)
   - i18n support (English + Hebrew)

2. **Auth Service** (NestJS)
   - Port 3001 (local) / 3001 (container)
   - JWT authentication
   - Google OAuth integration
   - User registration/login

3. **API Service** (NestJS)
   - Port 3002 (local) / 3002 (container)
   - Expense CRUD operations
   - Categories management
   - Statistics/analytics

### Database Strategy

- **Production/Staging:** Firestore (DATABASE_TYPE=firestore)
- **Local Development:** PostgreSQL + TypeORM
- **Repository Pattern:** `FirestoreRepository` implements `IExpenseRepository`

### Key Technical Decisions

1. **Runtime Config:** Frontend uses `generate-config.sh` to inject service URLs at container startup
2. **CORS:** Dynamic based on NODE_ENV - production allows `/.run.app$/` regex
3. **Type Casting:** Used `as any` for Firestore returns to resolve TypeORM entity type mismatches
4. **Shared Database:** All environments use same Firestore (noted as technical debt)

---

## ⚠️ Known Issues & Technical Debt

### 1. Shared Firestore Database

**Issue:** All environments (staging, PR, production) share the same Firestore database  
**Impact:**

- Test data in staging affects production
- PR environment tests can corrupt real data
- No data isolation between environments

**Solutions:**

- **Option A:** Create separate Firebase projects for dev/staging/prod
- **Option B:** Use collection prefixes (`staging_expenses`, `prod_expenses`)
- **Option C:** Use Firestore namespaces/databases

**Priority:** High - Should be addressed before production use

### 2. TypeScript Type Mismatches

**Issue:** Firestore interface types don't match TypeORM entity types  
**Current Fix:** Type casting with `as any` in ExpensesService  
**Better Solution:**

- Create shared DTOs for API responses
- Use mapper functions to convert between types
- Remove TypeORM entities from Firestore code paths

**Priority:** Medium - Works but not type-safe

### 3. Incomplete Firestore Integration

**Status:** Only categories fully tested  
**Untested Methods:**

- `create()` - Create new expense
- `findAll()` - List expenses with filters
- `findOne()` - Get single expense
- `update()` - Update expense
- `delete()` - Delete expense
- `getStats()` - Statistics queries

**Priority:** High - Core functionality

### 4. No PR Environment Cleanup

**Issue:** PR environments persist after PR close  
**Impact:** Cloud Run services accumulate, increasing costs  
**Solution:** Add cleanup job in workflow on PR close

**Priority:** Low - Manual cleanup works for now

### 5. Multi-Environment Testing Challenges

**Issue:** Testing across multiple environments (local, staging, PR, production) and multiple versions  
**Current Challenges:**

- **Environment Proliferation:** Each PR creates 3 new services (frontend, auth, api)
- **Version Management:** No clear strategy for testing different versions simultaneously
- **Test Data Isolation:** All environments share same Firestore database
- **Configuration Drift:** Environment-specific configs may differ unexpectedly
- **Cross-Environment Dependencies:** Services in one environment might accidentally call services in another

**Impact:**

- Difficult to validate features work consistently across all environments
- Test failures may be environment-specific, hard to reproduce
- Version compatibility testing requires manual setup
- No automated smoke tests per environment

**Solutions:**

- **Multi-Environment Test Suite:** Create Playwright tests with environment-aware config

  ```typescript
  // tests/e2e/multi-env.spec.ts
  const envConfig = {
    local: { frontend: 'localhost:3000', auth: 'localhost:3001', api: 'localhost:3002' },
    staging: {
      frontend: 'frontend-staging-...',
      auth: 'auth-service-staging-...',
      api: 'api-service-staging-...',
    },
    production: { frontend: 'frontend-...', auth: 'auth-service-...', api: 'api-service-...' },
  };
  ```

- **Version Matrix Testing:** Test critical paths across version combinations
  - Frontend v1.2 + API v1.2 (happy path)
  - Frontend v1.2 + API v1.1 (backward compatibility)
  - Frontend v1.1 + API v1.2 (forward compatibility)

- **Environment-Specific Test Data:** Use prefixed collections in Firestore

  ```
  staging_expenses, staging_categories
  pr_15_expenses, pr_15_categories
  prod_expenses, prod_categories
  ```

- **Automated Smoke Tests:** Add to CI/CD pipeline
  - After each deployment, run smoke tests against that environment
  - Test critical paths: login, create expense, view dashboard
  - Store results in test reports with environment labels

- **Service Discovery Pattern:** Use environment variables to prevent cross-environment calls
  ```typescript
  // Ensure frontend calls correct auth service for its environment
  const AUTH_URL = window.ENV.AUTH_SERVICE_URL; // Set at deployment time
  ```

**Priority:** High - Essential for reliable multi-environment deployments

**Documentation References:**

- See `tests/README-MULTI-ENV-E2E.md` for multi-environment E2E testing strategy
- See `tests/E2E-IMPLEMENTATION-COMPLETE.md` for implementation examples
- See `.github/workflows/ci-cd.yml` for environment-specific deployments

---

## 🔄 CI/CD Pipeline

### Workflow File

`.github/workflows/ci-cd.yml`

### Triggers

- **Push to main:** Deploys to staging
- **Pull Request:** Deploys PR environment
- **Manual:** workflow_dispatch with environment selection

### Deployment Steps

1. Checkout code
2. Authenticate to GCP
3. Build & push Docker images to Artifact Registry
4. Deploy to Cloud Run (3 services)
5. Set environment variables
6. Configure traffic to 100%

### Environment Variables (Set in Deployment)

```
NODE_ENV=production
DATABASE_TYPE=firestore
FIREBASE_PROJECT_ID=skillful-eon-477917-b7
JWT_SECRET=<from GitHub secret>
GOOGLE_CLIENT_ID=<from GitHub secret>
GOOGLE_CLIENT_SECRET=<from GitHub secret>
FRONTEND_URL=<dynamic based on environment>
GOOGLE_CALLBACK_URL=<dynamic based on environment>
AUTH_SERVICE_URL=<dynamic based on environment>
```

---

## 🧪 Testing Checklist

### After Each Deployment

#### Staging

- [ ] Frontend loads without errors
- [ ] Can register new user with email/password
- [ ] Can login with email/password
- [ ] Can login with Google OAuth
- [ ] Categories dropdown shows 5 categories
- [ ] Can create expense with category selection
- [ ] Can view expense list
- [ ] Can edit expense
- [ ] Can delete expense
- [ ] Dashboard shows statistics
- [ ] Language toggle works (EN/HE)

#### Production

- [ ] All staging tests pass
- [ ] OAuth flow works with production domain
- [ ] Data persists correctly
- [ ] Performance is acceptable
- [ ] No console errors

#### PR Environment

- [ ] Services deploy successfully
- [ ] Basic functionality works
- [ ] No interference with staging/production

---

## 📚 Important Files

### Configuration

- `.env` - Local development environment variables
- `.github/workflows/ci-cd.yml` - CI/CD pipeline
- `docker-compose.yml` - Local development stack

### Frontend

- `frontend/Dockerfile` - Multi-stage build, Nginx serving
- `frontend/generate-config.sh` - Runtime config injection
- `frontend/src/utils/config.ts` - Config helper functions
- `frontend/nginx.conf` - Nginx configuration

### Services

- `services/auth-service/src/main.ts` - CORS config, bootstrap
- `services/api-service/src/main.ts` - CORS config, bootstrap
- `services/api-service/src/expenses/expenses.service.ts` - Hybrid TypeORM/Firestore logic
- `services/api-service/src/database/firestore.repository.ts` - Firestore implementation

### Scripts

- `scripts/seed-firestore-categories.js` - Seed default categories (already run)

### Documentation

- `docs/SETUP.md` - Initial setup instructions
- `docs/DEPLOYMENT.md` - Deployment guide
- `docs/RUN_LOCALLY.md` - Local development guide
- `docs/TESTING.md` - Testing strategies
- `docs/API_REFERENCE.md` - API endpoints
- `PROJECT_STATUS.md` - **This file** - Current state & next steps

---

## 🎯 Next Steps (Prioritized)

### Immediate (Today)

1. ✅ Deploy staging environment
2. ✅ Update OAuth redirect URIs for staging
3. ✅ Test staging deployment (login + categories)
4. ✅ Deploy production environment
5. ✅ Update OAuth redirect URIs for production
6. ✅ Create test PR to verify PR environment

### Short Term (This Week)

1. Test all Firestore CRUD operations in staging
2. **Implement multi-environment testing strategy:**
   - Create environment-specific Firestore collections (prefixed)
   - Add smoke tests to CI/CD pipeline for each environment
   - Document version compatibility testing approach
3. Implement environment-specific Firestore collections
4. Add PR cleanup automation
5. Fix TypeScript type casting (create DTOs)
6. Add error monitoring (Sentry/Cloud Error Reporting)

### Medium Term (This Month)

1. Separate Firestore databases per environment
2. Implement comprehensive E2E tests
3. Add performance monitoring
4. Implement rate limiting
5. Add API documentation (Swagger)
6. Set up alerts for service failures

### Long Term (Future)

1. Add multi-currency support
2. Implement budget tracking
3. Add expense analytics dashboard
4. Mobile app (React Native)
5. Export functionality (PDF/CSV)
6. Recurring expenses
7. Receipt image upload

---

## 🆘 Troubleshooting Guide

### Deployment Fails

**Check:**

1. GitHub Actions logs: https://github.com/uzibiton/automation-interview-pre/actions
2. Service account has all required IAM roles
3. GitHub Secrets are correctly set
4. Docker build succeeds (check for TypeScript errors)

**Common Issues:**

- Permission denied: Add missing IAM role to service account
- Build timeout: Increase Cloud Build timeout or optimize Dockerfile
- Image not found: Check Artifact Registry name matches workflow

### OAuth Not Working

**Check:**

1. Redirect URIs match exactly (no trailing slashes)
2. JavaScript origins include frontend domain
3. OAuth client is type "Web Application"
4. CLIENT_ID and SECRET are correctly set in GitHub Secrets
5. GOOGLE_CALLBACK_URL matches auth-service domain

**Common Issues:**

- `redirect_uri_mismatch`: Add URL to OAuth console
- `access_denied`: User declined or app not verified
- CORS error: Check NODE_ENV=production is set

### Categories Not Loading

**Check:**

1. Firestore database contains categories: https://console.firebase.google.com/project/skillful-eon-477917-b7/firestore
2. FIREBASE_PROJECT_ID is set correctly
3. Service account has Firestore access
4. API service logs for errors: `gcloud logging read --project=skillful-eon-477917-b7`
5. **Environment mismatch:** Verify service is calling correct environment's data collections

**Re-seed if needed:**

```bash
cd scripts
npm install
node seed-firestore-categories.js
```

### Environment-Specific Issues

**Symptoms:**

- Service works in local but fails in staging
- Different behavior between staging and production
- PR environment shows outdated data

**Common Causes:**

1. **Environment Variable Mismatch:**
   - Check `FRONTEND_URL`, `AUTH_SERVICE_URL`, `GOOGLE_CALLBACK_URL` are set correctly
   - Verify `NODE_ENV` is set to `production` in Cloud Run
   - Confirm environment-specific URLs don't have typos

2. **Cross-Environment Service Calls:**
   - Frontend in staging calling production auth service (wrong URL)
   - Hardcoded URLs instead of environment variables
   - Check browser DevTools Network tab for actual URLs being called

3. **Shared Database Issues:**
   - All environments writing to same Firestore collections
   - Test data in staging polluting production
   - **Solution:** Implement collection prefixes (see Technical Debt #5)

4. **OAuth Configuration:**
   - Redirect URIs not added for new environments
   - JavaScript origins missing for PR environment
   - Copy-paste error in OAuth console setup

**Debug Steps:**

```bash
# Check environment variables for a service
gcloud run services describe frontend-staging --region=us-central1 --project=skillful-eon-477917-b7 --format="value(spec.template.spec.containers[0].env)"

# Compare staging vs production config
gcloud run services describe frontend-staging --region=us-central1 --project=skillful-eon-477917-b7 --format=yaml > staging-config.yaml
gcloud run services describe frontend --region=us-central1 --project=skillful-eon-477917-b7 --format=yaml > prod-config.yaml
diff staging-config.yaml prod-config.yaml

# Test service connectivity between environments
curl https://auth-service-staging-773292472093.us-central1.run.app/health
curl https://api-service-staging-773292472093.us-central1.run.app/categories
```

### CORS Errors

**Check:**

1. NODE_ENV=production in service deployment
2. FRONTEND_URL matches actual frontend domain
3. Auth/API services have CORS configured for `/.run.app$/`
4. Browser is not caching old CORS headers (hard refresh)

### Service 503 Errors

**Possible Causes:**

1. Service still deploying (check Cloud Run console)
2. Container crashed (check logs)
3. Cold start timeout (increase timeout in workflow)
4. Service doesn't exist (verify deployment succeeded)

---

## 📞 Support & Resources

### Key Documentation

- **GCP Console:** https://console.cloud.google.com/?project=773292472093
- **Firebase Console:** https://console.firebase.google.com/project/skillful-eon-477917-b7
- **GitHub Repo:** https://github.com/uzibiton/automation-interview-pre
- **GitHub Actions:** https://github.com/uzibiton/automation-interview-pre/actions
- **Cloud Run Services:** https://console.cloud.google.com/run?project=773292472093

### Commands Reference

#### Deploy Manually

```bash
# Deploy staging
gcloud run deploy frontend-staging --source=./frontend --region=us-central1 --project=skillful-eon-477917-b7

# Deploy production
gcloud run deploy frontend --source=./frontend --region=us-central1 --project=skillful-eon-477917-b7
```

#### Check Service Status

```bash
# List all services
gcloud run services list --project=skillful-eon-477917-b7 --region=us-central1

# Get service details
gcloud run services describe frontend-staging --region=us-central1 --project=skillful-eon-477917-b7

# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=frontend-staging" --limit=50 --project=skillful-eon-477917-b7
```

#### Delete Services

```bash
# Delete all staging services
gcloud run services delete frontend-staging auth-service-staging api-service-staging --region=us-central1 --project=skillful-eon-477917-b7 --quiet

# Delete specific PR environment
gcloud run services delete frontend-pr-15 auth-service-pr-15 api-service-pr-15 --region=us-central1 --project=skillful-eon-477917-b7 --quiet
```

#### Local Development

```bash
# Start all services
docker-compose up -d

# Start specific service
cd services/api-service && npm run start:dev

# Run tests
npm test

# Build frontend
cd frontend && npm run build
```

---

## ✅ Current Status Summary

**Last Actions Taken:**

- Fixed TypeScript type mismatch in ExpensesService (added type casts)
- Deleted all Cloud Run services (fresh start)
- Created comprehensive documentation
- Prepared for multi-environment deployment

**What's Working:**

- ✅ Code compiles without errors
- ✅ Firestore seeded with categories
- ✅ GitHub Secrets configured
- ✅ Service account has all permissions
- ✅ OAuth client created (Web type)
- ✅ CI/CD pipeline configured
- ✅ Runtime config implemented

**What Needs Testing:**

- ⏳ Staging deployment
- ⏳ Production deployment
- ⏳ PR environment
- ⏳ OAuth flow in deployed environments
- ⏳ Categories loading from Firestore
- ⏳ Full expense CRUD operations

**What Needs Configuration:**

- ⏳ OAuth redirect URIs (after deployments)
- ⏳ Environment-specific Firestore (future)

---

## 🎬 When You Return

**Step 1:** Read this file top to bottom (~10 minutes)

**Step 2:** Check deployment status:

- Go to: https://github.com/uzibiton/automation-interview-pre/actions
- If staging deployed successfully, continue to Step 3
- If failed, check logs and troubleshoot

**Step 3:** Update OAuth (5 minutes):

- https://console.cloud.google.com/apis/credentials/oauthclient/773292472093-2k7ikkmj4f3tl8r885s0pkkun3dr7bra?project=773292472093
- Add staging URLs from "OAuth Configuration" section

**Step 4:** Test staging (10 minutes):

- Open: https://frontend-staging-773292472093.us-central1.run.app
- Go through testing checklist

**Step 5:** Deploy production (20 minutes):

- Run workflow with `environment=production`
- Update OAuth for production
- Test production

**Step 6:** Review technical debt and plan next development phase

---

**Ready to deploy! Follow the steps above and test each environment thoroughly.**

**Questions or issues? Check the Troubleshooting Guide section.**
