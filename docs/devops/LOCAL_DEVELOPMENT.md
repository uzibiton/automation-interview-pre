# Local Development Guide

This guide covers setting up and running the project locally.

## Prerequisites

- Docker Desktop installed and running
- Node.js 18+ (for running services outside Docker)
- Git

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd automation-interview-pre

# Start all services
./scripts/dev.sh start

# View logs
./scripts/dev.sh logs
```

## Service URLs

After starting, services are available at:

| Service      | URL                   | Description        |
| ------------ | --------------------- | ------------------ |
| Frontend     | http://localhost:3000 | React application  |
| Auth Service | http://localhost:3001 | Authentication API |
| API Service  | http://localhost:3002 | Main API           |
| Nginx Proxy  | http://localhost:80   | Unified gateway    |
| PostgreSQL   | localhost:5432        | Database           |

## Development Script

The `scripts/dev.sh` script simplifies local development:

### Commands

```bash
# Start all services
./scripts/dev.sh start

# Stop all services
./scripts/dev.sh stop

# Restart services
./scripts/dev.sh restart

# View logs (real-time)
./scripts/dev.sh logs

# Check status
./scripts/dev.sh status

# Clean up (remove containers and volumes)
./scripts/dev.sh clean
```

### Options

```bash
# Start specific service
./scripts/dev.sh start --service api      # API + PostgreSQL
./scripts/dev.sh start --service auth     # Auth + PostgreSQL
./scripts/dev.sh start --service frontend # Frontend only
./scripts/dev.sh start --service backend  # Auth + API + PostgreSQL

# Force rebuild containers
./scripts/dev.sh start --build

# Skip database
./scripts/dev.sh start --no-db
```

## Running Services Individually

### Frontend Only

```bash
cd app/frontend
npm install
npm run dev
```

The frontend runs on http://localhost:5173 with Vite dev server.

### API Service Only

```bash
# Start PostgreSQL first
docker compose up -d postgres

# Run API service
cd app/services/api-service
npm install
npm run start:dev
```

### Auth Service Only

```bash
# Start PostgreSQL first
docker compose up -d postgres

# Run Auth service
cd app/services/auth-service
npm install
npm run start:dev
```

## Environment Configuration

### Using Mock API

For frontend-only development without backend:

```bash
# In app/frontend/.env.development
VITE_USE_MOCK_API=true
```

### Connecting to Real Backend

```bash
# In app/frontend/.env.development
VITE_USE_MOCK_API=false
VITE_AUTH_SERVICE_URL=http://localhost:3001
VITE_API_SERVICE_URL=http://localhost:3002
```

## Database

### PostgreSQL Access

```bash
# Connect via psql
docker exec -it test-postgres psql -U testuser -d testdb

# View tables
\dt

# Exit
\q
```

### Database Credentials (local)

```
Host: localhost
Port: 5432
Database: testdb
User: testuser
Password: testpass
```

## Common Tasks

### Reset Database

```bash
./scripts/dev.sh clean
./scripts/dev.sh start
```

### Rebuild Single Service

```bash
docker compose build api-service
docker compose up -d api-service
```

### View Specific Service Logs

```bash
docker compose logs -f api-service
docker compose logs -f auth-service
docker compose logs -f frontend
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or use different port
```

### Container Won't Start

```bash
# Check logs
docker compose logs <service-name>

# Rebuild
docker compose build --no-cache <service-name>
docker compose up -d <service-name>
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
docker compose ps postgres

# Check health
docker compose logs postgres

# Restart PostgreSQL
docker compose restart postgres
```

### Frontend Not Updating

```bash
# Clear Vite cache
cd app/frontend
rm -rf node_modules/.vite
npm run dev
```
