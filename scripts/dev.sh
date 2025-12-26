#!/bin/bash
# ============================================================================
# LOCAL DEVELOPMENT SCRIPT
# ============================================================================
# Usage: ./scripts/dev.sh [command] [options]
#
# Commands:
#   start       Start all services (default)
#   stop        Stop all services
#   restart     Restart all services
#   logs        View service logs
#   status      Show service status
#   clean       Remove containers and volumes
#
# Options:
#   --service   Run specific service (api|auth|frontend|all)
#   --no-db     Skip database container
#   --build     Force rebuild containers
#   --mock      Enable mock API for frontend
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default values
COMMAND="${1:-start}"
SERVICE="all"
NO_DB=false
BUILD=false
MOCK=false

# Parse arguments
shift || true
while [[ $# -gt 0 ]]; do
    case $1 in
        --service)
            SERVICE="$2"
            shift 2
            ;;
        --no-db)
            NO_DB=true
            shift
            ;;
        --build)
            BUILD=true
            shift
            ;;
        --mock)
            MOCK=true
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

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Load environment variables
load_env() {
    local env_file="$PROJECT_ROOT/environments/.env.local"
    if [[ -f "$env_file" ]]; then
        log_info "Loading environment from $env_file"
        set -a
        source "$env_file"
        set +a
    else
        log_warn "No .env.local found. Using defaults."
    fi
}

# Build Docker Compose command
get_compose_cmd() {
    local cmd="docker compose -f $PROJECT_ROOT/docker-compose.yml"

    if [[ "$BUILD" == true ]]; then
        cmd="$cmd --build"
    fi

    echo "$cmd"
}

# Get services to run
get_services() {
    case $SERVICE in
        api)
            echo "postgres api-service"
            ;;
        auth)
            echo "postgres auth-service"
            ;;
        frontend)
            echo "frontend"
            ;;
        backend)
            echo "postgres auth-service api-service"
            ;;
        all)
            if [[ "$NO_DB" == true ]]; then
                echo "auth-service api-service frontend nginx"
            else
                echo "postgres auth-service api-service frontend nginx"
            fi
            ;;
        *)
            log_error "Unknown service: $SERVICE"
            exit 1
            ;;
    esac
}

# Start services
cmd_start() {
    check_docker
    load_env

    log_info "Starting services: $(get_services)"

    local compose_cmd=$(get_compose_cmd)
    local services=$(get_services)

    if [[ "$BUILD" == true ]]; then
        $compose_cmd build $services
    fi

    $compose_cmd up -d $services

    log_success "Services started!"
    echo ""
    log_info "Service URLs:"
    echo "  Frontend:     http://localhost:3000"
    echo "  Auth Service: http://localhost:3001"
    echo "  API Service:  http://localhost:3002"
    echo "  Nginx Proxy:  http://localhost:80"
    echo ""
    log_info "Use './scripts/dev.sh logs' to view logs"
}

# Stop services
cmd_stop() {
    check_docker
    log_info "Stopping services..."
    docker compose -f "$PROJECT_ROOT/docker-compose.yml" stop
    log_success "Services stopped!"
}

# Restart services
cmd_restart() {
    cmd_stop
    cmd_start
}

# View logs
cmd_logs() {
    check_docker
    local services=$(get_services)
    docker compose -f "$PROJECT_ROOT/docker-compose.yml" logs -f $services
}

# Show status
cmd_status() {
    check_docker
    docker compose -f "$PROJECT_ROOT/docker-compose.yml" ps
}

# Clean up
cmd_clean() {
    check_docker
    log_warn "This will remove all containers, networks, and volumes."
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker compose -f "$PROJECT_ROOT/docker-compose.yml" down -v --remove-orphans
        log_success "Cleanup complete!"
    else
        log_info "Cleanup cancelled."
    fi
}

# Main command dispatch
case $COMMAND in
    start)
        cmd_start
        ;;
    stop)
        cmd_stop
        ;;
    restart)
        cmd_restart
        ;;
    logs)
        cmd_logs
        ;;
    status)
        cmd_status
        ;;
    clean)
        cmd_clean
        ;;
    *)
        log_error "Unknown command: $COMMAND"
        echo "Usage: $0 {start|stop|restart|logs|status|clean} [options]"
        exit 1
        ;;
esac
