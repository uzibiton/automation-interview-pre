# GitHub Actions Setup Guide

Step-by-step instructions to configure GitHub Actions for automated CI/CD.

---

## 📋 Prerequisites

- ✅ GitHub repository with code
- ✅ Google Cloud Project (`automation-interview-pre`)
- ✅ Cloud Run services (can be existing or will be created)
- ✅ Admin access to GitHub repository

---

## 🔐 Step 1: Create Google Cloud Service Account

This service account will allow GitHub Actions to deploy to Cloud Run.

### 1.1 Create Service Account:

```bash
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions CI/CD" \
  --project=automation-interview-pre
```

### 1.2 Grant Required Permissions:

```bash
# Cloud Run Admin (deploy services)
gcloud projects add-iam-policy-binding automation-interview-pre \
  --member="serviceAccount:github-actions@automation-interview-pre.iam.gserviceaccount.com" \
  --role="roles/run.admin"

# Storage Admin (push Docker images)
gcloud projects add-iam-policy-binding automation-interview-pre \
  --member="serviceAccount:github-actions@automation-interview-pre.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# Service Account User (deploy as service account)
gcloud projects add-iam-policy-binding automation-interview-pre \
  --member="serviceAccount:github-actions@automation-interview-pre.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

### 1.3 Create JSON Key:

```bash
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions@automation-interview-pre.iam.gserviceaccount.com \
  --project=automation-interview-pre
