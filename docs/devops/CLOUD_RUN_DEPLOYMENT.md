# Cloud Run Deployment Guide

This guide covers deploying services to Google Cloud Run.

## Prerequisites

- Google Cloud SDK (`gcloud`) installed
- Authenticated: `gcloud auth login`
- Docker installed and running
- Project configured: `gcloud config set project <PROJECT_ID>`
- Root `.env` file with secrets (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)

## Quick Deployment

```bash
# IMPORTANT: Load secrets first (credentials are NOT stored in repo)
export $(grep -v '^#' .env | xargs)

# Deploy all services to develop environment
./scripts/deploy.sh develop

# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```

> **Note**: The `environments/.env.*` files reference variables like `${GOOGLE_CLIENT_ID}` that must be set in your shell environment before running the deploy script.

## Deployment Script

The `scripts/deploy.sh` script handles building and deploying to Cloud Run.

### Usage

```bash
./scripts/deploy.sh [environment] [options]
```

### Environments

| Environment | Suffix       | Trigger              |
| ----------- | ------------ | -------------------- |
| develop     | -develop     | Push to main, manual |
| staging     | -staging     | Manual workflow      |
| production  | (none)       | Manual workflow      |
| pr-{number} | -pr-{number} | Pull requests        |

### Options

```bash
# Deploy specific service
./scripts/deploy.sh develop --service api
./scripts/deploy.sh develop --service auth
./scripts/deploy.sh develop --service frontend

# Skip Docker build (use existing images)
./scripts/deploy.sh develop --skip-build

# Dry run (show what would happen)
./scripts/deploy.sh staging --dry-run
```

## Service Configuration

### Port Configuration

**CRITICAL**: All services MUST listen on port 8080 for Cloud Run.

The deployment script automatically sets:

- `--port 8080` flag (tells Cloud Run which port to use)

**Important**: Do NOT set `PORT` in `--set-env-vars` - Cloud Run reserves `PORT` as a system variable and sets it automatically. Your application should read `process.env.PORT` which Cloud Run provides.

### Environment Variables

Each service receives environment-specific variables:

#### Auth Service

```
NODE_ENV=production
DATABASE_TYPE=firestore
FIREBASE_PROJECT_ID=<project-id>
JWT_SECRET=<secret>
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
FRONTEND_URL=<frontend-url>
GOOGLE_CALLBACK_URL=<callback-url>
```

#### API Service

```
NODE_ENV=production
DATABASE_TYPE=firestore
FIREBASE_PROJECT_ID=<project-id>
AUTH_SERVICE_URL=<auth-service-url>
```

#### Frontend

```
VITE_AUTH_SERVICE_URL=<auth-url>
VITE_API_SERVICE_URL=<api-url>
VITE_GOOGLE_CLIENT_ID=<client-id>
```

## CI/CD Integration

The GitHub Actions workflow handles deployments automatically:

### Automatic Deployments

| Trigger      | Action                |
| ------------ | --------------------- |
| Push to main | Deploy to develop     |
| Pull Request | Deploy to pr-{number} |

### Manual Deployments

1. Go to Actions tab in GitHub
2. Select "CI/CD Pipeline"
3. Click "Run workflow"
4. Choose environment (develop/staging/production)

### Workflow Secrets Required

Set these in GitHub repository settings:

| Secret                 | Description              |
| ---------------------- | ------------------------ |
| `GCP_PROJECT_ID`       | Google Cloud project ID  |
| `GCP_SA_KEY`           | Service account key JSON |
| `JWT_SECRET`           | JWT signing secret       |
| `GOOGLE_CLIENT_ID`     | OAuth client ID          |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret      |

## Deployment Order

Services must be deployed in this order:

1. **Frontend** (initial, placeholder URLs)
2. **Auth Service** (with frontend URL)
3. **API Service** (with auth service URL)
4. **Frontend** (updated with actual service URLs)

The deployment script and CI/CD workflow handle this automatically.

## Manual Deployment Commands

If you need to deploy manually:

```bash
# Build and push image
docker build -t gcr.io/<PROJECT_ID>/api-service:latest ./app/services/api-service
docker push gcr.io/<PROJECT_ID>/api-service:latest

# Deploy to Cloud Run
# NOTE: Do NOT include PORT in --set-env-vars (Cloud Run sets it automatically)
gcloud run deploy api-service-develop \
  --image gcr.io/<PROJECT_ID>/api-service:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "NODE_ENV=production,DATABASE_TYPE=firestore,..."
```

## Service URLs

After deployment, get service URLs:

```bash
# List all services
gcloud run services list --region us-central1

# Get specific service URL
gcloud run services describe api-service-develop \
  --region us-central1 \
  --format='value(status.url)'
```

## Debugging Commands

Quick reference for common debugging tasks:

```bash
# View recent logs
gcloud run services logs read auth-service-develop --region=us-central1 --limit=30

# Check environment variables
gcloud run services describe auth-service-develop --region=us-central1 \
  --format="yaml(spec.template.spec.containers[0].env)"

# Get service URL
gcloud run services describe auth-service-develop --region=us-central1 \
  --format='value(status.url)'

# List all services
gcloud run services list --region=us-central1

# List revisions (for rollback)
gcloud run revisions list --service=auth-service-develop --region=us-central1
```

## Troubleshooting

### Container Fails Health Check

