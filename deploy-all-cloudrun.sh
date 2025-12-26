#!/bin/bash
# deploy-all-cloudrun.sh
# Usage: bash deploy-all-cloudrun.sh

# Load environment variables from .env.cloudrun
export $(grep -v '^#' environments/.env.cloudrun | xargs)

SERVICES=(api-service auth-service expense-tracker)

for SERVICE in "${SERVICES[@]}"; do
  echo "\nDeploying $SERVICE..."
  cd app/services/$SERVICE || { echo "Directory app/services/$SERVICE not found!"; exit 1; }

  IMAGE_NAME=gcr.io/$GCP_PROJECT_ID/${SERVICE}-develop:latest

  docker build -t $IMAGE_NAME . || { echo "Docker build failed for $SERVICE"; exit 1; }
  docker push $IMAGE_NAME || { echo "Docker push failed for $SERVICE"; exit 1; }

  gcloud run deploy ${SERVICE}-develop \
    --image $IMAGE_NAME \
    --region $GCP_REGION \
    --platform managed \
    --allow-unauthenticated \
    --project=$GCP_PROJECT_ID \
    --set-env-vars="DATABASE_TYPE=$DATABASE_TYPE,FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID,JWT_SECRET=$JWT_SECRET,GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET,NODE_ENV=$NODE_ENV,VITE_AUTH_SERVICE_URL=$VITE_AUTH_SERVICE_URL,VITE_API_SERVICE_URL=$VITE_API_SERVICE_URL" || { echo "gcloud deploy failed for $SERVICE"; exit 1; }

  cd - > /dev/null
  echo "$SERVICE deployed successfully."
done
