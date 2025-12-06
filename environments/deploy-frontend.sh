#!/bin/bash

# Deploy Frontend to Cloud Run
# This script builds the frontend with environment variables and deploys to Cloud Run

set -e

echo "Building frontend with environment variables..."

# Build the Docker image with build arguments
gcloud builds submit --tag gcr.io/automation-interview-pre/frontend ./frontend \
  --substitutions=\
_VITE_AUTH_SERVICE_URL=https://auth-service-881467160213.us-central1.run.app,\
_VITE_API_SERVICE_URL=https://api-service-881467160213.us-central1.run.app,\
_VITE_GOOGLE_CLIENT_ID=773292472093-p9h5jtpl9r6acs9svt0iaqbkjfqr4f9n.apps.googleusercontent.com,\
_NODE_ENV=production \
  --config=./frontend/cloudbuild.yaml

echo "Deploying frontend to Cloud Run..."

gcloud run deploy frontend \
  --image gcr.io/automation-interview-pre/frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi

echo "Frontend deployed successfully!"
echo "URL: https://frontend-881467160213.us-central1.run.app"
