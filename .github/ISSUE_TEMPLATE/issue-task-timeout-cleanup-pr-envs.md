---
name: Add timeout-based cleanup for abandoned PR environments
about: Automatically delete PR environments after timeout period for abandoned PRs
title: 'TASK: Add timeout-based cleanup for abandoned PR environments'
labels: enhancement, ci-cd, infrastructure, cloud-run
assignees: ''

---

## Description
Add an automated cleanup mechanism that deletes PR environments after a specified timeout period (e.g., 7-30 days) for abandoned or stale pull requests. This prevents accumulating costs from forgotten PR environments while still allowing adequate time for testing and verification.

## Problem
- PR environments stay running indefinitely if PR is never closed
- Abandoned PRs waste cloud resources and incur costs
- No automatic cleanup for very old PR environments
- Forgotten test environments can accumulate over time
- Manual cleanup required for stale environments

## Current Behavior
- ✅ PR opens → Environment deployed
- ✅ PR closes → Environment cleaned up
- ❌ PR stays open for months → Environment runs forever

## Proposed Solution
Add a scheduled GitHub Action that:
1. Runs daily/weekly to check all PR environments
2. Identifies environments older than threshold (e.g., 30 days)
3. Checks if associated PR is still open
4. Optionally warns before deletion (e.g., comment on PR)
5. Deletes environments that exceed timeout
6. Posts cleanup summary

## Implementation Tasks

### Create Scheduled Cleanup Workflow
- [ ] Create `.github/workflows/cleanup-stale-pr-envs.yml`
- [ ] Add cron schedule (e.g., daily at 2 AM UTC)
- [ ] Add manual trigger option (workflow_dispatch)
- [ ] Configure timeout threshold as workflow variable (default: 30 days)

### Environment Discovery
- [ ] Query Cloud Run for all services matching PR pattern (`*-pr-*`)
- [ ] Extract PR number from service name
- [ ] Get service creation/update timestamp
- [ ] Calculate age of each environment

### PR Status Check
- [ ] Use GitHub API to check if PR is still open
- [ ] Check PR last activity date
- [ ] Identify PRs that are:
  - Still open but inactive for X days
  - Closed but environment not cleaned up (missed cleanup)
  - Draft PRs (optionally shorter timeout)

### Cleanup Logic
- [ ] Flag environments exceeding timeout threshold
- [ ] Optional: Post warning comment on PR (e.g., "Environment will be deleted in 7 days")
- [ ] Wait for grace period if warning enabled
- [ ] Delete flagged environments
- [ ] Log cleanup actions

### Notification System
- [ ] Comment on PR before deletion (warning)
- [ ] Comment on PR after deletion (confirmation)
- [ ] Post summary to Slack/Discord (optional)
- [ ] Create GitHub Issue with cleanup report (optional)

### Configuration Options
- [ ] Add workflow inputs:
  - `timeout_days` - Days before cleanup (default: 30)
  - `warning_days` - Warning period before deletion (default: 7)
  - `dry_run` - Show what would be deleted without deleting
  - `exclude_prs` - Comma-separated PR numbers to skip
- [ ] Add labels to skip cleanup:
  - `keep-pr-env` - Never auto-cleanup
  - `pr-env-extended` - Longer timeout (e.g., 60 days)

### Safety Measures
- [ ] Require explicit confirmation for deletion
- [ ] Add dry-run mode by default (manual approval needed)
- [ ] Never delete production/staging environments
- [ ] Preserve environments with specific labels
- [ ] Log all cleanup actions to audit trail

## Workflow Structure

