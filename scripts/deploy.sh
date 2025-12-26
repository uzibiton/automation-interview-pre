#!/bin/bash
# ============================================================================
# CLOUD RUN DEPLOYMENT SCRIPT
# ============================================================================
# Usage: ./scripts/deploy.sh [environment] [options]
#
# Environments:
#   develop     Deploy to develop environment (default)
#   staging     Deploy to staging environment
#   production  Deploy to production environment
#   pr-{number} Deploy to PR environment
#
# Options:
#   --service   Deploy specific service (api|auth|frontend|all)
#   --skip-build Skip Docker build (use existing images)
#   --dry-run   Show what would be deployed without deploying
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default values
ENVIRONMENT="${1:-develop}"
SERVICE="all"
SKIP_BUILD=false
DRY_RUN=false

# Parse arguments
shift || true
while [[ $# -gt 0 ]]; do
    case $1 in
        --service)
            SERVICE="$2"
            shift 2
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# Determine environment suffix
get_env_suffix() {
    case $ENVIRONMENT in
        production)
            echo ""
            ;;
        develop|staging)
            echo "-$ENVIRONMENT"
            ;;
        pr-*)
            echo "-$ENVIRONMENT"
            ;;
        *)
            log_error "Unknown environment: $ENVIRONMENT"
            exit 1
            ;;
    esac
}

# Load environment file
load_env() {
    local env_file="$PROJECT_ROOT/environments/.env.$ENVIRONMENT"

    # Handle PR environments
    if [[ $ENVIRONMENT == pr-* ]]; then
        env_file="$PROJECT_ROOT/environments/.env.pr"
    fi

    if [[ -f "$env_file" ]]; then
        log_info "Loading environment from $env_file"
        set -a
        source "$env_file"
        set +a
    else
        log_error "Environment file not found: $env_file"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log_step "Checking prerequisites..."

    # Check gcloud
    if ! command -v gcloud &> /dev/null; then
        log_error "gcloud CLI is not installed. Install from: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi

    # Check authentication
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n 1 > /dev/null 2>&1; then
        log_error "Not authenticated with gcloud. Run: gcloud auth login"
        exit 1
    fi

    # Check project
    if [[ -z "$GCP_PROJECT_ID" ]]; then
        log_error "GCP_PROJECT_ID not set. Check your environment file."
        exit 1
    fi

    # Set project
    gcloud config set project "$GCP_PROJECT_ID" --quiet

    log_success "Prerequisites OK"
}

# Build and push Docker image
build_and_push() {
    local service=$1
    local dockerfile_path=$2
    local context_path=$3

    if [[ "$SKIP_BUILD" == true ]]; then
        log_info "Skipping build for $service (--skip-build)"
        return
    fi

    log_step "Building $service..."

    local image_name="gcr.io/$GCP_PROJECT_ID/$service:latest"

    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY-RUN] Would build: $image_name"
        return
    fi

    docker build -t "$image_name" -f "$dockerfile_path" "$context_path"
    docker push "$image_name"

    log_success "Built and pushed $service"
}

# Deploy to Cloud Run
deploy_service() {
    local service=$1
    local env_vars=$2
    local suffix=$(get_env_suffix)
    local full_name="${service}${suffix}"

    log_step "Deploying $full_name to Cloud Run..."

    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY-RUN] Would deploy: $full_name"
        log_info "[DRY-RUN] Environment variables: $env_vars"
        return
    fi

    gcloud run deploy "$full_name" \
        --image "gcr.io/$GCP_PROJECT_ID/$service:latest" \
        --region "$GCP_REGION" \
        --platform managed \
        --allow-unauthenticated \
        --port 8080 \
        --set-env-vars "$env_vars"

    local url=$(gcloud run services describe "$full_name" \
        --region "$GCP_REGION" \
        --format='value(status.url)')

    log_success "Deployed $full_name: $url"
    echo "$url"
}

