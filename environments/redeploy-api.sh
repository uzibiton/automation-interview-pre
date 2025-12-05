#!/bin/bash
# Quick deploy script for API service with category seeding

set -e

echo "🚀 Deploying API service with category auto-seed..."

# Set your project variables
PROJECT_ID="your-gcp-project-id"  # Replace with your project ID
REGION="us-central1"               # Replace with your region
SERVICE_NAME="expense-api"         # Replace with your service name

# Navigate to api-service directory
cd services/api-service

echo "📦 Building Docker image..."
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest .

echo "📤 Pushing to Container Registry..."
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

echo "☁️ Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_TYPE=postgres" \
  --memory 512Mi \
  --timeout 300

echo "✅ Deployment complete!"
echo ""
echo "📝 The SeedService will automatically create categories on startup."
echo "   Check logs with: gcloud run services logs read $SERVICE_NAME --region $REGION"
echo ""
echo "🔍 To verify categories were created:"
echo "   curl https://YOUR_SERVICE_URL/expenses/categories"
