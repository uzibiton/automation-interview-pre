# QA Automation Interview Preparation

## Test Application System
A full-stack microservices application built for automation testing practice.

### Architecture
- **Frontend**: React with TypeScript
- **Backend**: Two NestJS microservices
  - Auth Service (Port 3001) - Google OAuth authentication
  - API Service (Port 3002) - Task management API
- **Database**: PostgreSQL
- **Gateway**: Nginx reverse proxy
- **Containerization**: Docker & Docker Compose

### Quick Start

#### 1. Prerequisites
- Docker and Docker Compose installed
- Google OAuth credentials (optional, for authentication)

#### 2. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file with your Google OAuth credentials (or skip for now):
- Get credentials from: https://console.cloud.google.com/apis/credentials
- Authorized redirect URI: `http://localhost:3001/auth/google/callback`

#### 3. Start the System
```bash
docker-compose up --build
```

#### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **API Service**: http://localhost:3002
- **Nginx Gateway**: http://localhost
- **PostgreSQL**: localhost:5432

### API Endpoints for Testing

#### Auth Service (3001)
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/profile` - Get user profile (requires JWT)
- `GET /auth/verify` - Verify JWT token

#### API Service (3002)
- `GET /tasks` - Get all tasks (requires auth)
- `POST /tasks` - Create task (requires auth)
- `GET /tasks/:id` - Get single task (requires auth)
- `PUT /tasks/:id` - Update task (requires auth)
- `DELETE /tasks/:id` - Delete task (requires auth)
- `GET /tasks/stats` - Get task statistics (requires auth)

### Database Schema
```sql
-- Users table
users (id, email, name, google_id, avatar_url, created_at, updated_at)

-- Tasks table  
tasks (id, user_id, title, description, status, priority, due_date, created_at, updated_at)
```

### Technologies to Practice
- ✅ **TypeScript** - Both frontend and backend
- ✅ **Docker** - Containerization of all services
- ✅ **PostgreSQL** - Relational database with SQL queries
- ✅ **REST APIs** - Multiple endpoints for testing
- ✅ **Authentication** - Google OAuth & JWT
- ✅ **Microservices** - Service-to-service communication
- ✅ **Nginx** - Reverse proxy configuration

### Next Steps for Automation Testing
Now you can practice:
1. **Playwright/TypeScript** - UI automation tests
2. **Python/pytest** - API automation tests
3. **Cucumber/BDD** - Behavior-driven test scenarios
4. **GitHub Actions** - CI/CD pipeline setup
5. **SQL** - Database validation queries
6. **Docker** - Container management and testing
7. **Kubernetes** - Orchestration (advanced)

