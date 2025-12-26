# Environment Configuration Guide

This document describes the environment configuration for local development and Cloud Run deployments.

## Overview

The project supports four environments:
- **local** - Local development with Docker Compose
- **develop** - Development Cloud Run environment (auto-deployed from main)
- **staging** - Pre-production Cloud Run environment
- **production** - Production Cloud Run environment

## Directory Structure

```
project-root/
├── environments/                 # Environment configuration files
│   ├── .env.local               # Local development
│   ├── .env.develop             # Develop Cloud Run
│   ├── .env.staging             # Staging Cloud Run
│   ├── .env.production          # Production Cloud Run
│   ├── .env.pr                  # PR environments
│   └── .env.cloudrun            # Legacy (use .env.develop)
├── app/
│   ├── frontend/
│   │   ├── .env.development     # Vite local development
│   │   ├── .env.staging         # Vite staging build
│   │   └── .env.production      # Vite production build
│   └── services/
│       ├── api-service/.env     # API service defaults
│       └── auth-service/.env    # Auth service defaults
└── scripts/
    ├── dev.sh                   # Local development script
    └── deploy.sh                # Cloud Run deployment script
```

## Port Configuration

### Local Development (Docker Compose)

| Service | Internal Port | External Port |
|---------|--------------|---------------|
| PostgreSQL | 5432 | 5432 |
| Auth Service | 3001 | 3001 |
| API Service | 3002 | 3002 |
| Frontend (Vite) | 3000 | 3000 |
| Nginx Proxy | 8080 | 80 |

### Cloud Run

All services MUST listen on port 8080 for Cloud Run compatibility:

| Service | Port | Notes |
|---------|------|-------|
| Auth Service | 8080 | Set via PORT env var |
| API Service | 8080 | Set via PORT env var |
| Frontend | 8080 | Nginx serves on 8080 |

**CRITICAL**: The `PORT=8080` environment variable MUST be set for all Cloud Run deployments.

## Environment Variables

### Shared Variables

| Variable | Local | Cloud Run | Description |
|----------|-------|-----------|-------------|
| `PORT` | 3001/3002 | 8080 | Service port |
| `NODE_ENV` | development | production | Node environment |
| `DATABASE_TYPE` | postgresql | firestore | Database adapter |
| `JWT_SECRET` | - | - | JWT signing secret |
| `GOOGLE_CLIENT_ID` | - | - | OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | - | - | OAuth client secret |

### Service-Specific Variables

#### Auth Service
- `FRONTEND_URL` - Frontend URL for CORS/redirects
- `GOOGLE_CALLBACK_URL` - OAuth callback URL

#### API Service
- `AUTH_SERVICE_URL` - Auth service URL for validation

#### Frontend (Vite)
- `VITE_AUTH_SERVICE_URL` - Auth service URL
- `VITE_API_SERVICE_URL` - API service URL
- `VITE_GOOGLE_CLIENT_ID` - OAuth client ID
- `VITE_USE_MOCK_API` - Enable/disable mock API

## Using Environment Files

### Local Development

```bash
# Start all services
./scripts/dev.sh start

# Start specific service
./scripts/dev.sh start --service api

# Start with rebuild
./scripts/dev.sh start --build
```

The script automatically loads `environments/.env.local`.

### Cloud Run Deployment

```bash
# Deploy to develop (default)
./scripts/deploy.sh develop

# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production

# Deploy specific service
./scripts/deploy.sh develop --service api

# Dry run (no actual deployment)
./scripts/deploy.sh staging --dry-run
```

The script automatically loads the corresponding environment file.

## CI/CD Integration

The GitHub Actions workflow handles environment selection automatically:

| Trigger | Environment | Suffix |
|---------|-------------|--------|
| Push to main | develop | -develop |
| Pull Request | pr-{number} | -pr-{number} |
| Manual (develop) | develop | -develop |
| Manual (staging) | staging | -staging |
| Manual (production) | production | (none) |

## Adding a New Environment

1. Create environment file: `environments/.env.{name}`
2. Add frontend env: `app/frontend/.env.{name}`
3. Update CI/CD workflow if needed
4. Update deployment scripts if needed

## Troubleshooting

### Container Fails to Start on Cloud Run

**Symptom**: Container starts but health check fails.

**Cause**: Service not listening on PORT=8080.

**Solution**: Ensure `PORT=8080` is set in deployment:
```bash
gcloud run deploy service-name \
  --port 8080 \
  --set-env-vars "PORT=8080,..."
```

### Environment Variables Not Loading

**Symptom**: Services use default values instead of env file.

**Cause**: Environment file not sourced or wrong file loaded.

**Solution**: Check file path and use scripts:
```bash
# Local
./scripts/dev.sh start

# Cloud Run
./scripts/deploy.sh {environment}
```

### Frontend Can't Connect to Backend

**Symptom**: API calls fail with network errors.

**Cause**: VITE_* variables not set correctly.

**Solution**:
- Local: Check `app/frontend/.env.development`
- Cloud Run: Ensure frontend is redeployed after backend with correct URLs