```

**⚠️ Important:** This file contains sensitive credentials. Keep it secure!

### 1.4 View the Key Contents:

```bash
cat github-actions-key.json
```

**Copy the entire JSON content** (from `{` to `}`)

---

## 🔑 Step 2: Add GitHub Secrets

### 2.1 Navigate to Secrets:

1. Go to your GitHub repository
2. Click **Settings** (top right)
3. In left sidebar: **Secrets and variables** -> **Actions**
4. Click **New repository secret**

### 2.2 Add Each Secret:

#### Secret 1: `GCP_SA_KEY`

- **Name:** `GCP_SA_KEY`
- **Value:** Paste the entire contents of `github-actions-key.json`
- Click **Add secret**

#### Secret 2: `GCP_PROJECT_ID`

- **Name:** `GCP_PROJECT_ID`
- **Value:** `automation-interview-pre`
- Click **Add secret**

#### Secret 3: `JWT_SECRET`

- **Name:** `JWT_SECRET`
- **Value:** `your-super-secret-jwt-key-change-this-in-production-12345`
  _(or generate a new one)_
- Click **Add secret**

#### Secret 4: `GOOGLE_CLIENT_ID`

- **Name:** `GOOGLE_CLIENT_ID`
- **Value:** Get from your `.env` file
  ```bash
  grep GOOGLE_CLIENT_ID .env
  ```
- Click **Add secret**

#### Secret 5: `GOOGLE_CLIENT_SECRET`

- **Name:** `GOOGLE_CLIENT_SECRET`
- **Value:** Get from your `.env` file
  ```bash
  grep GOOGLE_CLIENT_SECRET .env
  ```
- Click **Add secret**

### 2.3 Verify Secrets:

You should see:

```
GCP_SA_KEY              Updated now
GCP_PROJECT_ID          Updated now
JWT_SECRET              Updated now
GOOGLE_CLIENT_ID        Updated now
GOOGLE_CLIENT_SECRET    Updated now
```

---

## 🧪 Step 3: Test the Pipeline

### 3.1 Push to a Feature Branch:

```bash
git checkout -b test-ci-pipeline
git add .github/workflows/ci-cd.yml
git commit -m "Add CI/CD pipeline"
git push origin test-ci-pipeline
```

### 3.2 Create a Pull Request:

1. Go to GitHub repository
2. Click **Pull requests** -> **New pull request**
3. Base: `main` ← Compare: `test-ci-pipeline`
4. Create pull request

### 3.3 Watch the Pipeline:

1. Go to **Actions** tab
2. Click on the running workflow
3. Watch the **unit-tests** job
4. Should see ✅ if tests pass

### 3.4 Expected Behavior:

**On PR:**

```
✅ unit-tests  (2-3 min)
⏭️  build      (skipped - PR doesn't build)
⏭️  deploy     (skipped - PR doesn't deploy)
```

### 3.5 Merge the PR:

Once tests pass:

1. Click **Merge pull request**
2. Confirm merge
3. Watch Actions tab again

**On Main:**

```
✅ unit-tests  (2-3 min)
✅ build       (5-8 min)
✅ deploy      (3-5 min)
```

---

## 🎯 Step 4: Manual Trigger Test

### 4.1 Trigger Manually:

1. Go to **Actions** tab
2. Click **CI/CD Pipeline** (left sidebar)
3. Click **Run workflow** button
4. Select branch: `main`
5. Click **Run workflow**

### 4.2 Watch Execution:

Full pipeline should run:

- ✅ Unit tests
- ✅ Build images
- ✅ Deploy to Cloud Run

### 4.3 Verify Deployment:

```bash
# Check services are running
gcloud run services list --region us-central1

# Get service URLs
gcloud run services describe auth-service --region us-central1 --format="value(status.url)"
gcloud run services describe api-service --region us-central1 --format="value(status.url)"
gcloud run services describe frontend --region us-central1 --format="value(status.url)"
```

---

## 🔍 Troubleshooting

### Error: "Could not find credentials"

**Problem:** `GCP_SA_KEY` secret is missing or invalid

**Solution:**

1. Verify secret exists in GitHub
2. Check JSON format is correct (entire file, no extra spaces)
3. Regenerate key if needed:
   ```bash
   gcloud iam service-accounts keys create new-key.json \
     --iam-account=github-actions@automation-interview-pre.iam.gserviceaccount.com
   ```

### Error: "Permission denied"

**Problem:** Service account lacks required permissions

**Solution:**

```bash
# Re-grant permissions
gcloud projects add-iam-policy-binding automation-interview-pre \
  --member="serviceAccount:github-actions@automation-interview-pre.iam.gserviceaccount.com" \
  --role="roles/run.admin"
```

### Error: "Tests failed"

**Problem:** Unit tests are failing

**Solution:**

1. Run tests locally:

```bash
cd tests
npm install
npm test
```

2. Fix failing tests
3. Push changes

### Error: "Docker build failed"

**Problem:** Dockerfile has errors

**Solution:**

1. Test build locally:
   ```bash
   cd services/api-service
   docker build -t test .
   ```
2. Fix Dockerfile
3. Push changes

---

## 🎉 Success Checklist

- [ ] Service account created with correct permissions
- [ ] JSON key generated and saved
- [ ] All 5 GitHub secrets added
- [ ] Workflow file committed to repository
- [ ] PR created and tests ran successfully
- [ ] PR merged and full pipeline ran
- [ ] Manual trigger tested
- [ ] Services deployed to Cloud Run
- [ ] Application accessible via URLs

---

## 📝 Next Steps

Now that CI/CD is working, you can:

1. **Add more test stages** (linting, integration tests)
2. **Add staging environment** (test before production)
3. **Add manual approval** (require sign-off for prod deploys)
4. **Add notifications** (Slack alerts on failures)
5. **Optimize caching** (faster builds)

See `docs/CI_CD_PIPELINE.md` for enhancement ideas!

---

## 🚨 Security Notes

### Protect Secrets:

- ✅ Never commit `github-actions-key.json` to git
- ✅ Add to `.gitignore`:
  ```
  *-key.json
  *.json
  !package*.json
  !tsconfig*.json
  ```
- ✅ Delete local key file after adding to GitHub:
  ```bash
  rm github-actions-key.json
  ```

### Rotate Keys Regularly:

```bash
# Every 90 days, create new key
gcloud iam service-accounts keys create new-key.json \
  --iam-account=github-actions@automation-interview-pre.iam.gserviceaccount.com

# Update GitHub secret with new key

# Delete old key
gcloud iam service-accounts keys list \
  --iam-account=github-actions@automation-interview-pre.iam.gserviceaccount.com

gcloud iam service-accounts keys delete OLD_KEY_ID \
  --iam-account=github-actions@automation-interview-pre.iam.gserviceaccount.com
```

---

## 📚 Additional Resources

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Google Cloud IAM](https://cloud.google.com/iam/docs/service-accounts)
- [Cloud Run IAM Permissions](https://cloud.google.com/run/docs/reference/iam/roles)
