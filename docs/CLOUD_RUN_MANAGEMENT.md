# Cloud Run Management Guide

Complete guide for managing your Cloud Run services via UI and CLI.

---

## 🌐 Access Cloud Run Console

**Web UI:**
```
https://console.cloud.google.com/run?project=automation-interview-pre
```

**Your Services:**
- **Auth Service**: https://auth-service-881467160213.us-central1.run.app
- **API Service**: https://api-service-hjcsve3jia-uc.a.run.app
- **Frontend**: https://frontend-881467160213.us-central1.run.app

---

## 📊 Viewing Service Status

### Via UI:
1. Go to Cloud Run console
2. Click on any service name
3. You'll see:
   - ✅ **Status**: Running/Stopped
   - 📈 **Metrics**: Requests, latency, errors
   - 🔄 **Revisions**: Deployment history
   - ⚙️ **Configuration**: Environment vars, memory, CPU
   - 📝 **Logs**: Real-time application logs

### Via CLI:

```bash
# List all services
gcloud run services list --region us-central1

# Get detailed service info
gcloud run services describe api-service --region us-central1

# Check if service is healthy
gcloud run services describe api-service \
  --region us-central1 \
  --format="value(status.conditions[0].status)"
```

**Output:**
- `True` = Service is healthy ✅
- `False` = Service has issues ❌
- `Unknown` = Starting up ⏳

---

## 📝 Viewing Logs

### Via UI:
1. Click on service name
2. Go to **LOGS** tab
3. Real-time logs with filtering

### Via CLI:

```bash
# View recent logs
gcloud run services logs read api-service --region us-central1 --limit 50

# Follow logs in real-time
gcloud run services logs tail api-service --region us-central1

# Filter logs by severity
gcloud run services logs read api-service \
  --region us-central1 \
  --log-filter='severity>=ERROR'

# View logs from specific time
gcloud run services logs read api-service \
  --region us-central1 \
  --limit 100 \
  --format='table(timestamp,message)'
```

---

## 🔴 Stopping Services

### ⚠️ Important: Cloud Run doesn't have "stop" - only "delete"

**Cloud Run scales to ZERO automatically:**
- When no requests come in → instances shut down
- You pay $0 when scaled to zero
- Service wakes up on next request

### To prevent traffic (without deleting):

```bash
# Route 0% traffic to latest revision (effectively "paused")
gcloud run services update-traffic api-service \
  --region us-central1 \
  --to-latest=0
```

### To delete a service completely:

```bash
# Delete service (⚠️ PERMANENT)
gcloud run services delete api-service --region us-central1

# Delete without confirmation prompt
gcloud run services delete api-service --region us-central1 --quiet
```

**Via UI:**
1. Click on service
2. Click **DELETE** button at top
3. Confirm deletion

---

## 🗑️ Removing Services

### Delete Single Service:
```bash
gcloud run services delete api-service --region us-central1
```

### Delete All Services:
```bash
# List and delete all services
gcloud run services list --region us-central1 --format="value(metadata.name)" | \
  xargs -I {} gcloud run services delete {} --region us-central1 --quiet
```

### Clean Up Images from Container Registry:
```bash
# List images
gcloud container images list --repository=gcr.io/automation-interview-pre

# Delete specific image
gcloud container images delete gcr.io/automation-interview-pre/api-service:latest --quiet

# Delete all images for a service
gcloud container images list-tags gcr.io/automation-interview-pre/api-service \
  --format='get(digest)' | \
  xargs -I {} gcloud container images delete gcr.io/automation-interview-pre/api-service@{} --quiet
```

---

## 🌍 Multiple Environments

Cloud Run supports multiple environments through different strategies:

### Strategy 1: Separate Services (Recommended)

**Naming convention:**
```
service-name-environment
```

**Example:**
```bash
# Production
gcloud run deploy api-service-prod \
  --image gcr.io/automation-interview-pre/api-service:prod \
  --region us-central1

# Staging
gcloud run deploy api-service-staging \
  --image gcr.io/automation-interview-pre/api-service:staging \
  --region us-central1

# Development
gcloud run deploy api-service-dev \
  --image gcr.io/automation-interview-pre/api-service:dev \
  --region us-central1
```

**URLs:**
- `https://api-service-prod-xxx.run.app`
- `https://api-service-staging-xxx.run.app`
- `https://api-service-dev-xxx.run.app`

### Strategy 2: Traffic Splitting (Revisions)

**Deploy new version without switching traffic:**
```bash
# Deploy new revision without traffic
gcloud run deploy api-service \
  --image gcr.io/automation-interview-pre/api-service:v2 \
  --region us-central1 \
  --no-traffic

# Gradually shift traffic: 90% old, 10% new
gcloud run services update-traffic api-service \
  --region us-central1 \
  --to-revisions=api-service-00001=90,api-service-00002=10

# Full cutover to new version
gcloud run services update-traffic api-service \
  --region us-central1 \
  --to-latest
```

### Strategy 3: Different Regions

```bash
# US Production
gcloud run deploy api-service --region us-central1

# EU Production
gcloud run deploy api-service --region europe-west1

# Asia Production
gcloud run deploy api-service --region asia-east1
```

### Strategy 4: Different Projects

