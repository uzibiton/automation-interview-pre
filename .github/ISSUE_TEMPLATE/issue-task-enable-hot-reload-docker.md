---
name: 🔧 Task - Enable Hot Reload for Frontend Docker Development
about: Configure Docker volumes to enable hot reload without rebuilding
title: '[TASK] Enable Hot Reload for Frontend in Docker'
labels: 'task, docker, dev-experience, frontend'
assignees: ''
---

## 📋 Task Description

Enable hot reload for frontend development in Docker so code changes are reflected immediately without requiring container rebuild.

## 🎯 Goal

Improve developer experience by eliminating the need to rebuild Docker containers when frontend code changes.

## ✅ Current Behavior

- Frontend runs in Docker with `Dockerfile.dev`
- Code changes require `docker-compose build --no-cache frontend` to take effect
- Slow feedback loop (2-3 minutes per change)

## 🚀 Expected Behavior

- Code changes in `app/frontend/src/` reflect immediately in browser
- Vite's hot module replacement (HMR) works inside Docker
- No rebuild needed for code changes
- Only rebuild when dependencies change

## 📝 Implementation Steps

### 1. Update docker-compose.yml

Add volume mounts for frontend service:

```yaml
frontend:
  build:
    context: ./app/frontend
    dockerfile: Dockerfile.dev
  container_name: react-frontend
  ports:
    - '3000:3000'
  environment:
    - VITE_AUTH_SERVICE_URL=http://localhost:3001
    - VITE_API_SERVICE_URL=http://localhost:3002
    - VITE_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
  # Add these volumes for hot reload
  volumes:
    - ./app/frontend/src:/app/src
    - ./app/frontend/public:/app/public
    - ./app/frontend/index.html:/app/index.html
    - ./app/frontend/vite.config.ts:/app/vite.config.ts
    - ./app/frontend/tsconfig.json:/app/tsconfig.json
    # Exclude node_modules (use container's version)
    - /app/node_modules
  depends_on:
    - auth-service
    - api-service
  networks:
    - app-network
  stdin_open: true
  tty: true
```

### 2. Verify Vite Configuration

Ensure `vite.config.ts` has proper HMR settings:

```typescript
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true, // Important for Docker on Windows/Mac
    },
    hmr: {
      clientPort: 3000,
    },
  },
  // ... rest of config
});
```

### 3. Update Dockerfile.dev (if needed)

Ensure dev Dockerfile doesn't build unnecessarily:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# Don't copy src in build - let volume mount handle it
# COPY . .  <- Remove this for dev

CMD ["npm", "run", "dev"]
```

### 4. Testing Steps

1. Stop and remove containers:
   ```bash
   docker-compose down
   ```

2. Rebuild once with new configuration:
   ```bash
   docker-compose up -d --build frontend
   ```

3. Test hot reload:
   - Make a change to any `.tsx` file in `app/frontend/src/`
   - Save the file
   - Browser should auto-refresh within 1-2 seconds
   - No rebuild needed

4. Verify logs show HMR working:
   ```bash
   docker logs -f react-frontend
   ```
   Should see: `[vite] hot updated: /src/...`

## 🔍 Edge Cases to Handle

1. **New dependencies added** → Still requires rebuild:
   ```bash
   docker-compose build frontend
   ```

2. **Config file changes** (tsconfig, vite.config) → Restart container:
   ```bash
   docker-compose restart frontend
   ```

3. **Windows file watching issues** → Use polling (already in config)

4. **Port conflicts** → Ensure HMR clientPort matches exposed port

## ✅ Acceptance Criteria

- [ ] Volume mounts configured in docker-compose.yml
- [ ] Vite config has `usePolling: true` for cross-platform support
- [ ] Code changes in `.tsx` files reflect in browser within 2 seconds
- [ ] No rebuild needed for code changes
- [ ] node_modules excluded from volume mount
- [ ] Documentation updated in `RUN-LOCALLY.md` or `doc/RUN_LOCALLY.md`
- [ ] Tested on Windows (if applicable)

## 📚 Documentation Updates

Add to development docs:

```markdown
## Hot Reload Development

Frontend supports hot reload - changes to source files are reflected immediately:

**No rebuild needed for:**
- Component changes (`.tsx`, `.ts`)
- Style changes (`.css`)
- Asset changes (images, icons)

**Rebuild required for:**
- Dependency changes (`package.json`)
- Config changes (`vite.config.ts`, `tsconfig.json`)

Command: `docker-compose build frontend`
```

## 🎓 Benefits

- **Faster feedback loop**: 2 seconds vs 3 minutes
- **Better DX**: Same experience as native development
- **Less frustration**: No waiting for rebuilds during active development
- **More productive**: Developers can iterate quickly

## 📎 Related Issues

- Original PR where this issue was discovered
- Any Docker optimization tasks

## 🏷️ Labels

`task`, `docker`, `dev-experience`, `frontend`, `hot-reload`, `developer-productivity`

---

**Effort Estimate**: 30-45 minutes
**Priority**: High (improves developer experience significantly)
**Complexity**: Low (configuration change only)
