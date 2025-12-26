# Cloud Run Deployment Commands

## 1. Load Environment Variables

First, load your environment variables from your .env file:

export $(grep -v '^#' .env | xargs)

## 2. Deploy One Service (api-service)

1. Navigate to the service directory:
   cd app/services/api-service

2. Build the Docker image:
   docker build -t gcr.io/$GCP_PROJECT_ID/api-service-develop:latest .

3. Push the image to Google Container Registry:
   docker push gcr.io/$GCP_PROJECT_ID/api-service-develop:latest

4. Deploy to Cloud Run:
   gcloud run deploy api-service-develop \
    --image gcr.io/$GCP_PROJECT_ID/api-service-develop:latest \
     --region $GCP_REGION \
     --platform managed \
     --allow-unauthenticated \
     --project=$GCP_PROJECT_ID \
   --set-env-vars="DATABASE_TYPE=$DATABASE_TYPE,FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID,JWT_SECRET=$JWT_SECRET,GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET,NODE_ENV=$NODE_ENV"

---

## 3. Deploy All Services (repeat for each service)

For each service (e.g., api-service, auth-service):

1. cd app/services/SERVICE_NAME
2. docker build -t gcr.io/$GCP_PROJECT_ID/SERVICE_NAME-develop:latest .
3. docker push gcr.io/$GCP_PROJECT_ID/SERVICE_NAME-develop:latest
4. gcloud run deploy SERVICE_NAME-develop \
    --image gcr.io/$GCP_PROJECT_ID/SERVICE_NAME-develop:latest \
     --region $GCP_REGION \
     --platform managed \
     --allow-unauthenticated \
     --project=$GCP_PROJECT_ID \
   --set-env-vars="...env variables for this service (do not include PORT)..."

_Replace SERVICE_NAME and environment variables as needed for each service._
