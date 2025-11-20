# Deployment Guide: Google Cloud Run + Firebase

This guide walks you through deploying the Expense Tracker application to Google Cloud Run with Firebase Firestore.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Setup Steps](#setup-steps)
- [Deployment](#deployment)
- [Post-Deployment](#post-deployment)
- [Monitoring & Logs](#monitoring--logs)
- [Cost Estimation](#cost-estimation)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. Google Cloud Account

- Create a Google Cloud account: https://console.cloud.google.com
- Enable billing (required for Cloud Run)
- $300 free credit for new users

### 2. Install gcloud CLI

```bash
# Download from: https://cloud.google.com/sdk/docs/install

# After installation, verify:
gcloud --version

# Login to your account:
gcloud auth login

# Set up application default credentials:
gcloud auth application-default login
```

### 3. Required Tools

```bash
# Docker (for local testing)
docker --version

# Git
git --version

# Node.js (for local development)
node --version
```

---

## Architecture Overview

### Production Architecture:

```
Users
  ↓
Frontend (Cloud Run)
  ↓
Auth Service (Cloud Run) ──→ Firestore (Users)
  ↓
API Service (Cloud Run) ──→ Firestore (Expenses)
```

### Services:

1. **Frontend**: React + Vite PWA
2. **Auth Service**: NestJS (JWT + Google OAuth)
3. **API Service**: NestJS (Expense CRUD)
4. **Database**: Firebase Firestore (NoSQL)

---

## Setup Steps

### Step 1: Create GCP Project

```bash
# Create a new project
export PROJECT_ID="expense-tracker-$(date +%s)"
gcloud projects create $PROJECT_ID --name="Expense Tracker"

# Set as active project
gcloud config set project $PROJECT_ID

# Link billing account (find your billing account ID)
gcloud billing accounts list
export BILLING_ACCOUNT_ID="your-billing-account-id"
gcloud billing projects link $PROJECT_ID --billing-account=$BILLING_ACCOUNT_ID
```

### Step 2: Enable Required APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  firestore.googleapis.com \
  secretmanager.googleapis.com
```

### Step 3: Initialize Firestore

```bash
# Create Firestore database
gcloud firestore databases create --region=us-central1

# Or use the console:
# https://console.firebase.google.com/
# Select your project → Build → Firestore Database → Create Database
# Choose Production mode and select region (us-central1)
```

### Step 4: Setup Google OAuth

1. Go to: https://console.cloud.google.com/apis/credentials?project=skillful-eon-477917-b7
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Application type: **Web application**
4. Name: "Expense Tracker Web Client"
5. **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `http://localhost:5173`
   - `https://frontend-staging-773292472093.us-central1.run.app`
   - `https://frontend-773292472093.us-central1.run.app`
6. **Authorized redirect URIs**:
   - `http://localhost:3001/auth/google/callback` (development)
   - `https://auth-service-staging-773292472093.us-central1.run.app/auth/google/callback` (staging)
   - `https://auth-service-773292472093.us-central1.run.app/auth/google/callback` (production)
7. Save Client ID and Client Secret

**Note:** For PR environments, manually add redirect URIs as needed:

- `https://auth-service-pr-{number}-773292472093.us-central1.run.app/auth/google/callback`
- `https://frontend-pr-{number}-773292472093.us-central1.run.app`

### Step 5: Configure GitHub Secrets

For CI/CD deployment, configure these secrets in GitHub:
https://github.com/uzibiton/automation-interview-pre/settings/secrets/actions

**Required secrets:**

```
GCP_PROJECT_ID=skillful-eon-477917-b7
FIREBASE_PROJECT_ID=skillful-eon-477917-b7
GCP_SA_KEY=<contents of github-actions-key.json>
JWT_SECRET=<generate with: openssl rand -base64 32>
GOOGLE_CLIENT_ID=773292472093-2k7ikkmj4f3tl8r885s0pkkun3dr7bra.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

**To create service account key:**

```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account" \
  --project=skillful-eon-477917-b7

# Grant necessary roles
gcloud projects add-iam-policy-binding skillful-eon-477917-b7 \
  --member="serviceAccount:github-actions@skillful-eon-477917-b7.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding skillful-eon-477917-b7 \
  --member="serviceAccount:github-actions@skillful-eon-477917-b7.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.repoAdmin"

gcloud projects add-iam-policy-binding skillful-eon-477917-b7 \
  --member="serviceAccount:github-actions@skillful-eon-477917-b7.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create key
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions@skillful-eon-477917-b7.iam.gserviceaccount.com \
  --project=skillful-eon-477917-b7
```

### Step 6: Setup Secrets (Recommended for Production)

```bash
# Store sensitive data in Secret Manager
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-
echo -n "your-google-client-secret" | gcloud secrets create google-client-secret --data-file=-

# Grant Cloud Run access to secrets
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding google-client-secret \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Deployment

### Option 1: Automated Deployment (Recommended)

```bash
# Load environment variables
source .env

# Run deployment script
chmod +x deploy-cloud-run.sh
./deploy-cloud-run.sh
```

The script will:

1. Build Docker images for all services
2. Push images to Google Container Registry
3. Deploy services to Cloud Run
4. Configure environment variables
5. Display service URLs

### Option 2: Manual Deployment

#### Deploy Auth Service

```bash
cd services/auth-service

# Build and push image
gcloud builds submit --tag gcr.io/$PROJECT_ID/auth-service

# Deploy to Cloud Run
gcloud run deploy auth-service \
  --image gcr.io/$PROJECT_ID/auth-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --set-env-vars DATABASE_TYPE=firestore,FIREBASE_PROJECT_ID=$PROJECT_ID \
  --set-secrets JWT_SECRET=jwt-secret:latest,GOOGLE_CLIENT_SECRET=google-client-secret:latest \
  --update-env-vars GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID

# Get service URL
AUTH_URL=$(gcloud run services describe auth-service --platform managed --region us-central1 --format 'value(status.url)')
echo "Auth Service: $AUTH_URL"
```

#### Deploy API Service

```bash
cd services/api-service

# Build and push
gcloud builds submit --tag gcr.io/$PROJECT_ID/api-service

# Deploy
gcloud run deploy api-service \
  --image gcr.io/$PROJECT_ID/api-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --set-env-vars DATABASE_TYPE=firestore,FIREBASE_PROJECT_ID=$PROJECT_ID,AUTH_SERVICE_URL=$AUTH_URL

# Get service URL
API_URL=$(gcloud run services describe api-service --platform managed --region us-central1 --format 'value(status.url)')
echo "API Service: $API_URL"
```

#### Deploy Frontend

```bash
cd frontend

# Build and push
gcloud builds submit --tag gcr.io/$PROJECT_ID/frontend

# Deploy
gcloud run deploy frontend \
  --image gcr.io/$PROJECT_ID/frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 256Mi \
  --set-env-vars VITE_AUTH_SERVICE_URL=$AUTH_URL,VITE_API_SERVICE_URL=$API_URL,VITE_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID

# Get service URL
FRONTEND_URL=$(gcloud run services describe frontend --platform managed --region us-central1 --format 'value(status.url)')
echo "Frontend: $FRONTEND_URL"
```

---

## Post-Deployment

### 1. Update Google OAuth Redirect URI

Go back to Google Cloud Console → APIs & Services → Credentials:

1. Edit your OAuth 2.0 Client ID
2. Add authorized redirect URI: `https://auth-service-xxx.run.app/auth/google/callback`
3. Save

### 2. Initialize Firestore Data

```bash
# Option A: Use the Firebase Console
# https://console.firebase.google.com/ → Firestore → Start collection

# Create 'categories' collection with sample data:
# Document ID: 1
# Fields:
#   nameEn: "Food & Dining"
#   nameHe: "אוכל ומסעדות"
#   icon: "🍔"
#   color: "#FF6B6B"
#   isDefault: true

# Option B: Use a migration script (create if needed)
# node scripts/seed-firestore.js
```

### 3. Test the Application

```bash
# Open in browser
open $FRONTEND_URL

# Test endpoints
curl $AUTH_URL/health
curl $API_URL/health
```

### 4. Setup Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service frontend \
  --domain www.your-domain.com \
  --region us-central1

# Follow DNS configuration instructions
```

---

## Monitoring & Logs

### View Logs

```bash
# Frontend logs
gcloud run services logs read frontend --limit=50 --region=us-central1

# Auth service logs
gcloud run services logs read auth-service --limit=50 --region=us-central1

# API service logs
gcloud run services logs read api-service --limit=50 --region=us-central1

# Real-time logs
gcloud run services logs tail frontend --region=us-central1
```

### Cloud Console

View all services: https://console.cloud.google.com/run

Each service shows:

- Request count
- Request latency
- Container instances
- Memory usage
- Error rate
- Logs

### Firestore Console

View database: https://console.firebase.google.com/ → Firestore Database

---

## Cost Estimation

### Cloud Run Pricing (us-central1):

**Free Tier (Monthly):**

- 2 million requests
- 360,000 GB-seconds memory
- 180,000 vCPU-seconds

**After Free Tier:**

- Requests: $0.40 per million
- Memory: $0.0000025 per GB-second
- CPU: $0.000024 per vCPU-second

**Example: Small App (10,000 daily users)**

- Requests: ~300,000/month = FREE
- Memory/CPU: ~$5-10/month
- **Total: ~$5-10/month**

### Firestore Pricing:

**Free Tier (Daily):**

- 50,000 reads
- 20,000 writes
- 20,000 deletes
- 1 GB storage

**After Free Tier:**

- Reads: $0.06 per 100,000
- Writes: $0.18 per 100,000
- Storage: $0.18/GB/month

**Example: Small App**

- ~$0-5/month

### Total Monthly Cost:

- **Small traffic**: $5-15/month
- **Medium traffic**: $20-50/month

---

## Troubleshooting

### Issue: Container fails to start

```bash
# Check logs
gcloud run services logs read SERVICE_NAME --limit=100

# Common causes:
# 1. Missing environment variables
# 2. Port mismatch (must listen on $PORT or 8080)
# 3. Startup timeout (increase timeout)

# Fix timeout:
gcloud run services update SERVICE_NAME --timeout=300
```

### Issue: Authentication not working

```bash
# Verify OAuth redirect URI matches exactly
# Check environment variables:
gcloud run services describe auth-service --format=yaml | grep env -A 20

# Test JWT secret:
gcloud secrets versions access latest --secret=jwt-secret
```

### Issue: Database connection failed

```bash
# Verify Firestore is enabled
gcloud firestore databases list

# Check service account permissions
gcloud projects get-iam-policy $PROJECT_ID

# Verify FIREBASE_PROJECT_ID matches
gcloud run services describe api-service --format=yaml | grep FIREBASE_PROJECT_ID
```

### Issue: Frontend can't reach backend

```bash
# Check CORS configuration in backend
# Verify environment variables in frontend:
gcloud run services describe frontend --format=yaml | grep VITE

# Test backend URLs directly:
curl https://auth-service-xxx.run.app/health
curl https://api-service-xxx.run.app/health
```

### Issue: Cold start too slow

```bash
# Set minimum instances for critical services:
gcloud run services update auth-service --min-instances=1

# Note: Increases cost but eliminates cold starts
```

---

## Updating the Application

### Update a Single Service

```bash
# Make code changes
cd services/api-service

# Rebuild and redeploy
gcloud builds submit --tag gcr.io/$PROJECT_ID/api-service
gcloud run deploy api-service --image gcr.io/$PROJECT_ID/api-service --region=us-central1

# Check deployment
gcloud run revisions list --service=api-service
```

### Rollback to Previous Version

```bash
# List revisions
gcloud run revisions list --service=api-service

# Rollback
gcloud run services update-traffic api-service \
  --to-revisions=api-service-00001-abc=100
```

---

## CI/CD with GitHub Actions

See `.github/workflows/deploy-cloudrun.yml` for automated deployment on push to main branch.

---

## Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)

---

## Support

For issues, please create a GitHub issue or contact the development team.