### Sample Workflow
```yaml
name: Cleanup Stale PR Environments

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:
    inputs:
      timeout_days:
        description: 'Days before cleanup'
        required: false
        default: '30'
      dry_run:
        description: 'Dry run (no deletion)'
        required: false
        default: 'true'

jobs:
  cleanup-stale-environments:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Authenticate to GCP
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2
      
      - name: Find stale PR environments
        id: find-stale
        run: |
          # Script to find environments older than threshold
          # Check PR status via GitHub API
          # Flag stale environments
      
      - name: Warn on PRs (optional)
        if: steps.find-stale.outputs.has_stale == 'true'
        run: |
          # Post warning comments on PRs
      
      - name: Delete stale environments
        if: github.event.inputs.dry_run != 'true'
        run: |
          # Delete flagged environments
          # Post confirmation comments
      
      - name: Summary report
        run: |
          # Generate cleanup summary
          # Post to GitHub Actions summary
```

### Cleanup Script Logic
```bash
#!/bin/bash
TIMEOUT_DAYS=${1:-30}
REGION="us-central1"
THRESHOLD_DATE=$(date -d "$TIMEOUT_DAYS days ago" +%s)

# List all PR services
gcloud run services list --region=$REGION --format="value(name,metadata.creationTimestamp)" | \
  grep -E '.*-pr-[0-9]+' | \
  while read service_name created_at; do
    PR_NUM=$(echo $service_name | grep -oP 'pr-\K[0-9]+')
    CREATED_TS=$(date -d "$created_at" +%s)
    
    if [ $CREATED_TS -lt $THRESHOLD_DATE ]; then
      # Check if PR is still open via gh CLI
      PR_STATE=$(gh pr view $PR_NUM --json state --jq .state 2>/dev/null || echo "closed")
      
      if [ "$PR_STATE" == "OPEN" ]; then
        echo "Stale environment: $service_name (PR #$PR_NUM, age: $((($CREATED_TS - THRESHOLD_DATE) / 86400)) days)"
        # Add to cleanup list
      fi
    fi
  done
```

## Benefits
- ✅ Automatic cleanup of forgotten PR environments
- ✅ Cost savings from removing stale resources
- ✅ Maintains clean cloud infrastructure
- ✅ Configurable timeout thresholds
- ✅ Safety warnings before deletion
- ✅ Preserves environments that need extended testing
- ✅ Audit trail of all cleanup actions

## Acceptance Criteria
- [ ] Scheduled workflow runs daily/weekly
- [ ] Correctly identifies PR environments older than threshold
- [ ] Checks PR status via GitHub API
- [ ] Posts warning comment on PR before deletion
- [ ] Respects grace period after warning
- [ ] Deletes environments after timeout
- [ ] Skips environments with `keep-pr-env` label
- [ ] Dry-run mode works correctly
- [ ] Manual trigger works with custom parameters
- [ ] Posts cleanup summary to workflow output
- [ ] Never deletes production/staging environments
- [ ] Handles errors gracefully (API failures, permission issues)

## Configuration Examples

### Conservative (Long Timeout)
- Timeout: 60 days
- Warning: 14 days before deletion
- Runs: Weekly

### Aggressive (Short Timeout)
- Timeout: 14 days
- Warning: 3 days before deletion
- Runs: Daily

### Default (Balanced)
- Timeout: 30 days
- Warning: 7 days before deletion
- Runs: Daily

## Technical Considerations
- Use GitHub API pagination for repos with many PRs
- Handle rate limits on GitHub API
- Consider timezone differences for date calculations
- Cache PR status to reduce API calls
- Handle concurrent workflow runs (mutex/lock)
- Preserve audit logs for compliance
- Test thoroughly with dry-run mode first

## Future Enhancements (Out of Scope)
- Cost tracking per PR environment
- Email notifications to PR author before cleanup
- Auto-extend timeout if PR has recent activity
- Integration with cost management tools
- Dashboard showing all PR environments and age

## References
- Current cleanup workflow: `.github/workflows/cleanup-pr.yml`
- Cloud Run services: All `*-pr-*` services
- GitHub API: https://docs.github.com/en/rest/pulls
- Google Cloud SDK: https://cloud.google.com/sdk/gcloud/reference/run/services
