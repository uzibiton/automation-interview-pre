# GitHub UI Guide - Actions & Secrets Setup

Visual walkthrough of GitHub's interface for setting up CI/CD.

---

## 📍 Part 1: Repository Settings

### 1. Navigate to Your Repository

```
https://github.com/uzibiton/automation-interview-pre
```

You should see:

```
┌─────────────────────────────────────────────────────────────┐
│ uzibiton / automation-interview-pre                    🔒   │
├─────────────────────────────────────────────────────────────┤
│ [ <> Code ]  [ Issues ]  [ Pull requests ]  [ Actions ] ... │
│                                                [ Settings ] ←│
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Part 2: Adding Secrets

### Step 1: Click "Settings" Tab

Located at the far right of the top menu bar.

### Step 2: Find "Secrets and variables" in Left Sidebar

```
Settings Sidebar:
├── General
├── Collaborators
├── Code and automation
│   ├── Branches
│   ├── Tags
│   ├── Actions         ← Expand this section
│   │   ├── General
│   │   └── Runners
│   ├── Webhooks
│   └── Environments
├── Security
│   ├── Code security and analysis
│   └── Secrets and variables  ← Click here!
│       ├── Actions            ← Click here!
│       ├── Codespaces
│       └── Dependabot
```

### Step 3: Secrets and Variables -> Actions

You'll see this screen:

```
┌────────────────────────────────────────────────────────────┐
│ Actions secrets and variables                              │
├────────────────────────────────────────────────────────────┤
│ [ Secrets ] [ Variables ]                                  │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Repository secrets                                        │
│  ────────────────────────────────────────────────────────  │
│                                                             │
│  Secrets are encrypted and allow you to store sensitive   │
│  information, such as access tokens, in your repository.   │
│                                                             │
│  [ New repository secret ] ← Click this button             │
│                                                             │
│  No secrets yet (or list of existing secrets)              │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Step 4: Add Each Secret

Click **"New repository secret"** and you'll see:

```
┌────────────────────────────────────────────────────────────┐
│ Actions secrets / New secret                               │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Name *                                                    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ GCP_SA_KEY                                           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  Secret *                                                  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ {                                                    │ │
│  │   "type": "service_account",                        │ │
│  │   "project_id": "automation-interview-pre",         │ │
│  │   "private_key_id": "abc123...",                    │ │
│  │   "private_key": "-----BEGIN PRIVATE KEY-----...",  │ │
│  │   ...                                               │ │
│  │ }                                                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│           [ Cancel ]  [ Add secret ] ← Click when done     │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Step 5: Repeat for All 5 Secrets

After adding all secrets, you'll see:

```
┌────────────────────────────────────────────────────────────┐
│ Actions secrets and variables                              │
├────────────────────────────────────────────────────────────┤
│ [ Secrets ] [ Variables ]                                  │
├────────────────────────────────────────────────────────────┤
│  Repository secrets                                        │
│                                                             │
│  [ New repository secret ]                                 │
│                                                             │
│  ┌─────────────────────────────────┬──────────────────┐   │
│  │ Name                            │ Updated          │   │
│  ├─────────────────────────────────┼──────────────────┤   │
│  │ GCP_PROJECT_ID          [...]   │ Updated now      │   │
│  │ GCP_SA_KEY              [...]   │ Updated now      │   │
│  │ GOOGLE_CLIENT_ID        [...]   │ Updated now      │   │
│  │ GOOGLE_CLIENT_SECRET    [...]   │ Updated now      │   │
│  │ JWT_SECRET              [...]   │ Updated now      │   │
│  └─────────────────────────────────┴──────────────────┘   │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

✅ **5 secrets added successfully!**

---

## ⚙️ Part 3: GitHub Actions Tab

### Navigate to Actions

Click the **"Actions"** tab in your repository:

```
┌─────────────────────────────────────────────────────────────┐
│ uzibiton / automation-interview-pre                         │
├─────────────────────────────────────────────────────────────┤
│ [ <> Code ]  [ Issues ]  [ Pull requests ]  [ Actions ] ←── │
└─────────────────────────────────────────────────────────────┘
```

### Before First Run (No Workflows Yet)

If you haven't pushed the workflow file yet:

