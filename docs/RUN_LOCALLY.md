# Running Locally Without Docker

## 🚀 Quick Start (3 Steps)

### Step 1: Start PostgreSQL Database
```bash
npm run db:start
```
This starts only the PostgreSQL container (takes 5 seconds).

### Step 2: Run All Services
```bash
npm run dev
```
This starts all 3 services in one terminal with colored output!

### Step 3: Open Application
- **Frontend**: http://localhost:3000
- **Auth API**: http://localhost:3001
- **API Service**: http://localhost:3002

---

## 📋 Alternative: Run Services Separately

If you prefer separate terminals:

```bash
# Terminal 1 - Database
npm run db:start

# Terminal 2 - Auth Service
npm run dev:auth

# Terminal 3 - API Service  
npm run dev:api

# Terminal 4 - Frontend (Vite)
npm run dev:frontend
```

---

## ⚙️ Environment Variables

All services use the **single `.env` file in the root folder**:
- ✅ No need for separate `.env` files in each service
- ✅ All variables are loaded automatically
- ✅ Easy to manage in one place

**Important variables:**
```bash
DATABASE_URL=postgresql://testuser:testpass@localhost:5432/testdb
JWT_SECRET=your-jwt-secret-change-in-production
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-secret
```

---

## 🔧 Available Commands

### Development
```bash
npm run dev              # Run all services together (recommended)
npm run dev:auth         # Run only auth service
npm run dev:api          # Run only API service
npm run dev:frontend     # Run only frontend (Vite)
```

### Database
```bash
npm run db:start         # Start PostgreSQL container
npm run db:stop          # Stop PostgreSQL container
npm run db:reset         # Reset database (deletes all data!)
```

### Build
```bash
npm run build:all        # Build all services
```

### Cleanup
```bash
npm run clean            # Remove node_modules and build folders
npm run clean:modules    # Remove only node_modules
npm run clean:build      # Remove only dist/build folders
```

### Docker (if needed)
```bash
npm run docker:up        # Start everything with Docker
npm run docker:down      # Stop Docker containers
npm run docker:clean     # Complete Docker cleanup
```

---

## ⚡ Why Local Development is Faster

| Method | Start Time | Hot Reload | Debugging |
|--------|-----------|------------|-----------|
| **Docker** | 5-10 min | Slow | Limited |
| **Local** | 10 sec | Instant | Full IDE support |

---

## 🐛 Troubleshooting

### Database won't start
```bash
# Check if port 5432 is available
netstat -ano | findstr :5432

# Or use different port in .env:
DATABASE_URL=postgresql://testuser:testpass@localhost:5433/testdb
```

### Port already in use (3001, 3002, 3000)
```bash
# Find what's using the port
netstat -ano | findstr :3001

# Kill the process
taskkill /PID <PID> /F
```

### Module not found errors
```bash
# Reinstall dependencies
npm install
```

### Database connection errors
```bash
# Reset database
npm run db:reset

# Wait 10 seconds for DB to be ready, then restart services
npm run dev
```

---

## 📊 Service Status Check

### Check if services are running:
```bash
# Auth Service
curl http://localhost:3001/auth/verify

# API Service  
curl http://localhost:3002/tasks

# Frontend
curl http://localhost:3000
```

### View logs:
Each terminal shows colored output:
- 🔵 **AUTH** (blue) - Auth service logs
- 🟢 **API** (green) - API service logs
- 🟡 **FRONTEND** (yellow) - Frontend logs

---

## 💡 Tips

### Hot Reload is Instant!
- Save any TypeScript file → service restarts automatically
- Save any React file → Vite updates in <200ms

### Use VSCode Debugger
All services support breakpoints and debugging in VSCode!

### No Need to Rebuild
Changes are reflected immediately - no Docker rebuild needed!

---

## 🎯 Recommended Workflow

1. **Start database once** (in the morning)
   ```bash
   npm run db:start
   ```

2. **Run all services** (when coding)
   ```bash
   npm run dev
   ```

3. **Stop when done** (press Ctrl+C)

4. **Stop database** (at end of day)
   ```bash
   npm run db:stop
   ```

---

Enjoy fast local development! 🚀
