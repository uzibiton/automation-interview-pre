# Non-Functional Testing Guide

## Overview

Non-functional testing validates **how well** the system performs, not **what** it does. These tests verify quality attributes like performance, security, reliability, and usability.

---

## 📁 Test Categories in This Folder

```
tests/non-functional/
├── README.md              ← This guide
├── SIMPLE_GUIDE.md        ← Plain language explanations
├── performance/           ← Load testing (active)
├── security/              ← Vulnerability scanning (active)
├── reliability/           ← Longevity & crash tests (planned)
├── accessibility/         ← WCAG compliance (planned)
└── lighthouse/            ← Web quality audits (planned)
```

### ✅ Currently Implemented

#### 1. **Performance Testing** (`/performance`)

**What it tests**: Speed, scalability, stability under load

**Tools**:

- **k6** - Modern load testing tool (JavaScript-based)
- **Locust** - Python-based distributed load testing

**Key Metrics**:

- Response time (95th percentile)
- Throughput (requests/second)
- Concurrent users supported
- Resource utilization (CPU, memory)

**Example Scenarios**:

```javascript
// k6: Simulate 100 users for 5 minutes
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100, // 100 virtual users
  duration: '5m', // Run for 5 minutes
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'], // Error rate < 1%
  },
};

export default function () {
  let response = http.get('https://api-staging.run.app/expenses');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

**When to run**:

- Before major releases
- After infrastructure changes
- When adding resource-intensive features
- To establish performance baselines

---

#### 2. **Security Testing** (`/security`)

**What it tests**: Vulnerabilities, exploits, security best practices

**Tools**:

- **OWASP ZAP** - Dynamic application security testing (DAST)
- **Bandit** - Python code security analyzer (SAST)
- **Dependency Check** - Vulnerable dependency scanner

**Test Types**:

**a) OWASP ZAP** (`/security/zap`)

- SQL injection attacks
- Cross-site scripting (XSS)
- Security headers validation
- Authentication bypass attempts
- Session management flaws

**b) Bandit** (`/security/bandit`)

- Hardcoded passwords/secrets
- SQL injection in code
- Insecure cryptography usage
- Shell injection vulnerabilities

**c) Dependency Scanning** (`/security/dependency`)

- Known CVEs in npm/pip packages
- Outdated vulnerable libraries
- License compliance issues

**Example**:

```bash
# Run OWASP ZAP scan
zap-baseline.py -t https://frontend-staging.run.app \
  -r zap-report.html \
  -c zap-config.conf

# Check for vulnerabilities in Python code
bandit -r services/api-service/src -f json -o bandit-report.json

# Scan npm dependencies
npm audit --production --audit-level=moderate
```

**When to run**:

- Every PR (dependency check)
- Weekly scheduled scans (ZAP)
- Before production deployments
- After adding authentication/authorization

---

### 🚧 Planned Categories

#### 3. **Accessibility Testing** (`/accessibility`)

**What it tests**: Usability for people with disabilities

**Standards**: WCAG 2.1 (Level AA)

**Tools to implement**:

- **axe-core** - Automated accessibility testing
- **Pa11y** - Command-line accessibility checker
- **Lighthouse Accessibility Audit**
- **Screen reader testing** (manual)

**What it checks**:

```
✅ Semantic HTML (headings, landmarks, labels)
✅ Keyboard navigation (tab order, focus indicators)
✅ Color contrast (4.5:1 for normal text)
✅ Alt text for images
✅ Form labels and error messages
✅ ARIA attributes (roles, states, properties)
✅ Screen reader compatibility
```

**Example Test**:

```javascript
// Playwright with axe-core
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Dashboard should be accessible', async ({ page }) => {
  await page.goto('https://frontend-staging.run.app/dashboard');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

**When to run**:

- During component development
- Before UI releases
- After design changes
- Quarterly compliance audits

---

### 🚧 Planned Categories

#### 4. **Reliability Testing** (`/reliability`)

**What it tests**: System stability over time and failure recovery

**Types**:

- **Soak Testing**: Run 24-72 hours to find memory leaks
- **Stress Testing**: Push to breaking point to find capacity limits
- **Spike Testing**: Handle sudden traffic bursts
- **Recovery Testing**: Verify automatic restart and failover

**What it finds**:

```
Memory leaks, connection leaks, performance degradation
Maximum capacity, bottlenecks, failure modes
Auto-scaling effectiveness, burst capacity
Restart time, data consistency, user experience during outages
```

**Example Scenarios**:

```javascript
// Soak test: 24 hours at normal load
export let options = {
  vus: 50,
  duration: '24h',
};

// Stress test: Find breaking point
export let options = {
  stages: [
    { duration: '5m', target: 100 },
    { duration: '5m', target: 500 },
    { duration: '5m', target: 1000 },
    { duration: '5m', target: 2000 },
  ],
};

// Spike test: Sudden traffic increase
export let options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '30s', target: 1000 }, // Spike!
    { duration: '2m', target: 50 },
  ],
};
```