```
┌────────────────────────────────────────────────────────────┐
│ Actions                                                    │
├────────────────────────────────────────────────────────────┤
│                                                             │
│   Get started with GitHub Actions                          │
│                                                             │
│   Automate your workflow from idea to production          │
│                                                             │
│   [Browse workflow templates ->]                            │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### After Pushing Workflow File

Once `.github/workflows/ci-cd.yml` is pushed:

```
┌────────────────────────────────────────────────────────────┐
│ Actions                                                    │
├────────────────────────────────────────────────────────────┤
│ All workflows ▼                                            │
│                                                             │
│ ├─ 🟢 CI/CD Pipeline  ← Your workflow appears here!       │
│                                                             │
│ ─────────────────────────────────────────────────────────  │
│                                                             │
│ All workflow runs                                          │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ No workflow runs yet                                  │  │
│ │                                                        │  │
│ │ Push to trigger your workflow, or click below:       │  │
│ │ [ Run workflow ]  ← Manual trigger button             │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### After First Run

```
┌────────────────────────────────────────────────────────────┐
│ Actions                                                    │
├────────────────────────────────────────────────────────────┤
│ Workflows               All workflows ▼    [ Run workflow ]│
│ ├─ 🟢 CI/CD Pipeline                                       │
│                                                             │
│ ─────────────────────────────────────────────────────────  │
│                                                             │
│ Filter workflow runs:                                      │
│ [ Event: All ▼ ] [ Status: All ▼ ] [ Branch: All ▼ ]     │
│                                                             │
│ Workflow runs                                              │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ✅ Add CI/CD pipeline        CI/CD Pipeline           │  │
│ │    #1: main by uzibiton                               │  │
│ │    ✅ unit-tests  ✅ build  ✅ deploy    2m 45s       │  │
│ ├────────────────────────────────────────────────────────│  │
│ │ ✅ Test PR                   CI/CD Pipeline           │  │
│ │    #2: test-ci-pipeline by uzibiton                   │  │
│ │    ✅ unit-tests                         1m 32s       │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## 🔍 Part 4: Viewing Workflow Details

### Click on a Workflow Run

When you click a workflow run, you'll see:

```
┌────────────────────────────────────────────────────────────┐
│ CI/CD Pipeline #1                                    [...]  │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ ✅ Completed in 12m 34s                                    │
│                                                             │
│ Workflow file: .github/workflows/ci-cd.yml                 │
│ Triggered via push by uzibiton                             │
│ Commit: abc1234 "Add CI/CD pipeline"                       │
│ Branch: main                                                │
│                                                             │
│ ─────────────────────────────────────────────────────────  │
│                                                             │
│ Jobs                                                       │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ✅ unit-tests                              2m 45s    │  │
│ │    Set up job, Run actions/checkout, Setup Node.js   │  │
│ │    Install dependencies, Run unit tests...            │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ✅ build                                   6m 12s    │  │
│ │    Set up job, Checkout code, Auth to GCP...         │  │
│ │    Build auth-service, Build api-service...           │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ✅ deploy                                  3m 37s    │  │
│ │    Set up job, Checkout code, Auth to GCP...         │  │
│ │    Deploy auth-service, Deploy api-service...         │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Click on a Job to See Logs

```
┌────────────────────────────────────────────────────────────┐
│ unit-tests                                                 │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ ▼ Set up job                                       1s      │
│ ▼ Run actions/checkout@v4                         2s      │
│ ▼ Setup Node.js                                    8s      │
│ ▼ Install dependencies                            45s      │
│   npm ci                                                    │
│   added 234 packages in 43s                                │
│                                                             │
│ ▼ Run unit tests                                  89s      │
│   npm test                                                  │
│   PASS tests/jest.config.test.ts                    │
│   ✓ should have correct testMatch patterns (3 ms)         │
│   ✓ should set NODE_ENV to test (1 ms)                    │
│                                                             │
│   Test Suites: 1 passed, 1 total                           │
│   Tests:       2 passed, 2 total                           │
│   Snapshots:   0 total                                     │
│   Time:        2.567 s                                     │
│                                                             │
│ ▼ Upload test results                             3s      │
│ ▼ Complete job                                     1s      │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## 🎮 Part 5: Manual Workflow Trigger

### Run Workflow Button

On the Actions tab, click **"CI/CD Pipeline"** in the left sidebar:

```
┌────────────────────────────────────────────────────────────┐
│ CI/CD Pipeline                                             │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ This workflow runs tests, builds images, and deploys.     │
│                                                             │
│ [ Run workflow ▼ ] ← Click this                            │
│                                                             │
│ Recent workflow runs:                                      │
│ ...                                                         │
└────────────────────────────────────────────────────────────┘
```

### Workflow Dispatch Dialog

```
┌────────────────────────────────────────────────────────────┐
│ Run workflow                                               │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ Use workflow from                                          │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Branch: main                                    ▼    │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│                   [ Cancel ]  [ Run workflow ]             │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

