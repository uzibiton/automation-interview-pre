# Cloud Run Deployment Setup

This directory contains everything needed to deploy the Expense Tracker to Google Cloud Run with Firebase Firestore.

## Quick Start

### 1. Prerequisites
- Google Cloud account with billing enabled
- gcloud CLI installed
- Docker installed

### 2. Configuration

```bash
# Copy environment template
cp .env.cloudrun .env

# Edit with your values
export GCP_PROJECT_ID="your-project-id"
export GOOGLE_CLIENT_ID="your-client-id"
export GOOGLE_CLIENT_SECRET="your-client-secret"
export JWT_SECRET=$(openssl rand -base64 32)
```

### 3. Deploy

```bash
# Make script executable
chmod +x deploy-cloud-run.sh

# Run deployment
./deploy-cloud-run.sh
```

## What Gets Deployed

### Services:
1. **auth-service** (Port 8080)
   - JWT authentication
   - Google OAuth
   - User management
   - Min instances: 1 (always warm)

2. **api-service** (Port 8080)
   - Expense CRUD operations
   - Statistics and analytics
   - Category management
   - Scales to zero when idle

3. **frontend** (Port 3000)
   - React + Vite PWA
   - English/Hebrew support
   - Offline capability
   - Scales to zero when idle

### Database:
- **Firestore**: NoSQL document database
  - Collection: `expenses`
  - Collection: `categories`
  - Collection: `sub_categories`
  - Collection: `users` (optional)

## Database Adapter Pattern

The application supports both PostgreSQL and Firestore through a repository pattern:

### Switch Database Type:
```bash
# Use Firestore (default for Cloud Run)
DATABASE_TYPE=firestore

# Use PostgreSQL (for local development)
DATABASE_TYPE=postgresql
```

### Implementation:
- `database.interface.ts` - Common interface
- `postgres.repository.ts` - PostgreSQL implementation
- `firestore.repository.ts` - Firestore implementation
- `database.factory.ts` - Factory to choose implementation

## GitHub Actions CI/CD

### Setup:
1. Go to GitHub repository → Settings → Secrets
2. Add secrets:
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `GCP_SA_KEY`: Service account JSON key
   - `GOOGLE_CLIENT_ID`: OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: OAuth client secret

3. Create secrets in Google Secret Manager:
```bash
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-
echo -n "your-google-client-secret" | gcloud secrets create google-client-secret --data-file=-
```

### Workflow:
The workflow (`.github/workflows/deploy-cloudrun.yml`) automatically deploys on push to `main` branch.

## Cost Estimation

### Small Traffic (~10K daily users):
- Cloud Run: $5-10/month
- Firestore: $0-5/month
- **Total: ~$10-15/month**

### Medium Traffic (~100K daily users):
- Cloud Run: $20-40/month
- Firestore: $10-20/month
- **Total: ~$30-60/month**

## Monitoring

### View Logs:
```bash
# Real-time logs
gcloud run services logs tail frontend --region=us-central1

# Recent logs
gcloud run services logs read api-service --limit=100
```

### Cloud Console:
- Services: https://console.cloud.google.com/run
- Firestore: https://console.firebase.google.com/
- Logs: https://console.cloud.google.com/logs

## Troubleshooting

### Container won't start:
```bash
# Check logs
gcloud run services logs read SERVICE_NAME --limit=100

# Common issues:
# - Missing environment variables
# - Port not set to 8080
# - Startup timeout
```

### Authentication issues:
```bash
# Verify OAuth redirect URI
# Must be: https://auth-service-xxx.run.app/auth/google/callback

# Check secrets
gcloud secrets versions access latest --secret=jwt-secret
```

### Database connection failed:
```bash
# Verify Firestore is enabled
gcloud firestore databases list

# Check environment variables
gcloud run services describe api-service --format=yaml | grep env -A 10
```

## Files

- `deploy-cloud-run.sh` - Deployment script
- `.env.cloudrun` - Environment template
- `DEPLOYMENT.md` - Complete deployment guide
- `.github/workflows/deploy-cloudrun.yml` - CI/CD workflow
- `services/api-service/src/database/` - Database adapters

## Next Steps

1. Read `DEPLOYMENT.md` for detailed instructions
2. Set up Google OAuth credentials
3. Run deployment script
4. Test the application
5. Set up GitHub Actions for CI/CD

## Support

For issues, see the [Troubleshooting](#troubleshooting) section or create a GitHub issue.