```
automation-interview-pre-prod   (Project 1)
automation-interview-pre-staging (Project 2)
automation-interview-pre-dev     (Project 3)
```

---

## 📊 Monitoring & Metrics

### Via UI:
1. Go to service → **METRICS** tab
2. See:
   - Request count
   - Request latency (P50, P95, P99)
   - Error rate
   - Container instance count
   - Memory utilization
   - CPU utilization

### Via CLI:

```bash
# Get current instance count
gcloud run services describe api-service \
  --region us-central1 \
  --format="value(status.traffic[0].latestRevision)"

# View all revisions
gcloud run revisions list \
  --service api-service \
  --region us-central1

# Check revision status
gcloud run revisions describe api-service-00007-wrj \
  --region us-central1
```

---

## 🔧 Updating Service Configuration

### Update Environment Variables:
```bash
gcloud run services update api-service \
  --region us-central1 \
  --update-env-vars "DATABASE_TYPE=postgres,DEBUG=true"
```

### Update Memory/CPU:
```bash
gcloud run services update api-service \
  --region us-central1 \
  --memory 1Gi \
  --cpu 2
```

### Update Scaling:
```bash
# Set min and max instances
gcloud run services update api-service \
  --region us-central1 \
  --min-instances 1 \
  --max-instances 100

# Scale to zero (default)
gcloud run services update api-service \
  --region us-central1 \
  --min-instances 0
```

### Update Timeout:
```bash
gcloud run services update api-service \
  --region us-central1 \
  --timeout 300  # 5 minutes
```

---

## 🎯 Quick Reference Commands

```bash
# View all services
gcloud run services list --region us-central1

# Describe specific service
gcloud run services describe api-service --region us-central1

# View logs
gcloud run services logs read api-service --region us-central1 --limit 50

# Update env vars
gcloud run services update api-service --region us-central1 --update-env-vars "KEY=VALUE"

# Delete service
gcloud run services delete api-service --region us-central1

# Check service URL
gcloud run services describe api-service --region us-central1 --format="value(status.url)"

# View current traffic split
gcloud run services describe api-service --region us-central1 --format="value(status.traffic)"
```

---

## 💰 Cost Management

### How Cloud Run Pricing Works:

**You pay for:**
1. **CPU time**: When processing requests
2. **Memory usage**: During request processing
3. **Requests**: $0.40 per million requests
4. **Container startup time**: Brief CPU/memory usage

**Free tier (per month):**
- 2 million requests
- 360,000 GB-seconds
- 180,000 vCPU-seconds

### Tips to Save Money:

1. **Scale to zero** when not in use:
   ```bash
   --min-instances 0
   ```

2. **Use appropriate memory**:
   ```bash
   --memory 256Mi  # Instead of 1Gi if you don't need it
   ```

3. **Set request timeout**:
   ```bash
   --timeout 60  # Don't wait forever for responses
   ```

4. **Delete unused services**:
   ```bash
   gcloud run services delete old-service --region us-central1
   ```

5. **Monitor costs**:
   - Cloud Console → Billing → Reports
   - Filter by Cloud Run

---

## 🔐 Security Best Practices

### 1. Use IAM for Authentication:
```bash
# Remove public access
gcloud run services update api-service \
  --region us-central1 \
  --no-allow-unauthenticated

# Allow specific user
gcloud run services add-iam-policy-binding api-service \
  --region us-central1 \
  --member="user:developer@example.com" \
  --role="roles/run.invoker"
```

### 2. Use Secret Manager:
```bash
# Create secret
echo -n "my-secret-value" | gcloud secrets create MY_SECRET --data-file=-

# Grant service access to secret
gcloud run services update api-service \
  --region us-central1 \
  --update-secrets="MY_SECRET=MY_SECRET:latest"
```

### 3. Use VPC Connector (for database access):
```bash
gcloud run services update api-service \
  --region us-central1 \
  --vpc-connector my-connector
```

---

## 🚨 Troubleshooting

### Service Won't Start:
```bash
# Check logs for errors
gcloud run services logs read api-service --region us-central1 --limit 100

# Check revision status
gcloud run revisions list --service api-service --region us-central1

# Describe latest revision
gcloud run revisions describe <revision-name> --region us-central1
```

### Common Issues:

**1. Port mismatch:**
- Cloud Run expects port `8080` or `$PORT` env var
- Fix: `await app.listen(port, '0.0.0.0')`

**2. Container timeout:**
- Default: 300s max
- Fix: `--timeout 3600` for longer requests

**3. Memory limit:**
- Default: 512Mi
- Fix: `--memory 1Gi` or higher

**4. Cold start slow:**
- Fix: `--min-instances 1` to keep one warm

---

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Pricing Calculator](https://cloud.google.com/products/calculator)
- [Best Practices](https://cloud.google.com/run/docs/best-practices)

---

## 🎓 Your Current Setup

**Services Running:**
- ✅ `auth-service` - 512Mi, scales 1-10
- ✅ `api-service` - 512Mi, scales 0-10
- ✅ `frontend` - 256Mi, scales 0-10

**Project:** `automation-interview-pre`
**Region:** `us-central1`

**To view your services now:**
```bash
gcloud run services list --region us-central1
```
