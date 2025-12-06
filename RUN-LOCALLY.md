# Running Locally Without Docker

## Prerequisites

1. **PostgreSQL** must be running (via Docker):

   ```bash
   docker-compose up postgres -d
   ```

2. **Node.js** installed (v18 or later)

## 🚀 Quick Start - 3 PowerShell Windows

Open **3 separate PowerShell windows** and run:

### Terminal 1 - Auth Service

```powershell
cd C:\data\code\automation-interview-pre
.\start-auth.ps1
```

### Terminal 2 - API Service

```powershell
cd C:\data\code\automation-interview-pre
.\start-api.ps1
```

### Terminal 3 - Frontend

```powershell
cd C:\data\code\automation-interview-pre
.\start-frontend.ps1
```

## Alternative: Using Batch Files

You can also double-click these files or run in CMD:

- `start-auth.bat` - Start Auth Service
- `start-api.bat` - Start API Service
- `start-frontend.bat` - Start Frontend

## 🌐 Access the Application

Once all 3 services are running:

- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **API Service**: http://localhost:3002
- **PostgreSQL**: localhost:5432 (Docker container)

## 🛑 Stop Services

Press `Ctrl+C` in each terminal window to stop the services.

To stop PostgreSQL:

```bash
docker-compose down
```

## 🐛 Troubleshooting

### Error: "Cannot find module '@nestjs/cli'"

If you see this error, the npm workspace is interfering. Fix:

```powershell
# Go to the service directory
cd app\services\auth-service
# OR
cd app\services\api-service

# Reinstall without workspace
npm install --no-workspaces

# Then use the PowerShell scripts to start
```

### Port Already in Use

If you get "port already in use" errors:

```powershell
# Windows - kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <process_id> /F
```

### Database Connection Error

Make sure PostgreSQL is running:

```bash
docker ps
# Should show "test-postgres" container

# If not running:
docker-compose up postgres -d
```

### Services Crash Immediately

Check the logs in each terminal window. Common issues:

1. **Dependencies not installed**: Run the PowerShell scripts (they auto-install)
2. **Wrong Node version**: Need Node.js v18+
3. **PostgreSQL not running**: `docker-compose up postgres -d`
4. **.env file missing**: Each service needs a `.env` file (already created)

### Dependencies Not Installed

```bash
cd app/services/auth-service
npm install --no-workspaces

cd ../api-service
npm install --no-workspaces

cd ../../frontend
npm install
```