**Recovery Test Example**:

```bash
# Kill API container and verify restart
docker kill api-service
# Watch restart time, check data consistency
```

**When to run**:

- Soak: Weekly (on weekends)
- Stress: Bi-weekly
- Spike: Weekly
- Recovery: Monthly

**Full Documentation**: See `/reliability/README.md`

---

#### 5. **Lighthouse Audits** (`/lighthouse`)

**What it tests**: Overall web quality metrics

**Categories**:

1. **Performance** (0-100 score)
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)
   - Cumulative Layout Shift (CLS)

2. **Best Practices**
   - HTTPS usage
   - Console errors
   - Deprecated APIs
   - Image optimization

3. **SEO**
   - Meta tags
   - Structured data
   - Mobile-friendliness

4. **PWA** (Progressive Web App)
   - Service worker
   - Offline capability
   - Installability

**Example Implementation**:

```bash
# Run Lighthouse CI
lighthouse https://frontend-staging.run.app \
  --output=json \
  --output-path=./lighthouse-report.json \
  --chrome-flags="--headless" \
  --only-categories=performance,accessibility,best-practices

# Fail build if performance < 80
PERF_SCORE=$(cat lighthouse-report.json | jq '.categories.performance.score * 100')
if [ $PERF_SCORE -lt 80 ]; then
  echo "Performance score ($PERF_SCORE) below threshold (80)"
  exit 1
fi
```

**When to run**:

- Every deployment to staging
- Before production releases
- After frontend optimizations
- Weekly trend monitoring

---

### 📋 Additional Non-Functional Test Types (Not Yet Implemented)

#### 5. **Reliability Testing**

**What it tests**: System stability over time

**Types**:

- **Soak Testing**: Run at normal load for extended period (24-72 hours)
- **Spike Testing**: Sudden traffic increase/decrease
- **Stress Testing**: Beyond normal capacity until failure

**Tools**: k6, Locust, JMeter

**Example**:

```javascript
// k6 Soak Test: 50 users for 24 hours
export let options = {
  vus: 50,
  duration: '24h',
  thresholds: {
    http_req_duration: ['p(99)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};
```

---

#### 6. **Compatibility Testing**

**What it tests**: Works across different environments

**Dimensions**:

- **Browser**: Chrome, Firefox, Safari, Edge
- **OS**: Windows, macOS, Linux, iOS, Android
- **Device**: Desktop, tablet, mobile
- **Network**: 3G, 4G, WiFi, offline

**Tools**: BrowserStack, Sauce Labs, Playwright (built-in)

**Example**:

```javascript
// Playwright: Test on multiple browsers
const { chromium, firefox, webkit } = require('playwright');

for (const browserType of [chromium, firefox, webkit]) {
  const browser = await browserType.launch();
  const page = await browser.newPage();
  await page.goto('https://frontend-staging.run.app');
  // Run tests...
}
```

---

#### 7. **Usability Testing**

**What it tests**: User experience and intuitiveness

**Methods**:

- **Task completion rate**: Can users complete key tasks?
- **Time on task**: How long does it take?
- **Error rate**: How often do users make mistakes?
- **Satisfaction**: System Usability Scale (SUS) score

**Approaches**:

- User interviews (qualitative)
- A/B testing (quantitative)
- Heatmaps and session recordings
- Analytics (Google Analytics, Hotjar)

**Example Metrics**:

```
Task: Create a new expense
- Success rate: 95% of users complete without help
- Avg time: <30 seconds
- Error rate: <5% submit with missing fields
- SUS Score: >70 (acceptable), >80 (good)
```

---

#### 8. **Resilience Testing (Chaos Engineering)**

**What it tests**: System behavior during failures

**Scenarios**:

- Kill random service instances
- Network latency injection
- Database connection failures
- API rate limiting
- Disk space exhaustion

**Tools**: Chaos Monkey, Gremlin, Pumba

**Example**:

```bash
# Kill random container every 5 minutes
pumba kill --interval 5m --random re2:.*api-service.*
```

---

#### 9. **Scalability Testing**

**What it tests**: How system grows with load

**Metrics**:

- Horizontal scaling: Add more instances
- Vertical scaling: Increase CPU/memory
- Database scalability: Connection pooling, sharding
- Cache effectiveness

**Example**:

```javascript
// Gradually increase load to find breaking point
export let options = {
  stages: [
    { duration: '5m', target: 100 }, // Ramp to 100 users
    { duration: '5m', target: 500 }, // Ramp to 500 users
    { duration: '5m', target: 1000 }, // Ramp to 1000 users
    { duration: '5m', target: 2000 }, // Ramp to 2000 users
    { duration: '5m', target: 0 }, // Ramp down
  ],
};
```

