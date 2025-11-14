#!/bin/bash

# Cloud Run Deployment Script for Expense Tracker
# This script deploys all services to Google Cloud Run

set -e

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-your-project-id}"
REGION="${GCP_REGION:-us-central1}"
DATABASE_TYPE="${DATABASE_TYPE:-firestore}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Expense Tracker - Cloud Run Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if project ID is set
if [ "$PROJECT_ID" == "your-project-id" ]; then
    echo -e "${YELLOW}Please set GCP_PROJECT_ID environment variable${NC}"
    echo "export GCP_PROJECT_ID=your-actual-project-id"
    exit 1
fi

echo -e "${YELLOW}Project ID: ${PROJECT_ID}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"
echo -e "${YELLOW}Database Type: ${DATABASE_TYPE}${NC}"
echo ""

# Set gcloud project
echo -e "${GREEN}Setting gcloud project...${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${GREEN}Enabling required APIs...${NC}"
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  firestore.googleapis.com \
  sqladmin.googleapis.com

# Build and deploy Auth Service
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deploying Auth Service...${NC}"
echo -e "${GREEN}========================================${NC}"

cd services/auth-service

gcloud builds submit --tag gcr.io/$PROJECT_ID/auth-service

gcloud run deploy auth-service \
  --image gcr.io/$PROJECT_ID/auth-service \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --set-env-vars "
DATABASE_TYPE=$DATABASE_TYPE,
FIREBASE_PROJECT_ID=$PROJECT_ID,
JWT_SECRET=${JWT_SECRET:-change-this-secret},
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID},
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
"

AUTH_SERVICE_URL=$(gcloud run services describe auth-service --platform managed --region $REGION --format 'value(status.url)')
echo -e "${GREEN}Auth Service deployed at: ${AUTH_SERVICE_URL}${NC}"

cd ../..

# Build and deploy API Service
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deploying API Service...${NC}"
echo -e "${GREEN}========================================${NC}"

cd services/api-service

gcloud builds submit --tag gcr.io/$PROJECT_ID/api-service

gcloud run deploy api-service \
  --image gcr.io/$PROJECT_ID/api-service \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --set-env-vars "
DATABASE_TYPE=$DATABASE_TYPE,
FIREBASE_PROJECT_ID=$PROJECT_ID,
AUTH_SERVICE_URL=$AUTH_SERVICE_URL
"

API_SERVICE_URL=$(gcloud run services describe api-service --platform managed --region $REGION --format 'value(status.url)')
echo -e "${GREEN}API Service deployed at: ${API_SERVICE_URL}${NC}"

cd ../..

# Build and deploy Frontend
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deploying Frontend...${NC}"
echo -e "${GREEN}========================================${NC}"

cd frontend

# Build frontend with production env vars
export VITE_AUTH_SERVICE_URL=$AUTH_SERVICE_URL
export VITE_API_SERVICE_URL=$API_SERVICE_URL
export VITE_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID

gcloud builds submit --tag gcr.io/$PROJECT_ID/frontend

gcloud run deploy frontend \
  --image gcr.io/$PROJECT_ID/frontend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 256Mi \
  --set-env-vars "
VITE_AUTH_SERVICE_URL=$AUTH_SERVICE_URL,
VITE_API_SERVICE_URL=$API_SERVICE_URL,
VITE_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
"

FRONTEND_URL=$(gcloud run services describe frontend --platform managed --region $REGION --format 'value(status.url)')
echo -e "${GREEN}Frontend deployed at: ${FRONTEND_URL}${NC}"

cd ..

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Service URLs:${NC}"
echo -e "Frontend:     ${FRONTEND_URL}"
echo -e "Auth Service: ${AUTH_SERVICE_URL}"
echo -e "API Service:  ${API_SERVICE_URL}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update Google OAuth redirect URI to: ${AUTH_SERVICE_URL}/auth/google/callback"
echo "2. Initialize Firestore database (if using Firestore)"
echo "3. Test the application at: ${FRONTEND_URL}"
echo ""