Select your branch and click **"Run workflow"**. The workflow will start immediately!

---

## 📊 Part 6: Status Badges (Optional)

You can add a status badge to your README:

### Get Badge Code

1. Go to Actions tab
2. Click on "CI/CD Pipeline" workflow
3. Click "..." (three dots) at top right
4. Select "Create status badge"
5. Copy the Markdown code

### Badge Markdown

```markdown
![CI/CD Pipeline](https://github.com/uzibiton/automation-interview-pre/actions/workflows/ci-cd.yml/badge.svg)
```

### Badge Appearance

In your README, it will show:

- ✅ ![passing](https://img.shields.io/badge/build-passing-brightgreen) - All tests passed
- ❌ ![failing](https://img.shields.io/badge/build-failing-red) - Tests failed
- 🟡 ![running](https://img.shields.io/badge/build-running-yellow) - Currently running

---

## 🎯 Part 7: Pull Request Integration

### When You Create a PR

The workflow status appears directly in the PR:

```
┌────────────────────────────────────────────────────────────┐
│ Test CI/CD Pipeline #3                                     │
├────────────────────────────────────────────────────────────┤
│ test-ci-pipeline -> main                                    │
│                                                             │
│ Some checks haven't completed yet                          │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ 🟡 CI/CD Pipeline                         In progress │  │
│ │    ├─ ✅ unit-tests                      Successful  │  │
│ │    ├─ ⏭️  build                          Skipped     │  │
│ │    └─ ⏭️  deploy                         Skipped     │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│ This branch has no conflicts with the base branch          │
│                                                             │
│ [ Merge pull request ▼ ]  (Enabled when checks pass)      │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### After Tests Pass

```
┌────────────────────────────────────────────────────────────┐
│ Test CI/CD Pipeline #3                                     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ All checks have passed                                     │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ✅ CI/CD Pipeline                                     │  │
│ │    ├─ ✅ unit-tests                      Successful  │  │
│ │    ├─ ⏭️  build                          Skipped     │  │
│ │    └─ ⏭️  deploy                         Skipped     │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│ [ Merge pull request ▼ ] ← Now enabled!                   │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## 🎨 Visual Summary

```
Repository Structure:
uzibiton/automation-interview-pre
├── Settings
│   └── Secrets and variables
│       └── Actions
│           ├── GCP_SA_KEY          ✅ Added
│           ├── GCP_PROJECT_ID      ✅ Added
│           ├── GOOGLE_CLIENT_ID    ✅ Added
│           ├── GOOGLE_CLIENT_SECRET ✅ Added
│           └── JWT_SECRET          ✅ Added
│
├── Actions
│   └── CI/CD Pipeline
│       ├── Run workflow (manual trigger)
│       └── Workflow runs
│           ├── #1 ✅ main: 12m 34s
│           └── #2 ✅ PR: 2m 45s
│
└── Pull Requests
    └── Status checks appear here
        ├── ✅ unit-tests
        ├── ⏭️  build (skipped on PR)
        └── ⏭️  deploy (skipped on PR)
```

---

## 🚀 Ready to Try?

Now that you've seen the UI layout, you can:

1. **Add secrets** in Settings -> Secrets and variables -> Actions
2. **Push your workflow** file to the repository
3. **Watch it run** in the Actions tab
4. **Create a PR** to see the integration
5. **Trigger manually** with "Run workflow" button

Would you like to proceed with the actual setup now?
