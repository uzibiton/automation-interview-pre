# Non-Functional Testing - Simple Explanation

> **Goal**: Help you understand what each test type does and when to use it

---

## What is Non-Functional Testing?

**Functional Test**: "Does the button work?" ✅  
**Non-Functional Test**: "Is the button fast? Secure? Accessible?" 🚀🔒♿

---

## Test Types - One by One

### 1. 🚀 Performance Testing

**Plain English**: How fast is your app? How many users can it handle?

**What it tests**:

- Page load speed
- API response time
- How many users can use it at once
- Does it slow down over time?

**Real Example**:

```
Your expense app:
- Can it handle 100 users creating expenses at once?
- Does the dashboard load in under 2 seconds?
- If 1000 users login together, does it crash?
```

**Tools in your project**:

- **k6**: Simulates users making requests
- **Locust**: Same but written in Python

**When to run**: Before big releases, after infrastructure changes

**Folder**: `tests/non-functional/performance/`

---

### 2. 🔒 Security Testing

**Plain English**: Can hackers break into your app?

**What it tests**:

- SQL injection attacks
- Password stealing attempts
- Vulnerable libraries (like outdated npm packages)
- Missing security headers

**Real Example**:

```
Your expense app:
- Can someone see another user's expenses?
- Can someone inject malicious code?
- Are you using libraries with known security bugs?
```

**Tools in your project**:

- **OWASP ZAP**: Tries to hack your app automatically
- **Bandit**: Scans Python code for security issues
- **npm audit**: Checks for vulnerable packages

**When to run**: Every week, before production deployment

**Folder**: `tests/non-functional/security/`

---

### 3. ♿ Accessibility Testing (Planned)

**Plain English**: Can everyone use your app, including people with disabilities?

**What it tests**:

- Can blind users (using screen readers) use it?
- Can keyboard-only users navigate?
- Are color contrasts good enough?
- Are buttons labeled properly?

**Real Example**:

```
Your expense app:
- Can someone tab through the form with just keyboard?
- Can a screen reader announce "Amount input field"?
- Is red/green color-blind friendly?
```

**Tools to add**:

- **axe-core**: Automated accessibility checker
- **Manual testing**: Use keyboard only, try a screen reader

**When to run**: Before UI changes, quarterly compliance checks

**Folder**: `tests/non-functional/accessibility/`

---

### 4. 💡 Lighthouse Audits (Planned)

**Plain English**: Overall web quality report card

**What it tests**:

- Performance score (0-100)
- Best practices score
- SEO (search engine optimization)
- Progressive Web App features

**Real Example**:

```
Your expense app gets graded on:
- Performance: 85/100 (pretty fast)
- Accessibility: 92/100 (mostly accessible)
- Best Practices: 95/100 (following web standards)
- SEO: 90/100 (Google-friendly)
```

**Tool to add**: **Lighthouse CLI** (built into Chrome)

**When to run**: Every deployment

**Folder**: `tests/non-functional/lighthouse/`

---

### 5. 🔄 Reliability Testing (Planned)

**Plain English**: Does your app crash? Can it run for days without issues?

**What it tests**:

- **Longevity/Soak**: Run 24-72 hours to find memory leaks
- **Stress**: Push until it breaks (find the limit)
- **Spike**: Handle sudden traffic bursts
- **Recovery**: Restart after crashes

**Real Examples**:

```
Soak Test (24 hours):
- 50 users continuously using the app
- After 12 hours: response time goes from 200ms → 2000ms
- Found: Database connections not closing properly

Stress Test:
- Start with 100 users, increase by 100 every 5 min
- At 1500 users: API starts failing
- Crash at 2000 users
- Found: Your limit is ~1200 concurrent users

Spike Test:
- Normal: 50 users
- Suddenly: 500 users (Product Hunt feature!)
- App slows but doesn't crash
- Back to 50 users: recovers in 2 minutes

Recovery Test:
- Kill API container
- Cloud Run restarts in 30 seconds
- During restart: users see errors
- After restart: everything works
- Found: Need retry logic in frontend
```

**Tools to add**:

- **k6** - Can do soak/stress/spike tests
- **Chaos Mesh** - Random failure injection
- **Docker** - Kill and restart containers

