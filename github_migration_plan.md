# GitHub Repository Migration Plan

## Objective

Migrate personal repository to GitHub Organization while preserving all content including issues, actions, and workflows.

## Pre-Migration Checklist

- [ ] Create GitHub Personal Access Token (PAT) with `repo` scope
- [ ] Note current repository URL
- [ ] Note target organization name
- [ ] Have organization admin access
- [ ] Verify all collaborators are added to organization

## Information to Provide Claude Code

```
Current Repository Details:
- Owner: [your-github-username]
- Repo Name: [repo-name]
- Full URL: https://github.com/[owner]/[repo-name]

Target Organization:
- Organization Name: [org-name]

GitHub PAT:
- Token: [your-personal-access-token]
```

## Migration Steps

1. **Export Issues** - Download all issues with metadata (labels, comments, assignees)
2. **Clone Repository** - Create mirror in organization
3. **Recreate Issues** - Import issues to new org repository
4. **Verify Workflows** - Check that GitHub Actions transferred correctly
5. **Verify Dashboard** - Confirm project boards/dashboards are accessible
6. **Test Access** - Verify permissions and team access work as expected

## Post-Migration Verification

- [ ] All issues present in new repo
- [ ] All issue comments and metadata intact
- [ ] Workflows/Actions running properly
- [ ] Git history complete
- [ ] Collaborators have correct permissions
- [ ] Teams configured properly

## Rollback Plan

- Keep original repo as backup until confirmed working
- Local clone of full repo available: [location if backed up]
- Issues export backup: [location if saved]

## Notes

Add any specific concerns or requirements here as you prepare.