**Symptom**: Service deploys but immediately fails.

**Cause**: Application not listening on PORT=8080.

**Solution**:

1. Check Dockerfile: `EXPOSE 8080`
2. Check deployment uses: `--port 8080` flag (do NOT set PORT in env vars)
3. Check application code uses `process.env.PORT || 8080`

### PORT is a Reserved Env Name Error

**Symptom**: Deployment fails with "PORT is a reserved env name".

**Cause**: Trying to set `PORT=8080` in `--set-env-vars`.

**Solution**:

Remove `PORT` from `--set-env-vars`. Only use the `--port 8080` flag. Cloud Run sets `PORT` automatically.

### Service Returns 502

**Symptom**: Service accessible but returns 502 Bad Gateway.

**Cause**: Application crashing after startup.

**Solution**:

1. Check logs: `gcloud run logs read api-service-develop --region us-central1`
2. Verify environment variables are set correctly
3. Check for missing dependencies

### Container Crashes on Startup (Logging/File System)

**Symptom**: Container starts but immediately crashes with file system errors.

**Cause**: Cloud Run has a read-only filesystem. Common issues:
- Winston logger trying to create log files
- dotenv trying to load from non-existent paths

**Solution**:

Use `K_SERVICE` environment variable to detect Cloud Run (works with any `NODE_ENV`):

```typescript
const isCloudRun = process.env.K_SERVICE !== undefined;

// Only load dotenv locally
if (!isCloudRun) {
  require('dotenv').config({ path: '...' });
}

// Only use file logging locally
if (!isCloudRun) {
  transports.push(new winston.transports.File({ ... }));
}
```

### OAuth2Strategy requires a clientID option

**Symptom**: Container crashes with "OAuth2Strategy requires a clientID option".

**Cause**: `GOOGLE_CLIENT_ID` environment variable is empty or not set.

**Solution**:

1. Ensure secrets are loaded before deploying:
   ```bash
   export $(grep -v '^#' .env | xargs)
   ./scripts/deploy.sh develop
   ```

2. Verify env vars are set on Cloud Run:
   ```bash
   gcloud run services describe auth-service-develop --region=us-central1 \
     --format="yaml(spec.template.spec.containers[0].env)"
   ```

### Database Connection Refused (TypeORM)

**Symptom**: Container crashes with "connect ECONNREFUSED 127.0.0.1:5432".

**Cause**: `DATABASE_TYPE=firestore` is not set, so app tries to connect to PostgreSQL.

**Solution**:

1. Verify `DATABASE_TYPE=firestore` is in `environments/.env.develop`
2. Check the env var is being passed to Cloud Run (see command above)
3. Ensure the module loads env vars at runtime, not import time

### CORS Errors

**Symptom**: Browser shows "blocked by CORS policy" errors.

**Cause**: Backend CORS config doesn't allow the frontend origin.

**Solution**:

Use `K_SERVICE` to detect Cloud Run and allow `.run.app` domains:

```typescript
const isCloudRun = process.env.K_SERVICE !== undefined;
const allowedOrigins = isCloudRun
  ? [process.env.FRONTEND_URL, /\.run\.app$/]
  : ['http://localhost:3000'];
```

### Google OAuth redirect_uri_mismatch

**Symptom**: Google login fails with "Error 400: redirect_uri_mismatch".

**Cause**: The callback URL is not registered in Google Cloud Console.

**Solution**:

1. Get your actual Cloud Run URL:
   ```bash
   gcloud run services describe auth-service-develop --region=us-central1 \
     --format='value(status.url)'
   ```

2. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)

3. Edit your OAuth 2.0 Client ID

4. Add the callback URL to **Authorized redirect URIs**:
   ```
   https://auth-service-develop-XXXXX-uc.a.run.app/auth/google/callback
   ```

5. Save and wait a few minutes for propagation

### NestJS Dependency Injection Errors

**Symptom**: Container crashes with "Nest can't resolve dependencies" error.

**Cause**: Missing imports in NestJS modules.

**Solution**:

1. Check error message for which dependency is missing
2. Add required module to imports array (e.g., `HttpModule` for `HttpService`)
3. Add provider to providers array if it's a custom service

### Authentication Redirect Fails

**Symptom**: Google OAuth redirects fail.

**Cause**: Callback URL not configured in Google Console.

**Solution**:

1. Get callback URL from deployment output
2. Add to Google Cloud Console: APIs & Services > Credentials
3. Redeploy auth service if URL changed

### Frontend Can't Connect to Backend

**Symptom**: API calls fail with CORS or network errors.

**Cause**: Frontend deployed with wrong backend URLs.

**Solution**:

1. Deploy backend services first
2. Redeploy frontend with updated URLs
3. Verify VITE\_\* variables are set correctly

## Rollback

To rollback to a previous revision:

```bash
# List revisions
gcloud run revisions list --service api-service-develop --region us-central1

# Rollback to specific revision
gcloud run services update-traffic api-service-develop \
  --region us-central1 \
  --to-revisions <revision-name>=100
```

## Cleanup

Remove temporary environments:

```bash
# Delete PR environment services
gcloud run services delete auth-service-pr-123 --region us-central1
gcloud run services delete api-service-pr-123 --region us-central1
gcloud run services delete expense-tracker-pr-123 --region us-central1
```

The CI/CD workflow includes an automatic cleanup job for merged/closed PRs.
