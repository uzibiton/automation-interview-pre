# 🚀 Quick Start Instructions

## Prerequisites Check ✅

Before starting, make sure you have:

- [ ] Docker Desktop installed and running
- [ ] Git installed
- [ ] At least 4GB free RAM
- [ ] Ports 80, 3000, 3001, 3002, 5432 available

## Installation Steps

### Step 1: Create Environment File

```bash
# Copy the example environment file
cp .env.example .env
```

**Note:** The app will work without Google OAuth configured. You can set it up later.

### Step 2: Start the Application

```bash
# Build and start all services (first time)
docker-compose up --build
```

This will:

- Build 3 Docker images (auth-service, api-service, frontend)
- Download PostgreSQL and Nginx images
- Create network and volumes
- Start all 5 containers

**Expected time:** 5-10 minutes for first build

### Step 3: Wait for Services to Start

Watch the logs until you see:

```
✅ postgres      | database system is ready to accept connections
✅ auth-service  | 🔐 Auth Service running on port 3001
✅ api-service   | 🚀 API Service running on port 3002
✅ frontend      | webpack compiled successfully
✅ nginx         | start worker processes
```

### Step 4: Access the Application

Open your browser:

- **Main App**: http://localhost:3000
- **Auth API**: http://localhost:3001
- **Tasks API**: http://localhost:3002

## ⚠️ Common Issues & Fixes

### Issue 1: "Port already in use"

```bash
# Check what's using the port (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002

# Kill the process
taskkill /PID <PID_NUMBER> /F

# Or change ports in docker-compose.yml
```

### Issue 2: "docker-compose: command not found"

```bash
# Use docker compose (without hyphen) for newer Docker versions
docker compose up --build
```

### Issue 3: Build fails with "no space left on device"

```bash
# Clean Docker cache
docker system prune -a
docker volume prune

# Then rebuild
docker-compose up --build
```

### Issue 4: Container exits immediately

```bash
# Check logs for specific service
docker-compose logs auth-service
docker-compose logs api-service
docker-compose logs frontend

# Common fix: Remove volumes and rebuild
docker-compose down -v
docker-compose up --build
```

### Issue 5: "Cannot connect to database"

```bash
# Make sure PostgreSQL is ready
docker-compose logs postgres

# Wait 30 seconds after postgres starts, then restart services
docker-compose restart auth-service api-service
```

## 🎯 Quick Commands Reference

```bash
# Start services (after first build)
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f auth-service

# Restart a service
docker-compose restart auth-service

# Rebuild a specific service
docker-compose up --build auth-service

# Check running containers
docker-compose ps

# Access database
docker exec -it test-postgres psql -U testuser -d testdb
```

## 📊 Testing the Application

### 1. Database Check

```bash
# Connect to database
docker exec -it test-postgres psql -U testuser -d testdb

# Run queries
SELECT * FROM users;
SELECT * FROM tasks;
\q  # Exit
```

### 2. API Testing (without authentication)

Test health/public endpoints:

```bash
# Check if services are running
curl http://localhost:3001
curl http://localhost:3002
```

### 3. Frontend Testing

1. Go to http://localhost:3000
2. You should see the login page
3. Click "Sign in with Google" (needs OAuth setup)

## 🔧 Google OAuth Setup (Optional)

### Create OAuth Credentials:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create/Select Project**
   - Click "Select a project" → "New Project"
   - Name it: "Task Manager Interview"

3. **Enable Google+ API**
   - Navigate to "APIs & Services" → "Library"
   - Search "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Configure consent screen if prompted
   - Application type: "Web application"
   - Name: "Task Manager"

5. **Add Authorized Redirect URIs**

   ```
   http://localhost:3001/auth/google/callback
   ```

6. **Copy Credentials**
   - Copy "Client ID"
   - Copy "Client Secret"

7. **Update .env file**

   ```bash
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

8. **Restart Services**
   ```bash
   docker-compose restart auth-service
   ```

## 🎓 What to Practice

Now that the system is running, practice:

### 1. API Testing

- Use Postman/Insomnia to test endpoints
- Write Python/pytest automation tests
- Practice with curl commands

### 2. UI Testing

- Write Playwright/Cypress tests
- Practice Selenium WebDriver
- Implement Page Object Model

### 3. Database Testing

- Write SQL queries
- Test data integrity
- Practice joins and aggregations

### 4. Docker/DevOps

- Understand docker-compose.yml
- Practice container management
- Learn Docker networking

### 5. Microservices

- Understand service communication
- Test inter-service calls
- Practice API gateway patterns

## 📁 Project Structure

```
automation-interview-pre/
├── docker-compose.yml          # Main orchestration file
├── .env                        # Environment variables (create this)
├── .env.example               # Environment template
├── README.md                  # Project overview
├── SETUP.md                   # Detailed setup guide
├── INSTRUCTIONS.md            # This file
├── database/
│   └── init.sql              # Database schema & seed data
├── nginx/
│   └── nginx.conf            # Reverse proxy config
├── services/
│   ├── auth-service/         # NestJS authentication service
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   └── api-service/          # NestJS business logic service
│       ├── Dockerfile
│       ├── package.json
│       └── src/
└── frontend/                 # React frontend
    ├── Dockerfile
    ├── package.json
    └── src/
```

## 🔍 Verify Installation

Run this checklist:

```bash
# 1. Check Docker is running
docker --version
docker-compose --version

# 2. Check containers are running
docker-compose ps

# 3. Check logs for errors
docker-compose logs | grep -i error

# 4. Test database connection
docker exec -it test-postgres psql -U testuser -d testdb -c "SELECT COUNT(*) FROM users;"

# 5. Test frontend
curl -I http://localhost:3000

# 6. Test auth service
curl -I http://localhost:3001

# 7. Test api service
curl -I http://localhost:3002
```

All should return successful responses!

## 🆘 Getting Help

If you encounter issues:

1. **Check logs first:**

   ```bash
   docker-compose logs
   ```

2. **Search for specific errors:**

   ```bash
   docker-compose logs | grep -i "error"
   ```

3. **Clean slate restart:**

   ```bash
   docker-compose down -v
   docker system prune -a
   docker-compose up --build
   ```

4. **Check Docker Desktop:**
   - Make sure it's running
   - Check available disk space
   - Check memory limits (Settings → Resources)

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ All 5 containers show "Up" in `docker-compose ps`
- ✅ http://localhost:3000 shows the login page
- ✅ No error messages in logs
- ✅ Database contains sample users and tasks
- ✅ All ports are accessible

## 📚 Next Steps

Once everything is running:

1. Explore the application UI
2. Test the API endpoints with Postman
3. Query the database
4. Start writing automation tests
5. Set up CI/CD pipelines

**Good luck with your interview preparation! 🚀**
