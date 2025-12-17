# Setup Instructions

## System Requirements

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose
- Git

## Step-by-Step Setup

### 1. Clone and Navigate

```bash
cd /c/data/code/automation-interview-pre
```

### 2. Configure Google OAuth (Optional)

#### Create Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `skillful-eon-477917-b7` (or create new)
3. Enable Firebase and Firestore if using database features
4. Go to "Credentials" -> "Create Credentials" -> "OAuth client ID"
5. Application type: **Web application**
6. Add **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `http://localhost:5173`
7. Add **Authorized redirect URIs**:
   - `http://localhost:3001/auth/google/callback`
   - For deployed environments, add:
     - `https://auth-service-staging-{project-id}.{region}.run.app/auth/google/callback`
     - `https://auth-service-{project-id}.{region}.run.app/auth/google/callback`
8. Copy Client ID and Client Secret

#### Update .env file:

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Build and Start Services

#### First time setup:

```bash
docker-compose up --build
```

#### Subsequent runs:

```bash
docker-compose up
```

#### Run in background:

```bash
docker-compose up -d
```

### 4. Verify Services

Check all containers are running:

```bash
docker-compose ps
```

Expected output:

```
NAME                IMAGE                       STATUS
test-postgres       postgres:15-alpine          Up
auth-service        auth-service                Up
api-service         api-service                 Up
react-frontend      frontend                    Up
nginx-gateway       nginx:alpine                Up
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Auth Service: http://localhost:3001
- API Service: http://localhost:3002
- Nginx Gateway: http://localhost

### 6. Test Without Google OAuth

If you don't have Google OAuth configured yet, you can still test:

1. Get test user token from database:

```bash
docker exec -it test-postgres psql -U testuser -d testdb
```

2. In psql:

```sql
SELECT * FROM users;
```

3. Create a JWT token manually for testing (for development only)

## Useful Commands

### View logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth-service
docker-compose logs -f api-service
docker-compose logs -f frontend
```

### Stop services:

```bash
docker-compose down
```

### Stop and remove volumes (clean database):

```bash
docker-compose down -v
```

### Rebuild specific service:

```bash
docker-compose up --build auth-service
```

### Connect to PostgreSQL:

```bash
docker exec -it test-postgres psql -U testuser -d testdb
```

### Common SQL Queries:

```sql
-- View all users
SELECT * FROM users;

-- View all tasks
SELECT * FROM tasks;

-- View tasks with user info
SELECT t.*, u.email, u.name
FROM tasks t
JOIN users u ON t.user_id = u.id;

-- Count tasks by status
SELECT status, COUNT(*)
FROM tasks
GROUP BY status;
```

## Troubleshooting

### Port already in use:

```bash
# Find what's using the port (example for 3000)
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### Database connection errors:

```bash
# Reset database
docker-compose down -v
docker-compose up --build
```

### Container build errors:

```bash
# Clean docker cache
docker system prune -a
docker-compose build --no-cache
```

### View container errors:

```bash
docker-compose logs <service-name>
```

## Development Workflow

### Making changes to services:

1. **Backend changes** (auth-service or api-service):
   - Edit files in `services/auth-service/src/` or `services/api-service/src/`
   - Restart container: `docker-compose restart auth-service`

2. **Frontend changes**:
   - Edit files in `frontend/src/`
   - Changes auto-reload (React hot reload)

3. **Database changes**:
   - Edit `database/init.sql`
   - Reset database: `docker-compose down -v && docker-compose up`

## Next Steps

Once the system is running, you can:

1. Create automation tests (Playwright, Selenium)
2. Write API tests (Python/pytest, Postman)
3. Practice SQL queries
4. Set up CI/CD pipelines
5. Add monitoring and logging