**When to run**: Monthly for soak, weekly for stress/spike

**Folder**: `tests/non-functional/reliability/` (to be created)

---

## Current Status vs Planned

### ✅ What You Have Now:

1. **Performance** (k6, Locust) - Folders exist, tools ready
2. **Security** (ZAP, Bandit, dependency) - Folders exist, tools ready

### 📋 What's Planned:

3. **Reliability** (soak, stress, spike, recovery) - Needs folder + tests
4. **Accessibility** - Empty folder, needs implementation
5. **Lighthouse** - Empty folder, needs implementation
6. **Compatibility** (cross-browser) - Not yet added
7. **Chaos Engineering** (failure testing) - Advanced, future

---

## Quick Comparison Table

| Test Type         | Speed              | When to Run     | Blocks Deploy?           | Folder Status |
| ----------------- | ------------------ | --------------- | ------------------------ | ------------- |
| **Performance**   | Slow (5-30 min)    | Weekly          | No                       | ✅ Ready      |
| **Security**      | Medium (10-20 min) | Weekly          | Yes (if high-risk found) | ✅ Ready      |
| **Reliability**   | Very Slow (24+ hr) | Monthly         | No                       | 📋 Planned    |
| **Accessibility** | Fast (2-5 min)     | Before releases | Warn only                | 📁 Empty      |
| **Lighthouse**    | Fast (2-3 min)     | Every deploy    | Warn only                | 📁 Empty      |

---

## What Should You Do Next?

### Step 1: Understand What You Have

**Action**: Look at these folders

```
tests/non-functional/performance/k6/
tests/non-functional/performance/locust/
tests/non-functional/security/zap/
tests/non-functional/security/bandit/
```

**Question to answer**: "What files are in there? Are they actual tests or just folders?"

---

### Step 2: Organize Empty Folders

**Action**: Keep the 4 main folders:

- `accessibility/` (empty - for future)
- `lighthouse/` (empty - for future)
- `performance/` (has k6 and locust)
- `security/` (has zap, bandit, dependency)

**Why**: Clear structure even if not all implemented yet

---

### Step 3: Add README Files

Each empty folder should explain what will go there:

**Example** (`accessibility/README.md`):

```markdown
# Accessibility Testing

**Status**: Planned for Q1 2026

**Purpose**: Ensure app is usable by everyone

**Tools to implement**:

- axe-core
- Pa11y
- Manual keyboard testing

**When ready**: Will run before each release
```

---

### Step 4: Decide Priority

**High Priority** (do soon):

1. Security tests - Critical for production
2. Performance tests - Users care about speed

**Medium Priority** (do later): 3. Accessibility - Good for compliance 4. Lighthouse - Nice quality metrics

**Low Priority** (advanced): 5. Chaos engineering 6. Reliability testing

---

## How to Explain This in Interview

### Bad Answer ❌:

"I have some folders for non-functional tests"

### Good Answer ✅:

"I've structured non-functional tests into categories:

- **Performance** (k6/Locust) to test load capacity
- **Security** (OWASP ZAP) to scan for vulnerabilities
- **Accessibility** (planned) for WCAG compliance
- **Lighthouse** (planned) for web quality metrics

Currently performance and security are active, others are documented roadmap items."

### Great Answer 🌟:

"I designed the non-functional test structure based on quality attributes:

**Performance**: Using k6 and Locust to simulate 100+ concurrent users and measure response times. This catches scalability issues before production.

**Security**: OWASP ZAP scans for vulnerabilities, Bandit checks Python code, and npm audit catches vulnerable dependencies. These run weekly and block deploys if high-risk issues found.

**Future**: Planning accessibility tests with axe-core for WCAG compliance and Lighthouse for overall web quality metrics.

The folder structure is ready even for unimplemented types, showing I think ahead about quality requirements."

---

## Summary

**Non-Functional Tests = Quality Attributes**

Your app should:

- ✅ Work correctly (functional tests)
- 🚀 Be fast (performance tests)
- 🔒 Be secure (security tests)
- ♿ Be accessible (accessibility tests)
- 📱 Look good (lighthouse tests)

**Current state**: Performance and Security ready, others planned

**Next step**: Tell me when you're ready to go through each type in detail!