# Deploy Auth Service
deploy_auth() {
    local suffix=$(get_env_suffix)
    local frontend_url="https://expense-tracker${suffix}-${GCP_PROJECT_NUMBER:-unknown}.${GCP_REGION}.run.app"
    local callback_url="https://auth-service${suffix}-${GCP_PROJECT_NUMBER:-unknown}.${GCP_REGION}.run.app/auth/google/callback"

    build_and_push "auth-service" \
        "$PROJECT_ROOT/app/services/auth-service/Dockerfile" \
        "$PROJECT_ROOT/app/services/auth-service"

    # Note: PORT is automatically set by Cloud Run, don't include it
    local env_vars="NODE_ENV=${NODE_ENV:-production}"
    env_vars+=",DATABASE_TYPE=${DATABASE_TYPE:-firestore}"
    env_vars+=",FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID:-$GCP_PROJECT_ID}"
    env_vars+=",JWT_SECRET=${JWT_SECRET}"
    env_vars+=",GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}"
    env_vars+=",GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}"
    env_vars+=",FRONTEND_URL=${frontend_url}"
    env_vars+=",GOOGLE_CALLBACK_URL=${callback_url}"

    deploy_service "auth-service" "$env_vars"
}

# Deploy API Service
deploy_api() {
    local suffix=$(get_env_suffix)

    # Get Auth Service URL
    local auth_url
    if [[ "$DRY_RUN" == true ]]; then
        auth_url="https://auth-service${suffix}-xxx.${GCP_REGION}.run.app"
    else
        auth_url=$(gcloud run services describe "auth-service${suffix}" \
            --region "$GCP_REGION" \
            --format='value(status.url)' 2>/dev/null || echo "")
    fi

    if [[ -z "$auth_url" ]]; then
        log_warn "Auth service URL not found. Deploy auth-service first."
        auth_url="https://auth-service${suffix}-${GCP_PROJECT_NUMBER:-unknown}.${GCP_REGION}.run.app"
    fi

    build_and_push "api-service" \
        "$PROJECT_ROOT/app/services/api-service/Dockerfile" \
        "$PROJECT_ROOT/app/services/api-service"

    # Note: PORT is automatically set by Cloud Run, don't include it
    local env_vars="NODE_ENV=${NODE_ENV:-production}"
    env_vars+=",DATABASE_TYPE=${DATABASE_TYPE:-firestore}"
    env_vars+=",FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID:-$GCP_PROJECT_ID}"
    env_vars+=",AUTH_SERVICE_URL=${auth_url}"

    deploy_service "api-service" "$env_vars"
}

# Deploy Frontend
deploy_frontend() {
    local suffix=$(get_env_suffix)

    # Get service URLs
    local auth_url api_url
    if [[ "$DRY_RUN" == true ]]; then
        auth_url="https://auth-service${suffix}-xxx.${GCP_REGION}.run.app"
        api_url="https://api-service${suffix}-xxx.${GCP_REGION}.run.app"
    else
        auth_url=$(gcloud run services describe "auth-service${suffix}" \
            --region "$GCP_REGION" \
            --format='value(status.url)' 2>/dev/null || echo "")
        api_url=$(gcloud run services describe "api-service${suffix}" \
            --region "$GCP_REGION" \
            --format='value(status.url)' 2>/dev/null || echo "")
    fi

    build_and_push "expense-tracker" \
        "$PROJECT_ROOT/app/frontend/Dockerfile" \
        "$PROJECT_ROOT/app/frontend"

    local env_vars="VITE_AUTH_SERVICE_URL=${auth_url}"
    env_vars+=",VITE_API_SERVICE_URL=${api_url}"
    env_vars+=",VITE_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}"

    deploy_service "expense-tracker" "$env_vars"
}

# Main deployment
main() {
    echo ""
    echo "=============================================="
    echo "  Cloud Run Deployment"
    echo "=============================================="
    echo "  Environment: $ENVIRONMENT"
    echo "  Service:     $SERVICE"
    echo "  Dry Run:     $DRY_RUN"
    echo "=============================================="
    echo ""

    load_env
    check_prerequisites

    case $SERVICE in
        auth)
            deploy_auth
            ;;
        api)
            deploy_api
            ;;
        frontend)
            deploy_frontend
            ;;
        all)
            log_info "Deploying all services..."
            deploy_auth
            deploy_api
            deploy_frontend
            ;;
        *)
            log_error "Unknown service: $SERVICE"
            exit 1
            ;;
    esac

    echo ""
    log_success "Deployment complete!"

    if [[ "$DRY_RUN" == false ]]; then
        local suffix=$(get_env_suffix)
        echo ""
        log_info "Deployed Service URLs:"
        gcloud run services list --filter="metadata.name~${suffix}$" \
            --format="table(metadata.name,status.url)" \
            --region="$GCP_REGION" 2>/dev/null || true
    fi
}

main
