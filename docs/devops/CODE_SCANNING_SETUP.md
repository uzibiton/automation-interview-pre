# GitHub Code Scanning Setup

## What is Code Scanning?

GitHub Code Scanning is a feature that automatically detects security vulnerabilities and coding errors in your code. When enabled, security scan results (SARIF files) are integrated directly into GitHub's Security tab.

## Current Status

⚠️ **Code Scanning is NOT currently enabled** for this repository.

The CI/CD pipeline will:

- ✅ Still run Snyk security scans
- ✅ Still generate SARIF files
- ✅ Still upload security reports as artifacts
- ❌ Cannot upload results to GitHub Security tab (requires Code Scanning)

## How to Enable

### Step 1: Enable Code Scanning

1. Go to your repository on GitHub
2. Click **Settings** → **Security** → **Code security and analysis**
3. Find **Code scanning** section
4. Click **Set up** → **Default**

### Step 2: Verify Setup

Once enabled, the workflow will automatically:

- Upload Snyk SARIF results to GitHub Security
- Show security alerts in Pull Requests
- Display vulnerabilities in the Security tab
- Track security trends over time

### Step 3: Configure Advanced Settings (Optional)

In Settings → Security → Code scanning:

- Set alert thresholds
- Configure notification preferences
- Add code owners for security reviews
- Enable dependency scanning integration

## Benefits of Enabling

With Code Scanning enabled:

✅ **Integrated Alerts**: Security issues appear directly in PRs
✅ **Security Dashboard**: Centralized view of all vulnerabilities
✅ **Alert Tracking**: Monitor when issues are introduced/fixed
✅ **Automated Reviews**: Block PRs with critical security issues
✅ **Compliance**: Better visibility for security audits

## Alternative: Artifact-Only Workflow

If you prefer not to enable Code Scanning:

- Security reports remain available as downloadable artifacts
- Download from Actions → Workflow run → Artifacts
- Open `snyk.sarif` in SARIF viewers or text editors
- Results are organized by timestamp in `reports/{timestamp}/security-scan/`

## Troubleshooting

**Error**: "Code scanning is not enabled for this repository"

- **Solution**: Follow enable steps above, or ignore (reports still generated)

**Error**: "Please verify that the necessary features are enabled"

- **Cause**: Code Scanning requires GitHub Advanced Security (for private repos)
- **Solution**: Public repos get it free; private repos need GitHub Advanced Security license

## More Information

- [GitHub Code Scanning Docs](https://docs.github.com/en/code-security/code-scanning)
- [SARIF Support](https://docs.github.com/en/code-security/code-scanning/integrating-with-code-scanning/sarif-support-for-code-scanning)
- [Snyk Integration](https://docs.snyk.io/integrations/ci-cd-integrations/github-actions-integration)

## Current Workflow Behavior

The CI/CD pipeline is configured with `continue-on-error: true` for the Code Scanning upload:

- ✅ Workflow continues even if upload fails
- ✅ Security scan results always saved as artifacts
- ℹ️ Informational message printed about enabling the feature
- ✅ No workflow failures due to Code Scanning being disabled
