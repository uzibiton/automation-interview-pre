# Reliability Testing

**Status**: Planned for Q1 2026

**Purpose**: Ensure the application remains stable over time and can handle failures gracefully

---

## What is Reliability Testing?

Reliability testing validates that your system can:

- Run for extended periods without degradation
- Handle extreme load conditions
- Recover from failures
- Maintain data integrity under stress

---

## Test Types

### 1. Soak Testing (Longevity Tests)

**Purpose**: Find issues that only appear after prolonged use

**Duration**: 24-72 hours at normal load

**What it finds**:

- Memory leaks
- Database connection leaks
- File handle exhaustion
- Gradual performance degradation
- Resource accumulation

**Example Scenario**:

```javascript
// k6 soak test - 24 hours
export let options = {
  vus: 50, // 50 concurrent users
  duration: '24h', // Run for 24 hours
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% < 1s
    http_req_failed: ['rate<0.05'], // <5% errors
  },
};

export default function () {
  // Simulate normal user behavior
  http.get(`${BASE_URL}/expenses`);
  sleep(randomIntBetween(5, 15));

  http.post(`${BASE_URL}/expenses`, {
    amount: randomIntBetween(10, 500),
    category: randomItem(['food', 'transport', 'health']),
  });
  sleep(randomIntBetween(30, 120));
}
```

**Monitoring During Test**:

- Memory usage over time
- Response time trends
- Error rate patterns
- Database connection pool
- CPU usage stability

**Success Criteria**:

- No memory leaks (memory stays flat or grows minimally)
- Response times remain consistent
- Error rate < 1%
- System recovers after test ends

---

### 2. Stress Testing

**Purpose**: Find the breaking point of your application

**Duration**: 30-60 minutes

**What it finds**:

- Maximum capacity
- How system fails (gracefully vs catastrophically)
- Bottlenecks
- Resource limits

**Example Scenario**:

```javascript
// k6 stress test - gradually increase load
export let options = {
  stages: [
    { duration: '5m', target: 100 }, // Warm up
    { duration: '5m', target: 500 }, // Approaching limits
    { duration: '5m', target: 1000 }, // Beyond normal
    { duration: '5m', target: 2000 }, // Breaking point
    { duration: '5m', target: 3000 }, // Way beyond
    { duration: '10m', target: 0 }, // Recovery
  ],
};
```

**What to Watch**:

- At what point do errors start?
- Does it crash or degrade gracefully?
- Can it recover after load decreases?
- What's the bottleneck? (CPU, memory, DB connections, network)

**Success Criteria**:

