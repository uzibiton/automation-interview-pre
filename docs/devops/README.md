# DevOps Documentation

This folder contains documentation for development, deployment, and operations.

## Quick Reference

### Local Development

```bash
# Start all services
./scripts/dev.sh start

# View logs
./scripts/dev.sh logs

# Stop services
./scripts/dev.sh stop
```

### Cloud Run Deployment

```bash
# Deploy to develop
./scripts/deploy.sh develop

# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```

## Documentation Index

### Getting Started
- [Local Development](LOCAL_DEVELOPMENT.md) - Set up and run locally
- [Environment Configuration](ENVIRONMENT_CONFIGURATION.md) - Environment files and variables

### Deployment
- [Cloud Run Deployment](CLOUD_RUN_DEPLOYMENT.md) - Deploy to Cloud Run
- [Deployment Summary](DEPLOYMENT_SUMMARY.md) - Quick deployment reference
- [Cloud Run Management](CLOUD_RUN_MANAGEMENT.md) - Manage Cloud Run services

### CI/CD
- [CI/CD Guide](CI_CD_GUIDE.md) - GitHub Actions pipeline overview
- [GitHub Actions Setup](GITHUB_ACTIONS_SETUP.md) - Configure GitHub Actions
- [Branching Strategy](BRANCHING_STRATEGY.md) - Git branching model

### Security
- [Code Scanning Setup](CODE_SCANNING_SETUP.md) - Security scanning configuration

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Cloud Run                             │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │   Frontend    │  │ Auth Service  │  │  API Service  │   │
│  │  (React/Vite) │  │   (NestJS)    │  │   (NestJS)    │   │
│  │    :8080      │  │    :8080      │  │    :8080      │   │
│  └───────────────┘  └───────────────┘  └───────────────┘   │
│         ↓                   ↓                  ↓            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Firestore                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Local Development                         │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐     │
│  │              Nginx Gateway (:80)                   │     │
│  └───────────────────────────────────────────────────┘     │
│         ↓                   ↓                  ↓            │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │   Frontend    │  │ Auth Service  │  │  API Service  │   │
│  │    :3000      │  │    :3001      │  │    :3002      │   │
│  └───────────────┘  └───────────────┘  └───────────────┘   │
│                             ↓                  ↓            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  PostgreSQL (:5432)                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Environments

| Environment | Trigger | Service Suffix | Database |
|-------------|---------|----------------|----------|
| local | Manual | N/A | PostgreSQL |
| develop | Push to main | -develop | Firestore |
| staging | Manual workflow | -staging | Firestore |
| production | Manual workflow | (none) | Firestore |
| pr-{n} | Pull Request | -pr-{n} | Firestore |

## Key Files

```
project-root/
├── scripts/
│   ├── dev.sh           # Local development
│   └── deploy.sh        # Cloud Run deployment
├── environments/
│   ├── .env.local       # Local config
│   ├── .env.develop     # Develop config
│   ├── .env.staging     # Staging config
│   └── .env.production  # Production config
├── docker-compose.yml   # Local Docker setup
└── .github/workflows/
    └── ci-cd.yml        # CI/CD pipeline
```

## Common Tasks

### View Logs

```bash
# Local
./scripts/dev.sh logs

# Cloud Run
gcloud run logs read api-service-develop --region us-central1
```

### Check Service Status

```bash
# Local
./scripts/dev.sh status

# Cloud Run
gcloud run services list --region us-central1
```

### Access Database

```bash
# Local PostgreSQL
docker exec -it test-postgres psql -U testuser -d testdb
```

## Troubleshooting

See individual documentation files for detailed troubleshooting:
- [Local Development](LOCAL_DEVELOPMENT.md#troubleshooting)
- [Cloud Run Deployment](CLOUD_RUN_DEPLOYMENT.md#troubleshooting)
- [Environment Configuration](ENVIRONMENT_CONFIGURATION.md#troubleshooting)
