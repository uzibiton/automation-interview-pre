# Cloud Run Deployment Guide

This guide covers deploying services to Google Cloud Run.

## Prerequisites

- Google Cloud SDK (`gcloud`) installed
- Authenticated: `gcloud auth login`
- Docker installed and running
- Project configured: `gcloud config set project <PROJECT_ID>`

## Quick Deployment

```bash
# Deploy all services to develop environment
./scripts/deploy.sh develop

# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```

## Deployment Script

The `scripts/deploy.sh` script handles building and deploying to Cloud Run.

### Usage

```bash
./scripts/deploy.sh [environment] [options]
```

### Environments

| Environment | Suffix | Trigger |
|-------------|--------|---------|
| develop | -develop | Push to main, manual |
| staging | -staging | Manual workflow |
| production | (none) | Manual workflow |
| pr-{number} | -pr-{number} | Pull requests |

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
- `--port 8080` flag
- `PORT=8080` environment variable

### Environment Variables

Each service receives environment-specific variables:

#### Auth Service
```
PORT=8080
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
PORT=8080
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

| Trigger | Action |
|---------|--------|
| Push to main | Deploy to develop |
| Pull Request | Deploy to pr-{number} |

### Manual Deployments

1. Go to Actions tab in GitHub
2. Select "CI/CD Pipeline"
3. Click "Run workflow"
4. Choose environment (develop/staging/production)

### Workflow Secrets Required

Set these in GitHub repository settings:

| Secret | Description |
|--------|-------------|
| `GCP_PROJECT_ID` | Google Cloud project ID |
| `GCP_SA_KEY` | Service account key JSON |
| `JWT_SECRET` | JWT signing secret |
| `GOOGLE_CLIENT_ID` | OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret |

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
gcloud run deploy api-service-develop \
  --image gcr.io/<PROJECT_ID>/api-service:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "PORT=8080,NODE_ENV=production,DATABASE_TYPE=firestore,..."
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

## Troubleshooting

### Container Fails Health Check

**Symptom**: Service deploys but immediately fails.

**Cause**: Application not listening on PORT=8080.

**Solution**:
1. Check Dockerfile: `EXPOSE 8080`
2. Check deployment: `--port 8080 --set-env-vars "PORT=8080,..."`
3. Check application code uses `process.env.PORT`

### Service Returns 502

**Symptom**: Service accessible but returns 502 Bad Gateway.

**Cause**: Application crashing after startup.

**Solution**:
1. Check logs: `gcloud run logs read api-service-develop --region us-central1`
2. Verify environment variables are set correctly
3. Check for missing dependencies

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
3. Verify VITE_* variables are set correctly

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