- System handles 2x normal load
- Degrades gracefully (returns errors, doesn't crash)
- Recovers quickly when load decreases
- No data corruption at peak load

---

### 3. Spike Testing

**Purpose**: Test behavior during sudden traffic surges

**Duration**: 10-20 minutes

**What it finds**:

- Auto-scaling effectiveness
- Burst capacity
- Queue handling
- Cache effectiveness

**Example Scenario**:

```javascript
// k6 spike test
export let options = {
  stages: [
    { duration: '2m', target: 50 }, // Normal baseline
    { duration: '30s', target: 1000 }, // Sudden spike!
    { duration: '3m', target: 1000 }, // Sustained spike
    { duration: '30s', target: 50 }, // Back to normal
    { duration: '2m', target: 50 }, // Recovery period
  ],
};
```

**Real-World Triggers**:

- App featured on Product Hunt
- Marketing email sent
- Social media viral post
- Breaking news mention

**Success Criteria**:

- Auto-scaler responds within 2 minutes
- Error rate < 5% during spike
- Returns to normal after spike ends
- No lingering issues post-spike

---

### 4. Recovery Testing

**Purpose**: Verify system can recover from failures

**Duration**: Varies (10-30 minutes per scenario)

**What it finds**:

- Auto-restart mechanisms
- Data consistency after crash
- User experience during outage
- Failover effectiveness

**Test Scenarios**:

#### a) Container Crash

```bash
# Kill random container
docker kill $(docker ps -q --filter name=api-service)

# Observe:
# - How long to detect failure? (health checks)
# - How long to restart? (orchestrator)
# - Are in-flight requests lost?
# - Is data consistent?
```

#### b) Database Failure

```bash
# Disconnect from database
docker network disconnect app-network postgres

# Wait 60 seconds

# Reconnect
docker network connect app-network postgres

# Verify:
# - Connection pool recovers
# - Pending transactions handled
# - No data corruption
```

#### c) Memory Exhaustion

```bash
# Stress memory until OOM
stress-ng --vm 1 --vm-bytes 90% --timeout 60s

# Observe:
# - OOM killer behavior
# - Container restart
# - Data preservation
```

**Success Criteria**:

- Automatic restart within 30 seconds
- No data loss
- Clear error messages to users
- Graceful degradation during outage

---

## Folder Structure

```
tests/non-functional/reliability/
├── README.md                  ← This file
├── soak-tests/
│   ├── 24hr-normal-load.js   ← 24-hour stability test
│   ├── 48hr-peak-load.js     ← 48-hour sustained load
│   └── memory-leak-check.sh  ← Monitor memory usage
├── stress-tests/
│   ├── find-breaking-point.js ← Gradually increase load
│   ├── sustained-overload.js  ← Stay above capacity
│   └── analyze-bottleneck.sh  ← Identify bottlenecks
├── spike-tests/
│   ├── sudden-traffic.js      ← Quick burst
│   ├── autoscale-validation.js ← Test scaling
│   └── queue-handling.js      ← Message queue spikes
└── recovery-tests/
    ├── container-crash.sh     ← Kill and restart
    ├── database-disconnect.sh ← DB connection loss
    ├── memory-exhaustion.sh   ← OOM scenarios
    └── network-partition.sh   ← Network failures
```

---

## How to Run (When Implemented)

### Soak Test (Run on weekends)

```bash
# Start soak test
npm run test:reliability:soak

# Monitor in separate terminal
watch -n 60 'docker stats --no-stream'

# Check results after 24 hours
npm run test:reliability:report
```

### Stress Test

```bash
# Run stress test
npm run test:reliability:stress

# View live metrics
open http://localhost:5665/  # k6 dashboard
```

### Spike Test

```bash
# Run spike test
npm run test:reliability:spike

# Check auto-scaling logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50
```

### Recovery Test

```bash
# Run all recovery scenarios
npm run test:reliability:recovery

# Or individual scenarios
./tests/non-functional/reliability/recovery-tests/container-crash.sh
```

---

## Metrics to Track

### Soak Tests

- Memory usage over time (should be flat)
- Response time trend (should be stable)
- Error rate (should be < 1%)
- Database connections (should not grow)
- File handles (should not leak)

### Stress Tests

- Maximum concurrent users before failure
- Response time degradation curve
- Error rate at each load level
- Resource utilization at peak

### Spike Tests

- Time to scale up (should be < 2 min)
- Error rate during spike (should be < 5%)
- Time to scale down (should be < 5 min)
- Cost impact of auto-scaling

### Recovery Tests

- Time to detect failure (should be < 30s)
- Time to restart (should be < 60s)
- Data consistency (100% maintained)
- User error messages (clear and helpful)

---

## Integration with CI/CD

### Scheduled Tests

```yaml
# .github/workflows/reliability-tests.yml
name: Reliability Tests

on:
  schedule:
    - cron: '0 0 * * 6' # Saturday midnight (soak)
    - cron: '0 2 * * 1' # Monday 2am (stress)

jobs:
  soak-test:
    runs-on: ubuntu-latest
    timeout-minutes: 1500 # 25 hours
    steps:
      - name: Run 24-hour soak test
        run: npm run test:reliability:soak

      - name: Analyze results
        run: |
          if [ $(cat memory-trend.txt | tail -1) -gt 1000 ]; then
            echo "Memory leak detected!"
            exit 1
          fi

  stress-test:
    runs-on: ubuntu-latest
    steps:
      - name: Find breaking point
        run: npm run test:reliability:stress

      - name: Document capacity
        run: |
          echo "Max users: $(cat max-users.txt)" >> capacity-report.md
```

---

## When to Run

| Test Type    | Frequency | Environment | Best Time             |
| ------------ | --------- | ----------- | --------------------- |
| **Soak**     | Weekly    | Staging     | Weekend (24-48 hrs)   |
| **Stress**   | Bi-weekly | Staging     | Off-peak hours        |
| **Spike**    | Weekly    | Staging     | Anytime (quick)       |
| **Recovery** | Monthly   | Staging     | Scheduled maintenance |

---

## Real-World Benefits

### Example Findings

**Soak Test Found**:

```
After 18 hours of running:
- Memory usage increased from 512MB to 3.5GB
- Response time degraded from 200ms to 4000ms
- Root cause: Firestore connections not being closed
- Fix: Added proper connection pooling
- Result: Memory stays at 512MB indefinitely
```

**Stress Test Found**:

```
At 1500 concurrent users:
- Database connection pool exhausted (max 100)
- Users getting "Connection timeout" errors
- Fix: Increased pool size to 500, added queue
- New capacity: 5000+ concurrent users
```

**Spike Test Found**:

```
During traffic spike (50 → 1000 users in 30s):
- Auto-scaler took 5 minutes to respond (too slow)
- 30% of requests timed out
- Fix: Pre-warmed instances, adjusted scaling threshold
- Result: Scales in <60 seconds, <1% errors
```

**Recovery Test Found**:

```
When API container crashed:
- Cloud Run restarted in 25 seconds (good)
- During restart: frontend showed "Server error" (bad)
- In-flight requests lost (no retry)
- Fix: Added retry logic + user-friendly error message
- Result: Users see "Retrying..." instead of error
```

---

## Tools & Resources

### Recommended Tools

- **k6** - Load testing (can do soak/stress/spike)
- **Locust** - Alternative to k6 (Python)
- **Chaos Mesh** - Chaos engineering platform
- **Pumba** - Docker chaos testing
- **stress-ng** - System stress testing

### Learning Resources

- [k6 Documentation](https://k6.io/docs/)
- [Reliability Testing Guide](https://www.guru99.com/reliability-testing.html)
- [Chaos Engineering Principles](https://principlesofchaos.org/)

---

## Next Steps

1. **Set up baseline**: Run performance tests to establish normal metrics
2. **Create soak test**: Start with simple 8-hour test
3. **Document capacity**: Run stress test to find limits
4. **Test auto-scaling**: Validate spike handling
5. **Practice recovery**: Manually crash services and verify restart

---

**Status**: Folder structure created, tests to be implemented in Q1 2026

**Priority**: Medium-High (important for production confidence)

**Dependencies**: Need baseline performance metrics first
