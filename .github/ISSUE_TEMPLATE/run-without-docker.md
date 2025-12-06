---
name: Support running application without Docker
about: Enable local development without Docker dependency
title: 'TASK: Add support for running application locally without Docker'
labels: enhancement, developer-experience, documentation
assignees: ''

---

## Description
Add support for running the application locally without Docker for developers who prefer native development or face Docker limitations. This will improve developer experience and reduce setup friction for new contributors.

## Problem
- Docker is currently required to run the application locally
- Some developers prefer running services natively for faster iteration
- Docker can be resource-intensive on some machines
- New contributors may not be familiar with Docker
- Debugging can be easier with native processes

## Proposed Solution
Create comprehensive documentation and scripts to:
1. Run PostgreSQL locally (native installation or standalone container)
2. Run Auth Service (Node.js) natively
3. Run API Service (Node.js) natively
4. Run Frontend (Vite) natively
5. Configure environment variables for local development
6. Set up database with init scripts

## Implementation Tasks
- [ ] Document PostgreSQL local setup options
  - Native installation instructions (Windows/Mac/Linux)
  - Standalone Docker container option
  - Connection configuration
- [ ] Create `.env.local` template files for each service
- [ ] Document Auth Service setup
  - Install dependencies: `cd app/services/auth-service && npm install`
  - Environment variables configuration
  - Start command: `npm run dev`
- [ ] Document API Service setup
  - Install dependencies: `cd app/services/api-service && npm install`
  - Environment variables configuration
  - Start command: `npm run dev`
- [ ] Document Frontend setup
  - Install dependencies: `cd app/frontend && npm install`
  - Environment variables configuration
  - Start command: `npm run dev`
- [ ] Create setup scripts
  - `scripts/setup-local.sh` - One-time setup
  - `scripts/start-local.sh` - Start all services
  - `scripts/stop-local.sh` - Stop all services
- [ ] Update RUN-LOCALLY.md with native option
- [ ] Add troubleshooting section for common issues

## Benefits
- ✅ Lower barrier to entry for new contributors
- ✅ Faster development iteration (no container overhead)
- ✅ Easier debugging with native tools
- ✅ Flexibility for different development preferences
- ✅ Reduced resource usage on developer machines
- ✅ Works in environments with Docker restrictions

## Acceptance Criteria
- [ ] Complete documentation for running each service natively
- [ ] `.env.local` template files created for all services
- [ ] Database initialization scripts work with local PostgreSQL
- [ ] All services can start and communicate without Docker
- [ ] Setup scripts created and tested
- [ ] RUN-LOCALLY.md updated with both Docker and native options
- [ ] Troubleshooting guide added
- [ ] Tested on Windows, Mac, and Linux

## Technical Considerations
- Port configuration (ensure no conflicts)
- Service discovery (localhost URLs instead of Docker service names)
- Database connection strings (localhost:5432)
- CORS configuration for local development
- Environment variable differences between Docker and native

## References
- Current setup: `docker-compose.yml`
- Documentation: `RUN-LOCALLY.md`
- Services: `app/services/auth-service`, `app/services/api-service`, `app/frontend`
- Database: `app/database/init.sql`
