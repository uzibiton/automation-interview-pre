# Multi-Environment E2E Testing - Quick Reference

## Commands Cheat Sheet

### Local Development

```bash
npm run test:e2e:local           # Run all tests
npm run test:e2e:local:headed    # Run with browser visible
npm run test:e2e:local:debug     # Debug mode
```

### Docker

```bash
npm run test:e2e:docker          # Run all tests
npm run test:e2e:docker:headed   # Run with browser visible
npm run test:e2e:docker:debug    # Debug mode
```

### Staging

```bash
npm run test:e2e:staging         # Run all tests
npm run test:e2e:staging:headed  # Run with browser visible
npm run test:e2e:staging:smoke   # Run smoke tests only
npm run test:e2e:staging:debug   # Debug mode
```

### Production

```bash
npm run test:e2e:production         # Run all tests (use sparingly!)
npm run test:e2e:production:smoke   # Run smoke tests (recommended)
npm run test:e2e:production:headed  # Run with browser visible
npm run test:e2e:production:debug   # Debug mode
```

## Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Development Workflow                        │
└─────────────────────────────────────────────────────────────────┘

1. Write Code
   └─> npm run test:e2e:local:headed    (Fast local testing)

2. Pre-Push Validation
   └─> npm run test:e2e:local           (Headless validation)

3. Push to Branch
   └─> GitHub Actions runs unit tests
   └─> Docker build
   └─> Deploy to branch environment

4. Test Branch Deployment
   └─> Update .env.staging URLs
   └─> npm run test:e2e:staging:smoke

5. Merge to Main
   └─> GitHub Actions deploys to production
   └─> npm run test:e2e:production:smoke (Post-deploy validation)
```

## Environment Files

```
tests/config/
├── .env.local        # localhost:5173
├── .env.docker       # Docker service names
├── .env.staging      # Cloud Run staging URLs
└── .env.production   # Cloud Run production URLs
```

## Update Cloud Run URLs

After deployment, update environment files:

```bash
# Get Cloud Run URLs
gcloud run services list --platform=managed --region=us-central1

# Update .env.production
BASE_URL=https://frontend-xxx-uc.a.run.app
API_URL=https://api-service-xxx-uc.a.run.app
AUTH_URL=https://auth-service-xxx-uc.a.run.app
```

## Test Tags

```bash
# Run specific test types
TEST_ENV=staging playwright test --grep @smoke       # Critical path
TEST_ENV=production playwright test --grep @critical # Must-pass
TEST_ENV=local playwright test --grep @sanity       # Basic functionality
TEST_ENV=local playwright test --grep @regression   # Full suite
```

## Common Issues

| Issue                   | Solution                                   |
| ----------------------- | ------------------------------------------ |
| Tests timeout           | Increase timeout in playwright.config.ts   |
| 404 errors              | Update .env file with correct URLs         |
| Can't connect to Docker | Use `test:e2e:docker` not `test:e2e:local` |
| Tests fail in CI        | Check environment variables in GitHub      |

## Installation

```bash
cd tests/config
npm install
npx playwright install --with-deps
```

## Demo Commands (For Interview)

```bash
# Show environment switching
npm run test:e2e:local:headed          # Local testing
npm run test:e2e:production:smoke      # Production validation

# Show reports
npm run report:open                    # HTML report
```

## Senior Engineer Talking Points

1. **Architecture:** "Same tests, multiple targets - just swap environment config"
2. **Benefits:** "Shift-left testing saves 60% QA cycle time"
3. **Trade-offs:** "Maintenance overhead vs. unified test suite - worth it"
4. **Scale:** "Tests run in parallel across browsers and devices"
5. **CI/CD:** "Pre-deploy Docker tests + post-deploy smoke tests"