---

#### 10. **Disaster Recovery Testing**

**What it tests**: System recovery from catastrophic failures

**Scenarios**:

- Database backup/restore
- Service failover
- Data center outage
- Ransomware attack recovery

**Metrics**:

- **RTO** (Recovery Time Objective): How long to restore?
- **RPO** (Recovery Point Objective): How much data loss?

---

## 🗂️ Recommended Folder Structure

```
tests/non-functional/
├── README.md (this file)
├── accessibility/
│   ├── axe-tests/
│   ├── pa11y-tests/
│   └── manual-checklist.md
├── performance/
│   ├── k6/
│   │   ├── load-test.js
│   │   ├── stress-test.js
│   │   └── soak-test.js
│   └── locust/
│       └── locustfile.py
├── security/
│   ├── zap/
│   │   ├── zap-config.conf
│   │   └── run-scan.sh
│   ├── bandit/
│   │   └── .bandit
│   └── dependency/
│       └── audit.sh
├── lighthouse/
│   ├── lighthouse-config.json
│   └── run-audit.sh
├── reliability/
│   ├── soak-tests/
│   └── spike-tests/
├── compatibility/
│   ├── browser-matrix.md
│   └── cross-browser-tests/
├── resilience/
│   ├── chaos-experiments/
│   └── failure-scenarios.md
└── scalability/
    └── load-progression-tests/
```

---

## 📊 Test Execution Matrix

| Test Type                   | Frequency     | Environment | Duration    | Blocker?  |
| --------------------------- | ------------- | ----------- | ----------- | --------- |
| **Performance (quick)**     | Every PR      | Staging     | 2-5 min     | Yes       |
| **Performance (full)**      | Weekly        | Staging     | 30-60 min   | No        |
| **Security (dependencies)** | Every PR      | All         | 1-2 min     | Yes       |
| **Security (OWASP ZAP)**    | Weekly        | Staging     | 15-30 min   | No        |
| **Accessibility**           | Every release | Staging     | 5-10 min    | Warn only |
| **Lighthouse**              | Every deploy  | Staging     | 2-3 min     | Warn only |
| **Reliability (soak)**      | Monthly       | Staging     | 24-48 hours | No        |
| **Chaos testing**           | Quarterly     | Staging     | Varies      | No        |

---

## 🎯 Getting Started

### 1. Run Existing Tests

```bash
# Performance tests with k6
cd tests/non-functional/performance/k6
k6 run load-test.js

# Performance tests with Locust
cd tests/non-functional/performance/locust
locust -f locustfile.py --headless -u 100 -r 10 -t 5m

# Security scan (if ZAP is set up)
cd tests/non-functional/security/zap
./run-scan.sh

# Dependency audit
npm audit --production
```

### 2. Add New Test Type

```bash
# Example: Add accessibility tests
mkdir -p tests/non-functional/accessibility/axe-tests
cd tests/non-functional/accessibility/axe-tests

# Install dependencies
npm install --save-dev @axe-core/playwright

# Create test file
# (see examples above)
```

### 3. Integrate into CI/CD

```yaml
# .github/workflows/non-functional-tests.yml
name: Non-Functional Tests

on:
  schedule:
    - cron: '0 2 * * 1' # Weekly, Monday 2am
  workflow_dispatch:

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run k6 Load Test
        run: |
          docker run --rm -v $PWD:/workspace \
            grafana/k6 run /workspace/tests/non-functional/performance/k6/load-test.js

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: OWASP ZAP Scan
        run: |
          docker run --rm -v $PWD:/zap/wrk/:rw \
            owasp/zap2docker-stable zap-baseline.py \
            -t https://frontend-staging.run.app \
            -r zap-report.html
```

---

## 📚 Learn More

### Performance Testing

- [k6 Documentation](https://k6.io/docs/)
- [Locust Documentation](https://docs.locust.io/)

### Security Testing

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [ZAP Getting Started](https://www.zaproxy.org/getting-started/)

### Accessibility

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)

### Chaos Engineering

- [Principles of Chaos Engineering](https://principlesofchaos.org/)
- [Chaos Monkey](https://netflix.github.io/chaosmonkey/)

---

## 🤝 Contributing

When adding new non-functional tests:

1. Create appropriate subdirectory
2. Add README with tool setup instructions
3. Include example test scenarios
4. Document expected thresholds/SLAs
5. Update this main README
6. Consider CI/CD integration

---

**Remember**: Non-functional tests are as important as functional tests. They ensure your app doesn't just work correctly, but works _well_ under real-world conditions.
