# Branching and Deployment Strategy

## Overview

This project follows a **trunk-based development** model with progressive deployment across environments.

## Branch Strategy

### Main Branch

- **Single source of truth**: `main`
- Deployed to all environments: dev, staging, and production
- All feature work merges here after PR approval

### Feature Branches

- Created from `main` for each task/feature
- Deployed to PR-specific preview environments for isolated testing
- Merged back to `main` after code review and approval
- Deleted after merge

## Deployment Flow

```
Feature Branch → PR Environment (isolated testing)
       ↓
   Merge to main (after PR approval)
       ↓
   Deploy to dev (automatic)
       ↓
   Deploy to staging (manual, after dev validation)
       ↓
   Deploy to prod (manual, after staging approval)
```

## Environment Progression

### 1. PR Environment

- **Trigger**: Push to feature branch
- **Purpose**: Isolated testing of new features
- **Testing**: Unit tests, integration tests, manual QA
- **Approval**: Code review required

### 2. Dev Environment

- **Trigger**: Merge to `main` (automatic)
- **Purpose**: Integration testing with latest changes
- **Testing**: Full test suite, smoke tests
- **Data**: Test data

### 3. Staging Environment

- **Trigger**: Manual deployment from `main`
- **Purpose**: Pre-production validation
- **Testing**: Full regression, performance testing
- **Data**: Production-like data
- **Approval**: QA sign-off required

### 4. Production Environment

- **Trigger**: Manual deployment from `main`
- **Purpose**: Live production system
- **Testing**: Smoke tests, monitoring
- **Data**: Real production data
- **Approval**: Release manager sign-off required

## Key Principles

✅ **Same commit progresses through environments** - No cherry-picking or branch-specific deploys  
✅ **No environment-specific branches** - Configuration via environment variables  
✅ **Progressive validation** - Each environment adds confidence  
✅ **Fast feedback** - PR environments catch issues early  
✅ **Manual gates** - Human approval for staging/prod

## Hotfix Process

For critical production issues:

1. Create hotfix branch from `main`
2. Deploy to PR environment for testing
3. Merge to `main` after approval
4. Deploy through normal flow: dev → staging → prod
5. For urgent fixes, fast-track through environments with reduced testing

## Why Not Environment Branches?

**Avoid** having separate `dev`, `staging`, `prod` branches because:

❌ Creates merge conflicts and branch drift  
❌ Difficult to track what code is where  
❌ Risk of hotfixes being applied incorrectly  
❌ Complexity in maintaining multiple long-lived branches  
❌ Can't guarantee the same code runs everywhere

## Tagging Strategy

Use tags to mark deployments:

- `dev-YYYY-MM-DD-HHmm` - Dev deployments (optional)
- `staging-v1.2.3` - Staging deployments
- `prod-v1.2.3` - Production releases

## Configuration Management

Environment-specific configuration handled via:

- Environment variables (not code branches)
- Cloud Run environment variables
- Secret Manager for sensitive data
- Build-time configuration generation

## See Also

- [CI/CD Guide](CI_CD_GUIDE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Cloud Run Management](CLOUD_RUN_MANAGEMENT.md)
